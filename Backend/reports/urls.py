from rest_framework import routers
from .views import SalesReportViewSet, MenuPopularityViewSet

router = routers.DefaultRouter()
router.register(r'sales', SalesReportViewSet)
router.register(r'popularity', MenuPopularityViewSet)

urlpatterns = router.urls
