import { Button } from './ui/button';
import { Car, DollarSign, Shield, Clock } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-[#eb0a1e] mb-4">
            Welcome to ToyoTrack
          </h1>
          <h2 className="text-gray-600 mb-8">
            Finance Your Dream Toyota Today
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            Discover competitive financing options for every Toyota vehicle.
            Get pre-approved in minutes and drive home in your new car today.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => onNavigate('signup')}
              className="bg-[#eb0a1e] hover:bg-[#c4091a]"
            >
              Sign Up
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('login')}
              className="border-[#eb0a1e] text-[#eb0a1e] hover:bg-[#eb0a1e] hover:text-white"
            >
              Log In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Why Choose ToyoTrack?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#f5f5f5] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-[#eb0a1e]" />
              </div>
              <h3 className="mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Browse the complete 2025 Toyota lineup
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#f5f5f5] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-[#eb0a1e]" />
              </div>
              <h3 className="mb-2">Best Rates</h3>
              <p className="text-gray-600">
                Competitive financing and lease options
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#f5f5f5] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#eb0a1e]" />
              </div>
              <h3 className="mb-2">Quick Approval</h3>
              <p className="text-gray-600">
                Get pre-approved in minutes online
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#f5f5f5] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#eb0a1e]" />
              </div>
              <h3 className="mb-2">Trusted Service</h3>
              <p className="text-gray-600">
                Secure and reliable financing solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#eb0a1e] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">
            Ready to Get Started?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join ToyoTrack today and explore financing options tailored to your needs
          </p>
          <Button
            onClick={() => onNavigate('signup')}
            className="bg-white text-[#eb0a1e] hover:bg-gray-100"
          >
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  );
}
