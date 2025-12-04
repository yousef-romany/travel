"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Facebook, Twitter, Mail, Linkedin, MessageCircle, Link2, Check } from "lucide-react";
import { toast } from "sonner";
import {
  ShareOptions,
  ShareConfig,
  shareOnFacebook,
  shareOnTwitter,
  shareOnWhatsApp,
  shareOnLinkedIn,
  shareViaEmail,
  copyLinkToClipboard,
  isWebShareSupported,
  shareNative,
} from "@/lib/social-sharing";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  shareOptions: ShareOptions;
  shareConfig: ShareConfig;
  variant?: "button" | "dropdown" | "dialog";
  className?: string;
  showStats?: boolean;
  shareCount?: number;
}

export function ShareButtons({
  shareOptions,
  shareConfig,
  variant = "dropdown",
  className,
  showStats = false,
  shareCount = 0,
}: ShareButtonsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleNativeShare = async () => {
    const success = await shareNative(shareOptions);
    if (success) {
      toast.success("Shared successfully!");
    }
  };

  const handleCopyLink = async () => {
    const success = await copyLinkToClipboard(shareOptions.url, shareConfig);
    if (success) {
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast.error("Failed to copy link");
    }
  };

  const shareButtons = [
    {
      platform: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-50 hover:text-blue-600",
      action: () => shareOnFacebook(shareOptions, shareConfig),
    },
    {
      platform: "twitter",
      label: "Twitter",
      icon: Twitter,
      color: "hover:bg-sky-50 hover:text-sky-500",
      action: () => shareOnTwitter(shareOptions, shareConfig),
    },
    {
      platform: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-green-50 hover:text-green-600",
      action: () => shareOnWhatsApp(shareOptions, shareConfig),
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      color: "hover:bg-blue-50 hover:text-blue-700",
      action: () => shareOnLinkedIn(shareOptions, shareConfig),
    },
    {
      platform: "email",
      label: "Email",
      icon: Mail,
      color: "hover:bg-red-50 hover:text-red-600",
      action: () => shareViaEmail(shareOptions, shareConfig),
    },
  ];

  // Dropdown variant
  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
            {showStats && shareCount > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">({shareCount})</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {isWebShareSupported() && (
            <>
              <DropdownMenuItem onClick={handleNativeShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {shareButtons.map((button) => (
            <DropdownMenuItem
              key={button.platform}
              onClick={button.action}
              className={cn("cursor-pointer", button.color)}
            >
              <button.icon className="h-4 w-4 mr-2" />
              {button.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Dialog variant
  if (variant === "dialog") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className={className}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share this {shareConfig.contentType}</DialogTitle>
              <DialogDescription>
                Choose how you want to share "{shareConfig.contentTitle}"
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {isWebShareSupported() && (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      handleNativeShare();
                      setIsDialogOpen(false);
                    }}
                  >
                    <Share2 className="h-5 w-5 mr-3" />
                    Share via...
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or share on</span>
                    </div>
                  </div>
                </>
              )}

              {shareButtons.map((button) => (
                <Button
                  key={button.platform}
                  variant="outline"
                  className={cn("w-full justify-start", button.color)}
                  onClick={() => {
                    button.action();
                    setIsDialogOpen(false);
                  }}
                >
                  <button.icon className="h-5 w-5 mr-3" />
                  Share on {button.label}
                </Button>
              ))}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCopyLink}
              >
                {isCopied ? (
                  <>
                    <Check className="h-5 w-5 mr-3 text-green-600" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="h-5 w-5 mr-3" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            {showStats && shareCount > 0 && (
              <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                Shared {shareCount} {shareCount === 1 ? "time" : "times"}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Button group variant
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isWebShareSupported() && (
        <Button variant="outline" size="sm" onClick={handleNativeShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      )}

      {shareButtons.map((button) => (
        <Button
          key={button.platform}
          variant="outline"
          size="sm"
          onClick={button.action}
          className={button.color}
          title={`Share on ${button.label}`}
        >
          <button.icon className="h-4 w-4" />
        </Button>
      ))}

      <Button variant="outline" size="sm" onClick={handleCopyLink} title="Copy Link">
        {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      </Button>

      {showStats && shareCount > 0 && (
        <span className="text-sm text-muted-foreground ml-2">
          {shareCount} {shareCount === 1 ? "share" : "shares"}
        </span>
      )}
    </div>
  );
}

/**
 * Compact share button (icon only)
 */
export function ShareButtonCompact({
  shareOptions,
  shareConfig,
  className,
}: Omit<ShareButtonsProps, "variant">) {
  return (
    <ShareButtons
      shareOptions={shareOptions}
      shareConfig={shareConfig}
      variant="dropdown"
      className={className}
    />
  );
}

/**
 * Share button with full dialog
 */
export function ShareButtonDialog({
  shareOptions,
  shareConfig,
  showStats,
  shareCount,
  className,
}: Omit<ShareButtonsProps, "variant">) {
  return (
    <ShareButtons
      shareOptions={shareOptions}
      shareConfig={shareConfig}
      variant="dialog"
      showStats={showStats}
      shareCount={shareCount}
      className={className}
    />
  );
}
