import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, Shield, Cloud } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { Spotlight } from '@/components/ui/spotlight';
import { GridBackground } from '@/components/ui/gradient-bg';
import { GlowingCard } from '@/components/ui/3d-card';
import { HoverBorderGradient } from '@/components/ui/moving-border';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signup(name, email, password);

    if (error) {
      let message = 'Something went wrong. Please try again.';
      if (error.message.includes('already registered')) {
        message = 'This email is already registered. Please sign in instead.';
      } else if (error.message) {
        message = error.message;
      }
      
      toast({
        title: 'Signup failed',
        description: message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: 'Account created!',
      description: 'Welcome to CloudVault. Redirecting to dashboard...',
    });
    
    setIsLoading(false);
  };

  const floatingIcons = [
    { Icon: Sparkles, delay: 0, x: -130, y: -100 },
    { Icon: Shield, delay: 0.2, x: 130, y: -80 },
    { Icon: Cloud, delay: 0.4, x: -110, y: 100 },
  ];

  const features = [
    { icon: '🔒', text: 'Secure Storage' },
    { icon: '☁️', text: 'Cloud Backup' },
    { icon: '⚡', text: 'Fast Access' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated Background */}
      <GridBackground />
      <Spotlight className="top-0 left-1/4" fill="hsl(var(--primary))" />
      <Spotlight className="bottom-0 right-1/4" fill="hsl(var(--accent))" />
      
      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] bg-gradient-to-tl from-accent/30 to-primary/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1.3, 1, 1.3],
          rotate: [360, 180, 0],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingIcons.map(({ Icon, delay, x, y }, index) => (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [0.8, 1, 0.8],
                x: [x, x + 15, x],
                y: [y, y - 15, y],
              }}
              transition={{ 
                duration: 5,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-8 h-8 text-primary/40" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Logo />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create your account
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Start storing your files securely today
            </motion.p>

            {/* Feature badges */}
            <motion.div 
              className="flex justify-center gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {features.map((feature, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1.5 bg-primary/10 rounded-full text-sm text-primary border border-primary/20 flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--primary) / 0.2)' }}
                >
                  <span>{feature.icon}</span>
                  <span>{feature.text}</span>
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Form Card */}
          <GlowingCard className="p-0">
            <motion.div
              className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11 py-6 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 py-6 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 py-6 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Must be at least 6 characters
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <HoverBorderGradient
                    as="button"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground disabled:opacity-50"
                    containerClassName="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Create Account
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </span>
                    )}
                  </HoverBorderGradient>
                </motion.div>
              </form>

              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary font-medium hover:text-primary/80 transition-colors relative group"
                  >
                    Sign in
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </GlowingCard>

          <motion.p 
            className="text-center text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
