'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Logo from './KMTCS-NEW-LOGO.svg';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 py-1 sm:py-2">
          <div className="flex justify-between items-center relative">
            {/* Logo - more compact sizes */}
            <Link href="/" className="relative">
              <Image
                src={Logo}
                alt="KMTCS Logo"
                width={85}
                height={85}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[85px] lg:h-[85px] object-contain"
                priority
              />
            </Link>

            {/* Company Name - adjusted text sizes */}
            <h1 className="hidden md:block absolute left-1/2 transform -translate-x-1/2 
              md:text-base lg:text-lg xl:text-xl font-bold text-blue-900 text-center
              whitespace-nowrap overflow-hidden text-ellipsis
              max-w-[300px] md:max-w-[400px] lg:max-w-[500px]
              lg:-translate-x-[60%] xl:-translate-x-[55%]"
            >
              <span className="hidden lg:inline">KM Training & Consulting Services (KMTCS)
                <br />
                <p className="text-xs md:text-sm text-blue-800/80">202103259999 (SA0571127-K)</p>
              </span>
              <span className="lg:hidden">KMTCS</span>
            </h1>

            {/* Hamburger Icon for small/medium screens */}
            <button
              className="text-blue-900 lg:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
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

            {/* Navigation menu for large screens - adjusted text sizes */}
            <div className="hidden lg:flex space-x-4 xl:space-x-6 items-center">
              <div className="relative group">
                <button
                  className="text-blue-900 hover:text-blue-700 font-medium py-1 text-sm xl:text-base"
                >
                  Services
                </button>
                <div className="absolute right-0 mt-1 w-56 bg-[#a0d8f1] bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible z-50">
                  <Link
                    href="/services/technical"
                    className="block px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors text-sm xl:text-base"
                  >
                    Technical Trainings
                  </Link>
                  <Link
                    href="/services/non-technical"
                    className="block px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors text-sm xl:text-base"
                  >
                    Non-Technical Trainings
                  </Link>
                  <Link
                    href="/services/consulting"
                    className="block px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors text-sm xl:text-base"
                  >
                    Consulting
                  </Link>
                  <Link
                    href="/services/events"
                    className="block px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors text-sm xl:text-base"
                  >
                    Events
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button
                  className="text-blue-900 hover:text-blue-700 font-medium py-1 text-sm xl:text-base"
                >
                  About Us
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-[#a0d8f1] bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible">
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors text-sm xl:text-base"
                  >
                    About KMTCS
                  </Link>
                  <Link
                    href="/consultants"
                    className="block px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors text-sm xl:text-base"
                  >
                    Our Consultants
                  </Link>
                </div>
              </div>
              <Link
                href="/news"
                className="text-blue-900 hover:text-blue-700 font-medium text-sm xl:text-base"
              >
                Latest News
              </Link>
              <Link
                href="/contact"
                className="text-blue-900 hover:text-blue-700 font-medium text-sm xl:text-base"
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay - adjusted padding */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-lg z-[99] lg:hidden">
          <div className="fixed top-0 left-0 right-0 p-3 sm:p-4 flex justify-between items-center bg-transparent">
            <Link href="/" onClick={toggleMenu}>
              <Image
                src={Logo}
                alt="KMTCS Logo"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                priority
              />
            </Link>
            <button 
              onClick={toggleMenu} 
              className="text-blue-900 text-2xl sm:text-3xl hover:text-blue-700 transition-colors"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          
          <div className="h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6 pt-16">
            <Link
              href="/services"
              className="text-blue-900 hover:text-blue-700 font-medium text-lg sm:text-xl transition-all duration-300"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <div className="pl-6 flex flex-col space-y-1">
              <Link href="/services/technical" className="text-blue-800 hover:text-blue-600 text-base sm:text-lg" onClick={toggleMenu}>Technical Trainings</Link>
              <Link href="/services/non-technical" className="text-blue-800 hover:text-blue-600 text-base sm:text-lg" onClick={toggleMenu}>Non-Technical Trainings</Link>
              <Link href="/services/consulting" className="text-blue-800 hover:text-blue-600 text-base sm:text-lg" onClick={toggleMenu}>Consulting</Link>
              <Link href="/services/events" className="text-blue-800 hover:text-blue-600 text-base sm:text-lg" onClick={toggleMenu}>Events</Link>
            </div>

            <Link
              href="/about"
              className="text-blue-900 hover:text-blue-700 font-medium text-lg sm:text-xl transition-all duration-300"
              onClick={toggleMenu}
            >
              About KMTCS
            </Link>

            <Link
              href="/consultants"
              className="text-blue-900 hover:text-blue-700 font-medium text-lg sm:text-xl transition-all duration-300"
              onClick={toggleMenu}
            >
              Our Consultants
            </Link>

            <Link
              href="/news"
              className="text-blue-900 hover:text-blue-700 font-medium text-lg sm:text-xl transition-all duration-300"
              onClick={toggleMenu}
            >
              Latest News
            </Link>
            
            <Link
              href="/contact"
              className="text-blue-900 hover:text-blue-700 font-medium text-lg sm:text-xl transition-all duration-300"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
