import { motion } from 'framer-motion';
import { Shield, Zap, FileStack, Share2, Clock, Lock } from 'lucide-react';
import { TiltCard } from './ui/3d-card';
import { SpotlightCard } from './ui/spotlight';

const features = [
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your files are protected with 256-bit AES encryption. We take security as seriously as the biggest banks.',
    gradient: 'from-emerald-500 to-teal-500',
    bgGlow: 'bg-emerald-500/20',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Upload and download at maximum speed with our global CDN network. No more waiting around.',
    gradient: 'from-amber-500 to-orange-500',
    bgGlow: 'bg-amber-500/20',
  },
  {
    icon: FileStack,
    title: 'All File Types',
    description: 'Documents, images, videos, audio - we support them all. Preview files directly in your browser.',
    gradient: 'from-primary to-cloud-400',
    bgGlow: 'bg-primary/20',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share files and folders with anyone using secure links. Control access with passwords and expiry dates.',
    gradient: 'from-pink-500 to-rose-500',
    bgGlow: 'bg-pink-500/20',
  },
  {
    icon: Clock,
    title: 'Version History',
    description: 'Never lose your work. Access previous versions of your files for up to 30 days.',
    gradient: 'from-cyan-500 to-blue-500',
    bgGlow: 'bg-cyan-500/20',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data is yours. We never sell or share your information. Zero-knowledge encryption available.',
    gradient: 'from-violet-500 to-purple-500',
    bgGlow: 'bg-violet-500/20',
  },
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4"
          >
            Features
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-primary via-cloud-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
              manage your files
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            CloudVault combines powerful features with simplicity. Store, share, and collaborate on your files from anywhere.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <TiltCard className="h-full">
                <SpotlightCard className="h-full p-8 transition-all duration-300 hover:shadow-2xl">
                  <div className="relative">
                    {/* Icon with gradient background */}
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                      <div className={`absolute inset-0 ${feature.bgGlow} rounded-2xl blur-xl`} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                    {/* Decorative element */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '40%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className={`h-1 rounded-full bg-gradient-to-r ${feature.gradient} mt-6 opacity-50`}
                    />
                  </div>
                </SpotlightCard>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
