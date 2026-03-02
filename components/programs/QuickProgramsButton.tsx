"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, X, Compass, Calendar, MapPin, GitCompare } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickProgramsButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Quick Programs Button */}
            <div className="fixed bottom-6 left-6 z-40 flex gap-3 flex-col">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-2"
                        >
                            <Link href="/programs" className="group">
                                <Button
                                    size="icon"
                                    className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/90 to-amber-600/90 hover:from-primary hover:to-amber-600 shadow-lg shadow-primary/20 transition-all hover:scale-110"
                                    title="All Programs"
                                >
                                    <Compass className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/plan-your-trip" className="group">
                                <Button
                                    size="icon"
                                    className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/90 to-amber-600/90 hover:from-primary hover:to-amber-600 shadow-lg shadow-primary/20 transition-all hover:scale-110"
                                    title="Plan Your Trip"
                                >
                                    <Calendar className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/placesTogo" className="group">
                                <Button
                                    size="icon"
                                    className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/90 to-amber-600/90 hover:from-primary hover:to-amber-600 shadow-lg shadow-primary/20 transition-all hover:scale-110"
                                    title="Places to Go"
                                >
                                    <MapPin className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/compare" className="group">
                                <Button
                                    size="icon"
                                    className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/90 to-amber-600/90 hover:from-primary hover:to-amber-600 shadow-lg shadow-primary/20 transition-all hover:scale-110"
                                    title="Compare Programs"
                                >
                                    <GitCompare className="h-5 w-5" />
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Toggle Button */}
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="icon"
                    className={cn(
                        "h-14 w-14 rounded-2xl shadow-xl transition-all duration-500 hover:scale-110",
                        isOpen
                            ? "bg-gradient-to-br from-red-500 to-rose-600"
                            : "bg-gradient-to-br from-primary via-primary/90 to-amber-600 shadow-primary/20"
                    )}
                    title={isOpen ? "Close Quick Access" : "Quick Programs Access"}
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Ticket className="h-6 w-6" />
                    )}
                </Button>
            </div>
        </>
    );
}

function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}
