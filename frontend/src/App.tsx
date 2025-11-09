import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { FinanceCar } from './components/FinanceCar';
import { ChatFinance } from './components/ChatFinance';
import { Profile } from './components/Profile';
import { CarDetails } from './components/CarDetails';
import { Compare } from './components/Compare';
import { cars } from './data/cars';
import authService from './services/auth';
import userService from './services/user';
import { User } from './types/api';

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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [compareCarIds, setCompareCarIds] = useState<[string, string] | null>(null);
  const [availableCars, setAvailableCars] = useState<typeof cars>(cars);

  // Check authentication on mount and load bookmarks
  useEffect(() => {
    const loadUserData = async () => {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setCurrentPage('finance');

        // Load bookmarks from backend
        try {
          const { vehicleIds } = await userService.getBookmarks();
          setSavedCars(vehicleIds.map(id => id.toString()));
        } catch (err) {
          console.error('Failed to load bookmarks from backend:', err);
          // Fall back to localStorage if backend fails
          const storedSavedCars = localStorage.getItem('toyotrack_saved_cars');
          if (storedSavedCars) {
            setSavedCars(JSON.parse(storedSavedCars));
          }
        }
      }
    };

    loadUserData();
  }, []);

  // Save saved cars to localStorage
  useEffect(() => {
    localStorage.setItem('toyotrack_saved_cars', JSON.stringify(savedCars));
  }, [savedCars]);

  // Handle signup - auth is handled in the SignUp component via useAuth hook
  const handleSignUp = async (email: string) => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentPage('finance');

      // Small delay to ensure token is set
      setTimeout(async () => {
        try {
          const { vehicleIds } = await userService.getBookmarks();
          console.log('Loaded bookmarks on signup:', vehicleIds);
          setSavedCars(vehicleIds.map(id => id.toString()));
        } catch (err) {
          console.error('Failed to load bookmarks on signup:', err);
        }
      }, 100);
    }
  };

  // Handle login - auth is handled in the Login component via useAuth hook
  const handleLogin = async (email: string) => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentPage('finance');

      // Small delay to ensure token is set
      setTimeout(async () => {
        try {
          const { vehicleIds } = await userService.getBookmarks();
          console.log('Loaded bookmarks on login:', vehicleIds);
          setSavedCars(vehicleIds.map(id => id.toString()));
        } catch (err) {
          console.error('Failed to load bookmarks on login:', err);
        }
      }, 100);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setSavedCars([]);
    localStorage.removeItem('toyotrack_saved_cars');
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    if (!currentUser && page !== 'landing' && page !== 'login' && page !== 'signup' && page !== 'privacy' && page !== 'terms') {
      setCurrentPage('login');
    } else {
      setCurrentPage(page as Page);
    }
  };

  const handleToggleSave = async (carId: string) => {
    const isCurrentlySaved = savedCars.includes(carId);

    // Optimistically update UI
    setSavedCars((prev) =>
      isCurrentlySaved ? prev.filter((id) => id !== carId) : [...prev, carId]
    );

    // Sync with backend
    try {
      const vehicleId = parseInt(carId);
      if (isCurrentlySaved) {
        console.log('Removing bookmark:', vehicleId);
        await userService.removeBookmark(vehicleId);
        console.log('Bookmark removed successfully');
      } else {
        console.log('Adding bookmark:', vehicleId);
        await userService.addBookmark(vehicleId);
        console.log('Bookmark added successfully');
      }
    } catch (err) {
      console.error('Failed to sync bookmark with backend:', err);
      // Revert on error
      setSavedCars((prev) =>
        isCurrentlySaved ? [...prev, carId] : prev.filter((id) => id !== carId)
      );
    }
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
            onCarsLoaded={setAvailableCars}
          />
        );
      case 'chat':
        return <ChatFinance />;
      case 'profile':
        return currentUser ? (
          <Profile
            savedCars={savedCars}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewCarDetails}
          />
        ) : null;
      case 'car-details':
        const selectedCar = availableCars.find((car) => car.id === selectedCarId);
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
            .map((id) => availableCars.find((car) => car.id === id))
            .filter((car): car is typeof availableCars[0] => car !== undefined);
          
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