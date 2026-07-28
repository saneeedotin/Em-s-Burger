import React from 'react';
import { MapEmbed } from '../components/MapEmbed';
import { MapPin, Phone, Clock, Instagram, ExternalLink, MessageCircle, Send } from 'lucide-react';

export function Contact() {
  return (
    <div className="py-16 bg-cream text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Visit Or Contact Us</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl text-dark tracking-tight">
            DROP BY EM'S BURGERS CHEMBUR
          </h1>

          <p className="text-dark/80 text-base font-medium">
            Whether you want to dine-in, pick up takeaway, or order home delivery — we're here for you every day from 12 PM to 11 PM.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Address */}
          <div className="bg-cream-light p-6 rounded-3xl border-2 border-primary/15 shadow-md space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-cream flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark">Our Location</h3>
              <p className="text-dark/80 text-sm leading-relaxed font-medium">
                20, Acharya Udyog Complex, Koliwada, Borla Road, Chembur Camp, Mumbai - 400074
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=20,+Acharya+Udyog+Complex,+Chembur,+Mumbai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline font-heading font-bold text-xs uppercase tracking-wider"
            >
              <span>View On Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Contact & Calls */}
          <div className="bg-cream-light p-6 rounded-3xl border-2 border-primary/15 shadow-md space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-cream flex items-center justify-center shadow-md">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark">Call & WhatsApp</h3>
              <p className="text-dark/80 text-sm leading-relaxed font-medium">
                For table reservations, party orders, or delivery queries:
              </p>
              <div className="font-heading font-extrabold text-lg text-primary">
                +91 98200 98200
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:+919820098200"
                className="flex-1 text-center py-2 px-3 rounded-full bg-primary text-cream font-heading font-bold text-xs shadow-sm hover:bg-primary-hover transition-colors"
              >
                Click to Call
              </a>
              <a
                href="https://wa.me/919820098200"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 px-3 rounded-full bg-emerald-600 text-white font-heading font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 3: Social & Online Order */}
          <div className="bg-cream-light p-6 rounded-3xl border-2 border-primary/15 shadow-md space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-cream flex items-center justify-center shadow-md">
                <Instagram className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark">Follow & Order</h3>
              <p className="text-dark/80 text-sm leading-relaxed font-medium">
                Follow <span className="font-bold text-primary">@emschembur</span> on Instagram for daily specials and behind-the-scenes food reels.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com/emschembur/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2 px-4 rounded-full bg-accent text-dark font-heading font-bold text-xs shadow-sm hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5"
              >
                <Instagram className="w-4 h-4" />
                <span>@emschembur Instagram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Interactive Google Map Embed */}
        <MapEmbed />

      </div>
    </div>
  );
}
