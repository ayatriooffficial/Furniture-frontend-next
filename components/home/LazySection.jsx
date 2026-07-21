"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const LazyCards = dynamic(() => import("../Cards"), {
  loading: () => <div className="min-h-[500px]" />,
});

const LazyMapButton = dynamic(
  () => import("../MapButton/MapButton"),
  {
    ssr: false,
  }
);

function useIntersectionObserver(ref, options) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);

        if (options.triggerOnce) {
          observer.disconnect();
        }
      }
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return visible;
}

export default function LazySection({ isHomePage }) {
  const cardsRef = useRef(null);
  const mapRef = useRef(null);

  const options = useMemo(
    () => ({
      threshold: 0.1,
      triggerOnce: true,
    }),
    []
  );

  const showCards = useIntersectionObserver(cardsRef, options);
  const showMap = useIntersectionObserver(mapRef, options);

  return (
    <>
      <section ref={cardsRef}>
        {showCards && <LazyCards isHomePage={isHomePage} />}
      </section>

      <section ref={mapRef}>
        {showMap && <LazyMapButton />}
      </section>
    </>
  );
}