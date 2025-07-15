from itsdangerous import URLSafeTimedSerializer
from django.conf import settings


# For email verification
def generate_verification_token(email):
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    return serializer.dumps(email, salt='email-verify')

def verify_verification_token(token, max_age = 3600):
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    try:
        email = serializer.loads(token, salt='email-verify', max_age= max_age)
        return email
    
    except Exception:
        return None

# for password reset
def generate_reset_token(email):
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    return serializer.dumps(email, salt='password-reset')

def verify_reset_token(token, max_age = 3600):
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    try:
        email = serializer.loads(token, salt='password-reset', max_age= max_age)
        return email
    
    except Exception:
        return None