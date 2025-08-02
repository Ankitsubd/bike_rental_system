# Bike Rental System Backend

## Deployment to Render

### Prerequisites
- Python 3.11+
- Git

### Environment Variables
Set these in your Render dashboard:

```
SECRET_KEY=your-secure-secret-key
DEBUG=False
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Build Commands
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn backend.wsgi:application`

### Dependencies
All dependencies are listed in `requirements.txt`

### Database
This project uses SQLite for simplicity. The database file will be created automatically.

### Static Files
Static files are collected during build process.

### Media Files
Media files are served from the `media/` directory.

## Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

5. Run development server:
   ```bash
   python manage.py runserver
   ```

## API Documentation
- Swagger UI: `/swagger/`
- ReDoc: `/redoc/`
- Schema: `/api/schema/`

## Security Notes
- Change the SECRET_KEY in production
- Set DEBUG=False in production
- Configure proper CORS settings
- Use HTTPS in production 