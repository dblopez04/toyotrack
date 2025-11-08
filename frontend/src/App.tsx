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
import { Privacy } from './components/Privacy';
import { Terms } from './components/Terms';

type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'finance'
  | 'chat'
  | 'profile'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';

interface User {
  username: string;
  email: string;
  password: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [savedCars, setSavedCars] = useState<string[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('toyotrack_users');
    const storedUser = localStorage.getItem('toyotrack_current_user');
    const storedSavedCars = localStorage.getItem('toyotrack_saved_cars');

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
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

  const handleSignUp = (username: string, email: string, password: string) => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert('Email already exists!');
      return;
    }

    const newUser = { username, email, password };
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

  const handleUpdatePassword = (newPassword: string) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, password: newPassword };
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
          <FinanceCar savedCars={savedCars} onToggleSave={handleToggleSave} />
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
          />
        ) : null;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
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
