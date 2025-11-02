import { EgyptInvoice } from "@/components/EgyptInvoice"

export default function InvoiceDemoPage() {
  const invoiceData = {
    tripName: "Nile Explorer: Ancient Wonders & Modern Marvels",
    tripDescription:
      "Embark on a journey through time, exploring Egypt's most iconic sites from the pyramids of Giza to the temples of Luxor.",
    price: 2499.99,
    numberOfTravelers: 2,
    customerName: "John Doe",
    customerNationality: "United States",
    customerPhone: "+1 (555) 123-4567",
    transactionNumber: "EGY12345678",
    tripDate: "October 15, 2023",
    tripDuration: "10 days",
    itinerary: [
      "Day 1-3: Cairo & Pyramids of Giza",
      "Day 4-6: Luxor & Valley of the Kings",
      "Day 7-8: Aswan & Abu Simbel",
      "Day 9-10: Nile Cruise & Return to Cairo",
    ],
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <EgyptInvoice {...invoiceData} />
    </div>
  )
}

