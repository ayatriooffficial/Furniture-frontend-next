"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const LazyCards = dynamic(() => import("../Cards"), { ssr: false });
const LazyMapButton = dynamic(() => import("../MapButton/MapButton"), { ssr: false });

const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        if (options?.triggerOnce) {
          observer.disconnect();
        }
      }
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

const HomePage = ({ isHomePage = false }) => {
  const cardsRef = useRef(null);
  const mapRef = useRef(null);

  // Stable option references — prevents useEffect inside the hook from re-firing on every render
  const cardsOptions = useMemo(() => ({ threshold: 0.1, triggerOnce: true }), []);
  const mapOptions = useMemo(() => ({ threshold: 0.1, triggerOnce: true }), []);

  const showCards = useIntersectionObserver(cardsRef, cardsOptions);
  const showMapButton = useIntersectionObserver(mapRef, mapOptions);

  
  return (
    <main className="overflow-x-hidden fade-in">
      <div ref={cardsRef}>{showCards && <LazyCards isHomePage={isHomePage} />}</div>
      <div ref={mapRef}>{showMapButton && <LazyMapButton />}</div>
    </main>
  );
};

export default HomePage;
