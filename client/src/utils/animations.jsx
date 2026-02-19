import React, { useLayoutEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollContext } from '../components/ui/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

export const SplitText = ({ children, className = "", stagger = 0.05, delay = 0 }) => {
  const comp = useRef(null);
  const { scroll } = useContext(ScrollContext);
  
  if (typeof children !== 'string') {
     return <div className={className}>{children}</div>;
  }

  const words = children.split(" ");

  useLayoutEffect(() => {
    if (!scroll) return; // Wait for scroll initialization

    const ctx = gsap.context(() => {
      
      gsap.from(".char", {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: stagger,
        duration: 1,
        ease: "power4.out",
        delay: delay,
        scrollTrigger: {
            trigger: comp.current,
            start: "top 95%",
            toggleActions: "play reverse play reverse",
            scroller: scroll.el // Explicitly use locomotive element
        }
      });
    }, comp);
    return () => ctx.revert();
  }, [stagger, delay, scroll]);

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
  const { scroll } = useContext(ScrollContext);

  useLayoutEffect(() => {
    if (!targetRef.current || !scroll) return; // Wait for scroll initialization

    let fromVars = { opacity: 0 };
    
    switch(mode) {
        case 'up': fromVars.y = distance; break;
        case 'down': fromVars.y = -distance; break;
        case 'left': fromVars.x = distance; break;
        case 'right': fromVars.x = -distance; break;
        case 'scale': fromVars.scale = 0.8; break;
        default: break; 
    }

    const ctx = gsap.context(() => {
        
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
                    toggleActions: "play reverse play reverse", 
                    markers: markers,
                    scroller: scroll.el // Explicitly use locomotive element
                }
            }
        );
    }, targetRef);

    return () => ctx.revert();
  }, [targetRef, mode, distance, duration, stagger, delay, start, scroll]);
};

export const GsapText = ({ children, className = "", delay = 0 }) => {
    const el = useRef(null);
    const { scroll } = useContext(ScrollContext);
    
    useLayoutEffect(() => {
        if (!scroll) return; // Wait for scroll initialization

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
                        toggleActions: "play reverse play reverse",
                        scroller: scroll.el // Explicitly use locomotive element
                    }
                }
             );
        }, el);
        return () => ctx.revert();
    }, [delay, scroll]);

    return <div ref={el} className={className}>{children}</div>
};
