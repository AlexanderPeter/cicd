#!/bin/bash

service postgresql start

sudo -u postgres psql -c "CREATE DATABASE appdb;" || true
sudo -u postgres psql -d appdb -f /docker-entrypoint-initdb.d/schema.sql || true

python app.py
