import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BounceCards.css';
import PixelTransition from './PixelTransition';

export default function BounceCards({
  className = '',
  items = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)'
  ],
  enableHover = true,
  onClickItem
}) {
  const containerRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.card',
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = transformStr => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (baseTransform, offsetX) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = hoveredIdx => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    items.forEach((_, i) => {
      const target = q(`.card-${i}`);
      gsap.killTweensOf(target);

      const baseTransform = transformStyles[i] || 'none';

      if (i === hoveredIdx) {
        const noRotationTransform = getNoRotationTransform(baseTransform);
        gsap.to(target, {
          transform: noRotationTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto'
        });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(target, {
          transform: pushedTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto'
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    items.forEach((_, i) => {
      const target = q(`.card-${i}`);
      gsap.killTweensOf(target);
      const baseTransform = transformStyles[i] || 'none';
      gsap.to(target, {
        transform: baseTransform,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto'
      });
    });
  };

  return (
    <div
      className={`bounceCardsContainer ${className}`}
      ref={containerRef}
      style={{
        position: 'relative',
        width: containerWidth,
        height: containerHeight
      }}
    >
      {items.map((item, idx) => {
        // Fallback in case items are just strings (for backward compatibility)
        const src = typeof item === 'string' ? item : item.img;
        
        return (
          <div
            key={idx}
            className={`card card-${idx}`}
            style={{
              transform: transformStyles[idx] ?? 'none',
              cursor: onClickItem ? 'pointer' : 'default',
              borderRadius: '20px',
              border: 'none',
            }}
            onMouseEnter={() => pushSiblings(idx)}
            onMouseLeave={resetSiblings}
            onClick={() => onClickItem && onClickItem(idx)}
          >
            <PixelTransition
              firstContent={
                <img
                  className="image"
                  src={src}
                  alt={`card-${idx}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }}
                />
              }
              secondContent={
                typeof item === 'object' ? (
                  <div className="w-full h-full bg-dark text-cream p-4 flex flex-col justify-center items-center text-center rounded-[15px] border-4 border-primary">
                    <h3 className="font-heading font-black text-xl mb-2 text-primary leading-tight">{item.name}</h3>
                    <p className="text-xs font-medium opacity-90 line-clamp-4">{item.text}</p>
                  </div>
                ) : (
                  <div className="w-full h-full bg-dark flex items-center justify-center rounded-[15px]">
                    <span className="text-cream font-bold">EM's Burger</span>
                  </div>
                )
              }
              gridSize={12}
              pixelColor="#E23E3E"
              animationStepDuration={0.4}
              aspectRatio="100%"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '15px' }}
            />
          </div>
        );
      })}
    </div>
  );
}
