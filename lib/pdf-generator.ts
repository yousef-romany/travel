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

export const generateInvoicePDF = async (
  invoiceData: InvoiceData
): Promise<Blob> => {
  const doc = new jsPDF();

  // Set colors
  const primaryColor = "#d97706"; // amber-600
  const darkColor = "#1f2937"; // gray-800
  const lightGray = "#f3f4f6"; // gray-100

  // Header with company name
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("ZoeHoliday", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Egypt Tourism & Travel", 105, 30, { align: "center" });

  // Invoice title
  doc.setTextColor(darkColor);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 20, 55);

  // Invoice details box
  doc.setFillColor(lightGray);
  doc.rect(140, 45, 50, 30, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 145, 52);
  doc.text(`Date: ${new Date(invoiceData.bookingDate).toLocaleDateString()}`, 145, 58);
  doc.text(`Status: Pending`, 145, 64);

  // Customer information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 85);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceData.customerName, 20, 92);
  doc.text(invoiceData.customerEmail, 20, 98);
  doc.text(invoiceData.customerPhone, 20, 104);

  // Trip details section
  doc.setFillColor(primaryColor);
  doc.rect(20, 115, 170, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Trip Details", 25, 122);

  // Trip information
  doc.setTextColor(darkColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const tripDetailsY = 135;
  doc.text("Trip Name:", 25, tripDetailsY);
  doc.setFont("helvetica", "bold");
  doc.text(invoiceData.tripName, 60, tripDetailsY);

  doc.setFont("helvetica", "normal");
  doc.text("Travel Date:", 25, tripDetailsY + 7);
  doc.setFont("helvetica", "bold");
  doc.text(new Date(invoiceData.tripDate).toLocaleDateString(), 60, tripDetailsY + 7);

  doc.setFont("helvetica", "normal");
  doc.text("Duration:", 25, tripDetailsY + 14);
  doc.setFont("helvetica", "bold");
  doc.text(`${invoiceData.tripDuration} days`, 60, tripDetailsY + 14);

  doc.setFont("helvetica", "normal");
  doc.text("Number of Travelers:", 25, tripDetailsY + 21);
  doc.setFont("helvetica", "bold");
  doc.text(invoiceData.numberOfTravelers.toString(), 60, tripDetailsY + 21);

  // Pricing table header
  const tableTop = 170;
  doc.setFillColor(primaryColor);
  doc.rect(20, tableTop, 170, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 25, tableTop + 7);
  doc.text("Quantity", 110, tableTop + 7);
  doc.text("Price", 140, tableTop + 7);
  doc.text("Total", 170, tableTop + 7);

  // Pricing table content
  doc.setTextColor(darkColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const rowY = tableTop + 17;
  doc.text("Tour Package", 25, rowY);
  doc.text(invoiceData.numberOfTravelers.toString(), 110, rowY);
  doc.text(`$${invoiceData.pricePerPerson.toFixed(2)}`, 140, rowY);
  doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, 170, rowY);

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, rowY + 5, 190, rowY + 5);

  // Total section
  const totalY = rowY + 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Subtotal:", 130, totalY);
  doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, 170, totalY);

  doc.text("Tax (0%):", 130, totalY + 7);
  doc.text("$0.00", 170, totalY + 7);

  // Grand total box
  doc.setFillColor(primaryColor);
  doc.rect(120, totalY + 12, 70, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("Total:", 130, totalY + 20);
  doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, 170, totalY + 20);

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const footerY = 270;
  doc.text("Thank you for choosing ZoeHoliday!", 105, footerY, { align: "center" });
  doc.text("For any inquiries, please contact us at:", 105, footerY + 5, { align: "center" });
  doc.text("Email: info@zoeholiday.com | Phone: +20 155 510 0961", 105, footerY + 10, {
    align: "center",
  });

  // Add border
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);

  // Return as Blob
  return doc.output("blob");
};

export const downloadInvoicePDF = async (
  invoiceData: InvoiceData,
  filename: string = "invoice.pdf"
): Promise<void> => {
  const doc = new jsPDF();

  // Set colors
  const primaryColor = "#d97706"; // amber-600
  const darkColor = "#1f2937"; // gray-800
  const lightGray = "#f3f4f6"; // gray-100

  // Header with company name
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("ZoeHoliday", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Egypt Tourism & Travel", 105, 30, { align: "center" });

  // Invoice title
  doc.setTextColor(darkColor);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 20, 55);

  // Invoice details box
  doc.setFillColor(lightGray);
  doc.rect(140, 45, 50, 30, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 145, 52);
  doc.text(`Date: ${new Date(invoiceData.bookingDate).toLocaleDateString()}`, 145, 58);
  doc.text(`Status: Pending`, 145, 64);

  // Customer information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 85);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceData.customerName, 20, 92);
  doc.text(invoiceData.customerEmail, 20, 98);
  doc.text(invoiceData.customerPhone, 20, 104);

  // Trip details section
  doc.setFillColor(primaryColor);
  doc.rect(20, 115, 170, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Trip Details", 25, 122);

  // Trip information
  doc.setTextColor(darkColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const tripDetailsY = 135;
  doc.text("Trip Name:", 25, tripDetailsY);
  doc.setFont("helvetica", "bold");
  doc.text(invoiceData.tripName, 60, tripDetailsY);

  doc.setFont("helvetica", "normal");
  doc.text("Travel Date:", 25, tripDetailsY + 7);
  doc.setFont("helvetica", "bold");
  doc.text(new Date(invoiceData.tripDate).toLocaleDateString(), 60, tripDetailsY + 7);

  doc.setFont("helvetica", "normal");
  doc.text("Duration:", 25, tripDetailsY + 14);
  doc.setFont("helvetica", "bold");
  doc.text(`${invoiceData.tripDuration} days`, 60, tripDetailsY + 14);

  doc.setFont("helvetica", "normal");
  doc.text("Number of Travelers:", 25, tripDetailsY + 21);
  doc.setFont("helvetica", "bold");
  doc.text(invoiceData.numberOfTravelers.toString(), 60, tripDetailsY + 21);

  // Pricing table header
  const tableTop = 170;
  doc.setFillColor(primaryColor);
  doc.rect(20, tableTop, 170, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 25, tableTop + 7);
  doc.text("Quantity", 110, tableTop + 7);
  doc.text("Price", 140, tableTop + 7);
  doc.text("Total", 170, tableTop + 7);

  // Pricing table content
  doc.setTextColor(darkColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const rowY = tableTop + 17;
  doc.text("Tour Package", 25, rowY);
  doc.text(invoiceData.numberOfTravelers.toString(), 110, rowY);
  doc.text(`$${invoiceData.pricePerPerson.toFixed(2)}`, 140, rowY);
  doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, 170, rowY);

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, rowY + 5, 190, rowY + 5);

  // Total section
  const totalY = rowY + 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Subtotal:", 130, totalY);
  doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, 170, totalY);

  doc.text("Tax (0%):", 130, totalY + 7);
  doc.text("$0.00", 170, totalY + 7);

  // Grand total box
  doc.setFillColor(primaryColor);
  doc.rect(120, totalY + 12, 70, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("Total:", 130, totalY + 20);
  doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, 170, totalY + 20);

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const footerY = 270;
  doc.text("Thank you for choosing ZoeHoliday!", 105, footerY, { align: "center" });
  doc.text("For any inquiries, please contact us at:", 105, footerY + 5, { align: "center" });
  doc.text("Email: info@zoeholiday.com | Phone: +20 155 510 0961", 105, footerY + 10, {
    align: "center",
  });

  // Add border
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);

  // Download
  doc.save(filename);
};
