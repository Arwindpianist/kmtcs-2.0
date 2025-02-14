import BackgroundLines from "../components/BackgroundLines";

export default function About() {
  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <BackgroundLines />
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">About KMTCS</h1>
        <div className="bg-gradient-to-br from-teal-100 via-neutral-50 to-sky-100 relative z-50 rounded-lg p-8 shadow-lg">
          <p className="text-lg text-blue-800 mb-6">
            KM Training and Consulting Services (KMTCS) is a leading provider of engineering, management, and IT consulting and training services. We serve a diverse range of private and public enterprises, helping them achieve significant and lasting improvements in their operations performance.
          </p>
          <p className="text-lg text-blue-800 mb-6">
            Our approach is rooted in scientific thinking and data-driven decision-making. We guide, coach, and train our clients to leverage modern tools and application software to optimize their processes and drive sustainable growth.
          </p>
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Mission</h2>
          <p className="text-lg text-blue-800 mb-6">
            To empower organizations with the knowledge, skills, and tools they need to excel in today's competitive business environment. We are committed to delivering high-quality consulting and training services that drive measurable results and long-term success for our clients.
          </p>
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-blue-800 mb-6">
            <li>Excellence: We strive for the highest standards in all our services.</li>
            <li>Innovation: We embrace new ideas and technologies to stay ahead of the curve.</li>
            <li>Integrity: We conduct our business with honesty and transparency.</li>
            <li>Collaboration: We work closely with our clients to achieve their goals.</li>
            <li>Continuous Learning: We are committed to ongoing professional development.</li>
          </ul>
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Team</h2>
          <p className="text-lg text-blue-800 mb-6">
            KMTCS is composed of experienced professionals with diverse backgrounds in engineering, management, and information technology. Our team of experts is dedicated to delivering tailored solutions that address the unique challenges of each client.
          </p>
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Why Choose Us?</h2>
          <p className="text-lg text-blue-800 mb-6">
            With over 30 years of experience, we've formed a firm distinctively equipped to support our training and consulting projects. This holistic focus of the KMTCS produces excellent services for our customers and clients. Our associates and consultants have assisted various companies and enterprises to complete their projects and achieve/exceed targeted improvements.
          </p>
          <div className="flex flex-col gap-6">
            <div className="group transform transition-all duration-300 p-6 rounded-lg hover:bg-blue-50">
              <h3 className="text-xl font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span className="animate-wiggle inline-block">
                  🚀
                </span>
                <span className="animate-wiggle inline-block group-hover:text-blue-700 transition-colors">
                  Innovate
                </span>
              </h3>
              <p className="text-lg text-blue-800 group-hover:text-blue-600 transition-colors animate-fadeIn">
                INNOVATE the training programs to suit your needs considering the latest knowledge in the respective field.
              </p>
            </div>

            <div className="group transform transition-all duration-300 p-6 rounded-lg hover:bg-blue-50">
              <h3 className="text-xl font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span className="animate-wiggle inline-block">
                  🌱
                </span>
                <span className="animate-wiggle inline-block group-hover:text-blue-700 transition-colors">
                  Grow
                </span>
              </h3>
              <p className="text-lg text-blue-800 group-hover:text-blue-600 transition-colors animate-fadeIn [animation-delay:200ms]">
                Develop a passion for learning. If you do, you will never cease to GROW. As you use those skills and knowledge received from our INNOVATIVE training, advance your career, your sense of purpose will only GROW.
              </p>
            </div>

            <div className="group transform transition-all duration-300 p-6 rounded-lg hover:bg-blue-50">
              <h3 className="text-xl font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span className="animate-wiggle inline-block">
                  ✨
                </span>
                <span className="animate-wiggle inline-block group-hover:text-blue-700 transition-colors">
                  Transform
                </span>
              </h3>
              <p className="text-lg text-blue-800 group-hover:text-blue-600 transition-colors animate-fadeIn [animation-delay:400ms]">
                TRANSFORM your people to GROW with the organization through well-crafted INNOVATIVE training programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
