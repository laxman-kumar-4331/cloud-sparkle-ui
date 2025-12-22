import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const GradientBackground = ({
  className,
  children,
  containerClassName,
}: {
  className?: string;
  children?: React.ReactNode;
  containerClassName?: string;
}) => {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={cn(
            "absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-3xl",
            className
          )}
          animate={{
            x: [0, 100, 50, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-l from-accent/40 to-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, -100, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 w-72 h-72 bg-gradient-to-t from-cloud-400/20 to-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -40, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      {children}
    </div>
  );
};

export const GridBackground = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      {children}
    </div>
  );
};

export const BeamBackground = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute h-[300px] w-[2px] bg-gradient-to-b from-transparent via-primary to-transparent"
        style={{ left: "20%" }}
        animate={{
          y: ["-100%", "200%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
          delay: 0,
        }}
      />
      <motion.div
        className="absolute h-[200px] w-[2px] bg-gradient-to-b from-transparent via-accent-foreground/50 to-transparent"
        style={{ left: "50%" }}
        animate={{
          y: ["-100%", "200%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute h-[250px] w-[2px] bg-gradient-to-b from-transparent via-primary/70 to-transparent"
        style={{ left: "80%" }}
        animate={{
          y: ["-100%", "200%"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
          delay: 1,
        }}
      />
    </div>
  );
};
