# Strapi Invoice Collection Setup Guide

This guide will help you create the **Invoice** collection in your Strapi backend.

## Steps to Create Invoice Collection

### 1. Access Strapi Admin Panel
- Navigate to `https://dashboard.zoeholidays.com/admin`
- Login with your admin credentials

### 2. Create New Collection Type
1. Go to **Content-Type Builder** in the left sidebar
2. Click on **"Create new collection type"**
3. Enter **"invoice"** as the Display name (singular: invoice, plural: invoices)
4. Click **Continue**

### 3. Add Fields

Add the following fields to your Invoice collection:

#### Text Fields
1. **invoiceNumber** (Text - Short text)
   - Type: Text (Short text)
   - Name: `invoiceNumber`
   - Advanced Settings:
     - Required field: ✓
     - Unique field: ✓

2. **bookingId** (Text - Short text)
   - Type: Text (Short text)
   - Name: `bookingId`
   - Advanced Settings:
     - Required field: ✓

3. **customerName** (Text - Short text)
   - Type: Text (Short text)
   - Name: `customerName`
   - Advanced Settings:
     - Required field: ✓

4. **customerEmail** (Email)
   - Type: Email
   - Name: `customerEmail`
   - Advanced Settings:
     - Required field: ✓

5. **customerPhone** (Text - Short text)
   - Type: Text (Short text)
   - Name: `customerPhone`
   - Advanced Settings:
     - Required field: ✓

6. **tripName** (Text - Short text)
   - Type: Text (Short text)
   - Name: `tripName`
   - Advanced Settings:
     - Required field: ✓

#### Date Field
7. **tripDate** (Date)
   - Type: Date
   - Name: `tripDate`
   - Advanced Settings:
     - Required field: ✓

#### Number Fields
8. **tripDuration** (Number - integer)
   - Type: Number (integer)
   - Name: `tripDuration`
   - Advanced Settings:
     - Required field: ✓

9. **numberOfTravelers** (Number - integer)
   - Type: Number (integer)
   - Name: `numberOfTravelers`
   - Advanced Settings:
     - Required field: ✓

10. **pricePerPerson** (Number - decimal)
    - Type: Number (decimal)
    - Name: `pricePerPerson`
    - Advanced Settings:
      - Required field: ✓

11. **totalAmount** (Number - decimal)
    - Type: Number (decimal)
    - Name: `totalAmount`
    - Advanced Settings:
      - Required field: ✓

#### Optional Field
12. **pdfUrl** (Text - Short text)
    - Type: Text (Short text)
    - Name: `pdfUrl`
    - Advanced Settings:
      - Required field: ✗

#### Enumeration Field
13. **status** (Enumeration)
    - Type: Enumeration
    - Name: `status`
    - Values:
      - `pending`
      - `paid`
      - `cancelled`
    - Default value: `pending`
    - Advanced Settings:
      - Required field: ✓

#### Relation Field
14. **user** (Relation)
    - Type: Relation
    - Name: `user`
    - Relation type: Invoice **belongs to** one User
    - Advanced Settings:
      - Required field: ✗

### 4. Save and Restart Strapi
1. Click **Save** button
2. Wait for Strapi to restart
3. The new Invoice collection will be available

### 5. Set Permissions

1. Go to **Settings** → **Roles** → **Public**
2. Under **Permissions** → **Invoice**, enable:
   - ✓ find
   - ✓ findOne

3. Go to **Settings** → **Roles** → **Authenticated**
4. Under **Permissions** → **Invoice**, enable:
   - ✓ find
   - ✓ findOne
   - ✓ create
   - ✓ update
   - ✓ delete

5. Click **Save**

## Collection Structure Summary

```json
{
  "invoiceNumber": "String (Unique)",
  "bookingId": "String",
  "customerName": "String",
  "customerEmail": "Email",
  "customerPhone": "String",
  "tripName": "String",
  "tripDate": "Date",
  "tripDuration": "Integer",
  "numberOfTravelers": "Integer",
  "pricePerPerson": "Decimal",
  "totalAmount": "Decimal",
  "pdfUrl": "String (Optional)",
  "status": "Enumeration (pending, paid, cancelled)",
  "user": "Relation (belongs to User)"
}
```

## Example Invoice Entry

```json
{
  "invoiceNumber": "INV-1234567890-1",
  "bookingId": "booking_doc_id_123",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+201234567890",
  "tripName": "Nile Explorer: Ancient Wonders",
  "tripDate": "2025-06-15T00:00:00.000Z",
  "tripDuration": 10,
  "numberOfTravelers": 2,
  "pricePerPerson": 1250.00,
  "totalAmount": 2500.00,
  "pdfUrl": null,
  "status": "pending",
  "user": "user_doc_id_123"
}
```

## API Endpoints

After creating the collection, the following endpoints will be available:

- **GET** `/api/invoices` - Get all invoices
- **GET** `/api/invoices/:id` - Get a single invoice
- **POST** `/api/invoices` - Create a new invoice
- **PUT** `/api/invoices/:id` - Update an invoice
- **DELETE** `/api/invoices/:id` - Delete an invoice

## Testing

You can test the invoice creation using the booking functionality in the application. After making a booking:

1. Check the browser's download folder for the generated PDF invoice
2. Verify the invoice is saved in Strapi:
   - Go to **Content Manager** → **Invoice**
   - You should see the newly created invoice entry

## Notes

- The invoice PDF is automatically generated and downloaded when a booking is confirmed
- The invoice number follows the format: `INV-{timestamp}-{bookingId}`
- WhatsApp notifications are sent to +201555100961 with booking details
- The system automatically invalidates and refetches booking queries to keep UI in sync
