'use client';

import { motion } from 'framer-motion';
import BackgroundLines from "../components/BackgroundLines";
import { Card, CardContent } from '@/app/components/ui/card';
import { FiShield, FiDatabase, FiEye, FiShare2, FiLock, FiKey, FiRefreshCw, FiMail, FiInfo } from 'react-icons/fi';
import React from 'react';

const getPrivacyIcon = (num: number) => {
  const icons: { [key: number]: React.ComponentType<{ className?: string }> } = {
    1: FiInfo,
    2: FiDatabase,
    3: FiEye,
    4: FiShare2,
    5: FiLock,
    6: FiKey,
    7: FiRefreshCw,
    8: FiMail,
  };
  const Icon = icons[num] || FiInfo;
  return <Icon className="w-6 h-6" />;
};

export default function PrivacyPolicy() {
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <FiShield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">KM Training & Consulting Services Privacy Policy</h1>
          <p className="text-center text-muted-foreground text-lg">Effective Date: 1st January 2025</p>
        </motion.div>
        </div>
        <Card className="relative z-50 shadow-xl border-2 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 lg:p-12">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-12 border-l-4 border-indigo-500">
                <p className="text-lg text-foreground leading-relaxed">
                  KM Training & Consulting Services ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of information that we receive from users of our services, including our website and training programs (collectively, the "Services"). By using our Services, you consent to the practices described in this Privacy Policy.
                </p>
              </div>
            </motion.div>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-indigo-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {getPrivacyIcon(2)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
              </div>
            <p className="text-base text-muted-foreground mb-4 leading-relaxed">We may collect and process the following types of information:</p>
            <ul className="list-disc list-inside text-base text-muted-foreground space-y-4 ml-4">
              <li>
                <span className="font-semibold text-foreground">Personal Information:</span> When you register for our training courses, inquire about our services, or communicate with us, we may collect personal information, including but not limited to your name, email address, phone number, mailing address, and professional background.
              </li>
              <li>
                <span className="font-semibold text-foreground">Payment Information:</span> If you make a purchase, we may collect payment details such as credit card numbers and other financial information necessary to process your payment. This information is processed securely through third-party payment processors and is not stored by us.
              </li>
              <li>
                <span className="font-semibold text-foreground">Usage Data:</span> We may collect information about how you access and use our Services, including your IP address, browser type, referring/exit pages, and the dates/times of your interactions.
              </li>
              <li>
                <span className="font-semibold text-foreground">Cookies and Tracking Technologies:</span> We may use cookies and similar tracking technologies to enhance your experience on our website, analyze usage, and provide targeted advertising. You can manage your cookie preferences through your browser settings.
              </li>
            </ul>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-indigo-50/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                {getPrivacyIcon(3)}
              </div>
              <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
            </div>
            <p className="text-base text-muted-foreground mb-4">We may use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside text-base text-muted-foreground space-y-2 ml-4">
              <li>To provide and improve our Services</li>
              <li>To process your registrations and payments</li>
              <li>To communicate with you about your registrations, training sessions, and promotions</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To analyze usage trends and improve our website and Services</li>
              <li>To comply with legal obligations</li>
            </ul>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-indigo-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                  {getPrivacyIcon(4)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">4. Sharing Your Information</h2>
              </div>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-base text-muted-foreground space-y-4 ml-4">
                <li>
                  <span className="font-semibold text-foreground">Service Providers:</span> We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep your information confidential.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Legal Compliance:</span> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Business Transfers:</span> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that business transaction.
                </li>
              </ul>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-indigo-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  {getPrivacyIcon(5)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                We implement a variety of security measures to maintain the safety of your personal information. While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee its absolute security.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-indigo-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                  {getPrivacyIcon(6)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">6. Your Rights</h2>
              </div>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">You have the right to:</p>
              <ul className="list-disc list-inside text-base text-muted-foreground space-y-2 ml-4 mb-4">
                <li>Access and request a copy of your personal information</li>
                <li>Request correction of any inaccuracies in your personal data</li>
                <li>Request deletion of your personal information, subject to our legal obligations</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-base text-muted-foreground mt-4 leading-relaxed">
                To exercise any of these rights, please contact us using the contact details provided below.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-indigo-50/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                  {getPrivacyIcon(7)}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">7. Changes to This Privacy Policy</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date. You are advised to review this Privacy Policy periodically for any changes. Your continued use of our Services after any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide by and be bound by the modified policy.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="mb-12 p-6 rounded-xl hover:bg-indigo-50/50 transition-colors bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                {getPrivacyIcon(8)}
              </div>
              <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
            </div>
            <p className="text-base text-muted-foreground mb-4 leading-relaxed">If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="text-base text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">KM Training & Consulting Services</p>
              <p>D5-10-3A EVERGREEN PARK SCOT PINE,</p>
              <p>PERSIARAN SL 1, BANDAR SUNGAI LONG,</p>
              <p>43000 KAJANG, SELANGOR MALAYSIA.</p>
              <p className="mt-4">Email: <a href="mailto:info@kmtcs.com.my" className="text-blue-600 hover:underline font-semibold">info@kmtcs.com.my</a></p>
              <p>Tel: <a href="tel:+6010-2175360" className="text-blue-600 hover:underline font-semibold">+6010-2175360</a></p>
            </div>
            </div>
          </motion.section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

