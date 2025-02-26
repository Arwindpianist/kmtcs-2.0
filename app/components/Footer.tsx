export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8 relative z-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left">
            <h3 className="text-lg font-semibold">KM Training & Consulting Services (KMTCS)</h3>
            <p className="mt-2">202103259999 (SA0571127-K)</p>
          </div>
          <div className="w-full md:w-1/3 text-center mt-4 md:mt-0">
            <p>&copy; {new Date().getFullYear()} KMTCS. All rights reserved.</p>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right mt-4 md:mt-0">
            <a href="/privacy-policy" className="text-white hover:text-baby-blue mr-4">Privacy Policy</a>
            <a href="/terms-of-service" className="text-white hover:text-baby-blue">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}