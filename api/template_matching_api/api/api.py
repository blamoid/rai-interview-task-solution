from fastapi import APIRouter
from .endpoints import document_template, template_matching_job

api_router = APIRouter()
api_router.include_router(document_template.router, prefix="/document-template", tags=["document-templates"])
api_router.include_router(template_matching_job.router, prefix="/template-matching-job", tags=["template-matching"])
