"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, Loader2, Bot, User, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
    id: string;
    sender: "user" | "bot";
    text: string;
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "bot",
            text: "👋 Hi! I'm Zoe, your AI travel assistant. How can I help you plan your perfect trip to Egypt?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize Session
    useEffect(() => {
        if (!sessionStorage.getItem("zoe_chat_session")) {
            sessionStorage.setItem("zoe_chat_session", uuidv4());
        }
    }, []);

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
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

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
                    session: session
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();

            // Handle n8n response structure. Assuming { output: "text" } or check actual response
            // Commonly n8n webhook response node returns array or object.
            // We'll try to find a text field. If it returns simple text in body, great.
            // Adjust this based on actual n8n output.
            // Defaulting to assuming 'output' or 'text' property or just the whole body if string.

            let botText = "Sorry, I didn't catch that.";

            if (typeof data === 'string') botText = data;
            else if (data.output) botText = data.output;
            else if (data.text) botText = data.text;
            else if (data.message) botText = data.message;
            else if (data.response) botText = data.response;
            else if (Array.isArray(data) && data[0]?.output) botText = data[0].output;
            else botText = JSON.stringify(data); // Fallback debug

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
        setMessages([
            {
                id: "welcome",
                sender: "bot",
                text: "👋 Hi! I'm Zoe, your AI travel assistant. How can I help you plan your perfect trip to Egypt?",
                timestamp: new Date()
            }
        ]);
        sessionStorage.setItem("zoe_chat_session", uuidv4()); // Reset session
    };

    return (
        <>
            {/* Trigger Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "fixed bottom-4 right-6 z-50 h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
                    isOpen ? "bg-destructive rotate-90" : "bg-gradient-to-r from-primary to-amber-600 animate-in zoom-in slide-in-from-bottom-5"
                )}
            >
                {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-7 w-7 text-white" />}
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[500px] md:h-[600px] bg-background border border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-amber-500/10 border-b border-primary/10 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-primary to-amber-600 rounded-full">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-foreground">Zoe Assistant</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Online
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClearChat}
                                className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive"
                                title="Clear Chat"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-muted/20">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full",
                                        msg.sender === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                                        msg.sender === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-card border border-primary/10 text-foreground rounded-bl-none"
                                    )}>
                                        {msg.sender === "bot" ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-2 prose-pre:rounded-lg">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.text
                                        )}
                                        <span className="text-[10px] opacity-70 block mt-1 text-right">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-card border border-primary/10 p-4 rounded-2xl rounded-bl-none shadow-sm">
                                        <div className="flex gap-1.5 items-center h-full">
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-background/50 backdrop-blur-sm">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 rounded-full border-primary/20 focus-visible:ring-primary/30"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!inputValue.trim() || isLoading}
                                className="rounded-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
