import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, MapPin, ExternalLink, QrCode } from 'lucide-react';

export function Footer() {
  const location = useLocation();
  const path = location.pathname;

  let wrapperBg = 'bg-cream doodles-red';
  let wrapperTexture = null;

  if (path === '/') {
    wrapperBg = 'bg-primary doodles-cream';
  } else if (path === '/contact') {
    wrapperBg = 'bg-accent';
  } else if (path === '/about') {
    wrapperBg = 'bg-dark';
    wrapperTexture = (
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
    );
  } else if (path === '/gallery') {
    wrapperBg = 'bg-dark';
  }

  const isRedPage = wrapperBg === 'bg-primary';

  const theme = isRedPage ? {
    bg: 'bg-cream doodles-red',
    textMain: 'text-primary',
    textMuted: 'text-primary/70',
    linkMuted: 'text-dark/90',
    linkHover: 'hover:text-primary',
    border: 'border-primary/40',
    socialHoverBg: 'hover:bg-primary',
    socialHoverText: 'hover:text-cream',
    socialHoverBorder: 'hover:border-primary',
    logo: 'text-primary'
  } : {
    bg: 'bg-primary doodles-cream',
    textMain: 'text-cream',
    textMuted: 'text-cream/70',
    linkMuted: 'text-cream/90',
    linkHover: 'hover:text-dark',
    border: 'border-cream/40',
    socialHoverBg: 'hover:bg-cream',
    socialHoverText: 'hover:text-primary',
    socialHoverBorder: 'hover:border-cream',
    logo: 'text-cream'
  };

  return (
    <div className={`-mt-8 md:-mt-12 relative z-[45] w-full ${wrapperBg}`}>
      {wrapperTexture}
      <footer className={`${theme.bg} rounded-t-[10vw] md:rounded-t-none md:rounded-tl-[8vw] pt-16 md:pt-24 lg:pt-32 px-6 sm:px-12 lg:px-24 pb-8 md:pb-0 flex flex-col overflow-hidden relative shadow-[0_-10px_40px_rgba(0,0,0,0.1)]`}>

        {/* Top Row: Headline, Copyright, Nav, Support */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12 xl:gap-24 mb-12">

          {/* Column 1: Headline & Copyright */}
          <div className="flex flex-col max-w-sm lg:w-1/3">
            <h3 className={`font-heading font-extrabold text-2xl sm:text-3xl ${theme.textMain} leading-tight mb-4 tracking-tight`}>
              Handcrafted in Chembur with zero shortcuts.
            </h3>
            <p className={`text-xs font-medium ${theme.textMuted} mt-4 lg:mt-12`}>
              © {new Date().getFullYear()} EM'S BURGERS / Site & Brand by <a href="https://www.instagram.com/saneeedotin/" target="_blank" rel="noopener noreferrer" className={`${theme.linkHover} transition-colors`}>Saneee.in</a>
            </p>
          </div>

          {/* Column 2: Navigation & Support */}
          <div className="flex flex-row flex-wrap md:flex-nowrap gap-8 sm:gap-16 lg:w-2/3 justify-between sm:justify-start w-full pr-4 sm:pr-0">
            <div>
              <h4 className={`font-heading font-extrabold text-[10px] uppercase tracking-wider mb-4 ${theme.textMain}`}>
                Navigation
              </h4>
              <ul className={`space-y-3 text-sm font-medium ${theme.linkMuted}`}>
                <li><Link to="/" className={`${theme.linkHover} transition-colors`}>Home</Link></li>
                <li><Link to="/menu" className={`${theme.linkHover} transition-colors`}>Menu</Link></li>
                <li><Link to="/loyalty" className={`${theme.linkHover} transition-colors`}>Loyalty Program</Link></li>
                <li><Link to="/about" className={`${theme.linkHover} transition-colors`}>About Us</Link></li>
                <li><Link to="/contact" className={`${theme.linkHover} transition-colors`}>Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-heading font-extrabold text-[10px] uppercase tracking-wider mb-4 ${theme.textMain}`}>
                Support
              </h4>
              <ul className={`space-y-3 text-sm font-medium ${theme.linkMuted}`}>
                <li><a href="https://www.google.com/maps/search/?api=1&query=Em%E2%80%99s+Burger+-+Burgers+built+to+hit,+Shop+no,+20+road,+Wadavli,+Borla,+koliwada,+Chembur,+Mumbai,+Maharashtra+400074" target="_blank" rel="noopener noreferrer" className={`${theme.linkHover} transition-colors`}>Directions</a></li>
                <li><a href="tel:+919820098200" className={`${theme.linkHover} transition-colors`}>Call Us</a></li>
                <li><Link to="/privacy" className={`${theme.linkHover} transition-colors`}>Privacy Policy</Link></li>
                <li><a href="https://zomato.com" target="_blank" rel="noopener noreferrer" className={`${theme.linkHover} transition-colors`}>Zomato</a></li>
                <li><a href="https://swiggy.com" target="_blank" rel="noopener noreferrer" className={`${theme.linkHover} transition-colors`}>Swiggy</a></li>
              </ul>
            </div>

            {/* Follow Us (Mobile Only) */}
            <div className="md:hidden flex flex-col">
              <h4 className={`font-heading font-extrabold text-[10px] uppercase tracking-wider mb-4 ${theme.textMain}`}>
                Follow Us
              </h4>
              <div className="flex flex-col gap-3">
                <a href="https://instagram.com/emschembur" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full border ${theme.border} flex items-center justify-center ${theme.socialHoverBg} ${theme.socialHoverText} ${theme.socialHoverBorder} transition-colors ${theme.textMain}`}>
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=Em%E2%80%99s+Burger+-+Burgers+built+to+hit,+Shop+no,+20+road,+Wadavli,+Borla,+koliwada,+Chembur,+Mumbai,+Maharashtra+400074" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full border ${theme.border} flex items-center justify-center ${theme.socialHoverBg} ${theme.socialHoverText} ${theme.socialHoverBorder} transition-colors ${theme.textMain}`}>
                  <MapPin className="w-4 h-4" />
                </a>
                <a href="https://www.zomato.com/mumbai/ems-burgers-chembur/" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full border ${theme.border} flex items-center justify-center ${theme.socialHoverBg} ${theme.socialHoverText} ${theme.socialHoverBorder} transition-colors ${theme.textMain}`}>
                  <span className="font-black font-heading text-lg italic mt-0.5">Z</span>
                </a>
                <a href="https://www.swiggy.com/city/mumbai/ems-burgers-chembur-rest1281237" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full border ${theme.border} flex items-center justify-center ${theme.socialHoverBg} ${theme.socialHoverText} ${theme.socialHoverBorder} transition-colors ${theme.textMain}`}>
                  <span className="font-black font-heading text-lg italic mt-0.5">S</span>
                </a>
              </div>
            </div>

          </div>

          {/* Empty spacer for Top Right */}
          <div className="hidden lg:block lg:w-1/3"></div>
        </div>

        {/* Bottom Row: Social */}
        <div className="hidden md:flex flex-col justify-end w-full mt-auto relative z-10 pb-8 md:pb-16">

          {/* Bottom Left: Social (Desktop) */}
          <div className="flex flex-col mt-12 md:mt-0">
            <h4 className={`font-heading font-extrabold text-[10px] uppercase tracking-wider mb-4 ${theme.textMain}`}>
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/emschembur" target="_blank" rel="noopener noreferrer" className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border ${theme.border} flex items-center justify-center ${theme.socialHoverBg} ${theme.socialHoverText} ${theme.socialHoverBorder} transition-colors ${theme.textMain}`}>
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Em%E2%80%99s+Burger+-+Burgers+built+to+hit,+Shop+no,+20+road,+Wadavli,+Borla,+koliwada,+Chembur,+Mumbai,+Maharashtra+400074" target="_blank" rel="noopener noreferrer" className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border ${theme.border} flex items-center justify-center ${theme.socialHoverBg} ${theme.socialHoverText} ${theme.socialHoverBorder} transition-colors ${theme.textMain}`}>
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://www.zomato.com/mumbai/ems-burgers-chembur/" target="_blank" rel="noopener noreferrer" className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border ${theme.border} flex items-center justify-center ${theme.socialHoverBg} ${theme.socialHoverText} ${theme.socialHoverBorder} transition-colors ${theme.textMain}`}>
                <span className="font-black font-heading text-lg sm:text-xl italic mt-0.5">Z</span>
              </a>
              <a href="https://www.swiggy.com/city/mumbai/ems-burgers-chembur-rest1281237" target="_blank" rel="noopener noreferrer" className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border ${theme.border} flex items-center justify-center ${theme.socialHoverBg} ${theme.socialHoverText} ${theme.socialHoverBorder} transition-colors ${theme.textMain}`}>
                <span className="font-black font-heading text-lg sm:text-xl italic mt-0.5">S</span>
              </a>
            </div>
          </div>
        </div>

        {/* Massive Logo */}
        <div className="w-full flex justify-center items-end mt-auto -mb-[4vw] md:absolute md:right-4 lg:right-24 md:bottom-4 lg:bottom-12 md:w-auto md:justify-end select-none pointer-events-none z-0">
          <h1 className={`font-heading font-black text-[42vw] leading-[0.75] md:text-[22vw] lg:text-[18vw] md:leading-none tracking-tighter ${theme.logo} text-center md:text-right m-0 p-0 drop-shadow-sm opacity-90`}>
            em's
          </h1>
        </div>
      </footer>
    </div>
  );
}
