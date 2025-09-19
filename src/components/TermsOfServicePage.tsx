import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack }) => {
  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-y-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors mr-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Terms of Service
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Terms of Service
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Last Updated: September 2025
            </p>
          </div>

          {/* Terms of Service Content */}
          <div className="space-y-6">
            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
{`Terms of Service
Last Updated: September 2025

Welcome to the Richmond County Black & Minority Chamber of Commerce ("BMC," "we," "our," or "us") Member Directory app. By using our services, you agree to these Terms of Service ("Terms").

1. Acceptance of Terms
By accessing or using our app, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use our services.

2. Description of Service
Our app provides a directory of Black and minority-owned businesses in Richmond County, along with event information, networking opportunities, and business resources.

3. User Accounts and Registration
- You may need to create an account to access certain features.
- You are responsible for maintaining the confidentiality of your account information.
- You agree to provide accurate and complete information.
- You are responsible for all activities that occur under your account.

4. Business Listings
- Business owners may submit their businesses for inclusion in our directory.
- All submissions are subject to review and approval.
- We reserve the right to reject, remove, or modify any business listing.
- You grant us permission to display your business information publicly.

5. Acceptable Use
You agree not to:
- Use our services for any illegal or unauthorized purpose.
- Submit false, misleading, or inaccurate information.
- Interfere with or disrupt our services.
- Attempt to gain unauthorized access to our systems.
- Use our services to spam, harass, or harm others.

6. Intellectual Property
- Our app and its content are protected by copyright and other intellectual property laws.
- You may not copy, modify, distribute, or create derivative works without permission.
- Business listings and user-generated content remain the property of their respective owners.

7. Privacy
Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.

8. Disclaimers
- Our services are provided "as is" without warranties of any kind.
- We do not guarantee the accuracy, completeness, or reliability of business information.
- We are not responsible for interactions between users or business transactions.

9. Limitation of Liability
To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.

10. Indemnification
You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of our services or violation of these Terms.

11. Termination
We may terminate or suspend your access to our services at any time, with or without cause or notice.

12. Changes to Terms
We may update these Terms from time to time. We will notify you of significant changes by posting the new Terms with an updated "Last Updated" date.

13. Governing Law
These Terms are governed by the laws of New York State, without regard to conflict of law principles.

14. Contact Information
If you have questions about these Terms, please contact us:
Email: info@rcblackminoritycc.org
Address: 900 South Avenue, 3rd Fl. Suite 39, Staten Island, NY 10314

By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};