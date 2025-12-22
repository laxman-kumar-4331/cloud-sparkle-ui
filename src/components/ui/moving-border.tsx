import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: any;
  [key: string]: any;
}) => {
  return (
    <Component
      className={cn(
        "relative overflow-hidden bg-transparent p-[1px]",
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)`,
        }}
      >
        <motion.div
          className={cn("h-full w-full", borderClassName)}
          style={{
            background: `conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent)`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: duration / 1000,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <div
        className={cn(
          "relative bg-card backdrop-blur-xl rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
};

export const HoverBorderGradient = ({
  children,
  className,
  containerClassName,
  as: Component = "button",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: any;
  [key: string]: any;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Component
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("relative rounded-full p-[2px] overflow-hidden", containerClassName)}
      {...props}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: hovered
            ? `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--cloud-400)), hsl(var(--primary)))`
            : `linear-gradient(90deg, hsl(var(--border)), hsl(var(--border)))`,
        }}
        animate={{
          backgroundPosition: hovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className={cn("relative bg-card rounded-full", className)}>
        {children}
      </div>
    </Component>
  );
};

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "hsl(var(--primary))",
  colorTo = "hsl(var(--cloud-400))",
  delay = 0,
}: {
  className?: string;
  size?: number;
  duration?: number;
  anchor?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className
      )}
    />
  );
};
