export function Terms() {
  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="mb-8">Terms & Conditions</h1>

        <div className="prose max-w-none">
          <div className="bg-white rounded-lg p-8 border border-gray-200 space-y-6">
            <section>
              <h2>Terms and Conditions</h2>
              <p className="text-gray-600">Last updated: November 8, 2025</p>
            </section>

            <section>
              <h3>Agreement to Terms</h3>
              <p className="text-gray-600">
                By accessing and using ToyoTrack, you accept and agree to be bound by the terms
                and provision of this agreement.
              </p>
            </section>

            <section>
              <h3>Use License</h3>
              <p className="text-gray-600">
                Permission is granted to temporarily access the materials (information or software)
                on ToyoTrack's website for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h3>Disclaimer</h3>
              <p className="text-gray-600">
                The materials on ToyoTrack's website are provided on an 'as is' basis. ToyoTrack
                makes no warranties, expressed or implied, and hereby disclaims and negates all
                other warranties including, without limitation, implied warranties or conditions
                of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h3>Limitations</h3>
              <p className="text-gray-600">
                In no event shall ToyoTrack or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business
                interruption) arising out of the use or inability to use the materials on
                ToyoTrack's website.
              </p>
            </section>

            <section>
              <h3>Contact Information</h3>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at{' '}
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
