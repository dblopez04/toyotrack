import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cars } from '../data/cars';
import { CarCard } from './CarCard';

interface ProfileProps {
  user: { username: string; email: string };
  savedCars: string[];
  onToggleSave: (carId: string) => void;
  onUpdatePassword: (newPassword: string) => void;
}

export function Profile({ user, savedCars, onToggleSave, onUpdatePassword }: ProfileProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="mb-8">Profile</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
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

                  <Button
                    type="submit"
                    className="w-full bg-[#eb0a1e] hover:bg-[#c4091a]"
                  >
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
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
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedCarsList.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        isSaved={true}
                        onToggleSave={onToggleSave}
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
    </div>
  );
}
