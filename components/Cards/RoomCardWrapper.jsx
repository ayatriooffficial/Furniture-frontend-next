"use client";

import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import RoomCardSkeleton from "../Skeleton/RoomCardSkeleton"; // adjust path if needed

// Lazy load RoomCard
const LazyRoomCard = dynamic(() => import("./RoomCard"), {
  ssr: false,
  loading: () => <RoomCardSkeleton />,
});

const RoomCardWrapper = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (inView) {
      setShow(true);
    }
  }, [inView]);

  return <div ref={ref}>{show ? <LazyRoomCard /> : <RoomCardSkeleton />}</div>;
};

export default RoomCardWrapper;
