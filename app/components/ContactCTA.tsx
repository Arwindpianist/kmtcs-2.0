import Link from 'next/link'

export default function ContactCTA() {
  return (
    <div className="w-full h-full bg-white flex flex-col justify-center items-center px-4">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-6">Ready to Transform Your Business?</h2>
        <p className="text-xl text-blue-800 mb-8">
          Contact us today to learn how KMTCS can help you achieve significant and lasting improvements in your operations performance.
        </p>
        <Link 
          href="/contact" 
          className="bg-blue-800/30 backdrop-filter backdrop-blur-lg border border-baby-blue/20 text-blue-800 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-800 hover:text-white hover:border-blue/40 transition-all duration-300 inline-block relative z-50 shadow-md hover:shadow-lg"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  )
}

