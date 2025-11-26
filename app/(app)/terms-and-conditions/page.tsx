import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read ZoeHoliday's terms and conditions for using our services, booking policies, cancellation rules, and legal agreements.",
  keywords: ["terms and conditions", "booking policy", "cancellation policy", "ZoeHoliday terms"],
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Terms and Conditions</h1>

        <div className="space-y-8 text-foreground">
          <section>
            <p className="text-muted-foreground mb-4">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p>
              Welcome to ZoeHoliday. By accessing and using our website and services, you agree to be bound by these
              Terms and Conditions. Please read them carefully before making any bookings or using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ZoeHoliday's website and services, you acknowledge that you have read, understood,
              and agree to be bound by these Terms and Conditions, along with our Privacy Policy. If you do not agree
              with any part of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">2. Services Provided</h2>
            <p>
              ZoeHoliday provides travel planning and booking services for destinations in Egypt and surrounding regions.
              Our services include but are not limited to:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Tour package bookings and custom itinerary planning</li>
              <li>Accommodation and transportation arrangements</li>
              <li>Travel consultation and destination information</li>
              <li>Guided tours and local experiences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">3. Booking and Payment</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">3.1 Booking Process</h3>
                <p>
                  All bookings are subject to availability and confirmation. A booking is only confirmed when you receive
                  a confirmation email from us with your booking details and reference number.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">3.2 Payment Terms</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Full payment or a deposit may be required at the time of booking</li>
                  <li>We accept major credit cards, debit cards, and other specified payment methods</li>
                  <li>All prices are quoted in USD unless otherwise specified</li>
                  <li>Prices are subject to change until booking is confirmed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">3.3 Price Changes</h3>
                <p>
                  While we strive to maintain accurate pricing, errors may occur. We reserve the right to correct any
                  pricing errors and will notify you before processing your booking if such an error is discovered.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Cancellation and Refund Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">4.1 Cancellation by Customer</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Cancellations more than 30 days before travel: 90% refund</li>
                  <li>Cancellations 15-30 days before travel: 50% refund</li>
                  <li>Cancellations less than 15 days before travel: No refund</li>
                  <li>Cancellation fees may vary based on specific tour packages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4.2 Cancellation by ZoeHoliday</h3>
                <p>
                  We reserve the right to cancel or modify bookings due to circumstances beyond our control (force majeure),
                  including but not limited to natural disasters, political instability, or health emergencies. In such cases,
                  we will offer alternative arrangements or a full refund.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4.3 Refund Processing</h3>
                <p>
                  Approved refunds will be processed within 14-21 business days to the original payment method.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Travel Documentation and Requirements</h2>
            <p className="mb-2">
              It is your responsibility to ensure you have:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Valid passport with at least 6 months validity</li>
              <li>Appropriate visas for your destination</li>
              <li>Required vaccinations and health certificates</li>
              <li>Adequate travel insurance coverage</li>
            </ul>
            <p className="mt-4">
              ZoeHoliday is not responsible for any issues arising from inadequate travel documentation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">6. Travel Insurance</h2>
            <p>
              We strongly recommend purchasing comprehensive travel insurance that covers trip cancellation, medical
              emergencies, personal injury, baggage loss, and other unforeseen circumstances. ZoeHoliday is not responsible
              for any losses not covered by insurance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">7. Liability and Limitations</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">7.1 Service Limitations</h3>
                <p>
                  ZoeHoliday acts as an intermediary between you and service providers (hotels, airlines, tour operators).
                  We are not liable for the acts, errors, omissions, or negligence of these third-party providers.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">7.2 Limitation of Liability</h3>
                <p>
                  To the fullest extent permitted by law, ZoeHoliday shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, or any loss of profits or revenues.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">8. User Conduct and Responsibilities</h2>
            <p className="mb-2">When using our services, you agree to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Respect local customs, laws, and regulations</li>
              <li>Behave appropriately during tours and at accommodations</li>
              <li>Not engage in any unlawful or prohibited activities</li>
              <li>Follow the instructions of tour guides and staff</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">9. Intellectual Property</h2>
            <p>
              All content on the ZoeHoliday website, including text, images, logos, graphics, and software, is the property
              of ZoeHoliday or its content suppliers and is protected by copyright and intellectual property laws. You may
              not reproduce, distribute, or use any content without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">10. Changes to Services and Terms</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of our services at any time. We may also
              update these Terms and Conditions periodically. Continued use of our services after changes constitutes
              acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">11. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms and Conditions or the use of our services shall be governed by the
              laws of Egypt. We encourage customers to contact us first to resolve any issues amicably before pursuing
              legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">12. Contact Information</h2>
            <p className="mb-2">
              For questions or concerns about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> support@zoeholiday.com</p>
              <p><strong>Phone:</strong> +20 155 510 0961</p>
              <p><strong>Address:</strong> Egypt, Cairo</p>
            </div>
          </section>

          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground">
              By using ZoeHoliday's services, you acknowledge that you have read, understood, and agree to be bound by
              these Terms and Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
