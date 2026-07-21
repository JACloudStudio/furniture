import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export const AdminManager: React.FC = () => {
  const { isAdmin, adminEmails, addAdmin, removeAdmin, currentUser } = useAuth();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    setFeedback(null);
    setLoading(true);
    const res = await addAdmin(newAdminEmail);
    setLoading(false);
    if (res.success) {
      setFeedback({ type: 'success', message: `✓ "${newAdminEmail}" added as admin.` });
      setNewAdminEmail('');
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to add admin.' });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!window.confirm(`Remove admin access for "${email}"?`)) return;
    setFeedback(null);
    const res = await removeAdmin(email);
    if (res.success) {
      setFeedback({ type: 'success', message: `"${email}" removed from admin list.` });
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to remove admin.' });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const SUPER_ADMIN = 'mogaljavedahmedbaig@gmail.com';

  return (
    <div>
      <h4 style={{ margin: '0 0 0.8rem', color: 'hsl(var(--gold))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        👑 Admin Access Manager
      </h4>
      <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 1rem', lineHeight: 1.5 }}>
        Add email addresses to grant CMS editing access. Only users in this list can see the Visual CMS tools when they log in.
      </p>

      {/* Add admin form */}
      <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="newadmin@example.com"
          value={newAdminEmail}
          onChange={(e) => setNewAdminEmail(e.target.value)}
          required
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '0.55rem 0.8rem',
            color: '#fff',
            fontSize: '0.85rem',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          className="cms-btn cms-btn-primary"
          disabled={loading}
          style={{ whiteSpace: 'nowrap' }}
        >
          {loading ? '...' : '➕ Add Admin'}
        </button>
      </form>

      {/* Feedback message */}
      {feedback && (
        <div
          style={{
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: feedback.type === 'success' ? '#6ee7b7' : '#fca5a5',
            padding: '0.5rem 0.8rem',
            borderRadius: '8px',
            marginBottom: '0.8rem',
            fontSize: '0.82rem',
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* Admin List */}
      <div>
        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', fontWeight: 600 }}>
          Current Admins ({adminEmails.length})
        </span>
        <div style={{ marginTop: '0.5rem' }}>
          {adminEmails.map((email) => {
            const isSuperAdmin = email.toLowerCase() === SUPER_ADMIN.toLowerCase();
            const isSelf = email.toLowerCase() === currentUser?.email?.toLowerCase();

            return (
              <div
                key={email}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  marginBottom: '0.4rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.88rem' }}>{email}</span>
                  {isSuperAdmin && (
                    <span
                      style={{
                        fontSize: '0.6rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        background: 'hsl(var(--gold))',
                        color: '#000',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      Super Admin
                    </span>
                  )}
                  {isSelf && !isSuperAdmin && (
                    <span
                      style={{
                        fontSize: '0.6rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        background: 'rgba(255,255,255,0.15)',
                        color: '#e5e7eb',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      You
                    </span>
                  )}
                </div>

                {!isSuperAdmin && (
                  <button
                    className="cms-btn cms-btn-danger"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                    onClick={() => handleRemoveAdmin(email)}
                    title={`Remove admin access for ${email}`}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
