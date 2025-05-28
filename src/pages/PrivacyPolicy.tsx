import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This policy outlines how we collect,
        use, and protect your information when you use our site.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc ml-5 mb-4">
        <li>IP address</li>
        <li>Browser type and operating system (via User-Agent)</li>
        <li>Pages visited and timestamps</li>
        <li>Aggregated usage statistics</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use This Information</h2>
      <ul className="list-disc ml-5 mb-4">
        <li>To monitor and improve site performance</li>
        <li>To detect and prevent abuse or security issues</li>
        <li>For analytics (anonymous/aggregated)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Cookies</h2>
      <p className="mb-4">
        We use cookies for analytics and to enhance your experience. You can
        manage cookie settings through the banner shown on first visit.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Third-Party Services</h2>
      <p className="mb-4">
        We may use services such as Google Analytics or Supabase to store logs.
        These services may collect data according to their own privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact</h2>
      <p>
        If you have questions, contact us at:{" "}
        <a href="mailto:support@yourapp.com" className="text-blue-600 underline">
          support@yourapp.com
        </a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
