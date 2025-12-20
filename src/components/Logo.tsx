import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <motion.div
        whileHover={{ rotate: 15, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="relative"
      >
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Cloud className="w-6 h-6 text-primary-foreground" />
        </div>
      </motion.div>
      <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
        CloudVault
      </span>
    </Link>
  );
};

export default Logo;
