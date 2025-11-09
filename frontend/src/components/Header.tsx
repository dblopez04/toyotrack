import { useState } from 'react';
import { Menu, User, Settings, Car, MessageSquare, UserCircle, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Separator } from './ui/separator';

interface HeaderProps {
  currentUser: { username: string; email: string } | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Header({ currentUser, onNavigate, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setIsMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side - Menu button */}
        <div className="flex items-center w-24">
          {currentUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center - ToyoTrack branding */}
        <div className="flex-1 flex justify-center">
          <h1
            className="text-[#eb0a1e] cursor-pointer"
            onClick={() => onNavigate(currentUser ? 'finance' : 'landing')}
          >
            ToyoTrack
          </h1>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center gap-2 w-24 justify-end">
          {currentUser ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('profile')}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem disabled>
                    {currentUser.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>

      {/* Side menu sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-80 bg-white">
          <SheetHeader>
            <SheetTitle className="text-[#eb0a1e]">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-6">
            <Button
              variant="ghost"
              className="justify-start gap-3 h-12"
              onClick={() => handleNavigate('finance')}
            >
              <Car className="h-5 w-5" />
              Finance a Car
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-3 h-12"
              onClick={() => handleNavigate('chat')}
            >
              <MessageSquare className="h-5 w-5" />
              Chat About Finance
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-3 h-12"
              onClick={() => handleNavigate('profile')}
            >
              <UserCircle className="h-5 w-5" />
              Profile
            </Button>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
