
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserSerializer, RoleSerializer, AddressSerializer
from firebase_integration.firebase_client import add_document, get_document, update_document, delete_document, list_documents

class UserViewSet(viewsets.ViewSet):
    collection = 'users'

    def list(self, request):
        users = list_documents(self.collection)
        return Response(users)


    def create(self, request):
        from datetime import datetime
        data = request.data.copy()
        user_doc = {
            'createdAt': datetime.utcnow(),
            'deliveryAddresses': data.get('deliveryAddresses', []),
            'email': data.get('email', ''),
            'firstName': data.get('firstName', ''),
            'isActive': bool(data.get('isActive', True)),
            'lastName': data.get('lastName', ''),
            'middleName': data.get('middleName', ''),
            'password': data.get('password', ''),
            'photoURL': data.get('photoURL'),
            'role': data.get('role', 'user'),
            'updatedAt': datetime.utcnow(),
            'username': data.get('username', ''),
        }
        add_document(self.collection, user_doc)
        return Response(user_doc, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        user = get_document(self.collection, pk)
        if user:
            return Response(user)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


    def update(self, request, pk=None):
        from datetime import datetime
        data = request.data.copy()
        user_doc = {
            'deliveryAddresses': data.get('deliveryAddresses', []),
            'email': data.get('email', ''),
            'firstName': data.get('firstName', ''),
            'isActive': bool(data.get('isActive', True)),
            'lastName': data.get('lastName', ''),
            'middleName': data.get('middleName', ''),
            'password': data.get('password', ''),
            'photoURL': data.get('photoURL'),
            'role': data.get('role', 'user'),
            'updatedAt': datetime.utcnow(),
            'username': data.get('username', ''),
        }
        update_document(self.collection, pk, user_doc)
        return Response(user_doc)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class RoleViewSet(viewsets.ViewSet):
    collection = 'roles'

    def list(self, request):
        roles = list_documents(self.collection)
        return Response(roles)

    def create(self, request):
        data = request.data
        add_document(self.collection, data)
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        role = get_document(self.collection, pk)
        if role:
            return Response(role)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        data = request.data
        update_document(self.collection, pk, data)
        return Response(data)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class AddressViewSet(viewsets.ViewSet):
    collection = 'addresses'

    def list(self, request):
        addresses = list_documents(self.collection)
        return Response(addresses)

    def create(self, request):
        data = request.data
        add_document(self.collection, data)
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        address = get_document(self.collection, pk)
        if address:
            return Response(address)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        data = request.data
        update_document(self.collection, pk, data)
        return Response(data)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
