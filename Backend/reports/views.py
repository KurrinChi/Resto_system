
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import SalesReportSerializer, MenuPopularitySerializer
from firebase_integration.firebase_client import add_document, get_document, update_document, delete_document, list_documents

class SalesReportViewSet(viewsets.ViewSet):
    collection = 'sales_reports'

    def list(self, request):
        reports = list_documents(self.collection)
        return Response(reports)

    def create(self, request):
        data = request.data
        add_document(self.collection, data)
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        report = get_document(self.collection, pk)
        if report:
            return Response(report)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        data = request.data
        update_document(self.collection, pk, data)
        return Response(data)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class MenuPopularityViewSet(viewsets.ViewSet):
    collection = 'menu_popularity'

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
