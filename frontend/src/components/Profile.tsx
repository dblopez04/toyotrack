import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CarCard } from './CarCard';
import authService from '../services/auth';
import userService from '../services/user';
import vehicleService from '../services/vehicle';
import { getErrorMessage } from '../services/api';
import { Vehicle } from '../types/api';
import { Car } from '../data/cars';

interface ProfileProps {
  savedCars: string[];
  onToggleSave: (carId: string) => void;
  onViewDetails?: (carId: string) => void;
}

type CreditTier = 'excellent' | 'good' | 'fair' | 'poor';

// Helper to convert API vehicle to CarCard format
const convertVehicleToCard = (vehicle: Vehicle): Car => ({
  id: vehicle.id.toString(),
  name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
  year: vehicle.year,
  category: vehicle.truck ? 'truck' as const :
            vehicle.model.toLowerCase().includes('sienna') ? 'minivan' as const :
            vehicle.model.toLowerCase().includes('camry') || vehicle.model.toLowerCase().includes('corolla') || vehicle.model.toLowerCase().includes('prius') ? 'car' as const :
            'suv' as const,
  type: vehicle.trimName,
  fuelType: vehicle.electric ? 'electric' as const :
             vehicle.pluginElectric ? 'hybrid' as const :
             'gas' as const,
  price: vehicle.baseMsrp,
  image: vehicle.CarImages?.[0]?.imageUrl || '/placeholder-car.jpg',
  specs: {},
  financeOptions: ['Loan', 'Lease'],
  isTRD: vehicle.trimName.toUpperCase().includes('TRD'),
});

export function Profile({ savedCars, onToggleSave, onViewDetails }: ProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [finances, setFinances] = useState<any>(null);
  const [savedVehicles, setSavedVehicles] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit states
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBudget, setEditBudget] = useState(50000);
  const [editCarType, setEditCarType] = useState('suv');
  const [editFuelType, setEditFuelType] = useState('gas');
  const [editCreditTier, setEditCreditTier] = useState<CreditTier>('good');

  const creditTierLabels = {
    excellent: 'Excellent (720+)',
    good: 'Good (680-719)',
    fair: 'Fair (640-679)',
    poor: 'Poor (Below 640)',
  };

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Load saved vehicles when savedCars changes
  useEffect(() => {
    if (savedCars.length > 0) {
      loadSavedVehicles();
    } else {
      setSavedVehicles([]);
    }
  }, [savedCars]);

  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get user profile (basic info)
      const userProfile = await authService.getProfile();
      setUser(userProfile);
      setEditFirstName(userProfile.firstName || '');
      setEditLastName(userProfile.lastName || '');
      setEditEmail(userProfile.email);

      // Get user preferences (optional - might not exist yet)
      try {
        const userPrefs = await userService.getPreferences();
        setPreferences(userPrefs.UserPreferences || userPrefs);
        setEditBudget(userPrefs.UserPreferences?.budget || userPrefs.budget || 50000);
        setEditCarType(userPrefs.UserPreferences?.carType || userPrefs.carType || 'suv');
        setEditFuelType(userPrefs.UserPreferences?.fuelType || userPrefs.fuelType || 'gas');
      } catch (err) {
        // Preferences don't exist yet - use defaults
        console.log('No preferences found, using defaults');
      }

      // Get user finances (optional - might not exist yet)
      try {
        const userFin = await userService.getFinances();
        setFinances(userFin.UserFinance || userFin);
        setEditCreditTier((userFin.UserFinance?.creditTier || userFin.creditTier || 'good') as CreditTier);
      } catch (err) {
        // Finances don't exist yet - use defaults
        console.log('No finances found, using defaults');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedVehicles = async () => {
    try {
      const allVehicles = await vehicleService.getVehicles();
      const saved = allVehicles
        .filter(v => savedCars.includes(v.id.toString()))
        .map(convertVehicleToCard);
      setSavedVehicles(saved);
    } catch (err) {
      console.error('Failed to load saved vehicles:', err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updates: any = {};

      if (editFirstName !== user?.firstName) {
        updates.firstName = editFirstName;
      }
      if (editLastName !== user?.lastName) {
        updates.lastName = editLastName;
      }
      if (editEmail !== user?.email) {
        updates.email = editEmail;
      }

      if (Object.keys(updates).length === 0) {
        setIsEditingProfile(false);
        return;
      }

      // Update profile
      if (updates.firstName || updates.lastName) {
        await authService.updateProfile({
          firstName: editFirstName,
          lastName: editLastName,
        });
      }

      if (updates.email) {
        await authService.updateEmail(editEmail);
      }

      setUser({ ...user, ...updates });
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(`Failed to update profile: ${getErrorMessage(err)}`);
    }
  };

  const handleSavePreferences = async () => {
    try {
      // Save preferences
      await userService.setPreferences({
        budget: editBudget,
        carType: editCarType,
        fuelType: editFuelType,
      });

      // Save finances (credit tier)
      await userService.setFinances({
        creditScore: editCreditTier === 'excellent' ? 750 :
                     editCreditTier === 'good' ? 690 :
                     editCreditTier === 'fair' ? 650 : 600,
        creditTier: editCreditTier,
      });

      // Reload data
      await loadUserData();
      setIsEditingPreferences(false);
      alert('Preferences updated successfully!');
    } catch (err) {
      alert(`Failed to update preferences: ${getErrorMessage(err)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#eb0a1e] border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <p className="font-medium">Error loading profile</p>
            <p className="text-sm mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUserData}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="mb-8">Profile</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Account Information</CardTitle>
                {!isEditingProfile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Edit
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditingProfile ? (
                <>
                  <div>
                    <Label>Name</Label>
                    <p className="mt-1 text-gray-600">{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1 text-gray-600">{user?.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} className="bg-[#eb0a1e] hover:bg-[#c4091a]">
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setEditFirstName(user?.firstName || '');
                        setEditLastName(user?.lastName || '');
                        setEditEmail(user?.email);
                        setIsEditingProfile(false);
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
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
                    <p className="mt-1 text-gray-600">
                      {creditTierLabels[(finances?.creditTier || 'good') as CreditTier]}
                    </p>
                  </div>
                  <div>
                    <Label>Preferred Car Type</Label>
                    <p className="mt-1 text-gray-600 capitalize">{preferences?.carType || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Fuel Type Preference</Label>
                    <p className="mt-1 text-gray-600 capitalize">{preferences?.fuelType || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Budget</Label>
                    <p className="mt-1 text-gray-600">${(preferences?.budget || 0).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditTier">Credit Tier</Label>
                      <Select value={editCreditTier} onValueChange={(value) => setEditCreditTier(value as CreditTier)}>
                        <SelectTrigger id="creditTier">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent (720+)</SelectItem>
                          <SelectItem value="good">Good (680-719)</SelectItem>
                          <SelectItem value="fair">Fair (640-679)</SelectItem>
                          <SelectItem value="poor">Poor (Below 640)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carType">Preferred Car Type</Label>
                      <Select value={editCarType} onValueChange={setEditCarType}>
                        <SelectTrigger id="carType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="coupe">Coupe</SelectItem>
                          <SelectItem value="minivan">Minivan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type Preference</Label>
                    <Select value={editFuelType} onValueChange={setEditFuelType}>
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
                    <Label htmlFor="budget">Budget: ${editBudget.toLocaleString()}</Label>
                    <input
                      id="budget"
                      type="range"
                      min={0}
                      max={100000}
                      step={5000}
                      value={editBudget}
                      onChange={(e) => setEditBudget(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#eb0a1e]"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$0</span>
                      <span>$100,000</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSavePreferences}
                    className="bg-[#eb0a1e] hover:bg-[#c4091a]"
                  >
                    Save Preferences
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Cars */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Cars</CardTitle>
              <CardDescription>
                {savedVehicles.length}{' '}
                {savedVehicles.length === 1 ? 'vehicle' : 'vehicles'} saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedVehicles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedVehicles.map((car) => (
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
