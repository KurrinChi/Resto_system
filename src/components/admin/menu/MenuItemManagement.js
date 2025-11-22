import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { menuApi } from '../../../services/apiservice';
import { MenuItemModal } from './MenuItemModal';
import { MenuItemTable } from './MenuItemTable';
import { Plus, Search } from 'lucide-react';
import { THEME } from '../../../constants/theme';
export const MenuItemManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const categories = ['All', 'Starters', 'Soups', 'Mains', 'Grills', 'Specialties', 'Pasta', 'Sides', 'Desserts', 'Drinks', 'Cocktails'];
    // Fetch menu items
    const fetchMenuItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await menuApi.getAll();
            if (response.success && Array.isArray(response.data)) {
                const transformedItems = response.data.map((item) => ({
                    ...item,
                    image: item.image_url
                }));
                setMenuItems(transformedItems);
                applyFilters(transformedItems);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
        }
        finally {
            setLoading(false);
        }
    };
    // Apply filters
    const applyFilters = (items) => {
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
            filtered = filtered.filter(item => item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query));
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
    const handleSaveMenuItem = async (itemData, imageFile) => {
        try {
            if (editingItem) {
                await menuApi.update(editingItem.id, itemData, imageFile);
            }
            else {
                await menuApi.create(itemData, imageFile);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchMenuItems();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save menu item');
        }
    };
    // Handle delete menu item
    const handleDeleteMenuItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?'))
            return;
        try {
            await menuApi.delete(itemId);
            fetchMenuItems();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete menu item');
        }
    };
    // Handle edit
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };
    // Handle close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };
    return (_jsxs("div", { className: "flex flex-col gap-6 p-6", style: { backgroundColor: THEME.colors.background.primary }, children: [_jsxs("div", { className: "flex items-center justify-between p-6 rounded-lg", style: { backgroundColor: THEME.colors.background.secondary, borderLeft: `4px solid ${THEME.colors.primary.DEFAULT}` }, children: [_jsx("h1", { className: "text-3xl font-bold", style: { color: THEME.colors.text.primary }, children: "Menu Management" }), _jsxs("button", { onClick: () => {
                            setEditingItem(null);
                            setIsModalOpen(true);
                        }, className: "flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity", style: { backgroundColor: THEME.colors.primary.DEFAULT }, children: [_jsx(Plus, { className: "w-5 h-5" }), "Add Menu Item"] })] }), error && (_jsxs("div", { className: "px-4 py-3 rounded border-l-4", style: { backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.status.error, color: THEME.colors.status.error }, children: [error, _jsx("button", { onClick: () => setError(null), className: "ml-2 font-bold", children: "\u00D7" })] })), _jsxs("div", { className: "rounded-lg p-4 space-y-4", style: { backgroundColor: THEME.colors.background.secondary }, children: [_jsxs("div", { className: "flex items-center gap-2 rounded-lg px-3 py-2", style: { backgroundColor: THEME.colors.background.tertiary, borderBottom: `1px solid ${THEME.colors.border.DEFAULT}` }, children: [_jsx(Search, { className: "w-5 h-5", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "text", placeholder: "Search menu items...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "flex-1 outline-none", style: { backgroundColor: 'transparent', color: THEME.colors.text.primary } })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: categories.map(category => (_jsx("button", { onClick: () => setSelectedCategory(category), className: "px-3 py-1 rounded-full text-sm font-medium transition-colors", style: {
                                backgroundColor: selectedCategory === category ? THEME.colors.primary.DEFAULT : THEME.colors.background.tertiary,
                                color: selectedCategory === category ? '#f5e6e6' : THEME.colors.text.secondary,
                                border: selectedCategory === category ? 'none' : `1px solid ${THEME.colors.border.DEFAULT}`
                            }, children: category }, category))) }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: showAvailableOnly, onChange: (e) => setShowAvailableOnly(e.target.checked), className: "w-4 h-4 rounded" }), _jsx("span", { className: "text-sm font-medium", style: { color: THEME.colors.text.primary }, children: "Show available items only" })] })] }), loading ? (_jsx("div", { className: "text-center py-8", style: { color: THEME.colors.text.tertiary }, children: "Loading..." })) : (_jsx(MenuItemTable, { items: filteredItems, onEdit: handleEdit, onDelete: handleDeleteMenuItem })), isModalOpen && (_jsx(MenuItemModal, { item: editingItem, onSave: handleSaveMenuItem, onClose: handleCloseModal }))] }));
};
