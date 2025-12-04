"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createGiftCard,
  validateGiftCard,
  checkGiftCardBalance,
  getPredefinedAmounts,
  formatGiftCardCode,
  GiftCard,
} from "@/lib/gift-cards";
import { Gift, CreditCard, Search, Check } from "lucide-react";
import { toast } from "sonner";

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [checkCode, setCheckCode] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [purchasedCard, setPurchasedCard] = useState<GiftCard | null>(null);

  const predefinedAmounts = getPredefinedAmounts();

  const handlePurchase = () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount < 25) {
      toast.error("Minimum gift card amount is $25");
      return;
    }

    if (amount > 5000) {
      toast.error("Maximum gift card amount is $5,000");
      return;
    }

    if (!recipientEmail || !recipientName || !senderName) {
      toast.error("Please fill in all required fields");
      return;
    }

    const giftCard = createGiftCard(amount, {
      recipientEmail,
      recipientName,
      senderName,
      message,
      expiryMonths: 12,
    });

    setPurchasedCard(giftCard);
    toast.success("Gift card created successfully!");

    // Reset form
    setSelectedAmount(null);
    setCustomAmount("");
    setRecipientEmail("");
    setRecipientName("");
    setSenderName("");
    setMessage("");
  };

  const handleCheckBalance = () => {
    if (!checkCode) {
      toast.error("Please enter a gift card code");
      return;
    }

    const validation = validateGiftCard(checkCode);

    if (!validation.isValid) {
      toast.error(validation.error || "Invalid gift card");
      setBalance(null);
      return;
    }

    const bal = checkGiftCardBalance(checkCode);
    setBalance(bal);
    toast.success("Gift card is valid!");
  };

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Gift className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2">Gift Cards</h1>
          <p className="text-muted-foreground">
            Give the gift of travel - perfect for any occasion
          </p>
        </div>

        <Tabs defaultValue="purchase" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchase">
              <Gift className="h-4 w-4 mr-2" />
              Purchase
            </TabsTrigger>
            <TabsTrigger value="check">
              <Search className="h-4 w-4 mr-2" />
              Check Balance
            </TabsTrigger>
          </TabsList>

          {/* Purchase Tab */}
          <TabsContent value="purchase" className="space-y-6">
            {!purchasedCard ? (
              <>
                {/* Select Amount */}
                <Card>
                  <CardHeader>
                    <CardTitle>1. Select Amount</CardTitle>
                    <CardDescription>Choose a preset amount or enter your own</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          className="h-20 text-xl font-bold"
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Or enter custom amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="customAmount"
                          type="number"
                          placeholder="25 - 5000"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                          className="pl-7"
                          min="25"
                          max="5000"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Minimum: $25 | Maximum: $5,000
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recipient Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>2. Recipient Details</CardTitle>
                    <CardDescription>Who is this gift card for?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Recipient Name *</Label>
                        <Input
                          id="recipientName"
                          placeholder="John Doe"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail">Recipient Email *</Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="senderName">Your Name *</Label>
                      <Input
                        id="senderName"
                        placeholder="Jane Smith"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Happy Birthday! Hope you have an amazing trip!"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Summary & Purchase */}
                <Card>
                  <CardHeader>
                    <CardTitle>3. Review & Purchase</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Gift Card Value:</span>
                        <span className="font-bold text-lg">${finalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Valid for:</span>
                        <span>12 months from purchase</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Can be used for any travel program</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Sent instantly via email</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>No expiration fees or hidden charges</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Transferable and reloadable</span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handlePurchase}
                      disabled={finalAmount < 25}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Purchase Gift Card - ${finalAmount.toFixed(2)}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Payment integration coming soon. This is a demo.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Success Screen */
              <Card className="border-green-500 border-2">
                <CardHeader className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Gift Card Created!</CardTitle>
                  <CardDescription>
                    Your gift card has been created and sent to {purchasedCard.recipientEmail}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-br from-primary to-primary/70 text-white p-6 rounded-lg space-y-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Gift Card Code</p>
                      <p className="text-2xl font-mono font-bold tracking-wider">
                        {formatGiftCardCode(purchasedCard.code)}
                      </p>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-white/20">
                      <div>
                        <p className="text-sm opacity-90">Balance</p>
                        <p className="text-xl font-bold">${purchasedCard.balance.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Expires</p>
                        <p className="text-sm font-semibold">
                          {new Date(purchasedCard.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="font-medium">{purchasedCard.recipientName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-medium">{purchasedCard.senderName}</span>
                    </div>
                    {purchasedCard.message && (
                      <div className="border-b pb-2">
                        <span className="text-muted-foreground">Message:</span>
                        <p className="mt-1 italic">{purchasedCard.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setPurchasedCard(null)}>
                      Create Another
                    </Button>
                    <Button className="flex-1">
                      Email Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Check Balance Tab */}
          <TabsContent value="check" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Check Gift Card Balance</CardTitle>
                <CardDescription>
                  Enter your gift card code to check the remaining balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="checkCode">Gift Card Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="checkCode"
                      placeholder="ZOEGIFT-XXXXXXXX-XX"
                      value={checkCode}
                      onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                    <Button onClick={handleCheckBalance}>
                      <Search className="h-4 w-4 mr-2" />
                      Check
                    </Button>
                  </div>
                </div>

                {balance !== null && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-800 font-medium">Available Balance</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                          ${balance.toFixed(2)}
                        </p>
                      </div>
                      <Check className="h-12 w-12 text-green-500" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How to Redeem */}
            <Card>
              <CardHeader>
                <CardTitle>How to Redeem</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>Browse and select your desired travel program</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>Enter your gift card code at checkout</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>The balance will be applied to your booking automatically</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>Any remaining balance stays on your gift card for future use</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
