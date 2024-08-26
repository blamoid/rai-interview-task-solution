from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentTemplateBase(BaseModel):
    name: str
    uploaded_at: datetime
    template_filename: str
    template_file_type: str


class DocumentTemplateOut(DocumentTemplateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class DocumentTemplateIn(DocumentTemplateBase):
    pass


class DocumentTemplateUpdate(BaseModel):
    name: str
