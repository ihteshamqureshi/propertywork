

import { useState } from "react";



import {
  Home,
  Info,
  Menu,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";


import { Link, useLocation } from "react-router-dom";




const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
    ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
        : "text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600"
    }`;

  const mobileClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
    ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        : "text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600"
    }`;






  return (



    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">

       
        <div className="flex items-center justify-between h-16">



        
          <Link to="/" className="flex items-center gap-2">
            <div className="w-11 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SSI-P</span>
            </div>

            <span className="font-bold text-lg text-gray-800">
              SSI Properties
            </span>
          </Link>



       
          <div className="hidden md:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">

            <Link to="/" className={navClass("/")}>
              <Home size={18} />
              Home
            </Link>

            <Link to="/details" className={navClass("/details")}>
              <Info size={18} />
              Details
            </Link>

          </div>



    
          <div className="hidden md:flex items-center gap-2">

            <Link to="/login" className={navClass("/login")}>
              <LogIn size={18} />
              Login
            </Link>

            <Link to="/signup" className={navClass("/signup")}>
              <UserPlus size={18} />
              Signup
            </Link>

          </div>



          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>



     
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">

            <div className="flex flex-col gap-2">

              <Link to="/" onClick={closeMenu} className={mobileClass("/")}>
                <Home size={20} />
                Home
              </Link>

              <Link to="/details" onClick={closeMenu} className={mobileClass("/details")}>
                <Info size={20} />
                Details
              </Link>

              <Link to="/login" onClick={closeMenu} className={mobileClass("/login")}>
                <LogIn size={20} />
                Login
              </Link>

              <Link to="/signup" onClick={closeMenu} className={mobileClass("/signup")}>
                <UserPlus size={20} />
                Signup
              </Link>

            </div>

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;