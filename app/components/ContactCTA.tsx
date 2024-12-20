import Link from 'next/link'

export default function ContactCTA() {
  return (
    <section id="contact-cta" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-6">Ready to Transform Your Business?</h2>
        <p className="text-xl text-blue-800 mb-8">
          Contact us today to learn how KMTCS can help you achieve significant and lasting improvements in your operations performance.
        </p>
        <Link href="/contact" className="bg-blue-900 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition duration-300">
          Get in Touch
        </Link>
      </div>
    </section>
  )
}

