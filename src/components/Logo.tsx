import { motion } from 'framer-motion';

// Custom KONTUR Logo Icon - Modern K letter mark with furniture design
export function KonturLogo({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Modern K letter mark with furniture design */}
      <path 
        d="M8 8V32M8 20H22L32 32M22 20L32 8" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-[#2C3E50] dark:text-[#86A789]"
      />
      {/* Accent dot representing quality/premium */}
      <circle 
        cx="32" 
        cy="8" 
        r="3" 
        fill="currentColor" 
        className="text-[#86A789] dark:text-[#A3C4BC]"
      />
    </svg>
  );
}

// Logo with Brand Name - For use in headers
export function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const getSizeClasses = (s: string) => {
    switch (s) {
      case "sm":
        return { icon: "w-8 h-8", text: "text-lg", spacing: "gap-2" };
      case "lg":
        return { icon: "w-12 h-12", text: "text-2xl", spacing: "gap-3" };
      default:
        return { icon: "w-9 h-9", text: "text-xl", spacing: "gap-2.5" };
    }
  };
  
  const classes = getSizeClasses(size);
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center ${classes.spacing} cursor-pointer`}
    >
      <div className={classes.icon}>
        <KonturLogo className="w-full h-full" />
      </div>
      <span className={`font-bold ${classes.text} tracking-[0.2em] text-[#2C3E50] dark:text-[#E5E7EB] hover:text-[#86A789] dark:hover:text-[#A3C4BC] transition-colors`}>
        KONTUR
      </span>
    </motion.div>
  );
}

// Logo Icon Only - For use in buttons, cards, etc.
export function LogoIcon({ size = "md", withAnimation = false }: { size?: "sm" | "md" | "lg", withAnimation?: boolean }) {
  const getSizeClasses = (s: string) => {
    switch (s) {
      case "sm":
        return "w-8 h-8";
      case "lg":
        return "w-16 h-16";
      default:
        return "w-10 h-10";
    }
  };
  
  const sizeClasses = getSizeClasses(size);
  
  const Icon = () => (
    <div className={sizeClasses}>
      <KonturLogo className="w-full h-full" />
    </div>
  );
  
  if (withAnimation) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon />
      </motion.div>
    );
  }
  
  return <Icon />;
}
