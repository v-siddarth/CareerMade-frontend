import Navbar from "@/app/components/Navbar";

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm sm:p-12 lg:p-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Cancellation & Refund Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last Updated: April 21, 2026</p>

          <div className="prose prose-blue mt-8 max-w-none text-gray-700">
            <p>
              Thank you for choosing CareerMed, operated by Lifemate Healthcare Pvt Ltd. We strive to provide the best healthcare recruitment platform. Please read our cancellation and refund policy carefully.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">1. Subscription Cancellations</h3>
            <p>
              You can cancel your subscription at any time. When you cancel a subscription, you will continue to have access to your premium features until the end of your current billing cycle. To cancel your subscription:
            </p>
            <ul className="list-disc pl-5">
              <li>Log in to your Employer Dashboard.</li>
              <li>Navigate to the "Pricing & Billing" section.</li>
              <li>Click on "Cancel Subscription" and follow the prompts.</li>
            </ul>
            <p>
              Your cancellation will take effect at the end of the current paid term.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">2. Refund Eligibility</h3>
            <p>
              Because CareerMed provides immediate access to digital services, applicant databases, and premium job posting features upon payment, <strong>we generally do not offer refunds for partial-month usage or unused portions of a subscription.</strong>
            </p>
            <p>However, refunds may be granted in the following exceptional circumstances:</p>
            <ul className="list-disc pl-5">
              <li><strong>Duplicate Billing:</strong> If you are accidentally charged twice for the same billing cycle due to a technical error.</li>
              <li><strong>Service Unavailability:</strong> If the CareerMed platform is entirely inaccessible for an extended period (exceeding 48 hours) preventing you from utilizing the paid services.</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">3. How to Request a Refund</h3>
            <p>
              If you believe you are eligible for a refund based on the criteria above, please contact our support team within 7 days of the billing event.
            </p>
            <ul className="list-none pl-0">
              <li><strong>Email:</strong> support@careermed.in</li>
              <li><strong>Phone:</strong> +91 98765 43210</li>
            </ul>
            <p>
              Please include your account email address, transaction ID, and the reason for your refund request. Our team will review your request and respond within 3-5 business days. If approved, the refund will be processed back to the original payment method (via Razorpay) within 5-7 business days.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">4. Changes to this Policy</h3>
            <p>
              We reserve the right to modify this Cancellation and Refund Policy at any time. Any changes will be posted on this page with an updated revision date.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
