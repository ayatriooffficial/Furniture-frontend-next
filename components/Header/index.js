import React from "react";
import "./styles.css";
import Link from "next/link";
import Image from "next/image";
import TopHeader from "./TopHeader";
import { headerLinks } from "@/Model/Dropdown/AsideData/AsideData";
import TopHeaderWrapper from "./TopHeaderWrapper";
import HeaderInteractive from "./HeaderInteractive.client";

// ✅ FULLY SERVER COMPONENT - NO "use client", NO hooks, NO event handlers
// Renders static header structure + delegates all interactions to HeaderInteractive

export default function Header() {
  return (
    <header>
      {/* Top header section - static */}
      <TopHeaderWrapper>
        <TopHeader />
      </TopHeaderWrapper>

      {/* All interactive logic delegated to client component */}
      <HeaderInteractive headerLinks={headerLinks} />
    </header>
  );
}
