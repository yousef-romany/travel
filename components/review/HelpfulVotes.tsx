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
  const [userVoteId, setUserVoteId] = useState<string | null>(null); // Track vote document ID
  const [loading, setLoading] = useState(false);
  const isProcessing = useRef(false); // Prevent rapid clicks

  // Load user's existing vote from database on mount
  useEffect(() => {
    if (!user?.documentId) return;

    const loadUserVote = async () => {
      try {
        setLoading(true);
        const existingVote = await getUserVote(testimonialId, user.documentId!);
        if (existingVote) {
          setUserVote(existingVote.voteType);
          setUserVoteId(existingVote.documentId);
          // Sync with localStorage for offline fallback
          const storageKey = `vote_${testimonialId}_${user.documentId}`;
          localStorage.setItem(storageKey, existingVote.voteType);
        }
      } catch (error) {
        console.error("Error loading user vote:", error);
        // Fallback to localStorage if database fails
        const storageKey = `vote_${testimonialId}_${user.documentId}`;
        const savedVote = localStorage.getItem(storageKey);
        if (savedVote) {
          setUserVote(savedVote as "helpful" | "unhelpful");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserVote();
  }, [testimonialId, user]);

  const handleHelpful = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    if (loading || isProcessing.current) return;

    isProcessing.current = true;
    setLoading(true);

    const storageKey = `vote_${testimonialId}_${user.documentId}`;

    try {
      // User already voted helpful - remove vote
      if (userVote === "helpful" && userVoteId) {
        await deleteVote(userVoteId);
        setHelpful(helpful - 1);
        setUserVote(null);
        setUserVoteId(null);
        localStorage.removeItem(storageKey);
        toast.success("Vote removed");
        return;
      }

      // User switching from unhelpful to helpful
      if (userVote === "unhelpful" && userVoteId) {
        await updateVote(userVoteId, "helpful");
        setUnhelpful(unhelpful - 1);
        setHelpful(helpful + 1);
        setUserVote("helpful");
        localStorage.setItem(storageKey, "helpful");
        toast.success("Changed to helpful");
        return;
      }

      // New vote
      const newVote = await createVote(testimonialId, user.documentId!, "helpful");
      setHelpful(helpful + 1);
      setUserVote("helpful");
      setUserVoteId(newVote.documentId);
      localStorage.setItem(storageKey, "helpful");
      toast.success("Marked as helpful");
    } catch (error: any) {
      console.error("Error handling helpful vote:", error);
      toast.error(error.message || "Failed to save vote. Please try again.");
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  const handleUnhelpful = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    if (loading || isProcessing.current) return;

    isProcessing.current = true;
    setLoading(true);

    const storageKey = `vote_${testimonialId}_${user.documentId}`;

    try {
      // User already voted unhelpful - remove vote
      if (userVote === "unhelpful" && userVoteId) {
        await deleteVote(userVoteId);
        setUnhelpful(unhelpful - 1);
        setUserVote(null);
        setUserVoteId(null);
        localStorage.removeItem(storageKey);
        toast.success("Vote removed");
        return;
      }

      // User switching from helpful to unhelpful
      if (userVote === "helpful" && userVoteId) {
        await updateVote(userVoteId, "unhelpful");
        setHelpful(helpful - 1);
        setUnhelpful(unhelpful + 1);
        setUserVote("unhelpful");
        localStorage.setItem(storageKey, "unhelpful");
        toast.success("Changed to unhelpful");
        return;
      }

      // New vote
      const newVote = await createVote(testimonialId, user.documentId!, "unhelpful");
      setUnhelpful(unhelpful + 1);
      setUserVote("unhelpful");
      setUserVoteId(newVote.documentId);
      localStorage.setItem(storageKey, "unhelpful");
      toast.success("Marked as unhelpful");
    } catch (error: any) {
      console.error("Error handling unhelpful vote:", error);
      toast.error(error.message || "Failed to save vote. Please try again.");
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
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
