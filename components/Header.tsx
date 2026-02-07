import React, { useState, useEffect } from 'react';
import { Menu, X, User, Heart, LogOut } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onMyEventsClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onLoginClick, 
  isLoggedIn, 
  onLogout,
  onMyEventsClick,
  onHomeClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'خانه', onClick: onHomeClick },
    { name: 'رویدادها', onClick: onHomeClick },
    ...(isLoggedIn ? [{ name: 'رویدادهای من', onClick: onMyEventsClick }] : []),
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={onHomeClick}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white font-bold text-xl">
              R
            </div>
            <span className={`text-2xl font-black tracking-tight ${isScrolled ? 'text-slate-800' : 'text-slate-900'}`}>
              رویداد<span className="text-primary-600">پرو</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={link.onClick}
                className="text-slate-600 hover:text-primary-600 font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                 <Button onClick={onMyEventsClick} variant="ghost" className="text-slate-600 hover:text-rose-500">
                    <Heart size={20} />
                 </Button>
                 <div className="h-6 w-px bg-slate-200"></div>
                 <Button onClick={onLogout} variant="ghost" className="gap-2 text-slate-600">
                    <LogOut size={18} />
                    <span>خروج</span>
                 </Button>
                 <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    A
                 </div>
              </div>
            ) : (
              <Button onClick={onLoginClick} variant="primary" className="gap-2">
                <User size={18} />
                <span>ورود / ثبت نام</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => { link.onClick(); setIsMobileMenuOpen(false); }}
              className="block w-full text-right p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
            >
              {link.name}
            </button>
          ))}
          <div className="border-t border-slate-100 pt-4 mt-2">
            {isLoggedIn ? (
                <Button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="w-full justify-center bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none">
                    خروج از حساب
                </Button>
            ) : (
                <Button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="w-full justify-center">
                    ورود / ثبت نام
                </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};