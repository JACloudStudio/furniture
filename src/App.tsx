import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Product Interface
interface Product {
  id: number;
  name: string;
  category: string; // 'living' | 'bedroom' | 'dining' | 'office'
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: string;
  description: string;
  specifications: {
    material: string;
    dimensions: string;
    weight: string;
    assemblyRequired: boolean;
  };
}

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

// High Quality Furniture Dataset
const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: "Emilie Velvet Lounge Sofa",
    category: "living",
    price: 1249,
    rating: 4.8,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    tag: "Best Seller",
    description: "Immerse yourself in unrivaled luxury. The Emilie velvet lounge sofa features premium high-resilience foam wrapped in deep moss velvet, resting on solid tapered walnut wood legs.",
    specifications: {
      material: "High-density Velvet, Solid Walnut",
      dimensions: "92\"W x 38\"D x 34\"H",
      weight: "145 lbs",
      assemblyRequired: true
    }
  },
  {
    id: 2,
    name: "Hesper Danish Oak Dining Table",
    category: "dining",
    price: 899,
    rating: 4.9,
    reviewsCount: 84,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80",
    tag: "New",
    description: "Honoring traditional Nordic woodwork, the Hesper Dining Table is crafted from solid American white oak with soft, rounded edges that bring a warm, architectural presence to your home.",
    specifications: {
      material: "Solid White Oak",
      dimensions: "78\"W x 36\"D x 30\"H",
      weight: "110 lbs",
      assemblyRequired: true
    }
  },
  {
    id: 3,
    name: "Aero Ergonomic Task Chair",
    category: "office",
    price: 349,
    rating: 4.7,
    reviewsCount: 215,
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80",
    description: "Reimagine work comforts. Designed with an advanced 3D dynamic lumbar mesh, multi-axis armrests, and synchro-tilt mechanism that naturally cradles and aligns your spine.",
    specifications: {
      material: "Breathable ElastoMesh, Steel Alloy Frame",
      dimensions: "27\"W x 27\"D x 42\"-46\"H",
      weight: "48 lbs",
      assemblyRequired: false
    }
  },
  {
    id: 4,
    name: "Isla Bouclé Accent Armchair",
    category: "living",
    price: 499,
    rating: 4.6,
    reviewsCount: 62,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
    tag: "Design Award",
    description: "Make a sculptural statement. Isla is wrapped in rich off-white textured bouclé fabric, offering a comforting cocoon silhouette that serves as a centerpiece in any modern lounge.",
    specifications: {
      material: "Textured Bouclé Fabric, Bent Plywood",
      dimensions: "34\"W x 32\"D x 29\"H",
      weight: "55 lbs",
      assemblyRequired: false
    }
  },
  {
    id: 5,
    name: "Nordic Minimalist Bed Frame",
    category: "bedroom",
    price: 799,
    rating: 4.9,
    reviewsCount: 140,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    description: "Create an oasis of calm. Our platform bed frame features an integrated floating headboard, handcrafted using sustainably harvested red oak veneers with natural oil finishes.",
    specifications: {
      material: "Sustainably Harvested Red Oak",
      dimensions: "84\"W x 65\"D x 40\"H (Queen)",
      weight: "130 lbs",
      assemblyRequired: true
    }
  },
  {
    id: 6,
    name: "Milo Floating Bedside Drawer",
    category: "bedroom",
    price: 249,
    rating: 4.5,
    reviewsCount: 97,
    image: "https://images.unsplash.com/photo-1532372320978-9b4d7a92b24d?auto=format&fit=crop&w=800&q=80",
    description: "Maximize floor space with elegant utility. The Milo floating drawer mounts seamlessly on your wall, offering a spacious push-to-open drawer and cord management portals.",
    specifications: {
      material: "Walnut Wood Veneer",
      dimensions: "18\"W x 14\"D x 8\"H",
      weight: "18 lbs",
      assemblyRequired: true
    }
  },
  {
    id: 7,
    name: "Carrara Marble Coffee Table",
    category: "living",
    price: 599,
    rating: 4.8,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    description: "A timeless dialogue between stone and metal. Hand-polished honed Italian Carrara marble sits upon a sleek, matte black powder-coated structural steel cross frame.",
    specifications: {
      material: "Carrara Marble, Powder-Coated Steel",
      dimensions: "36\" Diameter x 16\"H",
      weight: "74 lbs",
      assemblyRequired: false
    }
  },
  {
    id: 8,
    name: "Titan Oak & Metal Bookshelf",
    category: "office",
    price: 429,
    rating: 4.7,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80",
    description: "High-grade industrial styling. This heavy-duty storage unit features five tiers of gorgeous solid oak planks held together by structural powder-coated carbon steel uprights.",
    specifications: {
      material: "Solid Oak Shelves, Carbon Steel frame",
      dimensions: "40\"W x 12\"D x 72\"H",
      weight: "95 lbs",
      assemblyRequired: true
    }
  }
];

/* ── Scroll Sequence Constants ────────────────────── */
const FRAME_COUNT = 161;
const FRAME_PATH = (i: number) => `/frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
const NATIVE_W = 1280;
const NATIVE_H = 720;

export default function App() {
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
      img.src = FRAME_PATH(idx + 1); // 1-indexed filenames

      img.onload = () => {
        framesRef.current[idx] = img;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        // Paint the first frame immediately so there's something visible
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

    // Check if the browser supports 'closedBy' property
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

  // Open dialog whenever product selection updates
  useEffect(() => {
    if (selectedProduct && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [selectedProduct]);

  // Close dialog clean-up handler
  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setSelectedProduct(null);
  };

  // Add Item to Cart
  const handleAddToCart = (id: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === id);
      if (existing) {
        return prevCart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { id, quantity: 1 }];
    });
    // Open cart drawer when adding item for nice micro-interaction feedback
    setCartOpen(true);
  };

  // Update Cart Quantity
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

  // Remove Item from Cart
  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  // Toggle Wishlist Status
  const handleToggleWishlist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering open modal details
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(id)) {
        return prevWishlist.filter(itemId => itemId !== id);
      }
      return [...prevWishlist, id];
    });
  };

  // Handle Newsletter Submission
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
    
    // Clear message after 4s
    setTimeout(() => {
      setNewsletterStatus('idle');
      setNewsletterMessage('');
    }, 4000);
  };

  // Filter & Sort Products
  const filteredProducts = PRODUCTS_DATA.filter(product => {
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
    return 0; // Default Featured sorting (original layout order)
  });

  // Totals calculations
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const product = PRODUCTS_DATA.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <>
      {/* Sticky Header Navigation */}
      <header className="main-header">
        <div className="container header-container">
          <a href="#" className="brand-logo">AURA</a>
          
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
            
            <button 
              className="action-btn wishlist-toggle-btn"
              onClick={() => {
                // Instantly filter list by user wishlist or search
                setActiveCategory('all');
                setSearchQuery('');
                // If query matches some wishlist stuff or just alerts user
                alert(`Wishlisted items: ${wishlist.length ? wishlist.map(id => PRODUCTS_DATA.find(p=>p.id===id)?.name).join(', ') : 'No items yet'}`);
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
        
        {/* ── Loading Overlay (shown while frames preload) ── */}
        {!framesLoaded && (
          <div className="seq-loader">
            <div className="seq-loader-inner">
              <div className="seq-loader-brand">AURA</div>
              <div className="seq-loader-bar-track">
                <div className="seq-loader-bar-fill" style={{ width: `${loadProgress}%` }} />
              </div>
              <div className="seq-loader-pct">{loadProgress}%</div>
            </div>
          </div>
        )}

        {/* ── Scroll-Linked Canvas Hero Sequence ── */}
        <div id="hero-sequence-wrapper" className="hero-sequence-wrapper">
          <canvas
            id="hero-canvas"
            ref={canvasRef}
            className="hero-sequence-canvas"
          />

          {/* Overlay text that sits on top of the pinned canvas */}
          <div className="hero-overlay-content hero-overlay-intro">
            <span className="hero-tag">Aura Artisanal Series // 2026</span>
            <h1 className="hero-title">Space is a Canvas.<br />Write Your Story.</h1>
            <p className="hero-subtitle">
              Crafted for comfort, built for longevity. A curated collection of mid-century minimalist furniture, handcrafted with sustainable premium American hardwoods.
            </p>
            <div className="hero-ctas">
              <a href="#products" className="btn btn-primary">Browse Catalogue</a>
              <a href="#about" className="btn btn-secondary">Discover Craftsmanship</a>
            </div>
          </div>

          <div className="hero-overlay-content hero-overlay-stats">
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Sustainable Solid Wood</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10+ Yr</span>
                <span className="stat-label">Structural Guarantee</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9 ★</span>
                <span className="stat-label">Average Rating (5k+ reviews)</span>
              </div>
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
            {[
              { id: 'living', name: 'Living Room', count: '3 Products', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80' },
              { id: 'bedroom', name: 'Bedroom', count: '2 Products', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80' },
              { id: 'dining', name: 'Dining Room', count: '1 Product', image: 'https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=600&q=80' },
              { id: 'office', name: 'Home Office', count: '2 Products', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80' },
            ].map(cat => (
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
          <div className="section-header">
            <h2 className="section-title">Discover Our Pieces</h2>
            <p className="section-subtitle">A collection that prioritizes structural integrity, raw materials, and clean joinery.</p>
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
                            e.stopPropagation(); // Stop opening quick view
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
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80" 
                alt="Mid-century modern room with plants and bedside wood drawer"
                className="craft-img-primary"
              />
              <img 
                src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80" 
                alt="Woodworking joinery detail"
                className="craft-img-secondary"
              />
            </div>
            <div className="craft-content">
              <span className="section-label">OUR PHILOSOPHY</span>
              <h2>Handcrafted Heritage & Honest Joinery</h2>
              <p>
                We believe that furniture shouldn’t just fill a space; it should ground it. Every piece in the AURA series is constructed in our local workshop using traditional mortise-and-tenon joints, ensuring that no metals compromise the flex and breathing of natural timber.
              </p>
              <p>
                We collaborate exclusively with FSC-certified family forests in the Pacific Northwest, promising that for every walnut or oak timber logged, three saplings are planted in their stead. Designed for contemporary life, guaranteed to last generations.
              </p>
              <div className="benefits-checklist">
                <div className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <span>100% Solid Solid Wood (No particle board, ever)</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <span>Zero-VOC Natural Wax Oil finishes</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <span>Free White-glove delivery on all collections</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section id="testimonials" className="testimonials-section container">
          <div className="section-header">
            <h2 className="section-title">Enduring Opinions</h2>
            <p className="section-subtitle">Hear what design enthusiasts say about their AURA collections.</p>
          </div>

          <div className="testimonials-grid">
            {[
              {
                text: "The Emilie Sofa completely converted our living room. The moss green velvet is incredibly rich, and you can instantly feel the sturdiness of the walnut frame.",
                author: "Clarissa Vance",
                role: "Interior Designer",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
              },
              {
                text: "Rarely do you find furniture online that matches or exceeds the photograph. The oak dining table is an absolute masterpiece of carpentry. Highly recommend.",
                author: "Julian Reynolds",
                role: "Architect",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
              },
              {
                text: "Aero task chair makes home office hours a delight. Lumbar adjustment is dynamic and the mesh is highly breathable. Beautifully marries function and modern style.",
                author: "Sarah Jenkins",
                role: "Remote Software Engineer",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
              }
            ].map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="reviewer-avatar">
                    <img src={t.avatar} alt={t.author} />
                  </div>
                  <div>
                    <h4 className="reviewer-name">{t.author}</h4>
                    <span className="reviewer-role">{t.role}</span>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Subscription Banner */}
        <section className="newsletter-section">
          <div className="container newsletter-content">
            <span className="section-label">AURA CIRCLE</span>
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
                const product = PRODUCTS_DATA.find(p => p.id === item.id);
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
            <h3 className="footer-logo">AURA</h3>
            <p>Premium architectural and minimalist home designs, handcrafted with ecological care.</p>
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
              <li><a href="#">White-Glove Shipping</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Warranty Details</a></li>
              <li><a href="#">Care & Restoration</a></li>
            </ul>
          </div>
          
          <div className="footer-links-col">
            <h4>Showrooms</h4>
            <ul>
              <li><a href="#">Portland Workshop</a></li>
              <li><a href="#">Seattle Showroom</a></li>
              <li><a href="#">Los Angeles Gallery</a></li>
              <li><a href="#">Brooklyn Collective</a></li>
            </ul>
          </div>
        </div>
        
        <div className="container footer-copyright-row">
          <p>© {new Date().getFullYear()} AURA Furniture Inc. All rights reserved.</p>
          <div className="footer-policy-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
