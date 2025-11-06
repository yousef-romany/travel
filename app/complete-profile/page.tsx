"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, ArrowLeft } from "lucide-react"

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // حماية الصفحة
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) window.location.href = "/login"
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) return (window.location.href = "/login")

      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/profile/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Server Error")

      setSuccess(true)
      setTimeout(() => (window.location.href = "/dashboard"), 2000)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = Object.values(formData).every((v) => v.trim() !== "")

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 px-4">
        <div className="bg-white border border-amber-200 p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <CheckCircle size={42} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-amber-900">Profile Completed!</p>
          <p className="text-amber-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

          <div className="text-center mb-10">
            <div className="inline-block px-4 py-2 bg-amber-100 border border-amber-200 rounded-full text-amber-900 font-semibold">
              ZOE HOLIDAYS
            </div>
            <h1 className="text-3xl font-bold mt-4 text-amber-950">Complete Your Profile</h1>
            <p className="text-amber-700">To activate your travel account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Personal */}
            <section>
              <h2 className="section-title">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input" required />
                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="input" required />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="input" required />
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input" required />
                <input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" className="input" required />
              </div>
            </section>

            {/* Passport */}
            <section>
              <h2 className="section-title">Passport Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <input name="passportNumber" value={formData.passportNumber} onChange={handleChange} placeholder="Passport Number" className="input" required />
                <input type="date" name="passportExpiry" value={formData.passportExpiry} onChange={handleChange} className="input" required />
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="section-title">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" className="input md:col-span-2" required />
                <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="input" required />
                <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="input" required />
                <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" className="input" required />
              </div>
            </section>

            {/* Emergency */}
            <section>
              <h2 className="section-title">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Contact Name" className="input" required />
                <input name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} placeholder="Contact Phone" className="input" required />
              </div>
            </section>

            <button type="submit" disabled={!isFormValid || loading} className="btn-primary w-full">
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </form>

          <Link href="/signup" className="flex items-center justify-center mt-6 text-amber-600 font-medium">
            <ArrowLeft size={16} className="mr-1" /> Back to Signup
          </Link>
        </div>
      </div>
    </div>
  )
}
