import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, login, signup, loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(authModalTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Keep internal tab state synced when authModalTab changes from context
  React.useEffect(() => {
    setTab(authModalTab);
    setErrorMsg(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Login failed.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const res = await signup(name, email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Signup failed.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Google sign-in failed.');
    }
  };

  return (
    <div className="cms-modal-overlay" onClick={closeAuthModal}>
      <div
        className="cms-modal animate-scale-in"
        style={{ maxWidth: '440px', padding: '0' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cms-modal-header" style={{ padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔐</span> Account Access
          </h3>
          <button className="cms-btn" onClick={closeAuthModal}>✕</button>
        </div>

        {/* Tab switch bar */}
        <div className="cms-drawer-tabs" style={{ padding: '0.6rem 1.5rem', background: 'rgba(0,0,0,0.3)' }}>
          <button
            className={`cms-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            style={{ flex: 1, textAlign: 'center' }}
          >
            Sign In
          </button>
          <button
            className={`cms-tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setErrorMsg(null); }}
            style={{ flex: 1, textAlign: 'center' }}
          >
            Create Account
          </button>
        </div>

        <div className="cms-modal-body" style={{ padding: '1.5rem' }}>
          {errorMsg && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            className="cms-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.7rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              gap: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 0 1.25rem', opacity: 0.5 }}>
            <div style={{ flex: 1, height: '1px', background: '#fff' }} />
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>or use email</span>
            <div style={{ flex: 1, height: '1px', background: '#fff' }} />
          </div>

          {/* SIGN IN FORM */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="cms-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="cms-form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="cms-btn cms-btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 600 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignupSubmit}>
              <div className="cms-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="cms-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="cms-form-group">
                <label>Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="cms-btn cms-btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 600 }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
