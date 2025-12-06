"use client";

import { useState, useEffect, useRef } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { createVote, updateVote, deleteVote, getUserVote, TestimonialVote } from "@/fetch/testimonial-votes";
import { toast } from "sonner";

interface HelpfulVotesProps {
  testimonialId: string;
  initialHelpful?: number;
  initialUnhelpful?: number;
  className?: string;
}

export default function HelpfulVotes({
  testimonialId,
  initialHelpful = 0,
  initialUnhelpful = 0,
  className = "",
}: HelpfulVotesProps) {
  const { user } = useAuth();
  const [helpful, setHelpful] = useState(initialHelpful);
  const [unhelpful, setUnhelpful] = useState(initialUnhelpful);
  const [userVote, setUserVote] = useState<"helpful" | "unhelpful" | null>(null);
  const [loading, setLoading] = useState(false);
  const isProcessing = useRef(false); // Prevent rapid clicks

  // Load user's existing vote from localStorage on mount
  useEffect(() => {
    if (!user?.documentId) return;

    const storageKey = `vote_${testimonialId}_${user.documentId}`;
    const savedVote = localStorage.getItem(storageKey);
    if (savedVote) {
      setUserVote(savedVote as "helpful" | "unhelpful");
    }
  }, [testimonialId, user]);

  const handleHelpful = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    if (loading || isProcessing.current) return;

    const storageKey = `vote_${testimonialId}_${user.documentId}`;

    // User already voted helpful - toggle off
    if (userVote === "helpful") {
      setHelpful(helpful - 1);
      setUserVote(null);
      localStorage.removeItem(storageKey);
      toast.success("Vote removed");
      return;
    }

    // User switching from unhelpful to helpful
    if (userVote === "unhelpful") {
      setUnhelpful(unhelpful - 1);
      setHelpful(helpful + 1);
      setUserVote("helpful");
      localStorage.setItem(storageKey, "helpful");
      toast.success("Changed to helpful");
      return;
    }

    // New vote
    setHelpful(helpful + 1);
    setUserVote("helpful");
    localStorage.setItem(storageKey, "helpful");
    toast.success("Marked as helpful");
  };

  const handleUnhelpful = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    if (loading || isProcessing.current) return;

    const storageKey = `vote_${testimonialId}_${user.documentId}`;

    // User already voted unhelpful - toggle off
    if (userVote === "unhelpful") {
      setUnhelpful(unhelpful - 1);
      setUserVote(null);
      localStorage.removeItem(storageKey);
      toast.success("Vote removed");
      return;
    }

    // User switching from helpful to unhelpful
    if (userVote === "helpful") {
      setHelpful(helpful - 1);
      setUnhelpful(unhelpful + 1);
      setUserVote("unhelpful");
      localStorage.setItem(storageKey, "unhelpful");
      toast.success("Changed to unhelpful");
      return;
    }

    // New vote
    setUnhelpful(unhelpful + 1);
    setUserVote("unhelpful");
    localStorage.setItem(storageKey, "unhelpful");
    toast.success("Marked as unhelpful");
  };

  const total = helpful + unhelpful;
  const percentage = total > 0 ? Math.round((helpful / total) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground mr-1">Was this helpful?</span>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleHelpful}
        disabled={loading}
        className={cn(
          "h-7 px-2 gap-1 text-xs",
          userVote === "helpful" && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
        )}
      >
        <ThumbsUp className={cn(
          "w-3 h-3",
          userVote === "helpful" && "fill-current"
        )} />
        {helpful > 0 && <span className="font-medium">{helpful}</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleUnhelpful}
        disabled={loading}
        className={cn(
          "h-7 px-2 gap-1 text-xs",
          userVote === "unhelpful" && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
        )}
      >
        <ThumbsDown className={cn(
          "w-3 h-3",
          userVote === "unhelpful" && "fill-current"
        )} />
        {unhelpful > 0 && <span className="font-medium">{unhelpful}</span>}
      </Button>

      {total > 0 && (
        <span className="text-xs text-muted-foreground ml-1">
          {percentage}% helpful
        </span>
      )}
    </div>
  );
}
