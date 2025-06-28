# CI/CD

CI/CD Pipeline example project

![Build Frontend](https://github.com/AlexanderPeter/cicd/actions/workflows/frontend.yml/badge.svg)
![Build Backend](https://github.com/AlexanderPeter/cicd/actions/workflows/backend.yml/badge.svg)

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
```

### Prepare local environment
```bash

source .venv/Scripts/activate
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
