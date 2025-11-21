import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../common/Button";
import { SearchBar } from "../../common/SearchBar";
import { MenuItemTable } from "./MenuItemTable";
import { MenuItemModal } from "./MenuItemModal";
import { THEME } from "../../../constants/theme";
import { menuApi } from "../../../services/apiservice";
export const MenuItemManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterAvailability, setFilterAvailability] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchMenuItems();
    }, []);
    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await menuApi.getAll();
            if (response.success) {
                // Transform Firebase data to match MenuItem interface
                const items = response.data.map((item) => ({
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
        }
        catch (err) {
            console.error('Error fetching menu items:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const categories = Array.from(new Set(menuItems.map((item) => item.category)));
    const handleAddMenuItem = () => {
        setSelectedMenuItem(null);
        setIsModalOpen(true);
    };
    const handleEditMenuItem = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setIsModalOpen(true);
    };
    const handleDeleteMenuItem = async (menuItemId) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            try {
                const response = await menuApi.delete(menuItemId);
                if (response.success) {
                    setMenuItems(menuItems.filter((item) => item.id !== menuItemId));
                }
            }
            catch (err) {
                alert('Error deleting menu item: ' + err.message);
            }
        }
    };
    const handleSaveMenuItem = async (menuItem) => {
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
            }
            else {
                // Create new item
                const response = await menuApi.create(menuData);
                if (response.success) {
                    // Refetch to get the latest data from Firebase
                    await fetchMenuItems();
                }
            }
            setIsModalOpen(false);
        }
        catch (err) {
            alert('Error saving menu item: ' + err.message);
        }
    };
    const filteredMenuItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || item.category === filterCategory;
        const matchesAvailability = filterAvailability === "all" || item.availability === filterAvailability;
        return matchesSearch && matchesCategory && matchesAvailability;
    });
    return (_jsxs("div", { className: "flex flex-col h-full space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Menu Management" }), _jsx("p", { className: "mt-1", style: { color: THEME.colors.text.secondary }, children: "Manage your restaurant menu items" })] }), _jsx(Button, { onClick: handleAddMenuItem, icon: _jsx(Plus, { className: "w-5 h-5" }), children: "Add Menu Item" })] }), _jsx("div", { className: "p-4 rounded-2xl border flex-shrink-0", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "md:col-span-2", children: _jsx(SearchBar, { placeholder: "Search menu items...", value: searchQuery, onChange: setSearchQuery }) }), _jsx("div", { children: _jsxs("select", { value: filterCategory, onChange: (e) => setFilterCategory(e.target.value), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                    backgroundColor: THEME.colors.background.tertiary,
                                    color: THEME.colors.text.primary,
                                    borderWidth: "1px",
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, children: [_jsx("option", { value: "all", children: "All Categories" }), categories.map((category) => (_jsx("option", { value: category, children: category }, category)))] }) }), _jsx("div", { children: _jsxs("select", { value: filterAvailability, onChange: (e) => setFilterAvailability(e.target.value), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                    backgroundColor: THEME.colors.background.tertiary,
                                    color: THEME.colors.text.primary,
                                    borderWidth: "1px",
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, children: [_jsx("option", { value: "all", children: "All Availability" }), _jsx("option", { value: "available", children: "Available" }), _jsx("option", { value: "out_of_stock", children: "Out of Stock" }), _jsx("option", { value: "discontinued", children: "Discontinued" })] }) })] }) }), _jsx("div", { className: "rounded-2xl border overflow-hidden flex-1 flex flex-col", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsx(MenuItemTable, { menuItems: filteredMenuItems, onEdit: handleEditMenuItem, onDelete: handleDeleteMenuItem }) }), _jsx(MenuItemModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onSave: handleSaveMenuItem, menuItem: selectedMenuItem })] }));
};
