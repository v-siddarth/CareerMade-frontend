import Navbar from "@/app/components/Navbar";

export default function ShippingPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm sm:p-12 lg:p-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Shipping & Delivery Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last Updated: April 21, 2026</p>

          <div className="prose prose-blue mt-8 max-w-none text-gray-700">
            <p>
              CareerMed, operated by Lifemate Healthcare Pvt Ltd, is a digital SaaS (Software as a Service) platform and job portal. 
            </p>
            
            <h3 className="mt-8 text-xl font-semibold text-gray-900">Digital Delivery</h3>
            <p>
              We do not sell physical goods. Therefore, <strong>no physical shipping or delivery is involved</strong> when you purchase a subscription or service on our platform.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">Activation of Services</h3>
            <p>
              Upon successful payment processing via our payment gateway (Razorpay), your purchased digital services, subscription plans, or premium features are activated immediately and automatically on your account.
            </p>
            <p>
              You will receive an email confirmation containing the details of your transaction and your service access. You can instantly access the features by logging into your CareerMed Dashboard.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">Contact Us</h3>
            <p>If you experience any issues with the activation of your digital services after payment, please contact our support team immediately:</p>
            <ul className="list-none pl-0">
              <li><strong>Email:</strong> support@careermed.in</li>
              <li><strong>Phone:</strong> +91 98765 43210</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
