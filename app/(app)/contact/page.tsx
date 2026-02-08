
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitContactForm } from "@/fetch/contact";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            await submitContactForm(data);
            toast.success("Message sent successfully! We'll get back to you soon.");
            reset();
        } catch (error: any) {
            console.error("Contact form error:", error);
            toast.error(error.message || "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-16 sm:pt-20 pb-12 sm:pb-16">
            {/* Hero Section */}
            <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full mb-8 sm:mb-12 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />

                <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                        Contact Us
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl max-w-2xl text-white/90 px-4">
                        Have questions about your dream trip to Egypt? We're here to help!
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Contact Info */}
                    <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-primary">
                                Get in Touch
                            </h2>
                            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                                Whether you're planning a custom itinerary, need help with a booking, or just want to say hello, our team of Egypt experts is ready to assist you.
                            </p>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {/* Phone Card */}
                            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                                <div className="bg-primary/10 p-2.5 sm:p-3 rounded-full text-primary flex-shrink-0">
                                    <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-base sm:text-lg mb-1">
                                        Phone & WhatsApp
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted-foreground mb-2">
                                        Available 24/7 for support
                                    </p>
                                    <a
                                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-medium hover:underline text-base sm:text-lg inline-block min-h-[44px] flex items-center"
                                    >
                                        +20 155 510 0961
                                    </a>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                                <div className="bg-primary/10 p-2.5 sm:p-3 rounded-full text-primary flex-shrink-0">
                                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-base sm:text-lg mb-1">
                                        Email
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted-foreground mb-2">
                                        For inquiries and partnership
                                    </p>
                                    <a
                                        href="mailto:info@zoeholiday.com"
                                        className="text-primary font-medium hover:underline text-base sm:text-lg break-all inline-block min-h-[44px] flex items-center"
                                    >
                                        info@zoeholiday.com
                                    </a>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                                <div className="bg-primary/10 p-2.5 sm:p-3 rounded-full text-primary flex-shrink-0">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-base sm:text-lg mb-1">
                                        Office
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        Cairo, Egypt
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card border rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg order-1 lg:order-2">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6">
                            Send us a Message
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm sm:text-base font-medium block">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        placeholder="Your Name"
                                        {...register("name")}
                                        className={`h-11 sm:h-12 text-base ${errors.name ? "border-red-500" : ""}`}
                                    />
                                    {errors.name && (
                                        <p className="text-xs sm:text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm sm:text-base font-medium block">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        {...register("email")}
                                        className={`h-11 sm:h-12 text-base ${errors.email ? "border-red-500" : ""}`}
                                    />
                                    {errors.email && (
                                        <p className="text-xs sm:text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Subject Input */}
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm sm:text-base font-medium block">
                                    Subject
                                </label>
                                <Input
                                    id="subject"
                                    placeholder="How can we help?"
                                    {...register("subject")}
                                    className="h-11 sm:h-12 text-base"
                                />
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm sm:text-base font-medium block">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us about your travel plans or questions..."
                                    rows={5}
                                    {...register("message")}
                                    className={`text-base resize-none ${errors.message ? "border-red-500" : ""}`}
                                />
                                {errors.message && (
                                    <p className="text-xs sm:text-sm text-red-500">{errors.message.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 min-h-[44px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
