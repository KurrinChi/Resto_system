
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import CategorySerializer, MenuItemSerializer, ItemVariationSerializer
from firebase_integration.firebase_client import add_document, get_document, update_document, delete_document, list_documents

class CategoryViewSet(viewsets.ViewSet):
    collection = 'categories'

    def list(self, request):
        categories = list_documents(self.collection)
        return Response(categories)


    def create(self, request):
        from datetime import datetime
        data = request.data.copy()
        # Enforce schema
        menu_doc = {
            'availabilityStatus': data.get('availabilityStatus', 'available'),
            'category': data.get('category', ''),
            'createdAt': datetime.utcnow(),
            'description': data.get('description', ''),
            'imageUrl': data.get('imageUrl'),
            'isFeatured': bool(data.get('isFeatured', False)),
            'keywords': data.get('keywords', []),
            'menuName': data.get('menuName', ''),
            'price': int(data.get('price', 0)),
            'updatedAt': datetime.utcnow(),
        }
        add_document(self.collection, menu_doc)
        return Response(menu_doc, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        category = get_document(self.collection, pk)
        if category:
            return Response(category)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


    def update(self, request, pk=None):
        from datetime import datetime
        data = request.data.copy()
        menu_doc = {
            'availabilityStatus': data.get('availabilityStatus', 'available'),
            'category': data.get('category', ''),
            'description': data.get('description', ''),
            'imageUrl': data.get('imageUrl'),
            'isFeatured': bool(data.get('isFeatured', False)),
            'keywords': data.get('keywords', []),
            'menuName': data.get('menuName', ''),
            'price': int(data.get('price', 0)),
            'updatedAt': datetime.utcnow(),
        }
        update_document(self.collection, pk, menu_doc)
        return Response(menu_doc)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class MenuItemViewSet(viewsets.ViewSet):
    collection = 'menu_items'

    def list(self, request):
        items = list_documents(self.collection)
        return Response(items)

    def create(self, request):
        data = request.data
        add_document(self.collection, data)
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        item = get_document(self.collection, pk)
        if item:
            return Response(item)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        data = request.data
        update_document(self.collection, pk, data)
        return Response(data)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class ItemVariationViewSet(viewsets.ViewSet):
    collection = 'item_variations'

    def list(self, request):
        variations = list_documents(self.collection)
        return Response(variations)

    def create(self, request):
        data = request.data
        add_document(self.collection, data)
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        variation = get_document(self.collection, pk)
        if variation:
            return Response(variation)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        data = request.data
        update_document(self.collection, pk, data)
        return Response(data)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
