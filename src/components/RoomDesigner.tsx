// Updated by Ishira
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  RotateCw, 
  Trash2, 
  ZoomIn, 
  ZoomOut,
  Grid,
  Palette,
  Square,
  Undo,
  Redo,
  Eye,
  Type,
  Ruler,
  EyeOff
} from 'lucide-react';
import * as THREE from 'three';

// 3D Furniture Icon Component
interface Furniture3DIconProps {
  furnitureType: string;
  color: string;
  size?: number;
}

function Furniture3DIcon({ furnitureType, color, size = 50 }: Furniture3DIconProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00000000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(3, 2, 3);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    // Create furniture geometry based on type
    const furnitureColor = new THREE.Color(color);
    const material = new THREE.MeshStandardMaterial({ 
      color: furnitureColor,
      roughness: 0.4,
      metalness: 0.1
    });

    const group = new THREE.Group();

    switch (furnitureType.toLowerCase()) {
      case 'sofa': {
        // Sofa base
        const baseGeo = new THREE.BoxGeometry(1.8, 0.3, 0.8);
        const base = new THREE.Mesh(baseGeo, material);
        base.position.y = 0.15;
        group.add(base);

        // Sofa back
        const backGeo = new THREE.BoxGeometry(1.8, 0.5, 0.15);
        const back = new THREE.Mesh(backGeo, material);
        back.position.set(0, 0.45, -0.325);
        group.add(back);

        // Armrests
        const armGeo = new THREE.BoxGeometry(0.15, 0.35, 0.7);
        const leftArm = new THREE.Mesh(armGeo, material);
        leftArm.position.set(-0.825, 0.325, 0.05);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, material);
        rightArm.position.set(0.825, 0.325, 0.05);
        group.add(rightArm);
        break;
      }
      case 'armchair': {
        const baseGeo = new THREE.BoxGeometry(0.8, 0.25, 0.7);
        const base = new THREE.Mesh(baseGeo, material);
        base.position.y = 0.125;
        group.add(base);

        const backGeo = new THREE.BoxGeometry(0.7, 0.5, 0.12);
        const back = new THREE.Mesh(backGeo, material);
        back.position.set(0, 0.4, -0.29);
        group.add(back);

        const armGeo = new THREE.BoxGeometry(0.12, 0.25, 0.5);
        const leftArm = new THREE.Mesh(armGeo, material);
        leftArm.position.set(-0.34, 0.25, 0.1);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, material);
        rightArm.position.set(0.34, 0.25, 0.1);
        group.add(rightArm);
        break;
      }
      case 'coffee table':
      case 'dining table':
      case 'desk': {
        // Table top
        const topGeo = new THREE.BoxGeometry(1.4, 0.08, 0.7);
        const top = new THREE.Mesh(topGeo, material);
        top.position.y = 0.4;
        group.add(top);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.38);
        const legPositions = [
          [-0.6, 0.19, 0.25],
          [0.6, 0.19, 0.25],
          [-0.6, 0.19, -0.25],
          [0.6, 0.19, -0.25]
        ];
        legPositions.forEach(pos => {
          const leg = new THREE.Mesh(legGeo, material);
          leg.position.set(pos[0], pos[1], pos[2]);
          group.add(leg);
        });
        break;
      }
      case 'dining chair':
      case 'office chair': {
        // Seat
        const seatGeo = new THREE.BoxGeometry(0.4, 0.06, 0.4);
        const seat = new THREE.Mesh(seatGeo, material);
        seat.position.y = 0.4;
        group.add(seat);

        // Back
        const backGeo = new THREE.BoxGeometry(0.38, 0.5, 0.05);
        const back = new THREE.Mesh(backGeo, material);
        back.position.set(0, 0.68, -0.175);
        group.add(back);

        // Base
        const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.05, 16);
        const base = new THREE.Mesh(baseGeo, material);
        base.position.y = 0.025;
        group.add(base);

        // Stem
        const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35);
        const stem = new THREE.Mesh(stemGeo, material);
        stem.position.y = 0.2;
        group.add(stem);
        break;
      }
      case 'bookshelf': {
        // Main frame
        const frameGeo = new THREE.BoxGeometry(1, 1.6, 0.3);
        const frame = new THREE.Mesh(frameGeo, material);
        frame.position.y = 0.8;
        group.add(frame);

        // Shelves
        const shelfGeo = new THREE.BoxGeometry(0.9, 0.03, 0.25);
        for (let i = 0; i < 4; i++) {
          const shelf = new THREE.Mesh(shelfGeo, material);
          shelf.position.set(0, 0.2 + i * 0.4, 0.02);
          group.add(shelf);
        }
        break;
      }
      case 'tv stand': {
        const bodyGeo = new THREE.BoxGeometry(1.5, 0.4, 0.4);
        const body = new THREE.Mesh(bodyGeo, material);
        body.position.y = 0.2;
        group.add(body);

        // TV
        const tvGeo = new THREE.BoxGeometry(1.2, 0.7, 0.05);
        const tvMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2 });
        const tv = new THREE.Mesh(tvGeo, tvMaterial);
        tv.position.set(0, 0.75, -0.1);
        group.add(tv);
        break;
      }
      case 'bed': {
        // Mattress
        const mattressGeo = new THREE.BoxGeometry(1.6, 0.25, 2);
        const mattress = new THREE.Mesh(mattressGeo, material);
        mattress.position.y = 0.25;
        group.add(mattress);

        // Headboard
        const headGeo = new THREE.BoxGeometry(1.6, 0.8, 0.1);
        const head = new THREE.Mesh(headGeo, material);
        head.position.set(0, 0.65, -0.95);
        group.add(head);

        // Pillow
        const pillowGeo = new THREE.BoxGeometry(0.5, 0.12, 0.35);
        const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
        const pillow = new THREE.Mesh(pillowGeo, pillowMaterial);
        pillow.position.set(-0.4, 0.43, -0.7);
        group.add(pillow);

        const pillow2 = new THREE.Mesh(pillowGeo, pillowMaterial);
        pillow2.position.set(0.4, 0.43, -0.7);
        group.add(pillow2);
        break;
      }
      case 'nightstand': {
        const bodyGeo = new THREE.BoxGeometry(0.5, 0.5, 0.4);
        const body = new THREE.Mesh(bodyGeo, material);
        body.position.y = 0.25;
        group.add(body);

        // Drawer
        const drawerGeo = new THREE.BoxGeometry(0.4, 0.15, 0.02);
        const drawer = new THREE.Mesh(drawerGeo, material);
        drawer.position.set(0, 0.25, 0.2);
        group.add(drawer);
        break;
      }
      case 'wardrobe': {
        const bodyGeo = new THREE.BoxGeometry(1.5, 2, 0.5);
        const body = new THREE.Mesh(bodyGeo, material);
        body.position.y = 1;
        group.add(body);

        // Door split
        const doorGeo = new THREE.BoxGeometry(0.02, 1.9, 0.48);
        const doorLine = new THREE.Mesh(doorGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
        doorLine.position.set(0, 1, 0.01);
        group.add(doorLine);
        break;
      }
      default: {
        // Default cube
        const geo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.y = 0.3;
        group.add(mesh);
      }
    }

    scene.add(group);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Rotate the furniture
      group.rotation.y += 0.02;
      
      // Gentle floating animation
      group.position.y = Math.sin(Date.now() * 0.003) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [furnitureType, color, size]);

  return (
    <div 
      ref={mountRef} 
      className="rounded-lg overflow-hidden"
      style={{ width: size, height: size }}
    />
  );
}

interface PlacedFurniture {
  id: string;
  productId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
}

interface RoomSpec {
  width: number;
  length: number;
  wallColor: string;
  floorColor: string;
}

interface FurnitureProduct {
  id: string;
  name: string;
  category: string;
  dimensions: { width: number; depth: number; height: number };
  color: string;
  price: number;
}

interface RoomDesignerProps {
  onBack: () => void;
  onSave: (data: { room: RoomSpec; furniture: PlacedFurniture[] }) => void;
  onView3D?: (room: RoomSpec, furniture: PlacedFurniture[]) => void;
  initialRoom?: RoomSpec;
  initialFurniture?: PlacedFurniture[];
}

const furnitureProducts: FurnitureProduct[] = [
  { id: 'f1', name: 'Sofa', category: 'seating', dimensions: { width: 180, depth: 90, height: 85 }, color: '#6B8E7D', price: 1299 },
  { id: 'f2', name: 'Armchair', category: 'seating', dimensions: { width: 80, depth: 85, height: 90 }, color: '#8B7355', price: 599 },
  { id: 'f3', name: 'Coffee Table', category: 'tables', dimensions: { width: 120, depth: 60, height: 45 }, color: '#5C4033', price: 349 },
  { id: 'f4', name: 'Dining Table', category: 'tables', dimensions: { width: 160, depth: 90, height: 75 }, color: '#5C4033', price: 799 },
  { id: 'f5', name: 'Dining Chair', category: 'seating', dimensions: { width: 45, depth: 50, height: 90 }, color: '#8B7355', price: 199 },
  { id: 'f6', name: 'Bookshelf', category: 'storage', dimensions: { width: 100, depth: 35, height: 180 }, color: '#5C4033', price: 449 },
  { id: 'f7', name: 'TV Stand', category: 'storage', dimensions: { width: 150, depth: 45, height: 50 }, color: '#2C3E50', price: 299 },
  { id: 'f8', name: 'Bed', category: 'bedroom', dimensions: { width: 200, depth: 160, height: 40 }, color: '#F5F5F5', price: 899 },
  { id: 'f9', name: 'Nightstand', category: 'bedroom', dimensions: { width: 50, depth: 40, height: 55 }, color: '#5C4033', price: 149 },
  { id: 'f10', name: 'Wardrobe', category: 'bedroom', dimensions: { width: 180, depth: 60, height: 220 }, color: '#F5F5F5', price: 1099 },
  { id: 'f11', name: 'Desk', category: 'office', dimensions: { width: 140, depth: 70, height: 75 }, color: '#5C4033', price: 399 },
  { id: 'f12', name: 'Office Chair', category: 'office', dimensions: { width: 60, depth: 60, height: 110 }, color: '#2C3E50', price: 249 },
];

const wallColors = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Cream', value: '#FFFDD0' },
  { name: 'Light Gray', value: '#E8E8E8' },
  { name: 'Soft Blue', value: '#B8D4E3' },
  { name: 'Soft Green', value: '#B8E3C8' },
  { name: 'Light Pink', value: '#F0D9E3' },
  { name: 'Beige', value: '#E8DCC8' },
  { name: 'Lavender', value: '#E3D9F0' },
];

const floorColors = [
  { name: 'Light Oak', value: '#D4A574' },
  { name: 'Dark Oak', value: '#8B6914' },
  { name: 'Walnut', value: '#5C4033' },
  { name: 'White Oak', value: '#E8DCC8' },
  { name: 'Gray Wood', value: '#A0A0A0' },
  { name: 'White', value: '#F5F5F5' },
  { name: 'Dark Gray', value: '#505050' },
  { name: 'Beige Tile', value: '#E8DCC8' },
];

export function RoomDesigner({ onBack, onSave, onView3D, initialRoom, initialFurniture }: RoomDesignerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [room, setRoom] = useState<RoomSpec>({
    width: initialRoom?.width ?? 500,
    length: initialRoom?.length ?? 400,
    wallColor: initialRoom?.wallColor ?? '#FFFFFF',
    floorColor: initialRoom?.floorColor ?? '#D4A574'
  });
  const [furniture, setFurniture] = useState<PlacedFurniture[]>(initialFurniture ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activePanel, setActivePanel] = useState<'furniture' | 'room' | 'properties'>('furniture');
  const [history, setHistory] = useState<PlacedFurniture[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showDimensionLines, setShowDimensionLines] = useState(true);

  useEffect(() => {
    if (initialRoom) {
      setRoom(initialRoom);
    }
    if (initialFurniture) {
      setFurniture(initialFurniture);
      setSelectedId(null);
      setHistory([initialFurniture]);
      setHistoryIndex(0);
    }
  }, [initialRoom, initialFurniture]);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const roomX = 100;
  const roomY = 100;

  const saveToHistory = useCallback((newFurniture: PlacedFurniture[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newFurniture]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const drawAnnotations = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.scale(zoom, zoom);
    
    const wallHeight = 30;
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#86A789' : '#2C3E50';
    const dimColor = isDark ? '#9CA3AF' : '#6B7280';
    
    // Room dimension labels
    // Width label
    ctx.fillStyle = textColor;
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${room.width}cm`, roomX + room.width / 2, roomY + room.length + 25);
    
    // Length label
    ctx.save();
    ctx.translate(roomX - 25, roomY + room.length / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${room.length}cm`, 0, 0);
    ctx.restore();
    
    // Wall height label
    ctx.fillText(`280cm`, roomX - 20, roomY - wallHeight / 2);
    
    // Draw dimension lines
    if (showDimensionLines) {
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 1;
      
      // Width dimension line
      ctx.beginPath();
      ctx.moveTo(roomX, roomY + room.length + 15);
      ctx.lineTo(roomX + room.width, roomY + room.length + 15);
      ctx.stroke();
      
      // Width dimension line end markers
      ctx.beginPath();
      ctx.moveTo(roomX, roomY + room.length + 12);
      ctx.lineTo(roomX, roomY + room.length + 18);
      ctx.moveTo(roomX + room.width, roomY + room.length + 12);
      ctx.lineTo(roomX + room.width, roomY + room.length + 18);
      ctx.stroke();
      
      // Length dimension line
      ctx.beginPath();
      ctx.moveTo(roomX - 15, roomY);
      ctx.lineTo(roomX - 15, roomY + room.length);
      ctx.stroke();
      
      // Length dimension line end markers
      ctx.beginPath();
      ctx.moveTo(roomX - 18, roomY);
      ctx.lineTo(roomX - 12, roomY);
      ctx.moveTo(roomX - 18, roomY + room.length);
      ctx.lineTo(roomX - 12, roomY + room.length);
      ctx.stroke();
    }
    
    // Furniture labels and dimensions
    furniture.forEach(item => {
      const centerX = roomX + item.x + item.width / 2;
      const centerY = roomY + item.y + item.height / 2;
      
      // Furniture name label
      ctx.fillStyle = textColor;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, centerX, centerY - item.height / 2 - 8);
      
      // Furniture dimensions
      ctx.fillStyle = dimColor;
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${item.width}x${item.height}`, centerX, centerY - item.height / 2 - 20);
      
      // Draw bounding box if selected
      if (selectedId === item.id && showDimensionLines) {
        ctx.strokeStyle = '#86A789';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          roomX + item.x - 5,
          roomY + item.y - 5,
          item.width + 10,
          item.height + 10
        );
        ctx.setLineDash([]);
      }
    });
    
    // Grid measurements if enabled
    if (gridEnabled) {
      ctx.fillStyle = dimColor;
      ctx.font = '8px Inter, sans-serif';
      ctx.textAlign = 'center';
      
      // Mark 100cm intervals on edges
      for (let x = 100; x < room.width; x += 100) {
        ctx.fillText(`${x}`, roomX + x, roomY + room.length + 5);
      }
      for (let y = 100; y < room.length; y += 100) {
        ctx.save();
        ctx.translate(roomX - 5, roomY + y);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${y}`, 0, 0);
        ctx.restore();
      }
    }
    
    ctx.restore();
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFurniture([...history[historyIndex - 1]]);
      setSelectedId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setFurniture([...history[historyIndex + 1]]);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (gridEnabled) {
      ctx.save();
      ctx.scale(zoom, zoom);

      const visibleWidth = canvasWidth / zoom;
      const visibleHeight = canvasHeight / zoom;
      const step = 20;

      ctx.strokeStyle = '#E8E8E8';
      ctx.lineWidth = 1 / zoom;

      for (let x = 0; x <= visibleWidth; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5 / zoom, 0);
        ctx.lineTo(x + 0.5 / zoom, visibleHeight);
        ctx.stroke();
      }

      for (let y = 0; y <= visibleHeight; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5 / zoom);
        ctx.lineTo(visibleWidth, y + 0.5 / zoom);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.save();
    ctx.scale(zoom, zoom);

    ctx.fillStyle = room.floorColor;
    ctx.fillRect(roomX, roomY, room.width, room.length);
    
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1 / zoom;
    for (let x = roomX; x <= roomX + room.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5 / zoom, roomY);
      ctx.lineTo(x + 0.5 / zoom, roomY + room.length);
      ctx.stroke();
    }
    for (let y = roomY; y <= roomY + room.length; y += 50) {
      ctx.beginPath();
      ctx.moveTo(roomX, y + 0.5 / zoom);
      ctx.lineTo(roomX + room.width, y + 0.5 / zoom);
      ctx.stroke();
    }

    const wallHeight = 30;
    ctx.fillStyle = room.wallColor;
    
    ctx.beginPath();
    ctx.moveTo(roomX, roomY);
    ctx.lineTo(roomX + room.width, roomY);
    ctx.lineTo(roomX + room.width, roomY - wallHeight);
    ctx.lineTo(roomX, roomY - wallHeight);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(roomX, roomY);
    ctx.lineTo(roomX, roomY + room.length);
    ctx.lineTo(roomX, roomY + room.length - wallHeight);
    ctx.lineTo(roomX, roomY - wallHeight);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(roomX, roomY - wallHeight, room.width, wallHeight + room.length);

    furniture.forEach(item => {
      ctx.save();
      
      const centerX = roomX + item.x + item.width / 2;
      const centerY = roomY + item.y + item.height / 2;
      
      ctx.translate(centerX, centerY);
      ctx.rotate((item.rotation * Math.PI) / 180);
      
      ctx.fillStyle = item.color;
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;
      
      ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
      
      ctx.shadowBlur = 0;
      ctx.strokeStyle = selectedId === item.id ? '#2C3E50' : 'rgba(0,0,0,0.3)';
      ctx.lineWidth = (selectedId === item.id ? 3 : 1) / zoom;
      ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
      
      if (zoom > 0.7) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.name, 0, 0);
      }
      
      ctx.restore();
    });

    ctx.restore();

    // Draw annotations if enabled
    if (showAnnotations) {
      drawAnnotations(ctx);
    }

  }, [room, furniture, zoom, gridEnabled, selectedId, showAnnotations, showDimensionLines]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;

    let found = false;
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      const itemScreenX = roomX + item.x;
      const itemScreenY = roomY + item.y;
      
      if (clickX >= itemScreenX && clickX <= itemScreenX + item.width &&
          clickY >= itemScreenY && clickY <= itemScreenY + item.height) {
        setSelectedId(item.id);
        found = true;
        break;
      }
    }
    
    if (!found) {
      setSelectedId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedId) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;

    const item = furniture.find(f => f.id === selectedId);
    if (!item) return;

    setDragOffset({
      x: clickX - (roomX + item.x),
      y: clickY - (roomY + item.y)
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    const newX = Math.max(0, Math.min(room.width - 50, mouseX - dragOffset.x - roomX));
    const newY = Math.max(0, Math.min(room.length - 50, mouseY - dragOffset.y - roomY));

    setFurniture(prev => prev.map(f => 
      f.id === selectedId ? { ...f, x: newX, y: newY } : f
    ));
  };

  const handleMouseUp = () => {
    if (isDragging) {
      saveToHistory(furniture);
    }
    setIsDragging(false);
  };

  const addFurniture = (product: FurnitureProduct) => {
    const newFurniture: PlacedFurniture = {
      id: `f-${Date.now()}`,
      productId: product.id,
      name: product.name,
      x: room.width / 2 - product.dimensions.width / 2,
      y: room.length / 2 - product.dimensions.depth / 2,
      width: product.dimensions.width,
      height: product.dimensions.depth,
      rotation: 0,
      color: product.color
    };
    
    const newFurnitureList = [...furniture, newFurniture];
    setFurniture(newFurnitureList);
    setSelectedId(newFurniture.id);
    saveToHistory(newFurnitureList);
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    
    const newFurniture = furniture.map(f => 
      f.id === selectedId ? { ...f, rotation: (f.rotation + 45) % 360 } : f
    );
    setFurniture(newFurniture);
    saveToHistory(newFurniture);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    
    const newFurniture = furniture.filter(f => f.id !== selectedId);
    setFurniture(newFurniture);
    setSelectedId(null);
    saveToHistory(newFurniture);
  };

  const handleSave = () => {
    onSave({ room, furniture });
  };

  const selectedFurniture = furniture.find(f => f.id === selectedId);

  return (
    <div className="h-screen bg-[#F5F5F5] dark:bg-[#1A1E24] flex flex-col">
      <motion.header 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="h-14 bg-white dark:bg-[#2D333A] border-b border-[#E8E4DE] dark:border-[#3F454D] flex items-center justify-between px-4"
      >
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
          <div className="h-6 w-px bg-[#E8E4DE] dark:bg-[#3F454D]" />
          <h1 className="text-lg font-semibold text-[#2C3E50] dark:text-[#E5E7EB]">
            Room Designer
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={undo}
            disabled={historyIndex <= 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] disabled:opacity-30 transition-colors"
          >
            <Undo className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] disabled:opacity-30 transition-colors"
          >
            <Redo className="w-5 h-5" />
          </motion.button>
          
          <div className="h-6 w-px bg-[#E8E4DE] dark:bg-[#3F454D]" />

          <motion.button
            onClick={() => setGridEnabled(!gridEnabled)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${gridEnabled ? 'bg-[#A3C4BC] text-white' : 'text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50]'}`}
          >
            <Grid className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={() => setShowAnnotations(!showAnnotations)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${showAnnotations ? 'bg-[#A3C4BC] text-white' : 'text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50]'}`}
            title="Toggle Annotations"
          >
            {showAnnotations ? <Type className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </motion.button>

          <motion.button
            onClick={() => setShowDimensionLines(!showDimensionLines)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${showDimensionLines ? 'bg-[#A3C4BC] text-white' : 'text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50]'}`}
            title="Toggle Dimension Lines"
          >
            <Ruler className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>
          <span className="text-sm text-[#6b6560] dark:text-[#9CA3AF] w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <motion.button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>

          <div className="h-6 w-px bg-[#E8E4DE] dark:bg-[#3F454D]" />

          {onView3D && (
            <motion.button
              onClick={() => onView3D(room, furniture)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-[#2C3E50] dark:bg-[#86A789] text-white dark:text-[#1A1E24] rounded-lg font-medium"
            >
              <Eye className="w-4 h-4" />
              View 3D
            </motion.button>
          )}

          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#A3C4BC] dark:bg-[#86A789] text-white dark:text-[#1A1E24] rounded-lg font-medium"
          >
            <Save className="w-4 h-4" />
            Save
          </motion.button>
        </div>
      </motion.header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 bg-white dark:bg-[#2D333A] border-r border-[#E8E4DE] dark:border-[#3F454D] flex flex-col">
          <div className="flex border-b border-[#E8E4DE] dark:border-[#3F454D]">
            <motion.button
              onClick={() => setActivePanel('furniture')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activePanel === 'furniture' ? 'text-[#2C3E50] dark:text-[#E5E7EB] border-b-2 border-[#86A789]' : 'text-[#6b6560] dark:text-[#9CA3AF]'}`}
            >
              Furniture
            </motion.button>
            <motion.button
              onClick={() => setActivePanel('room')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activePanel === 'room' ? 'text-[#2C3E50] dark:text-[#E5E7EB] border-b-2 border-[#86A789]' : 'text-[#6b6560] dark:text-[#9CA3AF]'}`}
            >
              Room
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === 'furniture' && (
              <div className="grid grid-cols-2 gap-3">
                {furnitureProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    onClick={() => addFurniture(product)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center gap-2 p-4 bg-[#F5F5F5] dark:bg-[#1A1E24] rounded-xl hover:shadow-md transition-all text-center"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <Furniture3DIcon 
                        furnitureType={product.name} 
                        color={product.color} 
                        size={80} 
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#2C3E50] dark:text-[#E5E7EB] text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#6b6560] dark:text-[#9CA3AF]">
                        {product.dimensions.width} x {product.dimensions.depth} cm
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {activePanel === 'room' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-3">
                    Room Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#6b6560] dark:text-[#9CA3AF]">Width (cm)</label>
                      <input
                        type="number"
                        value={room.width}
                        onChange={(e) => setRoom({ ...room, width: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 px-3 py-2 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded-lg text-[#2C3E50] dark:text-[#E5E7EB] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#6b6560] dark:text-[#9CA3AF]">Length (cm)</label>
                      <input
                        type="number"
                        value={room.length}
                        onChange={(e) => setRoom({ ...room, length: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 px-3 py-2 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded-lg text-[#2C3E50] dark:text-[#E5E7EB] text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-3">
                    <Palette className="w-4 h-4" />
                    Wall Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {wallColors.map((color) => (
                      <motion.button
                        key={color.value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRoom({ ...room, wallColor: color.value })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${room.wallColor === color.value ? 'border-[#86A789] scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-3">
                    <Square className="w-4 h-4" />
                    Floor Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {floorColors.map((color) => (
                      <motion.button
                        key={color.value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRoom({ ...room, floorColor: color.value })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${room.floorColor === color.value ? 'border-[#86A789] scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-auto p-4">
          <div className="relative bg-white dark:bg-[#2D333A] rounded-xl shadow-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{ width: canvasWidth, height: canvasHeight }}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-crosshair"
            />
          </div>
        </div>

        {selectedFurniture && (
          <div className="w-64 bg-white dark:bg-[#2D333A] border-l border-[#E8E4DE] dark:border-[#3F454D] p-4">
            <h3 className="font-semibold text-[#2C3E50] dark:text-[#E5E7EB] mb-4">
              Properties
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#6b6560] dark:text-[#9CA3AF]">Name</label>
                <p className="text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB]">
                  {selectedFurniture.name}
                </p>
              </div>

              <div>
                <label className="text-xs text-[#6b6560] dark:text-[#9CA3AF]">Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={selectedFurniture.color}
                    onChange={(e) => {
                      setFurniture(prev => prev.map(f =>
                        f.id === selectedId ? { ...f, color: e.target.value } : f
                      ));
                    }}
                    className="h-8 w-10 p-0 border border-[#E8E4DE] dark:border-[#3F454D] rounded"
                  />
                  <input
                    type="text"
                    value={selectedFurniture.color}
                    onChange={(e) => {
                      setFurniture(prev => prev.map(f =>
                        f.id === selectedId ? { ...f, color: e.target.value } : f
                      ));
                    }}
                    className="flex-1 px-2 py-1 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded text-xs text-[#2C3E50] dark:text-[#E5E7EB]"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs text-[#6b6560] dark:text-[#9CA3AF]">Position</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <input
                      type="number"
                      value={Math.round(selectedFurniture.x)}
                      onChange={(e) => {
                        setFurniture(prev => prev.map(f => 
                          f.id === selectedId ? { ...f, x: parseInt(e.target.value) || 0 } : f
                        ));
                      }}
                      className="w-full px-2 py-1 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={Math.round(selectedFurniture.y)}
                      onChange={(e) => {
                        setFurniture(prev => prev.map(f => 
                          f.id === selectedId ? { ...f, y: parseInt(e.target.value) || 0 } : f
                        ));
                      }}
                      className="w-full px-2 py-1 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6b6560] dark:text-[#9CA3AF]">Rotation</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedFurniture.rotation}
                    onChange={(e) => {
                      setFurniture(prev => prev.map(f => 
                        f.id === selectedId ? { ...f, rotation: parseInt(e.target.value) } : f
                      ));
                    }}
                    className="flex-1"
                  />
                  <span className="text-xs text-[#2C3E50] dark:text-[#E5E7EB] w-8">
                    {selectedFurniture.rotation}°
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E4DE] dark:border-[#3F454D] flex gap-2">
                <motion.button
                  onClick={rotateSelected}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#F5F5F5] dark:bg-[#1A1E24] text-[#2C3E50] dark:text-[#E5E7EB] rounded-lg text-sm"
                >
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </motion.button>
                <motion.button
                  onClick={deleteSelected}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
