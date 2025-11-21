
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import OrderSerializer, OrderLineItemSerializer, OrderStatusEventSerializer
from firebase_integration.firebase_client import add_document, get_document, update_document, delete_document, list_documents

class OrderViewSet(viewsets.ViewSet):
    collection = 'orders'

    def list(self, request):
        orders = list_documents(self.collection)
        return Response(orders)


    def create(self, request):
        from datetime import datetime
        data = request.data.copy()
        order_doc = {
            'createdAt': datetime.utcnow(),
            'dayKey': data.get('dayKey', ''),
            'deliveryAddress': data.get('deliveryAddress', {}),
            'contactPhone': data.get('contactPhone', ''),
            'fullAddress': data.get('fullAddress', ''),
            'landmark': data.get('landmark', ''),
            'deliveryFee': float(data.get('deliveryFee', 0)),
            'guestInfo': None,
            'isGuestOrder': bool(data.get('isGuestOrder', False)),
            'itemsSubtotal': float(data.get('itemsSubtotal', 0)),
            'orderList': data.get('orderList', []),
            'lineTotal': float(data.get('lineTotal', 0)),
            'menuId': data.get('menuId', ''),
            'menuName': data.get('menuName', ''),
            'notes': data.get('notes', ''),
            'quantity': int(data.get('quantity', 1)),
            'unitPrice': float(data.get('unitPrice', 0)),
            'orderStatus': data.get('orderStatus', ''),
            'orderStatusIndex': int(data.get('orderStatusIndex', 0)),
            'orderType': data.get('orderType', ''),
            'paymentMethod': data.get('paymentMethod', ''),
            'statusHistory': data.get('statusHistory', []),
            'changedAt': datetime.utcnow(),
            'changedByRole': data.get('changedByRole', ''),
            'changedByUserId': data.get('changedByUserId', ''),
            'status': data.get('status', ''),
            'tableNumber': None,
            'totalFee': float(data.get('totalFee', 0)),
            'updatedAt': datetime.utcnow(),
            'userId': data.get('userId', ''),
        }
        add_document(self.collection, order_doc)
        return Response(order_doc, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        order = get_document(self.collection, pk)
        if order:
            return Response(order)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


    def update(self, request, pk=None):
        from datetime import datetime
        data = request.data.copy()
        order_doc = {
            'dayKey': data.get('dayKey', ''),
            'deliveryAddress': data.get('deliveryAddress', {}),
            'contactPhone': data.get('contactPhone', ''),
            'fullAddress': data.get('fullAddress', ''),
            'landmark': data.get('landmark', ''),
            'deliveryFee': float(data.get('deliveryFee', 0)),
            'guestInfo': None,
            'isGuestOrder': bool(data.get('isGuestOrder', False)),
            'itemsSubtotal': float(data.get('itemsSubtotal', 0)),
            'orderList': data.get('orderList', []),
            'lineTotal': float(data.get('lineTotal', 0)),
            'menuId': data.get('menuId', ''),
            'menuName': data.get('menuName', ''),
            'notes': data.get('notes', ''),
            'quantity': int(data.get('quantity', 1)),
            'unitPrice': float(data.get('unitPrice', 0)),
            'orderStatus': data.get('orderStatus', ''),
            'orderStatusIndex': int(data.get('orderStatusIndex', 0)),
            'orderType': data.get('orderType', ''),
            'paymentMethod': data.get('paymentMethod', ''),
            'statusHistory': data.get('statusHistory', []),
            'changedAt': datetime.utcnow(),
            'changedByRole': data.get('changedByRole', ''),
            'changedByUserId': data.get('changedByUserId', ''),
            'status': data.get('status', ''),
            'tableNumber': None,
            'totalFee': float(data.get('totalFee', 0)),
            'updatedAt': datetime.utcnow(),
            'userId': data.get('userId', ''),
        }
        update_document(self.collection, pk, order_doc)
        return Response(order_doc)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrderLineItemViewSet(viewsets.ViewSet):
    collection = 'order_line_items'

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

class OrderStatusEventViewSet(viewsets.ViewSet):
    collection = 'order_status_events'

    def list(self, request):
        events = list_documents(self.collection)
        return Response(events)

    def create(self, request):
        data = request.data
        add_document(self.collection, data)
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        event = get_document(self.collection, pk)
        if event:
            return Response(event)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        data = request.data
        update_document(self.collection, pk, data)
        return Response(data)

    def destroy(self, request, pk=None):
        delete_document(self.collection, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
