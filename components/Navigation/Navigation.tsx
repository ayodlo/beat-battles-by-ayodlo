"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white">
      <div className="flex items-center justify-between w-full px-10 py-6">
        <Link href="/">
          <Image
            src="/assets/images/producer_battles_transparent.png"
            alt="Producer Battles logo"
            width={50}
            height={50}
            className="h-auto w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="flex h-10 items-center justify-center md:hidden p-0"
        >
          <span className="text-3xl leading-none">{isOpen ? "×" : "☰"}</span>
        </button>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/">Weekly battle</Link>
          <Link href="/about">Past battles</Link>
          <Link href="/browse">Browse beats</Link>
          <Link href="/more">More</Link>
          <Link href="/signin">Sign in</Link>
          <Link href="/join" className="border border-black px-4 py-2">
            Join
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-4 px-2">
            <Link href="/" onClick={() => setIsOpen(false)}>
              Weekly battle
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>
              Past battles
            </Link>
            <Link href="/browse" onClick={() => setIsOpen(false)}>
              Browse beats
            </Link>
            <Link href="/more" onClick={() => setIsOpen(false)}>
              More
            </Link>
          </div>
          <Link
            href="/signin"
            onClick={() => setIsOpen(false)}
            className="text-center self-start whitespace-nowrap min-w-22 px-4 py-2 rounded-md border border-gray-500 bg-white text-black hover:bg-black hover:text-white transition"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            onClick={() => setIsOpen(false)}
            className="text-center self-start whitespace-nowrap min-w-22 px-4 py-2 rounded-md border border-gray-500 bg-black text-white hover:bg-white hover:text-black transition"
          >
            Join
          </Link>
        </div>
      )}
    </nav>
  );
}
