import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { Menu, X, Shield, Zap, Cloud, HelpCircle } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features', icon: Zap },
  { label: 'How It Works', href: '#how-it-works', icon: Cloud },
  { label: 'Security', href: '#stats', icon: Shield },
  { label: 'FAQ', href: '#faq', icon: HelpCircle },
];

const Navbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-background/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Logo />
            </motion.div>

            {/* Desktop nav links */}
            {isLandingPage && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="text-foreground hover:bg-accent font-medium">
                    Login
                  </Button>
                </motion.div>
              </Link>
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all font-medium">
                    Sign Up
                  </Button>
                </motion.div>
              </Link>

              {/* Mobile menu toggle */}
              {isLandingPage && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && isLandingPage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50 md:hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
