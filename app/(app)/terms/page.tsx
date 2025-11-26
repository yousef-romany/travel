import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - ZoeHoliday Egypt Travel",
  description: "Read ZoeHoliday's terms and conditions for Egypt travel services. Learn about our booking policies, cancellation terms, travel insurance requirements, and customer responsibilities for your Egyptian adventure.",
  keywords: ["terms and conditions", "Egypt travel terms", "booking policy", "cancellation policy", "travel insurance Egypt", "ZoeHoliday terms", "Egypt tour terms"],
  openGraph: {
    title: "Terms and Conditions - ZoeHoliday Egypt Travel",
    description: "Read ZoeHoliday's terms and conditions for Egypt travel services. Learn about our booking policies, cancellation terms, and customer responsibilities.",
    type: "website",
    url: "/terms",
    images: [
      {
        url: "/og-terms.jpg",
        width: 1200,
        height: 630,
        alt: "ZoeHoliday Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions - ZoeHoliday Egypt Travel",
    description: "Read ZoeHoliday's terms and conditions for Egypt travel services. Learn about our booking policies, cancellation terms, and customer responsibilities.",
    images: ["/og-terms.jpg"],
  },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted text-primary py-16">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display animate-slide-up">
              Terms and Conditions
            </h1>
            <p className="text-xl max-w-3xl mx-auto animate-slide-up animate-delay-100">
              Please read these terms carefully before using our services
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 container px-[2em] mdx-container">
          <div className="prose prose-lg max-w-none dark:prose-invert font-serif">
            <div className="animate-on-scroll">
              <h2 className="font-display">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the services provided by Egypt Tourism, you
                agree to be bound by these Terms and Conditions, all applicable
                laws and regulations, and agree that you are responsible for
                compliance with any applicable local laws.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">2. Booking and Cancellation Policy</h2>
              <p>
                2.1. Bookings are confirmed upon receipt of a deposit or full
                payment, as specified in the tour details.
              </p>
              <p>
                2.2. Cancellations made 30 days or more before the tour start date
                are eligible for a full refund, minus any non-refundable fees.
              </p>
              <p>
                2.3. Cancellations made between 14-29 days before the tour start
                date are eligible for a 50% refund.
              </p>
              <p>
                2.4. Cancellations made less than 14 days before the tour start
                date are not eligible for a refund.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">3. Travel Insurance</h2>
              <p>
                We strongly recommend that all travelers purchase comprehensive
                travel insurance to cover trip cancellation, medical emergencies,
                and other unforeseen circumstances.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">4. Passport and Visa Requirements</h2>
              <p>
                It is the responsibility of the traveler to ensure they have a
                valid passport and any necessary visas for entry into Egypt. Egypt
                Tourism is not liable for any issues arising from inadequate
                travel documentation.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">5. Health and Safety</h2>
              <p>
                5.1. Travelers are responsible for ensuring they are in good
                health and fit to participate in the booked tours.
              </p>
              <p>
                5.2. Egypt Tourism reserves the right to refuse service to anyone
                who poses a health or safety risk to themselves or others.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">6. Limitation of Liability</h2>
              <p>
                Egypt Tourism is not liable for any injury, loss, damage,
                accident, delay, or irregularity which may be caused by defect or
                failure of any vehicle, vessel, or other mode of transportation,
                or through the acts or default of any company or person engaged in
                conveying the passenger or in carrying out the arrangements of the
                tour.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">7. Changes to Itinerary</h2>
              <p>
                Egypt Tourism reserves the right to make changes to tour
                itineraries due to weather conditions, security concerns, or other
                unforeseen circumstances. We will make every effort to provide
                comparable alternatives in such cases.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">8. Privacy Policy</h2>
              <p>
                Your use of Egypt Tourism services is also governed by our Privacy
                Policy. Please review our Privacy Policy to understand our
                practices.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">9. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by and construed in
                accordance with the laws of Egypt, and you irrevocably submit to
                the exclusive jurisdiction of the courts in that State or
                location.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="font-display">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms and Conditions, please
                contact us at:
              </p>
              <p>
                Email: legal@egypttourism.com
                <br />
                Phone: +20 123 456 7890
              </p>
            </div>
          </div>
        </section>

        {/* Add scroll animation script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('animate-visible');
                    }
                  });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
                
                document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
              }
            `,
          }}
        />
      </main>
    </div>
  );
}
