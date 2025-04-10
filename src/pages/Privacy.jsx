
import React from 'react';
import AnimatedElement from '@/components/AnimatedElement';
import Section from '@/components/Section';
import Card, { CardContent } from '@/components/Card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-32 pb-16 flex-grow">
        <Section contentClassName="max-w-4xl mx-auto">
          <AnimatedElement animation="fadeIn">
            <Card className="bg-white text-slate-800">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
                <p className="mb-6 text-gray-800">
                  <strong>Effective Date:</strong> 1st May, 2025
                </p>

                <div className="space-y-8">
                  <section>
                    <p>
                      Welcome to ShashCode! Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you use our services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">1. Information We Collect</h2>
                    <ul className="list-disc ml-6 space-y-1">
                      <li><strong>Personal Information:</strong> Name, email address, and any other details you provide while contacting or subscribing.</li>
                      <li><strong>Usage Data:</strong> Pages visited, clicks, time spent, and device/browser information.</li>
                      <li><strong>Payment Details:</strong> (If applicable) via secure third-party gateways — we do not store card details.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">2. How We Use Your Information</h2>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>To provide and improve our services and content.</li>
                      <li>To personalize your experience and recommend relevant resources.</li>
                      <li>To send you updates, newsletters, or promotional content (only if opted-in).</li>
                      <li>To ensure site security, detect fraud, and prevent abuse.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">3. Data Sharing</h2>
                    <p>We do not sell your personal data. We may share it with:</p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>✅ Trusted service providers (e.g., email platforms, analytics, payment processors).</li>
                      <li>✅ Legal authorities if required by law or to protect our rights.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">4. Cookies & Analytics</h2>
                    <p>We use cookies to improve performance and analyze site usage via tools like Google Analytics. You can manage cookie preferences in your browser settings.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">5. Third-Party Links</h2>
                    <p>Our site may contain links to external platforms (e.g., YouTube, coding websites). We are not responsible for their privacy practices.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">6. Your Rights</h2>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Access the personal data we hold about you.</li>
                      <li>Request correction or deletion of your data.</li>
                      <li>Unsubscribe from emails at any time.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">7. Data Security</h2>
                    <p>We implement standard security measures to protect your data. However, no internet transmission is 100% secure — use at your own risk.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">8. Children's Privacy</h2>
                    <p>We do not knowingly collect personal data from users under 13 (or 16 in some regions) without parental consent.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">9. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy occasionally. We'll notify major updates via email or our website.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">10. Contact Us</h2>
                    <p>If you have questions or concerns, feel free to reach out:</p>
                    <p className="mt-3">📧 <a href="mailto:collaboratewithshashwat@gmail.com" className="underline text-primary hover:text-primary/80 transition-colors">collaboratewithshashwat@gmail.com</a></p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>
        </Section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;
