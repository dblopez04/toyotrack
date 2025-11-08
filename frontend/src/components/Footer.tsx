import { Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#eb0a1e] mb-4">ToyoTrack</h3>
            <p className="text-gray-400">
              Your trusted partner in Toyota vehicle financing
            </p>
          </div>

          <div>
            <h4 className="mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('privacy')}
                className="text-gray-400 hover:text-white text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="text-gray-400 hover:text-white text-left"
              >
                Terms & Conditions
              </button>
            </div>
          </div>

          <div>
            <h4 className="mb-4">Contact Us</h4>
            <div className="flex flex-col gap-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:CustomerService@toyotrack.com"
                  className="hover:text-white"
                >
                  CustomerService@toyotrack.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+14446668888" className="hover:text-white">
                  +1 444-(666)-8888
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; 2025 ToyoTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
