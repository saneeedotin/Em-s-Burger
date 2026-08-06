import React, { useRef, useState } from 'react';
import gsap from 'gsap';

export function LoadingScreen() {
  const containerRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  const handleVideoEnd = () => {
    // When the video finishes playing, slide the whole screen up to reveal the app
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut',
      onComplete: () => setIsDone(true)
    });
  };

  if (isDone) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center overflow-hidden"
    >
      <video 
        className="w-full h-full object-cover"
        autoPlay 
        muted 
        playsInline 
        onEnded={handleVideoEnd}
      >
        <source src="/ANimatedlogo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
