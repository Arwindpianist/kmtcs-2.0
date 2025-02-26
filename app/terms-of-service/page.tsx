'use client';

import BackgroundLines from "../components/BackgroundLines";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <BackgroundLines />
      <div className="container mx-auto py-8 px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">Terms of Service</h1>
        <div className="bg-gradient-to-br from-teal-100 via-neutral-50 to-sky-100 relative z-50 rounded-lg p-8 shadow-lg">
          <p className="text-lg font-bold text-blue-800 mb-8">Effective Date: 1st January 2025</p>

          <p className="text-lg text-blue-800 mb-12">
            Welcome to KM Training & Consulting Services! These Terms of Service ("Terms") govern your use of our training services, workshops, consultations, and related content (collectively referred to as "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-lg text-blue-800">
              By accessing our website and/or enrolling in our Services, you confirm that you are at least 18 years old or that you have the consent of a parent or guardian to access our Services. If you are using the Services on behalf of a business or organization, you represent that you have the authority to bind that entity to these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">2. Modification of Terms</h2>
            <p className="text-lg text-blue-800">
              KM Training & Consulting Services reserves the right to change these Terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of the Services after any modifications indicates your acceptance of the revised Terms. Please review these Terms periodically for updates.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">3. Services Provided</h2>
            <p className="text-lg text-blue-800 mb-4">Our Services include, but are not limited to:</p>
            <ul className="list-disc list-inside text-lg text-blue-800 space-y-2">
              <li>Training courses (in-person and online)</li>
              <li>Workshops</li>
              <li>Consulting services</li>
              <li>E-learning programs</li>
              <li>Resource materials</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">4. Booking</h2>
            <ul className="list-disc list-inside text-lg text-blue-800 space-y-4">
              <li>Bookings for courses can be made by contacting our Booking Desk on <a href="tel:+6010-2175360" className="text-blue-600 hover:underline">+6010-217 5360</a> or at <a href="mailto:info@kmtcs.com.my" className="text-blue-600 hover:underline">info@kmtcs.com.my</a></li>
              <li>Upon receipt of booking in order, enrolment on the respective training course will be confirmed by the Booking Team with all necessary documentation.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">5. Payment Terms</h2>
            <ul className="list-disc list-inside text-lg text-blue-800 space-y-4">
              <li>For public programs, our fees include venue, course presentation, relevant materials, physical documentation and meals served during the entire training. Accommodation charges are not included in the course fees.</li>
              <li>For in-house programs, our fees include course presentation, relevant materials and physical documentation.</li>
              <li>Course fees are payable upon booking unless a valid authorized LOU, or HRDCorp Grant Application no. is provided and accepted.</li>
              <li>Invoices will be sent via email/courier to the ID/name and address provided.</li>
              <li>The currency of fees is in Malaysian Ringgit (MYR). Payments can be made in USD or local currency Malaysian Ringgit (MYR) by Bank Transfer. Bank charges are to be paid by the transferring party. Our Bank Account details will be provided on the Invoice.</li>
              <li>Payments can also be made using a credit card (Master/Visa) through the Stripe link we provide upon Booking.</li>
              <li>Please note that we do accept payment by cash, in USD or MYR, only for the last-minute bookings.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">6. Cancellation and Rescheduling Policy</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Cancellation of Courses by Provider</h3>
                <ul className="list-disc list-inside text-lg text-blue-800 space-y-4">
                  <li>In exceptional circumstances that are beyond our control, KM Training & Consultancy Services may be forced to alter or cancel a course, venue, instructors, or dates. We reserve the right to make such changes.</li>
                  <li>If any modifications are necessary, we will notify you before the course commencement date, and the fees already paid in full will not be subject to any increase.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Cancellation of Courses by Client</h3>
                <p className="text-lg text-blue-800 mb-4">
                  Once you have completed your booking, received your confirmation of enrolment and a dated payment Invoice, you are deemed to have a contract with KM Training & Consultancy Services. You reserve the right to cancel this contract given the following terms:
                </p>
                <ul className="list-disc list-inside text-lg text-blue-800 space-y-4">
                  <li>Cancellation Period: Registrations may be cancelled up to 14 days prior to the start of the training program. Cancellations made within the allowed cancellation period will incur a 25% administrative fee based on the course fees.</li>
                  <li>Cancelling a registration after the 14-day cancellation period has expired, we will review the situation individually. Possible options may include allowing the participant to designate a substitute, transferring their registration to a future session of the same course, or switching to a different course. However, please note that no refunds will be issued for cancellations made after this statutory period.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">7. Certificate of Completion/Attendance</h2>
            <p className="text-lg text-blue-800">
              In case of an unexpected absence due to unforeseen circumstances, it is recommended to inform a KM Training & Consulting Services representative or your sponsors as soon as possible. However, more than three (3) sub-session absences, regardless of the reason, may result in the invalidation of your eligibility for the Certificate of Completion/Attendance. Therefore, it is crucial to attend all sessions of the course to ensure successful completion and receive the certificate. The daily course schedule will be strictly followed to facilitate an uninterrupted learning experience for all participants.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">8. Intellectual Property</h2>
            <p className="text-lg text-blue-800">
              All content provided through our Services, including training materials, course content, and resources, are the property of KM Training & Consulting Services or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from such content without our express written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">9. Limitations of Liability</h2>
            <p className="text-lg text-blue-800">
              To the fullest extent permitted by law, KM Training & Consulting Services and its affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use of our Services, including but not limited to loss of profits, data, or other intangible losses.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">10. Governing Law</h2>
            <p className="text-lg text-blue-800">
              These Terms will be governed by and construed in accordance with the laws of Malaysia. Any disputes arising from or relating to these Terms shall be resolved in the courts located in Malaysia.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">11. Contact Information</h2>
            <p className="text-lg text-blue-800 mb-4">For questions or concerns regarding these Terms, please contact us:</p>
            <div className="text-lg text-blue-800">
              <p>D5-10-3A EVERGREEN PARK SCOT PINE,</p>
              <p>PERSIARAN SL 1, BANDAR SUNGAI LONG,</p>
              <p>43000 KAJANG, SELANGOR MALAYSIA.</p>
              <p className="mt-2">Email: <a href="mailto:info@kmtcs.com.my" className="text-blue-600 hover:underline">info@kmtcs.com.my</a></p>
              <p>Tel: <a href="tel:+6010-2175360" className="text-blue-600 hover:underline">+6010-2175360</a></p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">12. Severability</h2>
            <p className="text-lg text-blue-800">
              If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">13. Entire Agreement</h2>
            <p className="text-lg text-blue-800">
              These Terms constitute the entire agreement between you and KM Training & Consulting Services regarding the Services and supersede any prior agreements or understandings.
            </p>
          </section>

          <p className="text-lg text-blue-800 mt-8 font-semibold">
            By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
