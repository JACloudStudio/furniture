import React, { useRef } from 'react';
import { useCMS } from './CMSContext';
import { CMSEditorDrawer } from './CMSEditorDrawer';
import { CMSProductModal } from './CMSProductModal';
import { useAuth } from '../auth/AuthContext';

export const CMSAdminToolbar: React.FC = () => {
  const { isAdmin } = useAuth();
  const {
    isEditMode,
    setIsEditMode,
    setActiveDrawer,
    setEditingProduct,
    toastMessage,
    exportJSON,
    importJSON,
    resetToDefaults,
  } = useCMS();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isAdmin) {
    return null;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          importJSON(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Hidden file input for importing JSON backup */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        style={{ display: 'none' }}
      />

      <header className="cms-admin-bar">
        <div className="cms-bar-left">
          <div className="cms-badge">
            <span>✨</span> AURA Visual CMS
          </div>

          <div className="cms-mode-toggle">
            <button
              className={`cms-toggle-btn ${!isEditMode ? 'active' : ''}`}
              onClick={() => setIsEditMode(false)}
            >
              👁️ Preview Mode
            </button>
            <button
              className={`cms-toggle-btn ${isEditMode ? 'active' : ''}`}
              onClick={() => setIsEditMode(true)}
            >
              ✏️ Live Edit Mode
            </button>
          </div>
        </div>

        <div className="cms-bar-actions">
          {isEditMode && (
            <>
              <button
                className="cms-btn cms-btn-primary"
                onClick={() => setEditingProduct('new')}
                title="Add new furniture item to catalogue"
              >
                ➕ Add Furniture
              </button>

              <button
                className="cms-btn"
                onClick={() => setActiveDrawer('content')}
                title="Edit Hero, About, Reviews, Footer & Theme"
              >
                🎨 Edit Site Sections
              </button>
            </>
          )}

          <button className="cms-btn" onClick={exportJSON} title="Download CMS data backup as JSON">
            📥 Backup JSON
          </button>

          <button
            className="cms-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload JSON backup to restore or load content"
          >
            📤 Restore JSON
          </button>

          <button
            className="cms-btn cms-btn-danger"
            onClick={resetToDefaults}
            title="Reset site content to original defaults"
          >
            🔄 Reset
          </button>
        </div>
      </header>

      {/* Render CMS Side Drawer & Modals */}
      <CMSEditorDrawer />
      <CMSProductModal />

      {/* Toast popup */}
      {toastMessage && (
        <div className="cms-toast">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
