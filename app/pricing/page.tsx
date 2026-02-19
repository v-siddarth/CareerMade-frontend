"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CreditCard, Landmark, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import { authStorage } from "@/lib/api-client";
import { createPricingNotificationEvent } from "@/lib/notifications-client";

type Audience = "employer" | "jobseeker";
type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

type PricingPlan = {
  id: string;
  audience: Audience;
  displayName: string;
  price: number;
  description: string;
  tag?: string;
  ctaLabel?: string;
  highlighted?: boolean;
  featureList: string[];
  isActive?: boolean;
};

type UserRole = "jobseeker" | "employer" | "admin";

const audienceLabel: Record<Audience, string> = {
  employer: "Employer",
  jobseeker: "Job Seeker",
};

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [audience, setAudience] = useState<Audience>("employer");
  const [lockedAudience, setLockedAudience] = useState<Audience | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [method, setMethod] = useState<PaymentMethod>("card");

  useEffect(() => {
    const user = authStorage.getUser<{ role?: UserRole }>();
    let roleAudience: Audience | null = null;
    if (user?.role === "jobseeker") roleAudience = "jobseeker";
    if (user?.role === "employer") roleAudience = "employer";
    if (roleAudience) {
      setAudience(roleAudience);
      setLockedAudience(roleAudience);
    }
    fetchPlans(roleAudience || undefined);
  }, []);

  const fetchPlans = async (preferredAudience?: Audience) => {
    try {
      setLoading(true);
      const token = authStorage.getAccessToken();
      const audienceParam = preferredAudience || lockedAudience;
      const query = new URLSearchParams();
      if (audienceParam) query.set("audience", audienceParam);
      query.set("t", Date.now().toString());
      const pricingUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/pricing/plans?${query.toString()}`;
      const res = await fetch(
        pricingUrl,
        {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch pricing plans");
      }

      const allPlans = (data.data.plans || []) as PricingPlan[];
      const activePlans = allPlans.filter((plan) => plan.isActive !== false);
      setPlans(activePlans);

      const currentAudience = preferredAudience || lockedAudience || audience;
      const defaults = activePlans.filter((plan) => plan.audience === currentAudience);
      const defaultSelected = defaults.find((plan) => plan.highlighted) || defaults[0] || activePlans[0];
      if (defaultSelected) setSelectedPlanId(defaultSelected.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load pricing";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = useMemo(
    () => plans.filter((plan) => plan.audience === audience),
    [plans, audience]
  );

  useEffect(() => {
    if (!filteredPlans.find((plan) => plan.id === selectedPlanId)) {
      const fallback = filteredPlans.find((plan) => plan.highlighted) || filteredPlans[0];
      setSelectedPlanId(fallback?.id || "");
    }
  }, [filteredPlans, selectedPlanId]);

  const selectedPlan = useMemo(
    () => filteredPlans.find((plan) => plan.id === selectedPlanId) || filteredPlans[0],
    [filteredPlans, selectedPlanId]
  );

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) return;
    createPricingNotificationEvent({ eventType: "view_pricing" }).catch(() => {});
  }, []);

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlanId(plan.id);
    const token = authStorage.getAccessToken();
    if (!token) return;
    createPricingNotificationEvent({
      eventType: "select_plan",
      planId: plan.id,
      planName: plan.displayName,
    }).catch(() => {});
  };

  const handleCheckout = () => {
    if (!selectedPlan) return;
    const token = authStorage.getAccessToken();
    if (token) {
      createPricingNotificationEvent({
        eventType: "checkout_intent",
        planId: selectedPlan.id,
        planName: selectedPlan.displayName,
      }).catch(() => {});
    }
    toast.success("Checkout flow placeholder is ready. Payment gateway can be connected next.");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/60 to-white">
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Dynamic Pricing Plans
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose a Plan Built for
              <span className="bg-gradient-to-r from-[#155DFC] to-[#00B8DB] bg-clip-text text-transparent">
                {" "}{audienceLabel[audience]}
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">Choose the plan that fits your account type and goals.</p>
          </div>

          {!lockedAudience ? (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                {(["employer", "jobseeker"] as Audience[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      audience === a
                        ? "bg-gradient-to-r from-[#155DFC] to-[#00B8DB] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {audienceLabel[a]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 text-center text-sm text-gray-500">
              Showing {audienceLabel[lockedAudience]} plans for your account.
            </p>
          )}

          {loading ? (
            <div className="mt-16 text-center text-gray-500">Loading pricing plans...</div>
          ) : (
            <>
              <div className="mt-14 grid gap-6 lg:grid-cols-3">
                {filteredPlans.map((plan) => {
                  const active = selectedPlanId === plan.id;
                  return (
                    <article
                      key={plan.id}
                      className={`relative rounded-3xl border bg-white p-7 shadow-sm transition-all duration-300 ${
                        plan.highlighted
                          ? "border-blue-200 shadow-lg shadow-blue-100"
                          : "border-gray-200 hover:-translate-y-1 hover:shadow-md"
                      } ${active ? "ring-2 ring-blue-400" : ""}`}
                    >
                      {plan.highlighted && (
                        <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-3 py-1 text-xs font-semibold text-white">
                          Popular
                        </span>
                      )}
                      <p className="text-sm font-semibold text-blue-700">{plan.tag || ""}</p>
                      <h2 className="mt-2 text-2xl font-bold text-gray-900">{plan.displayName}</h2>
                      <div className="mt-4 flex items-end gap-1">
                        <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                        <span className="pb-1 text-sm text-gray-500">/month</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">{plan.description}</p>

                      <ul className="mt-6 space-y-3">
                        {plan.featureList.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => handlePlanSelect(plan)}
                        className={`mt-7 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          active
                            ? "bg-gray-900 text-white"
                            : "bg-gradient-to-r from-[#155DFC] to-[#00B8DB] text-white hover:opacity-95"
                        }`}
                      >
                        {active ? "Selected" : plan.ctaLabel || "Choose Plan"}
                      </button>
                    </article>
                  );
                })}
              </div>
              {filteredPlans.length === 0 && (
                <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
                  No plans are available for this account type right now.
                </div>
              )}

              {selectedPlan && (
                <section className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Checkout integration placeholder is active.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setMethod("card")}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition ${
                          method === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Credit / Debit Card</p>
                          <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod("upi")}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition ${
                          method === "upi" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">UPI</p>
                          <p className="text-xs text-gray-500">GPay, PhonePe, Paytm</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod("netbanking")}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition ${
                          method === "netbanking"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Landmark className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Net Banking</p>
                          <p className="text-xs text-gray-500">All major banks</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod("wallet")}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition ${
                          method === "wallet"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Wallet className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Wallet</p>
                          <p className="text-xs text-gray-500">Fast one-click payments</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <aside className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                    <div className="mt-6 space-y-4 text-sm text-gray-700">
                      <div className="flex items-center justify-between">
                        <span>Selected plan</span>
                        <span className="font-semibold text-gray-900">{selectedPlan.displayName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>For</span>
                        <span className="capitalize">{selectedPlan.audience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Billing cycle</span>
                        <span>Monthly</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Payment method</span>
                        <span className="capitalize">{method}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between text-base font-bold text-gray-900">
                          <span>Total payable</span>
                          <span>₹{selectedPlan.price}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                    >
                      Proceed to Secure Checkout
                    </button>
                  </aside>
                </section>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}
