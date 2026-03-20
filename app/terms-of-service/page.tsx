'use client';

import { motion } from 'framer-motion';
import BackgroundLines from "../components/BackgroundLines";
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FiFileText, FiEdit3, FiPackage, FiCalendar, FiCreditCard, FiX, FiAward, FiLock, FiAlertCircle, FiMail, FiShield, FiCheckCircle } from 'react-icons/fi';
import React from 'react';

const getSectionIcon = (num: number) => {
  const icons: { [key: number]: React.ComponentType<{ className?: string }> } = {
    1: FiCheckCircle,
    2: FiEdit3,
    3: FiPackage,
    4: FiCalendar,
    5: FiCreditCard,
    6: FiX,
    7: FiAward,
    8: FiLock,
    9: FiAlertCircle,
    10: FiLock,
    11: FiMail,
    12: FiShield,
    13: FiFileText,
  };
  const Icon = icons[num] || FiFileText;
  return <Icon className="w-6 h-6" />;
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <BackgroundLines />
      <div className="container mx-auto py-8 px-6 max-w-4xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
              <FiFileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-center text-muted-foreground text-lg">Effective Date: 1st January 2025</p>
          </motion.div>
        </div>
        <Card className="relative z-50 shadow-xl border-2 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 lg:p-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-12 border-l-4 border-blue-500">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-lg text-foreground leading-relaxed">
                  Welcome to KM Training & Consulting Services! These Terms of Service ("Terms") govern your use of our training services, workshops, consultations, and related content (collectively referred to as "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
                </p>
              </motion.div>
            </div>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {getSectionIcon(1)}
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  By accessing our website and/or enrolling in our Services, you confirm that you are at least 18 years old or that you have the consent of a parent or guardian to access our Services. If you are using the Services on behalf of a business or organization, you represent that you have the authority to bind that entity to these Terms.
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  {getSectionIcon(2)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">2. Modification of Terms</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                KM Training & Consulting Services reserves the right to change these Terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of the Services after any modifications indicates your acceptance of the revised Terms. Please review these Terms periodically for updates.
              </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  {getSectionIcon(3)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">3. Services Provided</h2>
              </div>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">Our Services include, but are not limited to:</p>
              <ul className="list-disc list-inside text-base text-muted-foreground space-y-2 ml-4 leading-relaxed">
                <li>Training courses (in-person and online)</li>
                <li>Workshops</li>
                <li>Consulting services</li>
                <li>E-learning programs</li>
                <li>Resource materials</li>
              </ul>
              </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                {getSectionIcon(4)}
              </div>
              <h2 className="text-2xl font-semibold text-foreground">4. Booking</h2>
            </div>
            <ul className="list-disc list-inside text-base text-muted-foreground space-y-4 ml-4">
              <li>Bookings for courses can be made by contacting our Booking Desk on <a href="tel:+6010-2175360" className="text-blue-600 hover:underline font-semibold">+6010-217 5360</a> or at <a href="mailto:info@kmtcs.com.my" className="text-blue-600 hover:underline font-semibold">info@kmtcs.com.my</a></li>
              <li>Upon receipt of booking in order, enrolment on the respective training course will be confirmed by the Booking Team with all necessary documentation.</li>
            </ul>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                  {getSectionIcon(5)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">5. Payment Terms</h2>
              </div>
              <ul className="list-disc list-inside text-base text-muted-foreground space-y-4 ml-4">
                <li>For public programs, our fees include venue, course presentation, relevant materials, physical documentation and meals served during the entire training. Accommodation charges are not included in the course fees.</li>
                <li>For in-house programs, our fees include course presentation, relevant materials and physical documentation.</li>
                <li>Course fees are payable upon booking unless a valid authorized LOU, or HRDCorp Grant Application no. is provided and accepted.</li>
                <li>Invoices will be sent via email/courier to the ID/name and address provided.</li>
                <li>The currency of fees is in Malaysian Ringgit (MYR). Payments can be made in USD or local currency Malaysian Ringgit (MYR) by Bank Transfer. Bank charges are to be paid by the transferring party. Our Bank Account details will be provided on the Invoice.</li>
                <li>Payments can also be made using a credit card (Master/Visa) through the Stripe link we provide upon Booking.</li>
                <li>Please note that we do accept payment by cash, in USD or MYR, only for the last-minute bookings.</li>
              </ul>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  {getSectionIcon(6)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">6. Cancellation and Rescheduling Policy</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-red-50/50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Cancellation of Courses by Provider</h3>
                  <ul className="list-disc list-inside text-base text-muted-foreground space-y-4 ml-4">
                    <li>In exceptional circumstances that are beyond our control, KM Training & Consultancy Services may be forced to alter or cancel a course, venue, instructors, or dates. We reserve the right to make such changes.</li>
                    <li>If any modifications are necessary, we will notify you before the course commencement date, and the fees already paid in full will not be subject to any increase.</li>
                  </ul>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Cancellation of Courses by Client</h3>
                  <p className="text-base text-muted-foreground mb-4">
                    Once you have completed your booking, received your confirmation of enrolment and a dated payment Invoice, you are deemed to have a contract with KM Training & Consultancy Services. You reserve the right to cancel this contract given the following terms:
                  </p>
                  <ul className="list-disc list-inside text-base text-muted-foreground space-y-4 ml-4">
                    <li>Cancellation Period: Registrations may be cancelled up to 14 days prior to the start of the training program. Cancellations made within the allowed cancellation period will incur a 25% administrative fee based on the course fees.</li>
                    <li>Cancelling a registration after the 14-day cancellation period has expired, we will review the situation individually. Possible options may include allowing the participant to designate a substitute, transferring their registration to a future session of the same course, or switching to a different course. However, please note that no refunds will be issued for cancellations made after this statutory period.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  {getSectionIcon(7)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">7. Certificate of Completion/Attendance</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                In case of an unexpected absence due to unforeseen circumstances, it is recommended to inform a KM Training & Consulting Services representative or your sponsors as soon as possible. However, more than three (3) sub-session absences, regardless of the reason, may result in the invalidation of your eligibility for the Certificate of Completion/Attendance. Therefore, it is crucial to attend all sessions of the course to ensure successful completion and receive the certificate. The daily course schedule will be strictly followed to facilitate an uninterrupted learning experience for all participants.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                  {getSectionIcon(8)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">8. Intellectual Property</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                All content provided through our Services, including training materials, course content, and resources, are the property of KM Training & Consulting Services or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from such content without our express written permission.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  {getSectionIcon(9)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">9. Limitations of Liability</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, KM Training & Consulting Services and its affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use of our Services, including but not limited to loss of profits, data, or other intangible losses.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                  {getSectionIcon(10)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">10. Governing Law</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                These Terms will be governed by and construed in accordance with the laws of Malaysia. Any disputes arising from or relating to these Terms shall be resolved in the courts located in Malaysia.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            >
              <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {getSectionIcon(11)}
              </div>
              <h2 className="text-2xl font-semibold text-foreground">11. Contact Information</h2>
            </div>
            <p className="text-base text-muted-foreground mb-4 leading-relaxed">For questions or concerns regarding these Terms, please contact us:</p>
            <div className="text-base text-muted-foreground space-y-2">
              <p>D5-10-3A EVERGREEN PARK SCOT PINE,</p>
              <p>PERSIARAN SL 1, BANDAR SUNGAI LONG,</p>
              <p>43000 KAJANG, SELANGOR MALAYSIA.</p>
              <p className="mt-4">Email: <a href="mailto:info@kmtcs.com.my" className="text-blue-600 hover:underline font-semibold">info@kmtcs.com.my</a></p>
              <p>Tel: <a href="tel:+6010-2175360" className="text-blue-600 hover:underline font-semibold">+6010-2175360</a></p>
            </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                  {getSectionIcon(12)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">12. Severability</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                  {getSectionIcon(13)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">13. Entire Agreement</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                These Terms constitute the entire agreement between you and KM Training & Consulting Services regarding the Services and supersede any prior agreements or understandings.
              </p>
            </div>
          </motion.section>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <p className="text-base text-foreground font-semibold leading-relaxed">
                By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </motion.div>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
