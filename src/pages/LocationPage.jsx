import React, { useEffect } from 'react';
import { MapEmbed } from '../components/MapEmbed';
import { Navigation, MapPin, ArrowLeft, ExternalLink, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Em%E2%80%99s+Burger+-+Burgers+built+to+hit,+Shop+no,+20+road,+Wadavli,+Borla,+koliwada,+Chembur,+Mumbai,+Maharashtra+400074";

export function LocationPage() {
  return (
    <div className="min-h-[90vh] bg-cream py-10 px-4 sm:px-6 lg:px-8 doodles-red text-dark">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Breadcrumb & Action */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-heading font-extrabold uppercase tracking-wider text-dark/70 hover:text-primary transition-colors bg-cream-light border border-dark/10 px-4 py-2 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-cream font-heading font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg transition-all active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Heading Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-black text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Find EM'S Burgers</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-dark uppercase tracking-tight">
            Our Chembur Outlet
          </h1>
          <p className="text-dark/70 text-sm sm:text-base max-w-lg mx-auto font-medium">
            Located in Chembur Camp, Mumbai. Drop in for fresh smash burgers or open direct GPS navigation on your phone.
          </p>
        </div>

        {/* Big Direct Action Button for Mobile Users */}
        <div className="block sm:hidden">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-accent hover:bg-accent-hover text-dark font-heading font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Navigation className="w-5 h-5 text-dark fill-dark" />
            <span>Start Google Maps Navigation</span>
          </a>
        </div>

        {/* Interactive Map Embed */}
        <MapEmbed />

      </div>
    </div>
  );
}
