import logging
from typing import Any

from huggingface_hub import InferenceClient

from core.model_runtime.model_providers.__base.model_provider import ModelProvider

logger = logging.getLogger(__name__)


class HuggingfaceHubProvider(ModelProvider):

    def validate_provider_credentials(self, credentials: dict) -> None:
        pass

    @staticmethod
    def get_client(credentials: dict = None, **kwargs: Any) -> InferenceClient:
        client = InferenceClient(
            token=credentials['huggingfacehub_api_token'],
        )
        return client
