import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { AdminManager } from './AdminManager';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { currentUser, isAdmin, logout, adminEmails } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'admins' | 'account'>('overview');

  if (!isOpen || !currentUser) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="cms-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="admin-panel animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '680px',
          maxWidth: '95vw',
          maxHeight: '85vh',
          background: 'linear-gradient(145deg, #12141c 0%, #1a1d2e 50%, #12141c 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Avatar */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isAdmin
                  ? 'linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-light)))'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: isAdmin ? '#000' : '#fff',
                overflow: 'hidden',
                border: isAdmin ? '2px solid hsl(var(--gold))' : '2px solid rgba(255,255,255,0.2)',
              }}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{currentUser.email}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '0.5rem 0.8rem',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Navigation tabs */}
        <div
          style={{
            display: 'flex',
            padding: '0 2rem',
            gap: '0.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          {[
            { id: 'overview' as const, label: '📊 Overview', show: true },
            { id: 'admins' as const, label: '👑 Manage Admins', show: isAdmin },
            { id: 'account' as const, label: '⚙️ Account', show: true },
          ]
            .filter((t) => t.show)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                style={{
                  padding: '0.8rem 1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeSection === tab.id ? '2px solid hsl(var(--gold))' : '2px solid transparent',
                  color: activeSection === tab.id ? '#fff' : '#6b7280',
                  fontWeight: activeSection === tab.id ? 600 : 400,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {tab.label}
              </button>
            ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem 2rem' }}>
          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <div>
              {/* Role badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  background: isAdmin ? 'rgba(218, 165, 32, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                  border: `1px solid ${isAdmin ? 'rgba(218, 165, 32, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`,
                  marginBottom: '1.5rem',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{isAdmin ? '👑' : '🛍️'}</span>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isAdmin ? 'hsl(var(--gold))' : '#818cf8',
                  }}
                >
                  {isAdmin ? 'Administrator' : 'Customer'}
                </span>
              </div>

              {/* Stats Cards */}
              {isAdmin && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      padding: '1.2rem',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                      Total Admins
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'hsl(var(--gold))' }}>{adminEmails.length}</div>
                  </div>
                  <div
                    style={{
                      padding: '1.2rem',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                      Your Role
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Super Admin</div>
                  </div>
                </div>
              )}

              {/* Powers list (admin only) */}
              {isAdmin && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginBottom: '0.8rem' }}>
                    Your Admin Powers
                  </div>
                  {[
                    { icon: '✏️', title: 'Live Edit Mode', desc: 'Edit website content inline with Visual CMS' },
                    { icon: '🛋️', title: 'Product Management', desc: 'Add, edit, and remove furniture items' },
                    { icon: '🎨', title: 'Theme & Branding', desc: 'Change colors, logo, and site identity' },
                    { icon: '👑', title: 'Admin Management', desc: 'Add or remove admin email addresses' },
                    { icon: '📥', title: 'Data Backup & Restore', desc: 'Export and import site content as JSON' },
                    { icon: '🔄', title: 'Reset to Defaults', desc: 'Restore original site content & products' },
                  ].map((power) => (
                    <div
                      key={power.title}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.7rem 0.8rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        marginBottom: '0.4rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '1.15rem', flexShrink: 0, marginTop: '0.1rem' }}>{power.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5e7eb' }}>{power.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.15rem' }}>{power.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Non-admin info */}
              {!isAdmin && (
                <div
                  style={{
                    padding: '1.2rem',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: 1.6 }}>
                    You're signed in as a <strong>customer</strong>. Browse our curated furniture collection, add items to your wishlist, and enjoy the shopping experience.
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.6rem' }}>
                    Contact an admin if you need elevated access.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ADMINS SECTION */}
          {activeSection === 'admins' && isAdmin && <AdminManager />}

          {/* ACCOUNT SECTION */}
          {activeSection === 'account' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Account Details
                </div>
                {[
                  { label: 'Display Name', value: currentUser.name },
                  { label: 'Email', value: currentUser.email },
                  { label: 'User ID', value: currentUser.id },
                  { label: 'Role', value: currentUser.role === 'admin' ? 'Administrator' : 'Customer' },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.7rem 0.8rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.label}</span>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        color: '#e5e7eb',
                        fontWeight: 500,
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#fca5a5',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
