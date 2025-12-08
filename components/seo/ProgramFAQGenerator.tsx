import { dataTypeCardTravel } from "@/type/programs";
import FAQSchema from "./FAQSchema";

interface FAQ {
    question: string;
    answer: string;
}

interface ProgramFAQGeneratorProps {
    program: dataTypeCardTravel;
}

/**
 * Generates FAQ schema and UI for program pages
 * Auto-creates common travel questions based on program data
 */
export function generateProgramFAQs(program: dataTypeCardTravel): FAQ[] {
    const faqs: FAQ[] = [];
    const programTitle = program.title || "Egypt Tour";

    // Question 1: What's included
    if (program.includes && program.includes.length > 0) {
        const includedItems = program.includes
            .map((item) => item.title)
            .join(", ");
        faqs.push({
            question: `What is included in the ${programTitle} tour?`,
            answer: `The ${programTitle} tour includes: ${includedItems}. This ensures you have a comfortable and memorable experience throughout your journey.`,
        });
    }

    // Question 2: Duration
    if (program.duration) {
        const durationText =
            program.tripType === "single-day" || Number(program.duration) === 1
                ? "a single day trip"
                : `${program.duration} days`;
        faqs.push({
            question: `How long is the ${programTitle} tour?`,
            answer: `The ${programTitle} is ${durationText}. ${Number(program.duration) > 1
                ? `This gives you plenty of time to explore all the amazing destinations and experiences included in the itinerary.`
                : `This day trip is perfect for those with limited time who still want to experience the highlights.`
                }`,
        });
    }

    // Question 3: Price
    if (program.price) {
        faqs.push({
            question: `What is the price of the ${programTitle} tour?`,
            answer: `The ${programTitle} tour is priced at $${Number(
                program.price
            ).toFixed(
                2
            )} per person. This price includes all the services and experiences mentioned in the tour package. Contact us for group discounts or special offers.`,
        });
    }

    // Question 4: Location
    if (program.Location) {
        faqs.push({
            question: `Where does the ${programTitle} tour take place?`,
            answer: `The ${programTitle} tour takes place in ${program.Location}, Egypt. ${program.content_steps && program.content_steps.length > 0
                ? `You'll visit ${program.content_steps.length} amazing destinations including ${program.content_steps
                    .slice(0, 3)
                    .map((step) => step.title)
                    .join(", ")}${program.content_steps.length > 3 ? ", and more" : ""
                }.`
                : "You'll explore the most iconic and beautiful locations in this region."
                }`,
        });
    }

    // Question 5: What to bring
    faqs.push({
        question: `What should I bring for the ${programTitle} tour?`,
        answer: `For the ${programTitle} tour, we recommend bringing: comfortable walking shoes, sunscreen, a hat, sunglasses, a camera, and a water bottle. ${Number(program.duration) > 1
            ? "For multi-day tours, also pack appropriate clothing for different weather conditions and any personal medications you may need."
            : "Since this is a day trip, light packing is recommended."
            }`,
    });

    // Question 6: Suitability
    const isFamilyFriendly = !programTitle.toLowerCase().includes("adventure");
    faqs.push({
        question: `Is the ${programTitle} tour suitable for families?`,
        answer: `${isFamilyFriendly
            ? `Yes, the ${programTitle} tour is suitable for families with children. The itinerary is designed to be enjoyable for all ages.`
            : `The ${programTitle} tour is best suited for adults and older children who can handle moderate physical activity.`
            } Please contact us if you have specific questions about accessibility or age requirements.`,
    });

    // Question 7: Meeting point
    if (program.meetingPoint) {
        faqs.push({
            question: `Where is the meeting point for the ${programTitle} tour?`,
            answer: `The meeting point for the ${programTitle} tour is at ${program.meetingPoint}. Please arrive 15 minutes before the scheduled departure time. Our guide will be waiting for you with a ZoeHoliday sign.`,
        });
    }

    // Question 8: Time
    if (program.startTime && program.endTime) {
        faqs.push({
            question: `What time does the ${programTitle} tour start and end?`,
            answer: `The ${programTitle} tour starts at ${program.startTime} and ends at ${program.endTime}. Please be punctual to ensure you don't miss any part of this amazing experience.`,
        });
    }

    // Question 9: Cancellation policy
    faqs.push({
        question: `What is the cancellation policy for the ${programTitle} tour?`,
        answer: `For the ${programTitle} tour, we offer free cancellation up to 24 hours before the tour starts. Cancellations made less than 24 hours before departure may be subject to a cancellation fee. Please refer to our terms and conditions or contact us for more details.`,
    });

    // Question 10: Booking process
    faqs.push({
        question: `How do I book the ${programTitle} tour?`,
        answer: `Booking the ${programTitle} tour is easy! Simply click the "Book This Experience" button on this page, select your preferred date and number of travelers, and complete the secure payment process. You'll receive instant confirmation via email with all the details you need for your tour.`,
    });

    return faqs;
}

export default function ProgramFAQGenerator({
    program,
}: ProgramFAQGeneratorProps) {
    const faqs = generateProgramFAQs(program);

    return (
        <>
            {/* FAQ Schema for SEO */}
            <FAQSchema faqs={faqs} />

            {/* FAQ UI Display */}
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <details
                        key={index}
                        className="group bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
                    >
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-foreground group-open:text-primary transition-colors">
                                {faq.question}
                            </h3>
                            <svg
                                className="w-5 h-5 text-primary transition-transform group-open:rotate-180 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </summary>
                        <div className="mt-4 pt-4 border-t border-primary/10">
                            <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </details>
                ))}
            </div>
        </>
    );
}
