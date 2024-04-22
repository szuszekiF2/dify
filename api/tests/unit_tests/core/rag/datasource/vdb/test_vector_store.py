from core.rag.models.document import Document


def get_sample_text() -> str:
    return 'test_text'


def get_sample_embedding() -> list[float]:
    return [1.1, 2.2, 3.3]


def get_sample_query_vector() -> list[float]:
    return get_sample_embedding()


def get_sample_document(sample_dataset_id: str) -> Document:
    doc = Document(
        page_content=get_sample_text(),
        metadata={
            "doc_id": sample_dataset_id,
            "doc_hash": sample_dataset_id,
            "document_id": sample_dataset_id,
            "dataset_id": sample_dataset_id,
        }
    )
    return doc
