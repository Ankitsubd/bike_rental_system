from rest_framework import serializers
from .models import User, Bike, Booking, Review

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    bike = BikeSerializer(read_only=True)
    bike_id = serializers.PrimaryKeyRelatedField(
        queryset = Bike.objects.all(),
        write_only= True,
        source = 'bike'
    )

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'total_price', 'status', 'created_at')

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
