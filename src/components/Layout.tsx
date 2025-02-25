
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Instagram, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "text-gray-500 hover:text-black transition-colors duration-200",
        isActive && "text-black font-medium"
      )}
    >
      {children}
    </Link>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-medium">
            Yajnesh Ponnappa
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/people">PEOPLE</NavLink>
            <NavLink to="/animals">ANIMALS</NavLink>
            <NavLink to="/landscapes">LANDSCAPES</NavLink>
            <NavLink to="/info">INFO</NavLink>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition-colors duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-500 hover:text-black transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <NavLink to="/people" onClick={closeMenu}>PEOPLE</NavLink>
              <NavLink to="/animals" onClick={closeMenu}>ANIMALS</NavLink>
              <NavLink to="/landscapes" onClick={closeMenu}>LANDSCAPES</NavLink>
              <NavLink to="/info" onClick={closeMenu}>INFO</NavLink>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="text-gray-500 hover:text-black transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};
