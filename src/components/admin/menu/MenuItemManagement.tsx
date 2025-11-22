import React, { useState, useEffect } from 'react';
import { menuApi } from '../../../services/apiservice';
import { MenuItemModal } from './MenuItemModal';
import { MenuItemTable } from './MenuItemTable';
import { Plus, Search } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  preparation_time: number;
  ingredients: string[];
  image_url?: string;
}

export const MenuItemManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = ['All', 'Starters', 'Soups', 'Mains', 'Grills', 'Specialties', 'Pasta', 'Sides', 'Desserts', 'Drinks', 'Cocktails'];

  // Fetch menu items
  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await menuApi.getAll();
      if (response.success && Array.isArray(response.data)) {
        const transformedItems = response.data.map((item: any) => ({
          ...item,
          image: item.image_url // Map image_url to image for display
        }));
        setMenuItems(transformedItems);
        applyFilters(transformedItems);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = (items: MenuItem[]) => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by availability
    if (showAvailableOnly) {
      filtered = filtered.filter(item => item.available);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  // Fetch on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Apply filters when criteria change
  useEffect(() => {
    applyFilters(menuItems);
  }, [searchQuery, selectedCategory, showAvailableOnly]);

  // Handle save menu item
  const handleSaveMenuItem = async (itemData: any, imageFile?: File) => {
    try {
      if (editingItem) {
        await menuApi.update(editingItem.id, itemData, imageFile);
      } else {
        await menuApi.create(itemData, imageFile);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchMenuItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save menu item');
    }
  };

  // Handle delete menu item
  const handleDeleteMenuItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await menuApi.delete(itemId);
      fetchMenuItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
    }
  };

  // Handle edit
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Availability Filter */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Show available items only</span>
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <p>Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No menu items found. Try adjusting your filters or add a new item.</p>
          </div>
        ) : (
          <MenuItemTable
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={handleDeleteMenuItem}
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <MenuItemModal
          item={editingItem}
          onSave={handleSaveMenuItem}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
