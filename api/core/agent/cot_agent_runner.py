from abc import abstractmethod
import json
import re
from collections.abc import Generator
from typing import Literal, Union

from core.agent.base_agent_runner import BaseAgentRunner
from core.agent.entities import AgentPromptEntity, AgentScratchpadUnit
from core.app.apps.base_app_queue_manager import PublishFrom
from core.app.entities.queue_entities import QueueAgentThoughtEvent, QueueMessageEndEvent, QueueMessageFileEvent
from core.model_runtime.entities.llm_entities import LLMResult, LLMResultChunk, LLMResultChunkDelta, LLMUsage
from core.model_runtime.entities.message_entities import (
    AssistantPromptMessage,
    PromptMessage,
    PromptMessageTool,
    ToolPromptMessage,
)
from core.tools.entities.tool_entities import ToolInvokeMeta
from core.tools.tool.tool import Tool
from core.tools.tool_engine import ToolEngine
from models.model import Message


class CotAgentRunner(BaseAgentRunner):
    _is_first_iteration = True
    _ignore_observation_providers = ['wenxin']
    _historic_prompt_messages: list[PromptMessage] = []

    def run(self, message: Message,
        query: str,
        inputs: dict[str, str],
    ) -> Union[Generator, LLMResult]:
        """
        Run Cot agent application
        """
        app_generate_entity = self.application_generate_entity
        self._repack_app_generate_entity(app_generate_entity)

        agent_scratchpad: list[AgentScratchpadUnit] = []
        self._init_agent_scratchpad(agent_scratchpad, self.history_prompt_messages)

        # check model mode
        if 'Observation' not in app_generate_entity.model_config.stop:
            if app_generate_entity.model_config.provider not in self._ignore_observation_providers:
                app_generate_entity.model_config.stop.append('Observation')

        app_config = self.app_config

        # override inputs
        inputs = inputs or {}
        instruction = app_config.prompt_template.simple_prompt_template
        instruction = self._fill_in_inputs_from_external_data_tools(instruction, inputs)

        iteration_step = 1
        max_iteration_steps = min(app_config.agent.max_iteration, 5) + 1

        prompt_messages = self.history_prompt_messages

        # convert tools into ModelRuntime Tool format
        prompt_messages_tools: list[PromptMessageTool] = []
        tool_instances = {}
        for tool in app_config.agent.tools if app_config.agent else []:
            try:
                prompt_tool, tool_entity = self._convert_tool_to_prompt_message_tool(tool)
            except Exception:
                # api tool may be deleted
                continue
            # save tool entity
            tool_instances[tool.tool_name] = tool_entity
            # save prompt tool
            prompt_messages_tools.append(prompt_tool)

        # convert dataset tools into ModelRuntime Tool format
        for dataset_tool in self.dataset_tools:
            prompt_tool = self._convert_dataset_retriever_tool_to_prompt_message_tool(dataset_tool)
            # save prompt tool
            prompt_messages_tools.append(prompt_tool)
            # save tool entity
            tool_instances[dataset_tool.identity.name] = dataset_tool

        function_call_state = True
        llm_usage = {
            'usage': None
        }
        final_answer = ''

        def increase_usage(final_llm_usage_dict: dict[str, LLMUsage], usage: LLMUsage):
            if not final_llm_usage_dict['usage']:
                final_llm_usage_dict['usage'] = usage
            else:
                llm_usage = final_llm_usage_dict['usage']
                llm_usage.prompt_tokens += usage.prompt_tokens
                llm_usage.completion_tokens += usage.completion_tokens
                llm_usage.prompt_price += usage.prompt_price
                llm_usage.completion_price += usage.completion_price

        model_instance = self.model_instance

        while function_call_state and iteration_step <= max_iteration_steps:
            # continue to run until there is not any tool call
            function_call_state = False

            if iteration_step == max_iteration_steps:
                # the last iteration, remove all tools
                prompt_messages_tools = []

            message_file_ids = []

            agent_thought = self.create_agent_thought(
                message_id=message.id,
                message='',
                tool_name='',
                tool_input='',
                messages_ids=message_file_ids
            )

            if iteration_step > 1:
                self.queue_manager.publish(QueueAgentThoughtEvent(
                    agent_thought_id=agent_thought.id
                ), PublishFrom.APPLICATION_MANAGER)

            # update prompt messages
            prompt_messages = self._organize_cot_prompt_messages(
                mode=app_generate_entity.model_config.mode,
                prompt_messages=prompt_messages,
                tools=prompt_messages_tools,
                agent_scratchpad=agent_scratchpad,
                agent_prompt_message=app_config.agent.prompt,
                instruction=instruction,
                input=query
            )

            # recalc llm max tokens
            self.recalc_llm_max_tokens(self.model_config, prompt_messages)

            # invoke model
            chunks: Generator[LLMResultChunk, None, None] = model_instance.invoke_llm(
                prompt_messages=prompt_messages,
                model_parameters=app_generate_entity.model_config.parameters,
                tools=[],
                stop=app_generate_entity.model_config.stop,
                stream=True,
                user=self.user_id,
                callbacks=[],
            )

            # check llm result
            if not chunks:
                raise ValueError("failed to invoke llm")
            
            usage_dict = {}
            react_chunks = self._handle_stream_react(chunks, usage_dict)
            scratchpad = AgentScratchpadUnit(
                agent_response='',
                thought='',
                action_str='',
                observation='',
                action=None,
            )

            # publish agent thought if it's first iteration
            if iteration_step == 1:
                self.queue_manager.publish(QueueAgentThoughtEvent(
                    agent_thought_id=agent_thought.id
                ), PublishFrom.APPLICATION_MANAGER)

            for chunk in react_chunks:
                if isinstance(chunk, AgentScratchpadUnit.Action):
                    action = chunk
                    # detect action
                    scratchpad.agent_response += json.dumps(chunk.dict())
                    scratchpad.action_str = json.dumps(chunk.dict())
                    scratchpad.action = action
                else:
                    scratchpad.agent_response += chunk
                    scratchpad.thought += chunk
                    yield LLMResultChunk(
                        model=self.model_config.model,
                        prompt_messages=prompt_messages,
                        system_fingerprint='',
                        delta=LLMResultChunkDelta(
                            index=0,
                            message=AssistantPromptMessage(
                                content=chunk
                            ),
                            usage=None
                        )
                    )

            scratchpad.thought = scratchpad.thought.strip() or 'I am thinking about how to help you'
            agent_scratchpad.append(scratchpad)
            
            # get llm usage
            if 'usage' in usage_dict:
                increase_usage(llm_usage, usage_dict['usage'])
            else:
                usage_dict['usage'] = LLMUsage.empty_usage()
            
            self.save_agent_thought(
                agent_thought=agent_thought,
                tool_name=scratchpad.action.action_name if scratchpad.action else '',
                tool_input={
                    scratchpad.action.action_name: scratchpad.action.action_input
                } if scratchpad.action else {},
                tool_invoke_meta={},
                thought=scratchpad.thought,
                observation={},
                answer=scratchpad.agent_response,
                messages_ids=[],
                llm_usage=usage_dict['usage']
            )
            
            if not scratchpad.is_final():
                self.queue_manager.publish(QueueAgentThoughtEvent(
                    agent_thought_id=agent_thought.id
                ), PublishFrom.APPLICATION_MANAGER)

            if not scratchpad.action:
                # failed to extract action, return final answer directly
                final_answer = scratchpad.agent_response or ''
            else:
                if scratchpad.action.action_name.lower() == "final answer":
                    # action is final answer, return final answer directly
                    try:
                        final_answer = json.dumps(scratchpad.action.action_input)
                    except json.JSONDecodeError:
                        final_answer = f'{scratchpad.action.action_input}'
                else:
                    function_call_state = True
                    # action is tool call, invoke tool
                    tool_invoke_response, tool_invoke_meta = self._handle_invoke_action(
                        action=scratchpad.action, 
                        tool_instances=tool_instances
                    )
                    scratchpad.observation = tool_invoke_response
                    scratchpad.agent_response = tool_invoke_response

                    self.save_agent_thought(
                        agent_thought=agent_thought,
                        tool_name=scratchpad.action.action_name,
                        tool_input={scratchpad.action.action_name: scratchpad.action.action_input},
                        thought=scratchpad.thought,
                        observation={scratchpad.action.action_name: tool_invoke_response},
                        tool_invoke_meta=tool_invoke_meta.to_dict(),
                        answer=scratchpad.agent_response,
                        messages_ids=message_file_ids,
                        llm_usage=usage_dict['usage']
                    )

                    self.queue_manager.publish(QueueAgentThoughtEvent(
                        agent_thought_id=agent_thought.id
                    ), PublishFrom.APPLICATION_MANAGER)

                # update prompt tool message
                for prompt_tool in prompt_messages_tools:
                    self.update_prompt_message_tool(tool_instances[prompt_tool.name], prompt_tool)

            iteration_step += 1

        yield LLMResultChunk(
            model=model_instance.model,
            prompt_messages=prompt_messages,
            delta=LLMResultChunkDelta(
                index=0,
                message=AssistantPromptMessage(
                    content=final_answer
                ),
                usage=llm_usage['usage']
            ),
            system_fingerprint=''
        )

        # save agent thought
        self.save_agent_thought(
            agent_thought=agent_thought, 
            tool_name='',
            tool_input={},
            tool_invoke_meta={},
            thought=final_answer,
            observation={}, 
            answer=final_answer,
            messages_ids=[]
        )

        self.update_db_variables(self.variables_pool, self.db_variables_pool)
        # publish end event
        self.queue_manager.publish(QueueMessageEndEvent(llm_result=LLMResult(
            model=model_instance.model,
            prompt_messages=prompt_messages,
            message=AssistantPromptMessage(
                content=final_answer
            ),
            usage=llm_usage['usage'] if llm_usage['usage'] else LLMUsage.empty_usage(),
            system_fingerprint=''
        )), PublishFrom.APPLICATION_MANAGER)

    def _handle_invoke_action(self, action: AgentScratchpadUnit.Action, 
                              tool_instances: dict[str, Tool]) -> tuple[str, ToolInvokeMeta]:
        """
        handle invoke action
        :param action: action
        :param tool_instances: tool instances
        :return: observation, meta
        """
        # action is tool call, invoke tool
        tool_call_name = action.action_name
        tool_call_args = action.action_input
        tool_instance = tool_instances.get(tool_call_name)

        if not tool_instance:
            answer = f"there is not a tool named {tool_call_name}"
            return answer, ToolInvokeMeta.error_instance(answer)
        
        if isinstance(tool_call_args, str):
            try:
                tool_call_args = json.loads(tool_call_args)
            except json.JSONDecodeError:
                pass

        # invoke tool
        tool_invoke_response, message_files, tool_invoke_meta = ToolEngine.agent_invoke(
            tool=tool_instance,
            tool_parameters=tool_call_args,
            user_id=self.user_id,
            tenant_id=self.tenant_id,
            message=self.message,
            invoke_from=self.application_generate_entity.invoke_from,
            agent_tool_callback=self.agent_callback
        )

        # publish files
        for message_file, save_as in message_files:
            if save_as:
                self.variables_pool.set_file(tool_name=tool_call_name, value=message_file.id, name=save_as)

            # publish message file
            self.queue_manager.publish(QueueMessageFileEvent(
                message_file_id=message_file.id
            ), PublishFrom.APPLICATION_MANAGER)
            # add message file ids
            message_file_ids.append(message_file.id)

        # publish files
        for message_file, save_as in message_files:
            if save_as:
                self.variables_pool.set_file(
                    tool_name=tool_call_name,
                    value=message_file.id,
                    name=save_as
                )
            self.queue_manager.publish(QueueMessageFileEvent(
                message_file_id=message_file.id
            ), PublishFrom.APPLICATION_MANAGER)

        message_file_ids = [message_file.id for message_file, _ in message_files]

        return tool_invoke_response, tool_invoke_meta

    def _handle_stream_react(self, llm_response: Generator[LLMResultChunk, None, None], usage: dict) \
        -> Generator[Union[str, AgentScratchpadUnit.Action], None, None]:
        def parse_action(json_str):
            try:
                action = json.loads(json_str)
                if 'action' in action and 'action_input' in action:
                    return AgentScratchpadUnit.Action(
                        action_name=action['action'],
                        action_input=action['action_input'],
                    )
            except:
                return json_str
            
        def extra_json_from_code_block(code_block) -> Generator[Union[dict, str], None, None]:
            code_blocks = re.findall(r'```(.*?)```', code_block, re.DOTALL)
            if not code_blocks:
                return
            for block in code_blocks:
                json_text = re.sub(r'^[a-zA-Z]+\n', '', block.strip(), flags=re.MULTILINE)
                yield parse_action(json_text)
            
        code_block_cache = ''
        code_block_delimiter_count = 0
        in_code_block = False
        json_cache = ''
        json_quote_count = 0
        in_json = False
        got_json = False
    
        for response in llm_response:
            response = response.delta.message.content
            if not isinstance(response, str):
                continue

            # stream
            index = 0
            while index < len(response):
                steps = 1
                delta = response[index:index+steps]
                if delta == '`':
                    code_block_cache += delta
                    code_block_delimiter_count += 1
                else:
                    if not in_code_block:
                        if code_block_delimiter_count > 0:
                            yield code_block_cache
                        code_block_cache = ''
                    else:
                        code_block_cache += delta
                    code_block_delimiter_count = 0

                if code_block_delimiter_count == 3:
                    if in_code_block:
                        yield from extra_json_from_code_block(code_block_cache)
                        code_block_cache = ''
                        
                    in_code_block = not in_code_block
                    code_block_delimiter_count = 0

                if not in_code_block:
                    # handle single json
                    if delta == '{':
                        json_quote_count += 1
                        in_json = True
                        json_cache += delta
                    elif delta == '}':
                        json_cache += delta
                        if json_quote_count > 0:
                            json_quote_count -= 1
                            if json_quote_count == 0:
                                in_json = False
                                got_json = True
                                index += steps
                                continue
                    else:
                        if in_json:
                            json_cache += delta

                    if got_json:
                        got_json = False
                        yield parse_action(json_cache)
                        json_cache = ''
                        json_quote_count = 0
                        in_json = False
                    
                if not in_code_block and not in_json:
                    yield delta.replace('`', '')

                index += steps

        if code_block_cache:
            yield code_block_cache

        if json_cache:
            yield parse_action(json_cache)

    def _convert_dict_to_action(self, action: dict) -> AgentScratchpadUnit.Action:
        """
        convert dict to action
        """
        return AgentScratchpadUnit.Action(
            action_name=action['action'],
            action_input=action['action_input']
        )

    def _fill_in_inputs_from_external_data_tools(self, instruction: str, inputs: dict) -> str:
        """
        fill in inputs from external data tools
        """
        for key, value in inputs.items():
            try:
                instruction = instruction.replace(f'{{{{{key}}}}}', str(value))
            except Exception as e:
                continue

        return instruction
    
    def _init_agent_scratchpad(self, 
                               agent_scratchpad: list[AgentScratchpadUnit],
                               messages: list[PromptMessage]
                               ) -> list[AgentScratchpadUnit]:
        """
        init agent scratchpad
        """
        current_scratchpad: AgentScratchpadUnit = None
        for message in messages:
            if isinstance(message, AssistantPromptMessage):
                current_scratchpad = AgentScratchpadUnit(
                    agent_response=message.content,
                    thought=message.content or 'I am thinking about how to help you',
                    action_str='',
                    action=None,
                    observation=None,
                )
                if message.tool_calls:
                    try:
                        current_scratchpad.action = AgentScratchpadUnit.Action(
                            action_name=message.tool_calls[0].function.name,
                            action_input=json.loads(message.tool_calls[0].function.arguments)
                        )
                    except:
                        pass
                    
                agent_scratchpad.append(current_scratchpad)
            elif isinstance(message, ToolPromptMessage):
                if current_scratchpad:
                    current_scratchpad.observation = message.content
        
        return agent_scratchpad
    
    @abstractmethod
    def _format_instructions(self, instruction: str, tools: list[PromptMessageTool],
                                prompt_template: AgentPromptEntity
        ) -> str:
        pass
    
    @abstractmethod
    def _format_scratchpads(self, scratchpad: list[AgentScratchpadUnit],
        ) -> str:
        """
            format scratchpads
        """
        pass
    
    @abstractmethod
    def _organize_historic_prompt_messages(self, mode: Literal["completion", "chat"],
                                           prompt_messages: list[PromptMessage],
                                           tools: list[PromptMessageTool],
                                           agent_prompt_message: AgentPromptEntity,
                                           instruction: str,
        ) -> list[PromptMessage]:
        """
            organize historic prompt messages
        """
        pass

    @abstractmethod
    def _organize_current_prompt_messages(self, mode: Literal["completion", "chat"],
                                      prompt_messages: list[PromptMessage],
                                      tools: list[PromptMessageTool], 
                                      agent_prompt_message: AgentPromptEntity,
                                      instruction: str,
                                      input: str,
        ) -> list[PromptMessage]:
        """
            organize current prompt messages
        """
        pass