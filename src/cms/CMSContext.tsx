import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SiteData, Product } from '../types';
import { DEFAULT_SITE_DATA } from '../defaultSiteData';

import { useAuth } from '../auth/AuthContext';

const LOCAL_STORAGE_KEY = 'aura_furniture_cms_data_v1';

interface CMSContextType {
  siteData: SiteData;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  activeDrawer: string | null;
  setActiveDrawer: (drawer: string | null) => void;
  editingProduct: Product | 'new' | null;
  setEditingProduct: (product: Product | 'new' | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  updateSiteData: (updater: (prev: SiteData) => SiteData) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  resetToDefaults: () => void;
  exportJSON: () => void;
  importJSON: (jsonStr: string) => boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load CMS data from localStorage', e);
    }
    return DEFAULT_SITE_DATA;
  });

  const [editModeRequested, setEditModeRequested] = useState<boolean>(true);
  const isEditMode = isAdmin && editModeRequested;

  const setIsEditMode = (val: boolean) => {
    if (!isAdmin && val) {
      return;
    }
    setEditModeRequested(val);
  };

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | 'new' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync edit mode class to body tag
  useEffect(() => {
    if (isEditMode) {
      document.body.classList.add('cms-editing', 'has-cms-admin-bar');
    } else {
      document.body.classList.remove('cms-editing', 'has-cms-admin-bar');
    }
  }, [isEditMode]);

  // Apply CSS color theme variables based on CMS theme settings
  useEffect(() => {
    const palette = siteData.theme?.colorPalette || 'gold';
    const root = document.documentElement;

    if (palette === 'emerald') {
      root.style.setProperty('--gold', '158 64% 52%');
      root.style.setProperty('--accent', '160 84% 39%');
    } else if (palette === 'wood') {
      root.style.setProperty('--gold', '36 77% 55%');
      root.style.setProperty('--accent', '24 80% 48%');
    } else if (palette === 'terracotta') {
      root.style.setProperty('--gold', '12 76% 61%');
      root.style.setProperty('--accent', '343 81% 56%');
    } else if (palette === 'midnight') {
      root.style.setProperty('--gold', '239 84% 67%');
      root.style.setProperty('--accent', '224 76% 48%');
    } else {
      // Default Gold / Amber
      root.style.setProperty('--gold', '38 92% 50%');
      root.style.setProperty('--accent', '25 95% 53%');
    }
  }, [siteData.theme]);

  // Persist siteData updates to localStorage
  const updateSiteData = (updater: (prev: SiteData) => SiteData) => {
    setSiteData((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save (Create or Update) Product
  const saveProduct = (product: Product) => {
    updateSiteData((prev) => {
      const existingIdx = prev.products.findIndex((p) => p.id === product.id);
      let updatedProducts = [...prev.products];
      if (existingIdx >= 0) {
        updatedProducts[existingIdx] = product;
      } else {
        updatedProducts.unshift(product);
      }
      return { ...prev, products: updatedProducts };
    });
    setEditingProduct(null);
    showToast(`Product "${product.name}" saved successfully!`);
  };

  // Delete Product
  const deleteProduct = (id: number) => {
    const target = siteData.products.find((p) => p.id === id);
    if (!target) return;
    updateSiteData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
    setEditingProduct(null);
    showToast(`Product "${target.name}" deleted.`);
  };

  // Reset to original default data
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all site content & products back to initial defaults?')) {
      setSiteData(DEFAULT_SITE_DATA);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
      showToast('Site content restored to default!');
    }
  };

  // Export CMS site data as downloadable JSON
  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(siteData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura_furniture_cms_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('CMS site backup downloaded as JSON.');
  };

  // Import JSON backup
  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.hero && parsed.products) {
        setSiteData(parsed);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        showToast('Site data imported successfully!');
        return true;
      }
    } catch (e) {
      alert('Invalid JSON structure. Please upload a valid CMS backup file.');
    }
    return false;
  };

  return (
    <CMSContext.Provider
      value={{
        siteData,
        isEditMode,
        setIsEditMode,
        activeDrawer,
        setActiveDrawer,
        editingProduct,
        setEditingProduct,
        toastMessage,
        showToast,
        updateSiteData,
        saveProduct,
        deleteProduct,
        resetToDefaults,
        exportJSON,
        importJSON,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
