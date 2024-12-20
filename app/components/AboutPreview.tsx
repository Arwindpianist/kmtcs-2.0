import Link from 'next/link'

export default function AboutPreview() {
  return (
    <section id="about-preview" className="py-20 bg-baby-blue">
      <div className="container mx-auto px-6">
        <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">About KMTCS</h2>
          <p className="text-lg text-blue-800 mb-4">
            KMTCS is a leading engineering, management, and IT consulting and training provider. We serve a broad mix of private and public enterprises, guiding them to make significant and lasting improvements in their operations performance.
          </p>
          <p className="text-lg text-blue-800 mb-6">
            Our approach incorporates scientific thinking based on data-driven facts and figures, along with the use of modern tools and application software.
          </p>
          <Link href="/about" className="bg-blue-900 text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-800 transition duration-300">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  )
}

