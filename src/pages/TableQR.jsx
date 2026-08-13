import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Hardcoded restaurant coordinates for Geolocation check
const RESTAURANT_LAT = 19.0760; // Placeholder: Mumbai
const RESTAURANT_LNG = 72.8777;
const MAX_DISTANCE_KM = 0.5; // Within 500 meters

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function TableQR() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Checking location...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the user is near the restaurant
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const distance = getDistanceFromLatLonInKm(RESTAURANT_LAT, RESTAURANT_LNG, latitude, longitude);

          if (distance <= MAX_DISTANCE_KM) {
            setStatus('Location verified. Redirecting to table menu...');
            sessionStorage.setItem('ems_table', id);
            setTimeout(() => navigate('/menu'), 1500);
          } else {
            setError('It looks like you are not at the restaurant. Redirecting to standard menu...');
            sessionStorage.removeItem('ems_table');
            setTimeout(() => navigate('/menu'), 2500);
          }
        },
        (err) => {
          console.warn('Geolocation error:', err);
          // Fallback: If they deny location, we assume remote access for security, or we can just ask them.
          // For now, strip table and redirect as per instructions.
          setError('Location access denied. Redirecting to standard menu...');
          sessionStorage.removeItem('ems_table');
          setTimeout(() => navigate('/menu'), 2500);
        }
      );
    } else {
      setError('Geolocation not supported. Redirecting to standard menu...');
      sessionStorage.removeItem('ems_table');
      setTimeout(() => navigate('/menu'), 2500);
    }
  }, [id, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-cream-light p-8 rounded-4xl border-4 border-primary/20 shadow-2xl text-center space-y-4"
      >
        {!error ? (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading font-black text-2xl text-dark">Table {id}</h2>
            <p className="text-dark/70 text-sm font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {status}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading font-black text-2xl text-dark">Remote Access</h2>
            <p className="text-dark/70 text-sm font-medium">
              {error}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
