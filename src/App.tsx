// App integration updates by Kusalvin
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductViewer3D } from './components/ProductViewer3D';
import { ProductDetail } from './components/ProductDetail';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { RoomDesigner } from './components/RoomDesigner';
import { RoomViewer3D } from './components/RoomViewer3D';
import { DesignStudio3D } from './components/DesignStudio3D';
import { Product } from './data/products';

// Page types
type Page = 'landing' | 'catalog' | 'product' | 'login' | 'dashboard' | 'designer' | 'room3d' | '3dstudio';

interface SavedDesign {
  id: string;
  name: string;
  room: {
    width: number;
    length: number;
    wallColor: string;
    floorColor: string;
  };
  furniture: {
    id: string;
    productId: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    depth: number;
    rotation: number;
    color: string;
  }[];
  createdAt: string;
  updatedAt: string;
  roomSize: string;
  itemCount: number;
}

// Session storage key
const DESIGNS_STORAGE_KEY = 'kontur_designs';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showHero, setShowHero] = useState<boolean>(true);
  
  // Room designer state
  const [roomData, setRoomData] = useState<SavedDesign | null>(null);

  // Designs state with session storage
  const [designs, setDesigns] = useState<SavedDesign[]>(() => {
    const stored = sessionStorage.getItem(DESIGNS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save designs to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem(DESIGNS_STORAGE_KEY, JSON.stringify(designs));
  }, [designs]);

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle login
  const handleLogin = (email: string) => {
    setUser(email);
    setCurrentPage('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  // Handle product selection
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colorVariants[0].color);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle back from product
  const handleBack = () => {
    setSelectedProduct(null);
    setCurrentPage('catalog');
  };

  // Handle explore
  const handleExplore = () => {
    setShowHero(false);
    setCurrentPage('catalog');
  };

  // Handle home
  const handleHome = () => {
    setSelectedProduct(null);
    setShowHero(true);
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle new design
  const handleNewDesign = () => {
    setRoomData(null);
    setCurrentPage('designer');
  };

  // Handle open 3D studio
  const handleOpen3DStudio = () => {
    setCurrentPage('3dstudio');
  };

  // Handle open design
  const handleOpenDesign = (id: string) => {
    const design = designs.find(d => d.id === id);
    if (design) {
      setRoomData(design);
    } else {
      // In a real app, this would load from a database
      // For demo, we'll just create a sample design
      setRoomData({
        id,
        name: 'Sample Design',
        room: { width: 500, length: 400, wallColor: '#FFFFFF', floorColor: '#D4A574' },
        furniture: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roomSize: '5m x 4m',
        itemCount: 0
      });
    }
    setCurrentPage('designer');
  };

  // Handle edit design
  const handleEditDesign = (id: string) => {
    handleOpenDesign(id);
  };

  // Handle delete design
  const handleDeleteDesign = (id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  // Handle save design
  const handleSaveDesign = (data: { room: any; furniture: any[]; name?: string }) => {
    const roomSize = `${data.room.length / 100}m x ${data.room.width / 100}m`;
    const itemCount = data.furniture.length;
    
    // Check if updating existing design or creating new
    if (roomData?.id && designs.find(d => d.id === roomData.id)) {
      // Update existing design
      setDesigns(prev => prev.map(d => {
        if (d.id === roomData.id) {
          return {
            ...d,
            name: data.name || d.name,
            room: data.room,
            furniture: data.furniture.map(f => ({
              ...f,
              depth: f.height
            })),
            updatedAt: new Date().toISOString(),
            roomSize,
            itemCount
          };
        }
        return d;
      }));
    } else {
      // Create new design
      const newDesign: SavedDesign = {
        id: `design-${Date.now()}`,
        name: data.name || `Design ${new Date().toLocaleDateString()}`,
        room: data.room,
        furniture: data.furniture.map(f => ({
          ...f,
          depth: f.height
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roomSize,
        itemCount
      };
      setDesigns(prev => [...prev, newDesign]);
    }
    console.log('Saved design:', new Date().toISOString());
    alert('Design saved successfully!');
    // Navigate back to dashboard to see the saved design
    setCurrentPage('dashboard');
  };

  // Handle view in 3D
  const handleView3D = (room?: { width: number; length: number; wallColor: string; floorColor: string }, furniture?: any[]) => {
    // Update roomData with current state before viewing in 3D
    if (room && furniture) {
      setRoomData(prev => ({
        id: prev?.id || `design-${Date.now()}`,
        name: prev?.name || `Design ${new Date().toLocaleDateString()}`,
        room,
        furniture: furniture.map(f => ({
          ...f,
          depth: f.height || f.depth || 50 // Ensure depth is set for 3D
        })),
        createdAt: prev?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roomSize: prev?.roomSize || '5m x 4m',
        itemCount: prev?.itemCount || 0
      }));
      // Navigate to 3D view
      setTimeout(() => setCurrentPage('room3d'), 100);
    } else if (roomData) {
      // Just navigate to 3D view with existing data
      setCurrentPage('room3d');
    }
  };

  // Handle back from 3D
  const handleBackFrom3D = () => {
    setCurrentPage('designer');
  };

  // If not logged in, show login
  if (!user && currentPage !== 'landing') {
    return <Login onLogin={handleLogin} />;
  }

  // Show login page
  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  // Show dashboard
  if (currentPage === 'dashboard') {
    return (
      <Dashboard
        user={user || ''}
        designs={designs}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onLogout={handleLogout}
        onNewDesign={handleNewDesign}
        onOpenDesign={handleOpenDesign}
        onEditDesign={handleEditDesign}
        onDeleteDesign={handleDeleteDesign}
        onOpen3DStudio={handleOpen3DStudio}
      />
    );
  }

  // Show room designer
  if (currentPage === 'designer') {
    return (
      <RoomDesigner
        onBack={() => setCurrentPage('dashboard')}
        onSave={handleSaveDesign}
        onView3D={handleView3D}
        initialRoom={roomData?.room}
        initialFurniture={roomData?.furniture as any}
      />
    );
  }

  // Show 3D room viewer
  if (currentPage === 'room3d') {
    return (
      <RoomViewer3D
        room={roomData?.room || { width: 500, length: 400, wallColor: '#FFFFFF', floorColor: '#D4A574' }}
        furniture={roomData?.furniture || []}
        onBack={handleBackFrom3D}
      />
    );
  }

  // Show 3D Design Studio
  if (currentPage === '3dstudio') {
    return (
      <DesignStudio3D
        onBack={() => setCurrentPage('dashboard')}
        onStartDesign={(module) => {
          // Convert module to furniture item and start design
          setRoomData({
            id: `design-${Date.now()}`,
            name: module.name,
            room: { width: 500, length: 400, wallColor: '#FFFFFF', floorColor: '#D4A574' },
            furniture: [{
              id: `f-${Date.now()}`,
              productId: module.id,
              name: module.name,
              x: 200,
              y: 150,
              width: module.dimensions.width,
              height: module.dimensions.height,
              depth: module.dimensions.depth,
              rotation: 0,
              color: module.color
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            roomSize: '5m x 4m',
            itemCount: 1
          });
          setCurrentPage('designer');
        }}
      />
    );
  }

  // Show product detail page
  if (currentPage === 'product' && selectedProduct) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1E24]">
        <Header 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onHome={() => { handleHome(); setCurrentPage('landing'); }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-[calc(100vh-64px)] flex flex-col md:flex-row"
        >
          <div className="w-full md:w-[65%] h-[50vh] md:h-full relative">
            <ProductViewer3D
              product={selectedProduct}
              selectedColor={selectedColor} />
          </div>
          <div className="w-full md:w-[35%] h-[50vh] md:h-full border-l border-[#E8E4DE] dark:border-[#3F454D]">
            <ProductDetail
              product={selectedProduct}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              onBack={handleBack} />
          </div>
        </motion.div>
      </div>
    );
  }

  // Show catalog
  if (currentPage === 'catalog') {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1E24] font-sans selection:bg-[#A3C4BC] dark:selection:bg-[#86A789] selection:text-white">
        <Header 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onHome={handleHome}
        />
        <main className="pt-16 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            id="catalog-section"
          >
            <ProductCatalog onSelectProduct={handleSelectProduct} />
          </motion.div>
        </main>
      </div>
    );
  }

  // Show landing page
  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1E24] font-sans selection:bg-[#A3C4BC] dark:selection:bg-[#86A789] selection:text-white">
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onHome={handleHome}
      />

      <main className="pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          {showHero && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero 
                onExplore={handleExplore} 
                onDesign={() => {
                  if (user) {
                    handleNewDesign();
                  } else {
                    setCurrentPage('login');
                  }
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showHero && (
            <motion.div
              key="catalog"
              id="catalog-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCatalog onSelectProduct={handleSelectProduct} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
