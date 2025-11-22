import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';

interface MenuItemModalProps {
    item?: any;
    onSave: (data: any, imageFile?: File) => Promise<void>;
    onClose: () => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onSave, onClose }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Starters',
        available: true,
        preparation_time: '15',
        ingredients: [] as string[],
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      processImageFile(files[0]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const processImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
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

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">{item ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Item Image</label>
            <div
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-blue-500"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Drag image here or click to select</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Butter Chicken"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Item description..."
            />
          </div>

          {/* Price and Prep Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prep Time (mins)</label>
              <input
                type="number"
                name="preparation_time"
                value={formData.preparation_time}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15"
                min="0"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Available for sale</span>
          </label>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium mb-2">Ingredients</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add ingredient..."
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
