from rest_framework import routers
from .views import OrderTrackingViewSet

router = routers.DefaultRouter()
router.register(r'tracking', OrderTrackingViewSet)

urlpatterns = router.urls
