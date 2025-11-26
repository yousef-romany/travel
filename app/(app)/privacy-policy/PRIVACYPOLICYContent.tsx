"use client";

import { useEffect } from "react";

export default function PrivacypolicyContent() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary animate-slide-up">Privacy Policy</h1>

        <div className="space-y-8 text-foreground">
          <section className="animate-slide-up animate-delay-200">
            <p className="text-muted-foreground mb-4">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p>
              At ZoeHoliday, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
              or use our services.
            </p>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                <p>
                  We may collect personal information that you voluntarily provide to us when you register on the website,
                  make a booking, or contact us. This includes:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Billing and payment information</li>
                  <li>Travel preferences and special requirements</li>
                  <li>Profile information and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Automatically Collected Information</h3>
                <p>
                  When you visit our website, we may automatically collect certain information about your device and browsing actions:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Process and manage your bookings and reservations</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Send you booking confirmations and travel updates</li>
              <li>Improve our website and services</li>
              <li>Personalize your experience and show relevant content</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Information Sharing and Disclosure</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Service providers who assist in operating our website and providing services</li>
              <li>Travel partners (hotels, airlines, tour operators) necessary to fulfill your bookings</li>
              <li>Payment processors to handle transactions securely</li>
              <li>Legal authorities when required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information
              from unauthorized access, disclosure, alteration, or destruction. However, no internet transmission is
              completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct or update inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic,
              and personalize content. You can control cookie preferences through your browser settings, but some features
              may not function properly if cookies are disabled.
            </p>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal
              information from children. If you become aware that a child has provided us with personal information,
              please contact us.
            </p>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after
              any modifications indicates your acceptance of the updated policy.
            </p>
          </section>

          <section className="animate-on-scroll">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
            <p className="mb-2">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@zoeholiday.com</p>
              <p><strong>Phone:</strong> +20 155 510 0961</p>
              <p><strong>Address:</strong> Egypt, Cairo</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
