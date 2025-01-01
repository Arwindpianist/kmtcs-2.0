'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Logo from './logo.png';

export default function Header() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="relative">
            <Image
              src={Logo}
              alt="KMTCS Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
          <button
            className="text-blue-900 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6h16.5m-16.5 6h16.5m-16.5 6h16.5"
              />
            </svg>
          </button>
          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } md:flex md:space-x-6 items-center`}
          >
            <Link href="/services" className="text-blue-900 hover:text-blue-700 font-medium">
              Services
            </Link>
            <div className="relative group">
              <button
                className="text-blue-900 hover:text-blue-700 font-medium py-2"
                onClick={() => setIsAboutOpen(!isAboutOpen)}
              >
                About Us
              </button>
              <div
                className={`absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
                  isAboutOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <Link
                  href="/about"
                  className="block px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsAboutOpen(false)}
                >
                  About KMTCS
                </Link>
                <Link
                  href="/consultants"
                  className="block px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsAboutOpen(false)}
                >
                  Our Consultants
                </Link>
              </div>
            </div>
            <Link href="/news" className="text-blue-900 hover:text-blue-700 font-medium">
              Latest News
            </Link>
            <Link href="/contact" className="text-blue-900 hover:text-blue-700 font-medium">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
