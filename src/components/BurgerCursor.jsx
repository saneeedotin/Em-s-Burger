import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function BurgerCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor follow effect
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Trailing ring springs with slightly softer physics
  const trailSpringConfig = { damping: 22, stiffness: 200, mass: 0.8 };
  const trailX = useSpring(mouseX, trailSpringConfig);
  const trailY = useSpring(mouseY, trailSpringConfig);

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad) vs touch
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsTouchDevice(!mediaQuery.matches);

    const handlePointerTypeChange = (e) => {
      setIsTouchDevice(!e.matches);
    };

    mediaQuery.addEventListener('change', handlePointerTypeChange);

    if (!mediaQuery.matches) {
      return; // Exit early if it's a touch-only device
    }

    const onMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Detect hover state over interactive elements (buttons, links, inputs, cards)
    const onPointerOver = (e) => {
      const target = e.target;
      const isInteractive = !!(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer') ||
        target.closest('[data-hover]')
      );
      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseover', onPointerOver);

    // Hide default system cursor on fine pointer devices
    document.documentElement.classList.add('custom-burger-cursor-active');

    return () => {
      mediaQuery.removeEventListener('change', handlePointerTypeChange);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', onPointerOver);
      document.documentElement.classList.remove('custom-burger-cursor-active');
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render on touch devices or before pointer is detected
  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Glowing Trailing Cheese Ring */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isMouseDown ? 0.7 : isHovered ? 1.6 : 1,
          opacity: isHovered ? 0.8 : 0.4,
          borderColor: isHovered ? '#F2A020' : '#B7301A',
        }}
        transition={{ duration: 0.15 }}
        className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-dashed shadow-[0_0_15px_rgba(242,160,32,0.5)] bg-accent/10 pointer-events-none"
      />

      {/* Main Custom Burger Cursor Icon */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isMouseDown ? 0.75 : isHovered ? 1.35 : 1,
          rotate: isMouseDown ? -15 : isHovered ? 12 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="absolute top-0 left-0 pointer-events-none select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
      >
        <div className="relative flex items-center justify-center">
          {/* Custom SVG Burger Illustration */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-transform duration-200"
          >
            {/* Top Bun */}
            <path
              d="M8 22C8 12.6112 15.1634 5 24 5C32.8366 5 40 12.6112 40 22H8Z"
              fill="#F2A020"
              stroke="#0B0704"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Sesame Seeds */}
            <ellipse cx="18" cy="11" rx="1.5" ry="2.5" fill="#F5EDE0" transform="rotate(-20 18 11)" />
            <ellipse cx="24" cy="9" rx="1.5" ry="2.5" fill="#F5EDE0" />
            <ellipse cx="30" cy="11" rx="1.5" ry="2.5" fill="#F5EDE0" transform="rotate(20 30 11)" />
            <ellipse cx="20" cy="16" rx="1.5" ry="2.5" fill="#F5EDE0" transform="rotate(-10 20 16)" />
            <ellipse cx="28" cy="16" rx="1.5" ry="2.5" fill="#F5EDE0" transform="rotate(10 28 16)" />

            {/* Lettuce Layer */}
            <path
              d="M6 22C8 25 11 22 14 24C17 26 20 22 24 24C28 26 31 22 34 24C37 26 40 22 42 22"
              stroke="#2E7D32"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Melted Cheese Slice */}
            <path
              d="M7 25L24 31L41 25L36 29H12L7 25Z"
              fill="#FFC107"
              stroke="#0B0704"
              strokeWidth="1.5"
            />

            {/* Smashed Beef Patty */}
            <rect
              x="6"
              y="28"
              width="36"
              height="7"
              rx="3.5"
              fill="#5D4037"
              stroke="#0B0704"
              strokeWidth="2.5"
            />

            {/* Bottom Bun */}
            <path
              d="M9 36C9 36 10 42 24 42C38 42 39 36 39 36H9Z"
              fill="#E65100"
              stroke="#0B0704"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>

          {/* Interactive Hover "BITE!" Badge */}
          {isHovered && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: -22 }}
              className="absolute -top-1 bg-accent text-dark font-heading font-black text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dark shadow-md whitespace-nowrap"
            >
              CRAVE!
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
