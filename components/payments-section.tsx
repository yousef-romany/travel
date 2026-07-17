"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInvoices, type InvoiceType } from "@/fetch/invoices";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Wallet,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMoney(amount: number) {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusPill({ status }: { status: string }) {
  const cfg = {
    paid:      { icon: CheckCircle2, label: "Paid",      cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    pending:   { icon: Clock,        label: "Pending",   cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    cancelled: { icon: XCircle,      label: "Cancelled", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  }[status] ?? { icon: AlertCircle, label: status, cls: "bg-muted text-muted-foreground border-border" };

  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

function BookingTypePill({ type }: { type?: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    program:     { label: "Program",      cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    "custom-trip": { label: "Custom Trip", cls: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    event:       { label: "Event",        cls: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  };
  const cfg = map[type ?? "program"] ?? map["program"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <Card className="border border-border/50 bg-card overflow-hidden group hover:border-primary/30 transition-all duration-300">
      <CardContent className="pt-5 pb-5 px-5 relative">
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient}`}
        />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {sub && (
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            )}
          </div>
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 flex-shrink-0">
            <Icon className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Payment Row ──────────────────────────────────────────────────────────────

function PaymentRow({ invoice }: { invoice: InvoiceType }) {
  const hasDiscount =
    invoice.booking?.discountAmount && invoice.booking.discountAmount > 0;
  const original = hasDiscount
    ? (invoice.totalAmount ?? 0) + (invoice.booking!.discountAmount ?? 0)
    : invoice.totalAmount;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="p-2.5 bg-muted rounded-xl flex-shrink-0">
          <ReceiptText className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 transition-colors" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-semibold text-foreground text-sm truncate">
              {invoice.tripName || "Trip Booking"}
            </p>
            <BookingTypePill type={invoice.bookingType} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>#{invoice.invoiceNumber}</span>
            <span>·</span>
            <span>{formatDate(invoice.createdAt)}</span>
            <span>·</span>
            <span>{invoice.numberOfTravelers} traveler{invoice.numberOfTravelers !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 justify-between sm:justify-end">
        <div className="text-right">
          {hasDiscount && (
            <p className="text-xs text-muted-foreground line-through">
              {formatMoney(original ?? 0)}
            </p>
          )}
          <p className={`font-bold text-base ${hasDiscount ? "text-emerald-400" : "text-foreground"}`}>
            {formatMoney(invoice.totalAmount)}
          </p>
          {hasDiscount && (
            <p className="text-xs text-emerald-400 font-medium">
              -{formatMoney(invoice.booking!.discountAmount!)} saved
            </p>
          )}
        </div>
        <StatusPill status={invoice.invoiceStatus} />
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-amber-400 p-1.5 opacity-0 group-hover:opacity-100 transition-all"
          asChild
        >
          <Link href={`/invoices/${invoice.documentId}`} target="_blank">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PaymentsSection() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "cancelled">("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userInvoices", user?.documentId],
    queryFn: () => fetchUserInvoices(user?.documentId, user?.token),
    enabled: !!user?.documentId,
    staleTime: 2 * 60 * 1000,
  });

  const invoices: InvoiceType[] = data?.data ?? [];

  const totalPaid = invoices
    .filter((i) => i.invoiceStatus === "paid")
    .reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const totalPending = invoices
    .filter((i) => i.invoiceStatus === "pending")
    .reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const totalSaved = invoices
    .reduce((s, i) => s + (i.booking?.discountAmount ?? 0), 0);

  const filtered =
    filter === "all" ? invoices : invoices.filter((i) => i.invoiceStatus === filter);

  const filterOptions: { id: typeof filter; label: string }[] = [
    { id: "all",       label: `All (${invoices.length})` },
    { id: "paid",      label: `Paid (${invoices.filter((i) => i.invoiceStatus === "paid").length})` },
    { id: "pending",   label: `Pending (${invoices.filter((i) => i.invoiceStatus === "pending").length})` },
    { id: "cancelled", label: `Cancelled (${invoices.filter((i) => i.invoiceStatus === "cancelled").length})` },
  ];

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-lg font-semibold">Failed to load payments</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────────
  if (invoices.length === 0) {
    return (
      <Card className="border border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="p-5 bg-amber-500/10 rounded-full border border-amber-500/20">
            <Wallet className="w-10 h-10 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold">No Payments Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Your payment history will appear here once you've completed a
            booking.
          </p>
          <Button asChild>
            <Link href="/programs">Browse Programs</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-card-enter">
        <SummaryCard
          label="Total Paid"
          value={formatMoney(totalPaid)}
          sub={`${invoices.filter((i) => i.invoiceStatus === "paid").length} confirmed payments`}
          icon={CheckCircle2}
          gradient="bg-gradient-to-br from-emerald-500/5 to-transparent"
        />
        <SummaryCard
          label="Pending"
          value={formatMoney(totalPending)}
          sub={`${invoices.filter((i) => i.invoiceStatus === "pending").length} awaiting payment`}
          icon={Clock}
          gradient="bg-gradient-to-br from-amber-500/5 to-transparent"
        />
        <SummaryCard
          label="Total Saved"
          value={formatMoney(totalSaved)}
          sub="via discounts & promo codes"
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-blue-500/5 to-transparent"
        />
      </div>

      {/* Pending payment banner */}
      {totalPending > 0 && (
        <Card className="border border-amber-500/30 bg-amber-500/5 animate-slide-up">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  You have {formatMoney(totalPending)} in pending payments
                </p>
                <p className="text-xs text-muted-foreground">
                  Complete your payment to confirm your bookings
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold flex-shrink-0"
              onClick={() => setFilter("pending")}
            >
              View Pending
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment list */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Payment History</CardTitle>
              <CardDescription>
                {filtered.length} {filtered.length === 1 ? "transaction" : "transactions"}
              </CardDescription>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFilter(opt.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    filter === opt.id
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      : "text-muted-foreground border-border/50 hover:border-amber-500/30 hover:text-amber-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No {filter !== "all" ? filter : ""} payments found.
            </div>
          ) : (
            filtered.map((invoice) => (
              <PaymentRow key={invoice.id} invoice={invoice} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Security note */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border/50">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          All payments are processed securely via PayPal. Zoe Holidays never
          stores your card details.
        </p>
      </div>
    </div>
  );
}
