
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }
    })
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/meals', label: 'My Meals' },
    { path: '/spinner', label: 'Spin!' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHomePage ? 'py-6' : 'py-4 glass-panel bg-white/60 shadow-subtle'}`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <Utensils className="w-6 h-6 text-primary" />
            <span className="text-xl font-medium">Spinner<span className="text-primary">Eats</span></span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-muted-foreground"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 right-0 glass-panel pb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="container max-w-6xl mx-auto px-4 pt-2 pb-4 flex flex-col space-y-3">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => `nav-link block py-2 ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
