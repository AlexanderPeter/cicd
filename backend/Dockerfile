FROM python:3.11-slim

USER root

RUN apt-get update && \
    apt-get install -y postgresql postgresql-contrib && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY database/schema.sql /schema.sql
COPY backend/start.sh /start.sh

RUN chmod +x /start.sh

CMD ["/start.sh"]
