import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Product } from '../data/products';
import { getModelGenerator } from '../utils/furnitureModels';
import { cleanupThreeScene } from '../utils/threeCleanup';
import { Eye, Plus, ShoppingCart, Box } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onView3D?: () => void;
  onAddToRoom?: () => void;
  onAddToCart?: () => void;
}

export function ProductCard({ 
  product, 
  onClick, 
  onView3D, 
  onAddToRoom, 
  onAddToCart 
}: ProductCardProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F5F5F5');

    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      20
    );
    camera.position.set(2.5, 1.5, 2.5);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    canvasRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const generateModel = getModelGenerator(product.modelType);
    const model = generateModel(product.colorVariants[0].color);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x = -center.x;
    model.position.z = -center.z;
    scene.add(model);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      model.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect =
        canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      cleanupThreeScene(scene, renderer);
      if (
        canvasRef.current &&
        renderer.domElement.parentNode === canvasRef.current
      ) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, [product]);

  const handleView3D = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView3D?.();
  };

  const handleAddToRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToRoom?.();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.();
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
      className="group cursor-pointer bg-white dark:bg-[#2D333A] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E4DE] dark:border-[#3F454D] card-hover-lift"
    >
      <div className="aspect-square w-full relative bg-[#F5F5F5] dark:bg-[#1A1E24] overflow-hidden">
        <div ref={canvasRef} className="absolute inset-0" />
        
        {/* Action Buttons Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showButtons ? 1 : 0 }}
          className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2"
        >
          {onView3D && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleView3D}
              className="p-3 bg-white dark:bg-[#2C3E50] rounded-full shadow-lg"
              title="View in 3D"
            >
              <Eye className="w-5 h-5 text-[#2C3E50] dark:text-white" />
            </motion.button>
          )}
          {onAddToRoom && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToRoom}
              className="p-3 bg-white dark:bg-[#2C3E50] rounded-full shadow-lg"
              title="Add to Room"
            >
              <Box className="w-5 h-5 text-[#2C3E50] dark:text-white" />
            </motion.button>
          )}
          {onAddToCart && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-3 bg-white dark:bg-[#2C3E50] rounded-full shadow-lg"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#2C3E50] dark:text-white" />
            </motion.button>
          )}
        </motion.div>
      </div>
      
      <div className="p-4">
        <div className="text-xs font-medium text-[#A3C4BC] dark:text-[#86A789] uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <h3 className="text-lg font-semibold text-[#2C3E50] dark:text-[#E5E7EB] mb-2 group-hover:text-[#A3C4BC] dark:group-hover:text-[#86A789] transition-colors">
          {product.name}
        </h3>
        
        {/* Product Details */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-[#6b6560] dark:text-[#9CA3AF]">
            <Box className="w-3.5 h-3.5" />
            <span>{product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} cm</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6b6560] dark:text-[#9CA3AF]">
            <span>Materials: {product.materials.join(', ')}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#2C3E50] dark:text-[#E5E7EB]">
            ${product.price.toLocaleString()}
          </span>
          <div className="flex gap-1">
            {product.colorVariants.slice(0, 4).map((v, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-black/10"
                style={{
                  backgroundColor: v.color
                }}
                title={v.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
