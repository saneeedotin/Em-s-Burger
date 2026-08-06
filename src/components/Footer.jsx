import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Instagram, ExternalLink, QrCode, Heart } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-primary text-cream pt-16 pb-12 relative overflow-hidden mt-[-1px]">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-hover/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-cream/20">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Logo variant="default" size="large" />
            <p className="text-cream/90 text-sm leading-relaxed max-w-xs font-medium">
              Chembur's home for juicy stacked UFO burgers, pull-me-up cheese cascades, and destroyed fries. Classy, vibrant & cute vibes only.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/emschembur/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-cream/10 hover:bg-accent hover:text-dark flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.zomato.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-cream/10 hover:bg-cream hover:text-primary text-xs font-bold font-heading flex items-center gap-1 transition-all"
              >
                <span>Zomato</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.swiggy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-cream/10 hover:bg-cream hover:text-primary text-xs font-bold font-heading flex items-center gap-1 transition-all"
              >
                <span>Swiggy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg text-cream mb-4 flex items-center gap-2">
              <span>Explore</span>
              <div className="h-0.5 w-8 bg-accent rounded-full" />
            </h3>
            <ul className="space-y-2.5 font-medium text-sm">
              <li>
                <Link to="/" className="text-cream/80 hover:text-accent transition-colors">
                  Home & Signature Picks
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-cream/80 hover:text-accent transition-colors">
                  Full Cafe Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream/80 hover:text-accent transition-colors">
                  Our Story & Ambience
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-cream/80 hover:text-accent transition-colors">
                  Contact & Directions
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-accent hover:underline font-bold flex items-center gap-1.5">
                  <QrCode className="w-4 h-4" />
                  <span>Loyalty Punch Card (10th Free)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Location & Hours */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-cream mb-4 flex items-center gap-2">
              <span>Visit Us</span>
              <div className="h-0.5 w-8 bg-accent rounded-full" />
            </h3>
            
            <div className="flex items-start gap-3 text-sm text-cream/90">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>
                20, Acharya Udyog Complex, Koliwada, Borla Road, Chembur Camp, Mumbai - 400074
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-cream/90">
              <Clock className="w-5 h-5 text-accent shrink-0" />
              <span>Open Daily: 12:00 PM – 11:00 PM</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-cream/90">
              <Phone className="w-5 h-5 text-accent shrink-0" />
              <a href="tel:+919820098200" className="hover:text-accent transition-colors font-bold">
                +91 98200 98200 (Click to call)
              </a>
            </div>
          </div>

          {/* Column 4: Loyalty QR Teaser */}
          <div className="bg-primary-dark/50 p-5 rounded-3xl border border-cream/15 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent text-dark text-xs font-heading font-bold">
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Loyalty Special</span>
              </div>
              <h4 className="font-heading font-bold text-xl text-cream">
                Buy 9 Burgers, Get 10th FREE!
              </h4>
              <p className="text-xs text-cream/80 leading-snug">
                Scan the QR code at your dining table to track your digital punch card.
              </p>
            </div>

            <Link
              to="/loyalty"
              className="mt-4 w-full py-2.5 text-center font-heading font-bold text-xs uppercase tracking-wider text-primary bg-cream hover:bg-accent rounded-full transition-colors shadow-sm"
            >
              View Punch Card Demo
            </Link>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/70">
          <p>© {new Date().getFullYear()} EM'S BURGERS CHEMBUR. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-accent fill-accent" /> for Chembur Burger Lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
