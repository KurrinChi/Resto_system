# ===
# Fernandez, Ethan Gabriel T.
# BSIT 4F-G2
#
# Restaurant Management System
# ==

from __future__ import annotations
from abc import ABC, abstractmethod  # Abstraction via abstract base class
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional


@dataclass(frozen=True)
class Table:
    """
    Value object representing a restaurant table.
    Immutable to prevent unintended mutation during operations.
    """
    table_id: int
    capacity: int
    area: str  # e.g., "Main", "VIP", "Outdoor"


class Status(Enum):
    """
    Standardized reservation availability states.
    """
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    OCCUPIED = "OCCUPIED"
    UNAVAILABLE = "UNAVAILABLE"  # e.g., cleaning, maintenance


# Abstraction: clear interface defining reservation behavior
class Tracker(ABC):
    """
    Abstract base that hides storage and policy details while exposing
    required behaviors for a reservation-style vacancy tracker.  # Abstraction
    """

    @abstractmethod
    def add_table(self, table: Table) -> None:
        ...

    @abstractmethod
    def delete_table(self, table_id: int) -> None:
        ...

    @abstractmethod
    def set_status(self, table_id: int, status: Status) -> None:
        ...

    @abstractmethod
    def list_available(self, area: Optional[str] = None) -> List[Table]:
        ...

    @abstractmethod
    def list_by_status(self, status: Status, area: Optional[str] = None) -> List[Table]:
        ...

    @abstractmethod
    def archive_table(self, table_id: int) -> None:
        ...

    @abstractmethod
    def unarchive_table(self, table_id: int, restore_status: Status = Status.UNAVAILABLE) -> None:
        ...

    @abstractmethod
    def purge_archived(self, table_id: int) -> None:
        ...

    @abstractmethod
    def next_available(self, min_capacity: int = 1, area: Optional[str] = None) -> Optional[Table]:
        ...


class VacancyTableTracker(Tracker):
    """
    Reservation-style vacancy tracker for tables.

    Encapsulation:
    - Private dicts (__tables, __status, __archived) hide internal state; mutations only via validated APIs.  # Encapsulation
    - Properties expose safe, computed summaries (total counts).  # Encapsulation

    Inheritance/Polymorphism:
    - Inherits from Tracker and can be swapped with subclasses that override strategies.  # Inheritance # Polymorphism
    """

    def __init__(self, default_area: str = "Main"):
        # Encapsulation: private state
        self.__tables: Dict[int, Table] = {}       # active tables
        self.__status: Dict[int, Status] = {}      # per-table active status
        self.__archived: Dict[int, Table] = {}     # archived tables (out of access)
        self._default_area: str = default_area     # protected-by-convention

    # Encapsulation: controlled access to a configurable default
    @property
    def default_area(self) -> str:
        return self._default_area

    @default_area.setter
    def default_area(self, value: str) -> None:
        if not value or not isinstance(value, str):
            raise ValueError("default_area must be a non-empty string.")
        self._default_area = value

    # Read-only computed summaries
    @property
    def total_active(self) -> int:
        return len(self.__tables)

    @property
    def total_archived(self) -> int:
        return len(self.__archived)

    @property
    def total_available(self) -> int:
        return sum(1 for tid in self.__tables if self.__status.get(tid) == Status.AVAILABLE)

    # Abstraction/Polymorphism: implements the Tracker interface
    def add_table(self, table: Table) -> None:
        # Encapsulation: validate before mutating private state
        if not isinstance(table, Table):
            raise TypeError("add_table expects a Table instance.")
        if table.table_id in self.__tables or table.table_id in self.__archived:
            raise ValueError(f"Table {table.table_id} already exists (active or archived).")
        if table.capacity <= 0:
            raise ValueError("Table capacity must be > 0.")
        if not table.area:
            raise ValueError("Table area must be a non-empty string.")
        self.__tables[table.table_id] = table
        self.__status[table.table_id] = Status.AVAILABLE

    def delete_table(self, table_id: int) -> None:
        """
        Permanently delete a table from active records.
        Disallows deletion if RESERVED or OCCUPIED to avoid orphaned bookings.  # Encapsulation
        """
        self.__ensure_active_exists(table_id)
        st = self.__status[table_id]
        if st in (Status.RESERVED, Status.OCCUPIED):
            raise ValueError("Cannot delete a RESERVED or OCCUPIED table; free it first.")
        del self.__tables[table_id]
        del self.__status[table_id]

    # Convenience helpers for common reservation actions
    def reserve(self, table_id: int) -> None:
        self.set_status(table_id, Status.RESERVED)

    def cancel_reservation(self, table_id: int) -> None:
        self.set_status(table_id, Status.AVAILABLE)

    def occupy(self, table_id: int) -> None:
        self.set_status(table_id, Status.OCCUPIED)

    def vacate(self, table_id: int) -> None:
        self.set_status(table_id, Status.AVAILABLE)

    def set_available(self, table_id: int, available: bool) -> None:
        self.set_status(table_id, Status.AVAILABLE if available else Status.UNAVAILABLE)

    def set_status(self, table_id: int, status: Status) -> None:
        self.__ensure_active_exists(table_id)
        if status not in Status:
            raise ValueError("Invalid status.")
        # Example rule: cannot move directly from OCCUPIED to RESERVED without vacating
        current = self.__status[table_id]
        if current == Status.OCCUPIED and status == Status.RESERVED:
            raise ValueError("Cannot set RESERVED from OCCUPIED; vacate first.")
        self.__status[table_id] = status

    def list_available(self, area: Optional[str] = None) -> List[Table]:
        target_area = area
        candidates = [
            t for t in self.__tables.values()
            if self.__status.get(t.table_id) == Status.AVAILABLE
            and (target_area is None or t.area == target_area)
        ]
        return sorted(candidates, key=lambda t: (t.area, t.capacity, t.table_id))

    def list_by_status(self, status: Status, area: Optional[str] = None) -> List[Table]:
        target_area = area
        candidates = [
            t for t in self.__tables.values()
            if self.__status.get(t.table_id) == status
            and (target_area is None or t.area == target_area)
        ]
        return sorted(candidates, key=lambda t: (t.area, t.capacity, t.table_id))

    def archive_table(self, table_id: int) -> None:
        """
        Remove a table from active access but keep its record in archive.
        Disallow archiving when RESERVED or OCCUPIED to prevent orphaned bookings.  # Encapsulation
        """
        self.__ensure_active_exists(table_id)
        status = self.__status[table_id]
        if status in (Status.OCCUPIED, Status.RESERVED):
            raise ValueError("Cannot archive a RESERVED or OCCUPIED table; free it first.")
        table = self.__tables.pop(table_id)
        self.__status.pop(table_id, None)
        self.__archived[table_id] = table

    def unarchive_table(self, table_id: int, restore_status: Status = Status.UNAVAILABLE) -> None:
        if table_id not in self.__archived:
            raise KeyError(f"Table {table_id} is not in archive.")
        if table_id in self.__tables:
            raise ValueError(f"Table {table_id} already active.")
        table = self.__archived.pop(table_id)
        self.__tables[table_id] = table
        self.__status[table_id] = restore_status

    def purge_archived(self, table_id: int) -> None:
        """
        Permanently delete a table from archive (irreversible hard delete).
        """
        if table_id not in self.__archived:
            raise KeyError(f"Table {table_id} is not in archive.")
        del self.__archived[table_id]

    # Non-interface helpers for CLI
    def list_active(self) -> List[Table]:
        return sorted(self.__tables.values(), key=lambda t: (t.area, t.capacity, t.table_id))

    def list_archived(self) -> List[Table]:
        return sorted(self.__archived.values(), key=lambda t: (t.area, t.capacity, t.table_id))

    def next_available(self, min_capacity: int = 1, area: Optional[str] = None) -> Optional[Table]:
        """
        Strategy: smallest suitable AVAILABLE table first.  # Polymorphism
        """
        if min_capacity <= 0:
            raise ValueError("min_capacity must be > 0.")
        target_area = area or self._default_area
        candidates = [
            t for t in self.__tables.values()
            if self.__status.get(t.table_id) == Status.AVAILABLE
            and t.capacity >= min_capacity
            and (target_area is None or t.area == target_area)
        ]
        if not candidates:
            return None
        candidates.sort(key=lambda t: (t.capacity, t.table_id))
        return candidates[0]

    # Encapsulation: helpers hidden from public API
    def __ensure_active_exists(self, table_id: int) -> None:
        if table_id not in self.__tables:
            raise KeyError(f"Table {table_id} does not exist in active records.")


class VIPVacancyTableTracker(VacancyTableTracker):
    """
    Specialization that prioritizes VIP and larger capacities for suggestions.  # Inheritance
    """
    def next_available(self, min_capacity: int = 1, area: Optional[str] = None) -> Optional[Table]:
        """
        VIP-first strategy: prefer VIP by largest capacity, then fall back to base.  # Polymorphism
        """
        vip = self.list_by_status(Status.AVAILABLE, area="VIP")
        vip = [t for t in vip if t.capacity >= min_capacity]
        if vip:
            vip.sort(key=lambda t: (-t.capacity, t.table_id))
            return vip[0]
        return super().next_available(min_capacity=min_capacity, area=area)


# ===== Terminal UI (menu-driven) =====
def _print_header_block(names: List[str], section: str, system: str) -> None:
    print("===")
    for line in names:
        print(line)
    print(section)
    print("")
    print(system)
    print("==")


def _print_reflection() -> None:
    print("\n--- Reflection (Activity 2 Guide Questions) ---\n")
    print("a) Encapsulation: Private dicts (__tables, __status, __archived) hide internal state and only validated methods mutate them; rules prevent archiving/deleting occupied or reserved tables and enforce safe status transitions.")
    print("b) Abstraction: The abstract Tracker defines the reservation contract (add, delete, set_status, list, archive, next_available) so callers rely on behavior without knowing storage details.")
    print("c) Inheritance: VacancyTableTracker implements Tracker, and VIPVacancyTableTracker extends it to reuse logic while customizing suggestion strategy.")
    print("d) Polymorphism: Both trackers share the same interface but VIP overrides next_available; the caller can swap implementations with no code changes.")
    print("e) Importance: These OOP principles localize change, reduce bugs, and make policy shifts (e.g., VIP priority, archive rules) easy to implement in real restaurant systems.")


def _input_int(prompt: str) -> int:
    while True:
        try:
            return int(input(prompt).strip())
        except ValueError:
            print("Enter a valid integer.")


def _pause() -> None:
    input("\nPress Enter to continue...")


def _print_table_list(title: str, tables: List[Table]) -> None:
    print(f"\n{title} ({len(tables)})")
    if not tables:
        print("  [none]")
        return
    for t in tables:
        print(f"  - ID={t.table_id} | cap={t.capacity} | area={t.area}")


def run_cli() -> None:
    # Identification block values
    names_block = [
        "Fernandez, Ethan Gabriel T.",
    ]
    section_line = "BSIT 4F-G2"
    system_line = "Restaurant Management System"

    # Choose strategy: base or VIP
    use_vip = False
    choice = input("Use VIP suggestion strategy? [Y/N]: ").strip().lower()
    use_vip = choice == "y"
    tracker: VacancyTableTracker = VIPVacancyTableTracker() if use_vip else VacancyTableTracker()

    # Seed some sample data to start with (optional for demo)
    tracker.add_table(Table(1, 2, "Main"))
    tracker.add_table(Table(2, 4, "Main"))
    tracker.add_table(Table(3, 4, "VIP"))
    tracker.add_table(Table(4, 6, "Outdoor"))

    while True:
        print("\n=== Vacancy Reservation Menu ===")
        print(f"Active: {tracker.total_active} | Archived: {tracker.total_archived} | Available: {tracker.total_available}")
        print("1) Add table")
        print("2) Delete table (active)")
        print("3) Set status (Available/Unavailable/Reserve/Cancel/Occupy/Vacate)")
        print("4) View available tables")
        print("5) View tables by status")
        print("6) Archive table")
        print("7) Unarchive table")
        print("8) Purge archived table")
        print("9) Suggest next available")
        print("10) List active and archived")
        print("0) Exit (print reflection and ID block)")
        cmd = input("Select option: ").strip()

        try:
            if cmd == "1":
                tid = _input_int("New table ID: ")
                cap = _input_int("Capacity: ")
                area = input("Area (e.g., Main/VIP/Outdoor): ").strip()
                tracker.add_table(Table(tid, cap, area))
                print("Added.")
                _pause()

            elif cmd == "2":
                tid = _input_int("Table ID to delete (active): ")
                tracker.delete_table(tid)
                print("Deleted from active records.")
                _pause()

            elif cmd == "3":
                tid = _input_int("Table ID: ")
                print("Choose status: 1) AVAILABLE  2) UNAVAILABLE  3) RESERVED  4) CANCEL RESERVATION  5) OCCUPY  6) VACATE")
                s = input("Select: ").strip()
                if s == "1":
                    tracker.set_available(tid, True)
                elif s == "2":
                    tracker.set_available(tid, False)
                elif s == "3":
                    tracker.reserve(tid)
                elif s == "4":
                    tracker.cancel_reservation(tid)
                elif s == "5":
                    tracker.occupy(tid)
                elif s == "6":
                    tracker.vacate(tid)
                else:
                    print("Invalid selection.")
                print("Updated.")
                _pause()

            elif cmd == "4":
                area = input("Filter by area (blank for any): ").strip() or None
                _print_table_list("Available", tracker.list_available(area=area))
                _pause()

            elif cmd == "5":
                print("Status to view: 1) AVAILABLE  2) UNAVAILABLE  3) RESERVED  4) OCCUPIED")
                s = input("Select: ").strip()
                mapping = {"1": Status.AVAILABLE, "2": Status.UNAVAILABLE, "3": Status.RESERVED, "4": Status.OCCUPIED}
                status = mapping.get(s)
                if not status:
                    print("Invalid selection.")
                else:
                    area = input("Filter by area (blank for any): ").strip() or None
                    _print_table_list(f"{status.value.title()}", tracker.list_by_status(status, area=area))
                _pause()

            elif cmd == "6":
                tid = _input_int("Table ID to archive: ")
                tracker.archive_table(tid)
                print("Archived (removed from access).")
                _pause()

            elif cmd == "7":
                tid = _input_int("Archived table ID to restore: ")
                print("Restore status: 1) UNAVAILABLE  2) AVAILABLE")
                rs = input("Select: ").strip()
                restore = Status.UNAVAILABLE if rs != "2" else Status.AVAILABLE
                tracker.unarchive_table(tid, restore_status=restore)
                print("Unarchived.")
                _pause()

            elif cmd == "8":
                tid = _input_int("Archived table ID to purge: ")
                tracker.purge_archived(tid)
                print("Purged from archive.")
                _pause()

            elif cmd == "9":
                min_cap = _input_int("Minimum capacity: ")
                area = input("Preferred area (blank for default): ").strip() or None
                suggestion = tracker.next_available(min_capacity=min_cap, area=area)
                print("Suggested:", suggestion if suggestion else "[none]")
                _pause()

            elif cmd == "10":
                _print_table_list("Active", tracker.list_active())
                _print_table_list("Archived", tracker.list_archived())
                _pause()

            elif cmd == "0":
                # Print required reflection and identification, then exit
                _print_reflection()
                _print_header_block(names_block, section_line, system_line)
                break

            else:
                print("Invalid option.")

        except Exception as e:
            print(f"Error: {e}")
            _pause()


if __name__ == "__main__":
    run_cli()
