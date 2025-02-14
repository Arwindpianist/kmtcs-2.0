'use client';

import { useState, useEffect } from 'react';

const BackgroundLines = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [documentSize, setDocumentSize] = useState({ 
    width: 0, 
    height: 0 
  });

  useEffect(() => {
    setMounted(true);
    
    const updateDocumentSize = () => {
      setDocumentSize({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
      const timeout = setTimeout(() => setIsHovering(false), 150);
      return () => clearTimeout(timeout);
    };

    // Initial size update
    updateDocumentSize();
    
    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateDocumentSize);
    window.addEventListener('scroll', updateDocumentSize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateDocumentSize);
      window.removeEventListener('scroll', updateDocumentSize);
    };
  }, []);

  const calculateDistanceEffect = (elementX: number, elementY: number) => {
    if (!mounted) return 0;
    const dx = mousePosition.x - elementX;
    const dy = mousePosition.y - elementY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 200;
    return Math.max(0, 1 - distance / maxDistance);
  };

  const sinValues = Array(40).fill(0).map((_, i) => ({
    rotate: Number((Math.sin(i * 0.1) * 5).toFixed(3)),
    translateY: Number((Math.sin(i * 0.1) * 5).toFixed(3)),
    translateX: Number((Math.sin(i * 0.1) * 5).toFixed(3))
  }));

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        width: documentSize.width,
        height: documentSize.height
      }}
    >
      {/* Diagonal curved lines */}
      <div 
        className="absolute w-full h-full transform rotate-12 flex justify-between"
        style={{
          width: documentSize.width * 2,
          height: documentSize.height * 2,
          left: '-50%',
          top: '-50%'
        }}
      >
        {[...Array(40)].map((_, i) => {
          const x = (i / 40) * documentSize.width;
          const y = (i / 40) * documentSize.height;
          const effect = calculateDistanceEffect(x, y);
          
          return (
            <div
              key={i}
              className="w-[1px] h-full bg-blue-500/40 motion-safe:animate-flow transition-transform duration-300"
              style={{
                opacity: 0.5,
                animationDelay: `${i * 0.1}s`,
                transform: mounted ? `
                  rotate(${sinValues[i].rotate}deg)
                  scale(${isHovering ? 1 + effect * 0.2 : 1})
                  translateY(${isHovering ? effect * 10 : 0}px)
                ` : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Horizontal curved lines */}
      <div className="absolute w-full h-full flex flex-col justify-between">
        {[...Array(20)].map((_, i) => {
          const y = (i / 20) * documentSize.height;
          const effect = calculateDistanceEffect(documentSize.width / 2, y);
          
          return (
            <div
              key={i}
              className="h-[1px] w-full bg-blue-500/30 motion-safe:animate-wave transition-transform duration-300"
              style={{
                opacity: 0.5,
                animationDelay: `${i * 0.2}s`,
                transform: mounted ? `
                  translateY(${sinValues[i].translateY + (isHovering ? effect * 15 : 0)}px)
                  scaleY(${isHovering ? 1 + effect * 0.5 : 1})
                ` : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Vertical curved lines */}
      <div className="absolute w-full h-full flex flex-row justify-between">
        {[...Array(20)].map((_, i) => {
          const x = (i / 20) * documentSize.width;
          const effect = calculateDistanceEffect(x, documentSize.height / 2);
          
          return (
            <div
              key={i}
              className="w-[1px] h-full bg-blue-500/50 motion-safe:animate-sway transition-transform duration-300"
              style={{
                opacity: 0.5,
                animationDelay: `${i * 0.15}s`,
                transform: mounted ? `
                  translateX(${sinValues[i].translateX + (isHovering ? effect * 15 : 0)}px)
                  scaleX(${isHovering ? 1 + effect * 0.5 : 1})
                ` : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Gradient overlay */}
      {mounted && (
        <>
          <div
            className="absolute w-40 h-40 rounded-full pointer-events-none transition-transform duration-300 bg-gradient-to-r from-blue-500/10 to-transparent"
            style={{
              transform: `translate(${mousePosition.x - 80}px, ${mousePosition.y - 80}px) scale(${isHovering ? 1 : 0})`,
              opacity: isHovering ? 1 : 0,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-700/5 to-blue-900/10 pointer-events-none" />
        </>
      )}
    </div>
  );
};

export default BackgroundLines;