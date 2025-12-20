import { motion } from 'framer-motion';
import { Shield, Zap, FileStack, Share2, Clock, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your files are protected with 256-bit AES encryption. We take security as seriously as the biggest banks.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Upload and download at maximum speed with our global CDN network. No more waiting around.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    icon: FileStack,
    title: 'All File Types',
    description: 'Documents, images, videos, audio - we support them all. Preview files directly in your browser.',
    color: 'text-primary',
    bgColor: 'bg-cloud-50',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share files and folders with anyone using secure links. Control access with passwords and expiry dates.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    icon: Clock,
    title: 'Version History',
    description: 'Never lose your work. Access previous versions of your files for up to 30 days.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data is yours. We never sell or share your information. Zero-knowledge encryption available.',
    color: 'text-violet-500',
    bgColor: 'bg-violet-50',
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
    <section className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything you need to
            <span className="text-gradient"> manage your files</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
