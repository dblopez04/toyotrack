export function Privacy() {
  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="mb-8">Privacy Policy</h1>

        <div className="prose max-w-none">
          <div className="bg-white rounded-lg p-8 border border-gray-200 space-y-6">
            <section>
              <h2>Privacy Policy</h2>
              <p className="text-gray-600">Last updated: November 8, 2025</p>
            </section>

            <section>
              <h3>Information Collection</h3>
              <p className="text-gray-600">
                ToyoTrack collects information that you provide directly to us when you create an
                account, browse vehicles, or contact our customer service.
              </p>
            </section>

            <section>
              <h3>Use of Information</h3>
              <p className="text-gray-600">
                We use the information we collect to provide, maintain, and improve our services,
                process your transactions, and send you technical notices and support messages.
              </p>
            </section>

            <section>
              <h3>Information Sharing</h3>
              <p className="text-gray-600">
                We do not share your personal information with third parties except as described
                in this privacy policy or with your consent.
              </p>
            </section>

            <section>
              <h3>Contact Us</h3>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:CustomerService@toyotrack.com" className="text-[#eb0a1e]">
                  CustomerService@toyotrack.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
