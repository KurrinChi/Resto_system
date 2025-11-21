from rest_framework import viewsets
from .models import MediaFile
from .serializers import MediaFileSerializer

class MediaFileViewSet(viewsets.ModelViewSet):
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer

from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import MediaFileSerializer
from firebase_integration.firebase_client import add_document, get_document, update_document, delete_document, list_documents

class MediaFileViewSet(viewsets.ViewSet):
    collection = 'media_files'

    def list(self, request):
        files = list_documents(self.collection)
        return Response(files)

    def create(self, request):
        data = request.data
        add_document(self.collection, data)
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        file = get_document(self.collection, pk)
        if file:
            return Response(file)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        data = request.data
        update_document(self.collection, pk, data)
        return Response(data)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
