import React from "react";
import { Link } from "react-router-dom";
import AnimatedElement from "@/components/AnimatedElement";
import Section from "@/components/Section";
import Card, { CardContent } from "@/components/Card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="privacy-page pt-32 pb-16 flex-grow">
        <Section contentClassName="max-w-4xl mx-auto">
          <AnimatedElement animation="fadeIn">
            <Card className="bg-card">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-primary mb-6">
                  Privacy Policy
                </h1>

                <p className="mb-6 text-foreground">
                  <strong>Effective Date:</strong> 25th December, 2025
                </p>

                <div className="space-y-8">
                  <section>
                    <p>
                      Welcome to ShashCode! Your privacy is important to us.
                      This Privacy Policy explains what information we collect,
                      how we use it, and how we protect it when you use our
                      website and services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      1. Information We Collect
                    </h2>

                    <ul className="list-disc ml-6 space-y-4">
                      <li>
                        <strong>Personal Information:</strong> Name and email
                        address that you voluntarily provide when contacting us
                        through the Contact Us page.
                      </li>

                      <li>
                        <strong>Google Sign-In:</strong>

                        <p className="mt-2">
                          Most of our educational content is available without
                          creating an account. However, features such as
                          progress tracking, badges, and cloud synchronization
                          require you to sign in using Google.
                        </p>

                        <p className="mt-2">
                          When you sign in, we may collect:
                        </p>

                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>Name</li>
                          <li>Email address</li>
                          <li>Profile picture (if provided by Google)</li>
                          <li>Unique account identifier</li>
                        </ul>

                        <p className="mt-2">
                          This information is used solely to authenticate your
                          account and provide personalized features.
                        </p>
                      </li>

                      <li>
                        <strong>Learning Progress:</strong>

                        <p className="mt-2">
                          If you sign in, we may store information such as:
                        </p>

                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>Solved questions</li>
                          <li>Learning progress</li>
                          <li>Earned badges</li>
                          <li>Learning preferences</li>
                        </ul>

                        <p className="mt-2">
                          This allows your progress to be synchronized across
                          devices.
                        </p>
                      </li>

                      <li>
                        <strong>Usage Data:</strong> Pages visited, clicks, time
                        spent, browser type, device information, and other
                        anonymous analytics data.
                      </li>

                      <li>
                        <strong>Payment Details:</strong> If paid services are
                        introduced in the future, payments will be processed by
                        secure third-party payment providers. We do not store
                        your debit or credit card information.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      2. How We Use Your Information
                    </h2>

                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        To provide and improve our educational content and
                        services.
                      </li>
                      <li>
                        To authenticate your account and synchronize your
                        learning progress across devices.
                      </li>
                      <li>
                        To respond to inquiries and support requests.
                      </li>
                      <li>
                        To communicate with you if you explicitly request
                        updates from us.
                      </li>
                      <li>
                        To ensure website security, detect fraud, and prevent
                        abuse.
                      </li>
                      <li>
                        To analyze website usage and improve user experience.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      3. Data Sharing
                    </h2>

                    <p>
                      We do not sell your personal information. We may share
                      information only with trusted third-party service
                      providers required to operate our platform, including:
                    </p>

                    <ul className="list-disc ml-6 mt-3 space-y-1">
                      <li>Google (Google Sign-In, Google Analytics, and Google AdSense)</li>
                      <li>Supabase (Authentication & Database)</li>
                      <li>Sentry (Error Monitoring)</li>
                      <li>Netlify (Website Hosting)</li>
                      <li>
                        Legal authorities where required by applicable law.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      4. Cookies & Analytics
                    </h2>

                    <p>We use cookies and similar technologies to:</p>

                    <ul className="list-disc ml-6 mt-3 space-y-1">
                      <li>Keep you signed in</li>
                      <li>Remember your preferences</li>
                      <li>Synchronize your account securely</li>
                      <li>Analyze website traffic</li>
                      <li>Improve website performance and user experience</li>
                    </ul>

                    <p className="mt-3">
                      You can manage cookie preferences through your browser
                      settings. Where available, you may also manage your cookie
                      preferences using the cookie settings provided on our website.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      5. Third-Party Links
                    </h2>

                    <p>
                      Our website may contain links to external websites such as
                      YouTube, coding platforms, and other learning resources.
                      We are not responsible for the privacy practices or
                      content of those third-party websites.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      6. Your Rights
                    </h2>

                    <ul className="list-disc ml-6 space-y-1">
                      <li>Access the personal information we hold about you.</li>
                      <li>Request correction of inaccurate information.</li>
                      <li>
                        Request deletion of your account and associated learning
                        data.
                      </li>
                      <li>Unsubscribe from emails at any time.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      7. Data Security
                    </h2>

                    <p>
                      We implement reasonable technical and organizational
                      measures to protect your information. Authentication is
                      securely handled using Google Sign-In and Supabase.
                      However, no method of internet transmission or electronic
                      storage is 100% secure.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      8. Data Retention
                    </h2>

                    <p>
                     We retain your account information and learning progress only
                     for as long as necessary to provide our services, comply with
                     legal obligations, resolve disputes, and enforce our agreements.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      9. Children's Privacy
                    </h2>

                    <p>
                      ShashCode is intended for a general audience and is not
                      directed toward children under the age of 13. We do not
                      knowingly collect personal information from children.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      10. Changes to This Privacy Policy
                    </h2>

                    <p>
                      We may update this Privacy Policy from time to time.
                      Significant changes will be announced through our website
                      or, where appropriate, via email.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary">
                      11. Contact Us
                    </h2>

                    <p>
                      If you have any questions regarding this Privacy Policy or
                      would like to access, update, or request deletion of your
                      personal information, please contact us:
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

export default Privacy;
