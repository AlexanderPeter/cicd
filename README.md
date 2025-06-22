# CI/CD

CI/CD Pipeline example project

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
