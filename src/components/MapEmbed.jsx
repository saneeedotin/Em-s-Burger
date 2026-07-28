import React from 'react';
import { MapPin, Navigation, Phone, ExternalLink, Clock } from 'lucide-react';

export function MapEmbed() {
  const address = "20, Acharya Udyog Complex, Koliwada, Borla Road, Chembur, Mumbai, Maharashtra 400074";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="bg-cream-light rounded-4xl p-6 sm:p-8 border-4 border-primary/20 shadow-xl space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-primary/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Chembur Location</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-dark">
            EM'S BURGERS CAFE
          </h3>
          <p className="text-dark/80 text-sm font-medium mt-1">
            {address}
          </p>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-cream font-heading font-bold px-5 py-3 rounded-full shadow-md transition-all shrink-0 active:scale-95"
        >
          <Navigation className="w-4 h-4" />
          <span>Get Directions</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Map Iframe Container */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border-2 border-primary/20 shadow-inner bg-cream-dark">
        <iframe
          title="EM's Burgers Google Map Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=19.0458,72.9016&z=16&output=embed"
        />
      </div>

      {/* Quick Action Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <Clock className="w-5 h-5 text-primary shrink-0" />
          <div>
            <div className="text-xs uppercase font-bold text-dark/60">Opening Hours</div>
            <div className="font-heading font-bold text-dark text-sm">12:00 PM – 11:00 PM Daily</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <Phone className="w-5 h-5 text-primary shrink-0" />
          <div>
            <div className="text-xs uppercase font-bold text-dark/60">Phone & Orders</div>
            <a href="tel:+919820098200" className="font-heading font-bold text-primary hover:underline text-sm">
              +91 98200 98200
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
