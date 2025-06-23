import { FiTarget, FiZap, FiHeart, FiUsers, FiAward } from 'react-icons/fi';
import ContactCTA from '../components/ContactCTA';

// Section for the main "About Us" content
function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Pioneering Growth Through Knowledge and Innovation
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            KM Training and Consulting Services (KMTCS) is a leading provider of engineering, management, and IT consulting and training services. We serve a diverse range of private and public enterprises, helping them achieve significant and lasting improvements in their operations performance.
          </p>
          <p className="text-lg text-gray-600">
            Our approach is rooted in scientific thinking and data-driven decision-making. We guide, coach, and train our clients to leverage modern tools and application software to optimize their processes and drive sustainable growth.
          </p>
        </div>
      </div>
    </section>
  );
}

// Section for Mission and Values
function MissionAndValues() {
  const values = [
    { icon: <FiAward />, title: 'Excellence', description: 'We strive for the highest standards in all our services.' },
    { icon: <FiZap />, title: 'Innovation', description: 'We embrace new ideas and technologies to stay ahead of the curve.' },
    { icon: <FiHeart />, title: 'Integrity', description: 'We conduct our business with honesty and transparency.' },
    { icon: <FiUsers />, title: 'Collaboration', description: 'We work closely with our clients to achieve their goals.' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="prose lg:prose-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FiTarget className="mr-3 text-blue-600" /> Our Mission
            </h3>
            <p>
              To empower organizations with the knowledge, skills, and tools they need to excel in today's competitive business environment. We are committed to delivering high-quality consulting and training services that drive measurable results and long-term success for our clients.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map(value => (
                <div key={value.title} className="flex items-start space-x-4">
                  <div className="text-blue-600 text-3xl mt-1">{value.icon}</div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">{value.title}</h4>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section for "Why Choose Us"
function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose KMTCS?</h2>
          <p className="text-lg text-gray-600">
            With over 30 years of experience, we've formed a firm distinctively equipped to support our training and consulting projects. This holistic focus of the KMTCS produces excellent services for our customers and clients. Our associates and consultants have assisted various companies and enterprises to complete their projects and achieve/exceed targeted improvements.
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">Innovate</h3>
            <p>We innovate our training programs to suit your needs, incorporating the latest knowledge in the respective field.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">Grow</h3>
            <p>We help you develop a passion for learning. As you use new skills and knowledge, your purpose and career will grow.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">Transform</h3>
            <p>We transform your people to grow with the organization through well-crafted, innovative training programs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-blue-100 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">About KMTCS</h1>
        <p className="mt-4 text-lg text-gray-600">Your Trusted Partner in Professional Growth</p>
      </section>

      <AboutSection />
      <MissionAndValues />
      <WhyChooseUs />
      <ContactCTA />
    </div>
  );
}
