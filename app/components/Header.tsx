'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { Fragment, useState } from 'react'
import { Popover, Transition, Dialog } from '@headlessui/react'
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid'
import {
  BriefcaseIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

const solutions = [
  { name: 'About Us', description: 'Learn more about our company', href: '/about', icon: ChartPieIcon },
  { name: 'Our Services', description: 'View our wide range of services', href: '/services', icon: CursorArrowRaysIcon },
  { name: 'Our Consultants', description: 'Meet our team of experts', href: '/consultants', icon: BriefcaseIcon },
]

const callsToAction = [
  { name: 'Contact Us', href: '/contact', icon: QuestionMarkCircleIcon },
  { name: 'View News', href: '/news', icon: ViewColumnsIcon },
]

const services = [
  { name: 'Technical Trainings', href: '/services/technical-trainings' },
  { name: 'Non-Technical Trainings', href: '/services/non-technical-trainings' },
  { name: 'Consulting', href: '/services/consulting' },
]

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
]

function HeaderContent() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-card/80 backdrop-filter backdrop-blur-lg border-b border-theme fixed top-0 w-full z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">KMTCS</span>
            <Image
              className="h-12 w-auto lg:h-16"
              src="/KMTCS-NEW-LOGO.svg"
              alt="KMTCS Logo"
              width={64}
              height={64}
            />
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link href="/" className="text-md font-semibold leading-6 text-primary hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="text-md font-semibold leading-6 text-primary hover:text-blue-600">
            About
          </Link>
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-md font-semibold leading-6 text-primary hover:text-blue-600">
              Services
              <ChevronDownIcon className="h-5 w-5 flex-none text-secondary" aria-hidden="true" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-64 overflow-hidden rounded-xl bg-card shadow-lg ring-1 ring-theme">
                <div className="p-2">
                  {services.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-4 py-2 text-sm font-semibold leading-6 text-primary hover:bg-hover-background"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <Link href="/news" className="text-md font-semibold leading-6 text-primary hover:text-blue-600">
            News
          </Link>
          <Link href="/contact" className="text-md font-semibold leading-6 text-primary hover:text-blue-600">
            Contact
          </Link>
        </Popover.Group>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {session && (
            <div className="flex items-center gap-x-4">
              <span className="text-sm font-semibold text-primary">
                Welcome, {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-blue-600 hover:bg-blue-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">KMTCS</span>
              <Image
                className="h-8 w-auto"
                src="/KMTCS-NEW-LOGO.svg"
                alt="KMTCS Logo"
                width={32}
                height={32}
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Services</h3>
                {services.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {session && (
                  <div className="mt-6 space-y-4">
                    <p className="text-sm text-gray-600">
                      Welcome, {session.user.name || session.user.email}
                    </p>
                    <button
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

export default function Header() {
  return (
    <SessionProvider>
      <HeaderContent />
    </SessionProvider>
  )
}
