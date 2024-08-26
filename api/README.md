# Template matching API
This project is the backend part of the RAI interview task. Your task is to install project dependencies, seed the DB and run the dev server.

No modifications should be necessary. If there are any bugs occurring in the backend, please report them to us.

## Getting started
### Install system dependencies
This project uses python 3.11 with poetry. You can use `pyenv` to manage python versions: https://github.com/pyenv/pyenv.
To install poetry, please follow the guide at https://python-poetry.org/docs/.

### Install project dependencies
In the project root, run
```shell
poetry env use `which python3.11`
poetry install
```

### DB and storage setup
In the project root, run
```shell
mkdir storage
cd template_matching_api/scripts
poetry run python create_and_seed_db.py
cp -R storage_seed/ ../../storage/
```

### Starting the API
in the project root, run
```shell
poetry run fastapi dev template_matching_api/main.py
```
The API should then be available at http://127.0.0.1:8000, the OpenAPI documentation is available at http://127.0.0.1:8000/docs.
You can test the API by navigating to http://127.0.0.1:8000/api/document-template/
