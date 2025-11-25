"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
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
import { getUserProfile, updateUserProfile, type UpdateProfileData } from "@/fetch/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

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

  const [success, setSuccess] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");

  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => getUserProfile(user!.id, user!.token),
    enabled: !!user?.id && !!user?.token,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) =>
      updateUserProfile(profile!.documentId, data, user!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => router.push("/me"), 1500);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      const errorMessage = (error as any).response?.data?.error?.message || "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    },
  });

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        nationality: profile.nationality || "",
        passportNumber: profile.passportNumber || "",
        passportExpiry: profile.passportExpiry || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        zipCode: profile.zipCode || "",
        emergencyContactName: profile.emergencyContactName || "",
        emergencyContactPhone: profile.emergencyContactPhone || "",
      });
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user?.token) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex justify-center items-center text-primary">
        <CheckCircle size={72} />
        <p className="ml-3 text-2xl font-semibold">Profile Updated!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-background-950 to-muted-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-amber-600 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-background/30 p-10 rounded-2xl border border-primary/20"
      >
        <h1 className="text-3xl font-bold text-primary text-center mb-8">
          Edit Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* PERSONAL */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="First Name"
                placeholder="Joe"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <FormField
                label="Last Name"
                placeholder="Romany"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <FormField
                label="Phone Number"
                placeholder="+20 10 123 4567"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <FormField
                type="date"
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
              <FormField
                label="Nationality"
                placeholder="Egyptian"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* PASSPORT */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Passport Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Passport Number"
                placeholder="A12345678"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                required
              />
              <FormField
                type="date"
                label="Passport Expiry"
                name="passportExpiry"
                value={formData.passportExpiry}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Street Address"
                placeholder="12 Garden St"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <FormField
                label="City"
                placeholder="Cairo"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />

              {/* COUNTRY DROPDOWN */}
              <div>
                <label className="text-sm text-primary font-medium">Country</label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full mt-2 px-4 py-3 rounded-xl text-foreground bg-background border border-primary/20 text-left hover:border-primary/40 transition-colors"
                    >
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
              </div>

              <FormField
                label="Zip Code"
                placeholder="11511"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* EMERGENCY CONTACT */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Emergency Contact Name"
                placeholder="Mohamed Ali"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                required
              />
              <FormField
                label="Emergency Contact Phone"
                placeholder="+20 11 987 6543"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex-1"
              disabled={updateProfileMutation.isPending}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <MotionButton
              whileHover={{ scale: updateProfileMutation.isPending ? 1 : 1.04 }}
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex-1 py-3 text-lg font-semibold bg-primary text-black rounded-xl"
            >
              {updateProfileMutation.isPending ? (
                <div className="flex justify-center items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </MotionButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
