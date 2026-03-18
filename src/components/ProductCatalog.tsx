import { ReactNode } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Product, products } from '../data/products';
import { ProductCard } from './ProductCard';

const CATEGORIES = ['All', 'Sofas', 'Chairs', 'Tables', 'Beds', 'Storage'];

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  onView3D?: (product: Product) => void;
  onAddToRoom?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCatalog({ 
  onSelectProduct, 
  onView3D, 
  onAddToRoom, 
  onAddToCart 
}: ProductCatalogProps): ReactNode {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products by category and search
  let filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );

  // Search filter
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (p) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div 
      id="catalog-section"
      className="max-w-7xl mx-auto px-4 py-24"
    >
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-[#2C3E50] dark:text-[#E5E7EB] mb-4"
        >
          Curated Comfort
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-[#6b6560] dark:text-[#9CA3AF] max-w-2xl mx-auto"
        >
          Explore our collection of minimalist, high-quality furniture designed
          for modern living.
        </motion.p>
      </div>

      {/* Search and Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
      >
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6560] dark:text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search furniture..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#2D333A] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A3C4BC] dark:focus:ring-[#86A789]"
          />
        </div>

        {/* Sort and Filter */}
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2.5 bg-white dark:bg-[#2D333A] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#A3C4BC]"
          >
            <option value="name">Sort by Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showFilters 
                ? 'bg-[#A3C4BC] border-[#A3C4BC] text-white' 
                : 'bg-white dark:bg-[#2D333A] border-[#E8E4DE] dark:border-[#3F454D] text-[#6b6560] dark:text-[#9CA3AF]'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-12"
      >
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[#2C3E50] dark:bg-[#86A789] text-white shadow-md'
                : 'bg-white dark:bg-[#2D333A] text-[#6b6560] dark:text-[#9CA3AF] hover:bg-[#E8E4DE] dark:hover:bg-[#3F454D] border border-[#E8E4DE] dark:border-[#3F454D]'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Results Count */}
      <p className="text-sm text-[#6b6560] dark:text-[#9CA3AF] mb-6">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Product Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.9
              }}
              transition={{
                duration: 0.3
              }}
            >
              <ProductCard
                product={product}
                onClick={() => onSelectProduct(product)}
                onView3D={onView3D ? () => onView3D(product) : undefined}
                onAddToRoom={onAddToRoom ? () => onAddToRoom(product) : undefined}
                onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-[#6b6560] dark:text-[#9CA3AF]">
            No products found matching your criteria.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 text-[#A3C4BC] dark:text-[#86A789] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
