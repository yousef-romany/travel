"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ArrowRight, SkipForward, User, Globe, Shield } from "lucide-react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MotionDiv = motion.div;

// ── Countries ──────────────────────────────────────────────
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina",
  "Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Belarus",
  "Belgium","Bolivia","Bosnia and Herzegovina","Brazil","Bulgaria","Cambodia","Canada",
  "Chile","China","Colombia","Croatia","Cuba","Cyprus","Czechia","Denmark","Ecuador",
  "Egypt","Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece",
  "Guatemala","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel",
  "Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Lebanon","Libya",
  "Lithuania","Luxembourg","Malaysia","Maldives","Malta","Mexico","Moldova","Morocco",
  "Myanmar","Nepal","Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan",
  "Panama","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia",
  "Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia","Somalia",
  "South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland",
  "Syria","Taiwan","Tanzania","Thailand","Tunisia","Turkey","Uganda","Ukraine",
  "United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

// ── Steps definition ──────────────────────────────────────
const STEPS = [
  {
    id: "personal",
    title: "Personal Info",
    subtitle: "Tell us about yourself",
    icon: User,
    required: true,
  },
  {
    id: "travel",
    title: "Travel Details",
    subtitle: "For bookings & visas",
    icon: Globe,
    required: false,
  },
  {
    id: "emergency",
    title: "Emergency Contact",
    subtitle: "Required for group tours",
    icon: Shield,
    required: false,
  },
];

// ── Component ─────────────────────────────────────────────
export default function CompleteProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1 — required
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    // Step 2 — optional
    passportNumber: "",
    passportExpiry: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    // Step 3 — optional
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");

  // Pre-fill from existing profile data
  React.useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      setFormData((prev) => ({
        ...prev,
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        phone: p.phone || "",
        city: p.city || "",
        country: p.country || "",
      }));
    }
  }, [user]);

  const filteredCountries = countryQuery
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase()))
    : COUNTRIES;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ── Validate only the current step ──
  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  // ── Save whatever we have (partial or complete) ──
  const saveProfile = async (markCompleted: boolean) => {
    if (!user?.token) return router.push("/login");

    setSubmitting(true);
    try {
      const me = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=profile`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      ).then((r) => r.json());

      const payload = {
        ...formData,
        isProfileCompleted: markCompleted,
      };

      if (!me.profile) {
        // Create
        const created = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ data: payload }),
          }
        ).then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d?.error?.message || "Failed to create profile");
          return d;
        });

        const profileId = created.data?.documentId;
        if (profileId) {
          await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ profile: profileId }),
          });
        }
      } else {
        // Update
        await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles/${me.profile.documentId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ data: payload }),
          }
        ).then(async (r) => {
          if (!r.ok) {
            const d = await r.json();
            throw new Error(d?.error?.message || "Failed to update profile");
          }
        });
      }

      setDone(true);
      setTimeout(() => router.push("/me"), 1200);
    } catch (err: any) {
      toast.error(err?.message || "Error saving profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (!validateStep()) return;
    saveProfile(true);
  };

  const handleSkipAll = () => {
    // Allow user to explore — save what they've filled so far (if anything)
    const hasAnyData = formData.firstName || formData.phone;
    if (hasAnyData) {
      saveProfile(false); // partial save, not marked completed
    } else {
      router.push("/programs"); // go explore directly
    }
  };

  // ── Success screen ──
  if (done) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-primary">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <CheckCircle size={80} />
        </motion.div>
        <p className="text-2xl font-semibold">Profile Saved!</p>
        <p className="text-muted-foreground">Taking you to your profile...</p>
      </div>
    );
  }

  // ── Variants for slide animation ──
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-background to-muted flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 right-16 w-72 h-72 bg-primary/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-16 w-72 h-72 bg-primary/60 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm">
            This helps us personalise your travel experience. You can skip and do it later.
          </p>
        </div>

        {/* ── Step Indicators ── */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isDone
                        ? "bg-primary border-primary text-primary-foreground"
                        : isActive
                        ? "border-primary text-primary bg-primary/10"
                        : "border-muted-foreground/30 text-muted-foreground/50"
                    }`}
                  >
                    {isDone ? <CheckCircle size={18} /> : <Icon size={18} />}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      isActive ? "text-primary" : isDone ? "text-primary/70" : "text-muted-foreground/50"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
                      i < step ? "bg-primary" : "bg-muted-foreground/20"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Card ── */}
        <div className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <MotionDiv
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="p-8 space-y-6"
            >
              {/* Step header */}
              <div className="mb-2">
                <h2 className="text-xl font-bold">{STEPS[step].title}</h2>
                <p className="text-muted-foreground text-sm">{STEPS[step].subtitle}</p>
                {!STEPS[step].required && (
                  <span className="inline-block mt-1 text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    Optional — you can skip this step
                  </span>
                )}
              </div>

              {/* ── Step 1: Personal Info ── */}
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="First Name *"
                    placeholder="Joe"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <FormField
                    label="Last Name *"
                    placeholder="Smith"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                  <FormField
                    label="Phone Number *"
                    placeholder="+20 10 123 4567"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                  <FormField
                    type="date"
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Nationality"
                    placeholder="Egyptian"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* ── Step 2: Travel Details ── */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Passport Number"
                    placeholder="A12345678"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                  />
                  <FormField
                    type="date"
                    label="Passport Expiry"
                    name="passportExpiry"
                    value={formData.passportExpiry}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Street Address"
                    placeholder="12 Garden St"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <FormField
                    label="City"
                    placeholder="Cairo"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />

                  {/* Country dropdown */}
                  <div>
                    <label className="text-sm text-primary block mb-1">Country</label>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <button className="w-full px-4 py-3 rounded-xl text-foreground border border-primary/20 text-left hover:border-primary/50 transition-colors">
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
                                  onSelect={() => {
                                    setFormData({ ...formData, country: c });
                                    setCountryOpen(false);
                                    setCountryQuery("");
                                  }}
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
                    label="Zip / Postal Code"
                    placeholder="11511"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* ── Step 3: Emergency Contact ── */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Emergency Contact Name"
                    placeholder="Mohamed Ali"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Emergency Contact Phone"
                    placeholder="+20 11 987 6543"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                  />
                  <div className="col-span-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">Why do we ask this?</p>
                    <p>Emergency contact details are required for group tours and travel insurance. They will never be shared publicly.</p>
                  </div>
                </div>
              )}
            </MotionDiv>
          </AnimatePresence>

          {/* ── Navigation ── */}
          <div className="px-8 pb-8 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={goBack} className="gap-2">
                  <ArrowLeft size={16} /> Back
                </Button>
              )}

              {step < STEPS.length - 1 ? (
                <Button className="flex-1 gap-2" onClick={goNext}>
                  Next <ArrowRight size={16} />
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-amber-600 gap-2"
                  onClick={handleFinish}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Saving...
                    </span>
                  ) : (
                    <><CheckCircle size={16} /> Complete Profile</>
                  )}
                </Button>
              )}
            </div>

            {/* ✅ Skip option — users can always browse first */}
            <button
              onClick={handleSkipAll}
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
            >
              <SkipForward size={14} />
              {step === 0 ? "Skip for now — I'll explore first" : "Skip remaining steps"}
            </button>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          You can always complete your profile later from{" "}
          <Link href="/me" className="text-primary hover:underline">
            My Account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
