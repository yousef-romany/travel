"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InsuranceOption {
  id: string;
  name: string;
  description: string;
  coverage: string[];
  price: number;
  recommended?: boolean;
}

const insuranceOptions: InsuranceOption[] = [
  {
    id: "basic",
    name: "Basic Coverage",
    description: "Essential protection for your trip",
    coverage: [
      "Trip cancellation up to $5,000",
      "Medical emergencies up to $50,000",
      "Lost luggage up to $1,000",
      "24/7 emergency assistance",
    ],
    price: 49,
  },
  {
    id: "standard",
    name: "Standard Coverage",
    description: "Comprehensive protection with additional benefits",
    coverage: [
      "Trip cancellation up to $10,000",
      "Medical emergencies up to $100,000",
      "Lost luggage up to $2,500",
      "Trip delay coverage",
      "Emergency evacuation",
      "24/7 emergency assistance",
    ],
    price: 89,
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium Coverage",
    description: "Maximum protection for complete peace of mind",
    coverage: [
      "Trip cancellation up to $25,000",
      "Medical emergencies up to $250,000",
      "Lost luggage up to $5,000",
      "Trip delay & interruption coverage",
      "Emergency evacuation & repatriation",
      "Cancel for any reason (CFAR)",
      "Adventure sports coverage",
      "24/7 premium concierge service",
    ],
    price: 149,
  },
];

interface TravelInsuranceProps {
  tripPrice: number;
  onInsuranceSelected: (option: InsuranceOption | null) => void;
}

export function TravelInsurance({ tripPrice, onInsuranceSelected }: TravelInsuranceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);

  const handleSelectOption = (optionId: string) => {
    const option = insuranceOptions.find((opt) => opt.id === optionId);
    if (option) {
      setSelectedOption(optionId);
      setDeclined(false);
      onInsuranceSelected(option);
    }
  };

  const handleDecline = (checked: boolean) => {
    setDeclined(checked);
    if (checked) {
      setSelectedOption(null);
      onInsuranceSelected(null);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Protect Your Trip</CardTitle>
          </div>
          <Badge variant="secondary">Optional</Badge>
        </div>
        <CardDescription>
          Add comprehensive travel insurance for unexpected events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {insuranceOptions.map((option) => (
            <div
              key={option.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOption === option.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50"
              } ${option.recommended ? "ring-2 ring-primary/20" : ""}`}
              onClick={() => handleSelectOption(option.id)}
            >
              {option.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Recommended
                </Badge>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="insurance"
                    checked={selectedOption === option.id}
                    onChange={() => handleSelectOption(option.id)}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <h4 className="font-semibold">{option.name}</h4>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{option.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p className="text-2xl font-bold text-primary mb-3">
                ${option.price}
              </p>

              <ul className="space-y-2 text-sm">
                {option.coverage.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
                {option.coverage.length > 3 && (
                  <li className="text-xs text-primary font-medium pl-6">
                    +{option.coverage.length - 3} more benefits
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Decline Insurance Option */}
        <div className="flex items-center space-x-2 pt-4 border-t">
          <Checkbox
            id="decline-insurance"
            checked={declined}
            onCheckedChange={handleDecline}
          />
          <label
            htmlFor="decline-insurance"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            I understand the risks and decline travel insurance
          </label>
        </div>

        {/* Summary */}
        {selectedOption && (
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">
                    {insuranceOptions.find((opt) => opt.id === selectedOption)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Coverage selected
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-primary">
                +${insuranceOptions.find((opt) => opt.id === selectedOption)?.price}
              </p>
            </div>
          </div>
        )}

        {/* Information Notice */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <p className="font-medium mb-1">Why choose travel insurance?</p>
          <p>
            Travel insurance provides financial protection against unforeseen circumstances
            such as trip cancellations, medical emergencies, lost luggage, and more. It's a
            small price for peace of mind during your travels.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
