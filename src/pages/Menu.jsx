import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMenu } from '../context/MenuContext';
import { MenuItemCard } from '../components/MenuItemCard';
import { PhysicalMenuLayout } from '../components/PhysicalMenuLayout';
import { ItemModal } from '../components/ItemModal';
import Masonry from '../components/Masonry';
import { Utensils, Sparkles, Filter, Search, LayoutGrid, List, BookOpen, MapPin, X } from 'lucide-react';
import { useVegMode } from '../context/VegModeContext';

gsap.registerPlugin(ScrollTrigger);

export function Menu() {
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isVegOnly } = useVegMode();
  const { categories: MENU_CATEGORIES, items: MENU_ITEMS } = useMenu();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'physical'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTable, setActiveTable] = useState(() => {
    return localStorage.getItem('ems_table') || sessionStorage.getItem('ems_table') || null;
  });

  // Check URL table parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      localStorage.setItem('ems_table', tableParam);
      sessionStorage.setItem('ems_table', tableParam);
      setActiveTable(tableParam);
    }
  }, [location.search]);

  const handleClearTable = () => {
    localStorage.removeItem('ems_table');
    sessionStorage.removeItem('ems_table');
    setActiveTable(null);
  };

  const filteredItems = MENU_ITEMS.filter((item) => {
    // 1. Check Global Veg Mode
    if (isVegOnly && !item.isVeg) return false;
    
    // 2. Check Category Filter
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    
    // 3. Check Veg/Non-Veg Tab Filter
    if (vegFilter === 'veg' && !item.isVeg) return false;
    if (vegFilter === 'nonveg' && item.isVeg) return false;
    
    // 4. Check Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const masonryItems = useMemo(() => {
    return filteredItems.map((item, index) => ({
      id: item.id,
      img: item.image,
      name: item.name,
      price: item.price,
      isVeg: item.isVeg,
      height: [200, 300, 240, 280, 220, 310][index % 6],
      onClick: () => setSelectedItem(item)
    }));
  }, [filteredItems]);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    gsap.set('.menu-card', { y: 40, opacity: 0 });

    ScrollTrigger.batch('.menu-card', {
      interval: 0.1,
      batchMax: 4,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true
        });
      },
      once: true
    });
    
    ScrollTrigger.refresh();
  }, { dependencies: [filteredItems, viewMode], scope: containerRef });

  return (
    <div ref={containerRef} className="pt-6 pb-12 sm:py-12 bg-cream doodles-red min-h-screen text-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Active Table Notification Banner */}
        {activeTable && (
          <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary text-cream flex items-center justify-center font-heading font-black text-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-black text-sm sm:text-base text-dark">
                  Dine-In • Table {activeTable}
                </div>
                <div className="text-xs text-dark/70">
                  Your table QR is active. Add items to place your table order.
                </div>
              </div>
            </div>

            <button
              onClick={handleClearTable}
              className="flex items-center gap-1 text-xs font-bold text-dark/50 hover:text-red-600 px-3 py-1.5 rounded-full bg-cream hover:bg-red-50 transition-colors"
              title="Clear table session"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* Menu Header */}
        <div className="max-w-3xl sm:mx-auto flex justify-between items-center">
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-dark tracking-tight sm:text-center text-left">
            Menu
          </h1>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Delivery Apps (Mobile Only) */}
            <div className="flex sm:hidden items-center gap-1.5">
              <a href="https://www.zomato.com/mumbai/ems-burgers-chembur/" target="_blank" rel="noopener noreferrer" className="w-[36px] h-[36px] bg-cream border border-[#E23744]/20 text-[#E23744] hover:bg-[#E23744] hover:text-white rounded-full flex items-center justify-center shadow-sm transition-colors" title="Order on Zomato">
                <span className="font-heading font-black italic text-sm mt-0.5">Z</span>
              </a>
              <a href="https://www.swiggy.com/city/mumbai/ems-burgers-chembur-rest1281237" target="_blank" rel="noopener noreferrer" className="w-[36px] h-[36px] bg-cream border border-[#fc8019]/20 text-[#fc8019] hover:bg-[#fc8019] hover:text-white rounded-full flex items-center justify-center shadow-sm transition-colors" title="Order on Swiggy">
                <span className="font-heading font-black italic text-sm mt-0.5">S</span>
              </a>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F4E9D8] border border-primary/20 rounded-full p-1 shadow-sm h-[36px] sm:h-[40px]">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-[#D9381E] text-cream shadow-sm' : 'text-dark/70 hover:text-dark hover:bg-black/5'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-[#D9381E] text-cream shadow-sm' : 'text-dark/70 hover:text-dark hover:bg-black/5'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode('physical')}
                className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center transition-colors ${viewMode === 'physical' ? 'bg-[#D9381E] text-cream shadow-sm' : 'text-dark/70 hover:text-dark hover:bg-black/5'}`}
                title="Book View"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-cream rounded-full font-heading font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 h-[40px]"
            >
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{showFilters ? 'Hide Options' : 'Menu Options'}</span>
              <span className="sm:hidden">{showFilters ? 'Hide' : 'Options'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-cream-light p-4 sm:p-6 rounded-3xl sm:rounded-4xl border-2 border-primary/15 shadow-lg space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {MENU_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative px-5 py-2.5 rounded-full font-heading font-bold text-sm transition-all focus:outline-none ${
                      isActive
                        ? 'bg-primary text-cream shadow-md scale-105'
                        : 'bg-primary/5 text-dark hover:bg-primary/15'
                    }`}
                  >
                    {cat.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryMarker"
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input & View Toggles */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-dark/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search burgers, sides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream border border-primary/20 text-dark text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* View Toggles */}
              <div className="flex bg-cream p-1 rounded-full border border-primary/20 shadow-sm shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-primary text-cream shadow-md' : 'text-dark/60 hover:text-dark hover:bg-primary/10'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-primary text-cream shadow-md' : 'text-dark/60 hover:text-dark hover:bg-primary/10'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('physical')}
                  className={`p-2 rounded-full transition-colors ${viewMode === 'physical' ? 'bg-primary text-cream shadow-md' : 'text-dark/60 hover:text-dark hover:bg-primary/10'}`}
                  title="Physical Menu"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        {/* Veg / Non-Veg Toggle Bar */}
        {!isVegOnly && viewMode !== 'physical' && (
          <div className="pt-4 border-t border-primary/10 flex flex-wrap items-center justify-between gap-4 text-xs font-bold font-heading">
            <div className="flex items-center gap-2">
              <span className="text-dark/60 uppercase">Filter Dietary:</span>
              <button
                onClick={() => setVegFilter('all')}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  vegFilter === 'all' ? 'bg-dark text-cream' : 'bg-primary/5 text-dark hover:bg-primary/10'
                }`}
              >
                All Options
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
                  vegFilter === 'veg' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Pure Veg
              </button>
              <button
                onClick={() => setVegFilter('nonveg')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
                  vegFilter === 'nonveg' ? 'bg-primary text-cream' : 'bg-red-100 text-primary hover:bg-red-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                Non-Veg
              </button>
            </div>

            <div className="text-dark/60">
              Showing <span className="text-primary font-black">{filteredItems.length}</span> items
            </div>
          </div>
        )}
        
        {isVegOnly && viewMode !== 'physical' && (
          <div className="pt-4 border-t border-primary/10 flex items-center justify-between gap-4 text-xs font-bold font-heading">
             <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Global Pure Veg Mode is Active
             </div>
             <div className="text-dark/60">
                Showing <span className="text-primary font-black">{filteredItems.length}</span> items
             </div>
          </div>
        )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic View Rendering */}
        {viewMode === 'physical' ? (
          <PhysicalMenuLayout isVegOnly={isVegOnly} onSelect={setSelectedItem} />
        ) : (
          <>
            {/* Mobile Bento Masonry Layout (Only in Grid View) */}
            <div className={`sm:hidden w-full ${viewMode === 'list' ? 'hidden' : 'block'}`}>
              <Masonry 
                items={masonryItems} 
                ease="sine.out"
                duration={0.6}
                stagger={0.08}
                animateFrom="bottom"
              />
            </div>

            {/* Desktop Grid Layout / Universal List Layout */}
            <motion.div 
              layout 
              className={`gap-3 sm:gap-6 ${
                viewMode === 'list' 
                  ? 'flex flex-col max-w-4xl mx-auto' 
                  : 'hidden sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <MenuItemCard key={`${item.id}-${item.image}-${item.price}`} item={item} viewMode={viewMode} onSelect={setSelectedItem} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {filteredItems.length === 0 && viewMode !== 'physical' && (
          <div className="text-center py-16 bg-cream-light rounded-4xl border-2 border-dashed border-primary/20 space-y-3">
            <h3 className="font-heading font-bold text-2xl text-dark">No dishes found</h3>
            <p className="text-dark/60 text-sm">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setVegFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-cream font-heading font-bold text-xs uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
      
      {/* Item Modal */}
      <ItemModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}
