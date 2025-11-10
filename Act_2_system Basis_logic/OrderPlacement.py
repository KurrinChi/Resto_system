# ===
# Jomnabi G. Madridano Jr.
# Mary Hannah Caryl Reyes
# BSIT 4F-G2
#
# Restaurant Management System - Order Placement
# ==

from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
import random


class OrderType(Enum):
    """
    Types of orders in the restaurant system.
    """
    DINE_IN = "DINE_IN"
    TAKEOUT = "TAKEOUT"
    DELIVERY = "DELIVERY"


class OrderStatus(Enum):
    """
    Order status lifecycle.
    """
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY = "READY"
    SERVED = "SERVED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Priority(Enum):
    """
    Order priority levels.
    """
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    URGENT = "URGENT"


@dataclass
class MenuItem:
    """
    Value object representing a menu item.
    """
    item_id: int
    name: str
    price: float
    category: str


@dataclass
class OrderItem:
    """
    Value object representing an item in an order.
    """
    menu_item: MenuItem
    quantity: int
    special_instructions: str = ""
    
    def get_subtotal(self) -> float:
        """Calculate subtotal for this order item"""
        return self.menu_item.price * self.quantity


@dataclass
class OrderSummary:
    """
    Value object for order summary information.
    """
    order_id: int
    order_type: OrderType
    status: OrderStatus
    priority: Priority
    customer_name: str
    table_number: Optional[int]
    items_count: int
    total_amount: float
    order_time: str


class BaseOrder:
    """
    Base class for all order types.
    Provides common functionality that can be inherited by specialized order types.  # Inheritance
    """
    
    def get_service_type(self) -> str:
        """
        Default service type description.
        Can be overridden by subclasses for polymorphic behavior.  # Polymorphism
        """
        return "General order service"
    
    def get_estimated_time(self) -> int:
        """
        Base estimated preparation time in minutes.
        Subclasses can override to provide type-specific estimates.  # Polymorphism
        """
        return 30
    
    def get_additional_fees(self) -> float:
        """
        Base additional fees.
        Subclasses can override for service-specific charges.  # Polymorphism
        """
        return 0.0


class Order(BaseOrder):
    """
    Order class demonstrating all four pillars of OOP:
    
    Encapsulation: Private attributes (__items, __status, __payment_status) 
    are hidden from external access and can only be modified through controlled 
    public methods. This protects order data and maintains integrity.  # Encapsulation
    
    Inheritance: Inherits from BaseOrder to reuse common functionality and 
    establish an "is-a" relationship.  # Inheritance
    
    Abstraction: Hides complex implementation details (total calculation, status 
    validation) behind simple public methods like add_item() and calculate_total().  # Abstraction
    
    Polymorphism: Overrides inherited methods to provide Order-specific behavior 
    while maintaining the same interface.  # Polymorphism
    """
    
    def __init__(self, order_id: int, customer_name: str, order_type: OrderType,
                 table_number: Optional[int] = None, priority: Priority = Priority.NORMAL):
        # Encapsulation: Private attributes
        self.__order_id: int = order_id
        self.__customer_name: str = customer_name
        self.__order_type: OrderType = order_type
        self.__table_number: Optional[int] = table_number
        self.__priority: Priority = priority
        self.__items: List[OrderItem] = []  
        self.__status: OrderStatus = OrderStatus.PENDING
        self.__order_time: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.__notes: str = ""
        self.__payment_status: bool = False  
        self.__discount: float = 0.0  
        
    # Encapsulation: Private method for total calculation
    def __calculate_subtotal(self) -> float:
        """
        Private method to calculate order subtotal.
        External code cannot access this method directly.  # Encapsulation
        Abstraction: Hides the complexity of subtotal calculation.  # Abstraction
        """
        return sum(item.get_subtotal() for item in self.__items)
    
    # Encapsulation: Private method for status validation
    def __validate_status_transition(self, new_status: OrderStatus) -> bool:
        """
        Private method to validate status transitions.
        Encapsulates business rules for order status flow.  # Encapsulation
        """
        valid_transitions = {
            OrderStatus.PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
            OrderStatus.CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
            OrderStatus.PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
            OrderStatus.READY: [OrderStatus.SERVED, OrderStatus.COMPLETED],
            OrderStatus.SERVED: [OrderStatus.COMPLETED],
            OrderStatus.COMPLETED: [],
            OrderStatus.CANCELLED: []
        }
        return new_status in valid_transitions.get(self.__status, [])
    
    # Polymorphism: Override BaseOrder method with Order-specific implementation
    def get_service_type(self) -> str:
        """
        Polymorphic method that provides order type-specific descriptions.
        Overrides parent class method for Order-specific behavior.  # Polymorphism
        """
        descriptions = {
            OrderType.DINE_IN: "Dine-in service at table",
            OrderType.TAKEOUT: "Takeout - pack and prepare for pickup",
            OrderType.DELIVERY: "Delivery service - prepare and deliver to customer address"
        }
        return descriptions.get(self.__order_type, super().get_service_type())
    
    # Polymorphism: Override BaseOrder method with type-based time estimates
    def get_estimated_time(self) -> int:
        """
        Polymorphic method that returns order type-specific prep times.
        Different types have different estimated times.  # Polymorphism
        """
        base_time = super().get_estimated_time()
        time_adjustments = {
            OrderType.DINE_IN: 0,
            OrderType.TAKEOUT: 5,
            OrderType.DELIVERY: 15
        }
        adjustment = time_adjustments.get(self.__order_type, 0)
        
        # Priority affects time
        priority_multipliers = {
            Priority.LOW: 1.5,
            Priority.NORMAL: 1.0,
            Priority.HIGH: 0.8,
            Priority.URGENT: 0.5
        }
        multiplier = priority_multipliers.get(self.__priority, 1.0)
        
        return int((base_time + adjustment) * multiplier)
    
    # Polymorphism: Override BaseOrder method with type-specific fees
    def get_additional_fees(self) -> float:
        """
        Polymorphic method that returns service-specific fees.
        Different order types have different fees.  # Polymorphism
        """
        base_fee = super().get_additional_fees()
        type_fees = {
            OrderType.DINE_IN: 0.0,
            OrderType.TAKEOUT: 5.0,
            OrderType.DELIVERY: 25.0
        }
        return base_fee + type_fees.get(self.__order_type, 0.0)
    
    # Abstraction: Simple public interface hiding complex pricing logic
    def calculate_total(self) -> float:
        """
        Abstraction: Simple interface to get total without exposing 
        the internal calculation structure.  # Abstraction
        """
        subtotal = self.__calculate_subtotal()
        fees = self.get_additional_fees()
        tax = subtotal * 0.12  # 12% tax
        total = subtotal + fees + tax - self.__discount
        return max(0.0, total)  
    
    # Encapsulation: Controlled access through getter properties
    @property
    def order_id(self) -> int:
        """Read-only access to order_id"""
        return self.__order_id
    
    @property
    def customer_name(self) -> str:
        """Read-only access to customer_name"""
        return self.__customer_name
    
    @property
    def order_type(self) -> OrderType:
        """Read-only access to order_type"""
        return self.__order_type
    
    @property
    def table_number(self) -> Optional[int]:
        """Read-only access to table_number"""
        return self.__table_number
    
    @property
    def priority(self) -> Priority:
        """Read-only access to priority"""
        return self.__priority
    
    @property
    def status(self) -> OrderStatus:
        """Read-only access to order status"""
        return self.__status
    
    @property
    def order_time(self) -> str:
        """Read-only access to order time"""
        return self.__order_time
    
    @property
    def notes(self) -> str:
        """Read-only access to notes"""
        return self.__notes
    
    @property
    def payment_status(self) -> bool:
        """Read-only access to payment status"""
        return self.__payment_status
    
    @property
    def discount(self) -> float:
        """Read-only access to discount"""
        return self.__discount
    
    # Encapsulation: Controlled modification through methods with validation
    def add_item(self, menu_item: MenuItem, quantity: int, special_instructions: str = "") -> None:
        """
        Controlled item addition with validation.
        Encapsulates order item management.  # Encapsulation
        """
        if self.__status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            raise ValueError("Cannot add items to order in current status.")
        if quantity <= 0:
            raise ValueError("Quantity must be positive.")
        
        order_item = OrderItem(menu_item, quantity, special_instructions)
        self.__items.append(order_item)
    
    def remove_item(self, item_index: int) -> None:
        """
        Controlled item removal.
        Protects order integrity with business rules.  # Encapsulation
        """
        if self.__status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            raise ValueError("Cannot remove items from order in current status.")
        if item_index < 0 or item_index >= len(self.__items):
            raise ValueError("Invalid item index.")
        
        self.__items.pop(item_index)
    
    def get_items(self) -> List[OrderItem]:
        """
        Returns a copy of order items.
        Prevents direct modification of internal list.  # Encapsulation
        """
        return self.__items.copy()
    
    def update_status(self, new_status: OrderStatus) -> None:
        """
        Controlled status update with validation.
        Encapsulates status transition logic.  # Encapsulation
        Abstraction: Hides validation complexity from caller.  # Abstraction
        """
        if not self.__validate_status_transition(new_status):
            raise ValueError(f"Cannot transition from {self.__status.value} to {new_status.value}.")
        self.__status = new_status
    
    def set_priority(self, priority: Priority) -> None:
        """
        Update order priority.
        """
        if self.__status in [OrderStatus.COMPLETED, OrderStatus.CANCELLED]:
            raise ValueError("Cannot change priority of completed/cancelled order.")
        self.__priority = priority
    
    def add_notes(self, notes: str) -> None:
        """
        Add special notes to the order.
        """
        self.__notes = notes
    
    def apply_discount(self, discount: float) -> None:
        """
        Apply discount to order.
        Encapsulates discount validation.  # Encapsulation
        """
        if discount < 0:
            raise ValueError("Discount cannot be negative.")
        if discount > self.__calculate_subtotal():
            raise ValueError("Discount cannot exceed subtotal.")
        self.__discount = discount
    
    def mark_as_paid(self) -> None:
        """
        Mark order as paid.
        Encapsulates payment status change.  # Encapsulation
        """
        if self.__status == OrderStatus.CANCELLED:
            raise ValueError("Cannot mark cancelled order as paid.")
        if len(self.__items) == 0:
            raise ValueError("Cannot mark empty order as paid.")
        self.__payment_status = True
    
    def cancel_order(self, reason: str = "") -> None:
        """
        Cancel the order.
        Abstraction: Simple interface for complex cancellation logic.  # Abstraction
        """
        if self.__status in [OrderStatus.COMPLETED, OrderStatus.SERVED]:
            raise ValueError("Cannot cancel completed or served order.")
        if self.__payment_status:
            raise ValueError("Cannot cancel paid order. Process refund first.")
        self.__status = OrderStatus.CANCELLED
        if reason:
            self.__notes = f"Cancelled: {reason}" + (f" | {self.__notes}" if self.__notes else "")
    
    def get_summary(self) -> OrderSummary:
        """
        Returns a safe summary of order data.
        Prevents direct access to mutable internal state.  # Encapsulation
        """
        return OrderSummary(
            order_id=self.__order_id,
            order_type=self.__order_type,
            status=self.__status,
            priority=self.__priority,
            customer_name=self.__customer_name,
            table_number=self.__table_number,
            items_count=len(self.__items),
            total_amount=self.calculate_total(),
            order_time=self.__order_time
        )


class OrderManagementSystem:
    """
    Main system class that manages all orders.
    
    Encapsulation: The system encapsulates the entire order database and operations.
    Private dictionaries (__active_orders, __completed_orders) hide implementation 
    details and enforce business rules through public methods only.  # Encapsulation
    """
    
    def __init__(self):
        # Encapsulation: Private data structures
        self.__active_orders: Dict[int, Order] = {} 
        self.__completed_orders: Dict[int, Order] = {} 
        self.__next_id: int = 1000  
        self.__menu_items: Dict[int, MenuItem] = {}  
        self.__next_menu_id: int = 1
        
    # Encapsulation: Private helper method
    def __get_next_order_id(self) -> int:
        """
        Private method to generate unique order IDs.
        External code cannot manipulate ID generation.  # Encapsulation
        """
        current_id = self.__next_id
        self.__next_id += 1
        return current_id
    
    # Encapsulation: Private helper method
    def __get_next_menu_id(self) -> int:
        """Private method for menu item ID generation"""
        current_id = self.__next_menu_id
        self.__next_menu_id += 1
        return current_id
    
    # Menu management methods
    def add_menu_item(self, name: str, price: float, category: str) -> MenuItem:
        """
        Add menu item with validation.
        Encapsulates menu creation logic.  # Encapsulation
        """
        if not name or price <= 0:
            raise ValueError("Invalid menu item data.")
        
        item_id = self.__get_next_menu_id()
        menu_item = MenuItem(item_id, name, price, category)
        self.__menu_items[item_id] = menu_item
        return menu_item
    
    def get_menu_item(self, item_id: int) -> MenuItem:
        """
        Retrieve menu item by ID.
        Controlled access to menu data.  # Encapsulation
        """
        if item_id not in self.__menu_items:
            raise KeyError(f"Menu item ID {item_id} not found.")
        return self.__menu_items[item_id]
    
    def list_menu_items(self, category: Optional[str] = None) -> List[MenuItem]:
        """
        List menu items with optional filtering.
        Provides controlled view of menu data.  # Encapsulation
        """
        items = list(self.__menu_items.values())
        if category:
            items = [i for i in items if i.category.lower() == category.lower()]
        return sorted(items, key=lambda i: (i.category, i.name))
    
    # Order management methods
    def create_order(self, customer_name: str, order_type: OrderType,
                    table_number: Optional[int] = None, 
                    priority: Priority = Priority.NORMAL) -> Order:
        """
        Public method to create orders with validation.
        Encapsulates order creation logic and maintains data integrity.  # Encapsulation
        Abstraction: Hides order initialization complexity.  # Abstraction
        """
        if not customer_name:
            raise ValueError("Customer name is required.")
        if order_type == OrderType.DINE_IN and table_number is None:
            raise ValueError("Table number required for dine-in orders.")
        
        order_id = self.__get_next_order_id()
        order = Order(order_id, customer_name, order_type, table_number, priority)
        self.__active_orders[order_id] = order
        return order
    
    def get_order(self, order_id: int) -> Order:
        """
        Retrieve order by ID.
        Controlled access to order data.  # Encapsulation
        """
        if order_id in self.__active_orders:
            return self.__active_orders[order_id]
        elif order_id in self.__completed_orders:
            return self.__completed_orders[order_id]
        else:
            raise KeyError(f"Order ID {order_id} not found.")
    
    def complete_order(self, order_id: int) -> None:
        """
        Move order to completed status.
        Encapsulates order lifecycle management.  # Encapsulation
        """
        if order_id not in self.__active_orders:
            raise KeyError(f"Active order {order_id} not found.")
        
        order = self.__active_orders[order_id]
        
        if order.status not in [OrderStatus.SERVED, OrderStatus.READY]:
            raise ValueError("Order must be SERVED or READY before completion.")
        
        order.update_status(OrderStatus.COMPLETED)
        self.__completed_orders[order_id] = order
        del self.__active_orders[order_id]
    
    def cancel_and_archive(self, order_id: int, reason: str = "") -> None:
        """
        Cancel order and move to completed.
        """
        if order_id not in self.__active_orders:
            raise KeyError(f"Active order {order_id} not found.")
        
        order = self.__active_orders[order_id]
        order.cancel_order(reason)
        self.__completed_orders[order_id] = order
        del self.__active_orders[order_id]
    
    def list_orders(self, status: Optional[OrderStatus] = None,
                   order_type: Optional[OrderType] = None) -> List[Order]:
        """
        List orders with optional filtering.
        Provides controlled view of order data.  # Encapsulation
        """
        orders = list(self.__active_orders.values())
        
        if status:
            orders = [o for o in orders if o.status == status]
        if order_type:
            orders = [o for o in orders if o.order_type == order_type]
        
        return sorted(orders, key=lambda o: o.order_time, reverse=True)
    
    def list_completed_orders(self) -> List[Order]:
        """View completed/cancelled orders"""
        return sorted(self.__completed_orders.values(), 
                     key=lambda o: o.order_time, reverse=True)
    
    # Public read-only properties for system statistics
    @property
    def total_active_orders(self) -> int:
        """Total active orders"""
        return len(self.__active_orders)
    
    @property
    def total_completed_orders(self) -> int:
        """Total completed orders"""
        return len(self.__completed_orders)
    
    def get_statistics(self) -> Dict[str, int]:
        """
        Get system statistics.
        Provides safe aggregate data without exposing internal structure.  # Encapsulation
        """
        stats = {
            "total_active": len(self.__active_orders),
            "total_completed": len(self.__completed_orders),
            "total_menu_items": len(self.__menu_items),
        }
        
        for order_type in OrderType:
            count = sum(1 for o in self.__active_orders.values() if o.order_type == order_type)
            stats[f"type_{order_type.value.lower()}"] = count
        
        for status in OrderStatus:
            count = sum(1 for o in self.__active_orders.values() if o.status == status)
            stats[f"status_{status.value.lower()}"] = count
        
        return stats


# ===== Terminal UI (menu-driven) =====
def _print_header_block(names: List[str], section: str, system: str) -> None:
    print("===")
    for name in names:
        print(name)
    print(section)
    print("")
    print(system)
    print("==")


def _print_reflection() -> None:
    print("\n--- Reflection (Activity 2 Guide Questions) ---\n")
    print("a) How did you apply Encapsulation in your chosen entity?")
    print("   Encapsulation was applied by using private attributes (double underscore prefix) like __items,")
    print("   __status, __payment_status, __active_orders, and __completed_orders. These attributes cannot be")
    print("   accessed directly from outside the class. All data modifications must go through controlled public")
    print("   methods that include validation and business rules. For example, order items are stored in __items")
    print("   list and can only be modified through add_item() and remove_item() methods with status validation.")
    print("   The __calculate_subtotal() private method encapsulates pricing logic. Status transitions are protected")
    print("   by __validate_status_transition() private method ensuring only valid state changes occur.")
    print("\nb) How did you demonstrate Abstraction?")
    print("   Abstraction was demonstrated by hiding complex implementation details behind simple public interfaces.")
    print("   The calculate_total() method abstracts away the complexity of computing subtotal, taxes, fees, and")
    print("   discounts - users simply call one method to get the total. The __calculate_subtotal() and")
    print("   __validate_status_transition() private methods abstract complex logic that external code doesn't need")
    print("   to see. The cancel_order() method abstracts the entire cancellation process including status checks,")
    print("   payment validation, and note updates into a single simple call. External code interacts with clean,")
    print("   simple methods while all complex order management, pricing, and validation logic remains hidden.")
    print("\nc) How is Inheritance used in your design?")
    print("   Inheritance is demonstrated through the BaseOrder parent class, which provides common functionality")
    print("   like get_service_type(), get_estimated_time(), and get_additional_fees() that all order types share.")
    print("   The Order class inherits from BaseOrder, establishing an 'is-a' relationship (Order IS-A BaseOrder).")
    print("   This allows Order to reuse the base functionality while extending it with specific order management")
    print("   features. The inheritance hierarchy enables code reuse and establishes a clear relationship between")
    print("   general order concepts and specific implementations. This design allows for future extensions like")
    print("   CateringOrder or BuffetOrder that could also inherit from BaseOrder.")
    print("\nd) How did you apply Polymorphism, and what makes it different from the other pillars?")
    print("   Polymorphism is applied through method overriding - the Order class overrides get_service_type(),")
    print("   get_estimated_time(), and get_additional_fees() from BaseOrder to provide type-specific behavior.")
    print("   The same method names produce different results based on the order type (DINE_IN, TAKEOUT, DELIVERY)")
    print("   and priority level. For example, calling get_estimated_time() on a DELIVERY order with HIGH priority")
    print("   returns different time than calling it on a DINE_IN order with NORMAL priority, even though it's the")
    print("   same method interface. What makes polymorphism different is that it focuses on behavior variation")
    print("   through a common interface, while Encapsulation focuses on data hiding, Abstraction on hiding")
    print("   complexity, and Inheritance on code reuse. Polymorphism enables flexible, extensible code where new")
    print("   order types can be added without changing existing code.")
    print("\ne) Why is understanding and applying these OOP principles important in real-world system development?")
    print("   Understanding OOP principles is crucial for building maintainable, secure, and scalable systems.")
    print("   In real restaurant order management: (1) Encapsulation protects order data and payment information")
    print("   from unauthorized modifications, ensuring data integrity and preventing order manipulation.")
    print("   (2) Abstraction simplifies complex operations - staff don't need to understand pricing calculations")
    print("   to process orders. (3) Inheritance enables code reuse, reducing bugs and development time when adding")
    print("   new order types like catering or buffet. (4) Polymorphism allows treating different order types")
    print("   uniformly while maintaining their unique behaviors (different fees, times, handling), making the")
    print("   system flexible and extensible. Together, these principles create systems that are easier to maintain,")
    print("   test, debug, and extend - critical for restaurants where order accuracy, pricing integrity, and")
    print("   customer satisfaction are paramount.")


def _input_int(prompt: str) -> int:
    while True:
        try:
            return int(input(prompt).strip())
        except ValueError:
            print("Enter a valid integer.")


def _input_float(prompt: str) -> float:
    while True:
        try:
            return float(input(prompt).strip())
        except ValueError:
            print("Enter a valid number.")


def _pause() -> None:
    input("\nPress Enter to continue...")


def _print_order_list(title: str, orders: List[Order]) -> None:
    print(f"\n{title} ({len(orders)})")
    if not orders:
        print("  [none]")
        return
    for o in orders:
        summary = o.get_summary()
        print(f"  - ID={summary.order_id} | {summary.customer_name} | {summary.order_type.value} | "
              f"{summary.status.value} | Items={summary.items_count} | Total=₱{summary.total_amount:.2f}")


def _print_menu_list(title: str, items: List[MenuItem]) -> None:
    print(f"\n{title} ({len(items)})")
    if not items:
        print("  [none]")
        return
    for item in items:
        print(f"  - ID={item.item_id} | {item.name} | ₱{item.price:.2f} | {item.category}")


def run_cli() -> None:
    # Identification block
    names_block = [
        "Jomnabi G. Madridano Jr.",
        "Mary Hannah Caryl Reyes"
    ]
    section_line = "BSIT 4F-G2"
    system_line = "Restaurant Management System - Order Placement"
    
    system = OrderManagementSystem()
    
    # Seed sample menu items
    system.add_menu_item("Adobo", 150.0, "Main Course")
    system.add_menu_item("Sinigang", 180.0, "Main Course")
    system.add_menu_item("Lechon Kawali", 220.0, "Main Course")
    system.add_menu_item("Pancit Canton", 120.0, "Noodles")
    system.add_menu_item("Halo-Halo", 80.0, "Dessert")
    system.add_menu_item("Coke", 35.0, "Beverage")
    system.add_menu_item("Rice", 20.0, "Side")
    
    print("Sample menu items loaded.\n")
    
    while True:
        print("\n=== Order Placement System ===")
        stats = system.get_statistics()
        print(f"Active Orders: {stats['total_active']} | Completed: {stats['total_completed']} | Menu Items: {stats['total_menu_items']}")
        print(f"Dine-in: {stats['type_dine_in']} | Takeout: {stats['type_takeout']} | Delivery: {stats['type_delivery']}")
        print("\n--- Menu Management ---")
        print("1) Add menu item")
        print("2) View menu")
        print("\n--- Order Management ---")
        print("3) Create new order")
        print("4) Add items to order")
        print("5) View order details")
        print("6) Update order status")
        print("7) Set order priority")
        print("8) Apply discount")
        print("9) Mark as paid")
        print("10) Complete order")
        print("11) Cancel order")
        print("\n--- Views ---")
        print("12) View all active orders")
        print("13) View orders by status")
        print("14) View completed orders")
        print("15) System statistics")
        print("16) View order type details (Polymorphism demo)")
        print("0) Exit (print reflection and ID block)")
        
        cmd = input("\nSelect option: ").strip()
        
        try:
            if cmd == "1":
                name = input("Item name: ").strip()
                price = _input_float("Price: ")
                category = input("Category (e.g., Main Course, Dessert, Beverage): ").strip()
                item = system.add_menu_item(name, price, category)
                print(f"Menu item added! ID: {item.item_id}")
                _pause()
            
            elif cmd == "2":
                category = input("Filter by category (blank for all): ").strip() or None
                _print_menu_list("Menu Items", system.list_menu_items(category))
                _pause()
            
            elif cmd == "3":
                customer = input("Customer name: ").strip()
                print("Order type: 1) DINE_IN  2) TAKEOUT  3) DELIVERY")
                type_choice = input("Select: ").strip()
                type_map = {"1": OrderType.DINE_IN, "2": OrderType.TAKEOUT, "3": OrderType.DELIVERY}
                order_type = type_map.get(type_choice)
                if not order_type:
                    print("Invalid selection.")
                    _pause()
                    continue
                
                table = None
                if order_type == OrderType.DINE_IN:
                    table = _input_int("Table number: ")
                
                print("Priority: 1) LOW  2) NORMAL  3) HIGH  4) URGENT")
                pri_choice = input("Select (default NORMAL): ").strip() or "2"
                pri_map = {"1": Priority.LOW, "2": Priority.NORMAL, "3": Priority.HIGH, "4": Priority.URGENT}
                priority = pri_map.get(pri_choice, Priority.NORMAL)
                
                order = system.create_order(customer, order_type, table, priority)
                print(f"Order created! ID: {order.order_id}")
                _pause()
            
            elif cmd == "4":
                order_id = _input_int("Order ID: ")
                order = system.get_order(order_id)
                
                _print_menu_list("Available Menu Items", system.list_menu_items())
                
                item_id = _input_int("\nMenu item ID: ")
                quantity = _input_int("Quantity: ")
                instructions = input("Special instructions (optional): ").strip()
                
                menu_item = system.get_menu_item(item_id)
                order.add_item(menu_item, quantity, instructions)
                print(f"Added {quantity}x {menu_item.name} to order.")
                _pause()
            
            elif cmd == "5":
                order_id = _input_int("Order ID: ")
                order = system.get_order(order_id)
                summary = order.get_summary()
                
                print(f"\n--- Order Details ---")
                print(f"Order ID: {summary.order_id}")
                print(f"Customer: {summary.customer_name}")
                print(f"Type: {summary.order_type.value}")
                print(f"Status: {summary.status.value}")
                print(f"Priority: {summary.priority.value}")
                if summary.table_number:
                    print(f"Table: {summary.table_number}")
                print(f"Order Time: {summary.order_time}")
                print(f"Service: {order.get_service_type()}")
                print(f"Estimated Time: {order.get_estimated_time()} minutes")
                print(f"Additional Fees: ₱{order.get_additional_fees():.2f}")
                print(f"Discount: ₱{order.discount:.2f}")
                print(f"Payment Status: {'PAID' if order.payment_status else 'UNPAID'}")
                print(f"\nItems:")
                for idx, item in enumerate(order.get_items()):
                    print(f"  {idx+1}. {item.menu_item.name} x{item.quantity} = ₱{item.get_subtotal():.2f}")
                    if item.special_instructions:
                        print(f"     Note: {item.special_instructions}")
                print(f"\nTotal Amount: ₱{order.calculate_total():.2f}")
                if order.notes:
                    print(f"Notes: {order.notes}")
                _pause()
            
            elif cmd == "6":
                order_id = _input_int("Order ID: ")
                order = system.get_order(order_id)
                print(f"Current status: {order.status.value}")
                print("New status: 1) PENDING  2) CONFIRMED  3) PREPARING  4) READY  5) SERVED  6) COMPLETED")
                choice = input("Select: ").strip()
                status_map = {
                    "1": OrderStatus.PENDING, "2": OrderStatus.CONFIRMED,
                    "3": OrderStatus.PREPARING, "4": OrderStatus.READY,
                    "5": OrderStatus.SERVED, "6": OrderStatus.COMPLETED
                }
                new_status = status_map.get(choice)
                if not new_status:
                    print("Invalid selection.")
                else:
                    order.update_status(new_status)
                    print(f"Status updated to {new_status.value}")
                _pause()
            
            elif cmd == "7":
                order_id = _input_int("Order ID: ")
                order = system.get_order(order_id)
                print(f"Current priority: {order.priority.value}")
                print("New priority: 1) LOW  2) NORMAL  3) HIGH  4) URGENT")
                choice = input("Select: ").strip()
                pri_map = {"1": Priority.LOW, "2": Priority.NORMAL, "3": Priority.HIGH, "4": Priority.URGENT}
                new_priority = pri_map.get(choice)
                if not new_priority:
                    print("Invalid selection.")
                else:
                    order.set_priority(new_priority)
                    print(f"Priority updated to {new_priority.value}")
                    print(f"New estimated time: {order.get_estimated_time()} minutes")
                _pause()
            
            elif cmd == "8":
                order_id = _input_int("Order ID: ")
                order = system.get_order(order_id)
                print(f"Current total: ₱{order.calculate_total():.2f}")
                discount = _input_float("Discount amount: ")
                order.apply_discount(discount)
                print(f"Discount applied. New total: ₱{order.calculate_total():.2f}")
                _pause()
            
            elif cmd == "9":
                order_id = _input_int("Order ID: ")
                order = system.get_order(order_id)
                print(f"Total amount: ₱{order.calculate_total():.2f}")
                confirm = input("Mark as paid? (yes/no): ").strip().lower()
                if confirm == "yes":
                    order.mark_as_paid()
                    print("Order marked as PAID.")
                _pause()
            
            elif cmd == "10":
                order_id = _input_int("Order ID to complete: ")
                system.complete_order(order_id)
                print("Order completed and archived.")
                _pause()
            
            elif cmd == "11":
                order_id = _input_int("Order ID to cancel: ")
                reason = input("Cancellation reason: ").strip()
                system.cancel_and_archive(order_id, reason)
                print("Order cancelled and archived.")
                _pause()
            
            elif cmd == "12":
                _print_order_list("All Active Orders", system.list_orders())
                _pause()
            
            elif cmd == "13":
                print("Filter by status: 1) PENDING  2) CONFIRMED  3) PREPARING  4) READY  5) SERVED")
                choice = input("Select: ").strip()
                status_map = {
                    "1": OrderStatus.PENDING, "2": OrderStatus.CONFIRMED,
                    "3": OrderStatus.PREPARING, "4": OrderStatus.READY, "5": OrderStatus.SERVED
                }
                status = status_map.get(choice)
                if not status:
                    print("Invalid selection.")
                else:
                    _print_order_list(f"{status.value} Orders", system.list_orders(status=status))
                _pause()
            
            elif cmd == "14":
                _print_order_list("Completed/Cancelled Orders", system.list_completed_orders())
                _pause()
            
            elif cmd == "15":
                stats = system.get_statistics()
                print("\n--- System Statistics ---")
                print(f"Total Active Orders: {stats['total_active']}")
                print(f"Total Completed Orders: {stats['total_completed']}")
                print(f"Total Menu Items: {stats['total_menu_items']}")
                print("\nBy Type:")
                print(f"  Dine-in: {stats['type_dine_in']}")
                print(f"  Takeout: {stats['type_takeout']}")
                print(f"  Delivery: {stats['type_delivery']}")
                print("\nBy Status:")
                print(f"  Pending: {stats['status_pending']}")
                print(f"  Confirmed: {stats['status_confirmed']}")
                print(f"  Preparing: {stats['status_preparing']}")
                print(f"  Ready: {stats['status_ready']}")
                print(f"  Served: {stats['status_served']}")
                _pause()
            
            elif cmd == "16":
                order_id = _input_int("Order ID: ")
                order = system.get_order(order_id)
                print(f"\n--- Polymorphism Demonstration ---")
                print(f"Order ID: {order.order_id} ({order.order_type.value})")
                print(f"Priority: {order.priority.value}")
                print(f"\nService Type (Polymorphic):")
                print(f"  {order.get_service_type()}")
                print(f"\nEstimated Time (Polymorphic):")
                print(f"  {order.get_estimated_time()} minutes")
                print(f"\nAdditional Fees (Polymorphic):")
                print(f"  ₱{order.get_additional_fees():.2f}")
                print(f"\nThis demonstrates polymorphism: the same methods get_service_type(),")
                print(f"get_estimated_time(), and get_additional_fees() return different results")
                print(f"based on the order type and priority level.")
                _pause()
            
            elif cmd == "0":
                _print_reflection()
                print()
                _print_header_block(names_block, section_line, system_line)
                break
            
            else:
                print("Invalid option.")
                _pause()
        
        except Exception as e:
            print(f"Error: {e}")
            _pause()


if __name__ == "__main__":
    run_cli()
