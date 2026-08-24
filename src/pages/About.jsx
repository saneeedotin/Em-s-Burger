import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ChefHat, Flame, History, X, Info, Pin, ArrowRight } from 'lucide-react';
import BounceCards from '../components/BounceCards';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export function About() {
  const storyContainerRef = useRef(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyRandomStyle = (reviewData) => {
    const styles = [
      { colorClass: 'bg-cream-light', textClass: 'text-dark', pinClass: 'bg-primary' },
      { colorClass: 'bg-accent', textClass: 'text-dark', pinClass: 'bg-primary-dark' },
      { colorClass: 'bg-primary', textClass: 'text-cream', pinClass: 'bg-accent' },
      { colorClass: 'bg-cream', textClass: 'text-dark', pinClass: 'bg-primary' }
    ];
    const rotations = ['-rotate-1', '-rotate-2', '-rotate-3', 'rotate-1', 'rotate-2', 'rotate-3'];
    const style = styles[Math.floor(Math.random() * styles.length)];
    
    return {
      ...reviewData,
      colorClass: style.colorClass,
      textClass: style.textClass,
      pinClass: style.pinClass,
      rotateClass: rotations[Math.floor(Math.random() * rotations.length)]
    };
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(data.map(applyRandomStyle));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  const favoritePicks = [
    {
      id: 'pull-me-up',
      name: 'Pull Me Up',
      img: '/assets/Pull me up.png',
      badge: 'Legendary',
      desc: 'Our signature burger with cheese pouring over it, turning comfort food into an interactive experience.',
      story: 'Designed to be visual and indulgent. We wanted to make a burger that was not just eaten, but experienced. The hot, flowing cheese cascade became a sensory experience in itself.'
    },
    {
      id: 'destroyed-fries',
      name: 'Destroyed Fries',
      img: '/assets/Destroyed Fries.png',
      badge: 'Best-Seller',
      desc: 'Comfort food with an indulgent EM\'s twist, loaded to the brim and packed with flavor.',
      story: 'We take classic golden fries and "destroy" them with our secret spices, layered cheese, and signature house-made sauces.'
    },
    {
      id: 'mac-cheese',
      name: 'Mac & Cheese',
      img: '/assets/Mac and Cheese.png',
      badge: 'Must-Try',
      desc: 'Creamy, rich macaroni and cheese, battered and deep-fried to golden-crisp perfection.',
      story: 'Why just serve mac & cheese when you can fry it? Crispy on the outside, molten and velvety on the inside.'
    },
    {
      id: 'thecha',
      name: 'Thecha Burger',
      img: '/assets/THECHA BURGER.png',
      badge: 'Fusion',
      desc: 'Our local fusion creation, packing a spicy traditional green-chilli kick into a modern burger.',
      story: 'A tribute to local flavors. We crafted a custom spicy traditional Thecha sauce that pairs beautifully with our fresh, juicy patties.'
    },
    {
      id: 'classic-cheese',
      name: 'Classic Cheese',
      img: '/assets/The classic cheeseburger.png',
      badge: 'Classic',
      desc: 'Our smashed chicken patty with classic cheese, showing that simplicity is the ultimate sophistication.',
      story: 'Our absolute best-seller. We perfected the smash technique for our chicken patties to lock in moisture and flavor.'
    },
    {
      id: 'meltdown',
      name: 'Melt Down',
      img: '/assets/Meltdown .png',
      badge: 'Heavy',
      desc: 'A massive burger that lives up to its name with layers of molten cheese and rich flavors.',
      story: 'Built for the hungry. A layered masterpiece designed to push the boundaries of what a burger can be, continuing to live up to its name.'
    }
  ];

  const handlePinReviewClick = () => {
    if (currentUser) {
      setShowReviewModal(true);
    } else {
      navigate('/login');
    }
  };

  const submitReview = async () => {
    if (!newReviewText.trim() || !currentUser) return;
    setIsSubmitting(true);

    const newReview = {
      user_id: currentUser.id,
      author_name: currentUser.name || "Customer",
      text: newReviewText,
    };

    try {
      const reviewToInsert = {
        ...newReview,
        created_at: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'reviews'), reviewToInsert);
      
      // We don't have the exact server timestamp back immediately, but we can optimistically add it
      const insertedReview = { ...reviewToInsert, id: docRef.id, created_at: new Date().toISOString() };
      
      setReviews([applyRandomStyle(insertedReview), ...reviews]);
      setNewReviewText('');
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to post review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.1,
      });

      // Card 1 (Red Hero) slides down from top
      tl.fromTo(
        '.anim-card-1',
        { y: -140, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 }
      );

      // Hero elements inside Card 1
      tl.fromTo(
        '.anim-hero-text',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        '-=0.45'
      );

      tl.fromTo(
        '.anim-floating-img',
        { scale: 0.7, opacity: 0, rotate: -10 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.1 },
        '-=0.35'
      );

      // Card 2 (Dark Narrative section) slides down from above over Card 1
      tl.fromTo(
        '.anim-card-2',
        { y: -160, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.35'
      );

      tl.fromTo(
        '.anim-card-2-content',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.35'
      );

      // Card 3 (Yellow Favourite Picks section) slides down from above over Card 2
      tl.fromTo(
        '.anim-card-3',
        { y: -160, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.35'
      );

      tl.fromTo(
        '.anim-pick-card',
        { y: 35, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.2)', stagger: 0.08 },
        '-=0.35'
      );

      // Card 4 (Corkboard Reviews) slides down from above over Card 3
      tl.fromTo(
        '.anim-card-4',
        { y: -160, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.35'
      );

      tl.fromTo(
        '.anim-sticky-note',
        { y: 50, opacity: 0, rotation: () => Math.random() * 20 - 10, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.1 },
        '-=0.4'
      );
    },
    { scope: storyContainerRef }
  );

  return (
    <div ref={storyContainerRef} className="bg-cream min-h-screen text-dark relative font-sans overflow-x-hidden">
      
      {/* SECTION 1: Wavy Hero Banner (Terracotta Red Background) */}
      <section className="anim-card-1 relative bg-primary text-cream pt-20 pb-28 px-4 sm:px-6 lg:px-8 rounded-b-[60px] md:rounded-b-[100px] z-10 shadow-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="anim-hero-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/15 text-cream font-heading font-extrabold text-xs uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-cream" />
              <span>Who We Are</span>
            </div>
            
            <h1 className="anim-hero-text font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight">
              About us
            </h1>

            <p className="anim-hero-text font-heading font-bold text-2xl sm:text-3xl text-accent leading-snug">
              The official guide to Chembur’s ultimate burger spot.
            </p>

            <p className="anim-hero-text text-cream/90 text-lg leading-relaxed max-w-xl">
              Every neighbourhood deserves that one place that feels like its own. For Chembur, that place is EM’s.
            </p>
          </div>

          {/* Floating Character / Food Graphics on Right */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[300px]">
            <div className="anim-floating-img absolute w-48 h-48 rounded-full overflow-hidden border-4 border-cream shadow-2xl z-20 left-10 transform -rotate-12 hover:scale-105 transition-transform">
              <img src="/assets/Pull me up.png" alt="Chef craft" className="w-full h-full object-cover" />
            </div>
            <div className="anim-floating-img absolute w-36 h-36 rounded-full overflow-hidden border-4 border-cream shadow-xl z-10 right-10 top-5 transform rotate-12 hover:scale-105 transition-transform">
              <img src="/assets/Destroyed Fries.png" alt="Sides craft" className="w-full h-full object-cover" />
            </div>
            <div className="anim-floating-img absolute w-28 h-28 rounded-full overflow-hidden border-4 border-cream shadow-lg z-0 bottom-5 right-20 transform -rotate-6 hover:scale-105 transition-transform">
              <img src="/assets/THECHA BURGER.png" alt="Spicy craft" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Overlapping Story & Narrative (Deep Dark Brown Background) */}
      <section className="anim-card-2 relative bg-dark text-cream pt-24 pb-28 px-4 sm:px-6 lg:px-8 -mt-12 rounded-[60px] md:rounded-[100px] z-20 shadow-xl">
        <div className="anim-card-2-content max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Overlapping Cluster of Oval/Circular Images */}
          <div className="lg:col-span-5 relative h-[380px] flex items-center justify-center">
            {/* Main Center Oval Image */}
            <div className="absolute w-[220px] h-[300px] rounded-[110px] overflow-hidden border-4 border-cream shadow-2xl z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <img src="/assets/Meltdown .png" alt="Burgers Built to Hit" className="w-full h-full object-cover" />
            </div>
            {/* Top Left Circle */}
            <div className="absolute w-36 h-36 rounded-full overflow-hidden border-4 border-cream shadow-xl top-4 left-6 z-20 hover:scale-105 transition-transform">
              <img src="/assets/Mac and Cheese.png" alt="Deep Fried Mac" className="w-full h-full object-cover" />
            </div>
            {/* Bottom Right Circle */}
            <div className="absolute w-40 h-40 rounded-full overflow-hidden border-4 border-cream shadow-xl bottom-4 right-6 z-20 hover:scale-105 transition-transform">
              <img src="/assets/The classic cheeseburger.png" alt="Classic burger" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Side: Narrative Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Let the EM's vibe guide you around Chembur's food scene
            </h2>

            <div className="space-y-4 text-cream/90 text-base sm:text-lg font-medium">
              <p>
                Founded on <strong>18th October 2025</strong>, EM’s was created with a simple thought — Chemburkars deserved really good burgers, served their way, in a space they could call their own.
              </p>
              <p>
                Founded by <strong>Mr. Manav Talwar</strong>, who comes from a family with a longstanding legacy in hospitality, EM’s brings together his experience and a passion for creating food that is exciting, indulgent and memorable.
              </p>
              <p>
                From the very beginning, EM’s has been about doing burgers differently. Our signature Pull Me Up Burger, with cheese pouring over it, became an experience in itself, while favourites like our Destroyed Fries and Deep-Fried Mac & Cheese gave comfort food an indulgent EM’s twist. We were also among the early cafés to bring the UFO Burger to the scene.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 text-accent" />
                <span>Founded Oct 18, 2025</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
                <ChefHat className="w-4 h-4 text-accent" />
                <span>Talwar Legacy</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: Selection Panel's Favourite Picks (Mustard Yellow Background) */}
      <section className="anim-card-3 relative bg-accent text-dark pt-24 pb-28 px-4 sm:px-6 lg:px-8 -mt-12 rounded-t-[60px] md:rounded-t-[100px] z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-dark/10 text-dark font-heading font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Favourite Picks
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              Our selection panel's favourite picks
            </h2>
            <p className="text-dark/80 max-w-xl mx-auto font-medium text-sm sm:text-base">
              Click on any pick below to reveal the behind-the-scenes story and chef's inspiration.
            </p>
          </div>

          {/* BounceCards Stack Layout */}
          <div className="flex flex-col items-center justify-center pt-12 pb-16 overflow-hidden">
            <BounceCards
              className="custom-bounceCards scale-75 sm:scale-100"
              items={favoritePicks}
              containerWidth={500}
              containerHeight={300}
              animationDelay={0.2}
              animationStagger={0.08}
              easeType="elastic.out(1, 0.8)"
              transformStyles={[
                "rotate(-15deg) translate(-220px)",
                "rotate(-9deg) translate(-130px)",
                "rotate(-3deg) translate(-40px)",
                "rotate(3deg) translate(40px)",
                "rotate(9deg) translate(130px)",
                "rotate(15deg) translate(220px)"
              ]}
              enableHover={true}
              onClickItem={(idx) => setSelectedDish(favoritePicks[idx])}
            />
            
            <div className="mt-16 text-center animate-pulse">
              <span className="inline-flex items-center gap-2 text-primary font-heading font-extrabold text-sm uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full">
                <Info className="w-4 h-4" />
                Hover & Click A Card To View Its Story
              </span>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-dark hover:bg-dark/90 text-cream font-heading font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>Explore The Full Menu</span>
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 4: Corkboard Reviews */}
      <section className="anim-card-4 relative bg-dark text-cream pt-28 pb-36 px-4 sm:px-6 lg:px-8 -mt-12 rounded-t-[60px] md:rounded-t-[100px] z-40 shadow-2xl overflow-hidden border-t-8 border-cream/5">
        {/* Corkboard texture pattern (simple CSS repeating linear gradient) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
        
        <div className="relative max-w-7xl mx-auto space-y-16 z-10">
          <div className="text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-cream font-heading font-extrabold text-xs uppercase tracking-wider">
              <History className="w-3.5 h-3.5 inline mr-1" /> Community
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-primary drop-shadow-md">
              What Chembur Says
            </h2>
            <p className="text-cream/80 max-w-xl mx-auto font-medium text-sm sm:text-base">
              Real reviews from real people who love their burgers messy and delicious.
            </p>
            <div className="pt-4">
              <button
                onClick={handlePinReviewClick}
                className="inline-flex items-center justify-center gap-2 bg-cream text-dark hover:bg-cream-light font-heading font-black text-sm uppercase tracking-wide px-6 py-3 rounded-full shadow-md transition-all hover:-translate-y-1"
              >
                <Pin className="w-4 h-4" />
                Pin Your Review
              </button>
            </div>
          </div>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-12 px-2 md:px-0">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className={`anim-sticky-note relative ${review.colorClass} p-6 pb-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform ${review.rotateClass} hover:rotate-0 hover:-translate-y-2 group cursor-crosshair`}
              >
                {/* Pushpin */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 ${review.pinClass} rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_2px_4px_6px_rgba(0,0,0,0.4)] z-10`} />
                <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-3 ${review.pinClass}/50 -z-10 blur-sm`} />
                
                <div className={`font-serif text-lg leading-relaxed ${review.textClass} mb-6 italic opacity-90 group-hover:opacity-100 transition-opacity`}>
                  "{review.text}"
                </div>
                <div className={`font-heading font-bold text-sm ${review.textClass}/80 text-right`}>- {review.author_name}</div>
                {/* Tape corner effect */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/5" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dish Detail Modal */}
      {selectedDish && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedDish(null)}
        >
          <div 
            className="bg-cream-light border-4 border-dark rounded-4xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-scaleUp text-dark"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark/10 hover:bg-dark/20 text-dark transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square md:aspect-auto md:h-full relative bg-cream-light border-b-4 md:border-b-0 md:border-r-4 border-dark">
                <img
                  src={selectedDish.img}
                  alt={selectedDish.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 space-y-4 flex flex-col justify-center text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-primary text-cream font-heading font-extrabold text-[10px] uppercase tracking-wider self-start">
                  {selectedDish.badge}
                </span>

                <h3 className="font-heading font-black text-3xl text-dark leading-tight">
                  {selectedDish.name}
                </h3>

                <p className="text-sm font-medium text-dark/70 leading-relaxed">
                  {selectedDish.desc}
                </p>

                <div className="pt-4 border-t border-dark/10 space-y-2">
                  <div className="font-heading font-black text-xs uppercase tracking-wider text-primary">
                    Behind The Recipe:
                  </div>
                  <p className="text-sm italic text-dark/90 leading-relaxed font-serif">
                    "{selectedDish.story}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Review Submission Modal */}
      {showReviewModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowReviewModal(false)}
        >
          <div 
            className="bg-cream-light border-4 border-dark rounded-3xl max-w-lg w-full p-8 shadow-[12px_12px_0px_rgba(43,24,16,1)] relative animate-scaleUp text-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark/10 text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-black text-2xl text-dark mb-4 flex items-center gap-2">
              <Pin className="text-primary w-6 h-6" /> Pin Your Review
            </h3>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="What did you think of the food? (Keep it messy!)"
              className="w-full bg-white/50 border-2 border-dark/20 rounded-xl p-4 min-h-[120px] font-serif resize-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={submitReview}
              disabled={!newReviewText.trim() || isSubmitting}
              className="mt-6 w-full bg-primary hover:bg-primary-dark text-cream font-heading font-bold uppercase tracking-wider py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
