cd database || exit
psql -U localuser -d localdb -f schema.sql
cd ..

cd backend || exit
source .venv/Scripts/activate
source .env && sqlacodegen $DATABASE_URL --outfile generated/models.py
black .
pylint .
cd ..

cd frontend || exit
npm run format
npm run lint
cd ..
