export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ProductSpecification {
  material: string;
  dimensions: string;
  weight: string;
  assemblyRequired: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string; // 'living' | 'bedroom' | 'dining' | 'office' | custom
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: string;
  description: string;
  specifications: ProductSpecification;
}

export interface Category {
  id: string;
  name: string;
  count: string;
  image: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  rating: number;
  avatar: string;
}

export interface HeroStat {
  number: string;
  label: string;
}

export interface HeroData {
  tag: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  stats: HeroStat[];
}

export interface CraftsmanshipData {
  label: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  benefits: string[];
  primaryImage: string;
  secondaryImage: string;
}

export interface SocialLink {
  name: string;
  code: string;
  url: string;
}

export interface FooterData {
  logoText: string;
  tagline: string;
  copyrightText: string;
  showrooms: string[];
  supportLinks: string[];
  socials: SocialLink[];
}

export interface AnnouncementData {
  active: boolean;
  text: string;
  badgeText: string;
}

export interface BrandingData {
  logoText: string;
  contactEmail: string;
  announcement: AnnouncementData;
}

export interface ThemeData {
  colorPalette: 'gold' | 'emerald' | 'wood' | 'terracotta' | 'midnight';
  fontFamily: 'serif' | 'sans' | 'mono';
  mode: 'dark' | 'light';
}

export interface SiteData {
  branding: BrandingData;
  hero: HeroData;
  categories: Category[];
  products: Product[];
  craftsmanship: CraftsmanshipData;
  testimonials: Testimonial[];
  footer: FooterData;
  theme: ThemeData;
}
