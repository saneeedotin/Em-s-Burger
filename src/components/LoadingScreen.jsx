import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export function LoadingScreen() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const endedRef = useRef(false);
  
  // Show intro loading animation only once per browser session
  const [isDone, setIsDone] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('ems_intro_played') === 'true';
  });

  const handleVideoEnd = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ems_intro_played', 'true');
    }

    if (!containerRef.current) {
      setIsDone(true);
      return;
    }

    const tl = gsap.timeline({ 
      onComplete: () => setIsDone(true) 
    });
    
    // Subtle scale down of the video right before wiping
    tl.to('.loading-video', {
      scale: 0.9,
      opacity: 0.8,
      duration: 0.4,
      ease: 'power2.inOut'
    })
    // Premium wipe-up effect using clipPath
    .to(containerRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.6,
      ease: 'expo.inOut',
    }, '-=0.1');
  };

  useEffect(() => {
    if (isDone) return;

    // Check if Brave or browser blocks autoplay
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("[LoadingScreen] Video autoplay restricted by browser (e.g. Brave Shields), revealing content:", err);
          handleVideoEnd();
        });
      }
    }

    // Safety auto-dismiss timer so loading screen NEVER gets stuck in any browser
    const safetyTimer = setTimeout(() => {
      handleVideoEnd();
    }, 2400);

    return () => clearTimeout(safetyTimer);
  }, [isDone]);

  if (isDone) return null;

  return (
    <div 
      ref={containerRef} 
      onClick={handleVideoEnd}
      onTouchStart={handleVideoEnd}
      className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      <video 
        ref={videoRef}
        className="loading-video w-full h-full object-contain pointer-events-none"
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
            setTimeout(handleVideoEnd, (e.target.duration * 1000) + 200);
          }
        }}
      >
        <source src="/ANimatedlogo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
