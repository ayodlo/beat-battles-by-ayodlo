"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import ThemeToggle from "@/components/theme/ThemeToggle";

const adminUserIds =
  process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(",").map((id) => id.trim()) ??
  [];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/submit", label: "Battle", signedInOnly: true },
  { href: "/past-battles", label: "Past Battles" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const isSignedIn = isLoaded && !!user;
  const isSignedOut = isLoaded && !user;
  const isAdmin = user ? adminUserIds.includes(user.id) : false;

  function closeMenu() {
    setIsOpen(false);
  }

  function getLinkClass(href: string) {
    const isActive = pathname === href;

    return [
      "text-sm font-medium transition",
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
    ].join(" ");
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 text-foreground backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" onClick={closeMenu} aria-label="Producer Battles home">
          <Image
            src="/assets/images/producer_battles_transparent.png"
            alt="Producer Battles logo"
            width={64}
            height={64}
            priority
            className="h-auto w-16 dark:invert"
          />
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="flex items-center justify-center text-3xl leading-none text-foreground transition hover:text-muted-foreground md:hidden"
        >
          {isOpen ? "×" : "☰"}
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            if (link.signedInOnly && !isSignedIn) {
              return null;
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={getLinkClass(link.href)}
              >
                {link.label}
              </Link>
            );
          })}

          {isSignedIn ? (
            <>
              {isAdmin ? (
                <Link href="/admin" className={getLinkClass("/admin")}>
                  Admin
                </Link>
              ) : null}

              <ThemeToggle />
              <UserButton />
            </>
          ) : null}

          {isSignedOut ? (
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:opacity-80"
                >
                  Join
                </button>
              </SignUpButton>
            </div>
          ) : null}
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-border bg-background px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              if (link.signedInOnly && !isSignedIn) {
                return null;
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={getLinkClass(link.href)}
                >
                  {link.label}
                </Link>
              );
            })}

            {isSignedIn ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className={getLinkClass("/admin")}
                  >
                    Admin
                  </Link>
                ) : null}

                <div className="flex items-center gap-4 pt-2">
                  <ThemeToggle />
                  <UserButton />
                </div>
              </>
            ) : null}

            {isSignedOut ? (
              <div className="flex flex-col gap-3 pt-2">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Sign in
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-80"
                  >
                    Join
                  </button>
                </SignUpButton>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
