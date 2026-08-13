import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MapEmbed } from '../components/MapEmbed';
import { MapPin, Phone, Instagram, ExternalLink, MessageCircle, Sparkles, Clock } from 'lucide-react';

export function Contact() {
  const contactContainerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#map') {
      const timer = setTimeout(() => {
        const mapElement = document.getElementById('map');
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location]);

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

      // Hero text & floating items inside Card 1
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

      // Card 2 (Dark Contact section) slides down from above over Card 1
      tl.fromTo(
        '.anim-card-2',
        { y: -160, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.35'
      );

      tl.fromTo(
        '.anim-card-2-header',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        '-=0.4'
      );

      tl.fromTo(
        '.anim-contact-card',
        { y: 35, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.2)', stagger: 0.09 },
        '-=0.3'
      );

      // Card 3 (Yellow Map section) slides down from above over Card 2
      tl.fromTo(
        '.anim-card-3',
        { y: -160, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.35'
      );

      tl.fromTo(
        '.anim-card-3-header',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        '-=0.4'
      );

      tl.fromTo(
        '.anim-map-container',
        { y: 35, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55 },
        '-=0.3'
      );
    },
    { scope: contactContainerRef }
  );

  return (
    <div ref={contactContainerRef} className="bg-cream min-h-screen text-dark relative font-sans overflow-x-hidden">
      
      {/* SECTION 1: Wavy Hero Banner (Terracotta Red Background) */}
      <section className="anim-card-1 relative bg-primary text-cream pt-20 pb-28 px-4 sm:px-6 lg:px-8 rounded-b-[60px] md:rounded-b-[100px] z-10 shadow-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="anim-hero-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/15 text-cream font-heading font-extrabold text-xs uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 fill-cream" />
              <span>Get In Touch</span>
            </div>
            
            <h1 className="anim-hero-text font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight">
              Contact Us
            </h1>

            <p className="anim-hero-text font-heading font-bold text-2xl sm:text-3xl text-accent leading-snug">
              Drop by EM's Burgers Chembur.
            </p>

            <p className="anim-hero-text text-cream/90 text-lg leading-relaxed max-w-xl">
              Whether you want to dine-in, pick up takeaway, or order home delivery — we're here for you every day from 12 PM to 11 PM.
            </p>
          </div>

          {/* Floating Food Graphics on Right */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[300px]">
            <div className="anim-floating-img absolute w-48 h-48 rounded-full overflow-hidden border-4 border-cream shadow-2xl z-20 left-10 transform -rotate-12 hover:scale-105 transition-transform">
              <img src="/assets/Truffle Fries.png" alt="Truffle Fries" className="w-full h-full object-cover" />
            </div>
            <div className="anim-floating-img absolute w-36 h-36 rounded-full overflow-hidden border-4 border-cream shadow-xl z-10 right-10 top-5 transform rotate-12 hover:scale-105 transition-transform">
              <img src="/assets/Double Stack.png" alt="Double Stack" className="w-full h-full object-cover" />
            </div>
            <div className="anim-floating-img absolute w-28 h-28 rounded-full overflow-hidden border-4 border-cream shadow-lg z-0 bottom-5 right-20 transform -rotate-6 hover:scale-105 transition-transform">
              <img src="/assets/Veggie Avacado.png" alt="Veggie Avocado" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Info Grid & Contact Cards (Deep Dark Brown Background) */}
      <section className="anim-card-2 relative bg-dark text-cream pt-24 pb-28 px-4 sm:px-6 lg:px-8 -mt-12 rounded-[60px] md:rounded-[100px] z-20 shadow-xl">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="anim-card-2-header text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-cream/10 text-cream font-heading font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-accent" /> Connect With Us
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-cream">
              Table bookings, delivery & socials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Address */}
            <div className="anim-contact-card bg-cream-light p-8 rounded-4xl border-4 border-primary text-dark shadow-xl flex flex-col justify-between hover:scale-102 hover:-rotate-1 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-cream flex items-center justify-center shadow-lg">
                  <MapPin className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-black text-2xl">Our Location</h3>
                <p className="text-dark/80 text-sm sm:text-base leading-relaxed font-medium">
                  20, Acharya Udyog Complex, Koliwada, Borla Road, Chembur Camp, Mumbai - 400074
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=20,+Acharya+Udyog+Complex,+Chembur,+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-heading font-black text-xs uppercase tracking-wider mt-6"
              >
                <span>View On Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Card 2: Call & WhatsApp */}
            <div className="anim-contact-card bg-cream-light p-8 rounded-4xl border-4 border-primary text-dark shadow-xl flex flex-col justify-between hover:scale-102 hover:rotate-1 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-cream flex items-center justify-center shadow-lg">
                  <Phone className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-black text-2xl">Call & WhatsApp</h3>
                <p className="text-dark/80 text-sm sm:text-base leading-relaxed font-medium">
                  For table reservations, party orders, or delivery queries:
                </p>
                <div className="font-heading font-black text-2xl text-primary">
                  +91 98200 98200
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <a
                  href="tel:+919820098200"
                  className="flex-1 text-center py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  Click to Call
                </a>
                <a
                  href="https://wa.me/919820098200"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card 3: Socials & Media */}
            <div className="anim-contact-card bg-cream-light p-8 rounded-4xl border-4 border-primary text-dark shadow-xl flex flex-col justify-between hover:scale-102 hover:-rotate-1 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-cream flex items-center justify-center shadow-lg">
                  <Instagram className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-black text-2xl">Follow Us</h3>
                <p className="text-dark/80 text-sm sm:text-base leading-relaxed font-medium">
                  Follow <span className="font-bold text-primary">@emschembur</span> on Instagram for daily specials and behind-the-scenes food reels.
                </p>
              </div>
              <a
                href="https://www.instagram.com/emschembur/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 px-4 rounded-full bg-accent hover:bg-accent-hover text-dark font-heading font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-1.5 mt-6"
              >
                <Instagram className="w-4 h-4" />
                <span>@emschembur Instagram</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: Map & Directions (Mustard Yellow Background) */}
      <section id="map" className="anim-card-3 relative bg-accent text-dark pt-24 pb-28 px-4 sm:px-6 lg:px-8 -mt-12 rounded-t-[60px] md:rounded-t-[100px] z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="anim-card-3-header text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-dark/10 text-dark font-heading font-extrabold text-xs uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 inline mr-1" /> Hours & Location
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              Find your way to EM'S
            </h2>
            <p className="text-dark/80 max-w-xl mx-auto font-medium text-sm sm:text-base">
              Located right in Chembur Camp, we are open daily from 12:00 PM to 11:00 PM.
            </p>
          </div>

          <div className="anim-map-container rounded-4xl overflow-hidden border-4 border-dark/95 shadow-2xl bg-cream-light transform hover:scale-[1.01] transition-transform duration-300">
            <MapEmbed />
          </div>

        </div>
      </section>

    </div>
  );
}
