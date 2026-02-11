"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLink = ({ href, children, className }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={`${className} ${isActive ? "underline underline-offset-4 font-semibold" : ""}`}
      href={href}
    >
      {children}
    </Link>
  );
};
