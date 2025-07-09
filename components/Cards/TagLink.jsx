"use client";
import Link from "next/link";

export default function TagLink({ text, href }) {
  const className = "text-[12px] text-black font-normal bg-white py-[.1rem] px-[.5rem]";

  if (href) {
    return (
      <Link href={href}>
        <p className={className}>{text}</p>
      </Link>
    );
  }

  return <p className={className}>{text}</p>;
}