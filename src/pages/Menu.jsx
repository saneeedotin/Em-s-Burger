import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menu';
import { MenuItemCard } from '../components/MenuItemCard';
import { PhysicalMenuLayout } from '../components/PhysicalMenuLayout';
import { Utensils, Sparkles, Filter, Search, LayoutGrid, List, BookOpen } from 'lucide-react';
import { useVegMode } from '../context/VegModeContext';

export function Menu() {
  const { isVegOnly } = useVegMode();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'physical'

  const filteredItems = MENU_ITEMS.filter((item) => {
    // Category match
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    
    // Veg/NonVeg match
    const vegMatch = isVegOnly 
      ? item.isVeg === true
      : vegFilter === 'all' ? true :
        vegFilter === 'veg' ? item.isVeg === true :
        item.isVeg === false;

    // Search query match
    const searchMatch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && vegMatch && searchMatch;
  });

  return (
    <div className="py-12 bg-cream min-h-screen text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Menu Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
            <Utensils className="w-4 h-4" />
            <span>Chembur Menu Showcase</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight">
            STACKED BURGERS & CRAFT SIDES
          </h1>

          <p className="text-dark/80 text-base sm:text-lg font-medium leading-relaxed">
            All prices are estimated placeholders until final client confirmation. Every item is cooked fresh to order in Chembur Camp!
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="bg-cream-light p-6 rounded-4xl border-2 border-primary/15 shadow-lg space-y-6">
          
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

        {/* Veg / Non-Veg Toggle Bar (Hidden in Physical View or if Global Veg Mode is on) */}
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

        {/* Dynamic View Rendering */}
        {viewMode === 'physical' ? (
          <PhysicalMenuLayout isVegOnly={isVegOnly} />
        ) : (
          <motion.div 
            layout 
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} viewMode={viewMode} />
              ))}
            </AnimatePresence>
          </motion.div>
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
    </div>
  );
}
