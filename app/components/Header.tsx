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
        <nav className="container mx-auto px-4 sm:px-6 py-2 sm:py-4">
          <div className="flex justify-between items-center relative">
            {/* Logo - responsive sizes */}
            <Link href="/" className="relative">
              <Image
                src={Logo}
                alt="KMTCS Logo"
                width={85}
                height={85}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[85px] lg:h-[85px] object-contain"
                priority
              />
            </Link>

            {/* Company Name with responsive visibility and sizing */}
            <h1 className="hidden md:block absolute left-1/2 transform -translate-x-1/2 
              md:text-lg lg:text-l xl:text-xl font-bold text-blue-900 text-center
              whitespace-nowrap overflow-hidden text-ellipsis
              max-w-[300px] md:max-w-[400px] lg:max-w-[500px]
              lg:-translate-x-[60%] xl:-translate-x-[55%]"
            >
              <span className="hidden lg:inline">KM Training & Consulting Services (KMTCS)
                <br />
                <p className="text-sm text-blue-800/80">202103259999 (SA0571127-K)</p>
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

            {/* Navigation menu for large screens */}
            <div className="hidden lg:flex space-x-4 xl:space-x-6 items-center">
              <Link
                href="/services"
                className="text-blue-900 hover:text-blue-700 font-medium text-sm xl:text-base"
              >
                Services
              </Link>
              <div className="relative group">
                <button
                  className="text-blue-900 hover:text-blue-700 font-medium py-2 text-sm xl:text-base"
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

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-lg z-[99] lg:hidden">
          <div className="fixed top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center bg-transparent">
            <Link href="/" onClick={toggleMenu}>
              <Image
                src={Logo}
                alt="KMTCS Logo"
                width={50}
                height={50}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
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
          
          <div className="h-full flex flex-col items-center justify-center space-y-6 sm:space-y-8 pt-20">
            <Link
              href="/services"
              className="text-blue-900 hover:text-blue-700 font-medium text-xl sm:text-2xl transition-all duration-300"
              onClick={toggleMenu}
            >
              Services
            </Link>

            <Link
              href="/about"
              className="text-blue-900 hover:text-blue-700 font-medium text-xl sm:text-2xl transition-all duration-300"
              onClick={toggleMenu}
            >
              About KMTCS
            </Link>

            <Link
              href="/consultants"
              className="text-blue-900 hover:text-blue-700 font-medium text-xl sm:text-2xl transition-all duration-300"
              onClick={toggleMenu}
            >
              Our Consultants
            </Link>

            <Link
              href="/news"
              className="text-blue-900 hover:text-blue-700 font-medium text-xl sm:text-2xl transition-all duration-300"
              onClick={toggleMenu}
            >
              Latest News
            </Link>
            
            <Link
              href="/contact"
              className="text-blue-900 hover:text-blue-700 font-medium text-xl sm:text-2xl transition-all duration-300"
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
