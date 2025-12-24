import { motion } from 'framer-motion';
import { Upload, Shield, Download, Zap } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Files',
    description: 'Drag and drop or select files to upload. We support all major file formats.',
    gradient: 'from-primary to-primary/60',
  },
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'Your files are encrypted and stored securely in our cloud infrastructure.',
    gradient: 'from-accent to-accent/60',
  },
  {
    icon: Zap,
    title: 'Instant Access',
    description: 'Access your files from anywhere, on any device, at lightning speed.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Download,
    title: 'Share & Download',
    description: 'Share files with anyone or download them whenever you need.',
    gradient: 'from-accent to-primary',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Simple & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Secure</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in minutes with our intuitive platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4`}
                >
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
