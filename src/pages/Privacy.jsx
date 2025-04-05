import React from 'react';

const Privacy = () => {
  return (
    <div className="mt-10 min-h-[60vh] bg-white text-black px-4 py-10 md:px-8 rounded-xl shadow-md">
    <h1 className="text-3xl font-bold text-signature_yellow mb-6">Privacy Policy</h1>
    <p className="mb-4 text-gray-800">
      <strong>Effective Date:</strong> 1st May, 2025
    </p>

        <section className="mb-4">
          <p>
            Welcome to ShashCode! Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you use our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <ul className="list-disc ml-6">
            <li><strong>Personal Information:</strong> Name, email address, and any other details you provide while contacting or subscribing.</li>
            <li><strong>Usage Data:</strong> Pages visited, clicks, time spent, and device/browser information.</li>
            <li><strong>Payment Details:</strong> (If applicable) via secure third-party gateways — we do not store card details.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6">
            <li>To provide and improve our services and content.</li>
            <li>To personalize your experience and recommend relevant resources.</li>
            <li>To send you updates, newsletters, or promotional content (only if opted-in).</li>
            <li>To ensure site security, detect fraud, and prevent abuse.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share it with:</p>
          <ul className="list-disc ml-6">
            <li>✅ Trusted service providers (e.g., email platforms, analytics, payment processors).</li>
            <li>✅ Legal authorities if required by law or to protect our rights.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Cookies & Analytics</h2>
          <p>We use cookies to improve performance and analyze site usage via tools like Google Analytics. You can manage cookie preferences in your browser settings.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Third-Party Links</h2>
          <p>Our site may contain links to external platforms (e.g., YouTube, coding websites). We are not responsible for their privacy practices.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <ul className="list-disc ml-6">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Unsubscribe from emails at any time.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Data Security</h2>
          <p>We implement standard security measures to protect your data. However, no internet transmission is 100% secure — use at your own risk.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Children's Privacy</h2>
          <p>We do not knowingly collect personal data from users under 13 (or 16 in some regions) without parental consent.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy occasionally. We'll notify major updates via email or our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p>If you have questions or concerns, feel free to reach out:</p>
          <p className="mt-2">📧 <a href="mailto:collaboratewithshashwat@gmail.com" className="underline text-signature_yellow">collaboratewithshashwat@gmail.com</a></p>
        </section>
      </div>
  );
};

export default Privacy;
