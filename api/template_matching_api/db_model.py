from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class DocumentTemplate(Base):
    __tablename__ = "document_templates"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    template_filename = Column(String, nullable=False)
    template_file_type = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    template_matching_job_templates = relationship(
        "TemplateMatchingJobTemplate",
        uselist=True,
        back_populates="document_template",
        passive_deletes=True,
    )
    template_matching_jobs = relationship(
        "TemplateMatchingJob",
        secondary="template_matching_job_templates",
        uselist=True,
        back_populates="document_templates",
    )


class TemplateMatchingJob(Base):
    __tablename__ = "template_matching_jobs"

    id = Column(Integer, primary_key=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    job_state = Column(String, nullable=True)
    job_id = Column(String, nullable=True)

    template_matching_job_templates = relationship(
        "TemplateMatchingJobTemplate",
        uselist=True,
        back_populates="template_matching_job",
        passive_deletes=True,
    )
    document_templates = relationship(
        DocumentTemplate,
        secondary="template_matching_job_templates",
        uselist=True,
        back_populates="template_matching_jobs",
    )

    document_template_ids = association_proxy(
        "template_matching_job_templates",
        "document_template_id",
        creator=lambda template_id: TemplateMatchingJobTemplate(
            document_template_id=template_id
        ),
    )


class TemplateMatchingJobTemplate(Base):
    __tablename__ = "template_matching_job_templates"

    template_matching_job_id = Column(
        Integer,
        ForeignKey("template_matching_jobs.id", ondelete="CASCADE"),
        primary_key=True,
    )
    document_template_id = Column(
        Integer,
        ForeignKey("document_templates.id", ondelete="CASCADE"),
        primary_key=True,
    )

    template_matching_job = relationship(
        TemplateMatchingJob,
        uselist=False,
        back_populates="template_matching_job_templates",
    )
    document_template = relationship(
        DocumentTemplate,
        uselist=False,
        back_populates="template_matching_job_templates",
    )
