import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { GlowingCard } from './ui/3d-card';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Designer',
    avatar: 'SJ',
    content: 'CloudVault has transformed how our team handles file sharing. The security features are top-notch and the interface is incredibly intuitive.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    avatar: 'MC',
    content: 'I\'ve tried many cloud storage solutions, but CloudVault stands out with its speed and reliability. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Marketing Manager',
    avatar: 'ED',
    content: 'The collaboration features have made our remote work so much easier. We can share and access files seamlessly.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our customers have to say about their experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <GlowingCard className="h-full">
                <div className="p-6 h-full flex flex-col">
                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-primary/30 mb-4" />
                  
                  {/* Content */}
                  <p className="text-foreground/80 flex-grow mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </GlowingCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
