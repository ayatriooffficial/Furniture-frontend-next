"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TopHeaderWrapper = ({ children }) => {
  const pathname = usePathname();
  const [showTopHeader, setShowTopHeader] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname.includes("/checkout") || pathname.includes("/profile")) {
      setShowTopHeader(false);
      return;
    }

    const handleScroll = () => {
      setShowTopHeader(window.scrollY < 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);
  if (!mounted) return <>{children}</>;
  return showTopHeader ? <>{children}</> : null;
};

export default TopHeaderWrapper;
