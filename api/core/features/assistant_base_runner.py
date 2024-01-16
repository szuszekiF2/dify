import logging
import json

from typing import Optional, List, Tuple
from datetime import datetime
from mimetypes import guess_extension

from core.app_runner.app_runner import AppRunner
from extensions.ext_database import db

from models.model import MessageAgentThought, Message, MessageFile
from models.tools import ToolConversationVariables

from core.tools.entities.tool_entities import ToolInvokeMessage, ToolInvokeMessageBinary, \
    ToolRuntimeVariablePool, ToolParamter
from core.tools.tool.tool import Tool
from core.tools.tool_manager import ToolManager
from core.tools.tool_file_manager import ToolFileManager
from core.tools.tool.dataset_retriever_tool import DatasetRetrieverTool
from core.agent.agent.agent_llm_callback import AgentLLMCallback
from core.app_runner.app_runner import AppRunner
from core.callback_handler.agent_loop_gather_callback_handler import AgentLoopGatherCallbackHandler
from core.callback_handler.index_tool_callback_handler import DatasetIndexToolCallbackHandler
from core.entities.application_entities import ModelConfigEntity, AgentEntity, AgentToolEntity
from core.application_queue_manager import ApplicationQueueManager
from core.memory.token_buffer_memory import TokenBufferMemory
from core.entities.application_entities import ModelConfigEntity, \
    AgentEntity, AppOrchestrationConfigEntity, ApplicationGenerateEntity, InvokeFrom
from core.model_runtime.entities.message_entities import PromptMessage, PromptMessageTool
from core.model_runtime.utils.encoders import jsonable_encoder

logger = logging.getLogger(__name__)

class BaseAssistantApplicationRunner(AppRunner):
    def __init__(self, tenant_id: str,
                 application_generate_entity: ApplicationGenerateEntity,
                 app_orchestration_config: AppOrchestrationConfigEntity,
                 model_config: ModelConfigEntity,
                 config: AgentEntity,
                 queue_manager: ApplicationQueueManager,
                 message: Message,
                 user_id: str,
                 agent_llm_callback: AgentLLMCallback,
                 callback: AgentLoopGatherCallbackHandler,
                 memory: Optional[TokenBufferMemory] = None,
                 prompt_messages: Optional[List[PromptMessage]] = None,
                 variables_pool: Optional[ToolRuntimeVariablePool] = None,
                 db_variables: Optional[ToolConversationVariables] = None,
                 ) -> None:
        """
        Agent runner
        :param tenant_id: tenant id
        :param app_orchestration_config: app orchestration config
        :param model_config: model config
        :param config: dataset config
        :param queue_manager: queue manager
        :param message: message
        :param user_id: user id
        :param agent_llm_callback: agent llm callback
        :param callback: callback
        :param memory: memory
        """
        self.tenant_id = tenant_id
        self.application_generate_entity = application_generate_entity
        self.app_orchestration_config = app_orchestration_config
        self.model_config = model_config
        self.config = config
        self.queue_manager = queue_manager
        self.message = message
        self.user_id = user_id
        self.agent_llm_callback = agent_llm_callback
        self.callback = callback
        self.memory = memory
        self.history_prompt_messages = prompt_messages
        self.variables_pool = variables_pool
        self.db_variables_pool = db_variables

        # init dataset tools
        hit_callback = DatasetIndexToolCallbackHandler(
            queue_manager=queue_manager,
            app_id=self.application_generate_entity.app_id,
            message_id=message.id,
            user_id=user_id,
            invoke_from=self.application_generate_entity.invoke_from,
        )
        self.dataset_tools = DatasetRetrieverTool.get_dataset_tools(
            tenant_id=tenant_id,
            dataset_ids=app_orchestration_config.dataset.dataset_ids if app_orchestration_config.dataset else [],
            retrieve_config=app_orchestration_config.dataset.retrieve_config if app_orchestration_config.dataset else None,
            return_resource=app_orchestration_config.show_retrieve_source,
            invoke_from=application_generate_entity.invoke_from,
            hit_callback=hit_callback
        )
        # get how many agent thoughts have been created
        self.agent_thought_count = db.session.query(MessageAgentThought).filter(
            MessageAgentThought.message_id == self.message.id,
        ).count()

    def _repacket_app_orchestration_config(self, app_orchestration_config: AppOrchestrationConfigEntity) -> AppOrchestrationConfigEntity:
        """
        Repacket app orchestration config
        """
        if app_orchestration_config.prompt_template.simple_prompt_template is None:
            app_orchestration_config.prompt_template.simple_prompt_template = ''

        return app_orchestration_config

    def _convert_tool_response_to_str(self, tool_response: List[ToolInvokeMessage]) -> str:
        """
        Handle tool response
        """
        result = ''
        for response in tool_response:
            if response.type == ToolInvokeMessage.MessageType.TEXT:
                result += response.message
            elif response.type == ToolInvokeMessage.MessageType.LINK:
                result += f"result link: {response.message}."
            elif response.type == ToolInvokeMessage.MessageType.IMAGE_LINK or \
                 response.type == ToolInvokeMessage.MessageType.IMAGE:
                result += f"image has been created and sent to user already, you should tell user to check it now."
            else:
                result += f"tool response: {response.message}."

        return result
    
    def _convert_tool_to_prompt_message_tool(self, tool: AgentToolEntity) -> Tuple[PromptMessageTool, Tool]:
        """
            convert tool to prompt message tool
        """
        tool_entity = ToolManager.get_tool_runtime(
            provider_type=tool.provider_type, provider_name=tool.provider_id, tool_name=tool.tool_name, 
            tanent_id=self.application_generate_entity.tenant_id
        )
        tool_entity.load_variables(self.variables_pool)

        message_tool = PromptMessageTool(
            name=tool.tool_name,
            description=tool_entity.description.llm,
            parameters={
                "type": "object",
                "properties": {},
                "required": [],
            }
        )

        runtime_parameters = {}

        for parameter in tool_entity.parameters:
            parameter_type = 'string'
            enum = []
            if parameter.type == ToolParamter.ToolParameterType.STRING:
                parameter_type = 'string'
            elif parameter.type == ToolParamter.ToolParameterType.BOOLEAN:
                parameter_type = 'boolean'
            elif parameter.type == ToolParamter.ToolParameterType.NUMBER:
                parameter_type = 'number'
            elif parameter.type == ToolParamter.ToolParameterType.SELECT:
                for option in parameter.options:
                    enum.append(option.value)
                parameter_type = 'string'
            else:
                raise ValueError(f"parameter type {parameter.type} is not supported")
            
            if parameter.form == ToolParamter.ToolParameterForm.FORM:
                # get tool parameter from form
                tool_parameter_config = tool.tool_parameters.get(parameter.name)
                if not tool_parameter_config:
                    # get default value
                    tool_parameter_config = parameter.default
                    if not tool_parameter_config:
                        raise ValueError(f"tool parameter {parameter.name} not found in tool config")
                    
                if parameter.type == ToolParamter.ToolParameterType.SELECT:
                    # check if tool_parameter_config in options
                    options = list(map(lambda x: x.value, parameter.options))
                    if tool_parameter_config not in options:
                        raise ValueError(f"tool parameter {parameter.name} value {tool_parameter_config} not in options {options}")
                    
                # convert tool parameter config to correct type
                try:
                    if parameter.type == ToolParamter.ToolParameterType.NUMBER:
                        # check if tool parameter is integer
                        if isinstance(tool_parameter_config, int):
                            tool_parameter_config = tool_parameter_config
                        elif isinstance(tool_parameter_config, float):
                            tool_parameter_config = tool_parameter_config
                        elif isinstance(tool_parameter_config, str):
                            if '.' in tool_parameter_config:
                                tool_parameter_config = float(tool_parameter_config)
                            else:
                                tool_parameter_config = int(tool_parameter_config)
                    elif parameter.type == ToolParamter.ToolParameterType.BOOLEAN:
                        tool_parameter_config = bool(tool_parameter_config)
                    elif parameter.type not in [ToolParamter.ToolParameterType.SELECT, ToolParamter.ToolParameterType.STRING]:
                        tool_parameter_config = str(tool_parameter_config)
                    elif parameter.type == ToolParamter.ToolParameterType:
                        tool_parameter_config = str(tool_parameter_config)
                except Exception as e:
                    raise ValueError(f"tool parameter {parameter.name} value {tool_parameter_config} is not correct type")
                
                # save tool parameter to tool entity memory
                runtime_parameters[parameter.name] = tool_parameter_config
            
            elif parameter.form == ToolParamter.ToolParameterForm.LLM:
                message_tool.parameters['properties'][parameter.name] = {
                    "type": parameter_type,
                    "description": parameter.llm_description or '',
                }

                if len(enum) > 0:
                    message_tool.parameters['properties'][parameter.name]['enum'] = enum

                if parameter.required:
                    message_tool.parameters['required'].append(parameter.name)

        tool_entity.runtime.runtime_parameters.update(runtime_parameters)

        return message_tool, tool_entity
    
    def _convert_dataset_retriever_tool_to_prompt_message_tool(self, tool: DatasetRetrieverTool) -> PromptMessageTool:
        """
        convert dataset retriever tool to prompt message tool
        """
        prompt_tool = PromptMessageTool(
            name=tool.identity.name,
            description=tool.description.llm,
            parameters={
                "type": "object",
                "properties": {},
                "required": [],
            }
        )

        for parameter in tool.get_runtime_parameters():
            parameter_type = 'string'
        
            prompt_tool.parameters['properties'][parameter.name] = {
                "type": parameter_type,
                "description": parameter.llm_description or '',
            }

            if parameter.required:
                if parameter.name not in prompt_tool.parameters['required']:
                    prompt_tool.parameters['required'].append(parameter.name)

        return prompt_tool
    
    def update_prompt_message_tool(self, tool: Tool, prompt_tool: PromptMessageTool) -> PromptMessageTool:
        """
        update prompt message tool
        """
        # try to get tool runtime parameters
        tool_runtime_parameters = tool.get_runtime_parameters()

        for parameter in tool_runtime_parameters:
            parameter_type = 'string'
            enum = []
            if parameter.type == ToolParamter.ToolParameterType.STRING:
                parameter_type = 'string'
            elif parameter.type == ToolParamter.ToolParameterType.BOOLEAN:
                parameter_type = 'boolean'
            elif parameter.type == ToolParamter.ToolParameterType.NUMBER:
                parameter_type = 'number'
            elif parameter.type == ToolParamter.ToolParameterType.SELECT:
                for option in parameter.options:
                    enum.append(option.value)
                parameter_type = 'string'
            else:
                raise ValueError(f"parameter type {parameter.type} is not supported")
        
            if parameter.form == ToolParamter.ToolParameterForm.LLM:
                prompt_tool.parameters['properties'][parameter.name] = {
                    "type": parameter_type,
                    "description": parameter.llm_description or '',
                }

                if len(enum) > 0:
                    prompt_tool.parameters['properties'][parameter.name]['enum'] = enum

                if parameter.required:
                    if parameter.name not in prompt_tool.parameters['required']:
                        prompt_tool.parameters['required'].append(parameter.name)

        return prompt_tool
    
    def extract_tool_response_binary(self, tool_response: List[ToolInvokeMessage]) -> List[ToolInvokeMessageBinary]:
        """
        Extract tool response binary
        """
        result = []

        for response in tool_response:
            if response.type == ToolInvokeMessage.MessageType.IMAGE_LINK or \
                response.type == ToolInvokeMessage.MessageType.IMAGE:
                result.append(ToolInvokeMessageBinary(
                    mimetype=response.meta.get('mime_type', 'octet/stream'),
                    url=response.message,
                    save_as_variable=response.save_as_variable,
                ))
            elif response.type == ToolInvokeMessage.MessageType.BLOB:
                result.append(ToolInvokeMessageBinary(
                    mimetype=response.meta.get('mime_type', 'octet/stream'),
                    url=response.message,
                    save_as_variable=response.save_as_variable,
                ))
            elif response.type == ToolInvokeMessage.MessageType.LINK:
                # check if there is a mime type in meta
                if 'mime_type' in response.meta:
                    result.append(ToolInvokeMessageBinary(
                        mimetype=response.meta.get('mime_type', 'octet/stream'),
                        url=response.message,
                        save_as_variable=response.save_as_variable,
                    ))
        return result
    
    def create_message_files(self, messages: List[ToolInvokeMessageBinary]) -> List[Tuple[MessageFile, bool]]:
        """
        Create message file

        :param messages: messages
        :return: message files, should save as variable
        """
        result = []

        for message in messages:
            file_type = 'bin'
            if 'image' in message.mimetype:
                file_type = 'image'
            elif 'video' in message.mimetype:
                file_type = 'video'
            elif 'audio' in message.mimetype:
                file_type = 'audio'
            elif 'text' in message.mimetype:
                file_type = 'text'
            elif 'pdf' in message.mimetype:
                file_type = 'pdf'
            elif 'zip' in message.mimetype:
                file_type = 'archive'
            # ...

            invoke_from = self.application_generate_entity.invoke_from

            message_file = MessageFile(
                message_id=self.message.id,
                type=file_type,
                transfer_method='remote_file',
                belongs_to='assistant',
                url=message.url,
                upload_file_id=None,
                created_by_role=('account'if invoke_from in [InvokeFrom.EXPLORE, InvokeFrom.DEBUGGER] else 'end_user'),
                created_by=self.user_id,
            )
            db.session.add(message_file)
            result.append((
                message_file,
                message.save_as_variable
            ))
            
        db.session.commit()

        return result
        
    def create_agent_thought(self, message_id: str, message: str, 
                             tool_name: str, tool_input: str,
                             ) -> MessageAgentThought:
        """
        Create agent thought
        """
        thought = MessageAgentThought(
            message_id=message_id,
            message_chain_id=None,
            thought='',
            tool=tool_name,
            tool_input=tool_input,
            message=message,
            message_token=0,
            message_unit_price=0,
            message_price_unit=0,
            answer='',
            observation='',
            answer_token=0,
            answer_unit_price=0,
            answer_price_unit=0,
            tokens=0,
            total_price=0,
            position=self.agent_thought_count + 1,
            currency='USD',
            latency=0,
            created_by_role='account',
            created_by=self.user_id,
        )

        db.session.add(thought)
        db.session.commit()

        self.agent_thought_count += 1

        return thought

    def save_agent_thought(self, agent_thought: MessageAgentThought, thought: str, observation: str, answer: str) -> MessageAgentThought:
        """
        Save agent thought
        """
        if thought is not None:
            agent_thought.thought = thought

        if observation is not None:
            agent_thought.observation = observation

        if answer is not None:
            agent_thought.answer = answer

        db.session.commit()

    def get_history_prompt_messages(self) -> List[PromptMessage]:
        """
        Get history prompt messages
        """
        if self.history_prompt_messages is None:
            self.history_prompt_messages = db.session.query(PromptMessage).filter(
                PromptMessage.message_id == self.message.id,
            ).order_by(PromptMessage.position.asc()).all()

        return self.history_prompt_messages
    
    def transform_tool_invoke_messages(self, messages: List[ToolInvokeMessage]) -> List[ToolInvokeMessage]:
        """
        Transform tool message into agent thought
        """
        result = []

        for message in messages:
            if message.type == ToolInvokeMessage.MessageType.TEXT:
                result.append(message)
            elif message.type == ToolInvokeMessage.MessageType.LINK:
                result.append(message)
            elif message.type == ToolInvokeMessage.MessageType.IMAGE:
                # try to download image
                try:
                    file = ToolFileManager.create_file_by_url(user_id=self.user_id, tenant_id=self.tenant_id,
                                                               conversation_id=self.message.conversation_id,
                                                               file_url=message.message)
                    
                    url = f'/files/tools/{file.id}{guess_extension(file.mimetype) or ".png"}'

                    result.append(ToolInvokeMessage(
                        type=ToolInvokeMessage.MessageType.IMAGE_LINK,
                        message=url,
                        save_as_variable=message.save_as_variable,
                        meta=message.meta.copy() if message.meta is not None else {},
                    ))
                except Exception as e:
                    logger.exception(e)
                    result.append(ToolInvokeMessage(
                        type=ToolInvokeMessage.MessageType.TEXT,
                        message=f"Failed to download image: {message.message}, you can try to download it yourself.",
                        meta=message.meta.copy() if message.meta is not None else {},
                        save_as_variable=message.save_as_variable,
                    ))
            elif message.type == ToolInvokeMessage.MessageType.BLOB:
                # get mime type and save blob to storage
                mimetype = message.meta.get('mime_type', 'octet/stream')
                file = ToolFileManager.create_file_by_raw(user_id=self.user_id, tenant_id=self.tenant_id,
                                                            conversation_id=self.message.conversation_id,
                                                            file_binary=message.message,
                                                            mimetype=mimetype)
                                                            
                url = f'/files/tools/{file.id}{guess_extension(file.mimetype) or ".bin"}'

                # check if file is image
                if 'image' in mimetype:
                    result.append(ToolInvokeMessage(
                        type=ToolInvokeMessage.MessageType.IMAGE_LINK,
                        message=url,
                        save_as_variable=message.save_as_variable,
                        meta=message.meta.copy() if message.meta is not None else {},
                    ))
                else:
                    result.append(ToolInvokeMessage(
                        type=ToolInvokeMessage.MessageType.LINK,
                        message=url,
                        save_as_variable=message.save_as_variable,
                        meta=message.meta.copy() if message.meta is not None else {},
                    ))
            else:
                result.append(message)

        return result
    
    def update_db_variables(self, tool_variables: ToolRuntimeVariablePool, db_variables: ToolConversationVariables):
        """
        convert tool variables to db variables
        """
        db_variables.updated_at = datetime.utcnow()
        db_variables.variables_str = json.dumps(jsonable_encoder(tool_variables.pool))
        db.session.commit()