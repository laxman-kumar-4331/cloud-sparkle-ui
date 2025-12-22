import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, FolderOpen, Upload, Share2, Lock, Cloud, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Spotlight } from './ui/spotlight';
import { TextGenerateEffect } from './ui/text-generate';
import { GradientBackground, BeamBackground } from './ui/gradient-bg';
import { HoverBorderGradient } from './ui/moving-border';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const floatingIcons = [
    { Icon: Upload, position: 'top-24 left-8 sm:left-24', delay: 0 },
    { Icon: Share2, position: 'top-36 right-8 sm:right-28', delay: 0.2 },
    { Icon: Lock, position: 'bottom-40 left-12 sm:left-36', delay: 0.4 },
    { Icon: FolderOpen, position: 'bottom-28 right-12 sm:right-20', delay: 0.6 },
    { Icon: Cloud, position: 'top-48 left-1/4', delay: 0.8 },
    { Icon: Sparkles, position: 'bottom-52 right-1/3', delay: 1 },
  ];

  const flipWords = ['Files', 'Documents', 'Photos', 'Videos', 'Data'];

  return (
    <GradientBackground containerClassName="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      
      {/* Beam Background */}
      <BeamBackground className="opacity-30" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Floating icons with enhanced animation */}
      {floatingIcons.map(({ Icon, position, delay }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 0.7, scale: 1, rotate: 0 }}
          transition={{ delay: 1.5 + delay, duration: 0.6, type: 'spring' }}
          className={`absolute ${position} hidden md:block`}
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: delay }}
            className="w-14 h-14 rounded-2xl bg-card/80 backdrop-blur-sm shadow-xl border border-border/50 flex items-center justify-center group hover:scale-110 transition-transform cursor-pointer"
          >
            <Icon className="w-7 h-7 text-primary group-hover:text-primary/80 transition-colors" />
          </motion.div>
        </motion.div>
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Animated Badge */}
          <motion.div variants={itemVariants}>
            <HoverBorderGradient
              containerClassName="mx-auto mb-8"
              className="px-5 py-2.5 flex items-center gap-2"
              as="div"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-foreground">256-bit Encryption • 99.9% Uptime • Unlimited Storage</span>
            </HoverBorderGradient>
          </motion.div>

          {/* Main Heading with Text Generate Effect */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1]">
              <span className="text-foreground">Secure Cloud</span>
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-cloud-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                  Storage Solution
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle with Text Generate */}
          <motion.div variants={itemVariants} className="mb-10">
            <TextGenerateEffect
              words="Upload, manage, and access your files anytime, anywhere. Experience lightning-fast speeds with enterprise-grade security."
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed"
            />
          </motion.div>

          {/* CTA Buttons with enhanced animation */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="relative overflow-hidden gradient-primary text-primary-foreground px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-glow transition-all group"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </Button>
              </motion.div>
            </Link>
            <Link to="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-7 text-lg font-semibold border-2 border-border hover:border-primary/50 hover:bg-accent/50 backdrop-blur-sm transition-all"
                >
                  View Demo
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust Indicators with staggered animation */}
          <motion.div
            variants={itemVariants}
            className="mt-16 sm:mt-20"
          >
            <motion.p 
              className="text-sm text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Trusted by 10,000+ users worldwide
            </motion.p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {[
                { Icon: Shield, label: 'Bank-level Security', color: 'text-emerald-500' },
                { Icon: Zap, label: 'Lightning Fast', color: 'text-amber-500' },
                { Icon: FolderOpen, label: 'All File Types', color: 'text-primary' },
              ].map(({ Icon, label, color }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-border/50"
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </GradientBackground>
  );
};

export default Hero;
