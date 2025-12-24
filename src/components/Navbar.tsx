import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isLandingPage
          ? 'bg-transparent'
          : 'bg-card/80 backdrop-blur-xl border-b border-border shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Logo />
          </motion.div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="text-foreground hover:bg-accent font-medium">
                  Login
                </Button>
              </motion.div>
            </Link>
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all font-medium">
                  Sign Up
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
