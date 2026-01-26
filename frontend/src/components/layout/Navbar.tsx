import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, Heart, Calendar, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/ApiAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { href: '/discover', label: t('nav.discover') },
    { href: '/stays', label: t('nav.stays') },
    { href: '/experiences', label: t('nav.experiences') },
    { href: '/cities', label: t('nav.cities') },
    { href: '/about', label: t('nav.about') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-xl">K</span>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Kamba Travel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('pt')}>
                  Português
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-[100px] truncate">
                      {user.full_name || user.email.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {t('nav.favorites')}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/bookings" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('nav.bookings')}
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          {t('nav.admin')}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" className="btn-gradient" asChild>
                  <Link to="/register">{t('nav.planTrip')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-border/50 flex flex-col space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <button
                    className={`text-sm ${language === 'en' ? 'font-semibold' : ''}`}
                    onClick={() => setLanguage('en')}
                  >
                    EN
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <button
                    className={`text-sm ${language === 'pt' ? 'font-semibold' : ''}`}
                    onClick={() => setLanguage('pt')}
                  >
                    PT
                  </button>
                </div>

                {user ? (
                  <>
                    <Link to="/profile" className="text-sm font-medium px-2 py-1" onClick={() => setIsOpen(false)}>
                      {t('nav.profile')}
                    </Link>
                    <Link to="/favorites" className="text-sm font-medium px-2 py-1" onClick={() => setIsOpen(false)}>
                      {t('nav.favorites')}
                    </Link>
                    <Link to="/bookings" className="text-sm font-medium px-2 py-1" onClick={() => setIsOpen(false)}>
                      {t('nav.bookings')}
                    </Link>

                    {isAdmin && (
                      <Link to="/admin" className="text-sm font-medium px-2 py-1" onClick={() => setIsOpen(false)}>
                        {t('nav.admin')}
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium text-destructive px-2 py-1 text-left"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-medium px-2 py-1" onClick={() => setIsOpen(false)}>
                      {t('nav.login')}
                    </Link>
                    <Button size="sm" className="btn-gradient w-full" asChild>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        {t('nav.planTrip')}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
