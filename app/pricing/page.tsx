"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CreditCard, Landmark, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import { authStorage } from "@/lib/api-client";
import { createPricingNotificationEvent } from "@/lib/notifications-client";

type Plan = {
  id: "starter" | "growth" | "pro";
  name: string;
  price: number;
  tag: string;
  description: string;
  cta: string;
  features: string[];
  accent: string;
  highlighted?: boolean;
};

type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter Care",
    price: 300,
    tag: "Best for individuals",
    description: "Perfect for doctors and nurses starting with focused healthcare hiring.",
    cta: "Choose Starter",
    features: [
      "Up to 5 active job posts",
      "Basic candidate filtering",
      "Standard support",
      "Single recruiter seat",
    ],
    accent: "from-blue-600 to-cyan-500",
  },
  {
    id: "growth",
    name: "Growth Care",
    price: 600,
    tag: "Most popular",
    description: "Built for growing clinics and hospitals that need faster hiring turnaround.",
    cta: "Choose Growth",
    features: [
      "Up to 20 active job posts",
      "Priority candidate recommendations",
      "Advanced profile filters",
      "3 recruiter seats",
    ],
    accent: "from-[#155DFC] to-[#00B8DB]",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro Care",
    price: 900,
    tag: "For high-volume hiring",
    description: "For enterprise healthcare teams managing large and continuous talent pipelines.",
    cta: "Choose Pro",
    features: [
      "Unlimited active job posts",
      "AI ranking + smart matching",
      "Dedicated account support",
      "Unlimited recruiter seats",
    ],
    accent: "from-indigo-600 to-blue-500",
  },
];

export default function PricingPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<Plan["id"]>("growth");
  const [method, setMethod] = useState<PaymentMethod>("card");

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || plans[1],
    [selectedPlanId]
  );

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) return;
    createPricingNotificationEvent({ eventType: "view_pricing" }).catch(() => {});
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    const token = authStorage.getAccessToken();
    if (!token) return;
    createPricingNotificationEvent({
      eventType: "select_plan",
      planId: plan.id,
      planName: plan.name,
    }).catch(() => {});
  };

  const handleCheckout = () => {
    const token = authStorage.getAccessToken();
    if (token) {
      createPricingNotificationEvent({
        eventType: "checkout_intent",
        planId: selectedPlan.id,
        planName: selectedPlan.name,
      }).catch(() => {});
    }
    toast("Payment gateway will be connected at deployment. Plan locked for now.", {
      icon: "💳",
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/60 to-white">
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Premium Healthcare Hiring Plans
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Pricing That Scales With Your
              <span className="bg-gradient-to-r from-[#155DFC] to-[#00B8DB] bg-clip-text text-transparent"> Hiring Ambition</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Transparent monthly plans. No hidden cost. Upgrade anytime.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
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
                      Most Popular
                    </span>
                  )}
                  <p className="text-sm font-semibold text-blue-700">{plan.tag}</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                    <span className="pb-1 text-sm text-gray-500">/month</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{plan.description}</p>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
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
                        : `bg-gradient-to-r ${plan.accent} text-white hover:opacity-95`
                    }`}
                  >
                    {active ? "Selected" : plan.cta}
                  </button>
                </article>
              );
            })}
          </div>

          <section className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>
              <p className="mt-2 text-sm text-gray-600">
                Gateway wiring will be completed at deployment. UI is production-ready.
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
                    <p className="text-xs text-gray-500">All major Indian banks</p>
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

              <div className="mt-6 rounded-2xl border border-dashed border-blue-300 bg-blue-50/70 p-4 text-sm text-blue-900">
                Payment gateway placeholder: plug Razorpay/Stripe/PayU integration here at deployment.
              </div>
            </div>

            <aside className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              <div className="mt-6 space-y-4 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Selected plan</span>
                  <span className="font-semibold text-gray-900">{selectedPlan.name}</span>
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
              <p className="mt-3 text-center text-xs text-gray-500">
                GST and final invoice details will be calculated at payment step.
              </p>
            </aside>
          </section>
        </section>
      </main>
    </>
  );
}
