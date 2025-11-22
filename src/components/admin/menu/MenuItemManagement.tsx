import React, { useState, useEffect } from 'react';
import { menuApi } from '../../../services/apiservice';
import { MenuItemModal } from './MenuItemModal';
import { MenuItemTable } from './MenuItemTable';
import { Plus, Search } from 'lucide-react';
import { THEME } from '../../../constants/theme';

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
          image: item.image_url
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
  }, [searchQuery, selectedCategory, showAvailableOnly, menuItems]);

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
    <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: THEME.colors.background.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-lg" style={{ backgroundColor: THEME.colors.background.secondary, borderLeft: `4px solid ${THEME.colors.primary.DEFAULT}` }}>
        <h1 className="text-3xl font-bold" style={{ color: THEME.colors.text.primary }}>Menu Management</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: THEME.colors.primary.DEFAULT }}
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-3 rounded border-l-4" style={{ backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.status.error, color: THEME.colors.status.error }}>
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg p-4 space-y-4" style={{ backgroundColor: THEME.colors.background.secondary }}>
        {/* Search */}
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: THEME.colors.background.tertiary, borderBottom: `1px solid ${THEME.colors.border.DEFAULT}` }}>
          <Search className="w-5 h-5" style={{ color: THEME.colors.text.tertiary }} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none"
            style={{ backgroundColor: 'transparent', color: THEME.colors.text.primary }}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: selectedCategory === category ? THEME.colors.primary.DEFAULT : THEME.colors.background.tertiary,
                color: selectedCategory === category ? '#f5e6e6' : THEME.colors.text.secondary,
                border: selectedCategory === category ? 'none' : `1px solid ${THEME.colors.border.DEFAULT}`
              }}
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
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-medium" style={{ color: THEME.colors.text.primary }}>Show available items only</span>
        </label>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8" style={{ color: THEME.colors.text.tertiary }}>Loading...</div>
      ) : (
        <MenuItemTable
          items={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDeleteMenuItem}
        />
      )}

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
