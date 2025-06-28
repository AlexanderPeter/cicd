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

### Lint typescript code
```bash

npm run lint
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

### Start local server
```bash

python app.py
```

Open http://127.0.0.1:5000/

### Lint python code
```bash

pylint .
```
