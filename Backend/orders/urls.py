from rest_framework import routers
from .views import OrderViewSet, OrderLineItemViewSet, OrderStatusEventViewSet

router = routers.DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'line-items', OrderLineItemViewSet)
router.register(r'status-events', OrderStatusEventViewSet)

urlpatterns = router.urls
