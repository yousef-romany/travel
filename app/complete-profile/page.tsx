"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAuth } from "@/context/AuthContext";
import { validateCompleteProfile } from "@/lib/validation";
import { toast } from "sonner";

const MotionButton = motion(Button);

// ---------------- Countries List ----------------
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Republic of the",
  "Congo, Democratic Republic of the",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// ---------------- Page ----------------
export default function CompleteProfilePage() {
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");

  // ✅ Prevent redirect loop
  useEffect(() => {
    if (!authLoading && !user?.token) {
      window.location.href = "/login";
    }
  }, [authLoading, user]);

  const filteredCountries = countryQuery
    ? COUNTRIES.filter((c) =>
        c.toLowerCase().includes(countryQuery.toLowerCase())
      )
    : COUNTRIES;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectCountry = (c: string) => {
    setFormData({ ...formData, country: c });
    setCountryOpen(false);
    setCountryQuery("");
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e: any) => {
  e.preventDefault();
  setErrors({});

  // Validate form data
  const validation = validateCompleteProfile(formData);
  if (!validation.isValid) {
    setErrors(validation.errors);
    toast.error("Please fix the errors in the form");
    return;
  }

  setLoading(true);

  try {
    const token = user?.token;
    if (!token) return (window.location.href = "/login");

    // 1. Check if profile exists
    const p = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles?filters[user][id]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((r) => r.json());

    let profileId;

    // 2. Create profile if not found (Strapi v5 syntax)
    if (!p.data.length) {
      const created = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              ...formData,
              isProfileCompleted: true,
              user: {
                connect: [user.id], // <-- أهم تعديل
              },
            },
          }),
        }
      ).then((r) => r.json());

      if (!created.data) throw new Error("create-failed");

      profileId = created.data.id;

    } else {
      // 3. Update existing profile
      profileId = p.data[0].id;

      await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles/${profileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              ...formData,
              isProfileCompleted: true,
            },
          }),
        }
      );
    }

    setSuccess(true);
    setTimeout(() => (window.location.href = "/"), 1000);

  } catch (err) {
    console.error(err);
    alert("Error updating/creating profile");
  } finally {
    setLoading(false);
  }
};

  if (success)
    return (
      <div className="min-h-screen flex justify-center items-center text-primary">
        <CheckCircle size={72} />
        <p className="ml-3 text-2xl font-semibold">Profile Completed!</p>
      </div>
    );

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-background-950 to-muted-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>
      
        <motion.div className="w-full max-w-4xl bg-background/30 p-10 rounded-2xl border border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* PERSONAL */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="First Name"
                placeholder="Joe"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                error={errors.firstName}
              />
              <FormField
                label="Last Name"
                placeholder="Romany"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                error={errors.lastName}
              />
              <FormField
                label="Phone Number"
                placeholder="+20 10 123 4567"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                error={errors.phone}
              />
              <FormField
                type="date"
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                error={errors.dateOfBirth}
              />
              <FormField
                label="Nationality"
                placeholder="Egyptian"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                error={errors.nationality}
              />
            </div>

            {/* PASSPORT */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="Passport Number"
                placeholder="A12345678"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                required
                error={errors.passportNumber}
              />
              <FormField
                type="date"
                label="Passport Expiry"
                name="passportExpiry"
                value={formData.passportExpiry}
                onChange={handleChange}
                required
                error={errors.passportExpiry}
              />
            </div>

            {/* ADDRESS */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="Street Address"
                placeholder="12 Garden St"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                error={errors.address}
              />
              <FormField
                label="City"
                placeholder="Cairo"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                error={errors.city}
              />

              {/* COUNTRY DROPDOWN */}
              <div>
                <label className="text-sm text-primary">Country</label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <button className={`w-full px-4 py-3 rounded-xl text-primary border border-primary/20 text-left ${
                      errors.country ? "border-destructive" : ""
                    }`}>
                      {formData.country || "Select country..."}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[260px]">
                    <Command>
                      <CommandInput
                        placeholder="Search..."
                        value={countryQuery}
                        onValueChange={setCountryQuery}
                      />
                      <CommandList>
                        <CommandEmpty>No results.</CommandEmpty>
                        <CommandGroup>
                          {filteredCountries.map((c) => (
                            <CommandItem
                              key={c}
                              onSelect={() => handleSelectCountry(c)}
                            >
                              {c}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.country && (
                  <p className="text-xs text-destructive mt-1">{errors.country}</p>
                )}
              </div>

              <FormField
                label="Zip Code"
                placeholder="11511"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                error={errors.zipCode}
              />
            </div>

            {/* EMERGENCY CONTACT */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="Emergency Contact Name"
                placeholder="Mohamed Ali"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                required
                error={errors.emergencyContactName}
              />
              <FormField
                label="Emergency Contact Phone"
                placeholder="+20 11 987 6543"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                required
                error={errors.emergencyContactPhone}
              />
            </div>

            {/* SUBMIT */}
            <MotionButton
              whileHover={{ scale: loading ? 1 : 1.04 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-semibold bg-primary text-black rounded-xl"
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                  Saving...
                </div>
              ) : (
                "Complete Profile"
              )}
            </MotionButton>
          </form>

          <Link
            href="/signup"
            className="block text-center mt-6 text-primary hover:text-primary"
          >
            <ArrowLeft size={16} className="inline mr-1" /> Back to Signup
          </Link>
        </motion.div>
    </div>
  );
}
