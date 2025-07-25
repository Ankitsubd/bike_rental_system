from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from .models import Bike, Booking, Review
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'address' ,'is_customer', 'is_admin', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['email', 'password']  

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        username = email.split('@')[0]  
        user = User.objects.create(
            username=username,
            email=email,
            is_customer=True,   
            is_admin=False,
            is_verified=False,    
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    bike = serializers.ReadOnlyField(source='bike.name')

    class Meta:
        model = Booking
        fields = ['id', 'user', 'bike', 'start_time', 'end_time', 'total_price', 'status', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    bike = serializers.PrimaryKeyRelatedField(queryset=Bike.objects.all())

    class Meta:
        model = Review
        fields = ['id', 'user', 'bike', 'rating', 'comment', 'created_at']

    def validate(self, data):
        user = self.context['request'].user
        bike = data['bike']  # Already resolved to Bike object by DRF

        if Review.objects.filter(user=user, bike=bike).exists():
            raise serializers.ValidationError("You have already reviewed this bike.")

        return data

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
            "is_customer": user.is_customer,
            "is_admin": user.is_admin,
        }


class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True,required=True, validators=[validate_password])