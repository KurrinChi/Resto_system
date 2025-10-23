import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../common/Button.tsx";
import { SearchBar } from "../../common/SearchBar.tsx";
import { MenuItemTable } from "./MenuItemTable.tsx";
import { MenuItemModal } from "./MenuItemModal.tsx";
import { THEME } from "../../../constants/theme";
import type { MenuItem } from "../../../types/index.ts";

// Mock data
const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 12.99,
    category: "Burgers",
    availability: "available",
    preparationTime: 15,
    ingredients: ["Beef", "Lettuce", "Tomato", "Bun", "Special Sauce"],
  },
  {
    id: "2",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, basil, and tomato sauce",
    price: 14.99,
    category: "Pizza",
    availability: "available",
    preparationTime: 20,
    ingredients: ["Dough", "Mozzarella", "Basil", "Tomato Sauce"],
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Crisp romaine with parmesan and croutons",
    price: 9.99,
    category: "Salads",
    availability: "available",
    preparationTime: 10,
    ingredients: ["Romaine", "Parmesan", "Croutons", "Caesar Dressing"],
  },
  {
    id: "4",
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon and parmesan",
    price: 13.99,
    category: "Pasta",
    availability: "out_of_stock",
    preparationTime: 18,
    ingredients: ["Pasta", "Bacon", "Parmesan", "Cream", "Eggs"],
  },
  {
    id: "5",
    name: "Grilled Salmon",
    description: "Fresh salmon with herbs and lemon",
    price: 19.99,
    category: "Seafood",
    availability: "available",
    preparationTime: 25,
    ingredients: ["Salmon", "Herbs", "Lemon", "Olive Oil"],
  },
];

export const MenuItemManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");

  const categories = Array.from(
    new Set(mockMenuItems.map((item) => item.category))
  );

  const handleAddMenuItem = () => {
    setSelectedMenuItem(null);
    setIsModalOpen(true);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsModalOpen(true);
  };

  const handleDeleteMenuItem = (menuItemId: string) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== menuItemId));
    }
  };

  const handleSaveMenuItem = (menuItem: MenuItem) => {
    if (selectedMenuItem) {
      setMenuItems(
        menuItems.map((item) => (item.id === menuItem.id ? menuItem : item))
      );
    } else {
      setMenuItems([...menuItems, { ...menuItem, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesAvailability =
      filterAvailability === "all" || item.availability === filterAvailability;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: THEME.colors.text.primary }}
          >
            Menu Management
          </h2>
          <p className="mt-1" style={{ color: THEME.colors.text.secondary }}>
            Manage your restaurant menu items
          </p>
        </div>
        <Button onClick={handleAddMenuItem} icon={<Plus className="w-5 h-5" />}>
          Add Menu Item
        </Button>
      </div>

      {/* Filters and Search */}
      <div
        className="p-4 rounded-2xl border flex-shrink-0"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                color: THEME.colors.text.primary,
                borderWidth: "1px",
                borderColor: THEME.colors.border.DEFAULT,
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                color: THEME.colors.text.primary,
                borderWidth: "1px",
                borderColor: THEME.colors.border.DEFAULT,
              }}
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div
        className="rounded-2xl border overflow-hidden flex-1 flex flex-col"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <MenuItemTable
          menuItems={filteredMenuItems}
          onEdit={handleEditMenuItem}
          onDelete={handleDeleteMenuItem}
        />
      </div>

      {/* Menu Item Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMenuItem}
        menuItem={selectedMenuItem}
      />
    </div>
  );
};
