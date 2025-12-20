import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

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
  },
];

const Pricing = () => {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent
            <span className="text-gradient"> pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              whileHover={{ y: -5 }}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? 'bg-card border-2 border-primary shadow-xl shadow-primary/10'
                  : 'bg-card border border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="gradient-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-3">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="text-center py-4 rounded-xl bg-accent/50 mb-6">
                  <span className="text-2xl font-bold text-primary">{plan.storage}</span>
                  <span className="text-muted-foreground ml-2">storage</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/signup">
                <Button
                  className={`w-full py-6 text-lg font-semibold ${
                    plan.highlighted
                      ? 'gradient-primary text-primary-foreground shadow-lg hover:shadow-glow'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  } transition-all hover:scale-[1.02]`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
