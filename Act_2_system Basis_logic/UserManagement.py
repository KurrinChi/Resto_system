# ===
# Jomnabi G. Madridano Jr.
# Mary Hannah Caryl Reyes
# BSIT 4F-G2
#
# Restaurant Management System - User Management
# ==

from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
import hashlib


class Role(Enum):
    """
    Standardized user roles in the restaurant system.
    """
    CHEF = "CHEF"
    CASHIER = "CASHIER"
    WAITER = "WAITER"
    SECURITY_GUARD = "SECURITY_GUARD"
    MANAGER = "MANAGER"


class EmploymentStatus(Enum):
    """
    Employment status for user records.
    """
    ACTIVE = "ACTIVE"
    ON_LEAVE = "ON_LEAVE"
    SUSPENDED = "SUSPENDED"
    TERMINATED = "TERMINATED"


@dataclass
class UserProfile:
    """
    Value object representing user profile information.
    """
    user_id: int
    username: str
    full_name: str
    role: Role
    email: str
    phone: str
    hire_date: str


class BaseStaff:
    """
    Base class for all staff members.
    Provides common functionality that can be inherited by specialized staff types.  # Inheritance
    """
    
    def get_role_description(self) -> str:
        """
        Default role description.
        Can be overridden by subclasses for polymorphic behavior.  # Polymorphism
        """
        return "General staff member"
    
    def get_permissions(self) -> List[str]:
        """
        Base permissions for staff.
        Subclasses can override to provide role-specific permissions.  # Polymorphism
        """
        return ["view_profile", "clock_in_out"]


class User(BaseStaff):
    """
    User class demonstrating all four pillars of OOP:
    
    Encapsulation: Private attributes (__password_hash, __status, __login_attempts) 
    are hidden from external access and can only be modified through controlled 
    public methods. This protects sensitive data and maintains data integrity.  # Encapsulation
    
    Inheritance: Inherits from BaseStaff to reuse common functionality and 
    establish an "is-a" relationship.  # Inheritance
    
    Abstraction: Hides complex implementation details (password hashing, security 
    logic) behind simple public methods like verify_password() and authenticate().  # Abstraction
    
    Polymorphism: Overrides inherited methods to provide User-specific behavior 
    while maintaining the same interface.  # Polymorphism
    """
    
    def __init__(self, user_id: int, username: str, password: str, full_name: str, 
                 role: Role, email: str, phone: str, hire_date: str):
        # Encapsulation: Private attributes 
        self.__user_id: int = user_id
        self.__username: str = username
        self.__password_hash: str = self.__hash_password(password)  
        self.__full_name: str = full_name
        self.__role: Role = role
        self.__email: str = email
        self.__phone: str = phone
        self.__hire_date: str = hire_date
        self.__status: EmploymentStatus = EmploymentStatus.ACTIVE
        self.__login_attempts: int = 0  
        self.__last_login: Optional[str] = None
        
    # Encapsulation: Private method for password hashing
    def __hash_password(self, password: str) -> str:
        """
        Private method to hash passwords securely.
        External code cannot access this method directly.  # Encapsulation
        Abstraction: Hides the complexity of secure password storage.  # Abstraction
        """
        return hashlib.sha256(password.encode()).hexdigest()
    
    # Polymorphism: Override BaseStaff method with User-specific implementation
    def get_role_description(self) -> str:
        """
        Polymorphic method that provides role-specific descriptions.
        Overrides parent class method for User-specific behavior.  # Polymorphism
        """
        descriptions = {
            Role.CHEF: "Prepares and cooks food, manages kitchen operations",
            Role.CASHIER: "Handles payments, manages cash register, processes orders",
            Role.WAITER: "Serves customers, takes orders, ensures customer satisfaction",
            Role.SECURITY_GUARD: "Monitors premises, ensures safety and security",
            Role.MANAGER: "Oversees operations, manages staff, makes business decisions"
        }
        return descriptions.get(self.__role, super().get_role_description())
    
    # Polymorphism: Override BaseStaff method with role-based permissions
    def get_permissions(self) -> List[str]:
        """
        Polymorphic method that returns role-specific permissions.
        Different roles have different access levels.  # Polymorphism
        """
        base_permissions = super().get_permissions()
        role_permissions = {
            Role.CHEF: ["view_menu", "update_inventory", "manage_recipes"],
            Role.CASHIER: ["process_payment", "view_orders", "manage_transactions"],
            Role.WAITER: ["take_order", "view_menu", "update_order_status"],
            Role.SECURITY_GUARD: ["view_logs", "monitor_premises", "access_cameras"],
            Role.MANAGER: ["manage_users", "view_reports", "modify_settings", "all_access"]
        }
        return base_permissions + role_permissions.get(self.__role, [])
    
    # Abstraction: Simple public interface hiding complex validation logic
    def has_permission(self, permission: str) -> bool:
        """
        Abstraction: Simple interface to check permissions without exposing 
        the internal permission structure.  # Abstraction
        """
        return permission in self.get_permissions() or "all_access" in self.get_permissions()
    
    # Encapsulation: Controlled access through getter properties
    @property
    def user_id(self) -> int:
        """Read-only access to user_id"""
        return self.__user_id
    
    @property
    def username(self) -> str:
        """Read-only access to username"""
        return self.__username
    
    @property
    def full_name(self) -> str:
        """Read-only access to full_name"""
        return self.__full_name
    
    @property
    def role(self) -> Role:
        """Read-only access to role"""
        return self.__role
    
    @property
    def email(self) -> str:
        """Controlled read access to email"""
        return self.__email
    
    @property
    def phone(self) -> str:
        """Controlled read access to phone"""
        return self.__phone
    
    @property
    def hire_date(self) -> str:
        """Read-only access to hire_date"""
        return self.__hire_date
    
    @property
    def status(self) -> EmploymentStatus:
        """Read-only access to employment status"""
        return self.__status
    
    @property
    def last_login(self) -> Optional[str]:
        """Read-only access to last login timestamp"""
        return self.__last_login
    
    # Encapsulation: Controlled modification through setter methods with validation
    @email.setter
    def email(self, value: str) -> None:
        """
        Controlled write access with validation.
        Ensures data integrity before modifying private attribute.  # Encapsulation
        """
        if not value or "@" not in value:
            raise ValueError("Invalid email format.")
        self.__email = value
    
    @phone.setter
    def phone(self, value: str) -> None:
        """Controlled write access with validation"""
        if not value or len(value) < 10:
            raise ValueError("Invalid phone number.")
        self.__phone = value
    
    # Encapsulation: Public method with internal validation logic
    def verify_password(self, password: str) -> bool:
        """
        Verify password without exposing the hash.
        Encapsulates password verification logic.  # Encapsulation
        Abstraction: Hides hashing complexity from the caller.  # Abstraction
        """
        return self.__hash_password(password) == self.__password_hash
    
    def change_password(self, old_password: str, new_password: str) -> None:
        """
        Controlled password change with validation.
        Protects password modification with business rules.  # Encapsulation
        """
        if not self.verify_password(old_password):
            raise ValueError("Incorrect old password.")
        if len(new_password) < 6:
            raise ValueError("New password must be at least 6 characters.")
        self.__password_hash = self.__hash_password(new_password)
    
    def reset_password(self, new_password: str) -> None:
        """
        Admin-level password reset (bypasses old password check).
        """
        if len(new_password) < 6:
            raise ValueError("New password must be at least 6 characters.")
        self.__password_hash = self.__hash_password(new_password)
        self.__login_attempts = 0
    
    def record_login(self) -> None:
        """
        Record successful login.
        Encapsulates internal state modification.  # Encapsulation
        """
        self.__last_login = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.__login_attempts = 0
    
    def record_failed_login(self) -> None:
        """
        Track failed login attempts.
        Private counter prevents external manipulation.  # Encapsulation
        """
        self.__login_attempts += 1
        if self.__login_attempts >= 3:
            self.__status = EmploymentStatus.SUSPENDED
            raise ValueError("Account suspended due to multiple failed login attempts.")
    
    def change_status(self, new_status: EmploymentStatus) -> None:
        """
        Controlled status change with business rules.
        """
        if self.__status == EmploymentStatus.TERMINATED:
            raise ValueError("Cannot change status of terminated employee.")
        self.__status = new_status
        if new_status == EmploymentStatus.ACTIVE:
            self.__login_attempts = 0  # Reset on reactivation
    
    def get_profile(self) -> UserProfile:
        """
        Returns a safe copy of user profile data.
        Prevents direct access to mutable internal state.  # Encapsulation
        """
        return UserProfile(
            user_id=self.__user_id,
            username=self.__username,
            full_name=self.__full_name,
            role=self.__role,
            email=self.__email,
            phone=self.__phone,
            hire_date=self.__hire_date
        )
    
    def get_login_attempts(self) -> int:
        """Controlled read access to security-sensitive data"""
        return self.__login_attempts


class UserManagementSystem:
    """
    Main system class that manages all users.
    
    Encapsulation: The system encapsulates the entire user database and operations.
    Private dictionary (__users) hides implementation details and enforces
    business rules through public methods only.  # Encapsulation
    """
    
    def __init__(self):
        # Encapsulation: Private data structure
        self.__users: Dict[int, User] = {}  # Active users
        self.__archived_users: Dict[int, User] = {}  # Terminated users
        self.__next_id: int = 1  # Private ID counter
        
    # Encapsulation: Private helper method
    def __get_next_id(self) -> int:
        """
        Private method to generate unique user IDs.
        External code cannot manipulate ID generation.  # Encapsulation
        """
        current_id = self.__next_id
        self.__next_id += 1
        return current_id
    
    # Encapsulation: Private validation method
    def __validate_username_unique(self, username: str, exclude_id: Optional[int] = None) -> None:
        """
        Private validation to ensure username uniqueness.
        Encapsulates validation logic.  # Encapsulation
        """
        for uid, user in self.__users.items():
            if uid != exclude_id and user.username.lower() == username.lower():
                raise ValueError(f"Username '{username}' already exists.")
    
    def add_user(self, username: str, password: str, full_name: str, 
                 role: Role, email: str, phone: str) -> User:
        """
        Public method to add users with full validation.
        Encapsulates user creation logic and maintains data integrity.  # Encapsulation
        """
        # Validation
        if not username or len(username) < 3:
            raise ValueError("Username must be at least 3 characters.")
        if not password or len(password) < 6:
            raise ValueError("Password must be at least 6 characters.")
        if not full_name:
            raise ValueError("Full name is required.")
        if not isinstance(role, Role):
            raise ValueError("Invalid role.")
        
        self.__validate_username_unique(username)
        
        user_id = self.__get_next_id()
        hire_date = datetime.now().strftime("%Y-%m-%d")
        
        user = User(
            user_id=user_id,
            username=username,
            password=password,
            full_name=full_name,
            role=role,
            email=email,
            phone=phone,
            hire_date=hire_date
        )
        
        self.__users[user_id] = user
        return user
    
    def get_user(self, user_id: int) -> User:
        """
        Retrieve user by ID with error handling.
        Controlled access to internal data structure.  # Encapsulation
        """
        if user_id not in self.__users:
            raise KeyError(f"User ID {user_id} not found.")
        return self.__users[user_id]
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """
        Find user by username.
        """
        for user in self.__users.values():
            if user.username.lower() == username.lower():
                return user
        return None
    
    def remove_user(self, user_id: int) -> None:
        """
        Soft delete: move to terminated status.
        Encapsulates removal logic with business rules.  # Encapsulation
        """
        user = self.get_user(user_id)
        user.change_status(EmploymentStatus.TERMINATED)
        self.__archived_users[user_id] = user
        del self.__users[user_id]
    
    def list_users(self, role: Optional[Role] = None, 
                   status: Optional[EmploymentStatus] = None) -> List[User]:
        """
        List users with optional filtering.
        Provides controlled view of internal data.  # Encapsulation
        """
        users = list(self.__users.values())
        
        if role:
            users = [u for u in users if u.role == role]
        if status:
            users = [u for u in users if u.status == status]
        
        return sorted(users, key=lambda u: (u.role.value, u.username))
    
    def list_archived_users(self) -> List[User]:
        """View terminated users"""
        return sorted(self.__archived_users.values(), key=lambda u: u.username)
    
    def authenticate(self, username: str, password: str) -> User:
        """
        Authenticate user credentials.
        Encapsulates authentication logic and security measures.  # Encapsulation
        """
        user = self.get_user_by_username(username)
        if not user:
            raise ValueError("Invalid username or password.")
        
        if user.status != EmploymentStatus.ACTIVE:
            raise ValueError(f"Account is {user.status.value}. Contact administrator.")
        
        if not user.verify_password(password):
            user.record_failed_login()
            raise ValueError("Invalid username or password.")
        
        user.record_login()
        return user
    
    # Public read-only properties for system statistics
    @property
    def total_users(self) -> int:
        """Total active users"""
        return len(self.__users)
    
    @property
    def total_archived(self) -> int:
        """Total archived users"""
        return len(self.__archived_users)
    
    def get_statistics(self) -> Dict[str, int]:
        """
        Get system statistics.
        Provides safe aggregate data without exposing internal structure.  # Encapsulation
        """
        stats = {
            "total_active": len(self.__users),
            "total_archived": len(self.__archived_users),
        }
        
        for role in Role:
            count = sum(1 for u in self.__users.values() if u.role == role)
            stats[f"role_{role.value.lower()}"] = count
        
        for status in EmploymentStatus:
            count = sum(1 for u in self.__users.values() if u.status == status)
            stats[f"status_{status.value.lower()}"] = count
        
        return stats


# ===== Terminal UI (menu-driven) =====
def _print_header_block(name: str, section: str, system: str) -> None:
    print("===")
    print(name)
    print(section)
    print("")
    print(system)
    print("==")


def _print_reflection() -> None:
    print("\n--- Reflection (Activity 2 Guide Questions) ---\n")
    print("a) How did you apply Encapsulation in your chosen entity?")
    print("   Encapsulation was applied by using private attributes (double underscore prefix) like __password_hash,")
    print("   __login_attempts, __status, and __users dictionary. These attributes cannot be accessed directly from")
    print("   outside the class. All data modifications must go through controlled public methods that include")
    print("   validation and business rules. For example, passwords are stored as hashes in __password_hash and can")
    print("   only be verified through verify_password() method, never retrieved directly. The UserManagementSystem")
    print("   class encapsulates the entire user database in __users dict, preventing external code from manipulating")
    print("   it directly and ensuring data integrity through validated methods like add_user() and remove_user().")
    print("\nb) How did you demonstrate Abstraction?")
    print("   Abstraction was demonstrated by hiding complex implementation details behind simple public interfaces.")
    print("   The __hash_password() private method abstracts away the complexity of SHA-256 password hashing - users")
    print("   of the class simply call verify_password() or change_password() without needing to know how hashing")
    print("   works. The authenticate() method abstracts the entire login process including password verification,")
    print("   status checking, and attempt tracking into a single simple call. The __get_next_id() private method")
    print("   abstracts ID generation logic. External code interacts with clean, simple methods while all the")
    print("   complex validation, security, and data management logic remains hidden inside the class.")
    print("\nc) How is Inheritance used in your design?")
    print("   Inheritance is demonstrated through the BaseStaff parent class, which provides common functionality")
    print("   like get_role_description() and get_permissions() that all staff members share. The User class inherits")
    print("   from BaseStaff, establishing an 'is-a' relationship (User IS-A BaseStaff). This allows User to reuse")
    print("   the base functionality while extending it with specific user management features. The inheritance")
    print("   hierarchy enables code reuse and establishes a clear relationship between general staff concepts and")
    print("   specific user implementations. This design allows for future extensions like TemporaryStaff or")
    print("   ContractStaff that could also inherit from BaseStaff.")
    print("\nd) How did you apply Polymorphism, and what makes it different from the other pillars?")
    print("   Polymorphism is applied through method overriding - the User class overrides get_role_description()")
    print("   and get_permissions() from BaseStaff to provide role-specific behavior. The same method name produces")
    print("   different results based on the user's role (CHEF, CASHIER, WAITER, etc.). For example, calling")
    print("   get_permissions() on a MANAGER returns different permissions than calling it on a WAITER, even though")
    print("   it's the same method interface. What makes polymorphism different is that it focuses on behavior")
    print("   variation through a common interface, while Encapsulation focuses on data hiding, Abstraction on")
    print("   hiding complexity, and Inheritance on code reuse through parent-child relationships. Polymorphism")
    print("   enables flexible, extensible code where new roles can be added without changing existing code.")
    print("\ne) Why is understanding and applying these OOP principles important in real-world system development?")
    print("   Understanding OOP principles is crucial for building maintainable, secure, and scalable systems.")
    print("   In real restaurant management: (1) Encapsulation protects sensitive staff data like passwords and")
    print("   prevents unauthorized modifications, ensuring security and data integrity. (2) Abstraction simplifies")
    print("   complex operations - managers don't need to understand password hashing to use the authentication")
    print("   system. (3) Inheritance enables code reuse, reducing bugs and development time when adding new staff")
    print("   types. (4) Polymorphism allows treating different staff roles uniformly while maintaining their unique")
    print("   behaviors, making the system flexible and extensible. Together, these principles create systems that")
    print("   are easier to maintain, test, debug, and extend - critical for long-term business applications where")
    print("   requirements change frequently and security is paramount.")


def _input_int(prompt: str) -> int:
    while True:
        try:
            return int(input(prompt).strip())
        except ValueError:
            print("Enter a valid integer.")


def _pause() -> None:
    input("\nPress Enter to continue...")


def _print_user_list(title: str, users: List[User]) -> None:
    print(f"\n{title} ({len(users)})")
    if not users:
        print("  [none]")
        return
    for u in users:
        print(f"  - ID={u.user_id} | {u.username} | {u.full_name} | {u.role.value} | {u.status.value}")


def run_cli() -> None:
    # Identification
    name_line = "Jomnabi G. Madridano Jr. & Mary Hannah Caryl Reyes"
    section_line = "BSIT 4F-G2"
    system_line = "Restaurant Management System - User Management"
    
    system = UserManagementSystem()
    
    # Seed sample data
    system.add_user("chef_john", "pass123", "John Smith", Role.CHEF, "john@resto.com", "1234567890")
    system.add_user("cashier_mary", "pass123", "Mary Johnson", Role.CASHIER, "mary@resto.com", "1234567891")
    system.add_user("waiter_bob", "pass123", "Bob Williams", Role.WAITER, "bob@resto.com", "1234567892")
    system.add_user("guard_mike", "pass123", "Mike Brown", Role.SECURITY_GUARD, "mike@resto.com", "1234567893")
    
    print("Sample users created with password: pass123\n")
    
    while True:
        print("\n=== User Management System ===")
        stats = system.get_statistics()
        print(f"Active Users: {stats['total_active']} | Archived: {stats['total_archived']}")
        print(f"Chefs: {stats['role_chef']} | Cashiers: {stats['role_cashier']} | Waiters: {stats['role_waiter']} | Guards: {stats['role_security_guard']}")
        print("\n1) Add new user")
        print("2) View all users")
        print("3) View users by role")
        print("4) Update user info (email/phone)")
        print("5) Change user password")
        print("6) Change user status")
        print("7) Remove user (terminate)")
        print("8) View archived users")
        print("9) Authenticate user (login test)")
        print("10) View user details")
        print("11) System statistics")
        print("12) View role description and permissions (Polymorphism demo)")
        print("0) Exit (print reflection and ID block)")
        
        cmd = input("Select option: ").strip()
        
        try:
            if cmd == "1":
                username = input("Username (min 3 chars): ").strip()
                password = input("Password (min 6 chars): ").strip()
                full_name = input("Full name: ").strip()
                print("Role: 1) CHEF  2) CASHIER  3) WAITER  4) SECURITY_GUARD  5) MANAGER")
                role_choice = input("Select role: ").strip()
                role_map = {"1": Role.CHEF, "2": Role.CASHIER, "3": Role.WAITER, 
                           "4": Role.SECURITY_GUARD, "5": Role.MANAGER}
                role = role_map.get(role_choice)
                if not role:
                    print("Invalid role selection.")
                    _pause()
                    continue
                email = input("Email: ").strip()
                phone = input("Phone: ").strip()
                
                user = system.add_user(username, password, full_name, role, email, phone)
                print(f"User created successfully! ID: {user.user_id}")
                _pause()
            
            elif cmd == "2":
                _print_user_list("All Active Users", system.list_users())
                _pause()
            
            elif cmd == "3":
                print("Filter by role: 1) CHEF  2) CASHIER  3) WAITER  4) SECURITY_GUARD  5) MANAGER")
                role_choice = input("Select role: ").strip()
                role_map = {"1": Role.CHEF, "2": Role.CASHIER, "3": Role.WAITER, 
                           "4": Role.SECURITY_GUARD, "5": Role.MANAGER}
                role = role_map.get(role_choice)
                if not role:
                    print("Invalid role selection.")
                else:
                    _print_user_list(f"{role.value} Users", system.list_users(role=role))
                _pause()
            
            elif cmd == "4":
                user_id = _input_int("User ID: ")
                user = system.get_user(user_id)
                print(f"Current email: {user.email}")
                print(f"Current phone: {user.phone}")
                print("1) Update email  2) Update phone  3) Both")
                choice = input("Select: ").strip()
                
                if choice in ["1", "3"]:
                    new_email = input("New email: ").strip()
                    user.email = new_email
                    print("Email updated.")
                
                if choice in ["2", "3"]:
                    new_phone = input("New phone: ").strip()
                    user.phone = new_phone
                    print("Phone updated.")
                _pause()
            
            elif cmd == "5":
                user_id = _input_int("User ID: ")
                user = system.get_user(user_id)
                print("1) User password change  2) Admin reset")
                choice = input("Select: ").strip()
                
                if choice == "1":
                    old_pass = input("Old password: ").strip()
                    new_pass = input("New password: ").strip()
                    user.change_password(old_pass, new_pass)
                    print("Password changed successfully.")
                elif choice == "2":
                    new_pass = input("New password: ").strip()
                    user.reset_password(new_pass)
                    print("Password reset successfully.")
                _pause()
            
            elif cmd == "6":
                user_id = _input_int("User ID: ")
                user = system.get_user(user_id)
                print(f"Current status: {user.status.value}")
                print("New status: 1) ACTIVE  2) ON_LEAVE  3) SUSPENDED")
                choice = input("Select: ").strip()
                status_map = {"1": EmploymentStatus.ACTIVE, "2": EmploymentStatus.ON_LEAVE, 
                             "3": EmploymentStatus.SUSPENDED}
                new_status = status_map.get(choice)
                if not new_status:
                    print("Invalid status selection.")
                else:
                    user.change_status(new_status)
                    print(f"Status changed to {new_status.value}")
                _pause()
            
            elif cmd == "7":
                user_id = _input_int("User ID to terminate: ")
                user = system.get_user(user_id)
                confirm = input(f"Terminate user '{user.username}'? (yes/no): ").strip().lower()
                if confirm == "yes":
                    system.remove_user(user_id)
                    print("User terminated and archived.")
                else:
                    print("Cancelled.")
                _pause()
            
            elif cmd == "8":
                _print_user_list("Archived (Terminated) Users", system.list_archived_users())
                _pause()
            
            elif cmd == "9":
                username = input("Username: ").strip()
                password = input("Password: ").strip()
                user = system.authenticate(username, password)
                print(f"✓ Authentication successful!")
                print(f"Welcome, {user.full_name} ({user.role.value})")
                print(f"Last login: {user.last_login or 'First time'}")
                _pause()
            
            elif cmd == "10":
                user_id = _input_int("User ID: ")
                user = system.get_user(user_id)
                profile = user.get_profile()
                print(f"\n--- User Details ---")
                print(f"ID: {profile.user_id}")
                print(f"Username: {profile.username}")
                print(f"Full Name: {profile.full_name}")
                print(f"Role: {profile.role.value}")
                print(f"Email: {profile.email}")
                print(f"Phone: {profile.phone}")
                print(f"Hire Date: {profile.hire_date}")
                print(f"Status: {user.status.value}")
                print(f"Last Login: {user.last_login or 'Never'}")
                print(f"Failed Login Attempts: {user.get_login_attempts()}")
                _pause()
            
            elif cmd == "11":
                stats = system.get_statistics()
                print("\n--- System Statistics ---")
                print(f"Total Active Users: {stats['total_active']}")
                print(f"Total Archived Users: {stats['total_archived']}")
                print("\nBy Role:")
                print(f"  Chefs: {stats['role_chef']}")
                print(f"  Cashiers: {stats['role_cashier']}")
                print(f"  Waiters: {stats['role_waiter']}")
                print(f"  Security Guards: {stats['role_security_guard']}")
                print(f"  Managers: {stats['role_manager']}")
                print("\nBy Status:")
                print(f"  Active: {stats['status_active']}")
                print(f"  On Leave: {stats['status_on_leave']}")
                print(f"  Suspended: {stats['status_suspended']}")
                print(f"  Terminated: {stats['status_terminated']}")
                _pause()
            
            elif cmd == "12":
                user_id = _input_int("User ID: ")
                user = system.get_user(user_id)
                print(f"\n--- Polymorphism Demonstration ---")
                print(f"User: {user.full_name} ({user.role.value})")
                print(f"\nRole Description:")
                print(f"  {user.get_role_description()}")
                print(f"\nPermissions:")
                for perm in user.get_permissions():
                    print(f"  - {perm}")
                print(f"\nThis demonstrates polymorphism: the same method get_role_description()")
                print(f"and get_permissions() return different results based on the user's role.")
                _pause()
            
            elif cmd == "0":
                _print_reflection()
                print()
                _print_header_block(name_line, section_line, system_line)
                break
            
            else:
                print("Invalid option.")
                _pause()
        
        except Exception as e:
            print(f"Error: {e}")
            _pause()


if __name__ == "__main__":
    run_cli()
