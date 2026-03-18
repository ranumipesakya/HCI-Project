import { motion } from 'framer-motion';
import { SearchIcon, MenuIcon, SunIcon, MoonIcon } from 'lucide-react';
import { BrandLogo } from './Logo';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onHome: () => void;
}

export function Header({ darkMode, onToggleDarkMode, onHome }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#F5F5F5]/80 dark:bg-[#1A1E24]/80 backdrop-blur-md z-50 border-b border-[#E8E4DE] dark:border-[#3F454D]">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <BrandLogo size="md" />

        <div className="flex items-center gap-2 text-[#2C3E50] dark:text-[#E5E7EB]">
          {/* Dark Mode Toggle */}
          <motion.button
            aria-label="Toggle dark mode"
            onClick={onToggleDarkMode}
            whileHover={{ scale: 1.15, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 hover:bg-[#E8E4DE] dark:hover:bg-[#3F454D] rounded-xl transition-all duration-200 hover:shadow-md"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-[#86A789]" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </motion.button>
          
          <motion.button
            aria-label="Search"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 hover:bg-[#E8E4DE] dark:hover:bg-[#3F454D] rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <SearchIcon className="w-5 h-5" />
          </motion.button>
          <motion.button
            aria-label="Menu"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2.5 hover:bg-[#E8E4DE] dark:hover:bg-[#3F454D] rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <MenuIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
