"use client";
import { useEffect, useRef, useState } from "react";
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

const HomePage = () => {
  const cardsRef = useRef(null);
  const mapRef = useRef(null);

  const showCards = useIntersectionObserver(cardsRef, { threshold: 0.1, triggerOnce: true });
  const showMapButton = useIntersectionObserver(mapRef, { threshold: 0.1, triggerOnce: true });

  return (
    <main className="overflow-x-hidden fade-in">
      <div ref={cardsRef}>{showCards && <LazyCards />}</div>
      <div ref={mapRef}>{showMapButton && <LazyMapButton />}</div>
    </main>
  );
};

export default HomePage;
