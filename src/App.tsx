import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Twitter, Search, ChevronRight, ArrowLeft } from 'lucide-react';
import content from './data/content.json';

const theme = content.theme;

const social = content.socialLinks;
const SocialIcons = ({ size = 16, strokeWidth = 1.5, className = "opacity-50 hover:opacity-100 hover:text-[var(--color-accent)] transition-all" }: { size?: number, strokeWidth?: number, className?: string }) => (
  <>
    {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className={className}><Instagram size={size} strokeWidth={strokeWidth} /></a>}
    {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className={className}><Facebook size={size} strokeWidth={strokeWidth} /></a>}
    {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className={className}><Twitter size={size} strokeWidth={strokeWidth} /></a>}
    {!social.instagram && !social.facebook && !social.twitter && (
      <>
        <a href="#" className={className}><Instagram size={size} strokeWidth={strokeWidth} /></a>
        <a href="#" className={className}><Facebook size={size} strokeWidth={strokeWidth} /></a>
        <a href="#" className={className}><Twitter size={size} strokeWidth={strokeWidth} /></a>
      </>
    )}
  </>
);
export default function App() {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<{type: string, value?: string}>({ type: 'home' });
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 2;

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-bg', theme.backgroundColor);
    root.style.setProperty('--color-footer-bg', theme.footerBackground);
    root.style.setProperty('--color-sidebar-bg', theme.sidebarBackground);
  }, []);

  // Scroll to top when changing views or pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePostId, activeView, currentPage]);

  const allPosts = [content.heroPost, ...content.posts];
  const activePost = activePostId ? allPosts.find(p => p.id === activePostId) : null;

  const handleNavClick = (item: {type: string, value?: string}) => {
    setActivePostId(null);
    setActiveView({ type: item.type, value: item.value });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(content.posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = content.posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ backgroundColor: theme.backgroundColor, color: theme.primaryColor }}>
      {/* Top Bar */}
      <div className="w-full border-b border-[var(--color-primary)]/10 py-3 px-6 flex justify-between items-center text-sm opacity-60">
        <div className="flex gap-4">
          <SocialIcons size={16} className="hover:opacity-100 hover:text-[var(--color-accent)] transition-all" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-100 hover:text-[var(--color-accent)] transition-all">
          <Search size={16} />
          <span className="uppercase tracking-widest text-xs">Search</span>
        </div>
      </div>

      {/* Header */}
      <header className="py-16 text-center cursor-pointer group" onClick={() => handleNavClick({type: 'home'})}>
        <h1 className="font-serif text-5xl md:text-6xl tracking-widest mb-4 group-hover:text-[var(--color-accent)] transition-colors duration-500 drop-shadow-md">
          {content.siteName}
        </h1>
        <p className="opacity-60 tracking-[0.2em] text-xs uppercase">
          {content.subtitle}
        </p>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 backdrop-blur-md z-50 border-y border-[var(--color-primary)]/10" style={{ backgroundColor: `${theme.backgroundColor}CC` }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex justify-center gap-8 md:gap-12 text-xs font-medium tracking-[0.15em] uppercase">
          {content.nav.map((item, i) => (
            <button
              key={i}
              onClick={() => handleNavClick(item)}
              className={`hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.15em] ${(activeView.type === item.type && activeView.value === item.value && !activePostId) ? 'font-bold opacity-100' : 'opacity-60'}`}
              style={(activeView.type === item.type && activeView.value === item.value && !activePostId) ? { color: theme.accentColor || theme.primaryColor } : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {activePost ? (
          /* Single Post View */
          <article className="max-w-3xl mx-auto animate-in fade-in duration-700">
            <button
              onClick={() => setActivePostId(null)}
              className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase opacity-50 hover:opacity-100 hover:text-[var(--color-accent)] transition-all mb-12"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="text-center mb-12">
              <span className="text-xs font-medium tracking-[0.2em] opacity-50 uppercase mb-6 block text-[var(--color-accent)]">
                {activePost.category} <span className="mx-2 opacity-30">|</span> {activePost.date}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight drop-shadow-sm">
                {activePost.title}
              </h2>
            </div>

            <div className="mb-12 meme-shadow overflow-hidden rounded-lg">
              <img
                src={activePost.image}
                alt={activePost.title}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="prose prose-lg max-w-none font-light opacity-80 leading-loose space-y-8 tracking-wide">
              {activePost.content?.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-20 pt-10 border-t border-[var(--color-primary)]/10 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <span className="text-xs tracking-widest uppercase opacity-40">Share:</span>
                <a href="#" className="opacity-50 hover:opacity-100 hover:text-[var(--color-accent)] transition-all"><Facebook size={16} /></a>
                <a href="#" className="opacity-50 hover:opacity-100 hover:text-[var(--color-accent)] transition-all"><Twitter size={16} /></a>
              </div>
            </div>
          </article>
        ) : activeView.type === 'category' ? (
          /* Category View */
          <div className="animate-in fade-in duration-700">
            <div className="mb-16 text-center border-b border-[var(--color-primary)]/10 pb-16">
              <h2 className="font-serif text-4xl tracking-widest uppercase">{activeView.value}</h2>
              <p className="opacity-50 mt-4 tracking-[0.2em] text-xs uppercase">Category Archives</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {allPosts.filter(p => p.category === activeView.value).map((post, i) => (
                <article key={i} className="group cursor-pointer" onClick={() => setActivePostId(post.id)}>
                  <div className="overflow-hidden mb-6 rounded shadow-lg meme-shadow">
                    <img src={post.image} alt={post.title} className="w-full h-[250px] object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  </div>
                  <div className="text-center px-2">
                    <span className="text-xs font-medium tracking-[0.2em] opacity-50 uppercase mb-3 block text-[var(--color-accent)]">
                      {post.date}
                    </span>
                    <h3 className="font-serif text-xl mb-4 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                      {post.title}
                    </h3>
                    <button className="text-[10px] font-medium tracking-[0.2em] uppercase border-b border-[var(--color-primary)] pb-1 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all">
                      Read More
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {allPosts.filter(p => p.category === activeView.value).length === 0 && (
              <p className="text-center opacity-40 font-light py-20">目前這個分類還沒有文章喔！</p>
            )}
          </div>
        ) : activeView.type === 'about' ? (
          /* About View */
          <div className="max-w-3xl mx-auto text-center animate-in fade-in duration-700 py-10">
            <h2 className="font-serif text-4xl tracking-widest uppercase mb-12 drop-shadow-sm">{content.sidebar.about.title}</h2>
            <div className="overflow-hidden mb-10 w-full max-w-md mx-auto aspect-[4/5] rounded-xl meme-shadow">
               <img src={content.sidebar.about.image} alt={content.sidebar.about.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <h3 className="font-serif text-3xl mb-6 text-[var(--color-accent)]">{content.sidebar.about.name}</h3>
            <p className="opacity-80 leading-loose font-light text-lg">
              {content.sidebar.about.description}
            </p>
            <p className="opacity-80 leading-loose font-light text-lg mt-6">
              {content.sidebar.aboutExtended}
            </p>
            <div className="mt-16 flex justify-center gap-6">
              <SocialIcons size={24} />
            </div>
          </div>
        ) : (
          /* Home View (List of Posts) */
          <div className="animate-in fade-in duration-700">
            {/* Hero Post */}
            <section className="mb-24">
              <div className="group cursor-pointer" onClick={() => setActivePostId(content.heroPost.id)}>
                <div className="overflow-hidden mb-8 rounded-xl meme-shadow">
                  <img
                    src={content.heroPost.image}
                    alt={content.heroPost.title}
                    className="w-full h-[50vh] md:h-[70vh] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                </div>
                <div className="text-center max-w-3xl mx-auto px-4">
                  <span className="text-xs font-medium tracking-[0.2em] opacity-50 uppercase mb-4 block text-[var(--color-accent)]">
                    {content.heroPost.category} <span className="mx-2 opacity-30">|</span> {content.heroPost.date}
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl mb-6 group-hover:text-[var(--color-accent)] transition-colors duration-300 leading-tight drop-shadow-md">
                    {content.heroPost.title}
                  </h2>
                  <p className="opacity-70 leading-relaxed mb-8 font-light tracking-wide">
                    {content.heroPost.excerpt}
                  </p>
                  <button className="text-xs font-medium tracking-[0.2em] uppercase border-b border-[var(--color-primary)] pb-1 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all">
                    Read More
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Main Content - Posts List */}
              <div className="lg:col-span-8 space-y-24">
                {paginatedPosts.map((post, i) => (
                  <article key={i} className="group cursor-pointer" onClick={() => setActivePostId(post.id)}>
                    <div className="overflow-hidden mb-8 rounded-lg meme-shadow">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-[300px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                    </div>
                    <div className="text-center px-4">
                      <span className="text-xs font-medium tracking-[0.2em] opacity-50 uppercase mb-4 block text-[var(--color-accent)]">
                        {post.category} <span className="mx-2 opacity-30">|</span> {post.date}
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl mb-5 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="opacity-70 leading-relaxed mb-6 text-sm font-light">
                        {post.excerpt}
                      </p>
                      <button className="text-xs font-medium tracking-[0.2em] uppercase border-b border-[var(--color-primary)] pb-1 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all">
                        Read More
                      </button>
                    </div>
                  </article>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-3 pt-12 border-t border-[var(--color-primary)]/10">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 flex items-center justify-center border text-sm font-medium transition-colors ${currentPage === i + 1 ? 'border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]' : 'border-transparent opacity-50 hover:opacity-100 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="w-10 h-10 flex items-center justify-center opacity-50 hover:opacity-100 hover:text-[var(--color-accent)] cursor-pointer transition-colors"
                      >
                        <ChevronRight size={18} strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-16">
                {/* About Widget */}
                <div className="text-center">
                  <h4 className="font-serif text-xl mb-8 tracking-[0.15em] uppercase relative after:content-[''] after:block after:w-8 after:h-[1px] after:bg-[var(--color-primary)] after:opacity-30 after:mx-auto after:mt-4">
                    {content.sidebar.about.title}
                  </h4>
                  <div className="overflow-hidden mb-6 cursor-pointer rounded-lg meme-shadow" onClick={() => handleNavClick({type: 'about'})}>
                    <img
                      src={content.sidebar.about.image}
                      alt={content.sidebar.about.name}
                      className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <h5 className="font-serif text-2xl mb-3 text-[var(--color-accent)]">{content.sidebar.about.name}</h5>
                  <p className="opacity-70 text-sm leading-relaxed font-light">
                    {content.sidebar.about.description}
                  </p>
                  <button onClick={() => handleNavClick({type: 'about'})} className="mt-8 text-xs font-medium tracking-[0.2em] uppercase border-b border-[var(--color-primary)] pb-1 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all">
                    Read More
                  </button>
                </div>

                {/* Categories Widget */}
                <div>
                  <h4 className="font-serif text-xl mb-8 tracking-[0.15em] uppercase text-center relative after:content-[''] after:block after:w-8 after:h-[1px] after:bg-[var(--color-primary)] after:opacity-30 after:mx-auto after:mt-4">
                    Categories
                  </h4>
                  <ul className="space-y-4">
                    {content.sidebar.categories.map((cat, i) => (
                      <li key={i} onClick={() => handleNavClick({type: 'category', value: cat.value})} className="flex justify-between items-center text-sm opacity-70 hover:opacity-100 hover:text-[var(--color-accent)] cursor-pointer group font-light transition-colors">
                        <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                        <span className="opacity-50 text-xs">({cat.count})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Follow Me Widget */}
                <div className="text-center p-10 border border-[var(--color-primary)]/10 rounded-xl" style={{ backgroundColor: theme.sidebarBackground }}>
                  <h4 className="font-serif text-xl mb-8 tracking-[0.15em] uppercase">
                    Follow Me
                  </h4>
                  <div className="flex justify-center gap-6">
                    <SocialIcons size={20} />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-20 text-center mt-20 border-t border-[var(--color-primary)]/10" style={{ backgroundColor: theme.footerBackground }}>
        <h2 className="font-serif text-3xl tracking-[0.2em] mb-10 text-[var(--color-primary)]">{content.siteName}</h2>
        <div className="flex justify-center gap-8 mb-12 text-[var(--color-primary)]">
          <SocialIcons size={20} className="opacity-50 hover:opacity-100 hover:text-[var(--color-accent)] transition-colors" />
        </div>
        <p className="text-[10px] opacity-40 tracking-[0.2em] uppercase">
          {content.footer.text}
        </p>
      </footer>
    </div>
  );
}
