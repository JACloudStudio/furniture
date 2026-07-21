import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';
import './cms/cms.css';
import { CMSProvider, useCMS } from './cms/CMSContext';
import { CMSAdminToolbar } from './cms/CMSAdminToolbar';
import { EditableText } from './cms/EditableText';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AuthModal } from './auth/AuthModal';
import type { Product } from './types';

gsap.registerPlugin(ScrollTrigger);

// Custom SVG Icons Components
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

// Custom SVG Icons Components
const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: filled ? "hsl(var(--accent))" : "none", color: filled ? "hsl(var(--accent))" : "currentColor" }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: filled ? "hsl(var(--gold))" : "none", color: filled ? "hsl(var(--gold))" : "currentColor" }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const CartPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

/* ── Scroll Sequence Constants ────────────────────── */
const FRAME_COUNT = 161;
const FRAME_PATH = (i: number) => `/frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
const NATIVE_W = 1280;
const NATIVE_H = 720;

function FurnitureAppContent() {
  const { siteData, isEditMode, updateSiteData, setEditingProduct } = useCMS();
  const { currentUser, openAuthModal, logout, isAdmin } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  // Navigation & Page State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');
  
  // Cart & Drawer State
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  
  // Wishlist State
  const [wishlist, setWishlist] = useState<number[]>([]);
  
  // Quick View Dialog State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState<string>('');
  
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  /* ── Scroll-Linked Canvas Hero Refs & State ──────── */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>(new Array(FRAME_COUNT));
  const frameObjRef = useRef({ current: 0 });
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [framesLoaded, setFramesLoaded] = useState<boolean>(false);

  // Render a single frame to the canvas (cover-fit, centred)
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = NATIVE_W / NATIVE_H;
    const screenRatio = cw / ch;
    let drawW: number, drawH: number;

    if (screenRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    const x = (cw - drawW) / 2;
    const y = (ch - drawH) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, drawW, drawH);
  }, []);

  // Size canvas to window dimensions × DPR for retina sharpness
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }, []);

  // Preload all frames with concurrency limiter
  useEffect(() => {
    let loadedCount = 0;
    const CONCURRENCY = 8;
    let queued = 0;

    function next() {
      if (queued >= FRAME_COUNT) return;
      const idx = queued++;
      const img = new Image();
      img.decoding = 'async';
      img.src = FRAME_PATH(idx + 1);

      img.onload = () => {
        framesRef.current[idx] = img;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (idx === 0) {
          sizeCanvas();
          renderFrame(0);
        }
        if (loadedCount === FRAME_COUNT) {
          setFramesLoaded(true);
        } else {
          next();
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) setFramesLoaded(true);
        else next();
      };
    }

    for (let i = 0; i < CONCURRENCY; i++) next();
  }, [sizeCanvas, renderFrame]);

  // Setup GSAP ScrollTrigger once frames are loaded
  useEffect(() => {
    if (!framesLoaded) return;

    sizeCanvas();
    renderFrame(0);

    const handleResize = () => {
      sizeCanvas();
      renderFrame(Math.round(frameObjRef.current.current));
    };
    window.addEventListener('resize', handleResize);

    const tween = gsap.to(frameObjRef.current, {
      current: FRAME_COUNT - 1,
      ease: 'none',
      snap: { current: 1 },
      scrollTrigger: {
        trigger: '#hero-sequence-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        pin: '#hero-canvas',
        scrub: 0.5,
        onUpdate() {
          renderFrame(Math.round(frameObjRef.current.current));
        },
      },
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [framesLoaded, sizeCanvas, renderFrame]);

  // Setup click fallback logic for older browsers without native <dialog closedby="any"> support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleOverlayClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          dialog.close();
        }
      };
      
      dialog.addEventListener('click', handleOverlayClick);
      return () => dialog.removeEventListener('click', handleOverlayClick);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [selectedProduct]);

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setSelectedProduct(null);
  };

  const handleAddToCart = (id: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === id);
      if (existing) {
        return prevCart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { id, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map(item => {
          if (item.id === id) {
            const nextQuantity = item.quantity + delta;
            return { ...item, quantity: nextQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const handleToggleWishlist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(id)) {
        return prevWishlist.filter(itemId => itemId !== id);
      }
      return [...prevWishlist, id];
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please provide a valid email address.');
      return;
    }

    setNewsletterStatus('success');
    setNewsletterMessage('Thank you! Welcome to the inner circle.');
    setNewsletterEmail('');
    
    setTimeout(() => {
      setNewsletterStatus('idle');
      setNewsletterMessage('');
    }, 4000);
  };

  // Filter & Sort Products from CMS siteData
  const filteredProducts = (siteData.products || []).filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0;
  });

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const product = siteData.products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <>
      {/* CMS Floating Control Bar */}
      <CMSAdminToolbar />

      {/* Dynamic Announcement Bar */}
      {siteData.branding.announcement?.active && (
        <div className="announcement-bar" style={{ background: 'hsl(var(--accent))', color: '#fff', textAlign: 'center', padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
          <EditableText
            as="span"
            value={siteData.branding.announcement.badgeText}
            onSave={(val) =>
              updateSiteData((prev) => ({
                ...prev,
                branding: { ...prev.branding, announcement: { ...prev.branding.announcement, badgeText: val } },
              }))
            }
            style={{ background: '#000', color: 'hsl(var(--gold))', padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.7rem' }}
          />
          <EditableText
            as="span"
            value={siteData.branding.announcement.text}
            onSave={(val) =>
              updateSiteData((prev) => ({
                ...prev,
                branding: { ...prev.branding, announcement: { ...prev.branding.announcement, text: val } },
              }))
            }
          />
        </div>
      )}

      {/* Sticky Header Navigation */}
      <header className="main-header">
        <div className="container header-container">
          <EditableText
            as="a"
            href="#"
            className="brand-logo"
            value={siteData.branding.logoText}
            onSave={(val) =>
              updateSiteData((prev) => ({
                ...prev,
                branding: { ...prev.branding, logoText: val },
              }))
            }
          />
          
          <nav className="nav-links">
            <a href="#collections">Collections</a>
            <a href="#products">Products</a>
            <a href="#about">Our Story</a>
            <a href="#testimonials">Reviews</a>
          </nav>

          <div className="header-actions">
            <div className="search-bar">
              <span className="search-icon"><SearchIcon /></span>
              <input 
                type="text" 
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* User Account / Auth Profile Menu */}
            <div className="user-account-menu" style={{ position: 'relative' }}>
              {currentUser ? (
                <button
                  className="action-btn user-profile-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    background: isAdmin ? 'rgba(224, 169, 109, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    border: isAdmin ? '1px solid hsl(var(--gold))' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                  title={`Logged in as ${currentUser.name} (${currentUser.role})`}
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon />
                  )}
                  <span style={{ fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: isAdmin ? 'hsl(var(--gold))' : 'rgba(255, 255, 255, 0.2)',
                      color: isAdmin ? '#000' : '#fff',
                    }}
                  >
                    {currentUser.role}
                  </span>
                </button>
              ) : (
                <button
                  className="cms-btn cms-btn-primary"
                  onClick={() => openAuthModal('login')}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <UserIcon />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userMenuOpen && currentUser && (
                <div
                  className="user-dropdown-menu animate-scale-in"
                  style={{
                    position: 'absolute',
                    top: '125%',
                    right: 0,
                    background: '#161922',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.8rem 1rem',
                    minWidth: '200px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ paddingBottom: '0.6rem', marginBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{currentUser.email}</div>
                    <div style={{ marginTop: '0.3rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: isAdmin ? 'hsl(var(--gold))' : 'rgba(255, 255, 255, 0.15)',
                          color: isAdmin ? '#000' : '#e5e7eb',
                        }}
                      >
                        Role: {currentUser.role}
                      </span>
                    </div>
                  </div>
                  <button
                    className="cms-btn cms-btn-danger"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                    onClick={async () => {
                      await logout();
                      setUserMenuOpen(false);
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
            
            <button 
              className="action-btn wishlist-toggle-btn"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                alert(`Wishlisted items: ${wishlist.length ? wishlist.map(id => siteData.products.find(p=>p.id===id)?.name).join(', ') : 'No items yet'}`);
              }}
              aria-label="Wishlist"
            >
              <HeartIcon filled={wishlist.length > 0} />
              {wishlist.length > 0 && <span className="action-badge">{wishlist.length}</span>}
            </button>

            <button 
              className="action-btn cart-toggle-btn" 
              onClick={() => setCartOpen(true)}
              aria-label="Shopping Cart"
            >
              <ShoppingBagIcon />
              {totalCartItems > 0 && <span className="action-badge">{totalCartItems}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Main E-Commerce Content */}
      <main>
        
        {/* Loading Overlay */}
        {!framesLoaded && (
          <div className="seq-loader">
            <div className="seq-loader-inner">
              <div className="seq-loader-brand">{siteData.branding.logoText}</div>
              <div className="seq-loader-bar-track">
                <div className="seq-loader-bar-fill" style={{ width: `${loadProgress}%` }} />
              </div>
              <div className="seq-loader-pct">{loadProgress}%</div>
            </div>
          </div>
        )}

        {/* Scroll-Linked Canvas Hero Sequence */}
        <div id="hero-sequence-wrapper" className="hero-sequence-wrapper">
          <canvas
            id="hero-canvas"
            ref={canvasRef}
            className="hero-sequence-canvas"
          />

          <div className="hero-overlay-content hero-overlay-intro">
            <EditableText
              as="span"
              className="hero-tag"
              value={siteData.hero.tag}
              onSave={(val) =>
                updateSiteData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, tag: val },
                }))
              }
            />
            
            <EditableText
              as="h1"
              className="hero-title"
              multiline
              value={siteData.hero.title}
              onSave={(val) =>
                updateSiteData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, title: val },
                }))
              }
            />

            <EditableText
              as="p"
              className="hero-subtitle"
              multiline
              value={siteData.hero.subtitle}
              onSave={(val) =>
                updateSiteData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: val },
                }))
              }
            />

            <div className="hero-ctas">
              <EditableText
                as="a"
                href="#products"
                className="btn btn-primary"
                value={siteData.hero.primaryCtaText}
                onSave={(val) =>
                  updateSiteData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, primaryCtaText: val },
                  }))
                }
              />
              <EditableText
                as="a"
                href="#about"
                className="btn btn-secondary"
                value={siteData.hero.secondaryCtaText}
                onSave={(val) =>
                  updateSiteData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, secondaryCtaText: val },
                  }))
                }
              />
            </div>
          </div>

          <div className="hero-overlay-content hero-overlay-stats">
            <div className="hero-stats">
              {siteData.hero.stats.map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <EditableText
                    as="span"
                    className="stat-number"
                    value={stat.number}
                    onSave={(val) => {
                      const updated = [...siteData.hero.stats];
                      updated[idx].number = val;
                      updateSiteData((prev) => ({ ...prev, hero: { ...prev.hero, stats: updated } }));
                    }}
                  />
                  <EditableText
                    as="span"
                    className="stat-label"
                    value={stat.label}
                    onSave={(val) => {
                      const updated = [...siteData.hero.stats];
                      updated[idx].label = val;
                      updateSiteData((prev) => ({ ...prev, hero: { ...prev.hero, stats: updated } }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hero-scroll-hint">
            <span>Scroll to Explore</span>
            <div className="hero-scroll-arrow" />
          </div>
        </div>

        {/* Collection Categories Section */}
        <section id="collections" className="categories-section container">
          <div className="section-header">
            <h2 className="section-title">Curated Spaces</h2>
            <p className="section-subtitle">Exquisite design customized for every corner of your home.</p>
          </div>
          
          <div className="category-cards-grid">
            {(siteData.categories || []).map(cat => (
              <button 
                key={cat.id} 
                className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="category-img-wrapper">
                  <img src={cat.image} alt={cat.name} />
                  <div className="category-overlay" />
                </div>
                <div className="category-details">
                  <h3>{cat.name}</h3>
                  <span>{cat.count}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Product Catalog Section */}
        <section id="products" className="catalog-section container">
          <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="section-title">Discover Our Pieces</h2>
              <p className="section-subtitle">A collection that prioritizes structural integrity, raw materials, and clean joinery.</p>
            </div>
            {isEditMode && (
              <button className="cms-btn cms-btn-primary" onClick={() => setEditingProduct('new')}>
                ➕ Add New Product
              </button>
            )}
          </div>

          {/* Filtering and Sorting Bar */}
          <div className="filters-bar">
            <div className="category-filters">
              <button 
                className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Pieces
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'living' ? 'active' : ''}`}
                onClick={() => setActiveCategory('living')}
              >
                Living Room
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'bedroom' ? 'active' : ''}`}
                onClick={() => setActiveCategory('bedroom')}
              >
                Bedroom
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'dining' ? 'active' : ''}`}
                onClick={() => setActiveCategory('dining')}
              >
                Dining Room
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'office' ? 'active' : ''}`}
                onClick={() => setActiveCategory('office')}
              >
                Home Office
              </button>
            </div>

            <div className="sorting-selector">
              <label htmlFor="sort-dropdown">Sort by</label>
              <select 
                id="sort-dropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Search Result Feedback */}
          {searchQuery && (
            <div className="search-feedback">
              <span>Showing results for "{searchQuery}"</span>
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
          )}

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="products-grid">
              {sortedProducts.map((product) => {
                const inWishlist = wishlist.includes(product.id);
                return (
                  <article key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                    <div className="product-img-wrapper">
                      {product.tag && <span className="product-badge">{product.tag}</span>}
                      
                      {isEditMode && (
                        <button
                          className="cms-btn cms-btn-primary"
                          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 12, padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProduct(product);
                          }}
                        >
                          ✏️ Edit Item
                        </button>
                      )}

                      <button 
                        className="wishlist-btn"
                        onClick={(e) => handleToggleWishlist(product.id, e)}
                        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <HeartIcon filled={inWishlist} />
                      </button>
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <div className="quick-view-overlay">
                        <span>Quick Details</span>
                      </div>
                    </div>
                    <div className="product-info">
                      <div className="product-meta">
                        <span className="product-cat">{product.category}</span>
                        <div className="product-stars">
                          <StarIcon />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <h3 className="product-name">{product.name}</h3>

                      <div className="product-purchase">
                        <span className="product-price">${product.price}</span>
                        <button 
                          className="add-to-cart-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          aria-label="Add to cart"
                        >
                          <CartPlusIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-catalog-state">
              <h3>No furniture found</h3>
              <p>Try refining your search query or choosing another category.</p>
              <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>Reset filters</button>
            </div>
          )}
        </section>

        {/* Detailed Brand Showcase (About Section) */}
        <section id="about" className="craftsmanship-section">
          <div className="container craftsmanship-grid">
            <div className="craft-images-container">
              <img 
                src={siteData.craftsmanship.primaryImage} 
                alt="Craftsmanship main showcase"
                className="craft-img-primary"
              />
              <img 
                src={siteData.craftsmanship.secondaryImage} 
                alt="Woodworking detail"
                className="craft-img-secondary"
              />
            </div>
            <div className="craft-content">
              <EditableText
                as="span"
                className="section-label"
                value={siteData.craftsmanship.label}
                onSave={(val) =>
                  updateSiteData((prev) => ({
                    ...prev,
                    craftsmanship: { ...prev.craftsmanship, label: val },
                  }))
                }
              />
              
              <EditableText
                as="h2"
                value={siteData.craftsmanship.title}
                onSave={(val) =>
                  updateSiteData((prev) => ({
                    ...prev,
                    craftsmanship: { ...prev.craftsmanship, title: val },
                  }))
                }
              />

              <EditableText
                as="p"
                multiline
                value={siteData.craftsmanship.paragraph1}
                onSave={(val) =>
                  updateSiteData((prev) => ({
                    ...prev,
                    craftsmanship: { ...prev.craftsmanship, paragraph1: val },
                  }))
                }
              />

              <EditableText
                as="p"
                multiline
                value={siteData.craftsmanship.paragraph2}
                onSave={(val) =>
                  updateSiteData((prev) => ({
                    ...prev,
                    craftsmanship: { ...prev.craftsmanship, paragraph2: val },
                  }))
                }
              />

              <div className="benefits-checklist">
                {(siteData.craftsmanship.benefits || []).map((b, idx) => (
                  <div key={idx} className="benefit-item">
                    <span className="benefit-icon">✓</span>
                    <EditableText
                      as="span"
                      value={b}
                      onSave={(val) => {
                        const newBenefits = [...siteData.craftsmanship.benefits];
                        newBenefits[idx] = val;
                        updateSiteData((prev) => ({
                          ...prev,
                          craftsmanship: { ...prev.craftsmanship, benefits: newBenefits },
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section id="testimonials" className="testimonials-section container">
          <div className="section-header">
            <h2 className="section-title">Enduring Opinions</h2>
            <p className="section-subtitle">Hear what design enthusiasts say about their {siteData.branding.logoText} collections.</p>
          </div>

          <div className="testimonials-grid">
            {(siteData.testimonials || []).map((t, idx) => (
              <div key={t.id || idx} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="reviewer-avatar">
                    <img src={t.avatar} alt={t.author} />
                  </div>
                  <div>
                    <EditableText
                      as="h4"
                      className="reviewer-name"
                      value={t.author}
                      onSave={(val) => {
                        const updated = [...siteData.testimonials];
                        updated[idx].author = val;
                        updateSiteData((prev) => ({ ...prev, testimonials: updated }));
                      }}
                    />
                    <EditableText
                      as="span"
                      className="reviewer-role"
                      value={t.role}
                      onSave={(val) => {
                        const updated = [...siteData.testimonials];
                        updated[idx].role = val;
                        updateSiteData((prev) => ({ ...prev, testimonials: updated }));
                      }}
                    />
                  </div>
                </div>

                <div className="testimonial-rating">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>

                <EditableText
                  as="p"
                  className="testimonial-text"
                  multiline
                  value={t.text}
                  onSave={(val) => {
                    const updated = [...siteData.testimonials];
                    updated[idx].text = val;
                    updateSiteData((prev) => ({ ...prev, testimonials: updated }));
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Subscription Banner */}
        <section className="newsletter-section">
          <div className="container newsletter-content">
            <span className="section-label">{siteData.branding.logoText} CIRCLE</span>
            <h2>Join the Inner Circle</h2>
            <p>Subscribe to receive preview access to our seasonal furniture drops and architectural styling guides.</p>
            
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            
            {newsletterStatus !== 'idle' && (
              <div className={`newsletter-msg ${newsletterStatus}`}>
                {newsletterMessage}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Slide-out Cart Side Drawer */}
      {cartOpen && <div className="drawer-overlay" onClick={() => setCartOpen(false)} />}
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="drawer-header">
          <h2>Shopping Bag ({totalCartItems})</h2>
          <button className="close-drawer-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        <div className="drawer-body">
          {cart.length > 0 ? (
            <div className="cart-items-list">
              {cart.map((item) => {
                const product = siteData.products.find(p => p.id === item.id);
                if (!product) return null;
                return (
                  <div key={item.id} className="cart-item">
                    <img src={product.image} alt={product.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{product.name}</h4>
                      <span className="cart-item-price">${product.price}</span>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button onClick={() => handleUpdateQuantity(item.id, -1)} aria-label="Decrease quantity">-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                        </div>
                        <button 
                          className="delete-item-btn" 
                          onClick={() => handleRemoveFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="cart-empty-state">
              <ShoppingBagIcon />
              <h3>Your cart is empty</h3>
              <p>Add products to start decorating your dream home.</p>
              <button className="btn btn-primary" onClick={() => setCartOpen(false)}>Continue Shopping</button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <span className="price">${cartSubtotal}</span>
            </div>
            <p className="shipping-info">Shipping and taxes calculated at checkout.</p>
            <button 
              className="btn btn-primary checkout-btn"
              onClick={() => alert(`Proceeding to checkout with $${cartSubtotal} value!`)}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>

      {/* Quick View Dialog Modal */}
      <dialog 
        id="quick-view-modal"
        ref={dialogRef}
        closedby="any"
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
      >
        {selectedProduct && (
          <div className="dialog-content animate-scale-in">
            <button className="close-dialog-btn" onClick={handleCloseDialog} aria-label="Close dialog">
              <CloseIcon />
            </button>
            
            <div className="dialog-grid">
              <div className="dialog-image-wrapper">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="dialog-details">
                {selectedProduct.tag && <span className="dialog-badge">{selectedProduct.tag}</span>}
                <span className="dialog-category">{selectedProduct.category} Collection</span>
                <h2 id="dialog-title">{selectedProduct.name}</h2>
                
                <div className="dialog-rating">
                  <div className="stars-row">
                    <StarIcon />
                    <span>{selectedProduct.rating}</span>
                  </div>
                  <span className="reviews-count">({selectedProduct.reviewsCount} verified reviews)</span>
                </div>
                
                <div className="dialog-price">${selectedProduct.price}</div>
                <p className="dialog-desc">{selectedProduct.description}</p>
                
                <div className="dialog-specs">
                  <h3>Specifications</h3>
                  <ul>
                    <li>
                      <strong>Material:</strong> <span>{selectedProduct.specifications.material}</span>
                    </li>
                    <li>
                      <strong>Dimensions:</strong> <span>{selectedProduct.specifications.dimensions}</span>
                    </li>
                    <li>
                      <strong>Weight:</strong> <span>{selectedProduct.specifications.weight}</span>
                    </li>
                    <li>
                      <strong>Assembly:</strong> <span>{selectedProduct.specifications.assemblyRequired ? "Required" : "Fully Assembled"}</span>
                    </li>
                  </ul>
                </div>
                
                <button 
                  className="btn btn-primary dialog-add-btn"
                  onClick={() => {
                    handleAddToCart(selectedProduct.id);
                    handleCloseDialog();
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>

      {/* Footer */}
      <footer className="main-footer-section">
        <div className="container footer-grid">
          <div className="footer-brand">
            <EditableText
              as="h3"
              className="footer-logo"
              value={siteData.footer.logoText}
              onSave={(val) =>
                updateSiteData((prev) => ({
                  ...prev,
                  footer: { ...prev.footer, logoText: val },
                }))
              }
            />
            <EditableText
              as="p"
              multiline
              value={siteData.footer.tagline}
              onSave={(val) =>
                updateSiteData((prev) => ({
                  ...prev,
                  footer: { ...prev.footer, tagline: val },
                }))
              }
            />
            <div className="footer-socials">
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Pinterest">PI</a>
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Twitter">TW</a>
            </div>
          </div>
          
          <div className="footer-links-col">
            <h4>Collection</h4>
            <ul>
              <li><button onClick={() => { setActiveCategory('living'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}>Living Room</button></li>
              <li><button onClick={() => { setActiveCategory('bedroom'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}>Bedroom</button></li>
              <li><button onClick={() => { setActiveCategory('dining'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}>Dining Room</button></li>
              <li><button onClick={() => { setActiveCategory('office'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}>Home Office</button></li>
            </ul>
          </div>
          
          <div className="footer-links-col">
            <h4>Support</h4>
            <ul>
              {(siteData.footer.supportLinks || []).map((linkText, idx) => (
                <li key={idx}>
                  <EditableText
                    as="a"
                    href="#"
                    value={linkText}
                    onSave={(val) => {
                      const updated = [...siteData.footer.supportLinks];
                      updated[idx] = val;
                      updateSiteData((prev) => ({ ...prev, footer: { ...prev.footer, supportLinks: updated } }));
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-links-col">
            <h4>Showrooms</h4>
            <ul>
              {(siteData.footer.showrooms || []).map((showroom, idx) => (
                <li key={idx}>
                  <EditableText
                    as="a"
                    href="#"
                    value={showroom}
                    onSave={(val) => {
                      const updated = [...siteData.footer.showrooms];
                      updated[idx] = val;
                      updateSiteData((prev) => ({ ...prev, footer: { ...prev.footer, showrooms: updated } }));
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="container footer-copyright-row">
          <EditableText
            as="p"
            value={siteData.footer.copyrightText}
            onSave={(val) =>
              updateSiteData((prev) => ({
                ...prev,
                footer: { ...prev.footer, copyrightText: val },
              }))
            }
          />
          <div className="footer-policy-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Render Auth Modal (Login / Signup) */}
      <AuthModal />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <FurnitureAppContent />
      </CMSProvider>
    </AuthProvider>
  );
}
