import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Modal } from "../../common/Modal";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { THEME } from "../../../constants/theme";
import type { MenuItem } from "../../../types";

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (menuItem: MenuItem) => void;
  menuItem: MenuItem | null;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  menuItem,
}) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
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
    } else {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: menuItem?.id || "",
    } as MenuItem);
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

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((_, i) => i !== index),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={menuItem ? "Edit Menu Item" : "Add New Menu Item"}
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {menuItem ? "Save Changes" : "Add Item"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item Name"
          placeholder="Enter item name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: THEME.colors.text.primary }}
          >
            Description
          </label>
          <textarea
            placeholder="Enter item description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: THEME.colors.background.tertiary,
              color: THEME.colors.text.primary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            required
          />

          <Input
            label="Preparation Time (minutes)"
            type="number"
            placeholder="0"
            value={formData.preparationTime}
            onChange={(e) =>
              setFormData({
                ...formData,
                preparationTime: parseInt(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            placeholder="e.g., Burgers, Pizza"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: THEME.colors.text.primary }}
            >
              Availability
            </label>
            <select
              value={formData.availability}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availability: e.target.value as any,
                })
              }
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                color: THEME.colors.text.primary,
                borderWidth: "1px",
                borderColor: THEME.colors.border.DEFAULT,
              }}
              required
            >
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: THEME.colors.text.primary }}
          >
            Ingredients
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add ingredient"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddIngredient())
              }
              className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                color: THEME.colors.text.primary,
                borderWidth: "1px",
                borderColor: THEME.colors.border.DEFAULT,
              }}
            />
            <Button type="button" onClick={handleAddIngredient} size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.ingredients?.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: THEME.colors.primary.DEFAULT,
                  color: THEME.colors.text.primary,
                }}
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="ml-1 hover:opacity-80 transition-opacity"
                  style={{ color: THEME.colors.text.primary }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
