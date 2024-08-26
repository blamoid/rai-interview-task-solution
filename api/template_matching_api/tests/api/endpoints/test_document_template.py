import json
from datetime import datetime

import pytest
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from template_matching_api.api_models.document_template import (
    DocumentTemplateOut,
    DocumentTemplateUpdate,
)
from template_matching_api.db_model import DocumentTemplate
from template_matching_api.tests.storage import InMemoryTemplateStorage


@pytest.fixture
def with_document_templates(session: Session) -> list[DocumentTemplate]:
    templates = []
    for idx in range(3):
        template = DocumentTemplate(
            name=f"dt_{idx}",
            template_filename=f"dt{idx}.jpg",
            template_file_type="image/jpeg",
            uploaded_at=datetime.now(),
        )
        templates.append(template)
    session.add_all(templates)
    session.commit()
    return templates


def test_list_document_templates(
    with_document_templates: list[DocumentTemplate], client: TestClient
) -> None:
    resp = client.get("/api/document-template/")
    assert resp.status_code == 200

    resp_json = resp.json()
    assert len(resp_json) == len(with_document_templates)
    assert resp_json == [
        DocumentTemplateOut.model_validate(template).model_dump(mode="json")
        for template in with_document_templates
    ]


def test_get_document_template(
    with_document_templates: list[DocumentTemplate], client: TestClient
) -> None:
    for template in with_document_templates:
        resp = client.get(f"/api/document-template/{template.id}")
        assert resp.status_code == 200

        assert resp.json() == DocumentTemplateOut.model_validate(template).model_dump(
            mode="json"
        )


def test_create_document_template(client: TestClient) -> None:
    filename = "testFile.jpg"
    file_bytes = b"abcdef"
    file_data = (filename, file_bytes, "image/jpeg")
    data = {"json_body": json.dumps({"name": "test_template"})}

    resp = client.post(
        "/api/document-template/",
        data=data,
        files={"file": file_data},
    )
    assert resp.status_code == 201
    resp_body = resp.json()
    assert resp_body is not None
    document_template_id = resp_body["id"]
    assert document_template_id is not None
    assert resp_body["template_filename"] == filename

    storage = InMemoryTemplateStorage()
    loaded_bytes = storage.load(document_template_id)
    assert loaded_bytes == file_bytes


def test_update_document_template(
    with_document_templates: list[DocumentTemplate],
    session: "Session",
    client: TestClient,
) -> None:
    for template in with_document_templates:
        name_updated = template.name + "-updated"
        update_data = DocumentTemplateUpdate(name=name_updated)

        resp = client.put(
            f"/api/document-template/{template.id}",
            json=update_data.model_dump(mode="json"),
        )
        assert resp.status_code == 204
        session.refresh(template)
        assert template.name == name_updated


def test_upload_document_template(
    with_document_templates: list[DocumentTemplate],
    session: "Session",
    client: TestClient,
) -> None:
    filename = "newFile.jpg"
    file_bytes = b"fedcba"
    file_data = (filename, file_bytes, "image/jpeg")
    storage = InMemoryTemplateStorage()
    for template in with_document_templates:
        resp = client.post(
            f"/api/document-template/{template.id}/upload",
            files={"file": file_data},
        )
        assert resp.status_code == 204
        session.refresh(template)
        assert template.template_filename == filename

        loaded_bytes = storage.load(template.id)
        assert loaded_bytes == file_bytes


def test_download_document_template(
    with_document_templates: list[DocumentTemplate],
    session: "Session",
    client: TestClient,
) -> None:
    file_bytes = b"fedcba"
    storage = InMemoryTemplateStorage()
    for template in with_document_templates:
        storage.save(template.id, file_bytes)
        resp = client.get(
            f"/api/document-template/{template.id}/download",
        )
        assert resp.status_code == 200
        assert template.template_filename in resp.headers["Content-Disposition"]
        assert resp.content == file_bytes


def test_delete_document_template(
    with_document_templates: list[DocumentTemplate],
    session: "Session",
    client: TestClient,
) -> None:
    file_bytes = b"fedcba"
    storage = InMemoryTemplateStorage()
    for template in with_document_templates:
        template_id = template.id
        assert template_id is not None

        storage.save(template_id, file_bytes)
        resp = client.delete(
            f"/api/document-template/{template_id}",
        )
        assert resp.status_code == 204

        db_record = session.scalar(
            select(DocumentTemplate).where(DocumentTemplate.id == template_id)
        )
        assert db_record is None
        with pytest.raises(FileNotFoundError):
            storage.load(template_id)
