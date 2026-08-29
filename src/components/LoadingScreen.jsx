import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export function LoadingScreen() {
  const containerRef = useRef(null);
  const endedRef = useRef(false);
  const [isDone, setIsDone] = useState(false);

  const handleVideoEnd = () => {
    if (endedRef.current) return;
    endedRef.current = true;

    const tl = gsap.timeline({ onComplete: () => setIsDone(true) });
    
    // Subtle scale down of the video right before wiping
    tl.to('.loading-video', {
      scale: 0.9,
      opacity: 0.8,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    // Premium wipe-up effect using clipPath
    .to(containerRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.8,
      ease: 'expo.inOut',
    }, '-=0.15');
  };

  useEffect(() => {
    // Safety auto-dismiss timer so loading screen NEVER gets stuck on mobile
    const safetyTimer = setTimeout(() => {
      handleVideoEnd();
    }, 3200);

    return () => clearTimeout(safetyTimer);
  }, []);

  if (isDone) return null;

  return (
    <div 
      ref={containerRef} 
      onClick={handleVideoEnd}
      onTouchStart={handleVideoEnd}
      className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      <video 
        className="loading-video w-full h-full object-contain"
        autoPlay 
        muted 
        playsInline 
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
        onTimeUpdate={(e) => {
          if (e.target.duration && e.target.currentTime >= e.target.duration - 0.2) {
            handleVideoEnd();
          }
        }}
        onLoadedMetadata={(e) => {
          if (e.target.duration && !isNaN(e.target.duration)) {
            setTimeout(handleVideoEnd, (e.target.duration * 1000) + 300);
          }
        }}
      >
        <source src="/ANimatedlogo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
