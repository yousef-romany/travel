"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, Loader2, Bot, User, Trash2, Ticket, MapPin, Calendar, Compass } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Message {
    id: string;
    sender: "user" | "bot";
    text: string;
    timestamp: Date;
}

interface UserInfo {
    name: string;
    phone: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [formData, setFormData] = useState({ name: "", phone: "" });
    const [formErrors, setFormErrors] = useState({ name: "", phone: "" });
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "bot",
            text: "👋 Hi! I'm Zoe, your AI travel assistant. How can I help you plan your perfect trip to Egypt?\n\nYou can also browse our popular programs below:",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize Session and check for existing user info + restore chatbot state
    useEffect(() => {
        if (!sessionStorage.getItem("zoe_chat_session")) {
            sessionStorage.setItem("zoe_chat_session", uuidv4());
        }

        const savedUserInfo = sessionStorage.getItem("zoe_user_info");
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        }

        // Restore chatbot open state from localStorage
        const chatbotState = localStorage.getItem("zoe_chatbot_open");
        if (chatbotState === "true") {
            setIsOpen(true);
        }

        // Restore chat messages from localStorage
        const savedMessages = localStorage.getItem("zoe_chat_messages");
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                // Convert timestamp strings back to Date objects
                const messagesWithDates = parsedMessages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(messagesWithDates);
            } catch (error) {
                console.error("Failed to restore messages:", error);
            }
        }
    }, []);

    // Persist chatbot open state to localStorage
    useEffect(() => {
        localStorage.setItem("zoe_chatbot_open", isOpen.toString());
    }, [isOpen]);

    // Persist chat messages to localStorage
    useEffect(() => {
        localStorage.setItem("zoe_chat_messages", JSON.stringify(messages));
    }, [messages]);

    // Sync chatbot state and messages across tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "zoe_chatbot_open" && e.newValue !== null) {
                setIsOpen(e.newValue === "true");
            }
            if (e.key === "zoe_chat_messages" && e.newValue !== null) {
                try {
                    const parsedMessages = JSON.parse(e.newValue);
                    const messagesWithDates = parsedMessages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }));
                    setMessages(messagesWithDates);
                } catch (error) {
                    console.error("Failed to sync messages:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Show contact form when opening chat if user info not provided
    useEffect(() => {
        if (isOpen && !userInfo) {
            setShowContactForm(true);
        }
    }, [isOpen, userInfo]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            // Find the viewport element inside ScrollArea
            const scrollViewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollViewport) {
                scrollViewport.scrollTop = scrollViewport.scrollHeight;
            }
        }
    }, [messages, isOpen]);

    // Focus input when open
    useEffect(() => {
        if (isOpen && inputRef.current && !showContactForm) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, showContactForm]);

    const validateForm = () => {
        const errors = { name: "", phone: "" };
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = "Name is required";
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
            isValid = false;
        }

        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
            isValid = false;
        } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            errors.phone = "Please enter a valid phone number";
            isValid = false;
        } else if (formData.phone.replace(/\D/g, '').length < 10) {
            errors.phone = "Phone number must be at least 10 digits";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleContactFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const info: UserInfo = {
                name: formData.name.trim(),
                phone: formData.phone.trim()
            };
            setUserInfo(info);
            sessionStorage.setItem("zoe_user_info", JSON.stringify(info));
            setShowContactForm(false);

            // Add a personalized welcome message
            setMessages([
                {
                    id: "welcome",
                    sender: "bot",
                    text: `👋 Hi ${info.name}! I'm Zoe, your AI travel assistant. How can I help you plan your perfect trip to Egypt?`,
                    timestamp: new Date()
                }
            ]);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            id: uuidv4(),
            sender: "user",
            text: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        const session = sessionStorage.getItem("zoe_chat_session");

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg.text,
                    session: session,
                    userInfo: userInfo
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();
            console.log("Chatbot response:", data);

            let botText = "Sorry, I didn't catch that.";

            // Helper function to recursively find the 'output' property in nested objects
            const findOutputInNestedObject = (obj: any, depth: number = 0): string | null => {
                if (!obj || typeof obj !== 'object' || depth > 10) return null;

                // Check if current object has 'output' property
                if (obj.output && typeof obj.output === 'string') {
                    return obj.output;
                }

                // Check for other common message properties
                if (obj.text && typeof obj.text === 'string') return obj.text;
                if (obj.message && typeof obj.message === 'string') return obj.message;
                if (obj.response && typeof obj.response === 'string') return obj.response;

                // Recursively search in nested objects
                for (const key in obj) {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        const result = findOutputInNestedObject(value, depth + 1);
                        if (result) return result;
                    }
                }

                return null;
            };

            // Handle various n8n response formats
            console.log("Raw response data:", JSON.stringify(data, null, 2));

            // Case 1: Direct string response
            if (typeof data === 'string') {
                botText = data;
            }
            // Case 2: Object with direct properties
            else if (data && typeof data === 'object') {
                // Try to find output in nested structure first
                const nestedOutput = findOutputInNestedObject(data);
                if (nestedOutput) {
                    botText = nestedOutput;
                }
                // Fallback to direct properties
                else if (data.output && typeof data.output === 'string') {
                    botText = data.output;
                }
                else if (data.output && typeof data.output === 'object' && data.output.content) {
                    botText = data.output.content;
                }
                else if (data.text && typeof data.text === 'string') {
                    botText = data.text;
                }
                else if (data.message && typeof data.message === 'string') {
                    botText = data.message;
                }
                else if (data.response && typeof data.response === 'string') {
                    botText = data.response;
                }
                // Case: Single key object where the value might be the message
                else if (Object.keys(data).length === 1) {
                    const value = Object.values(data)[0];
                    if (typeof value === 'string') {
                        botText = value;
                    } else if (value && typeof value === 'object' && 'output' in value) {
                        const valWithOutput = value as { output: any };
                        botText = typeof valWithOutput.output === 'string' ? valWithOutput.output : JSON.stringify(valWithOutput.output);
                    }
                }
                // Last resort: stringify the whole object
                else {
                    console.warn("Could not extract message from response:", data);
                    botText = JSON.stringify(data);
                }
            }
            // Case 3: Array (if API didn't unwrap it)
            else if (Array.isArray(data) && data.length > 0) {
                const nestedOutput = findOutputInNestedObject(data[0]);
                botText = nestedOutput || (data[0]?.output ? data[0].output : JSON.stringify(data));
            }

            // Cleanup: remove quotes if it looks like a stringified string "..."
            if (botText.startsWith('"') && botText.endsWith('"')) {
                botText = botText.slice(1, -1);
            }

            // Cleanup: Unescape newlines
            botText = botText.replace(/\\n/g, '\n');

            console.log("Extracted bot text:", botText);

            const botMsg: Message = {
                id: uuidv4(),
                sender: "bot",
                text: botText,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMsg]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, {
                id: uuidv4(),
                sender: "bot",
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        const welcomeMessage = {
            id: "welcome",
            sender: "bot" as const,
            text: userInfo
                ? `👋 Hi ${userInfo.name}! I'm Zoe, your AI travel assistant. How can I help you plan your perfect trip to Egypt?`
                : "👋 Hi! I'm Zoe, your AI travel assistant. How can I help you plan your perfect trip to Egypt?",
            timestamp: new Date()
        };

        setMessages([welcomeMessage]);
        localStorage.setItem("zoe_chat_messages", JSON.stringify([welcomeMessage])); // Clear localStorage too
        sessionStorage.setItem("zoe_chat_session", uuidv4()); // Reset session
    };

    const handleResetUserInfo = () => {
        setUserInfo(null);
        sessionStorage.removeItem("zoe_user_info");
        setFormData({ name: "", phone: "" });
        setFormErrors({ name: "", phone: "" });
        setShowContactForm(true);
        handleClearChat();
    };

    return (
        <>
            {/* Trigger Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110",
                    isOpen
                        ? "bg-gradient-to-r from-red-500 to-rose-600 rotate-0 scale-100"
                        : "bg-gradient-to-br from-primary via-primary/90 to-amber-600 hover:shadow-primary/50 hover:shadow-2xl"
                )}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <MessageSquare
                        className={cn(
                            "absolute h-8 w-8 text-white transition-all duration-500 ease-in-out",
                            isOpen ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"
                        )}
                    />
                    <X
                        className={cn(
                            "absolute h-8 w-8 text-white transition-all duration-500 ease-in-out",
                            isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"
                        )}
                    />
                </div>
                {/* Pulse animation when closed */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-amber-600 animate-ping opacity-20" />
                )}
            </Button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={cn(
                    "fixed z-50 bg-background/95 backdrop-blur-xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-500 ease-out",
                    "inset-0 rounded-none border-0",
                    "md:inset-auto md:bottom-24 md:right-6 md:w-[440px] md:h-[680px] md:rounded-3xl md:border-primary/20 md:slide-in-from-bottom-10 md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
                    "lg:w-[500px] lg:h-[730px]"
                )}>
                    {/* Header */}
                    <div className="p-4 sm:p-5 bg-gradient-to-br from-primary/15 via-primary/10 to-amber-500/15 border-b border-primary/20 flex items-center gap-3 shrink-0">
                        <div className="relative">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-primary via-primary/90 to-amber-600 rounded-2xl shadow-lg">
                                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        </div>
                        <div className="flex-1 flex items-center justify-between min-w-0">
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground text-base sm:text-lg truncate bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">Zoe Assistant</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Online • Ready to help
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClearChat}
                                    className="h-9 w-9 sm:h-10 sm:w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                    title="Clear Chat"
                                >
                                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-9 w-9 sm:h-10 sm:w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all md:hidden"
                                    title="Close Chat"
                                >
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    {showContactForm ? (
                        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-muted/30 to-muted/10 overflow-y-auto">
                            <div className="w-full max-w-sm space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                                <div className="text-center space-y-3 sm:space-y-4">
                                    <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary via-primary/90 to-amber-600 rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20">
                                        <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">Welcome to Zoe!</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground mt-2">Please share your contact details to get started</p>
                                    </div>
                                </div>

                                <form onSubmit={handleContactFormSubmit} className="space-y-4 sm:space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm sm:text-base font-medium text-foreground">
                                            Full Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                setFormErrors({ ...formErrors, name: "" });
                                            }}
                                            className={cn(
                                                "h-12 sm:h-13 text-base border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 rounded-xl transition-all",
                                                formErrors.name && "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive/50"
                                            )}
                                        />
                                        {formErrors.name && (
                                            <p className="text-xs sm:text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-destructive rounded-full" />
                                                {formErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm sm:text-base font-medium text-foreground">
                                            Phone Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+20 123 456 7890"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                setFormData({ ...formData, phone: e.target.value });
                                                setFormErrors({ ...formErrors, phone: "" });
                                            }}
                                            className={cn(
                                                "h-12 sm:h-13 text-base border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 rounded-xl transition-all",
                                                formErrors.phone && "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive/50"
                                            )}
                                        />
                                        {formErrors.phone && (
                                            <p className="text-xs sm:text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-destructive rounded-full" />
                                                {formErrors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 sm:h-13 text-base bg-gradient-to-br from-primary via-primary/90 to-amber-600 hover:from-primary/90 hover:to-amber-600/90 shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Start Chatting
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* User Info Badge */}
                            {userInfo && (
                                <div className="px-4 py-2.5 sm:py-3 bg-gradient-to-r from-primary/5 to-amber-500/5 border-b border-primary/15 flex items-center justify-between text-xs sm:text-sm shrink-0">
                                    <span className="text-muted-foreground truncate flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-amber-600" />
                                        Chatting as: <span className="font-semibold text-foreground bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">{userInfo.name}</span>
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResetUserInfo}
                                        className="h-7 sm:h-8 text-xs sm:text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                    >
                                        Change
                                    </Button>
                                </div>
                            )}

                            {/* Messages Area */}
                            <ScrollArea ref={scrollRef} className="flex-1 p-4 sm:p-5 bg-gradient-to-b from-muted/20 to-muted/10">
                                <div className="space-y-4 sm:space-y-5">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                                                msg.sender === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base shadow-md",
                                                msg.sender === "user"
                                                    ? "bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground rounded-br-2xl shadow-primary/20"
                                                    : "bg-card border border-primary/10 text-foreground rounded-bl-2xl shadow-sm"
                                            )}>
                                                {msg.sender === "bot" ? (
                                                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-2.5 prose-pre:rounded-lg prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {msg.text}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <div className="break-words font-medium">{msg.text}</div>
                                                )}
                                                <span className={cn(
                                                    "text-[10px] sm:text-xs block mt-1.5",
                                                    msg.sender === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-right"
                                                )}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="bg-card border border-primary/10 p-4 sm:p-5 rounded-2xl rounded-bl-2xl shadow-sm">
                                                <div className="flex gap-2 items-center h-full">
                                                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-amber-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-amber-600 rounded-full animate-bounce"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Quick Programs Access */}
                            {!isLoading && messages.length <= 2 && (
                                <div className="px-4 pb-3 sm:px-5 sm:pb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="bg-gradient-to-br from-primary/5 to-amber-500/5 rounded-2xl p-3 sm:p-4 border border-primary/10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            <span className="text-xs sm:text-sm font-semibold text-foreground">Quick Programs Access</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/programs" className="group">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full h-auto py-2.5 sm:py-3 px-3 flex flex-col items-center gap-1.5 border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all rounded-xl"
                                                >
                                                    <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:scale-110 transition-transform" />
                                                    <span className="text-[10px] sm:text-xs font-medium">All Programs</span>
                                                </Button>
                                            </Link>
                                            <Link href="/plan-your-trip" className="group">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full h-auto py-2.5 sm:py-3 px-3 flex flex-col items-center gap-1.5 border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all rounded-xl"
                                                >
                                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:scale-110 transition-transform" />
                                                    <span className="text-[10px] sm:text-xs font-medium">Plan Trip</span>
                                                </Button>
                                            </Link>
                                            <Link href="/placesTogo" className="group">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full h-auto py-2.5 sm:py-3 px-3 flex flex-col items-center gap-1.5 border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all rounded-xl"
                                                >
                                                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:scale-110 transition-transform" />
                                                    <span className="text-[10px] sm:text-xs font-medium">Places</span>
                                                </Button>
                                            </Link>
                                            <Link href="/compare" className="group">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full h-auto py-2.5 sm:py-3 px-3 flex flex-col items-center gap-1.5 border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all rounded-xl"
                                                >
                                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                    <span className="text-[10px] sm:text-xs font-medium">Compare</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Input Area */}
                            <div className="p-4 sm:p-5 border-t border-primary/10 bg-gradient-to-t from-background/80 to-background/50 backdrop-blur-sm shrink-0">
                                <form onSubmit={handleSendMessage} className="flex gap-3">
                                    <Input
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 h-12 sm:h-13 text-base rounded-2xl border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 bg-background/80 backdrop-blur-sm transition-all"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!inputValue.trim() || isLoading}
                                        className="h-12 w-12 sm:h-13 sm:w-13 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-amber-600 hover:from-primary/90 hover:to-amber-600/90 shadow-lg shadow-primary/20 shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 sm:h-6 sm:w-6" />}
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
