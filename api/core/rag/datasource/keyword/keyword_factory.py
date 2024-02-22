from typing import Any, cast

from flask import current_app

from core.rag.datasource.keyword.jieba.jieba import Jieba
from core.rag.datasource.keyword.keyword_base import BaseKeyword
from core.rag.models.document import Document
from models.dataset import Dataset


class Keyword:
    def __init__(self, dataset: Dataset):
        self._dataset = dataset
        self._keyword_processor = self._init_keyword()

    def _init_keyword(self) -> BaseKeyword:
        config = cast(dict, current_app.config)
        keyword_type = config.get('KEYWORD_STORE')

        if not keyword_type:
            raise ValueError("Keyword store must be specified.")

        if keyword_type == "jieba":
            return Jieba(
                dataset=self._dataset
            )
        else:
            raise ValueError(f"Vector store {config.get('VECTOR_STORE')} is not supported.")

    def create(self, texts: list[Document], **kwargs):
        self._keyword_processor.create(texts, **kwargs)

    def add_texts(self, texts: list[Document], **kwargs):
        self._keyword_processor.add_texts(texts, **kwargs)

    def text_exists(self, id: str) -> bool:
        return self._keyword_processor.text_exists(id)

    def delete_by_ids(self, ids: list[str]) -> None:
        self._keyword_processor.delete_by_ids(ids)

    def delete_by_document_id(self, document_id: str) -> None:
        self._keyword_processor.delete_by_document_id(document_id)

    def delete(self) -> None:
        self._keyword_processor.delete()

    def search(
            self, query: str,
            **kwargs: Any
    ) -> list[Document]:
        return self._keyword_processor.search(query, **kwargs)

    def __getattr__(self, name):
        if self._keyword_processor is not None:
            method = getattr(self._keyword_processor, name)
            if callable(method):
                return method

        raise AttributeError(f"'Keyword' object has no attribute '{name}'")
