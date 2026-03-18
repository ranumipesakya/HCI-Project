import { motion } from 'framer-motion';
import { ArrowLeftIcon, PencilIcon } from 'lucide-react';
import { Product } from '../data/products';

interface ProductDetailProps {
  product: Product;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onBack: () => void;
}

export function ProductDetail({
  product,
  selectedColor,
  onColorChange,
  onBack
}: ProductDetailProps) {
  const handleStartDesign = () => {
    console.log('Start Design clicked:', {
      product: product.name,
      category: product.category,
      selectedColor: selectedColor,
      dimensions: product.dimensions,
      materials: product.materials
    });
  };

  return (
    <div className="h-full bg-[#F5F5F5] dark:bg-[#2D333A] p-6 md:p-10 overflow-y-auto flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] transition-colors w-fit mb-8 group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Catalog</span>
      </button>

      <div className="flex-1">
        <div className="mb-2 text-sm font-medium text-[#A3C4BC] dark:text-[#86A789] uppercase tracking-wider">
          {product.category}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] dark:text-[#E5E7EB] mb-4">
          {product.name}
        </h1>

        <p className="text-[#6b6560] dark:text-[#9CA3AF] leading-relaxed mb-10">
          {product.description}
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-[#2C3E50] dark:text-[#E5E7EB] uppercase tracking-wider mb-4">
              Select Color
            </h3>
            <div className="flex flex-wrap gap-4">
              {product.colorVariants.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => onColorChange(variant.color)}
                  className="group flex flex-col items-center gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === variant.color
                        ? 'border-[#2C3E50] dark:border-[#86A789] scale-110 shadow-md'
                        : 'border-transparent shadow-sm hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: variant.color
                    }}
                  />
                  <span
                    className={`text-xs ${
                      selectedColor === variant.color
                        ? 'text-[#2C3E50] dark:text-[#E5E7EB] font-medium'
                        : 'text-[#6b6560] dark:text-[#9CA3AF]'
                    }`}
                  >
                    {variant.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#E8E4DE] dark:border-[#3F454D]">
            <div>
              <h3 className="text-sm font-semibold text-[#2C3E50] dark:text-[#E5E7EB] uppercase tracking-wider mb-2">
                Dimensions
              </h3>
              <ul className="text-sm text-[#6b6560] dark:text-[#9CA3AF] space-y-1">
                <li>Width: {product.dimensions.width} cm</li>
                <li>Depth: {product.dimensions.depth} cm</li>
                <li>Height: {product.dimensions.height} cm</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2C3E50] dark:text-[#E5E7EB] uppercase tracking-wider mb-2">
                Materials
              </h3>
              <ul className="text-sm text-[#6b6560] dark:text-[#9CA3AF] space-y-1">
                {product.materials.map((mat, i) => (
                  <li key={i}>{mat}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6">
        <motion.button
          onClick={handleStartDesign}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 30px rgba(44, 62, 80, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#2C3E50] dark:bg-[#86A789] text-white dark:text-[#1A1E24] py-4 rounded-xl font-medium hover:bg-[#1a2530] dark:hover:bg-[#6B8B6D] transition-colors shadow-lg shadow-black/10 relative overflow-hidden group"
        >
          {/* Shine Effect */}
          <motion.div
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <PencilIcon className="w-5 h-5" />
            Start Design
          </span>
        </motion.button>
      </div>
    </div>
  );
}
