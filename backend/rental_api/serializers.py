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
        read_only_fields = ['id', 'is_verified', 'is_staff', 'is_superuser']  # These fields shouldn't be updated via profile


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


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    username = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    role = serializers.CharField(required=True)
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_role(self, value):
        if value not in ['admin', 'customer']:
            raise serializers.ValidationError("Role must be either 'admin' or 'customer'.")
        return value

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        role = validated_data.pop('role')
        username = validated_data['username']
        email = validated_data['email']
        
        # Set default values for required fields
        validated_data['full_name'] = username  # Use username as full_name
        validated_data['phone_number'] = '0000000000'  # Default phone number
        validated_data['is_verified'] = True  # Admin-created users are auto-verified
        
        # Set role-based permissions
        if role == 'admin':
            validated_data['is_staff'] = True
            validated_data['is_superuser'] = True
        else:
            validated_data['is_staff'] = False
            validated_data['is_superuser'] = False
        
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, error_messages={
        'required': 'Old password wrong please input current password.',
        'blank': 'Old password wrong please input current password.'
    })
    new_password = serializers.CharField(required=True, validators=[validate_password])


class BikeSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()
    rating_display = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)  # Allow optional for updates

    class Meta:
        model = Bike
        fields = '__all__'

    def validate_image(self, value):
        """Validate image file if provided"""
        if value is None:
            # No image provided - this is allowed for updates
            return value
        
        # Check file size (5MB limit)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file size must be less than 5MB.")
        
        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Please upload a valid image file (JPG, PNG, GIF).")
        
        return value

    def validate(self, data):
        """Validate all required fields"""
        required_fields = ['name', 'brand', 'model', 'bike_type', 'price_per_hour']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field.replace('_', ' ').title()} is required.")
        
        # Validate price is positive
        if data.get('price_per_hour') and data['price_per_hour'] <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        
        # Validate image is provided for new bikes only
        if not self.instance and not data.get('image'):
            raise serializers.ValidationError("Bike image is required for new bikes.")
        
        return data

    def get_is_available(self, obj):
        """Check if bike is available"""
        return obj.status == 'available'

    def get_rating_display(self, obj):
        """Format rating for display"""
        return f"{obj.rating}/5 ({obj.total_reviews} reviews)"


class BookingSerializer(serializers.ModelSerializer):
    bike_name = serializers.CharField(source='bike.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    price_per_hour = serializers.DecimalField(source='bike.price_per_hour', read_only=True, max_digits=10, decimal_places=2)
    actual_duration_hours = serializers.SerializerMethodField()
    original_duration_hours = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'total_price', 'actual_end_time', 'actual_total_price']

    def get_actual_duration_hours(self, obj):
        if obj.actual_end_time:
            try:
                # Ensure we're working with datetime objects
                if isinstance(obj.actual_end_time, str):
                    from django.utils.dateparse import parse_datetime
                    actual_end = parse_datetime(obj.actual_end_time)
                else:
                    actual_end = obj.actual_end_time
                
                if isinstance(obj.start_time, str):
                    from django.utils.dateparse import parse_datetime
                    start = parse_datetime(obj.start_time)
                else:
                    start = obj.start_time
                
                duration = (actual_end - start).total_seconds() / 3600
                return round(duration, 2)
            except (TypeError, ValueError):
                return None
        return None

    def get_original_duration_hours(self, obj):
        try:
            # Ensure we're working with datetime objects
            if isinstance(obj.end_time, str):
                from django.utils.dateparse import parse_datetime
                end = parse_datetime(obj.end_time)
            else:
                end = obj.end_time
            
            if isinstance(obj.start_time, str):
                from django.utils.dateparse import parse_datetime
                start = parse_datetime(obj.start_time)
            else:
                start = obj.start_time
            
            duration = (end - start).total_seconds() / 3600
            return round(duration, 2)
        except (TypeError, ValueError):
            return None

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
    price_per_hour = serializers.DecimalField(source='bike.price_per_hour', read_only=True, max_digits=10, decimal_places=2)
    actual_duration_hours = serializers.SerializerMethodField()
    original_duration_hours = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'user', 'bike', 'start_time', 'end_time', 'actual_end_time', 'total_price', 'actual_total_price', 'status', 'created_at', 'price_per_hour', 'actual_duration_hours', 'original_duration_hours']

    def get_actual_duration_hours(self, obj):
        if obj.actual_end_time:
            try:
                # Ensure we're working with datetime objects
                if isinstance(obj.actual_end_time, str):
                    from django.utils.dateparse import parse_datetime
                    actual_end = parse_datetime(obj.actual_end_time)
                else:
                    actual_end = obj.actual_end_time
                
                if isinstance(obj.start_time, str):
                    from django.utils.dateparse import parse_datetime
                    start = parse_datetime(obj.start_time)
                else:
                    start = obj.start_time
                
                duration = (actual_end - start).total_seconds() / 3600
                return round(duration, 2)
            except (TypeError, ValueError):
                return None
        return None

    def get_original_duration_hours(self, obj):
        try:
            # Ensure we're working with datetime objects
            if isinstance(obj.end_time, str):
                from django.utils.dateparse import parse_datetime
                end = parse_datetime(obj.end_time)
            else:
                end = obj.end_time
            
            if isinstance(obj.start_time, str):
                from django.utils.dateparse import parse_datetime
                start = parse_datetime(obj.start_time)
            else:
                start = obj.start_time
            
            duration = (end - start).total_seconds() / 3600
            return round(duration, 2)
        except (TypeError, ValueError):
            return None


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    bike_name = serializers.CharField(source='bike.name', read_only=True)
    user = UserSerializer(read_only=True)
    bike = BikeSerializer(read_only=True)
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

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError("Password Incorrect. Please try again.")
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
                "full_name": user.full_name,
                "phone_number": user.phone_number,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "is_verified": user.is_verified,
            }

        raise serializers.ValidationError("Must include email and password.")


class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True,required=True, validators=[validate_password])


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ['action', 'page', 'timestamp', 'user', 'ip_address', 'user_agent']
        read_only_fields = ['timestamp', 'user', 'ip_address', 'user_agent']