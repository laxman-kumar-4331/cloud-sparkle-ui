import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Button } from './ui/button';

const Navbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isLandingPage ? 'bg-transparent' : 'bg-card/80 backdrop-blur-xl border-b border-border'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Logo />
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground hover:bg-accent">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 transition-all">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
