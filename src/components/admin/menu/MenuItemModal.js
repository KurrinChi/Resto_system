import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Modal } from "../../common/Modal";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { THEME } from "../../../constants/theme";
export const MenuItemModal = ({ isOpen, onClose, onSave, menuItem, }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category: "",
        availability: "available",
        preparationTime: 0,
        ingredients: [],
    });
    const [ingredientInput, setIngredientInput] = useState("");
    useEffect(() => {
        if (menuItem) {
            setFormData(menuItem);
        }
        else {
            setFormData({
                name: "",
                description: "",
                price: 0,
                category: "",
                availability: "available",
                preparationTime: 0,
                ingredients: [],
            });
        }
    }, [menuItem, isOpen]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: menuItem?.id || "",
        });
    };
    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setFormData({
                ...formData,
                ingredients: [...(formData.ingredients || []), ingredientInput.trim()],
            });
            setIngredientInput("");
        }
    };
    const handleRemoveIngredient = (index) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients?.filter((_, i) => i !== index),
        });
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: menuItem ? "Edit Menu Item" : "Add New Menu Item", maxWidth: "lg", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "secondary", onClick: onClose, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, children: menuItem ? "Save Changes" : "Add Item" })] }), children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { label: "Item Name", placeholder: "Enter item name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: THEME.colors.text.primary }, children: "Description" }), _jsx("textarea", { placeholder: "Enter item description", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                backgroundColor: THEME.colors.background.tertiary,
                                color: THEME.colors.text.primary,
                                borderWidth: "1px",
                                borderColor: THEME.colors.border.DEFAULT,
                            }, rows: 3, required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "Price ($)", type: "number", step: "0.01", placeholder: "0.00", value: formData.price, onChange: (e) => setFormData({ ...formData, price: parseFloat(e.target.value) }), required: true }), _jsx(Input, { label: "Preparation Time (minutes)", type: "number", placeholder: "0", value: formData.preparationTime, onChange: (e) => setFormData({
                                ...formData,
                                preparationTime: parseInt(e.target.value),
                            }), required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "Category", placeholder: "e.g., Burgers, Pizza", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), required: true }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: THEME.colors.text.primary }, children: "Availability" }), _jsxs("select", { value: formData.availability, onChange: (e) => setFormData({
                                        ...formData,
                                        availability: e.target.value,
                                    }), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                        backgroundColor: THEME.colors.background.tertiary,
                                        color: THEME.colors.text.primary,
                                        borderWidth: "1px",
                                        borderColor: THEME.colors.border.DEFAULT,
                                    }, required: true, children: [_jsx("option", { value: "available", children: "Available" }), _jsx("option", { value: "out_of_stock", children: "Out of Stock" }), _jsx("option", { value: "discontinued", children: "Discontinued" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: THEME.colors.text.primary }, children: "Ingredients" }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("input", { type: "text", placeholder: "Add ingredient", value: ingredientInput, onChange: (e) => setIngredientInput(e.target.value), onKeyPress: (e) => e.key === "Enter" && (e.preventDefault(), handleAddIngredient()), className: "flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                        backgroundColor: THEME.colors.background.tertiary,
                                        color: THEME.colors.text.primary,
                                        borderWidth: "1px",
                                        borderColor: THEME.colors.border.DEFAULT,
                                    } }), _jsx(Button, { type: "button", onClick: handleAddIngredient, size: "sm", children: "Add" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: formData.ingredients?.map((ingredient, index) => (_jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm", style: {
                                    backgroundColor: THEME.colors.primary.DEFAULT,
                                    color: THEME.colors.text.primary,
                                }, children: [ingredient, _jsx("button", { type: "button", onClick: () => handleRemoveIngredient(index), className: "ml-1 hover:opacity-80 transition-opacity", style: { color: THEME.colors.text.primary }, children: _jsx(X, { className: "w-3 h-3" }) })] }, index))) })] })] }) }));
};
