from rest_framework import routers
from .views import CategoryViewSet, MenuItemViewSet, ItemVariationViewSet

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'items', MenuItemViewSet)
router.register(r'variations', ItemVariationViewSet)

urlpatterns = router.urls
