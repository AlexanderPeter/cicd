FROM python:3.11-slim

USER root
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x start.sh

COPY ../database/schema.sql /schema.sql
CMD ["python", "app.py"]
