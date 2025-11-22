import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface MenuItemTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

const ITEMS_PER_PAGE = 10;

export const MenuItemTable: React.FC<MenuItemTableProps> = ({ items, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No menu items found</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prep Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">{item.preparation_time} min</td>
                    <td className="px-6 py-4">
                      {item.available ? (
                        <span className="inline-block px-2 py-1 text-sm bg-green-100 text-green-700 rounded">
                          Available
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-sm bg-red-100 text-red-700 rounded">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({items.length} items)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
