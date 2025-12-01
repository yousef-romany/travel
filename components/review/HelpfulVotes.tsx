"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [helpful, setHelpful] = useState(initialHelpful);
  const [unhelpful, setUnhelpful] = useState(initialUnhelpful);
  const [userVote, setUserVote] = useState<"helpful" | "unhelpful" | null>(null);

  const handleHelpful = () => {
    if (userVote === "helpful") {
      // Remove vote
      setHelpful(helpful - 1);
      setUserVote(null);
    } else if (userVote === "unhelpful") {
      // Switch vote
      setUnhelpful(unhelpful - 1);
      setHelpful(helpful + 1);
      setUserVote("helpful");
    } else {
      // New vote
      setHelpful(helpful + 1);
      setUserVote("helpful");
    }

    // TODO: Save to backend
    // saveVote(testimonialId, "helpful");
  };

  const handleUnhelpful = () => {
    if (userVote === "unhelpful") {
      // Remove vote
      setUnhelpful(unhelpful - 1);
      setUserVote(null);
    } else if (userVote === "helpful") {
      // Switch vote
      setHelpful(helpful - 1);
      setUnhelpful(unhelpful + 1);
      setUserVote("unhelpful");
    } else {
      // New vote
      setUnhelpful(unhelpful + 1);
      setUserVote("unhelpful");
    }

    // TODO: Save to backend
    // saveVote(testimonialId, "unhelpful");
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
