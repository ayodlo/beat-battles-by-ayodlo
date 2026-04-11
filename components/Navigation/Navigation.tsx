"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="w-full bg-white">
      <div className="flex w-full items-center justify-between px-10 py-6">
        <Link href="/" onClick={closeMenu}>
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
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="flex h-10 items-center justify-center p-0 md:hidden"
        >
          <span className="text-3xl leading-none">{isOpen ? "×" : "☰"}</span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/">Weekly battle</Link>
          <Link href="/about">Past battles</Link>
          <Link href="/browse">Browse beats</Link>
          <Link href="/more">More</Link>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button type="button" className="text-black">
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button type="button" className="border border-black px-4 py-2">
                Join
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link href="/upload">Submit</Link>
            <UserButton afterSignOutUrl="/" />
          </Show>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-4 px-2">
            <Link href="/" onClick={closeMenu}>
              Weekly battle
            </Link>
            <Link href="/about" onClick={closeMenu}>
              Past battles
            </Link>
            <Link href="/browse" onClick={closeMenu}>
              Browse beats
            </Link>
            <Link href="/more" onClick={closeMenu}>
              More
            </Link>

            <Show when="signed-in">
              <Link href="/submit" onClick={closeMenu}>
                Submit
              </Link>
            </Show>
          </div>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                onClick={closeMenu}
                className="min-w-22 self-start whitespace-nowrap rounded-md border border-gray-500 bg-white px-4 py-2 text-center text-black transition hover:bg-black hover:text-white"
              >
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                type="button"
                onClick={closeMenu}
                className="min-w-22 self-start whitespace-nowrap rounded-md border border-gray-500 bg-black px-4 py-2 text-center text-white transition hover:bg-white hover:text-black"
              >
                Join
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div className="px-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </Show>
        </div>
      )}
    </nav>
  );
}
