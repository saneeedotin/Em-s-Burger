import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Hero } from '../components/Hero';
import { SignaturePicksStrip } from '../components/SignaturePicksStrip';
import { LoyaltyBanner } from '../components/LoyaltyBanner';
import { WaveDivider } from '../components/WaveDivider';
import { TakeAwaySection } from '../components/TakeAwaySection';
import { Gallery } from '../components/Gallery';
import { Heart, Sparkles, Utensils, Star, ShieldCheck, MapPin, Pin, X, Check, PenLine } from 'lucide-react';
import { useVegMode } from '../context/VegModeContext';
import { useAuth } from '../context/AuthContext';
import { db, isFirebaseConfigured } from '../config/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_REVIEWS = [
  {
    id: 'default-1',
    author_name: "Pradeep Khandelwal",
    stars: 5,
    text: "Nice juicy burgers. Chicken BBQ slider and Mushroom Truffle Burgers were especially nice. Sweet potato fries were also good, very nice packaging and cute branding."
  },
  {
    id: 'default-2',
    author_name: "Tanmay",
    stars: 5,
    text: "Great place, great aesthetic and even great burgers. If you want a quick burger bite for less money, defo order the sliders."
  },
  {
    id: 'default-3',
    author_name: "Sneha Ramakrishnan",
    stars: 5,
    text: "Tried the truffle mushroom burger, cheese fondue fries, jalapeño cheese poppers here and it exceeded my expectations. So fresh and tasty! My friends also tried chicken burgers, which they really liked. Also great music and vibe in the cafe 😊"
  }
];

export function Home() {
  const { currentUser } = useAuth();
  const { isVegOnly } = useVegMode();
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const storyRef = useRef(null);
  const containerRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    if (currentUser?.name) {
      setReviewName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    try {
      const q = query(collection(db, 'reviews'), orderBy('created_at', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setReviews(fetched);
        }
      }, (err) => console.warn('Reviews snapshot error:', err));
      return () => unsubscribe();
    } catch (e) {
      console.warn('Error loading reviews:', e);
    }
  }, []);

  const handlePostReview = async (e) => {
    e?.preventDefault();
    if (!reviewText.trim()) return;
    const author = reviewName.trim() || currentUser?.name || 'Happy Customer';
    setIsSubmitting(true);

    const newRev = {
      author_name: author,
      user_id: currentUser?.id || 'guest',
      stars: Number(reviewStars) || 5,
      text: reviewText.trim()
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'reviews'), {
          ...newRev,
          created_at: serverTimestamp()
        });
      } catch (err) {
        console.error('Failed to save review in Firestore:', err);
      }
    }

    setReviews(prev => [{ ...newRev, id: 'local-' + Date.now() }, ...prev]);
    setReviewText('');
    setIsSubmitting(false);
    setShowReviewModal(false);
    showToast('🎉 Thank you! Your review has been posted.');
  };
  
  // Continuous scroll path
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Headline staggered reveal
      gsap.from('.editorial-headline > span > span', {
        y: 100,
        opacity: 0,
        rotate: 5,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.editorial-headline',
          start: 'top 85%',
        },
      });

      // Free-floating images parallax (different speeds)
      gsap.to('.editorial-img-1', {
        y: -150,
        rotate: -2,
        ease: 'none',
        scrollTrigger: { trigger: storyRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
      gsap.to('.editorial-img-2', {
        y: -100,
        rotate: 5,
        ease: 'none',
        scrollTrigger: { trigger: storyRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
      

      // Fade up text and CTA
      gsap.from('.editorial-text, .editorial-btn', {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.editorial-text',
          start: 'top 85%',
        },
      });
    },
    { scope: storyRef }
  );

  return (
    <div ref={containerRef} className="relative space-y-0 overflow-hidden">
      
      {/* Continuous Scroll SVG Line */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center opacity-30">
        <svg 
          className="w-full max-w-[1200px] h-full text-accent" 
          viewBox="0 0 100 1000" 
          preserveAspectRatio="none"
        >
          <motion.path
            d="M50,0 Q90,100 50,200 T50,400 T50,600 T50,800 T50,1000"
            fill="none"
            strokeWidth="0.5"
            stroke="currentColor"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>
      </div>

      <div className="relative z-10">
        {/* 1. Hero Showcase */}
        <Hero />

        {/* 2. Signature Picks Strip */}
        <SignaturePicksStrip />
        
        {!currentUser && (
          <div className="py-12 sm:py-24">
            <LoyaltyBanner />
          </div>
        )}

        {/* 4. Brand Vibe & Story Block - REDESIGNED */}
        {/* 4. Brand Vibe & Story Block - REDESIGNED */}
        <section className="py-24 md:py-40 bg-cream text-dark border-t border-primary/10 relative overflow-hidden">
          <div ref={storyRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[80vh] flex flex-col justify-center items-center">
            
            {/* Background / Floating Imagery */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Image 1: Top Left */}
              <div className="editorial-img-1 absolute hidden md:block top-[5%] left-0 lg:left-[2%] xl:left-[4%] w-64 lg:w-72 aspect-[4/5] rounded-lg overflow-hidden shadow-2xl border-[8px] border-cream -rotate-3 z-20">
                 <img
                    src="/emsday.webp"
                    alt="Em's Burger Day"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle tape effect for sticky note look */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm"></div>
              </div>
              
              {/* Image 2: Bottom Right */}
              <div className="editorial-img-2 absolute hidden md:block bottom-0 right-0 lg:right-[2%] xl:right-[4%] w-64 lg:w-80 aspect-square rounded-lg overflow-hidden shadow-2xl border-[8px] border-cream rotate-3 z-20">
                 <img
                    src="/emsnight.webp"
                    alt="Em's Burger Night"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle tape effect for sticky note look */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-sm -rotate-2 shadow-sm"></div>
              </div>
            </div>

            {/* Central Typography */}
            <div className="relative z-10 max-w-[50rem] mx-auto text-center space-y-8 py-12 md:py-24">
              <div className="editorial-text inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider mx-auto">
                <Heart className="w-4 h-4 fill-primary" />
                <span>The EM's Philosophy</span>
              </div>

              <h2 className="editorial-headline font-heading font-black text-6xl sm:text-[5.5rem] lg:text-[7.5rem] text-dark tracking-tighter leading-[0.85] flex flex-col items-center drop-shadow-sm">
                <span className="block overflow-hidden pb-1 md:pb-3"><span className="block inline-block">CHEMBUR'S</span></span>
                <span className="block overflow-hidden pb-1 md:pb-3"><span className="block inline-block text-primary">VIBRANT,</span></span>
                <span className="block overflow-hidden pb-1 md:pb-3"><span className="block inline-block">COOL & AESTHETIC</span></span>
                <span className="block overflow-hidden pb-1 md:pb-3"><span className="block inline-block">BURGER CAFE</span></span>
              </h2>

              <div className="max-w-2xl mx-auto space-y-10 md:bg-cream/70 md:backdrop-blur-md p-2 md:p-8 rounded-3xl mt-12 border border-transparent md:border-primary/10">
                <p className="editorial-text text-dark/90 text-lg md:text-2xl font-medium leading-relaxed">
                  We started EM's with one simple rule: no sterile clip-art, no generic frozen patties, and no boring burgers. We smash real meat and fresh veggies onto signature house-baked buns with bold sauces and molten cheese.
                </p>
                <div className="editorial-btn pt-2">
                  <Link
                    to="/about"
                    className="btn-micro inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-cream font-heading font-black text-lg md:text-xl px-10 py-5 rounded-full shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-1"
                  >
                    <span>Read Our Cafe Story</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Take Away Plane Animation Section */}
        <TakeAwaySection />

        {/* Brand Gallery Showcase */}
        <Gallery />

        {/* 5. Customer Buzz Showcase */}
        <section className="pt-32 pb-24 bg-primary doodles-cream text-cream relative overflow-hidden mt-[-1px]">
          <WaveDivider fillClass="fill-accent" position="top" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-30">
            
            {/* Header with Badges & Pin Review Button */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cream text-primary font-heading font-extrabold text-xs uppercase tracking-wider shadow-lg">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span>Loved By Chembur Camp</span>
              </div>

              <h2 className="font-heading font-black text-4xl sm:text-5xl text-cream max-w-3xl mx-auto leading-tight">
                "FINALLY, A BURGER PLACE THAT FEELS LIKE A REAL HANGOUT SPOT."
              </h2>

              <p className="text-cream/80 max-w-xl mx-auto text-sm sm:text-base font-medium">
                Real community reviews from burger lovers across Mumbai.
              </p>

              {/* Pin Your Review CTA Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-hover text-dark font-heading font-black text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-full shadow-[0_8px_25px_rgba(242,183,5,0.35)] transition-all hover:scale-105 active:scale-95"
                >
                  <PenLine className="w-4 h-4 text-dark" />
                  <span>Write / Pin Your Review</span>
                </button>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left pt-4">
              {reviews.slice(0, 6).map((review, idx) => {
                const authorName = review.author_name || review.name || "Customer";
                const isLong = (review.text || '').length > 130;
                const starCount = review.stars || 5;

                return (
                  <div key={review.id || idx} className="p-7 sm:p-8 rounded-3xl bg-primary-dark/50 border border-cream/15 space-y-4 hover:bg-primary-dark transition-colors flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex gap-1 text-accent mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < starCount ? 'fill-accent' : 'fill-transparent opacity-30'}`} />
                        ))}
                      </div>
                      <p className="text-base text-cream/90 italic leading-relaxed font-medium">
                        "{isLong ? `${review.text.substring(0, 130)}...` : review.text}"
                      </p>
                      {isLong && (
                        <button 
                          onClick={() => setSelectedReview({ ...review, name: authorName })}
                          className="text-accent text-sm font-bold mt-2 hover:underline focus:outline-none block"
                        >
                          Read more
                        </button>
                      )}
                    </div>
                    <div className="font-heading font-bold text-sm text-accent pt-4 border-t border-cream/10">
                      — {authorName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Read More Modal */}
        {selectedReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedReview(null)}>
            <div 
              className="bg-cream rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border-4 border-primary text-dark space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-cream transition-colors font-black text-sm"
              >
                ✕
              </button>
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < (selectedReview.stars || 5) ? 'fill-primary' : 'fill-transparent opacity-30'}`} />
                ))}
              </div>
              <p className="text-base sm:text-lg text-dark/90 italic leading-relaxed font-medium">
                "{selectedReview.text}"
              </p>
              <div className="font-heading font-bold text-base text-primary border-t border-primary/20 pt-4">
                — {selectedReview.name || selectedReview.author_name}
              </div>
            </div>
          </div>
        )}

        {/* Direct Review Submission Modal on Home Page */}
        {showReviewModal && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setShowReviewModal(false)}
          >
            <div 
              className="bg-cream-light border-4 border-primary rounded-4xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scaleUp text-dark space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark/10 text-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-heading font-black uppercase tracking-wider">
                  <Pin className="w-3.5 h-3.5 fill-primary" />
                  <span>EM'S Community Wall</span>
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-dark">
                  Write Your Review
                </h3>
                <p className="text-xs text-dark/70 font-medium">
                  Share your experience with the burgers, cheese fondue, and vibes!
                </p>
              </div>

              {/* Star Rating Picker */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-dark/60">
                  Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewStars(star)}
                      className="p-1 hover:scale-125 transition-transform focus:outline-none"
                    >
                      <Star 
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          star <= reviewStars 
                            ? 'text-accent fill-accent filter drop-shadow-sm' 
                            : 'text-dark/20 fill-transparent'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-heading font-black text-sm text-primary">
                    {reviewStars} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Author Name Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-dark/60">
                  Your Name / Nickname:
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 bg-white border border-dark/15 rounded-2xl font-heading font-bold text-sm text-dark focus:outline-none focus:border-primary"
                />
              </div>

              {/* Review Text Area */}
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-dark/60">
                  Your Review / Food Story:
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us what you loved! (The Meltdown Burger, smashed patties, fries, sauces...)"
                  className="w-full bg-white border border-dark/15 rounded-2xl p-4 min-h-[110px] text-sm font-medium text-dark resize-none focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handlePostReview}
                  disabled={!reviewText.trim() || isSubmitting}
                  className="flex-1 py-3.5 px-6 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pin className="w-4 h-4" />
                  <span>{isSubmitting ? 'Posting to Wall...' : 'Pin Review to Wall'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="py-3.5 px-6 rounded-full bg-cream hover:bg-cream-dark border border-dark/10 text-dark font-heading font-black text-xs uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[110] bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl font-heading font-bold text-sm flex items-center gap-2.5 animate-fadeIn">
            <Check className="w-5 h-5 text-white stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
