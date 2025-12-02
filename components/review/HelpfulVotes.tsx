"use client";

import { useState, useEffect } from "react";
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
  const [userVote, setUserVote] = useState<TestimonialVote | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user's existing vote on mount
  useEffect(() => {
    if (!user?.documentId) return;

    const loadUserVote = async () => {
      try {
        const vote = await getUserVote(testimonialId, user.documentId!);
        if (vote) {
          setUserVote(vote);
        }
      } catch (error) {
        console.error("Error loading user vote:", error);
      }
    };

    loadUserVote();
  }, [testimonialId, user]);

  const handleHelpful = async () => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    if (loading) return;
    setLoading(true);

    const previousVote = userVote;
    const previousHelpful = helpful;
    const previousUnhelpful = unhelpful;

    try {
      // Optimistic update
      if (userVote?.voteType === "helpful") {
        // Toggle off
        setHelpful(helpful - 1);
        setUserVote(null);
        await deleteVote(userVote.documentId);
      } else if (userVote?.voteType === "unhelpful") {
        // Switch from unhelpful to helpful
        setUnhelpful(unhelpful - 1);
        setHelpful(helpful + 1);
        const newVote = await updateVote(userVote.documentId, "helpful");
        setUserVote(newVote);
      } else {
        // Create new helpful vote
        setHelpful(helpful + 1);
        const newVote = await createVote(testimonialId, user.documentId!, "helpful");
        setUserVote(newVote);
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to save your vote. Please try again.");

      // Revert on error
      setUserVote(previousVote);
      setHelpful(previousHelpful);
      setUnhelpful(previousUnhelpful);
    } finally {
      setLoading(false);
    }
  };

  const handleUnhelpful = async () => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    if (loading) return;
    setLoading(true);

    const previousVote = userVote;
    const previousHelpful = helpful;
    const previousUnhelpful = unhelpful;

    try {
      // Optimistic update
      if (userVote?.voteType === "unhelpful") {
        // Toggle off
        setUnhelpful(unhelpful - 1);
        setUserVote(null);
        await deleteVote(userVote.documentId);
      } else if (userVote?.voteType === "helpful") {
        // Switch from helpful to unhelpful
        setHelpful(helpful - 1);
        setUnhelpful(unhelpful + 1);
        const newVote = await updateVote(userVote.documentId, "unhelpful");
        setUserVote(newVote);
      } else {
        // Create new unhelpful vote
        setUnhelpful(unhelpful + 1);
        const newVote = await createVote(testimonialId, user.documentId!, "unhelpful");
        setUserVote(newVote);
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to save your vote. Please try again.");

      // Revert on error
      setUserVote(previousVote);
      setHelpful(previousHelpful);
      setUnhelpful(previousUnhelpful);
    } finally {
      setLoading(false);
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
        className={cn(
          "h-7 px-2 gap-1 text-xs",
          userVote?.voteType === "helpful" && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
        )}
      >
        <ThumbsUp className={cn(
          "w-3 h-3",
          userVote?.voteType === "helpful" && "fill-current"
        )} />
        {helpful > 0 && <span className="font-medium">{helpful}</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleUnhelpful}
        className={cn(
          "h-7 px-2 gap-1 text-xs",
          userVote?.voteType === "unhelpful" && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
        )}
      >
        <ThumbsDown className={cn(
          "w-3 h-3",
          userVote?.voteType === "unhelpful" && "fill-current"
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
