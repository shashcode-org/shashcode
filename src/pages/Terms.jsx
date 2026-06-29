import React from "react";
import AnimatedElement from "@/components/AnimatedElement";
import Section from "@/components/Section";
import Card, { CardContent } from "@/components/Card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="terms-page pt-32 pb-16 flex-grow">
        <Section contentClassName="max-w-4xl mx-auto">
          <AnimatedElement animation="fadeIn">
            <Card className="bg-card">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-primary mb-6">
                  Terms and Conditions
                </h1>

                <p className="mb-6 text-foreground">
                  <strong>Effective Date:</strong> 25th December, 2025
                </p>

                <div className="space-y-8">
                  <section>
                    <p>
                      Welcome to ShashCode. By accessing or using our website,
                      educational content, or services, you agree to these Terms
                      and Conditions. If you do not agree with any part of these
                      Terms, please discontinue using our platform.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      1. Definitions
                    </h2>

                    <p>
                      <strong>"ShashCode"</strong> ("we", "our", "us") refers to
                      the website, educational content, software, and services
                      provided by ShashCode.
                    </p>

                    <p className="mt-2">
                      <strong>"User"</strong> ("you") refers to anyone accessing
                      or using our website or services.
                    </p>

                    <p className="mt-2">
                      <strong>"Content"</strong> includes videos, articles,
                      coding problems, source code, learning materials, digital
                      products, graphics, and any other resources available on
                      the platform.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      2. Use of Our Services
                    </h2>

                    <p className="font-medium mb-2">2.1 Eligibility</p>

                    <p className="mb-4">
                      ShashCode is intended for a general audience and is not
                      directed toward children under the age of 13.
                    </p>

                    <p className="font-medium mb-2">2.2 Acceptable Use</p>

                    <ul className="list-disc ml-6 space-y-1">
                      <li>Use the website lawfully and ethically.</li>
                      <li>
                        Respect copyrights, trademarks, and intellectual
                        property rights.
                      </li>
                      <li>
                        Provide accurate information when creating an account.
                      </li>
                      <li>
                        Do not reproduce, copy, or redistribute our content
                        without permission.
                      </li>
                      <li>
                        Do not attempt to hack, scrape, reverse engineer, or
                        disrupt the website.
                      </li>
                      <li>
                        Do not use automated bots or scripts that negatively
                        impact the platform.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      3. User Accounts
                    </h2>

                    <p>
                      Certain features, including progress tracking, badges, and
                      cloud synchronization, require signing in using Google.
                    </p>

                    <ul className="list-disc ml-6 mt-3 space-y-1">
                      <li>
                        You are responsible for maintaining access to your Google
                        account.
                      </li>
                      <li>
                        You are responsible for activities performed through your
                        account.
                      </li>
                      <li>
                        We may suspend or terminate accounts involved in abuse,
                        fraud, or violations of these Terms.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      4. Intellectual Property Rights
                    </h2>

                    <p className="font-medium mb-2">
                      4.1 Ownership of Content
                    </p>

                    <p className="mb-4">
                      All educational content, videos, articles, source code,
                      graphics, logos, branding, website design, and software on
                      ShashCode are owned by Shashwat Tiwari unless otherwise
                      stated and are protected by applicable intellectual
                      property laws.
                    </p>

                    <p className="font-medium mb-2">
                      4.2 Limited License
                    </p>

                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        You may access free content for your personal learning.
                      </li>
                      <li>
                        You may share links to our content without modification.
                      </li>
                      <li>
                        You may not copy, sell, redistribute, or commercially
                        exploit our content without permission.
                      </li>
                      <li>
                        You may not use our trademarks, branding, or logos
                        without written approval.
                      </li>
                    </ul>

                    <p className="mt-4">
                      Your learning progress, achievements, and badges remain
                      associated with your account, while the platform,
                      educational content, branding, and software remain the
                      property of ShashCode.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      5. Payment & Refund Policy (If Applicable)
                    </h2>

                    <p className="font-medium mb-2">5.1 Payments</p>

                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        Future paid products or subscriptions will be processed
                        through secure third-party payment providers.
                      </li>
                      <li>
                        Prices may change without prior notice unless otherwise
                        stated.
                      </li>
                    </ul>

                    <p className="font-medium mt-4 mb-2">5.2 Refunds</p>

                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        Digital products are generally non-refundable unless
                        explicitly stated otherwise.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      6. User-Generated Content
                    </h2>

                    <p>
                      If you submit feedback, suggestions, or communications:
                    </p>

                    <ul className="list-disc ml-6 mt-3 space-y-1">
                      <li>You retain ownership of your submissions.</li>
                      <li>
                        You grant us permission to use your feedback for
                        improving our platform.
                      </li>
                      <li>
                        We reserve the right to remove unlawful, abusive, or
                        harmful content.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      7. Disclaimer & Limitation of Liability
                    </h2>

                    <p>
                      ShashCode provides educational content only. We do not
                      guarantee job placements, interview success, examination
                      results, or any specific outcomes.
                    </p>

                    <p className="mt-3">
                      The website and its services are provided "as is" without
                      warranties of any kind. We are not liable for technical
                      issues, service interruptions, data loss, or damages
                      arising from the use of our platform.
                    </p>

                    <p className="mt-3">
                      Links to third-party websites are provided solely for
                      convenience. We are not responsible for their content,
                      services, privacy practices, or availability.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      8. Privacy
                    </h2>

                    <p>
                      Your use of ShashCode is also governed by our Privacy
                      Policy. By using our website, you consent to the collection
                      and processing of information described in that policy.
                    </p>

                    <p className="mt-2">
                      <a
                        href="/privacy"
                        className="text-primary underline hover:text-primary/80 transition-colors"
                      >
                        View our Privacy Policy
                      </a>
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      9. Suspension & Termination
                    </h2>

                    <p>
                      We reserve the right to suspend or terminate access to the
                      platform if you violate these Terms or engage in unlawful,
                      fraudulent, abusive, or disruptive activities.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      10. Governing Law
                    </h2>

                    <p>
                      These Terms shall be governed by the laws of India. Any
                      disputes arising from these Terms shall be subject to the
                      jurisdiction of the courts located in Gonda, Uttar Pradesh,
                      India.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      11. Changes to These Terms
                    </h2>

                    <p>
                      We may update these Terms from time to time. Continued use
                      of the website after changes become effective constitutes
                      acceptance of the updated Terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      12. Contact Us
                    </h2>

                    <p>
                      If you have any questions regarding these Terms and
                      Conditions, please contact us:
                    </p>

                    <p className="mt-4">
                      📧{" "}
                      <a
                        href="mailto:collaboratewithshashwat@gmail.com"
                        className="underline text-primary hover:text-primary/80 transition-colors"
                      >
                        collaboratewithshashwat@gmail.com
                      </a>
                    </p>
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

