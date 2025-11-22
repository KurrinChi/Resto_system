import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: THEME.colors.background.secondary }}>
      {items.length === 0 ? (
        <div className="text-center py-12" style={{ color: THEME.colors.text.tertiary }}>
          <p className="text-lg">No menu items found</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: THEME.colors.background.tertiary, borderBottom: `1px solid ${THEME.colors.border.DEFAULT}` }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: THEME.colors.text.primary }}>Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: THEME.colors.text.primary }}>Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: THEME.colors.text.primary }}>Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: THEME.colors.text.primary }}>Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: THEME.colors.text.primary }}>Prep Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: THEME.colors.text.primary }}>Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: THEME.colors.border.DEFAULT }}>
                {paginatedItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${THEME.colors.border.DEFAULT}`, backgroundColor: THEME.colors.background.secondary }}>
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: THEME.colors.background.tertiary }}>
                          <span className="text-xs" style={{ color: THEME.colors.text.tertiary }}>No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium" style={{ color: THEME.colors.text.primary }}>{item.name}</p>
                        <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>{item.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-sm rounded" style={{ backgroundColor: THEME.colors.primary.dark, color: THEME.colors.text.primary }}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium" style={{ color: THEME.colors.text.primary }}>₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: THEME.colors.text.secondary }}>{item.preparation_time} min</td>
                    <td className="px-6 py-4">
                      {item.available ? (
                        <span className="inline-block px-2 py-1 text-sm rounded" style={{ backgroundColor: '#1f4d2f', color: THEME.colors.status.success }}>
                          Available
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-sm rounded" style={{ backgroundColor: '#4d1f1f', color: THEME.colors.status.error }}>
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-lg transition-colors hover:opacity-80"
                          style={{ color: THEME.colors.primary.DEFAULT }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 rounded-lg transition-colors hover:opacity-80"
                          style={{ color: THEME.colors.status.error }}
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
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: THEME.colors.background.tertiary, borderTop: `1px solid ${THEME.colors.border.DEFAULT}` }}>
              <span className="text-sm" style={{ color: THEME.colors.text.secondary }}>
                Page {currentPage} of {totalPages} ({items.length} items)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  style={{ color: THEME.colors.text.secondary }}
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
