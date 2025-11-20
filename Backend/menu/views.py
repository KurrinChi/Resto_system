from rest_framework import viewsets
from .models import Category, MenuItem, ItemVariation
from .serializers import CategorySerializer, MenuItemSerializer, ItemVariationSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

class ItemVariationViewSet(viewsets.ModelViewSet):
    queryset = ItemVariation.objects.all()
    serializer_class = ItemVariationSerializer
