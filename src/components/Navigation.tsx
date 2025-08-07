import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="om-symbol text-primary">🕉</span>
              <span className="text-xl font-bold spiritual-text">Pandit Ji</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
            {profile?.user_type === 'pandit' ? (
                  <>
                    <Link to="/pandit-dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                      Shop
                    </Link>
                    <Link to="/book-pandit" className="text-muted-foreground hover:text-primary transition-colors">
                      Book Pandit
                    </Link>
                    <Link to="/bookings" className="text-muted-foreground hover:text-primary transition-colors">
                      My Bookings
                    </Link>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {profile?.full_name || 'User'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm text-muted-foreground">
                      {profile?.user_type === 'pandit' ? 'Pandit' : 'User'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {user ? (
                <>
                  {profile?.user_type === 'pandit' ? (
                    <Link
                      to="/pandit-dashboard"
                      className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/shop"
                        className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Shop
                      </Link>
                      <Link
                        to="/book-pandit"
                        className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Book Pandit
                      </Link>
                      <Link
                        to="/bookings"
                        className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        My Bookings
                      </Link>
                    </>
                  )}
                  <div className="border-t border-border pt-4 pb-3">
                    <div className="px-3 py-2">
                      <div className="text-base font-medium">{profile?.full_name || 'User'}</div>
                      <div className="text-sm text-muted-foreground">{profile?.user_type === 'pandit' ? 'Pandit' : 'User'}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3 py-2" 
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <div className="px-3 py-2">
                    <Button asChild className="w-full">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Get Started</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}