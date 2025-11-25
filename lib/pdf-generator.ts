import jsPDF from "jspdf";

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripName: string;
  tripDate: string;
  tripDuration: number;
  numberOfTravelers: number;
  pricePerPerson: number;
  totalAmount: number;
  bookingDate: string;
}

// Helper to create a styled PDF matching the EgyptInvoice Card design
const createStyledInvoice = (doc: jsPDF, invoiceData: InvoiceData) => {
  // Colors matching the theme
  const primaryColor = [217, 119, 6]; // #d97706 amber-600
  const darkColor = [31, 41, 55]; // #1f2937 gray-800
  const lightGray = [243, 244, 246]; // #f3f4f6
  const white = [255, 255, 255];

  // Header Background with gradient effect
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 50, "F");

  // Add decorative pattern (simulating hieroglyphs background)
  // Using lighter color instead of opacity for compatibility
  doc.setFillColor(230, 145, 56); // Lighter shade of amber
  for (let i = 10; i < 200; i += 15) {
    for (let j = 10; j < 40; j += 10) {
      doc.rect(i, j, 8, 8, "F");
    }
  }

  // Company Name - Centered
  doc.setTextColor(white[0], white[1], white[2]);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("Egypt Tourism Invoice", 105, 22, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Journey through the Land of Pharaohs", 105, 35, { align: "center" });

  // Invoice Number Box (top right)
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(150, 8, 50, 25, 3, 3, "F");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice #", 152, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(invoiceData.invoiceNumber, 152, 20, { maxWidth: 46 });
  doc.text(`Date: ${new Date(invoiceData.bookingDate).toLocaleDateString()}`, 152, 28);

  // Main Content Area
  let yPos = 65;

  // Trip Name Section
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(invoiceData.tripName, 20, yPos);
  yPos += 10;

  // Description
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const desc = "Experience the wonders of Egypt with our carefully curated tour package.";
  doc.text(desc, 20, yPos, { maxWidth: 85 });
  yPos += 15;

  // Trip Details Icons & Info (Left Column)
  doc.setFontSize(10);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

  // Calendar Icon (simulated)
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(20, yPos - 3, 4, 4);
  doc.text(
    new Date(invoiceData.tripDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    27,
    yPos
  );
  yPos += 7;

  // Clock Icon (simulated)
  doc.circle(22, yPos - 1.5, 2);
  doc.text(`${invoiceData.tripDuration} Days`, 27, yPos);
  yPos += 7;

  // Users Icon (simulated)
  doc.circle(21, yPos - 1.5, 1.5);
  doc.circle(23, yPos - 1.5, 1.5);
  doc.text(`${invoiceData.numberOfTravelers} Travelers`, 27, yPos);

  // Customer Details Box (Right Column)
  const boxX = 115;
  const boxY = 65;
  // Light amber background for customer details
  doc.setFillColor(254, 243, 199); // Very light amber (#fef3c7)
  doc.roundedRect(boxX, boxY, 80, 40, 5, 5, "F");

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Customer Details", boxX + 5, boxY + 8);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Name:", boxX + 5, boxY + 16);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceData.customerName, boxX + 20, boxY + 16);

  doc.setFont("helvetica", "bold");
  doc.text("Email:", boxX + 5, boxY + 23);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceData.customerEmail, boxX + 20, boxY + 23, { maxWidth: 55 });

  doc.setFont("helvetica", "bold");
  doc.text("Phone:", boxX + 5, boxY + 30);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceData.customerPhone, boxX + 20, boxY + 30);

  // Separator Line
  yPos = 115;
  doc.setDrawColor(217, 119, 6); // Amber color
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);

  // Itinerary Highlights Section
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Itinerary Highlights", 20, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  const highlights = [
    "Visit the iconic Pyramids of Giza",
    "Explore the treasures of the Egyptian Museum",
    "Cruise along the majestic Nile River",
    "Discover ancient temples in Luxor",
    "Professional tour guide included",
  ];
  highlights.forEach((item) => {
    doc.text(`• ${item}`, 25, yPos);
    yPos += 6;
  });

  // Payment Details Box
  yPos += 10;
  // Light amber background for payment details
  doc.setFillColor(254, 243, 199); // Very light amber (#fef3c7)
  doc.roundedRect(20, yPos, 170, 35, 5, 5, "F");

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Payment Details", 25, yPos + 8);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Price per Person:", 25, yPos + 18);
  doc.text(`$${invoiceData.pricePerPerson.toFixed(2)}`, 165, yPos + 18, {
    align: "right",
  });

  doc.text("Number of Travelers:", 25, yPos + 25);
  doc.text(`${invoiceData.numberOfTravelers}`, 165, yPos + 25, { align: "right" });

  // Grand Total
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(105, yPos + 28, 85, 12, 3, 3, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text("Total Amount:", 110, yPos + 36);
  doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, 185, yPos + 36, { align: "right" });

  // Footer
  yPos = 270;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for choosing Egypt Tourism for your adventure!", 105, yPos, {
    align: "center",
  });
  doc.text("For any inquiries, please contact us at:", 105, yPos + 5, {
    align: "center",
  });
  doc.text(
    "Website: www.zoeholiday.com | Email: info@zoeholiday.com | Phone: +20 155 510 0961",
    105,
    yPos + 10,
    { align: "center" }
  );

  // Bottom Border
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 287, 210, 10, "F");

  // Page Border
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.rect(5, 5, 200, 287);
};

export const generateInvoicePDF = async (
  invoiceData: InvoiceData
): Promise<Blob> => {
  const doc = new jsPDF();

  // Use the new styled invoice function
  createStyledInvoice(doc, invoiceData);

  // Return as Blob
  return doc.output("blob");
};

export const downloadInvoicePDF = async (
  invoiceData: InvoiceData,
  filename: string = "invoice.pdf"
): Promise<void> => {
  const doc = new jsPDF();

  // Use the new styled invoice function
  createStyledInvoice(doc, invoiceData);

  // Download
  doc.save(filename);
};
