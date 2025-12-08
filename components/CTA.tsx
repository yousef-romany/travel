"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle, Calendar, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { trackCTA, trackWhatsAppBooking } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
    variant?: "primary" | "secondary" | "outline" | "whatsapp" | "phone" | "email";
    size?: "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    icon?: React.ReactNode;
    showArrow?: boolean;
    fullWidth?: boolean;
    analyticsLabel?: string;
    analyticsLocation?: string;
}

export function CTAButton({
    variant = "primary",
    size = "md",
    children,
    href,
    onClick,
    className,
    icon,
    showArrow = false,
    fullWidth = false,
    analyticsLabel,
    analyticsLocation = "unknown",
}: CTAButtonProps) {
    const handleClick = () => {
        if (analyticsLabel) {
            trackCTA(analyticsLabel, analyticsLocation, href || "action");
        }
        onClick?.();
    };

    const variantStyles = {
        primary: "bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-700 text-white shadow-lg hover:shadow-xl",
        secondary: "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        whatsapp: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg",
        phone: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg",
        email: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg",
    };

    const sizeStyles = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
    };

    const buttonClasses = cn(
        "font-semibold transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg flex items-center justify-center gap-2",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
    );

    const content = (
        <>
            {icon}
            <span>{children}</span>
            {showArrow && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={cn(buttonClasses, "group")} onClick={handleClick}>
                {content}
            </Link>
        );
    }

    return (
        <Button className={cn(buttonClasses, "group")} onClick={handleClick}>
            {content}
        </Button>
    );
}

// Specialized CTA Components

interface BookNowCTAProps {
    programTitle: string;
    programId: string;
    price?: number;
    size?: "sm" | "md" | "lg" | "xl";
    fullWidth?: boolean;
    className?: string;
}

export function BookNowCTA({ programTitle, programId, price, size = "lg", fullWidth = true, className }: BookNowCTAProps) {
    const whatsappMessage = `Hi! I'm interested in booking "${programTitle}". Can you provide more details?`;
    const whatsappUrl = `https://wa.me/201000000000?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <CTAButton
            variant="whatsapp"
            size={size}
            href={whatsappUrl}
            fullWidth={fullWidth}
            className={className}
            icon={<MessageCircle className="w-5 h-5" />}
            showArrow
            analyticsLabel={`Book Now - ${programTitle}`}
            analyticsLocation="Program Page"
            onClick={() => trackWhatsAppBooking(programTitle, programId, price)}
        >
            Book Now via WhatsApp
        </CTAButton>
    );
}

interface ContactCTAProps {
    variant?: "whatsapp" | "phone" | "email";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    className?: string;
    location?: string;
}

export function ContactCTA({ variant = "whatsapp", size = "md", fullWidth = false, className, location = "unknown" }: ContactCTAProps) {
    const contactInfo = {
        whatsapp: {
            href: "https://wa.me/201000000000",
            icon: <MessageCircle className="w-5 h-5" />,
            text: "Chat on WhatsApp",
            variant: "whatsapp" as const,
        },
        phone: {
            href: "tel:+201000000000",
            icon: <Phone className="w-5 h-5" />,
            text: "Call Us Now",
            variant: "phone" as const,
        },
        email: {
            href: "mailto:info@zoeholiday.com",
            icon: <Mail className="w-5 h-5" />,
            text: "Email Us",
            variant: "email" as const,
        },
    };

    const contact = contactInfo[variant];

    return (
        <CTAButton
            variant={contact.variant}
            size={size}
            href={contact.href}
            fullWidth={fullWidth}
            className={className}
            icon={contact.icon}
            analyticsLabel={`Contact - ${variant}`}
            analyticsLocation={location}
        >
            {contact.text}
        </CTAButton>
    );
}

interface ExploreCTAProps {
    href: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "outline";
    className?: string;
    location?: string;
}

export function ExploreCTA({ href, children, size = "md", variant = "primary", className, location = "unknown" }: ExploreCTAProps) {
    return (
        <CTAButton
            variant={variant}
            size={size}
            href={href}
            className={className}
            showArrow
            analyticsLabel={`Explore - ${children}`}
            analyticsLocation={location}
        >
            {children}
        </CTAButton>
    );
}

interface PlanTripCTAProps {
    size?: "sm" | "md" | "lg" | "xl";
    fullWidth?: boolean;
    className?: string;
    location?: string;
}

export function PlanTripCTA({ size = "lg", fullWidth = false, className, location = "unknown" }: PlanTripCTAProps) {
    return (
        <CTAButton
            variant="primary"
            size={size}
            href="/plan-your-trip"
            fullWidth={fullWidth}
            className={className}
            icon={<Calendar className="w-5 h-5" />}
            showArrow
            analyticsLabel="Plan Your Custom Trip"
            analyticsLocation={location}
        >
            Plan Your Custom Trip
        </CTAButton>
    );
}

interface ViewAllCTAProps {
    href: string;
    label: string;
    size?: "sm" | "md" | "lg";
    className?: string;
    location?: string;
}

export function ViewAllCTA({ href, label, size = "md", className, location = "unknown" }: ViewAllCTAProps) {
    return (
        <CTAButton
            variant="outline"
            size={size}
            href={href}
            className={className}
            showArrow
            analyticsLabel={`View All - ${label}`}
            analyticsLocation={location}
        >
            View All {label}
        </CTAButton>
    );
}

interface DestinationCTAProps {
    destination: string;
    destinationId: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function DestinationCTA({ destination, destinationId, size = "md", className }: DestinationCTAProps) {
    return (
        <CTAButton
            variant="primary"
            size={size}
            href={`/destinations/${destinationId}`}
            className={className}
            icon={<MapPin className="w-5 h-5" />}
            showArrow
            analyticsLabel={`Explore ${destination}`}
            analyticsLocation="Destination Card"
        >
            Explore {destination}
        </CTAButton>
    );
}
