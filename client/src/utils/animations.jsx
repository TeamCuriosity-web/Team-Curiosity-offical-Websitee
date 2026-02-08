import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Component: SplitText ---
// Manually splits text into characters or words for staggered animations
export const SplitText = ({ children, className = "", stagger = 0.05, delay = 0 }) => {
  const comp = useRef(null);
  
  // If children is not a string, just render it wrapped
  if (typeof children !== 'string') {
     return <div className={className}>{children}</div>;
  }

  const words = children.split(" ");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate characters
      gsap.from(".char", {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: stagger,
        duration: 1,
        ease: "power4.out",
        delay: delay
      });
    }, comp);
    return () => ctx.revert();
  }, [stagger, delay]);

  return (
    <div ref={comp} className={`inline-block overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, j) => (
             <span key={j} className="char inline-block origin-bottom transform-3d">
               {char}
             </span>
          ))}
        </span>
      ))}
    </div>
  );
};

// --- Hook: useScrollReveal ---
// Standard scroll trigger hook for sections
// mode: 'up', 'left', 'right', 'fade'
export const useScrollReveal = (targetRef, options = {}) => {
  const {
      mode = 'up',
      distance = 50,
      duration = 0.6,
      stagger = 0.1,
      delay = 0,
      start = "top 95%",
      markers = false
  } = options;

  useLayoutEffect(() => {
    if (!targetRef.current) return;

    let fromVars = { opacity: 0 };
    
    switch(mode) {
        case 'up': fromVars.y = distance; break;
        case 'down': fromVars.y = -distance; break;
        case 'left': fromVars.x = distance; break;
        case 'right': fromVars.x = -distance; break;
        case 'scale': fromVars.scale = 0.8; break;
        default: break; // fade only
    }

    const ctx = gsap.context(() => {
        // If targetRef has children with a specific class, animate them
        // otherwise animate the target itself
        const targets = options.selector 
            ? targetRef.current.querySelectorAll(options.selector)
            : targetRef.current;

        gsap.fromTo(targets, 
            fromVars,
            {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: targetRef.current,
                    start: start,
                    toggleActions: "play reverse play reverse", // Play on enter, reverse on leave, play on enter back, reverse on leave back
                    markers: markers
                }
            }
        );
    }, targetRef);

    return () => ctx.revert();
  }, [targetRef, mode, distance, duration, stagger, delay, start]);
};

// --- Component: GsapText ---
// Specific component for ScrollTriggered Text Reveal
export const GsapText = ({ children, className = "", delay = 0 }) => {
    const el = useRef(null);
    
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
             gsap.fromTo(el.current,
                { y: 50, opacity: 0, rotateX: 45 },
                {
                    y: 0, 
                    opacity: 1, 
                    rotateX: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: delay,
                    scrollTrigger: {
                        trigger: el.current,
                        start: "top 95%",
                        toggleActions: "play reverse play reverse"
                    }
                }
             );
        }, el);
        return () => ctx.revert();
    }, [delay]);

    return <div ref={el} className={className}>{children}</div>
};
