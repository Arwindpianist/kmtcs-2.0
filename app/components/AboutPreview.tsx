import Link from 'next/link'

export default function AboutPreview() {
  return (
    <section id="about-preview" className="py-20 bg-baby-blue">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-teal-200 via-blue-200/30 to-blue-400/30 border-r-2 border-b-2 border-teal-200 relative z-50 rounded-lg p-8 shadow-lg">
          <h2 className="text-4xl font-bold text-blue-900 mb-6 text-center">About KMTCS</h2>
          <p className="text-lg text-justify text-blue-800 mb-4">
            KMTCS is a leading engineering, management, and IT consulting and training provider. We serve a broad mix of private and public enterprises, guiding them to make significant and lasting improvements in their operations performance.
          </p>
          <p className="text-lg text-justify text-blue-800 mb-6">
            Our approach incorporates scientific thinking based on data-driven facts and figures, along with the use of modern tools and application software.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/about" 
              className="bg-baby-blue/30 backdrop-filter backdrop-blur-lg border border-baby-blue/20 text-blue-800 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-800 hover:text-white hover:border-blue/40 transition-all duration-300 inline-block relative z-50 shadow-md hover:shadow-lg"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}