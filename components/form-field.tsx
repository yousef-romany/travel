"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function FormField({ label, name, value, onChange, type = "text", required, placeholder }: any) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm font-medium text-primary">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="border-primary/30 text-primary
        focus-visible:ring-gold focus-visible:border-gold transition rounded-xl"
      />
    </div>
  )
}
