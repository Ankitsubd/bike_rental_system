from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from .models import Bike, Booking, Review, Analytics
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'is_verified', 'phone_number', 'address', 'is_staff', 'is_superuser']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(required=True, max_length=255)
    phone_number = serializers.CharField(required=True, max_length=15)
    
    def validate_password(self, value):
        print(f"Validating password: {value[:3]}...")
        return value

    def validate_email(self, value):
        print(f"Validating email: {value}")
        if User.objects.filter(email=value).exists():
            print(f"Email {value} already exists")
            raise serializers.ValidationError("A user with this email already exists.")
        print(f"Email {value} is valid")
        return value

    def validate_phone_number(self, value):
        print(f"Validating phone number: {value}")
        # Basic phone number validation (you can enhance this)
        if not value.replace(' ', '').replace('-', '').replace('+', '').isdigit():
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone_number']  

    def create(self, validated_data):
        email = validated_data['email']
        full_name = validated_data['full_name']
        phone_number = validated_data['phone_number']
        base_username = email.split('@')[0]
        
        # Handle username conflicts by adding a number if needed
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        user = User.objects.create(
            username=username,
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            is_verified=False,    
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class BikeSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()
    rating_display = serializers.SerializerMethodField()

    class Meta:
        model = Bike
        fields = '__all__'

    def get_is_available(self, obj):
        """Check if bike is available"""
        return obj.status == 'available'

    def get_rating_display(self, obj):
        """Format rating for display"""
        return f"{obj.rating}/5 ({obj.total_reviews} reviews)"


class BookingSerializer(serializers.ModelSerializer):
    bike_name = serializers.CharField(source='bike.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'total_price']

    def validate(self, data):
        bike = data.get('bike')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if bike and bike.status != 'available':
            raise serializers.ValidationError("This bike is not available for booking.")

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError("End time must be after start time.")

        return data


class AdminBookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    bike = BikeSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'bike', 'start_time', 'end_time', 'total_price', 'status', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    bike_name = serializers.CharField(source='bike.name', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user']

# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, data):
#         email = data.get('email')
#         password = data.get('password')

#         if email and password:
#             user = authenticate(request=self.context.get('request'), email=email, password=password)
#             if not user:
#                 raise serializers.ValidationError("Invalid email or password")
#             if not user.is_active:
#                 raise serializers.ValidationError("User account is disabled")
#             if not user.is_verified:
#                 raise serializers.ValidationError("Email is not verified. Please check your inbox")
#             refresh = RefreshToken.for_user(user)

#             return {
#                 "access": str(refresh.access_token),
#                 "refresh": str(refresh),
#                 "username": user.username,
#                 "email": user.email,
#                 "is_customer": user.is_customer,
#                 "is_admin": user.is_admin,
#             }


#         raise serializers.ValidationError("Must include email and password.")
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        if not user.is_verified:
            raise serializers.ValidationError("Email is not verified. Please check your inbox")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "is_verified": user.is_verified,
        }


class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True,required=True, validators=[validate_password])


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ['action', 'page', 'timestamp', 'user', 'ip_address', 'user_agent']
        read_only_fields = ['timestamp', 'user', 'ip_address', 'user_agent']