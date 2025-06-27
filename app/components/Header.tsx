'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
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

function HeaderContent() {
  const { data: session } = useSession()

  return (
    <header className="bg-card/80 backdrop-filter backdrop-blur-lg border-b border-theme fixed top-0 w-full z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">KMTCS</span>
            <Image
              className="h-16 w-auto"
              src="/KMTCS-NEW-LOGO.svg"
              alt="KMTCS Logo"
              width={64}
              height={64}
            />
          </Link>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link href="/" className="text-md font-semibold leading-6 text-primary hover:text-blue-600">
            Home
          </Link>
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-md font-semibold leading-6 text-primary hover:text-blue-600">
              About
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
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-card shadow-lg ring-1 ring-theme">
                <div className="p-4">
                  {solutions.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-hover-background"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-background-secondary group-hover:bg-card">
                        <item.icon className="h-6 w-6 text-secondary group-hover:text-blue-600" aria-hidden="true" />
                      </div>
                      <div className="flex-auto">
                        <a href={item.href} className="block font-semibold text-primary">
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-secondary">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-theme bg-background-secondary">
                  {callsToAction.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-primary hover:bg-hover-background"
                    >
                      <item.icon className="h-5 w-5 flex-none text-secondary" aria-hidden="true" />
                      {item.name}
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

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
