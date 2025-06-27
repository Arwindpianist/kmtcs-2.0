import Link from 'next/link';
import { FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-background-secondary text-primary border-t border-theme">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">KM Training & Consulting Services</h3>
            <p className="text-secondary">MYCO ID: 202103259999</p>
            <p className="text-secondary">Business Registration No: 202103259999 (SA0571127-K)</p>
          </div>

          <div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <a href="tel:+60122125360" className="hover:text-blue-600">+6012 - 212 5360 (Office)</a>
                </p>
                <p>
                  <a href="tel:+60102175360" className="hover:text-blue-600">+6010 - 217 5360 (Mobile)</a>
                </p>
                <p>
                  <a href="mailto:info@kmtcs.com.my" className="hover:text-blue-600">info@kmtcs.com.my</a>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Location</h3>
            <address className="not-italic text-secondary">
              D5-10-3A Evergreen Park Scot Pine, <br />
              Persiaran SL 1, Bandar Sungai Long, <br />
              43000 Kajang, Selangor.
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-theme pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-secondary text-sm">
            &copy; {new Date().getFullYear()} KMTCS. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy-policy" className="text-sm text-secondary hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-secondary hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}