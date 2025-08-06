# CI/CD

CI/CD Pipeline example project

[![Build Frontend](https://github.com/AlexanderPeter/cicd/actions/workflows/frontend.yml/badge.svg)](https://github.com/AlexanderPeter/cicd/actions/workflows/frontend.yml)
[![Build Backend](https://github.com/AlexanderPeter/cicd/actions/workflows/backend.yml/badge.svg)](https://github.com/AlexanderPeter/cicd/actions/workflows/backend.yml)

## Frontend

```bash

cd frontend
```

### Prepare local environment
```bash

source npm install
```

### Start local server
```bash

npm run start
```
Open http://127.0.0.1:3000/

### Format code
```bash

npm run format
```

### Lint code
```bash

npm run lint
```

### Execute tests
```bash

npm run test
```

## Backend

```bash

cd backend
source .venv/Scripts/activate
```

### Prepare local environment
```bash

pip install -r requirements.txt
```

### Generate model classes
```bash

source .env && sqlacodegen $DATABASE_URL --outfile generated/models.py
```

### Start local server
```bash

python app.py
```

Open http://127.0.0.1:5000/

### Format code
```bash
black .
...
```

### Lint code
```bash

pylint .
```

### Execute tests
```bash

pytest
```

## Database

```bash

cd database
```

### Create user and database

```sql
psql -U postgres -c "CREATE USER localuser WITH LOGIN;"
psql -U postgres -c "CREATE DATABASE localdb OWNER localuser;"
```

### Ignore password for local login

```sql
psql -U postgres -c "SHOW hba_file;"
```
Change the following lines 

Old: `host    all             all             127.0.0.1/32            scram-sha-256`

New: `host    all             all             127.0.0.1/32            trust`

Old: `host    all             all             ::1/128                 scram-sha-256`

New: `host    all             all             ::1/128                 trust`

Restart server with admin rights:
```bash

net stop postgresql-x64-17 && net start postgresql-x64-17
```

### Init database

```bash

psql -U localuser -d localdb -f schema.sql 
```
