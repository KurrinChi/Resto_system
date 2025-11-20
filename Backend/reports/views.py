from rest_framework import viewsets
from .models import SalesReport, MenuPopularity
from .serializers import SalesReportSerializer, MenuPopularitySerializer

class SalesReportViewSet(viewsets.ModelViewSet):
    queryset = SalesReport.objects.all()
    serializer_class = SalesReportSerializer

class MenuPopularityViewSet(viewsets.ModelViewSet):
    queryset = MenuPopularity.objects.all()
    serializer_class = MenuPopularitySerializer
