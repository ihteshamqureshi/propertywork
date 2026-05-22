import React, { useState } from 'react';
import { Home, Info, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Links to Home */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <div className="w-12 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <span className="text-white font-bold text-sm">SSI-P</span>
            </div>
            <span className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
              SSI Properties
            </span>
          </Link>

          {/* Desktop Menu - 2 pages with Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`
                flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${location.pathname === '/' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'
                }
              `}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="/details"
              className={`
                flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${location.pathname === '/details' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'
                }
              `}
            >
              <Info size={18} />
              <span>Details</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={closeMenu}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${location.pathname === '/' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'
                  }
                `}
              >
                <Home size={20} />
                <span>Home Page</span>
              </Link>

              <Link
                to="/details"
                onClick={closeMenu}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${location.pathname === '/details' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'
                  }
                `}
              >
                <Info size={20} />
                <span>Details Page</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;