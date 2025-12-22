import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card3D, GlowingCard } from './ui/3d-card';
import { BorderBeam } from './ui/moving-border';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal use and trying out CloudVault.',
    storage: '5 GB',
    features: [
      '5 GB storage',
      'Basic file sharing',
      'Web & mobile access',
      'Standard support',
      '2 GB max file size',
    ],
    highlighted: false,
    buttonText: 'Get Started',
    gradient: 'from-slate-500 to-slate-600',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'For professionals who need more power and flexibility.',
    storage: '2 TB',
    features: [
      '2 TB storage',
      'Advanced sharing controls',
      'Priority support',
      'File versioning (30 days)',
      '10 GB max file size',
      'Offline access',
      'Password-protected links',
    ],
    highlighted: true,
    buttonText: 'Start Free Trial',
    gradient: 'from-primary to-cloud-400',
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: 'per user/month',
    description: 'For teams that need advanced security and admin controls.',
    storage: 'Unlimited',
    features: [
      'Unlimited storage',
      'Admin dashboard',
      'Advanced security controls',
      'SSO & 2FA',
      'Dedicated support',
      'Custom branding',
      'API access',
      'Audit logs',
    ],
    highlighted: false,
    buttonText: 'Contact Sales',
    gradient: 'from-violet-500 to-purple-600',
  },
];

const Pricing = () => {
  return (
    <section className="py-24 sm:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
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
            Pricing
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Simple, transparent
            <br />
            <span className="bg-gradient-to-r from-primary via-cloud-400 to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for you. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.highlighted ? (
                <Card3D containerClassName="h-full">
                  <div className="relative rounded-3xl p-8 bg-card border-2 border-primary/50 h-full">
                    {/* Border beam effect */}
                    <BorderBeam size={250} duration={12} delay={index * 2} />
                    
                    {/* Popular badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="gradient-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-lg"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Most Popular
                      </motion.span>
                    </div>

                    <PricingContent plan={plan} index={index} />
                  </div>
                </Card3D>
              ) : (
                <GlowingCard className="h-full">
                  <div className="rounded-3xl p-8 bg-card h-full">
                    <PricingContent plan={plan} index={index} />
                  </div>
                </GlowingCard>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingContent = ({ plan, index }: { plan: typeof plans[0]; index: number }) => (
  <>
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
      <div className="flex items-baseline justify-center gap-1">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
        >
          {plan.price}
        </motion.span>
        <span className="text-muted-foreground">/{plan.period}</span>
      </div>
      <p className="text-muted-foreground mt-3">{plan.description}</p>
    </div>

    <div className="mb-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center py-4 rounded-xl bg-accent/50 mb-6 border border-border/50"
      >
        <span className={`text-2xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
          {plan.storage}
        </span>
        <span className="text-muted-foreground ml-2">storage</span>
      </motion.div>

      <ul className="space-y-3">
        {plan.features.map((feature, featureIndex) => (
          <motion.li
            key={featureIndex}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + featureIndex * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-foreground">{feature}</span>
          </motion.li>
        ))}
      </ul>
    </div>

    <Link to="/signup" className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          className={`w-full py-6 text-lg font-semibold ${
            plan.highlighted
              ? 'gradient-primary text-primary-foreground shadow-lg hover:shadow-glow'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          } transition-all`}
        >
          {plan.buttonText}
        </Button>
      </motion.div>
    </Link>
  </>
);

export default Pricing;
