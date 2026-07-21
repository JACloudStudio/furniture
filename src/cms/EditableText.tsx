import React, { useState } from 'react';
import { useCMS } from './CMSContext';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'a';
  className?: string;
  multiline?: boolean;
  href?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  as: Component = 'span',
  className = '',
  multiline = false,
  href,
  style,
  children,
}) => {
  const { isEditMode, showToast } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value);

  if (!isEditMode) {
    if (Component === 'a') {
      return (
        <a href={href} className={className} style={style}>
          {children || value}
        </a>
      );
    }
    return (
      <Component className={className} style={style}>
        {children || value}
      </Component>
    );
  }

  const handleBlurOrSubmit = () => {
    setIsEditing(false);
    if (currentText.trim() !== value.trim()) {
      onSave(currentText);
      showToast('Content updated live!');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleBlurOrSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentText(value);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          className="cms-inline-input"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onBlur={handleBlurOrSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={3}
        />
      );
    }
    return (
      <input
        type="text"
        className="cms-inline-input"
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        onBlur={handleBlurOrSubmit}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  return (
    <Component
      className={`cms-editable-wrapper ${className}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
        setCurrentText(value);
      }}
      title="Click to edit text directly"
    >
      {children || value}
      <span className="cms-edit-badge">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </span>
    </Component>
  );
};
