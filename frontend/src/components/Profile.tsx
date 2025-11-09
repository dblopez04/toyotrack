import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cars } from '../data/cars';
import { CarCard } from './CarCard';

interface ProfileProps {
  user: {
    username: string;
    email: string;
    creditTier: 'excellent' | 'good' | 'fair' | 'poor';
    budget: number;
    preferredCarType: string;
    fuelType: 'electric' | 'hybrid' | 'gas';
    maxDownPayment: number;
  };
  savedCars: string[];
  onToggleSave: (carId: string) => void;
  onUpdatePassword: (newPassword: string) => void;
  onUpdatePreferences?: (
    creditTier: 'excellent' | 'good' | 'fair' | 'poor',
    budget: number,
    preferredCarType: string,
    fuelType: 'electric' | 'hybrid' | 'gas',
    maxDownPayment: number
  ) => void;
  onViewDetails?: (carId: string) => void;
}

export function Profile({ user, savedCars, onToggleSave, onUpdatePassword, onUpdatePreferences, onViewDetails }: ProfileProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [creditTier, setCreditTier] = useState(user.creditTier);
  const [budget, setBudget] = useState(user.budget);
  const [preferredCarType, setPreferredCarType] = useState(user.preferredCarType);
  const [fuelType, setFuelType] = useState(user.fuelType);
  const [maxDownPayment, setMaxDownPayment] = useState(user.maxDownPayment);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    onUpdatePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    alert('Password updated successfully!');
  };

  const savedCarsList = cars.filter((car) => savedCars.includes(car.id));

  const creditTierLabels = {
    excellent: 'Excellent (720+)',
    good: 'Good (680-719)',
    fair: 'Fair (630-679)',
    poor: 'Poor (Below 630)',
  };

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="mb-8">Profile</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Username</Label>
                <p className="mt-1 text-gray-600">{user.username}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="mt-1 text-gray-600">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financing Preferences */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Financing Preferences</CardTitle>
                  <CardDescription>Your vehicle financing and preference settings</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingPreferences(!isEditingPreferences)}
                >
                  {isEditingPreferences ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!isEditingPreferences ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Credit Tier</Label>
                    <p className="mt-1 text-gray-600">{creditTierLabels[user.creditTier]}</p>
                  </div>
                  <div>
                    <Label>Preferred Car Type</Label>
                    <p className="mt-1 text-gray-600 capitalize">{user.preferredCarType}</p>
                  </div>
                  <div>
                    <Label>Fuel Type Preference</Label>
                    <p className="mt-1 text-gray-600 capitalize">{user.fuelType}</p>
                  </div>
                  <div>
                    <Label>Budget</Label>
                    <p className="mt-1 text-gray-600">${user.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Maximum Down Payment</Label>
                    <p className="mt-1 text-gray-600">${user.maxDownPayment.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
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

                  <Button
                    onClick={() => {
                      // In a real app, this would save to the backend
                      alert('Preferences updated! (Note: This is a demo - changes are local only)');
                      setIsEditingPreferences(false);
                      if (onUpdatePreferences) {
                        onUpdatePreferences(creditTier, budget, preferredCarType, fuelType, maxDownPayment);
                      }
                    }}
                    className="bg-[#eb0a1e] hover:bg-[#c4091a]"
                  >
                    Save Preferences
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                <Button
                  type="submit"
                  className="bg-[#eb0a1e] hover:bg-[#c4091a]"
                >
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Saved Cars */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Cars</CardTitle>
              <CardDescription>
                {savedCarsList.length}{' '}
                {savedCarsList.length === 1 ? 'vehicle' : 'vehicles'} saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedCarsList.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedCarsList.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      isSaved={true}
                      onToggleSave={onToggleSave}
                      onViewDetails={onViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>You haven't saved any cars yet.</p>
                  <p className="mt-2">Browse our inventory and save your favorites!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}