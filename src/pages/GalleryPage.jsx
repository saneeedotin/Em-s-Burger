import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Pin, Search, X, ExternalLink, Bookmark, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVegMode } from '../context/VegModeContext';

const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Pins' },
  { id: 'menu-cards', label: 'Physical Menu Cards 📜' },
  { id: 'pull-me-up', label: 'Pull Me Up & UFOs 🧀' },
  { id: 'classics', label: 'Classic Burgers 🍔' },
  { id: 'sides', label: 'Sides & Drinks 🍟' },
  { id: 'vibe', label: 'Cafe Vibe ✨' },
];

const GALLERY_PINS = [
  {
    id: 'pin-menu-1',
    title: "EM's Physical Menu Card — Front",
    subtitle: 'Classic Cheeseburgers, Signatures, UFOs & Croissant Takeovers',
    category: 'menu-cards',
    image: '/assets/menu.jpeg',
    aspectRatio: 'aspect-[3/4]',
    tag: 'Official Menu',
    description: 'Full front menu card featuring prices & descriptions for Classic Burgers, Signatures, UFOs, and Croissant Takeover.',
    featured: true,
    isVeg: false
  },
  {
    id: 'pin-menu-2',
    title: "EM's Physical Menu Card — Back",
    subtitle: 'Pull Me Up, Slider Buckets, Salads, Sides & Beverages',
    category: 'menu-cards',
    image: '/assets/menu 2.jpeg',
    aspectRatio: 'aspect-[3/4]',
    tag: 'Official Menu',
    description: 'Back menu card featuring Pull Me Up Cheese Fondue burgers, Slider Buckets (3/6/9/12 pcs), Sides & Hot/Cold Drinks.',
    featured: true,
    isVeg: false
  },
  {
    id: 'pin-pmu-1',
    title: 'Pull Me Up Molten Cheese Cascade',
    subtitle: 'Triple-cheese fondue cascade over smashed patties',
    category: 'pull-me-up',
    image: '/assets/PMU.png',
    aspectRatio: 'aspect-[4/5]',
    tag: 'Signature',
    description: 'Our iconic Pull Me Up burger. Lift the acrylic cylinder and watch molten cheddar drown the burger.',
    isVeg: false
  },
  {
    id: 'pin-sb-1',
    title: 'Double Stack Smash Slider Bucket',
    subtitle: 'Crispy smash patties with garlic aioli & pickles',
    category: 'classics',
    image: '/assets/SB.png',
    aspectRatio: 'aspect-square',
    tag: 'Smash Hit',
    description: 'Double smashed chicken patties, caramelized onions, house pickles and double American cheddar.',
    isVeg: false
  },
  {
    id: 'pin-thecha',
    title: 'Chembur Local Special — Thecha UFO Burger',
    subtitle: 'Spicy maharashtrian green chili garlic lasun chutney',
    category: 'pull-me-up',
    image: '/assets/THECHA BURGER.png',
    aspectRatio: 'aspect-[4/5]',
    tag: 'Chembur Fusion',
    description: 'Batata vada, melted cheddar, lasun chutney and fried green chillies press-sealed in a UFO saucer.',
    isVeg: true
  },
  {
    id: 'pin-destroyed-fries',
    title: 'Smashed Destroyed Fries',
    subtitle: 'Loaded with liquid cheddar, fried chicken & secret sauce',
    category: 'sides',
    image: '/assets/Destroyed Fries.png',
    aspectRatio: 'aspect-[4/3]',
    tag: 'Loaded Side',
    description: 'Fresh hand-cut potato fries smashed and overloaded with molten mozzarella, fried chicken bits & house ranch.',
    isVeg: false
  },
  {
    id: 'pin-meltdown',
    title: 'The Ultimate Meltdown Burger',
    subtitle: 'Double smashed patty, cheese trio, fried egg & sausages',
    category: 'classics',
    image: '/assets/Meltdown .png',
    aspectRatio: 'aspect-[4/5]',
    tag: 'Chef Special',
    description: 'Double smashed chicken patty, cheese trio, sausages, egg and chef special sauce served in toasted brioche.',
    isVeg: false
  },
  {
    id: 'pin-croissant',
    title: 'Flaky Butter Croissant Lamb Takeover',
    subtitle: 'French pastry meets spiced lamb smash',
    category: 'classics',
    image: '/assets/Croissant Takeover .png',
    aspectRatio: 'aspect-square',
    tag: 'Gourmet',
    description: 'Smashed lamb patty with caramelized onions, melted cheddar and fresh slaw inside a flaky butter croissant.',
    isVeg: false
  },
  {
    id: 'pin-mac-cheese',
    title: 'Deep-Fried Mac & Cheese Bites',
    subtitle: 'Golden panko-crusted three-cheese cubes',
    category: 'sides',
    image: '/assets/Mac and Cheese.png',
    aspectRatio: 'aspect-[4/3]',
    tag: 'Crispy Snack',
    description: 'Panko-crusted golden fried mac & three-cheese cubes served with sweet chilli dipping sauce.',
    isVeg: true
  },
  {
    id: 'pin-truffle-fries',
    title: 'Gourmet Truffle & Parmesan Fries',
    subtitle: 'Tossed in white truffle oil and fresh herbs',
    category: 'sides',
    image: '/assets/Truffle Fries.png',
    aspectRatio: 'aspect-[4/3]',
    tag: 'Gourmet Side',
    description: 'Crispy hand-cut fries drizzled with aromatic white truffle oil, shaved parmesan and sea salt.',
    isVeg: true
  },
  {
    id: 'pin-avocado',
    title: 'Veggie Avocado & Salsa Burger',
    subtitle: 'Hass avocado smash with crispy tortilla crunch',
    category: 'classics',
    image: '/assets/Veggie Avacado.png',
    aspectRatio: 'aspect-[4/5]',
    tag: 'Fresh Veg',
    description: 'Crispy veggie patty with fresh Hass avocado smash, hot salsa, melted cheese and tortilla chips.',
    isVeg: true
  },
  {
    id: 'pin-storefront',
    title: 'EM\'s Chembur Storefront',
    subtitle: 'Warm neon lighting & outdoor camp seating',
    category: 'vibe',
    image: '/assets/734472269_18077777912674347_7065558441735710182_n.jpg',
    aspectRatio: 'aspect-[4/5]',
    tag: 'Store Vibe',
    description: 'Our cozy Chembur Camp location. The perfect hangout spot for late night burger cravings.',
    isVeg: true
  },
  {
    id: 'pin-drizzle',
    title: 'Handcrafted Food Art',
    subtitle: 'Fresh ingredients prepared daily in-house',
    category: 'vibe',
    image: '/assets/753231495_17901115944525648_6127737266352346250_n.jpg',
    aspectRatio: 'aspect-[4/5]',
    tag: 'Kitchen Art',
    description: 'Behind the scenes at EM\'s kitchen — every bun is baked daily and every sauce is made from scratch.',
    isVeg: true
  },
  {
    id: 'pin-choco-shake',
    title: 'Choco Blast Thickshake',
    subtitle: 'Double cocoa shot whipped with ice cream',
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    aspectRatio: 'aspect-[3/4]',
    tag: 'Cold Drink',
    description: 'Rich chocolate thickshake topped with cocoa sprinkles and whipped cream.',
    isVeg: true
  },
  {
    id: 'pin-hot-cocoa',
    title: 'Dark Cocoa Hot Chocolate',
    subtitle: 'Bittersweet Belgian chocolate brew',
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
    aspectRatio: 'aspect-[3/4]',
    tag: 'Hot Brew',
    description: 'Intense, bittersweet cocoa indulgence for true chocolate lovers on chilly evenings.',
    isVeg: true
  }
];

export function GalleryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [pinnedIds, setPinnedIds] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isVegOnly } = useVegMode();

  const togglePin = (e, id) => {
    e.stopPropagation();
    if (pinnedIds.includes(id)) {
      setPinnedIds(pinnedIds.filter((pId) => pId !== id));
    } else {
      setPinnedIds([...pinnedIds, id]);
    }
  };

  const filteredPins = GALLERY_PINS.filter((pin) => {
    const matchesTab = activeTab === 'all' || pin.category === activeTab;
    const matchesSearch =
      pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = isVegOnly ? pin.isVeg === true : true;
    
    return matchesTab && matchesSearch && matchesVeg;
  });

  return (
    <div className="bg-cream min-h-screen text-dark pt-12 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-primary" />
            <span>EM's Aesthetic Gallery</span>
          </div>

          <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl text-dark tracking-tight leading-[1.05]">
            THE PINTEREST VIBE BOARD
          </h1>

          <p className="text-dark/80 text-lg sm:text-xl font-medium leading-relaxed">
            Browse our curated food photography, physical menu cards, cheesy closeups & Chembur cafe aesthetic.
          </p>

          {/* Search Input Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
            <input
              type="text"
              placeholder="Search menu cards, burgers, sides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-cream-light border-2 border-primary/20 focus:border-primary focus:outline-none text-dark font-medium placeholder-dark/40 shadow-sm text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Pinterest Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap pb-2">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 rounded-full font-heading font-extrabold text-sm transition-all duration-300 ${
                activeTab === cat.id
                  ? 'bg-primary text-cream shadow-md scale-105'
                  : 'bg-cream-light text-dark/80 hover:text-dark hover:bg-cream-light/80 border border-primary/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pinterest Masonry Columns Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {filteredPins.map((pin) => {
            const isPinned = pinnedIds.includes(pin.id);
            return (
              <motion.div
                key={pin.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedPin(pin)}
                className="break-inside-avoid relative rounded-3xl overflow-hidden bg-primary-dark shadow-lg border-4 border-cream group cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
              >
                {/* Pin Image */}
                <div className={`w-full ${pin.aspectRatio} relative overflow-hidden bg-primary/20`}>
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Top Tag & Save/Pin Button */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                    <span className="px-3 py-1 rounded-full bg-cream/90 backdrop-blur-md text-primary font-heading font-black text-[10px] uppercase tracking-wider shadow-md">
                      {pin.tag}
                    </span>

                    <button
                      onClick={(e) => togglePin(e, pin.id)}
                      className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
                        isPinned
                          ? 'bg-accent text-dark scale-110'
                          : 'bg-dark/60 text-cream backdrop-blur-md hover:bg-accent hover:text-dark'
                      }`}
                      title={isPinned ? 'Saved to board' : 'Save pin'}
                    >
                      <Bookmark className={`w-4 h-4 ${isPinned ? 'fill-dark' : ''}`} />
                    </button>
                  </div>

                  {/* Hover Caption Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-cream z-10">
                    <h3 className="font-heading font-black text-lg leading-snug text-cream drop-shadow-md">
                      {pin.title}
                    </h3>
                    <p className="text-xs text-cream/80 font-medium line-clamp-2 mt-1">
                      {pin.subtitle}
                    </p>
                    <div className="pt-3 flex items-center gap-1.5 text-accent font-heading font-bold text-xs">
                      <span>Expand Pin</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Footer Bar (Visible on mobile/desktop always below image) */}
                <div className="p-4 bg-cream-light border-t border-primary/10 text-dark flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-extrabold text-sm line-clamp-1 text-primary">
                      {pin.title}
                    </h4>
                    <p className="text-[11px] text-dark/70 font-semibold line-clamp-1">
                      {pin.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredPins.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="text-4xl">🍔</div>
            <h3 className="font-heading font-black text-2xl text-primary">No pins found</h3>
            <p className="text-dark/70 text-sm">Try searching for something else or switch category tabs.</p>
          </div>
        )}

      </div>

      {/* Lightbox / Expanded Pin Modal */}
      <AnimatePresence>
        {selectedPin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-dark/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-cream rounded-4xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-primary shadow-2xl relative grid grid-cols-1 md:grid-cols-12 text-dark"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPin(null)}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-dark text-cream hover:bg-primary transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Column */}
              <div className="md:col-span-7 bg-primary-dark p-6 flex items-center justify-center min-h-[350px]">
                <img
                  src={selectedPin.image}
                  alt={selectedPin.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border-2 border-cream/20"
                />
              </div>

              {/* Modal Content Column */}
              <div className="md:col-span-5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
                    <Pin className="w-3.5 h-3.5" />
                    <span>{selectedPin.tag}</span>
                  </div>

                  <h2 className="font-heading font-black text-3xl text-dark leading-tight">
                    {selectedPin.title}
                  </h2>

                  <p className="text-primary font-heading font-bold text-base">
                    {selectedPin.subtitle}
                  </p>

                  <p className="text-dark/80 text-sm leading-relaxed font-medium pt-2">
                    {selectedPin.description}
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-primary/15">
                  <div className="flex gap-3">
                    <Link
                      to="/menu"
                      onClick={() => setSelectedPin(null)}
                      className="flex-1 py-3.5 px-4 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-extrabold text-sm text-center shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Explore On Menu</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={(e) => togglePin(e, selectedPin.id)}
                      className={`p-3.5 rounded-full border-2 border-primary font-heading font-bold text-sm flex items-center justify-center shadow-md transition-colors ${
                        pinnedIds.includes(selectedPin.id)
                          ? 'bg-accent text-dark border-accent'
                          : 'bg-cream text-primary hover:bg-primary/10'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${pinnedIds.includes(selectedPin.id) ? 'fill-dark' : ''}`} />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
