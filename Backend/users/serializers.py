from rest_framework import serializers
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
        fields = ['id', 'username', 'email', 'avatar', 'roles', 'addresses']
