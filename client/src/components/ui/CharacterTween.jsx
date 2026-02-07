import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CharacterTween = ({ text, className = '' }) => {
  const containerRef = useRef(null);
  const charsRef = useRef([]);

  useGSAP(() => {
    // Initial state
    gsap.set(charsRef.current, { yPercent: 0 });
  }, { scope: containerRef });

  const handleMouseEnter = () => {
    gsap.to(charsRef.current, {
      yPercent: -100,
      stagger: 0.02,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(charsRef.current, { yPercent: 100 });
        gsap.to(charsRef.current, {
          yPercent: 0,
          stagger: 0.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ cursor: 'pointer' }}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          ref={el => charsRef.current[index] = el}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default CharacterTween;
