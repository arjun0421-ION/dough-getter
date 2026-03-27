"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-caramel rounded-lg flex items-center justify-center shadow-sm">
              <span className="font-serif font-bold text-white text-sm">DG</span>
            </div>
            <span className="font-serif font-bold text-brown text-lg tracking-tight">
              Dough Getter
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#why-us" className="text-sm text-text-mid hover:text-brown transition-colors">
              Why Us
            </Link>
            <Link href="/#features" className="text-sm text-text-mid hover:text-brown transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-text-mid hover:text-brown transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-text-mid hover:text-brown transition-colors">
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 bg-caramel hover:bg-caramel-lt text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
            >
              Start Baking
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-text-mid hover:text-brown"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              <Link href="/#why-us" className="px-3 py-2 text-sm text-text-mid hover:text-brown hover:bg-white/60 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Why Us</Link>
              <Link href="/#features" className="px-3 py-2 text-sm text-text-mid hover:text-brown hover:bg-white/60 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="/#pricing" className="px-3 py-2 text-sm text-text-mid hover:text-brown hover:bg-white/60 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/login" className="px-3 py-2 text-sm text-text-mid hover:text-brown hover:bg-white/60 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <div className="px-3 pt-2">
                <Link href="/signup" className="block w-full text-center px-5 py-2 bg-caramel hover:bg-caramel-lt text-white text-sm font-semibold rounded-full transition-colors">
                  Start Baking
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
