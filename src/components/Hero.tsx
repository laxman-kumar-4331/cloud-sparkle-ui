import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, FolderOpen, Upload, Share2, Lock } from 'lucide-react';
import { Button } from './ui/button';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const floatingIcons = [
    { Icon: Upload, position: 'top-20 left-10 sm:left-20', delay: 0 },
    { Icon: Share2, position: 'top-32 right-10 sm:right-32', delay: 0.2 },
    { Icon: Lock, position: 'bottom-32 left-16 sm:left-32', delay: 0.4 },
    { Icon: FolderOpen, position: 'bottom-20 right-16 sm:right-24', delay: 0.6 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-accent/30 rounded-full blur-3xl" />
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, position, delay }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 1 + delay, duration: 0.5 }}
          className={`absolute ${position} hidden md:block`}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: delay }}
            className="w-12 h-12 rounded-2xl bg-card shadow-lg flex items-center justify-center"
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              256-bit Encryption • 99.9% Uptime
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
          >
            <span className="text-foreground">Secure Cloud Storage</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-cloud-400 bg-clip-text text-transparent">for All Your Files</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            Upload, manage, and access your files anytime, anywhere. Experience lightning-fast speeds with enterprise-grade security.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-glow hover:scale-105 transition-all group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent"
              >
                View Demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            {[
              { Icon: Shield, label: 'Bank-level Security' },
              { Icon: Zap, label: 'Lightning Fast' },
              { Icon: FolderOpen, label: 'All File Types' },
            ].map(({ Icon, label }, index) => (
              <div key={index} className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
