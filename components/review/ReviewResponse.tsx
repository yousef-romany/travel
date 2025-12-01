"use client";

import { useState } from "react";
import { MessageCircle, Send, Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

interface ReviewResponseProps {
  testimonialId: string;
  existingResponse?: {
    text: string;
    author: string;
    createdAt: string;
  };
  canRespond?: boolean; // Only admins/business owners
}

export default function ReviewResponse({
  testimonialId,
  existingResponse,
  canRespond = false,
}: ReviewResponseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [responseText, setResponseText] = useState(existingResponse?.text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      toast.error("Please write a response");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Save response to backend
      // await saveResponse(testimonialId, responseText);

      toast.success("Response posted successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to post response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this response?")) return;

    try {
      // TODO: Delete from backend
      // await deleteResponse(testimonialId);

      toast.success("Response deleted");
      setResponseText("");
    } catch (error) {
      toast.error("Failed to delete response");
    }
  };

  if (existingResponse && !isEditing) {
    return (
      <Card className="mt-4 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">
                <MessageCircle className="w-3 h-3 mr-1" />
                Business Response
              </Badge>
              <span className="text-xs text-muted-foreground">
                by {existingResponse.author}
              </span>
            </div>
            {canRespond && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 px-2"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-7 px-2 text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-2">
            {existingResponse.text}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(existingResponse.createdAt), "MMM dd, yyyy")}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!canRespond && !existingResponse) {
    return null;
  }

  return (
    <Card className="mt-4 border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">
            {existingResponse ? "Edit Response" : "Respond to Review"}
          </span>
        </div>

        <Textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Thank the reviewer and address their feedback..."
          rows={4}
          className="mb-3 resize-none"
        />

        <div className="flex justify-end gap-2">
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setResponseText(existingResponse?.text || "");
              }}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || !responseText.trim()}
            className="gap-1"
          >
            {isSubmitting ? (
              <>
                <Send className="w-4 h-4 animate-pulse" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post Response
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          💡 Tip: Be professional, thank the reviewer, and address their concerns
        </p>
      </CardContent>
    </Card>
  );
}
