import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Box, Layers, MousePointer2 } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onDesign?: () => void;
}

export function Hero({ onExplore, onDesign }: HeroProps) {
  const floatingShapes = [
    { delay: 0, duration: 6, size: 20, x: '10%', y: '20%' },
    { delay: 1, duration: 8, size: 15, x: '85%', y: '15%' },
    { delay: 2, duration: 7, size: 25, x: '75%', y: '70%' },
    { delay: 0.5, duration: 9, size: 18, x: '15%', y: '75%' },
    { delay: 1.5, duration: 5, size: 12, x: '60%', y: '25%' },
    { delay: 2.5, duration: 10, size: 22, x: '25%', y: '45%' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8F7F4] via-[#F0EDE8] to-[#E5E2DB] dark:from-[#0F1115] dark:via-[#161A1F] dark:to-[#1E2329]">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h80v80H0V0zm10 10h60v60H10V10z' fill='%232C3E50' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Floating Animated Blobs */}
      {floatingShapes.slice(0, 3).map((shape, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            opacity: { duration: shape.duration, repeat: Infinity, delay: shape.delay },
            scale: { duration: shape.duration, repeat: Infinity, delay: shape.delay },
            rotate: { duration: shape.duration * 2, repeat: Infinity, ease: "linear", delay: shape.delay },
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: shape.size * 5,
            height: shape.size * 5,
            left: shape.x,
            top: shape.y,
            background: i === 0 
              ? 'linear-gradient(135deg, #A3C4BC 0%, #86A789 100%)'
              : i === 1
              ? 'linear-gradient(135deg, #2C3E50 0%, #4A6B5A 100%)'
              : 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)',
            filter: 'blur(50px)',
          }}
        />
      ))}

      {/* Ambient Light Orbs */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(163, 196, 188, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(134, 167, 137, 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-[#1E2329]/80 backdrop-blur-md shadow-lg shadow-[#86A789]/10 border border-[#86A789]/20 mb-10"
        >
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative flex h-2 w-2"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86A789] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#86A789]"></span>
          </motion.span>
          <span className="text-sm font-semibold text-[#2C3E50] dark:text-[#E5E7EB]">
            New Collection 2026
          </span>
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-1 text-xs text-[#86A789] font-medium"
          >
            <Sparkles className="w-3 h-3" />
            Just Arrived
          </motion.span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#1A1A1A] dark:text-[#F5F5F5] mb-8 tracking-tight"
        >
          <motion.span 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="block"
          >
            Elevate Your
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="block mt-3"
          >
            <span className="bg-gradient-to-r from-[#2C3E50] via-[#4A6B5A] to-[#86A789] dark:from-[#86A789] dark:via-[#A3C4BC] dark:to-[#86A789] bg-clip-text text-transparent">
              Living Space
            </span>
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-[#6B6560] dark:text-[#9CA3AF] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Discover handcrafted furniture that blends timeless elegance with modern design.
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="block mt-2 text-[#86A789] font-medium"
          >
            Each piece tells a story of quality, comfort, and sustainable craftsmanship.
          </motion.span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20"
        >
          {/* Primary Button */}
          <motion.button
            onClick={onExplore}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(44, 62, 80, 0.35)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 bg-gradient-to-r from-[#2C3E50] to-[#3D5A6E] dark:from-[#86A789] dark:to-[#6B8E7D] text-white font-bold rounded-2xl overflow-hidden shadow-2xl shadow-[#2C3E50]/25 dark:shadow-[#86A789]/30"
          >
            <span className="relative z-10 flex items-center gap-3 text-lg">
              Explore Collection
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </span>
            {/* Animated Shine */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              whileHover={{ x: '100%', opacity: 0.4 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            onClick={onDesign}
            whileHover={{ 
              scale: 1.05,
              borderColor: '#86A789',
              backgroundColor: 'rgba(134, 167, 137, 0.08)',
            }}
            whileTap={{ scale: 0.95 }}
            className="group px-10 py-5 border-2 border-[#2C3E50]/30 dark:border-[#3F454D] dark:text-[#E5E7EB] text-[#2C3E50] font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#86A789]/15 backdrop-blur-sm"
          >
            <span className="flex items-center gap-3 text-lg">
              Design Your Room
              <Sparkles className="w-5 h-5 text-[#86A789]" />
            </span>
          </motion.button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-3 gap-8 md:gap-16 max-w-3xl mx-auto"
        >
          {[
            { value: '15K+', label: 'Happy Customers', icon: MousePointer2 },
            { value: '200+', label: 'Unique Designs', icon: Box },
            { value: '10Y', label: 'Warranty', icon: Layers },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#86A789]/10 to-[#A3C4BC]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative flex flex-col items-center p-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-3 p-3 rounded-xl bg-gradient-to-br from-[#86A789] to-[#6B8E7D] shadow-lg"
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#4A6B5A] dark:from-[#E5E7EB] dark:to-[#A3C4BC] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-[#6B6560] dark:text-[#9CA3AF] mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F7F4] dark:from-[#0F1115] to-transparent pointer-events-none" />
    </section>
  );
}
