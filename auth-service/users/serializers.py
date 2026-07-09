import bleach
from rest_framework import serializers
from .models import User

class AntiXSSSerializerMixin:
    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data)
        exclude_fields = ['password', 'password_confirm']
        
        for key, value in internal_value.items():
            if isinstance(value, str) and key not in exclude_fields:
                internal_value[key] = bleach.clean(value, tags=[], attributes={}, strip=True)
                
        return internal_value


class RegisterSerializer(AntiXSSSerializerMixin, serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        min_length=8,
        style={'input_type': 'password'}
    )

    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password')
        extra_kwargs = {
            'first_name': {'max_length': 50, 'allow_blank': False},
            'last_name': {'max_length': 50, 'allow_blank': False},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class UserSerializer(AntiXSSSerializerMixin, serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')