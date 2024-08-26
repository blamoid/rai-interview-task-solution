from datetime import datetime

from sqlalchemy.orm import sessionmaker

from template_matching_api.db import get_db
from template_matching_api.db_model import Base, DocumentTemplate


def main() -> None:
    engine = get_db()
    Base.metadata.create_all(engine)

    session = sessionmaker(bind=engine)()
    templates = [
        DocumentTemplate(
            id=1,
            name="my_template",
            template_filename="logoipsum_1",
            template_file_type="image/jpeg",
            uploaded_at=datetime.now(),
        ),
        DocumentTemplate(
            id=2,
            name="awesome_template",
            template_filename="logoipsum_2",
            template_file_type="image/jpeg",
            uploaded_at=datetime.now(),
        ),
        DocumentTemplate(
            id=3,
            name="foreign_template",
            template_filename="logoipsum_3",
            template_file_type="image/jpeg",
            uploaded_at=datetime.now(),
        ),
        DocumentTemplate(
            id=4,
            name="sad_template",
            template_filename="logoipsum_4",
            template_file_type="image/jpeg",
            uploaded_at=datetime.now(),
        )
    ]
    session.add_all(templates)
    session.commit()
    session.close()


if __name__ == '__main__':
    main()
