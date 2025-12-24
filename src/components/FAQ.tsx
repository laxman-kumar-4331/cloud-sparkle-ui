import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How secure is my data?',
    answer: 'Your data is protected with 256-bit AES encryption, both in transit and at rest. We also implement zero-knowledge encryption for maximum privacy.',
  },
  {
    question: 'Can I access my files offline?',
    answer: 'Yes! Our desktop and mobile apps support offline access. Files are synced automatically when you\'re back online.',
  },
  {
    question: 'What file types are supported?',
    answer: 'We support all file types including documents, images, videos, audio files, and more. There are no restrictions on file formats.',
  },
  {
    question: 'How do I share files with others?',
    answer: 'You can share files via secure links, email invitations, or by adding collaborators directly. You control who can view, edit, or download.',
  },
  {
    question: 'Is there a file size limit?',
    answer: 'Free users can upload files up to 2GB each. Pro and Enterprise users enjoy unlimited file sizes.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely! You can cancel your subscription at any time. Your data will remain accessible until the end of your billing period.',
  },
];

const FAQ = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about CloudVault
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
