import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  ArrowLeft, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Ruler,
  Play,
  Box,
  Sofa,
  Bed,
  Armchair,
  Lamp,
  DoorOpen,
  Palette
} from 'lucide-react';

interface FurnitureModule {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions: { width: number; depth: number; height: number };
  color: string;
  accentColor: string;
  modelType: 'sofa' | 'bed' | 'chair' | 'table' | 'lamp' | 'storage';
}

// Preset color palettes
const colorPalettes = [
  { name: 'Natural', primary: '#6B8E7D', accent: '#4A6B5A' },
  { name: 'Charcoal', primary: '#2C3E50', accent: '#1A252F' },
  { name: 'Warm Brown', primary: '#8B7355', accent: '#5C4033' },
  { name: 'Ocean Blue', primary: '#3498DB', accent: '#2980B9' },
  { name: 'Forest', primary: '#27AE60', accent: '#1E8449' },
  { name: 'Rose', primary: '#E74C3C', accent: '#C0392B' },
  { name: 'Purple', primary: '#9B59B6', accent: '#8E44AD' },
  { name: 'Gold', primary: '#F39C12', accent: '#D68910' },
  { name: 'Silver', primary: '#BDC3C7', accent: '#95A5A6' },
  { name: 'Midnight', primary: '#1A1A2E', accent: '#16213E' },
];

// Custom color presets
const customColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8B500', '#00CED1', '#FF69B4', '#32CD32', '#FF8C00',
];

interface DesignStudio3DProps {
  onBack: () => void;
  onStartDesign: (module: FurnitureModule) => void;
}

const furnitureModules: FurnitureModule[] = [
  {
    id: 'mod-sofa-1',
    name: 'Modern Sectional Sofa',
    category: 'Living Room',
    description: 'A spacious L-shaped sectional perfect for family gatherings. Features premium fabric upholstery with high-density foam cushions for superior comfort.',
    dimensions: { width: 280, depth: 180, height: 85 },
    color: '#6B8E7D',
    accentColor: '#4A6B5A',
    modelType: 'sofa'
  },
  {
    id: 'mod-bed-1',
    name: 'Luxury Platform Bed',
    category: 'Bedroom',
    description: 'Elegant king-size platform bed with upholstered headboard. Features solid wood slats and no box spring required.',
    dimensions: { width: 200, depth: 220, height: 120 },
    color: '#2C3E50',
    accentColor: '#1A252F',
    modelType: 'bed'
  },
  {
    id: 'mod-chair-1',
    name: 'Ergonomic Office Chair',
    category: 'Office',
    description: 'Premium ergonomic chair with lumbar support, adjustable armrests, and breathable mesh back. Perfect for long work sessions.',
    dimensions: { width: 65, depth: 65, height: 120 },
    color: '#1A1A2E',
    accentColor: '#16213E',
    modelType: 'chair'
  },
  {
    id: 'mod-table-1',
    name: 'Minimalist Dining Table',
    category: 'Dining',
    description: 'Sleek dining table with natural oak veneer top and powder-coated steel legs. Seats 6-8 people comfortably.',
    dimensions: { width: 180, depth: 90, height: 75 },
    color: '#D4A574',
    accentColor: '#8B6914',
    modelType: 'table'
  },
  {
    id: 'mod-lamp-1',
    name: 'Arc Floor Lamp',
    category: 'Lighting',
    description: 'Contemporary arc floor lamp with marble base and adjustable arm. Provides ambient lighting with energy-efficient LED bulb.',
    dimensions: { width: 40, depth: 40, height: 200 },
    color: '#2C3E50',
    accentColor: '#E8DCC8',
    modelType: 'lamp'
  },
  {
    id: 'mod-storage-1',
    name: 'Modular Bookshelf',
    category: 'Storage',
    description: 'Customizable modular shelving system with adjustable shelves. Perfect for books, decor, and storage bins.',
    dimensions: { width: 120, depth: 35, height: 180 },
    color: '#5C4033',
    accentColor: '#3D2B1F',
    modelType: 'storage'
  }
];

export function DesignStudio3D({ onBack, onStartDesign }: DesignStudio3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number>(0);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  
  const [selectedModule, setSelectedModule] = useState<FurnitureModule | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#6B8E7D');
  const [accentColor, setAccentColor] = useState('#4A6B5A');
  const [highlightColor, setHighlightColor] = useState('#A3C4BC');

  // Handle module selection - set colors from module
  const handleModuleSelect = (module: FurnitureModule) => {
    setSelectedModule(module);
    setPrimaryColor(module.color);
    setAccentColor(module.accentColor);
    setHighlightColor(module.color);
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !selectedModule) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1A1E24');
    scene.fog = new THREE.Fog('#1A1E24', 800, 2000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      2000
    );
    camera.position.set(300, 250, 300);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: quality !== 'low',
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(quality === 'low' ? 1 : quality === 'medium' ? 1.5 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 150;
    controls.maxDistance = 600;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    // Lighting
    setupLighting(scene);

    // Add pedestal/platform
    addPlatform(scene);

    // Build the furniture model
    meshesRef.current = [];
    buildFurnitureModel(scene, selectedModule);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [selectedModule, quality]);

  // Update auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Update zoom
  useEffect(() => {
    if (cameraRef.current) {
      const baseDistance = 300;
      const newDistance = baseDistance / zoom;
      const direction = new THREE.Vector3();
      cameraRef.current.getWorldDirection(direction);
      cameraRef.current.position.copy(direction.multiplyScalar(newDistance).negate());
    }
  }, [zoom]);

  // Update colors when changed
  useEffect(() => {
    if (!sceneRef.current || !selectedModule) return;
    
    // Update materials in scene by checking mesh materials
    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.userData && mat.userData.isPrimary) {
          mat.color.set(primaryColor);
          mat.needsUpdate = true;
        } else if (mat.userData && mat.userData.isAccent) {
          mat.color.set(accentColor);
          mat.needsUpdate = true;
        } else if (mat.userData && mat.userData.isHighlight) {
          mat.color.set(highlightColor);
          mat.emissive.set(highlightColor);
          mat.needsUpdate = true;
        }
      }
    });
  }, [primaryColor, accentColor, highlightColor, selectedModule]);

  const setupLighting = (scene: THREE.Scene) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(200, 400, 200);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 100;
    keyLight.shadow.camera.far = 1000;
    keyLight.shadow.camera.left = -300;
    keyLight.shadow.camera.right = 300;
    keyLight.shadow.camera.top = 300;
    keyLight.shadow.camera.bottom = -300;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xb0c4de, 0.5);
    fillLight.position.set(-200, 200, -100);
    scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 100, -300);
    scene.add(rimLight);

    // Hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    scene.add(hemiLight);

    // Point light for highlights
    const pointLight = new THREE.PointLight(0xA3C4BC, 0.5, 500);
    pointLight.position.set(100, 150, 100);
    scene.add(pointLight);
  };

  const addPlatform = (scene: THREE.Scene) => {
    // Circular platform
    const platformGeometry = new THREE.CylinderGeometry(120, 120, 10, 64);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x2D333A,
      roughness: 0.2,
      metalness: 0.5
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(0, -5, 0);
    platform.receiveShadow = true;
    scene.add(platform);

    // Reflective surface ring
    const ringGeometry = new THREE.RingGeometry(80, 118, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x86A789,
      roughness: 0.1,
      metalness: 0.8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, 0.1, 0);
    scene.add(ring);
  };

  const buildFurnitureModel = (scene: THREE.Scene, module: FurnitureModule) => {
    const material = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.4,
      metalness: 0.1
    });
    material.userData = { isPrimary: true };
    
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.3,
      metalness: 0.2
    });
    accentMaterial.userData = { isAccent: true };

    const highlightMaterial = new THREE.MeshStandardMaterial({
      color: highlightColor,
      roughness: 0.2,
      metalness: 0.3,
      emissive: highlightColor,
      emissiveIntensity: 0.1
    });
    highlightMaterial.userData = { isHighlight: true };

    switch (module.modelType) {
      case 'sofa':
        buildSofaModel(scene, module, material, accentMaterial, highlightMaterial);
        break;
      case 'bed':
        buildBedModel(scene, module, material, accentMaterial, highlightMaterial);
        break;
      case 'chair':
        buildChairModel(scene, module, material, accentMaterial, highlightMaterial);
        break;
      case 'table':
        buildTableModel(scene, module, material, accentMaterial, highlightMaterial);
        break;
      case 'lamp':
        buildLampModel(scene, module, material, accentMaterial, highlightMaterial);
        break;
      case 'storage':
        buildStorageModel(scene, module, material, accentMaterial, highlightMaterial);
        break;
    }
  };

  const buildSofaModel = (scene: THREE.Scene, module: FurnitureModule, mat: THREE.Material, _accentMat: THREE.Material, highlightMat: THREE.Material) => {
    const scale = 0.5;
    const w = module.dimensions.width * scale;
    const d = module.dimensions.depth * scale;
    const h = module.dimensions.height * scale;

    // Base/seat
    const seatGeo = new THREE.BoxGeometry(w, h * 0.3, d * 0.7);
    const seat = new THREE.Mesh(seatGeo, mat);
    seat.position.set(0, h * 0.15 + 2, 0);
    seat.castShadow = true;
    seat.receiveShadow = true;
    scene.add(seat);

    // Back
    const backGeo = new THREE.BoxGeometry(w, h * 0.7, d * 0.2);
    const back = new THREE.Mesh(backGeo, mat);
    back.position.set(0, h * 0.5, -d * 0.35 + d * 0.1);
    back.castShadow = true;
    scene.add(back);

    // Arms
    const armGeo = new THREE.BoxGeometry(w * 0.08, h * 0.5, d * 0.7);
    const leftArm = new THREE.Mesh(armGeo, mat);
    leftArm.position.set(-w * 0.46, h * 0.35, 0);
    leftArm.castShadow = true;
    scene.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, mat);
    rightArm.position.set(w * 0.46, h * 0.35, 0);
    rightArm.castShadow = true;
    scene.add(rightArm);

    // Cushions
    const cushionGeo = new THREE.BoxGeometry(w * 0.28, h * 0.15, d * 0.5);
    for (let i = -1; i <= 1; i++) {
      const cushion = new THREE.Mesh(cushionGeo, highlightMat);
      cushion.position.set(i * w * 0.3, h * 0.38, d * 0.05);
      cushion.castShadow = true;
      scene.add(cushion);
    }

    // Legs
    const legGeo = new THREE.CylinderGeometry(3, 3, 5, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.6 });
    const legPositions = [[-w * 0.4, -d * 0.3], [w * 0.4, -d * 0.3], [-w * 0.4, d * 0.3], [w * 0.4, d * 0.3]];
    legPositions.forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x as number, 0, z as number);
      leg.castShadow = true;
      scene.add(leg);
    });
  };

  const buildBedModel = (scene: THREE.Scene, module: FurnitureModule, mat: THREE.Material, accentMat: THREE.Material, highlightMat: THREE.Material) => {
    const scale = 0.5;
    const w = module.dimensions.width * scale;
    const d = module.dimensions.depth * scale;
    const h = module.dimensions.height * scale;

    // Platform base
    const baseGeo = new THREE.BoxGeometry(w, h * 0.15, d);
    const base = new THREE.Mesh(baseGeo, mat);
    base.position.set(0, h * 0.075 + 2, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);

    // Mattress
    const mattressGeo = new THREE.BoxGeometry(w * 0.95, h * 0.25, d * 0.9);
    const mattress = new THREE.Mesh(mattressGeo, highlightMat);
    mattress.position.set(0, h * 0.28, 0);
    mattress.castShadow = true;
    scene.add(mattress);

    // Headboard
    const headboardGeo = new THREE.BoxGeometry(w, h * 0.6, 5);
    const headboard = new THREE.Mesh(headboardGeo, accentMat);
    headboard.position.set(0, h * 0.45, -d * 0.48);
    headboard.castShadow = true;
    scene.add(headboard);

    // Pillows
    const pillowGeo = new THREE.BoxGeometry(w * 0.35, h * 0.15, 15);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 });
    [-w * 0.28, w * 0.28].forEach(x => {
      const pillow = new THREE.Mesh(pillowGeo, pillowMat);
      pillow.position.set(x, h * 0.45, -d * 0.3);
      pillow.castShadow = true;
      scene.add(pillow);
    });

    // Legs
    const legGeo = new THREE.CylinderGeometry(4, 4, 8, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    [[-w * 0.45, -d * 0.45], [w * 0.45, -d * 0.45], [-w * 0.45, d * 0.45], [w * 0.45, d * 0.45]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x as number, -2, z as number);
      leg.castShadow = true;
      scene.add(leg);
    });
  };

  const buildChairModel = (scene: THREE.Scene, module: FurnitureModule, mat: THREE.Material, _accentMat: THREE.Material, _highlightMat: THREE.Material) => {
    const scale = 1;
    const w = module.dimensions.width * scale;
    const d = module.dimensions.depth * scale;
    const h = module.dimensions.height * scale;

    // Seat
    const seatGeo = new THREE.BoxGeometry(w, 8, d);
    const seat = new THREE.Mesh(seatGeo, mat);
    seat.position.set(0, h * 0.45 + 2, 0);
    seat.castShadow = true;
    scene.add(seat);

    // Back
    const backGeo = new THREE.BoxGeometry(w * 0.9, h * 0.5, 8);
    const back = new THREE.Mesh(backGeo, mat);
    back.position.set(0, h * 0.75, -d * 0.4);
    back.castShadow = true;
    scene.add(back);

    // Armrests
    const armGeo = new THREE.BoxGeometry(8, h * 0.25, d * 0.6);
    const leftArm = new THREE.Mesh(armGeo, mat);
    leftArm.position.set(-w * 0.45, h * 0.6, 0);
    leftArm.castShadow = true;
    scene.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, mat);
    rightArm.position.set(w * 0.45, h * 0.6, 0);
    rightArm.castShadow = true;
    scene.add(rightArm);

    // Center pole
    const poleGeo = new THREE.CylinderGeometry(4, 4, h * 0.4, 16);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.7 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, h * 0.2, 0);
    pole.castShadow = true;
    scene.add(pole);

    // Base star
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1A1A2E, roughness: 0.2, metalness: 0.8 });
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const armBase = new THREE.Mesh(new THREE.BoxGeometry(30, 4, 8), baseMat);
      armBase.position.set(Math.cos(angle) * 25, 2, Math.sin(angle) * 25);
      armBase.rotation.y = angle;
      armBase.castShadow = true;
      scene.add(armBase);

      // Wheels
      const wheelGeo = new THREE.SphereGeometry(4, 16, 16);
      const wheel = new THREE.Mesh(wheelGeo, baseMat);
      wheel.position.set(Math.cos(angle) * 35, 0, Math.sin(angle) * 35);
      scene.add(wheel);
    }
  };

  const buildTableModel = (scene: THREE.Scene, module: FurnitureModule, mat: THREE.Material, _accentMat: THREE.Material, _highlightMat: THREE.Material) => {
    const scale = 0.55;
    const w = module.dimensions.width * scale;
    const d = module.dimensions.depth * scale;
    const h = module.dimensions.height * scale;

    // Main table top with beveled appearance
    const topGeo = new THREE.BoxGeometry(w, 6, d);
    const top = new THREE.Mesh(topGeo, mat);
    top.position.set(0, h - 3 + 2, 0);
    top.castShadow = true;
    top.receiveShadow = true;
    scene.add(top);

    // Table top edge trim (darker accent)
    const edgeGeo = new THREE.BoxGeometry(w + 2, 2, d + 2);
    const edge = new THREE.Mesh(edgeGeo, mat);
    edge.position.set(0, h - 7 + 2, 0);
    edge.castShadow = true;
    scene.add(edge);

    // Tapered modern legs - angled outward
    const legMat = new THREE.MeshStandardMaterial({ 
      color: 0x2C3E50, 
      roughness: 0.15, 
      metalness: 0.8 
    });
    
    // Front left leg (tapered)
    const frontLeftLegGeo = new THREE.CylinderGeometry(3, 5, h - 6, 16);
    const frontLeftLeg = new THREE.Mesh(frontLeftLegGeo, legMat);
    frontLeftLeg.position.set(-w * 0.42, (h - 6) / 2 + 2, d * 0.38);
    frontLeftLeg.rotation.x = 0.05;
    frontLeftLeg.rotation.z = 0.05;
    frontLeftLeg.castShadow = true;
    scene.add(frontLeftLeg);

    // Front right leg
    const frontRightLegGeo = new THREE.CylinderGeometry(3, 5, h - 6, 16);
    const frontRightLeg = new THREE.Mesh(frontRightLegGeo, legMat);
    frontRightLeg.position.set(w * 0.42, (h - 6) / 2 + 2, d * 0.38);
    frontRightLeg.rotation.x = 0.05;
    frontRightLeg.rotation.z = -0.05;
    frontRightLeg.castShadow = true;
    scene.add(frontRightLeg);

    // Back left leg
    const backLeftLegGeo = new THREE.CylinderGeometry(3, 5, h - 6, 16);
    const backLeftLeg = new THREE.Mesh(backLeftLegGeo, legMat);
    backLeftLeg.position.set(-w * 0.42, (h - 6) / 2 + 2, -d * 0.38);
    backLeftLeg.rotation.x = -0.05;
    backLeftLeg.rotation.z = 0.05;
    backLeftLeg.castShadow = true;
    scene.add(backLeftLeg);

    // Back right leg
    const backRightLegGeo = new THREE.CylinderGeometry(3, 5, h - 6, 16);
    const backRightLeg = new THREE.Mesh(backRightLegGeo, legMat);
    backRightLeg.position.set(w * 0.42, (h - 6) / 2 + 2, -d * 0.38);
    backRightLeg.rotation.x = -0.05;
    backRightLeg.rotation.z = -0.05;
    backRightLeg.castShadow = true;
    scene.add(backRightLeg);

    // Cross support beam (metal)
    const supportMat = new THREE.MeshStandardMaterial({
      color: 0x1A1A2E,
      roughness: 0.2,
      metalness: 0.9
    });
    
    // Side supports
    const sideSupportGeo = new THREE.BoxGeometry(4, 4, d * 0.7);
    const leftSupport = new THREE.Mesh(sideSupportGeo, supportMat);
    leftSupport.position.set(-w * 0.35, h * 0.25 + 2, 0);
    leftSupport.castShadow = true;
    scene.add(leftSupport);

    const rightSupport = new THREE.Mesh(sideSupportGeo, supportMat);
    rightSupport.position.set(w * 0.35, h * 0.25 + 2, 0);
    rightSupport.castShadow = true;
    scene.add(rightSupport);

    // Decorative center bar
    const centerBarGeo = new THREE.BoxGeometry(w * 0.6, 3, 3);
    const centerBar = new THREE.Mesh(centerBarGeo, supportMat);
    centerBar.position.set(0, h * 0.15 + 2, 0);
    centerBar.castShadow = true;
    scene.add(centerBar);

    // Table settings - decorative elements
    // Plates
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3, metalness: 0.1 });
    const plateGeo = new THREE.CylinderGeometry(8, 8, 1, 32);
    
    const plate1 = new THREE.Mesh(plateGeo, plateMat);
    plate1.position.set(-w * 0.25, h + 2.5, -d * 0.2);
    plate1.castShadow = true;
    scene.add(plate1);

    const plate2 = new THREE.Mesh(plateGeo, plateMat);
    plate2.position.set(w * 0.25, h + 2.5, -d * 0.2);
    plate2.castShadow = true;
    scene.add(plate2);

    const plate3 = new THREE.Mesh(plateGeo, plateMat);
    plate3.position.set(0, h + 2.5, d * 0.3);
    plate3.castShadow = true;
    scene.add(plate3);

    // Glass water cups
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xADD8E6,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.4
    });
    const glassGeo = new THREE.CylinderGeometry(3, 2.5, 6, 16);
    
    const glass1 = new THREE.Mesh(glassGeo, glassMat);
    glass1.position.set(-w * 0.25, h + 5, d * 0.1);
    glass1.castShadow = true;
    scene.add(glass1);

    const glass2 = new THREE.Mesh(glassGeo, glassMat);
    glass2.position.set(w * 0.25, h + 5, d * 0.1);
    glass2.castShadow = true;
    scene.add(glass2);

    // Center decorative vase
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.4, metalness: 0.2 });
    const vaseGeo = new THREE.CylinderGeometry(4, 6, 12, 16);
    const vase = new THREE.Mesh(vaseGeo, vaseMat);
    vase.position.set(0, h + 8, 0);
    vase.castShadow = true;
    scene.add(vase);

    // Flower arrangement
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xE74C3C, roughness: 0.6 });
    const flowerGeo = new THREE.SphereGeometry(3, 16, 16);
    
    const flower1 = new THREE.Mesh(flowerGeo, flowerMat);
    flower1.position.set(-2, h + 16, 0);
    flower1.castShadow = true;
    scene.add(flower1);

    const flower2 = new THREE.Mesh(flowerGeo, new THREE.MeshStandardMaterial({ color: 0xF39C12, roughness: 0.6 }));
    flower2.position.set(3, h + 15, 2);
    flower2.castShadow = true;
    scene.add(flower2);

    const flower3 = new THREE.Mesh(flowerGeo, new THREE.MeshStandardMaterial({ color: 0x9B59B6, roughness: 0.6 }));
    flower3.position.set(1, h + 17, -2);
    flower3.castShadow = true;
    scene.add(flower3);
  };

  const buildLampModel = (scene: THREE.Scene, module: FurnitureModule, mat: THREE.Material, _accentMat: THREE.Material, _highlightMat: THREE.Material) => {
    const h = module.dimensions.height * 0.4;

    // Base
    const baseGeo = new THREE.CylinderGeometry(25, 30, 8, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xE8DCC8, roughness: 0.2, metalness: 0.1 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 4, 0);
    base.castShadow = true;
    scene.add(base);

    // Pole
    const poleGeo = new THREE.CylinderGeometry(4, 4, h * 0.8, 16);
    const pole = new THREE.Mesh(poleGeo, mat);
    pole.position.set(0, h * 0.4 + 8, 0);
    pole.castShadow = true;
    scene.add(pole);

    // Arc arm
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, h * 0.8 + 8, 0),
      new THREE.Vector3(50, h * 0.9 + 8, 0),
      new THREE.Vector3(80, h * 0.7 + 8, 30)
    );
    const armGeo = new THREE.TubeGeometry(curve, 20, 3, 8, false);
    const arm = new THREE.Mesh(armGeo, mat);
    arm.castShadow = true;
    scene.add(arm);

    // Shade
    const shadeGeo = new THREE.CylinderGeometry(25, 35, 30, 32, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({ 
      color: 0xF5F5F5, 
      roughness: 0.9, 
      side: THREE.DoubleSide,
      emissive: 0xFFFDD0,
      emissiveIntensity: 0.3
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(80, h * 0.7 + 8, 30);
    shade.castShadow = true;
    scene.add(shade);

    // Light bulb glow
    const glowGeo = new THREE.SphereGeometry(8, 16, 16);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0xFFFDD0,
      emissive: 0xFFFDD0,
      emissiveIntensity: 1
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(80, h * 0.65 + 8, 30);
    scene.add(glow);
  };

  const buildStorageModel = (scene: THREE.Scene, module: FurnitureModule, mat: THREE.Material, accentMat: THREE.Material, highlightMat: THREE.Material) => {
    const scale = 0.6;
    const w = module.dimensions.width * scale;
    const d = module.dimensions.depth * scale;
    const h = module.dimensions.height * scale;

    // Main frame
    const frameGeo = new THREE.BoxGeometry(w, h, d);
    const frame = new THREE.Mesh(frameGeo, mat);
    frame.position.set(0, h / 2 + 2, 0);
    frame.castShadow = true;
    frame.receiveShadow = true;
    scene.add(frame);

    // Shelves
    const shelfGeo = new THREE.BoxGeometry(w * 0.95, 3, d * 0.9);
    for (let i = 1; i < 5; i++) {
      const shelf = new THREE.Mesh(shelfGeo, highlightMat);
      shelf.position.set(0, i * h * 0.2 + 2, 0);
      scene.add(shelf);
    }

    // Side panels
    const sideGeo = new THREE.BoxGeometry(5, h, d);
    const leftSide = new THREE.Mesh(sideGeo, accentMat);
    leftSide.position.set(-w / 2 + 2, h / 2 + 2, 0);
    leftSide.castShadow = true;
    scene.add(leftSide);

    const rightSide = new THREE.Mesh(sideGeo, accentMat);
    rightSide.position.set(w / 2 - 2, h / 2 + 2, 0);
    rightSide.castShadow = true;
    scene.add(rightSide);

    // Decorative items
    const bookGeo = new THREE.BoxGeometry(15, 20, 8);
    const bookColors = [0xE74C3C, 0x3498DB, 0x2ECC71, 0xF39C12];
    bookColors.forEach((color, i) => {
      const bookMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(-w * 0.35 + i * 12, h * 0.75 + 2, 0);
      book.castShadow = true;
      scene.add(book);
    });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="h-screen bg-[#F5F5F5] dark:bg-[#1A1E24] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-[#2D333A] border-b border-[#E8E4DE] dark:border-[#3F454D] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24] transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Back</span>
          </motion.button>
          <div className="h-6 w-px bg-[#E8E4DE] dark:bg-[#3F454D]" />
          <h1 className="text-lg font-semibold text-[#2C3E50] dark:text-[#E5E7EB]">
            3D Design Studio
          </h1>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Module Selection Panel */}
        <div className="w-80 bg-white dark:bg-[#2D333A] border-r border-[#E8E4DE] dark:border-[#3F454D] flex flex-col">
          <div className="p-4 border-b border-[#E8E4DE] dark:border-[#3F454D]">
            <h2 className="text-lg font-semibold text-[#2C3E50] dark:text-[#E5E7EB] mb-2">
              Choose a Module
            </h2>
            <p className="text-sm text-[#6b6560] dark:text-[#9CA3AF]">
              Select a furniture module to preview in 3D
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {furnitureModules.map((module) => (
              <motion.button
                key={module.id}
                onClick={() => handleModuleSelect(module)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                  selectedModule?.id === module.id
                    ? 'bg-[#A3C4BC]/20 dark:bg-[#86A789]/30 border-[#86A789] shadow-[#86A789]/20 shadow-lg'
                    : 'bg-white dark:bg-[#1A1E24] border-[#E8E4DE] dark:border-[#3F454D] hover:border-[#A3C4BC] dark:hover:border-[#86A789] hover:shadow-[#A3C4BC]/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: module.color }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {module.modelType === 'sofa' && <Sofa className="w-6 h-6 text-white" />}
                    {module.modelType === 'bed' && <Bed className="w-6 h-6 text-white" />}
                    {module.modelType === 'chair' && <Armchair className="w-6 h-6 text-white" />}
                    {module.modelType === 'table' && <Box className="w-6 h-6 text-white" />}
                    {module.modelType === 'lamp' && <Lamp className="w-6 h-6 text-white" />}
                    {module.modelType === 'storage' && <DoorOpen className="w-6 h-6 text-white" />}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#2C3E50] dark:text-[#E5E7EB]">{module.name}</h3>
                    <p className="text-xs text-[#6b6560] dark:text-[#9CA3AF] mt-1">{module.category}</p>
                <div className="flex items-center gap-2">
                      <motion.span 
                        className="text-xs text-[#A3C4BC] dark:text-[#86A789] font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        {module.dimensions.width}×{module.dimensions.depth}×{module.dimensions.height} cm
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 3D Viewer Area */}
        <div className="flex-1 flex flex-col">
          {selectedModule ? (
            <>
              {/* Viewer Controls */}
              <div className="h-12 bg-white dark:bg-[#2D333A] border-b border-[#E8E4DE] dark:border-[#3F454D] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB]">
                    {selectedModule.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Auto Rotate Toggle */}
                  <motion.button
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    whileHover={{ scale: 1.1, rotate: isAutoRotate ? 0 : 180 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2.5 rounded-xl transition-all duration-200 shadow-sm ${
                      isAutoRotate 
                        ? 'bg-gradient-to-br from-[#86A789] to-[#6B8E7D] text-white shadow-[#86A789]/30' 
                        : 'text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24]'
                    }`}
                  >
                    <RotateCw className="w-4 h-4" />
                  </motion.button>

                  {/* Measurements Toggle */}
                  <motion.button
                    onClick={() => setShowMeasurements(!showMeasurements)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2.5 rounded-xl transition-all duration-200 shadow-sm ${
                      showMeasurements 
                        ? 'bg-gradient-to-br from-[#86A789] to-[#6B8E7D] text-white shadow-[#86A789]/30' 
                        : 'text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24]'
                    }`}
                  >
                    <Ruler className="w-4 h-4" />
                  </motion.button>

                  {/* Zoom Controls */}
                  <motion.div 
                    className="flex items-center gap-1 border-l border-[#E8E4DE] dark:border-[#3F454D] pl-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24] transition-all"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </motion.button>
                    <span className="text-xs text-[#6b6560] dark:text-[#9CA3AF] w-12 text-center font-medium">
                      {Math.round(zoom * 100)}%
                    </span>
                    <motion.button
                      onClick={() => setZoom(Math.min(2, zoom + 0.2))}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24] transition-all"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </motion.button>
                  </motion.div>

                  {/* Quality Selector */}
                  <motion.select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                    whileHover={{ scale: 1.05 }}
                    whileFocus={{ scale: 1.02 }}
                    className="text-xs bg-white dark:bg-[#1A1E24] text-[#2C3E50] dark:text-[#E5E7EB] border-2 border-[#E8E4DE] dark:border-[#3F454D] rounded-xl px-3 py-1.5 font-medium cursor-pointer hover:border-[#86A789] dark:hover:border-[#86A789] transition-all focus:outline-none focus:border-[#86A789] focus:ring-2 focus:ring-[#86A789]/20"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </motion.select>

                  {/* Color Palette Toggle */}
                  <motion.button
                    onClick={() => setShowColorPanel(!showColorPanel)}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2.5 rounded-xl transition-all duration-200 shadow-sm ${
                      showColorPanel 
                        ? 'bg-gradient-to-br from-[#86A789] to-[#6B8E7D] text-white shadow-[#86A789]/30' 
                        : 'text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24]'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                  </motion.button>

                  {/* Fullscreen */}
                  <motion.button
                    onClick={handleFullscreen}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-xl text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24] transition-all duration-200 shadow-sm"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* 3D Canvas */}
              <div className="flex-1 relative">
                <div ref={containerRef} className="absolute inset-0" />
                
                {/* Measurements Panel */}
                {showMeasurements && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-[#2D333A]/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#E8E4DE] dark:border-[#3F454D]"
                  >
                    <h4 className="text-sm font-semibold text-[#2C3E50] dark:text-[#E5E7EB] mb-3">
                      Dimensions
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-[#6b6560] dark:text-[#9CA3AF]">Width</span>
                        <span className="text-[#2C3E50] dark:text-[#E5E7EB] font-medium">{selectedModule.dimensions.width} cm</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[#6b6560] dark:text-[#9CA3AF]">Depth</span>
                        <span className="text-[#2C3E50] dark:text-[#E5E7EB] font-medium">{selectedModule.dimensions.depth} cm</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[#6b6560] dark:text-[#9CA3AF]">Height</span>
                        <span className="text-[#2C3E50] dark:text-[#E5E7EB] font-medium">{selectedModule.dimensions.height} cm</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Color Panel */}
                {showColorPanel && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-[#2D333A]/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#E8E4DE] dark:border-[#3F454D] w-72"
                  >
                    <h4 className="text-sm font-semibold text-[#2C3E50] dark:text-[#E5E7EB] mb-3">
                      Color Options
                    </h4>
                    
                    {/* Preset Palettes */}
                    <div className="mb-4">
                      <p className="text-xs text-[#6b6560] dark:text-[#9CA3AF] mb-2">Preset Palettes</p>
                      <div className="grid grid-cols-5 gap-2">
                        {colorPalettes.map((palette, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => {
                              setPrimaryColor(palette.primary);
                              setAccentColor(palette.accent);
                              setHighlightColor(palette.primary);
                            }}
                            whileHover={{ scale: 1.15, rotate: 3 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 rounded-xl border-2 border-[#E8E4DE] dark:border-[#3F454D] hover:border-[#86A789] hover:shadow-lg transition-all"
                            style={{ background: `linear-gradient(135deg, ${palette.primary} 50%, ${palette.accent} 50%)` }}
                            title={palette.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Primary Color */}
                    <div className="mb-4">
                      <p className="text-xs text-[#6b6560] dark:text-[#9CA3AF] mb-2 font-medium">Primary Color</p>
                      <div className="flex items-center gap-2">
                        <motion.input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-xl border-2 border-[#E8E4DE] dark:border-[#3F454D] cursor-pointer shadow-sm hover:shadow-md transition-all"
                        />
                        <motion.input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          whileFocus={{ scale: 1.02, borderColor: '#86A789' }}
                          className="flex-1 text-xs bg-white dark:bg-[#1A1E24] text-[#2C3E50] dark:text-[#E5E7EB] border-2 border-[#E8E4DE] dark:border-[#3F454D] rounded-xl px-3 py-2 font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#86A789]/20"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="mb-4">
                      <p className="text-xs text-[#6b6560] dark:text-[#9CA3AF] mb-2 font-medium">Accent Color</p>
                      <div className="flex items-center gap-2">
                        <motion.input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-xl border-2 border-[#E8E4DE] dark:border-[#3F454D] cursor-pointer shadow-sm hover:shadow-md transition-all"
                        />
                        <motion.input
                          type="text"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          whileFocus={{ scale: 1.02, borderColor: '#86A789' }}
                          className="flex-1 text-xs bg-white dark:bg-[#1A1E24] text-[#2C3E50] dark:text-[#E5E7EB] border-2 border-[#E8E4DE] dark:border-[#3F454D] rounded-xl px-3 py-2 font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#86A789]/20"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    {/* Custom Color Presets */}
                    <div className="mb-4">
                      <p className="text-xs text-[#6b6560] dark:text-[#9CA3AF] mb-2 font-medium">Quick Colors</p>
                      <div className="grid grid-cols-5 gap-2">
                        {customColors.map((color, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => setPrimaryColor(color)}
                            whileHover={{ scale: 1.15, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 rounded-xl border-2 border-[#E8E4DE] dark:border-[#3F454D] hover:border-[#86A789] hover:shadow-md transition-all"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Highlight Color */}
                    <div>
                      <p className="text-xs text-[#6b6560] dark:text-[#9CA3AF] mb-2 font-medium">Highlight/Cushion Color</p>
                      <div className="flex items-center gap-2">
                        <motion.input
                          type="color"
                          value={highlightColor}
                          onChange={(e) => setHighlightColor(e.target.value)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-xl border-2 border-[#E8E4DE] dark:border-[#3F454D] cursor-pointer shadow-sm hover:shadow-md transition-all"
                        />
                        <motion.input
                          type="text"
                          value={highlightColor}
                          onChange={(e) => setHighlightColor(e.target.value)}
                          whileFocus={{ scale: 1.02, borderColor: '#86A789' }}
                          className="flex-1 text-xs bg-white dark:bg-[#1A1E24] text-[#2C3E50] dark:text-[#E5E7EB] border-2 border-[#E8E4DE] dark:border-[#3F454D] rounded-xl px-3 py-2 font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#86A789]/20"
                          placeholder="#A3C4BC"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Description Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 right-20 bg-white/90 dark:bg-[#2D333A]/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#E8E4DE] dark:border-[#3F454D]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-semibold text-[#2C3E50] dark:text-[#E5E7EB]">
                          {selectedModule.name}
                        </h4>
                        <span className="text-xs px-2 py-0.5 bg-[#A3C4BC]/20 dark:bg-[#86A789]/20 text-[#2C3E50] dark:text-[#E5E7EB] rounded-full">
                          {selectedModule.category}
                        </span>
                      </div>
                      <p className="text-sm text-[#6b6560] dark:text-[#9CA3AF]">
                        {selectedModule.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-[#6b6560] dark:text-[#9CA3AF] block">Dimensions</span>
                        <span className="text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB]">
                          {selectedModule.dimensions.width} × {selectedModule.dimensions.depth} × {selectedModule.dimensions.height} cm
                        </span>
                      </div>
                      <motion.button
                        onClick={() => onStartDesign(selectedModule)}
                        whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(134, 167, 137, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2C3E50] to-[#3D5A6E] dark:from-[#86A789] dark:to-[#6B8E7D] text-white dark:text-[#1A1E24] rounded-xl text-sm font-semibold shadow-lg shadow-[#2C3E50]/20 dark:shadow-[#86A789]/30 transition-all duration-200"
                      >
                        <Play className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        Start Design
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Box className="w-20 h-20 mx-auto text-[#E8E4DE] dark:text-[#3F454D] mb-4" />
                <h3 className="text-xl font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-2">
                  Select a Module
                </h3>
                <p className="text-[#6b6560] dark:text-[#9CA3AF]">
                  Choose a furniture module from the panel to preview
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
