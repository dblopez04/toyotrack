import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SignUpProps {
  onSignUp: (
    username: string, 
    email: string, 
    password: string,
    creditTier: 'excellent' | 'good' | 'fair' | 'poor',
    budget: number,
    preferredCarType: string,
    fuelType: 'electric' | 'hybrid' | 'gas',
    maxDownPayment: number
  ) => void;
  onNavigate: (page: string) => void;
}

export function SignUp({ onSignUp, onNavigate }: SignUpProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [creditTier, setCreditTier] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [budget, setBudget] = useState(50000);
  const [preferredCarType, setPreferredCarType] = useState('sedan');
  const [fuelType, setFuelType] = useState<'electric' | 'hybrid' | 'gas'>('gas');
  const [maxDownPayment, setMaxDownPayment] = useState(10000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    onSignUp(username, email, password, creditTier, budget, preferredCarType, fuelType, maxDownPayment);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up for your ToyoTrack account and set your financing preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Account Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financing Preferences */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-gray-900">Financing Preferences</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditTier">Credit Tier</Label>
                  <Select value={creditTier} onValueChange={(value) => setCreditTier(value as any)}>
                    <SelectTrigger id="creditTier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (720+)</SelectItem>
                      <SelectItem value="good">Good (680-719)</SelectItem>
                      <SelectItem value="fair">Fair (630-679)</SelectItem>
                      <SelectItem value="poor">Poor (Below 630)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredCarType">Preferred Car Type</Label>
                  <Select value={preferredCarType} onValueChange={setPreferredCarType}>
                    <SelectTrigger id="preferredCarType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="minivan">Minivan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type Preference</Label>
                <Select value={fuelType} onValueChange={(value) => setFuelType(value as any)}>
                  <SelectTrigger id="fuelType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gas">Gas</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget: ${budget.toLocaleString()}</Label>
                <input
                  id="budget"
                  type="range"
                  min={0}
                  max={100000}
                  step={5000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#eb0a1e]"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$100,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDownPayment">Maximum Down Payment: ${maxDownPayment.toLocaleString()}</Label>
                <input
                  id="maxDownPayment"
                  type="range"
                  min={0}
                  max={100000}
                  step={1000}
                  value={maxDownPayment}
                  onChange={(e) => setMaxDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#eb0a1e]"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$100,000</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#eb0a1e] hover:bg-[#c4091a]"
            >
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-[#eb0a1e] hover:underline"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
