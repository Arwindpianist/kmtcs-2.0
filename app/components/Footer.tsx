import Link from 'next/link';
import { FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">KM Training & Consulting Services</h3>
            <p className="text-gray-400">MYCO ID: 202103259999</p>
            <p className="text-gray-400">Business Registration No: 202103259999 (SA0571127-K)</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FiPhone className="mr-3" />
                <a href="tel:+60122125360" className="hover:text-blue-300">+6012 - 212 5360 (Office)</a>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3" />
                <a href="tel:+60102175360" className="hover:text-blue-300">+6010 - 217 5360 (Mobile)</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Location</h3>
            <address className="not-italic text-gray-400">
              D5-10-3A Evergreen Park Scot Pine, <br />
              Persiaran SL 1, Bandar Sungai Long, <br />
              43000 Kajang, Selangor.
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} KMTCS. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}