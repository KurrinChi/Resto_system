# Restaurant Ordering System Backend Setup Guide

## 1. Migrate the Database
Open a terminal in your `Backend` directory and run:
```
python manage.py makemigrations
python manage.py migrate
```

## 2. Load Dummy Fixture Data
Run these commands to load sample data for users, menu, orders, and reports:
```
python manage.py loaddata users/fixtures.json
python manage.py loaddata menu/fixtures.json
python manage.py loaddata orders/fixtures.json
python manage.py loaddata reports/fixtures.json
```

## 3. Create a Superuser (for admin site)
```
python manage.py createsuperuser
```

## 4. Run the Development Server
```
python manage.py runserver
```

## 5. Test API Endpoints
- Visit `http://localhost:8000/swagger/` for interactive API docs.
- Use `/api/` endpoints for users, menu, orders, reports, tracking, and media.
- JWT auth endpoints: `/api/auth/token/`, `/api/auth/token/refresh/`, `/api/auth/token/verify/`
- Media files: `/media/` URL

## 6. Connect React Frontend
- Use the documented endpoints in your React admin/client code.
- CORS is enabled for local development.

---

**Your backend is now fully scaffolded, ready for frontend integration, and seeded with test data.**

If you need help with React API calls, authentication flows, or connecting specific modules, let me know!
