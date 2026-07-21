import React, { useState } from 'react';
import { useCMS } from './CMSContext';
import type { ThemeData } from '../types';
import { AdminManager } from '../auth/AdminManager';

export const CMSEditorDrawer: React.FC = () => {
  const { activeDrawer, setActiveDrawer, siteData, updateSiteData, showToast } = useCMS();
  const [activeTab, setActiveTab] = useState<'hero' | 'brand' | 'about' | 'testimonials' | 'footer' | 'theme' | 'admins'>('hero');

  if (!activeDrawer) return null;

  return (
    <>
      <div className="cms-drawer-overlay" onClick={() => setActiveDrawer(null)} />
      <aside className="cms-drawer">
        <div className="cms-drawer-header">
          <h3>🎨 Website Content Manager</h3>
          <button className="cms-btn" onClick={() => setActiveDrawer(null)}>✕</button>
        </div>

        <div className="cms-drawer-tabs">
          <button
            className={`cms-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            Hero Banner
          </button>
          <button
            className={`cms-tab-btn ${activeTab === 'brand' ? 'active' : ''}`}
            onClick={() => setActiveTab('brand')}
          >
            Branding
          </button>
          <button
            className={`cms-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            Our Story
          </button>
          <button
            className={`cms-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            Reviews
          </button>
          <button
            className={`cms-tab-btn ${activeTab === 'footer' ? 'active' : ''}`}
            onClick={() => setActiveTab('footer')}
          >
            Footer
          </button>
          <button
            className={`cms-tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            Theme
          </button>
          <button
            className={`cms-tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            👑 Admins
          </button>
        </div>

        <div className="cms-drawer-body">
          {/* TAB 1: HERO BANNER */}
          {activeTab === 'hero' && (
            <div>
              <div className="cms-form-group">
                <label>Hero Series Tag</label>
                <input
                  type="text"
                  value={siteData.hero.tag}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, tag: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Hero Title (Use \n or HTML for multiline)</label>
                <textarea
                  rows={2}
                  value={siteData.hero.title}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={siteData.hero.subtitle}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Primary CTA Text</label>
                <input
                  type="text"
                  value={siteData.hero.primaryCtaText}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, primaryCtaText: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Secondary CTA Text</label>
                <input
                  type="text"
                  value={siteData.hero.secondaryCtaText}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, secondaryCtaText: e.target.value },
                    }))
                  }
                />
              </div>

              <h4 style={{ margin: '1.2rem 0 0.6rem', color: 'hsl(var(--gold))' }}>Hero Highlights & Stats</h4>
              {siteData.hero.stats.map((stat, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Stat Number"
                    value={stat.number}
                    onChange={(e) => {
                      const newStats = [...siteData.hero.stats];
                      newStats[idx].number = e.target.value;
                      updateSiteData((prev) => ({ ...prev, hero: { ...prev.hero, stats: newStats } }));
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Stat Label"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...siteData.hero.stats];
                      newStats[idx].label = e.target.value;
                      updateSiteData((prev) => ({ ...prev, hero: { ...prev.hero, stats: newStats } }));
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: BRANDING & ANNOUNCEMENT */}
          {activeTab === 'brand' && (
            <div>
              <div className="cms-form-group">
                <label>Brand Logo Name</label>
                <input
                  type="text"
                  value={siteData.branding.logoText}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, logoText: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Concierge / Support Email</label>
                <input
                  type="email"
                  value={siteData.branding.contactEmail}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, contactEmail: e.target.value },
                    }))
                  }
                />
              </div>

              <h4 style={{ margin: '1.2rem 0 0.6rem', color: 'hsl(var(--gold))' }}>Announcement Banner Bar</h4>
              <div className="cms-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="announcementActive"
                  checked={siteData.branding.announcement.active}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      branding: {
                        ...prev.branding,
                        announcement: { ...prev.branding.announcement, active: e.target.checked },
                      },
                    }))
                  }
                />
                <label htmlFor="announcementActive" style={{ margin: 0 }}>Show Top Announcement Bar</label>
              </div>

              <div className="cms-form-group">
                <label>Announcement Tag Badge</label>
                <input
                  type="text"
                  value={siteData.branding.announcement.badgeText}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      branding: {
                        ...prev.branding,
                        announcement: { ...prev.branding.announcement, badgeText: e.target.value },
                      },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Announcement Message</label>
                <input
                  type="text"
                  value={siteData.branding.announcement.text}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      branding: {
                        ...prev.branding,
                        announcement: { ...prev.branding.announcement, text: e.target.value },
                      },
                    }))
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 3: CRAFTSMANSHIP / OUR STORY */}
          {activeTab === 'about' && (
            <div>
              <div className="cms-form-group">
                <label>Section Label</label>
                <input
                  type="text"
                  value={siteData.craftsmanship.label}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      craftsmanship: { ...prev.craftsmanship, label: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Headline Title</label>
                <input
                  type="text"
                  value={siteData.craftsmanship.title}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      craftsmanship: { ...prev.craftsmanship, title: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Story Paragraph 1</label>
                <textarea
                  rows={4}
                  value={siteData.craftsmanship.paragraph1}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      craftsmanship: { ...prev.craftsmanship, paragraph1: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Story Paragraph 2</label>
                <textarea
                  rows={4}
                  value={siteData.craftsmanship.paragraph2}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      craftsmanship: { ...prev.craftsmanship, paragraph2: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Primary Showcase Image URL</label>
                <input
                  type="text"
                  value={siteData.craftsmanship.primaryImage}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      craftsmanship: { ...prev.craftsmanship, primaryImage: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Secondary Detail Image URL</label>
                <input
                  type="text"
                  value={siteData.craftsmanship.secondaryImage}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      craftsmanship: { ...prev.craftsmanship, secondaryImage: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS & TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div>
              <h4 style={{ margin: '0 0 1rem', color: 'hsl(var(--gold))' }}>Customer Testimonials</h4>
              {siteData.testimonials.map((t, idx) => (
                <div key={t.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div className="cms-form-group">
                    <label>Reviewer Name & Role</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={t.author}
                        onChange={(e) => {
                          const updated = [...siteData.testimonials];
                          updated[idx].author = e.target.value;
                          updateSiteData((prev) => ({ ...prev, testimonials: updated }));
                        }}
                      />
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => {
                          const updated = [...siteData.testimonials];
                          updated[idx].role = e.target.value;
                          updateSiteData((prev) => ({ ...prev, testimonials: updated }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="cms-form-group">
                    <label>Testimonial Quote Text</label>
                    <textarea
                      rows={3}
                      value={t.text}
                      onChange={(e) => {
                        const updated = [...siteData.testimonials];
                        updated[idx].text = e.target.value;
                        updateSiteData((prev) => ({ ...prev, testimonials: updated }));
                      }}
                    />
                  </div>

                  <div className="cms-form-group">
                    <label>Avatar Photo URL</label>
                    <input
                      type="text"
                      value={t.avatar}
                      onChange={(e) => {
                        const updated = [...siteData.testimonials];
                        updated[idx].avatar = e.target.value;
                        updateSiteData((prev) => ({ ...prev, testimonials: updated }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: FOOTER */}
          {activeTab === 'footer' && (
            <div>
              <div className="cms-form-group">
                <label>Footer Logo Text</label>
                <input
                  type="text"
                  value={siteData.footer.logoText}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, logoText: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Footer Brand Tagline</label>
                <textarea
                  rows={2}
                  value={siteData.footer.tagline}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, tagline: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="cms-form-group">
                <label>Copyright Notice</label>
                <input
                  type="text"
                  value={siteData.footer.copyrightText}
                  onChange={(e) =>
                    updateSiteData((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, copyrightText: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 6: THEME & COLOR PALETTE */}
          {activeTab === 'theme' && (
            <div>
              <h4 style={{ margin: '0 0 0.8rem', color: 'hsl(var(--gold))' }}>Accent Color Palette</h4>
              <div className="cms-theme-options">
                {[
                  { id: 'gold', name: 'Artisanal Gold', dotClass: 'dot-gold' },
                  { id: 'emerald', name: 'Forest Emerald', dotClass: 'dot-emerald' },
                  { id: 'wood', name: 'Warm Walnut', dotClass: 'dot-wood' },
                  { id: 'terracotta', name: 'Terracotta', dotClass: 'dot-terracotta' },
                  { id: 'midnight', name: 'Midnight Iris', dotClass: 'dot-midnight' },
                ].map((palette) => (
                  <div
                    key={palette.id}
                    className={`cms-theme-card ${
                      siteData.theme?.colorPalette === palette.id ? 'selected' : ''
                    }`}
                    onClick={() => {
                      updateSiteData((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, colorPalette: palette.id as ThemeData['colorPalette'] },
                      }));
                      showToast(`Color palette changed to ${palette.name}`);
                    }}
                  >
                    <div className={`cms-theme-dot ${palette.dotClass}`} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{palette.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ADMIN MANAGEMENT */}
          {activeTab === 'admins' && (
            <AdminManager />
          )}
        </div>

        <div className="cms-drawer-footer">
          <button className="cms-btn cms-btn-primary" onClick={() => setActiveDrawer(null)}>
            Done Editing
          </button>
        </div>
      </aside>
    </>
  );
};
