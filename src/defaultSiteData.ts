import type { SiteData } from './types';

export const DEFAULT_SITE_DATA: SiteData = {
  branding: {
    logoText: "AURA",
    contactEmail: "concierge@aurafurniture.com",
    announcement: {
      active: true,
      badgeText: "NEW drop 2026",
      text: "Free white-glove assembly & complimentary shipping on orders over $500."
    }
  },
  hero: {
    tag: "Aura Artisanal Series // 2026",
    title: "Space is a Canvas. Write Your Story.",
    subtitle: "Crafted for comfort, built for longevity. A curated collection of mid-century minimalist furniture, handcrafted with sustainable premium American hardwoods.",
    primaryCtaText: "Browse Catalogue",
    primaryCtaLink: "#products",
    secondaryCtaText: "Discover Craftsmanship",
    secondaryCtaLink: "#about",
    stats: [
      { number: "100%", label: "Sustainable Solid Wood" },
      { number: "10+ Yr", label: "Structural Guarantee" },
      { number: "4.9 ★", label: "Average Rating (5k+ reviews)" }
    ]
  },
  categories: [
    { id: 'living', name: 'Living Room', count: '3 Products', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80' },
    { id: 'bedroom', name: 'Bedroom', count: '2 Products', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80' },
    { id: 'dining', name: 'Dining Room', count: '1 Product', image: 'https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=600&q=80' },
    { id: 'office', name: 'Home Office', count: '2 Products', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80' }
  ],
  products: [
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
  ],
  craftsmanship: {
    label: "OUR PHILOSOPHY",
    title: "Handcrafted Heritage & Honest Joinery",
    paragraph1: "We believe that furniture shouldn’t just fill a space; it should ground it. Every piece in the AURA series is constructed in our local workshop using traditional mortise-and-tenon joints, ensuring that no metals compromise the flex and breathing of natural timber.",
    paragraph2: "We collaborate exclusively with FSC-certified family forests in the Pacific Northwest, promising that for every walnut or oak timber logged, three saplings are planted in their stead. Designed for contemporary life, guaranteed to last generations.",
    benefits: [
      "100% Solid Wood (No particle board, ever)",
      "Zero-VOC Natural Wax Oil finishes",
      "Free White-glove delivery on all collections"
    ],
    primaryImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80"
  },
  testimonials: [
    {
      id: 1,
      text: "The Emilie Sofa completely converted our living room. The moss green velvet is incredibly rich, and you can instantly feel the sturdiness of the walnut frame.",
      author: "Clarissa Vance",
      role: "Interior Designer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      text: "Rarely do you find furniture online that matches or exceeds the photograph. The oak dining table is an absolute masterpiece of carpentry. Highly recommend.",
      author: "Julian Reynolds",
      role: "Architect",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      text: "Aero task chair makes home office hours a delight. Lumbar adjustment is dynamic and the mesh is highly breathable. Beautifully marries function and modern style.",
      author: "Sarah Jenkins",
      role: "Remote Software Engineer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
    }
  ],
  footer: {
    logoText: "AURA",
    tagline: "Premium architectural and minimalist home designs, handcrafted with ecological care.",
    copyrightText: "© 2026 AURA Furniture Inc. All rights reserved.",
    showrooms: ["Portland Workshop", "Seattle Showroom", "Los Angeles Gallery", "Brooklyn Collective"],
    supportLinks: ["White-Glove Shipping", "Returns & Exchanges", "Warranty Details", "Care & Restoration"],
    socials: [
      { name: "Instagram", code: "IG", url: "#" },
      { name: "Pinterest", code: "PI", url: "#" },
      { name: "Facebook", code: "FB", url: "#" },
      { name: "Twitter", code: "TW", url: "#" }
    ]
  },
  theme: {
    colorPalette: 'gold',
    fontFamily: 'sans',
    mode: 'dark'
  }
};
