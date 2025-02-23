
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "text-gray-500 hover:text-black transition-colors duration-200",
        isActive && "text-black font-medium"
      )}
    >
      {children}
    </Link>
  );
};

export const Layout = ({ children }) => {
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
            ERIC RYAN ANDERSON
          </Link>
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
        </div>
      </motion.nav>

      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};
