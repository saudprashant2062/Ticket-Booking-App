import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white tracking-tight">
              SORT<span className="gradient-text">my</span>SCENE
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/events"
                  className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  Events
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white/50 hidden sm:block">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-white/70 hover:text-white font-medium px-4 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;