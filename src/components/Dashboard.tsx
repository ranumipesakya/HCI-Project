import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Grid, 
  List, 
  Search, 
  Trash2, 
  Edit3, 
  Copy, 
  MoreVertical,
  Clock,
  ChevronRight,
  LayoutGrid,
  Box,
  Sun,
  Moon,
  BoxSelect
} from 'lucide-react';
import { BrandLogo, LogoIcon } from './Logo';

interface Design {
  id: string;
  name: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  roomSize: string;
  itemCount: number;
}

interface DashboardProps {
  user: string;
  designs?: Design[];
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onLogout: () => void;
  onNewDesign: () => void;
  onOpenDesign: (id: string) => void;
  onEditDesign: (id: string) => void;
  onDeleteDesign: (id: string) => void;
  onOpen3DStudio?: () => void;
}

// Mock saved designs - kept for reference but not used (designs come from session storage)
// const mockDesigns: Design[] = [
//   {
//     id: '1',
//     name: 'Living Room v1',
//     thumbnail: '',
//     createdAt: '2024-01-15',
//     updatedAt: '2024-01-20',
//     roomSize: '4m x 5m',
//     itemCount: 8
//   },
//   {
//     id: '2',
//     name: 'Master Bedroom',
//     thumbnail: '',
//     createdAt: '2024-01-10',
//     updatedAt: '2024-01-12',
//     roomSize: '3.5m x 4m',
//     itemCount: 5
//   },
//   {
//     id: '3',
//     name: 'Office Space',
//     thumbnail: '',
//     createdAt: '2024-01-05',
//     updatedAt: '2024-01-08',
//     roomSize: '3m x 3m',
//     itemCount: 4
//   }
// ];

export function Dashboard({ user, designs, darkMode, onToggleDarkMode, onLogout, onNewDesign, onOpenDesign, onEditDesign, onDeleteDesign, onOpen3DStudio }: DashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Use designs from props
  const filteredDesigns = designs ? designs.filter(design => 
    design.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1E24]">
      {/* Header */}
      <header className="bg-white dark:bg-[#2D333A] border-b border-[#E8E4DE] dark:border-[#3F454D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <LogoIcon size="md" withAnimation />
              <span className="text-xl font-bold text-[#2C3E50] dark:text-[#E5E7EB]">KONTUR</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              {onToggleDarkMode && (
                <motion.button
                  aria-label="Toggle dark mode"
                  onClick={onToggleDarkMode}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-[#E8E4DE] dark:hover:bg-[#3F454D] rounded-full transition-colors"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-[#86A789]" />
                  ) : (
                    <Moon className="w-5 h-5 text-[#2C3E50]" />
                  )}
                </motion.button>
              )}
              <span className="text-[#6b6560] dark:text-[#9CA3AF] hidden sm:block">
                Welcome, <span className="font-medium text-[#2C3E50] dark:text-[#E5E7EB]">{user.split('@')[0]}</span>
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C3E50] dark:text-[#E5E7EB]">My Designs</h1>
          <p className="text-[#6b6560] dark:text-[#9CA3AF] mt-2">
            Manage your room designs and create new visualizations
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6560] dark:text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designs..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#2D333A] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A3C4BC] dark:focus:ring-[#86A789] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-[#2D333A] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#A3C4BC] dark:bg-[#86A789] text-white' : 'text-[#6b6560] dark:text-[#9CA3AF]'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#A3C4BC] dark:bg-[#86A789] text-white' : 'text-[#6b6560] dark:text-[#9CA3AF]'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* 3D Studio Button */}
            {onOpen3DStudio && (
              <motion.button
                onClick={onOpen3DStudio}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#86A789] dark:bg-[#A3C4BC] text-white dark:text-[#1A1E24] rounded-xl font-medium hover:bg-[#6B8B6D] dark:hover:bg-[#7BA39E] transition-colors"
              >
                <BoxSelect className="w-5 h-5" />
                3D Studio
              </motion.button>
            )}

            {/* New Design Button */}
            <motion.button
              onClick={onNewDesign}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2C3E50] dark:bg-[#86A789] text-white dark:text-[#1A1E24] rounded-xl font-medium hover:bg-[#1a2530] dark:hover:bg-[#6B8B6D] transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Design
            </motion.button>
          </div>
        </div>

        {/* Designs Grid/List */}
        {filteredDesigns.length === 0 ? (
          <div className="text-center py-20">
            <LayoutGrid className="w-16 h-16 mx-auto text-[#E8E4DE] dark:text-[#3F454D] mb-4" />
            <h3 className="text-xl font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-2">No designs yet</h3>
            <p className="text-[#6b6560] dark:text-[#9CA3AF] mb-6">Create your first room design to get started</p>
            <motion.button
              onClick={onNewDesign}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C3E50] dark:bg-[#86A789] text-white dark:text-[#1A1E24] rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Design
            </motion.button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-[#2D333A] rounded-2xl border border-[#E8E4DE] dark:border-[#3F454D] hover:shadow-xl transition-all overflow-visible"
              >
                {/* Thumbnail */}
                <div 
                  className="aspect-video bg-gradient-to-br from-[#F5F5F5] to-[#E8E4DE] dark:from-[#1A1E24] dark:to-[#2D333A] flex items-center justify-center cursor-pointer relative overflow-hidden rounded-t-2xl"
                  onClick={() => onOpenDesign(design.id)}
                >
                  <Box className="w-16 h-16 text-[#E8E4DE] dark:text-[#3F454D]" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/90 text-[#2C3E50] rounded-full text-sm font-medium">
                      Open Design
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#2C3E50] dark:text-[#E5E7EB]">{design.name}</h3>
                      <p className="text-sm text-[#6b6560] dark:text-[#9CA3AF] mt-1">
                        {design.roomSize} • {design.itemCount} items
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === design.id ? null : design.id)}
                        className="p-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24] transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {menuOpenId === design.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#2D333A] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl shadow-lg overflow-hidden z-10"
                        >
                          <button
                            onClick={() => { onEditDesign(design.id); setMenuOpenId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-[#2C3E50] dark:text-[#E5E7EB] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24]"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => { onOpenDesign(design.id); setMenuOpenId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-[#2C3E50] dark:text-[#E5E7EB] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24]"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => { onDeleteDesign(design.id); setMenuOpenId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-[#6b6560] dark:text-[#9CA3AF]">
                    <Clock className="w-3.5 h-3.5" />
                    Updated {design.updatedAt}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-4 bg-white dark:bg-[#2D333A] rounded-xl p-4 border border-[#E8E4DE] dark:border-[#3F454D] hover:shadow-md transition-all cursor-pointer"
                onClick={() => onOpenDesign(design.id)}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#F5F5F5] to-[#E8E4DE] dark:from-[#1A1E24] dark:to-[#2D333A] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Box className="w-8 h-8 text-[#E8E4DE] dark:text-[#3F454D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#2C3E50] dark:text-[#E5E7EB]">{design.name}</h3>
                  <p className="text-sm text-[#6b6560] dark:text-[#9CA3AF]">
                    {design.roomSize} • {design.itemCount} items
                  </p>
                  <p className="text-xs text-[#6b6560] dark:text-[#9CA3AF] mt-1">
                    Updated {design.updatedAt}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6b6560] dark:text-[#9CA3AF] group-hover:text-[#2C3E50] dark:group-hover:text-[#E5E7EB] transition-colors" />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
