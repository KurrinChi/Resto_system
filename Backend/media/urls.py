from rest_framework import routers
from .views import MediaFileViewSet

router = routers.DefaultRouter()
router.register(r'media', MediaFileViewSet)

urlpatterns = router.urls
