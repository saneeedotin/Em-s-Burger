import React, { useRef, useState } from 'react';
import gsap from 'gsap';

export function LoadingScreen() {
  const containerRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  const handleVideoEnd = () => {
    const tl = gsap.timeline({ onComplete: () => setIsDone(true) });
    
    // Subtle scale down of the video right before wiping
    tl.to('.loading-video', {
      scale: 0.9,
      opacity: 0.8,
      duration: 0.6,
      ease: 'power2.inOut'
    })
    // Premium wipe-up effect using clipPath
    .to(containerRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.2,
      ease: 'expo.inOut',
    }, '-=0.2');
  };

  if (isDone) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center overflow-hidden"
    >
      <video 
        className="loading-video w-full h-full object-contain"
        autoPlay 
        muted 
        playsInline 
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
      >
        <source src="/ANimatedlogo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
