import { Button } from './ui/button';
import { Car, DollarSign, Shield, Clock } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-400 py-20">
        <div className="container mx-auto px-4 py-20 text-center">
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
    </div>
  );
}
