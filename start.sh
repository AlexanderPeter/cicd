(
  cd backend || exit
  source .venv/Scripts/activate
  python app.py
) &

(
  cd frontend || exit
  npm run start
) &

wait
