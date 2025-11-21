import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../common/Button.tsx";
import { SearchBar } from "../../common/SearchBar.tsx";
import { MenuItemTable } from "./MenuItemTable.tsx";
import { MenuItemModal } from "./MenuItemModal.tsx";
import { THEME } from "../../../constants/theme";
import type { MenuItem } from "../../../types/index.ts";
import { menuApi } from "../../../services/apiservice";

export const MenuItemManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuApi.getAll();
      if (response.success) {
        // Transform Firebase data to match MenuItem interface
        const items = response.data.map((item: any) => ({
          id: item.id,
          name: item.menuName || item.name,
          description: item.description || '',
          price: item.price || 0,
          category: item.category || 'Uncategorized',
          // Fix: Check the 'available' boolean field from Firebase
          availability: item.available === true || item.available === 'true' ? 'available' : 'out_of_stock',
          preparationTime: item.preparationTime || item.preparation_time || 15,
          ingredients: item.keywords || item.ingredients || [],
          image: item.imageUrl || item.image_url || ''
        }));
        setMenuItems(items);
      }
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  const handleAddMenuItem = () => {
    setSelectedMenuItem(null);
    setIsModalOpen(true);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsModalOpen(true);
  };

  const handleDeleteMenuItem = async (menuItemId: string) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        const response = await menuApi.delete(menuItemId);
        if (response.success) {
          setMenuItems(menuItems.filter((item) => item.id !== menuItemId));
        }
      } catch (err: any) {
        alert('Error deleting menu item: ' + err.message);
      }
    }
  };

  const handleSaveMenuItem = async (menuItem: MenuItem) => {
    try {
      // Transform data to match Firebase schema
      const menuData = {
        name: menuItem.name,
        menuName: menuItem.name, // Add menuName for consistency
        description: menuItem.description,
        price: menuItem.price,
        category: menuItem.category,
        available: menuItem.availability === 'available',
        preparation_time: menuItem.preparationTime,
        ingredients: menuItem.ingredients || [],
        image_url: menuItem.image || ''
      };

      if (selectedMenuItem) {
        // Update existing item
        const response = await menuApi.update(menuItem.id, menuData);
        if (response.success) {
          // Refetch to get the latest data from Firebase
          await fetchMenuItems();
        }
      } else {
        // Create new item
        const response = await menuApi.create(menuData);
        if (response.success) {
          // Refetch to get the latest data from Firebase
          await fetchMenuItems();
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error saving menu item: ' + err.message);
    }
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
