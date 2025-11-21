from rest_framework import serializers
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Role, Address

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar', 'roles', 'addresses']
        read_only_fields = ['id', 'roles', 'addresses']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get(self.username_field)
        password = attrs.get('password')

        if identifier is None or password is None:
            raise serializers.ValidationError("Username/email and password are required.")

        # Find user by username or email
        user_lookup = User.objects.filter(
            Q(username__iexact=identifier) | Q(email__iexact=identifier)
        ).first()

        if not user_lookup:
            raise serializers.ValidationError("No account found with this username or email.")

        if not user_lookup.is_active:
            raise serializers.ValidationError("This account is inactive. Please contact support.")

        # Verify password
        if not user_lookup.check_password(password):
            raise serializers.ValidationError("Invalid password. Please try again.")

        # Set username for parent validation
        attrs[self.username_field] = user_lookup.username
        
        # Call parent validate to get tokens
        data = super().validate(attrs)
        data['user'] = UserSerializer(user_lookup).data
        return data
