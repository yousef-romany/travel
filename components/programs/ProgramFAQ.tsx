"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface ProgramFAQProps {
  faqs?: FAQ[];
  programTitle?: string;
}

// Default FAQs if none provided
const defaultFAQs: FAQ[] = [
  {
    question: "What is included in the tour price?",
    answer:
      "The tour price includes all transportation, accommodation, guided tours, entrance fees to attractions, and most meals as specified in the itinerary. International flights and personal expenses are not included.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "You can cancel your booking within 24 hours of booking for a full refund. After 24 hours, cancellations are subject to our standard cancellation fees. Please refer to our terms and conditions for detailed information.",
  },
  {
    question: "Do I need a visa to visit Egypt?",
    answer:
      "Most travelers need a visa to enter Egypt. Many nationalities can obtain a visa on arrival at Egyptian airports for approximately $25 USD. Alternatively, you can apply for an e-visa before travel. We can provide guidance and assistance with the visa process.",
  },
  {
    question: "What should I pack for the trip?",
    answer:
      "We recommend comfortable walking shoes, light clothing for hot weather, a hat and sunscreen, modest clothing for religious sites, a light jacket for evenings, and any personal medications. A detailed packing list will be provided after booking.",
  },
  {
    question: "Are the tours suitable for children and elderly travelers?",
    answer:
      "Many of our tours are family-friendly and can accommodate travelers of various ages. However, some tours involve significant walking or physical activity. Please check the tour difficulty level and contact us to discuss specific requirements for children or elderly travelers.",
  },
  {
    question: "What is the group size?",
    answer:
      "Our group sizes typically range from 8 to 16 travelers, ensuring a more personalized experience. We also offer private tours for individuals, couples, or families who prefer a more exclusive experience.",
  },
  {
    question: "Is travel insurance required?",
    answer:
      "While not mandatory, we strongly recommend purchasing comprehensive travel insurance covering trip cancellation, medical emergencies, and lost luggage. We can help you arrange suitable insurance coverage.",
  },
  {
    question: "What language do the tour guides speak?",
    answer:
      "All our tour guides are fluent in English. We can also arrange guides speaking other languages including Arabic, French, German, Spanish, Italian, and more upon request with advance notice.",
  },
];

export function ProgramFAQ({ faqs = defaultFAQs, programTitle }: ProgramFAQProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Frequently Asked Questions
          {programTitle && (
            <span className="text-sm font-normal text-muted-foreground">
              - {programTitle}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
