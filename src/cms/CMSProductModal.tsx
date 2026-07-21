import React, { useState, useEffect } from 'react';
import { useCMS } from './CMSContext';
import type { Product } from '../types';

export const CMSProductModal: React.FC = () => {
  const { editingProduct, setEditingProduct, saveProduct, deleteProduct } = useCMS();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'living',
    price: 499,
    rating: 4.8,
    reviewsCount: 1,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    tag: 'New Collection',
    description: '',
    specifications: {
      material: 'Solid Walnut Wood',
      dimensions: '30"W x 30"D x 32"H',
      weight: '45 lbs',
      assemblyRequired: false,
    },
  });

  useEffect(() => {
    if (editingProduct && editingProduct !== 'new') {
      setFormData(editingProduct);
    } else if (editingProduct === 'new') {
      setFormData({
        id: Date.now(),
        name: 'New Artisanal Furniture',
        category: 'living',
        price: 399,
        rating: 4.9,
        reviewsCount: 12,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
        tag: 'New',
        description: 'Handcrafted solid wood furniture designed for timeless luxury.',
        specifications: {
          material: 'American Solid Hardwood',
          dimensions: '32"W x 30"D x 30"H',
          weight: '35 lbs',
          assemblyRequired: true,
        },
      });
    }
  }, [editingProduct]);

  if (!editingProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) return;
    saveProduct(formData as Product);
  };

  const isNew = editingProduct === 'new';

  return (
    <div className="cms-modal-overlay" onClick={() => setEditingProduct(null)}>
      <div className="cms-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="cms-modal-header">
          <h3>{isNew ? '➕ Add New Furniture Product' : `✏️ Edit Product: ${formData.name}`}</h3>
          <button className="cms-btn" onClick={() => setEditingProduct(null)}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="cms-modal-body">
          <div className="cms-modal-grid">
            <div className="cms-form-group">
              <label>Product Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="cms-form-group">
              <label>Category</label>
              <select
                value={formData.category || 'living'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="living">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="dining">Dining Room</option>
                <option value="office">Home Office</option>
              </select>
            </div>

            <div className="cms-form-group">
              <label>Price ($ USD)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>

            <div className="cms-form-group">
              <label>Badge Tag (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Best Seller, New, Award Winner"
                value={formData.tag || ''}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              />
            </div>
          </div>

          <div className="cms-form-group">
            <label>Image URL</label>
            <input
              type="text"
              required
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="cms-img-preview" />
            )}
          </div>

          <div className="cms-form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <h4 style={{ margin: '1rem 0 0.5rem', color: 'hsl(var(--gold))' }}>Specifications</h4>
          <div className="cms-modal-grid">
            <div className="cms-form-group">
              <label>Material</label>
              <input
                type="text"
                value={formData.specifications?.material || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: { ...formData.specifications!, material: e.target.value },
                  })
                }
              />
            </div>

            <div className="cms-form-group">
              <label>Dimensions</label>
              <input
                type="text"
                value={formData.specifications?.dimensions || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: { ...formData.specifications!, dimensions: e.target.value },
                  })
                }
              />
            </div>

            <div className="cms-form-group">
              <label>Weight</label>
              <input
                type="text"
                value={formData.specifications?.weight || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: { ...formData.specifications!, weight: e.target.value },
                  })
                }
              />
            </div>

            <div className="cms-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.2rem' }}>
              <input
                type="checkbox"
                id="assemblyReq"
                checked={!!formData.specifications?.assemblyRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: { ...formData.specifications!, assemblyRequired: e.target.checked },
                  })
                }
              />
              <label htmlFor="assemblyReq" style={{ margin: 0, cursor: 'pointer' }}>Assembly Required</label>
            </div>
          </div>

          <div className="cms-drawer-footer" style={{ padding: '1.25rem 0 0', background: 'transparent' }}>
            {!isNew && (
              <button
                type="button"
                className="cms-btn cms-btn-danger"
                onClick={() => {
                  if (window.confirm(`Delete product "${formData.name}"?`)) {
                    deleteProduct(formData.id!);
                  }
                }}
              >
                🗑️ Delete Product
              </button>
            )}
            <button type="button" className="cms-btn" onClick={() => setEditingProduct(null)}>
              Cancel
            </button>
            <button type="submit" className="cms-btn cms-btn-primary">
              💾 Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
