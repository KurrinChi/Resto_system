from rest_framework import serializers
from .models import SalesReport, MenuPopularity

class SalesReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesReport
        fields = '__all__'

class MenuPopularitySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuPopularity
        fields = '__all__'
