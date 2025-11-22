import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
export const MenuItemModal = ({ item, onSave, onClose }) => {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Starters',
        available: true,
        preparation_time: '15',
        ingredients: [],
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [ingredientInput, setIngredientInput] = useState('');
    const [loading, setLoading] = useState(false);
    const categories = ['Starters', 'Soups', 'Mains', 'Grills', 'Specialties', 'Pasta', 'Sides', 'Desserts', 'Drinks', 'Cocktails'];
    // Initialize form with existing item data
    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                price: String(item.price || ''),
                category: item.category || 'Starters',
                available: item.available !== false,
                preparation_time: String(item.preparation_time || '15'),
                ingredients: item.ingredients || [],
            });
            if (item.image_url) {
                setImagePreview(item.image_url);
            }
        }
    }, [item]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: e.target.checked
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const handleImageDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    };
    const handleImageDragLeave = (e) => {
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    };
    const handleImageDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            processImageFile(files[0]);
        }
    };
    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processImageFile(e.target.files[0]);
        }
    };
    const processImageFile = (file) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result);
        };
        reader.readAsDataURL(file);
    };
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ingredientInput.trim()]
            }));
            setIngredientInput('');
        }
    };
    const handleRemoveIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (!formData.name.trim()) {
            alert('Please enter item name');
            return;
        }
        if (!formData.price) {
            alert('Please enter price');
            return;
        }
        if (parseFloat(formData.price) < 0) {
            alert('Price must be positive');
            return;
        }
        setLoading(true);
        try {
            await onSave(formData, imageFile || undefined);
        }
        catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to save menu item');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b sticky top-0 bg-white", children: [_jsx("h2", { className: "text-xl font-bold", children: item ? 'Edit Menu Item' : 'Add Menu Item' }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Item Image" }), _jsxs("div", { onDragOver: handleImageDragOver, onDragLeave: handleImageDragLeave, onDrop: handleImageDrop, className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-blue-500", onClick: () => fileInputRef.current?.click(), children: [imagePreview ? (_jsxs("div", { className: "relative", children: [_jsx("img", { src: imagePreview, alt: "Preview", className: "w-32 h-32 object-cover mx-auto rounded" }), _jsx("button", { type: "button", onClick: (e) => {
                                                        e.stopPropagation();
                                                        handleRemoveImage();
                                                    }, className: "absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) : (_jsxs("div", { children: [_jsx(Upload, { className: "w-8 h-8 mx-auto text-gray-400 mb-2" }), _jsx("p", { className: "text-sm text-gray-600", children: "Drag image here or click to select" })] })), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageSelect, className: "hidden" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Item Name" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, className: "w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500", placeholder: "e.g., Butter Chicken" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleInputChange, className: "w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none", rows: 3, placeholder: "Item description..." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Price (\u20B9)" }), _jsx("input", { type: "number", name: "price", value: formData.price, onChange: handleInputChange, className: "w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500", placeholder: "0.00", step: "0.01", min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Prep Time (mins)" }), _jsx("input", { type: "number", name: "preparation_time", value: formData.preparation_time, onChange: handleInputChange, className: "w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500", placeholder: "15", min: "0" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Category" }), _jsx("select", { name: "category", value: formData.category, onChange: handleInputChange, className: "w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500", children: categories.map(cat => (_jsx("option", { value: cat, children: cat }, cat))) })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", name: "available", checked: formData.available, onChange: handleInputChange, className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: "Available for sale" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Ingredients" }), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx("input", { type: "text", value: ingredientInput, onChange: (e) => setIngredientInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient()), className: "flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Add ingredient..." }), _jsx("button", { type: "button", onClick: handleAddIngredient, className: "bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700", children: "Add" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: formData.ingredients.map((ing, idx) => (_jsxs("div", { className: "bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2", children: [_jsx("span", { children: ing }), _jsx("button", { type: "button", onClick: () => handleRemoveIngredient(idx), className: "hover:text-blue-900", children: "\u00D7" })] }, idx))) })] }), _jsxs("div", { className: "flex gap-3 pt-4 border-t", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50", children: "Cancel" }), _jsx("button", { type: "submit", disabled: loading, className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50", children: loading ? 'Saving...' : item ? 'Update Item' : 'Add Item' })] })] })] }) }));
};
