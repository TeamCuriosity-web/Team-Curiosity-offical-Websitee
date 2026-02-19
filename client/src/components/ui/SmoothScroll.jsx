import React, { useEffect, useRef, useState, createContext } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollContext = createContext({
    scroll: null,
});

const SmoothScroll = ({ children }) => {
    const scrollRef = useRef(null);
    const scrollInstance = useRef(null);
    const [scroll, setScroll] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (!scrollRef.current) return;

        // Initialize Locomotive Scroll
        const scroll = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            lerp: 0.07, // Smoother
            multiplier: 0.8, // Slightly slower for elegance
            class: 'is-revealed', // Custom class for revealed elements
            smartphone: {
                smooth: true // Enable on mobile
            },
            tablet: {
                smooth: true
            }
        });
        scrollInstance.current = scroll;
        setScroll(scroll);

        // GSAP ScrollTrigger Proxy
        ScrollTrigger.scrollerProxy(scrollRef.current, {
            scrollTop(value) {
                return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            pinType: scrollRef.current.style.transform ? "transform" : "fixed"
        });

        // Set default scroller for all ScrollTrigger instances
        ScrollTrigger.defaults({
            scroller: scrollRef.current
        });

        // Update ScrollTrigger on scroll
        scroll.on('scroll', ScrollTrigger.update);

        // Refresh on resizing
        ScrollTrigger.addEventListener('refresh', () => scroll.update());
        ScrollTrigger.refresh();

        // Clean up on unmount
        return () => {
            if (scrollInstance.current) {
                scrollInstance.current.destroy();
                scrollInstance.current = null;
            }
            ScrollTrigger.removeEventListener('refresh', () => scroll.update());
            // Clear defaults on unmount to prevent side effects if component is removed
            ScrollTrigger.defaults({ scroller: undefined });
        };
    }, []); 

    // Update scroll on route change
    useEffect(() => {
        if (scrollInstance.current) {
            // Need a delay to let the new page content render
            setTimeout(() => {
                scrollInstance.current.update();
                ScrollTrigger.refresh(); // Refresh GSAP triggers
                scrollInstance.current.scrollTo('top', { duration: 0, disableLerp: true });
            }, 500); // 500ms delay to ensure heavy components render
        }
    }, [location.pathname]);

    return (
        <ScrollContext.Provider value={{ scroll }}>
            <div data-scroll-container ref={scrollRef}>
                {children}
            </div>
        </ScrollContext.Provider>
    );
};

export default SmoothScroll;
