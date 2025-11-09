import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { FinanceCar } from './components/FinanceCar';
import { ChatFinance } from './components/ChatFinance';
import { Profile } from './components/Profile';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { CarDetails } from './components/CarDetails';
import { Compare } from './components/Compare';
import { cars } from './data/cars';

type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'finance'
  | 'chat'
  | 'profile'
  | 'about'
  | 'contact'
  | 'car-details'
  | 'compare';

interface User {
  username: string;
  email: string;
  password: string;
  creditTier: 'excellent' | 'good' | 'fair' | 'poor';
  budget: number;
  preferredCarType: string;
  fuelType: 'electric' | 'hybrid' | 'gas';
  maxDownPayment: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [compareCarIds, setCompareCarIds] = useState<[string, string] | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('toyotrack_users');
    const storedUser = localStorage.getItem('toyotrack_current_user');
    const storedSavedCars = localStorage.getItem('toyotrack_saved_cars');

    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      // Migrate old users to include new onboarding fields
      const migratedUsers = parsedUsers.map((user: any) => ({
        ...user,
        creditTier: user.creditTier || 'good',
        budget: user.budget || 50000,
        preferredCarType: user.preferredCarType || 'sedan',
        fuelType: user.fuelType || 'gas',
        maxDownPayment: user.maxDownPayment || 10000,
      }));
      setUsers(migratedUsers);
    }
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Migrate current user to include new onboarding fields
      const migratedUser = {
        ...parsedUser,
        creditTier: parsedUser.creditTier || 'good',
        budget: parsedUser.budget || 50000,
        preferredCarType: parsedUser.preferredCarType || 'sedan',
        fuelType: parsedUser.fuelType || 'gas',
        maxDownPayment: parsedUser.maxDownPayment || 10000,
      };
      setCurrentUser(migratedUser);
      setCurrentPage('finance');
    }
    if (storedSavedCars) {
      setSavedCars(JSON.parse(storedSavedCars));
    }
  }, []);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem('toyotrack_users', JSON.stringify(users));
  }, [users]);

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('toyotrack_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('toyotrack_current_user');
    }
  }, [currentUser]);

  // Save saved cars to localStorage
  useEffect(() => {
    localStorage.setItem('toyotrack_saved_cars', JSON.stringify(savedCars));
  }, [savedCars]);

  const handleSignUp = (
    username: string, 
    email: string, 
    password: string,
    creditTier: 'excellent' | 'good' | 'fair' | 'poor',
    budget: number,
    preferredCarType: string,
    fuelType: 'electric' | 'hybrid' | 'gas',
    maxDownPayment: number
  ) => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert('Email already exists!');
      return;
    }

    const newUser = { 
      username, 
      email, 
      password, 
      creditTier, 
      budget, 
      preferredCarType, 
      fuelType, 
      maxDownPayment 
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('finance');
  };

  const handleLogin = (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('finance');
    } else {
      alert('Invalid credentials!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSavedCars([]);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    if (!currentUser && page !== 'landing' && page !== 'login' && page !== 'signup' && page !== 'privacy' && page !== 'terms') {
      setCurrentPage('login');
    } else {
      setCurrentPage(page as Page);
    }
  };

  const handleToggleSave = (carId: string) => {
    setSavedCars((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
  };

  const handleViewCarDetails = (carId: string) => {
    setSelectedCarId(carId);
    setCurrentPage('car-details');
  };

  const handleBackToFinance = () => {
    setSelectedCarId(null);
    setCurrentPage('finance');
  };

  const handleCompare = (carIds: [string, string]) => {
    setCompareCarIds(carIds);
    setCurrentPage('compare');
  };

  const handleBackFromCompare = () => {
    setCompareCarIds(null);
    setCurrentPage('finance');
  };

  const handleUpdatePassword = (newPassword: string) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, password: newPassword };
    setCurrentUser(updatedUser);
    setUsers(users.map((u) => (u.email === currentUser.email ? updatedUser : u)));
  };

  const handleUpdatePreferences = (
    creditTier: 'excellent' | 'good' | 'fair' | 'poor',
    budget: number,
    preferredCarType: string,
    fuelType: 'electric' | 'hybrid' | 'gas',
    maxDownPayment: number
  ) => {
    if (!currentUser) return;

    const updatedUser = { 
      ...currentUser, 
      creditTier, 
      budget, 
      preferredCarType, 
      fuelType, 
      maxDownPayment 
    };
    setCurrentUser(updatedUser);
    setUsers(users.map((u) => (u.email === currentUser.email ? updatedUser : u)));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUp onSignUp={handleSignUp} onNavigate={handleNavigate} />;
      case 'finance':
        return (
          <FinanceCar 
            savedCars={savedCars} 
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewCarDetails}
            onCompare={handleCompare}
          />
        );
      case 'chat':
        return <ChatFinance />;
      case 'profile':
        return currentUser ? (
          <Profile
            user={currentUser}
            savedCars={savedCars}
            onToggleSave={handleToggleSave}
            onUpdatePassword={handleUpdatePassword}
            onUpdatePreferences={handleUpdatePreferences}
            onViewDetails={handleViewCarDetails}
          />
        ) : null;
      case 'car-details':
        const selectedCar = cars.find((car) => car.id === selectedCarId);
        return selectedCar ? (
          <CarDetails
            car={selectedCar}
            isSaved={savedCars.includes(selectedCar.id)}
            onToggleSave={handleToggleSave}
            onBack={handleBackToFinance}
          />
        ) : null;
      case 'compare':
        if (compareCarIds) {
          const compareCars = compareCarIds
            .map((id) => cars.find((car) => car.id === id))
            .filter((car): car is typeof cars[0] => car !== undefined);
          
          if (compareCars.length === 2) {
            return (
              <Compare 
                cars={compareCars as [typeof cars[0], typeof cars[0]]}
                savedCars={savedCars}
                onToggleSave={handleToggleSave}
                onBack={handleBackFromCompare}
                onViewDetails={handleViewCarDetails}
              />
            );
          }
        }
        return null;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      {renderPage()}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}