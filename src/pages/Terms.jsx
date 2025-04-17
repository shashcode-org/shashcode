
import React from 'react';
import AnimatedElement from '@/components/AnimatedElement';
import Section from '@/components/Section';
import Card, { CardContent } from '@/components/Card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="terms-page pt-32 pb-16 flex-grow">
        <Section contentClassName="max-w-4xl mx-auto">
          <AnimatedElement animation="fadeIn">
            <Card className="bg-white text-slate-800">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-primary mb-6">Terms and Conditions</h1>
                <p className="mb-6 text-gray-800">
                  <strong>Effective Date:</strong> 1st May, 2025
                </p>

                <div className="space-y-8">
                  <section>
                    <p>Welcome to ShashCode! By accessing or using our website, services, or content, you agree to abide by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold my-6 text-primary">1. Definitions</h2>
                    <p><strong>"ShashCode"</strong> ("we," "our," "us") – Refers to the website, content, and services provided.</p>
                    <p><strong>"User"</strong> ("you") – Any individual accessing or using our services.</p>
                    <p><strong>"Content"</strong> – Includes all materials, videos, articles, code, and digital products available on the platform.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">2. Use of Our Services</h2>
                    <p className="font-medium mb-2">2.1 Eligibility</p>
                    <p className="mb-4">You must be at least 13 years old (or 16 in some regions) to use our services. If you are under this age, you may only use ShashCode with parental consent.</p>

                    <p className="font-medium mb-2">2.2 Acceptable Use</p>
                    <ul className="list-disc ml-6 space-y-1 mb-4">
                      <li>✅ Use the website lawfully and ethically.</li>
                      <li>✅ Respect copyrights, trademarks, and intellectual property.</li>
                      <li>✅ Provide accurate information when required.</li>
                      <li>❌ Do not copy, reproduce, or distribute our content without permission.</li>
                      <li>❌ Do not engage in hacking, data scraping, or other malicious activities.</li>
                      <li>❌ Do not use automated bots to access or manipulate the website.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">3. Intellectual Property Rights</h2>
                    <p className="font-medium mb-2">3.1 Ownership of Content</p>
                    <p className="mb-4">All content on ShashCode is owned by Shashwat Tiwari and protected under copyright and trademark laws.</p>

                    <p className="font-medium mb-2">3.2 Limited License</p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>View and use free content for personal learning.</li>
                      <li>Share links to content without modification.</li>
                      <li>❌ You may not modify, sell, or distribute our content without permission.</li>
                      <li>❌ You may not use our trademarks, logos, or brand identity without approval.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">4. Payment & Refund Policy (If Applicable)</h2>
                    <p className="font-medium mb-2">4.1 Payment Terms</p>
                    <ul className="list-disc ml-6 space-y-1 mb-4">
                      <li>All payments must be made through approved gateways (e.g., Stripe, Razorpay, PayPal).</li>
                      <li>Prices are subject to change without notice.</li>
                    </ul>

                    <p className="font-medium mb-2">4.2 Refund Policy</p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>❌ Digital products (PDFs, pre-recorded courses): Non-refundable</li>
                      <li>✅ Live sessions or courses: Refundable within 7 days (if unsatisfied)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">5. User-Generated Content</h2>
                    <p>By submitting content (comments, feedback, reviews):</p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>✅ You own the content and have the right to share it.</li>
                      <li>✅ You allow us to use, display, and distribute your content.</li>
                      <li>❌ We may remove harmful, illegal, or abusive content.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">6. Disclaimers & Limitation of Liability</h2>
                    <p>Content is for educational purposes only. We do not guarantee placements or outcomes. Use at your own risk.</p>
                    <p className="mt-2">We're not liable for technical issues, downtime, or external link content.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">7. Privacy Policy & Data Collection</h2>
                    <p>By using ShashCode, you agree to our <a href="/privacy" className="text-primary underline hover:text-primary/80 transition-colors">Privacy Policy</a>.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">8. Account Termination</h2>
                    <p>We may suspend or terminate accounts that violate terms, involve fraud or abuse. No refunds upon termination.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">9. Governing Law</h2>
                    <p>These terms are governed by Indian law. Any disputes will be resolved through arbitration or courts in Gonda, Uttar Pradesh.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">10. Updates to Terms</h2>
                    <p>We may update these terms. Major changes will be notified via email or site announcement.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">11. Contact Us</h2>
                    <p>📧 <a href="mailto:collaboratewithshashwat@gmail.com" className="underline text-primary hover:text-primary/80 transition-colors">collaboratewithshashwat@gmail.com</a></p>
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

export default Terms;
