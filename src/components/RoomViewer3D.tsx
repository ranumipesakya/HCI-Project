// Updated by Ishira
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  ArrowLeft, 
  Move3D, 
  Sun, 
  Moon, 
  Maximize2, 
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
  Camera,
  Ruler,
  Type,
  Grid3X3,
  Box,
  X,
} from 'lucide-react';

interface PlacedFurniture {
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
}

interface RoomSpec {
  width: number;
  length: number;
  wallColor: string;
  floorColor: string;
}

interface RoomViewer3DProps {
  room: RoomSpec;
  furniture: PlacedFurniture[];
  onBack: () => void;
}

// Furniture color palettes for realistic looks - enhanced with more variety
const furnitureMaterials: Record<string, { color: string; roughness: number; metalness: number }> = {
  'Sofa': { color: '#6B8E7D', roughness: 0.8, metalness: 0.0 },
  'Armchair': { color: '#8B7355', roughness: 0.7, metalness: 0.0 },
  'Coffee Table': { color: '#5C4033', roughness: 0.4, metalness: 0.1 },
  'Dining Table': { color: '#5C4033', roughness: 0.4, metalness: 0.1 },
  'Dining Chair': { color: '#8B7355', roughness: 0.6, metalness: 0.0 },
  'Bookshelf': { color: '#5C4033', roughness: 0.5, metalness: 0.0 },
  'TV Stand': { color: '#2C3E50', roughness: 0.3, metalness: 0.2 },
  'Bed': { color: '#F5F5F5', roughness: 0.9, metalness: 0.0 },
  'Nightstand': { color: '#5C4033', roughness: 0.4, metalness: 0.1 },
  'Wardrobe': { color: '#F5F5F5', roughness: 0.3, metalness: 0.1 },
  'Desk': { color: '#5C4033', roughness: 0.4, metalness: 0.1 },
  'Office Chair': { color: '#2C3E50', roughness: 0.5, metalness: 0.2 },
};

// Camera presets
const cameraPresets = [
  { name: 'Isometric', position: { x: 500, y: 400, z: 500 }, lookAt: { x: 0, y: 0, z: 0 } },
  { name: 'Top View', position: { x: 0, y: 600, z: 0 }, lookAt: { x: 0, y: 0, z: 0 } },
  { name: 'Front View', position: { x: 0, y: 200, z: 600 }, lookAt: { x: 0, y: 100, z: 0 } },
  { name: 'Side View', position: { x: 600, y: 200, z: 0 }, lookAt: { x: 0, y: 100, z: 0 } },
  { name: 'Corner View', position: { x: 450, y: 300, z: 450 }, lookAt: { x: 0, y: 50, z: 0 } },
];

// Quality settings
const qualitySettings = {
  low: { shadowMapSize: 1024, pixelRatio: 1 },
  medium: { shadowMapSize: 2048, pixelRatio: 1.5 },
  high: { shadowMapSize: 4096, pixelRatio: 2 },
};

export function RoomViewer3D({ room, furniture, onBack }: RoomViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number>(0);
  const annotationGroupRef = useRef<THREE.Group | null>(null);
  const dimensionLinesRef = useRef<THREE.Group | null>(null);
  
  // Dark/Light mode state
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // UI State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wallMaterial, setWallMaterial] = useState<'matte' | 'glossy' | 'textured'>('matte');
  const [floorMaterialType, setFloorMaterialType] = useState<'matte' | 'polished' | 'textured'>('polished');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showDimensionLines, setShowDimensionLines] = useState(true);
  const [showShadows, setShowShadows] = useState(true);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [cameraPreset, setCameraPreset] = useState(0);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? '#1A1E24' : '#F5F5F5');
    scene.fog = new THREE.Fog(isDarkMode ? '#1A1E24' : '#F5F5F5', 500, 1500);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      5,
      2500
    );
    const preset = cameraPresets[cameraPreset];
    camera.position.set(preset.position.x, preset.position.y, preset.position.z);
    camera.lookAt(preset.lookAt.x, preset.lookAt.y, preset.lookAt.z);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, qualitySettings[quality].pixelRatio));
    // Enable physically correct lighting across Three.js versions
    if ('useLegacyLights' in renderer) {
      (renderer as unknown as { useLegacyLights: boolean }).useLegacyLights = false;
    } else {
      (renderer as unknown as { physicallyCorrectLights: boolean }).physicallyCorrectLights = true;
    }
    renderer.shadowMap.enabled = showShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDarkMode ? 1.2 : 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 200;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Professional Lighting Setup
    setupLighting(scene);

    // Build room
    buildRoom(scene, room, floorMaterialType);

    // Add furniture
    furniture.forEach(item => {
      addFurnitureToScene(scene, item);
    });

    // Create annotation group
    annotationGroupRef.current = new THREE.Group();
    annotationGroupRef.current.visible = showAnnotations;
    scene.add(annotationGroupRef.current);

    // Create dimension lines group
    dimensionLinesRef.current = new THREE.Group();
    dimensionLinesRef.current.visible = showDimensionLines;
    scene.add(dimensionLinesRef.current);

    // Add annotations
    if (showAnnotations) {
      addAnnotations();
    }
    if (showDimensionLines) {
      addDimensionLines();
    }

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
  }, []);

  // Update scene when room or furniture changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Remove old room and furniture
    const toRemove: THREE.Object3D[] = [];
    sceneRef.current.traverse((child) => {
      if (child.userData.isRoom || child.userData.isFurniture || child.userData.isAnnotation || child.userData.isDimensionLine) {
        toRemove.push(child);
      }
    });
    toRemove.forEach(obj => {
      sceneRef.current?.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    // Rebuild room
    buildRoom(sceneRef.current, room, floorMaterialType);

    // Add furniture
    furniture.forEach(item => {
      addFurnitureToScene(sceneRef.current!, item);
    });

    // Update annotations
    if (annotationGroupRef.current) {
      annotationGroupRef.current.clear();
      if (showAnnotations) {
        addAnnotations();
      }
    }

    if (dimensionLinesRef.current) {
      dimensionLinesRef.current.clear();
      if (showDimensionLines) {
        addDimensionLines();
      }
    }
  }, [room, furniture, floorMaterialType, wallMaterial, showAnnotations, showDimensionLines, isDarkMode, showShadows]);

  // Update dark/light mode
  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.background = new THREE.Color(isDarkMode ? '#1A1E24' : '#F5F5F5');
    sceneRef.current.fog = new THREE.Fog(isDarkMode ? '#1A1E24' : '#F5F5F5', 500, 1500);

    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = isDarkMode ? 1.2 : 1.0;
    }

    setupLighting(sceneRef.current);
  }, [isDarkMode]);

  // Update auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update light intensity
  useEffect(() => {
    if (!sceneRef.current) return;
    setupLighting(sceneRef.current);
  }, [lightIntensity]);

  // Update shadows
  useEffect(() => {
    if (!rendererRef.current) return;
    rendererRef.current.shadowMap.enabled = showShadows;
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = showShadows;
          child.receiveShadow = showShadows;
        }
      });
    }

    if (sceneRef.current) {
      setupLighting(sceneRef.current);
    }
  }, [showShadows]);

  // Update quality
  useEffect(() => {
    if (!rendererRef.current || !containerRef.current) return;
    const settings = qualitySettings[quality];
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, settings.pixelRatio));
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;

    if (sceneRef.current) {
      setupLighting(sceneRef.current);
    }
  }, [quality]);

  // Update camera preset
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const preset = cameraPresets[cameraPreset];
    cameraRef.current.position.set(preset.position.x, preset.position.y, preset.position.z);
    cameraRef.current.lookAt(preset.lookAt.x, preset.lookAt.y, preset.lookAt.z);
    controlsRef.current.target.set(preset.lookAt.x, preset.lookAt.y, preset.lookAt.z);
    controlsRef.current.update();
  }, [cameraPreset]);

  // Update annotation visibility
  useEffect(() => {
    if (annotationGroupRef.current) {
      annotationGroupRef.current.visible = showAnnotations;
    }
  }, [showAnnotations]);

  // Update dimension lines visibility
  useEffect(() => {
    if (dimensionLinesRef.current) {
      dimensionLinesRef.current.visible = showDimensionLines;
    }
  }, [showDimensionLines]);

  const setupLighting = (scene: THREE.Scene) => {
    // Clear existing lights
    const lightsToRemove: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Light) {
        lightsToRemove.push(child);
      }
    });
    lightsToRemove.forEach(light => scene.remove(light));

    // Ambient light - soft base illumination
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0xffffff : 0xffffff, isDarkMode ? 0.4 : 0.6);
    ambientLight.userData.isRoom = true;
    scene.add(ambientLight);

    // Main key light - warm white for realism
    const mainLight = new THREE.DirectionalLight(0xfff5e6, lightIntensity * (isDarkMode ? 0.8 : 1.0));
    mainLight.position.set(400, 600, 300);
    mainLight.castShadow = showShadows;
    mainLight.shadow.mapSize.width = qualitySettings[quality].shadowMapSize;
    mainLight.shadow.mapSize.height = qualitySettings[quality].shadowMapSize;
    mainLight.shadow.camera.near = 100;
    mainLight.shadow.camera.far = 1500;
    mainLight.shadow.camera.left = -600;
    mainLight.shadow.camera.right = 600;
    mainLight.shadow.camera.top = 600;
    mainLight.shadow.camera.bottom = -600;
    mainLight.shadow.bias = -0.0001;
    mainLight.shadow.normalBias = 0.02;
    mainLight.userData.isRoom = true;
    scene.add(mainLight);

    // Fill light - cool blue for contrast
    const fillLight = new THREE.DirectionalLight(0xc4d4e6, isDarkMode ? 0.3 : 0.4);
    fillLight.position.set(-400, 400, -300);
    fillLight.userData.isRoom = true;
    scene.add(fillLight);

    // Rim light - highlights edges
    const rimLight = new THREE.DirectionalLight(0xffffff, isDarkMode ? 0.15 : 0.25);
    rimLight.position.set(0, 300, -500);
    rimLight.userData.isRoom = true;
    scene.add(rimLight);

    // Hemisphere light - natural sky/ground gradient
    const hemiLight = new THREE.HemisphereLight(
      isDarkMode ? 0xffffff : 0x87ceeb,  // Sky color
      isDarkMode ? 0x444444 : 0x8B7355,   // Ground color
      isDarkMode ? 0.25 : 0.35
    );
    hemiLight.userData.isRoom = true;
    scene.add(hemiLight);

    // Accent spot lights for drama
    const spotLight1 = new THREE.SpotLight(0xffd4a3, 0.3, 800, Math.PI / 6, 0.5);
    spotLight1.position.set(200, 500, 200);
    spotLight1.target.position.set(0, 0, 0);
    scene.add(spotLight1);
    scene.add(spotLight1.target);

    // Environment map for realistic reflections
    if (rendererRef.current) {
      const pmremGenerator = new THREE.PMREMGenerator(rendererRef.current);
      pmremGenerator.compileEquirectangularShader();
      
      // Create a simple gradient environment
      const envScene = new THREE.Scene();
      const envGeo = new THREE.SphereGeometry(500, 32, 32);
      const envMat = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        color: isDarkMode ? 0x1a1e24 : 0xf5f5f5
      });
      const envMesh = new THREE.Mesh(envGeo, envMat);
      envScene.add(envMesh);
      
      try {
        const envMap = pmremGenerator.fromScene(envScene).texture;
        scene.environment = envMap;
      } catch (e) {
        // Fallback if environment map fails
        console.log('Environment map not available');
      }
      pmremGenerator.dispose();
    }
  };

  const buildRoom = (scene: THREE.Scene, roomData: RoomSpec, floorType: string) => {
    const roomWidth = roomData.width;
    const roomLength = roomData.length;
    const wallHeight = 280;

    // Create realistic floor with enhanced material
    const floorMat = createFloorMaterial(roomData.floorColor, floorType);
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomLength, 32, 32);
    const floor = new THREE.Mesh(floorGeometry, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.05, 0);
    floor.receiveShadow = showShadows;
    floor.userData.isRoom = true;
    scene.add(floor);

    // Floor border/trim with metallic finish
    const borderGeometry = new THREE.BoxGeometry(roomWidth + 30, 6, roomLength + 30);
    const borderMaterial = new THREE.MeshStandardMaterial({ 
      color: isDarkMode ? 0x2C3E50 : 0x4A5568, 
      roughness: 0.25,
      metalness: 0.3
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.set(0, -3.5, 0);
    border.receiveShadow = showShadows;
    border.userData.isRoom = true;
    scene.add(border);

    // Create realistic walls with subtle texture
    const wallMat = createWallMaterial(roomData.wallColor, wallMaterial);

    // Back wall (with trim)
    const backWallGeometry = new THREE.PlaneGeometry(roomWidth, wallHeight);
    const backWall = new THREE.Mesh(backWallGeometry, wallMat);
    backWall.position.set(0, wallHeight / 2, -roomLength / 2);
    backWall.receiveShadow = showShadows;
    backWall.userData.isRoom = true;
    scene.add(backWall);

    // Back wall baseboard - premium finish
    const backBaseboardGeometry = new THREE.BoxGeometry(roomWidth, 18, 6);
    const baseboardMaterial = new THREE.MeshStandardMaterial({ 
      color: isDarkMode ? 0xF5F5F5 : 0xE2E8F0, 
      roughness: 0.35,
      metalness: 0.15
    });
    const backBaseboard = new THREE.Mesh(backBaseboardGeometry, baseboardMaterial);
    backBaseboard.position.set(0, 9, -roomLength / 2 + 3);
    backBaseboard.userData.isRoom = true;
    scene.add(backBaseboard);

    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(roomLength, wallHeight);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMat.clone());
    leftWall.position.set(-roomWidth / 2, wallHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = showShadows;
    leftWall.userData.isRoom = true;
    scene.add(leftWall);

    // Left wall baseboard
    const leftBaseboardGeometry = new THREE.BoxGeometry(6, 18, roomLength);
    const leftBaseboard = new THREE.Mesh(leftBaseboardGeometry, baseboardMaterial.clone());
    leftBaseboard.position.set(-roomWidth / 2 + 3, 9, 0);
    leftBaseboard.userData.isRoom = true;
    scene.add(leftBaseboard);

    // Ceiling with subtle texture
    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomLength);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
      color: isDarkMode ? 0xFFFFFF : 0xFAFAFA, 
      roughness: 0.95,
      metalness: 0,
      side: THREE.DoubleSide
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, wallHeight, 0);
    ceiling.userData.isRoom = true;
    scene.add(ceiling);

    // Corner shadows for realism
    addCornerDetails(scene, roomWidth, roomLength, wallHeight);
  };

  const createFloorMaterial = (color: string, type: string) => {
    const roughness = type === 'textured' ? 0.95 : 0.9;
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.0,
      envMapIntensity: 0,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
  };

  const createWallMaterial = (color: string, type: string) => {
    switch (type) {
      case 'glossy':
        return new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.25,
          metalness: 0.0,
          clearcoat: 0.35,
          clearcoatRoughness: 0.25,
          side: THREE.DoubleSide
        });
      case 'textured':
        return new THREE.MeshStandardMaterial({ 
          color,
          roughness: 0.78,
          metalness: 0.0,
          side: THREE.DoubleSide
        });
      default:
        return new THREE.MeshStandardMaterial({ 
          color,
          roughness: 0.92,
          metalness: 0.0,
          side: THREE.DoubleSide
        });
    }
  };

  const addCornerDetails = (scene: THREE.Scene, roomWidth: number, roomLength: number, wallHeight: number) => {
    // Add corner caulk/sealant effect
    const cornerMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x888888, 
      roughness: 0.5,
      transparent: true,
      opacity: 0.3
    });

    // Back-left corner
    const corner1 = new THREE.Mesh(
      new THREE.BoxGeometry(10, wallHeight, 10),
      cornerMaterial
    );
    corner1.position.set(-roomWidth/2, wallHeight/2, -roomLength/2);
    corner1.userData.isRoom = true;
    scene.add(corner1);

    // Back-right corner
    const corner2 = new THREE.Mesh(
      new THREE.BoxGeometry(10, wallHeight, 10),
      cornerMaterial
    );
    corner2.position.set(roomWidth/2, wallHeight/2, -roomLength/2);
    corner2.userData.isRoom = true;
    scene.add(corner2);
  };

  const addAnnotations = () => {
    if (!annotationGroupRef.current) return;

    // Add room dimension labels
    const roomWidth = room.width;
    const roomLength = room.length;
    const wallHeight = 280;

    // Create sprite for text labels
    const createTextSprite = (text: string, color: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;
      
      context.fillStyle = 'transparent';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = 'bold 28px Inter, Arial, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = color;
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true,
        depthTest: false
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(80, 20, 1);
      return sprite;
    };

    // Room width label
    const widthLabel = createTextSprite(`${roomWidth} units`, isDarkMode ? '#86A789' : '#2C3E50');
    widthLabel.position.set(0, -30, -roomLength / 2 - 20);
    widthLabel.userData.isAnnotation = true;
    annotationGroupRef.current.add(widthLabel);

    // Room length label
    const lengthLabel = createTextSprite(`${roomLength} units`, isDarkMode ? '#86A789' : '#2C3E50');
    lengthLabel.position.set(-roomWidth / 2 - 40, -30, 0);
    lengthLabel.rotation.y = Math.PI / 2;
    lengthLabel.userData.isAnnotation = true;
    annotationGroupRef.current.add(lengthLabel);

    // Wall height label
    const heightLabel = createTextSprite(`H: ${wallHeight}`, isDarkMode ? '#86A789' : '#2C3E50');
    heightLabel.position.set(-roomWidth / 2 - 40, wallHeight / 2, -roomLength / 2);
    heightLabel.userData.isAnnotation = true;
    annotationGroupRef.current.add(heightLabel);

    // Add furniture labels
    furniture.forEach(item => {
      const posX = item.x + item.width / 2 - room.width / 2;
      const posZ = item.y + item.depth / 2 - room.length / 2;
      
      const label = createTextSprite(item.name, isDarkMode ? '#E5E7EB' : '#2C3E50');
      label.position.set(posX, item.height + 30, posZ);
      label.userData.isAnnotation = true;
      annotationGroupRef.current!.add(label);

      // Add dimension label
      const dimLabel = createTextSprite(
        `${item.width}x${item.depth}`, 
        isDarkMode ? '#9CA3AF' : '#6B7280'
      );
      dimLabel.position.set(posX, item.height + 15, posZ);
      dimLabel.scale.set(50, 12, 1);
      dimLabel.userData.isAnnotation = true;
      annotationGroupRef.current!.add(dimLabel);
    });
  };

  const addDimensionLines = () => {
    if (!dimensionLinesRef.current) return;

    const roomWidth = room.width;
    const roomLength = room.length;

    // Create dimension line material
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: isDarkMode ? 0x86A789 : 0x2C3E50,
      linewidth: 2
    });

    // Room width dimension line
    const widthPoints = [
      new THREE.Vector3(-roomWidth / 2, -20, -roomLength / 2 - 10),
      new THREE.Vector3(roomWidth / 2, -20, -roomLength / 2 - 10),
    ];
    const widthGeometry = new THREE.BufferGeometry().setFromPoints(widthPoints);
    const widthLine = new THREE.Line(widthGeometry, lineMaterial);
    widthLine.userData.isDimensionLine = true;
    dimensionLinesRef.current.add(widthLine);

    // Width end markers
    [-1, 1].forEach(side => {
      const markerPoints = [
        new THREE.Vector3(side * roomWidth / 2, -25, -roomLength / 2 - 10),
        new THREE.Vector3(side * roomWidth / 2, -15, -roomLength / 2 - 10),
      ];
      const markerGeometry = new THREE.BufferGeometry().setFromPoints(markerPoints);
      const marker = new THREE.Line(markerGeometry, lineMaterial);
      marker.userData.isDimensionLine = true;
      dimensionLinesRef.current!.add(marker);
    });

    // Room length dimension line
    const lengthPoints = [
      new THREE.Vector3(-roomWidth / 2 - 10, -20, -roomLength / 2),
      new THREE.Vector3(-roomWidth / 2 - 10, -20, roomLength / 2),
    ];
    const lengthGeometry = new THREE.BufferGeometry().setFromPoints(lengthPoints);
    const lengthLine = new THREE.Line(lengthGeometry, lineMaterial);
    lengthLine.userData.isDimensionLine = true;
    dimensionLinesRef.current.add(lengthLine);

    // Length end markers
    [-1, 1].forEach(side => {
      const markerPoints = [
        new THREE.Vector3(-roomWidth / 2 - 10, -25, side * roomLength / 2),
        new THREE.Vector3(-roomWidth / 2 - 10, -15, side * roomLength / 2),
      ];
      const markerGeometry = new THREE.BufferGeometry().setFromPoints(markerPoints);
      const marker = new THREE.Line(markerGeometry, lineMaterial);
      marker.userData.isDimensionLine = true;
      dimensionLinesRef.current!.add(marker);
    });

    // Add furniture dimension boxes
    furniture.forEach(item => {
      const posX = item.x + item.width / 2 - room.width / 2;
      const posZ = item.y + item.depth / 2 - room.length / 2;
      
      // Create bounding box outline
      const boxGeometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
      const edges = new THREE.EdgesGeometry(boxGeometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ 
          color: isDarkMode ? 0x86A789 : 0x2C3E50,
          transparent: true,
          opacity: 0.5
        })
      );
      line.position.set(posX, item.height / 2, posZ);
      line.rotation.y = (item.rotation * Math.PI) / 180;
      line.userData.isDimensionLine = true;
      dimensionLinesRef.current!.add(line);
    });
  };

  const addFurnitureToScene = (scene: THREE.Scene, item: PlacedFurniture) => {
    const furnitureType = item.name;
    // Use item.color if available, otherwise fall back to furnitureMaterials defaults
    const defaultMatProps = furnitureMaterials[furnitureType] || { color: '#808080', roughness: 0.5, metalness: 0.1 };
    const matProps = item.color ? { ...defaultMatProps, color: item.color } : defaultMatProps;

    switch (furnitureType) {
      case 'Sofa':
        createSofa(scene, item, matProps);
        break;
      case 'Armchair':
        createArmchair(scene, item, matProps);
        break;
      case 'Coffee Table':
        createCoffeeTable(scene, item, matProps);
        break;
      case 'Dining Table':
        createDiningTable(scene, item, matProps);
        break;
      case 'Dining Chair':
        createDiningChair(scene, item, matProps);
        break;
      case 'Bookshelf':
        createBookshelf(scene, item, matProps);
        break;
      case 'TV Stand':
        createTVStand(scene, item, matProps);
        break;
      case 'Bed':
        createBed(scene, item, matProps);
        break;
      case 'Nightstand':
        createNightstand(scene, item, matProps);
        break;
      case 'Wardrobe':
        createWardrobe(scene, item, matProps);
        break;
      case 'Desk':
        createDesk(scene, item, matProps);
        break;
      case 'Office Chair':
        createOfficeChair(scene, item, matProps);
        break;
      default:
        createDefaultFurniture(scene, item, matProps);
    }
  };

  // Enhanced furniture creation functions with more realistic details
  const createSofa = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Base/seat with rounded edges
    const seatGeometry = new THREE.BoxGeometry(item.width, item.height * 0.4, item.depth);
    const seat = new THREE.Mesh(seatGeometry, material);
    seat.position.set(posX, item.height * 0.2 + 5, posZ);
    seat.rotation.y = (item.rotation * Math.PI) / 180;
    seat.castShadow = showShadows;
    seat.receiveShadow = showShadows;
    seat.userData.isFurniture = true;
    seat.userData.name = item.name;
    scene.add(seat);

    // Back with slight curve effect
    const backGeometry = new THREE.BoxGeometry(item.width, item.height * 0.6, item.depth * 0.25);
    const back = new THREE.Mesh(backGeometry, material);
    back.position.set(posX, item.height * 0.5 + 5, posZ - item.depth * 0.375 + item.depth * 0.125);
    back.rotation.y = (item.rotation * Math.PI) / 180;
    back.castShadow = showShadows;
    back.userData.isFurniture = true;
    scene.add(back);

    // Arms with padding effect
    const armGeometry = new THREE.BoxGeometry(item.width * 0.1, item.height * 0.5, item.depth);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(posX - item.width * 0.45, item.height * 0.35 + 5, posZ);
    leftArm.rotation.y = (item.rotation * Math.PI) / 180;
    leftArm.castShadow = showShadows;
    leftArm.userData.isFurniture = true;
    scene.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(posX + item.width * 0.45, item.height * 0.35 + 5, posZ);
    rightArm.rotation.y = (item.rotation * Math.PI) / 180;
    rightArm.castShadow = showShadows;
    rightArm.userData.isFurniture = true;
    scene.add(rightArm);

    // Legs with realistic metal look
    const legGeometry = new THREE.CylinderGeometry(3, 3, 10, 8);
    const legPositions = [
      { x: -item.width * 0.4, z: -item.depth * 0.4 },
      { x: item.width * 0.4, z: -item.depth * 0.4 },
      { x: -item.width * 0.4, z: item.depth * 0.4 },
      { x: item.width * 0.4, z: item.depth * 0.4 },
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(posX + pos.x, 5, posZ + pos.z);
      leg.castShadow = showShadows;
      leg.userData.isFurniture = true;
      scene.add(leg);
    });

    // Cushions with user-selected color
    const cushionGeometry = new THREE.BoxGeometry(item.width * 0.28, item.height * 0.25, item.depth * 0.7);
    for (let i = 0; i < 3; i++) {
      const cushionMaterial = material.clone();
      // Use user's selected color with slight variation for visual interest
      const colorVariation = 0.1;
      const baseColor = new THREE.Color(matProps.color);
      cushionMaterial.color = baseColor.clone().offsetHSL(0, 0, (i - 1) * colorVariation);
      const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
      cushion.position.set(
        posX + (i - 1) * item.width * 0.3,
        item.height * 0.45 + 5,
        posZ
      );
      cushion.rotation.y = (item.rotation * Math.PI) / 180;
      cushion.castShadow = showShadows;
      cushion.userData.isFurniture = true;
      scene.add(cushion);
    }

    // Throw pillows with complementary colors based on user selection
    const baseColor = new THREE.Color(matProps.color);
    const complementaryColor = baseColor.clone().offsetHSL(0.5, 0, 0);
    const accentColors = [
      baseColor.clone().offsetHSL(0.1, -0.2, 0.1).getHex(),
      complementaryColor.getHex()
    ];
    [-1, 1].forEach((side, idx) => {
      const pillowGeometry = new THREE.BoxGeometry(20, 20, 8);
      const pillowMaterial = new THREE.MeshStandardMaterial({ 
        color: accentColors[idx % accentColors.length], 
        roughness: 0.9 
      });
      const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
      pillow.position.set(
        posX + side * item.width * 0.35,
        item.height * 0.6 + 5,
        posZ - item.depth * 0.25
      );
      pillow.rotation.y = (item.rotation * Math.PI) / 180;
      pillow.rotation.z = side * 0.2;
      pillow.castShadow = showShadows;
      pillow.userData.isFurniture = true;
      scene.add(pillow);
    });
  };

  const createArmchair = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Seat
    const seatGeometry = new THREE.BoxGeometry(item.width * 0.85, item.height * 0.35, item.depth * 0.85);
    const seat = new THREE.Mesh(seatGeometry, material);
    seat.position.set(posX, item.height * 0.175 + 8, posZ);
    seat.rotation.y = (item.rotation * Math.PI) / 180;
    seat.castShadow = showShadows;
    seat.userData.isFurniture = true;
    scene.add(seat);

    // Back with tufting effect
    const backGeometry = new THREE.BoxGeometry(item.width * 0.85, item.height * 0.55, item.depth * 0.2);
    const back = new THREE.Mesh(backGeometry, material);
    back.position.set(posX, item.height * 0.55 + 8, posZ - item.depth * 0.325);
    back.rotation.y = (item.rotation * Math.PI) / 180;
    back.castShadow = showShadows;
    back.userData.isFurniture = true;
    scene.add(back);

    // Arms
    const armGeometry = new THREE.BoxGeometry(item.width * 0.12, item.height * 0.4, item.depth * 0.8);
    [-1, 1].forEach(side => {
      const arm = new THREE.Mesh(armGeometry, material);
      arm.position.set(posX + side * item.width * 0.44, item.height * 0.35 + 8, posZ);
      arm.rotation.y = (item.rotation * Math.PI) / 180;
      arm.castShadow = showShadows;
      arm.userData.isFurniture = true;
      scene.add(arm);
    });

    // Legs
    const legGeometry = new THREE.CylinderGeometry(2, 2, 8, 8);
    const legPositions = [
      { x: -item.width * 0.35, z: -item.depth * 0.35 },
      { x: item.width * 0.35, z: -item.depth * 0.35 },
      { x: -item.width * 0.35, z: item.depth * 0.35 },
      { x: item.width * 0.35, z: item.depth * 0.35 },
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(posX + pos.x, 4, posZ + pos.z);
      leg.castShadow = showShadows;
      leg.userData.isFurniture = true;
      scene.add(leg);
    });

    // Cushion
    const cushionGeometry = new THREE.BoxGeometry(item.width * 0.7, 8, item.depth * 0.6);
    const cushionMaterial = material.clone();
    cushionMaterial.color = new THREE.Color(matProps.color).multiplyScalar(0.9);
    const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushion.position.set(posX, item.height * 0.35 + 12, posZ);
    cushion.rotation.y = (item.rotation * Math.PI) / 180;
    cushion.castShadow = showShadows;
    cushion.userData.isFurniture = true;
    scene.add(cushion);
  };

  const createCoffeeTable = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps, metalness: 0.2 });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.6 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Table top with wood grain effect
    const topGeometry = new THREE.BoxGeometry(item.width, 5, item.depth);
    const top = new THREE.Mesh(topGeometry, material);
    top.position.set(posX, item.height - 2.5, posZ);
    top.rotation.y = (item.rotation * Math.PI) / 180;
    top.castShadow = showShadows;
    top.receiveShadow = showShadows;
    top.userData.isFurniture = true;
    scene.add(top);

    // Glass top effect
    const glassGeometry = new THREE.BoxGeometry(item.width - 5, 2, item.depth - 5);
    const glassMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x88ccff, 
      transparent: true, 
      opacity: 0.2,
      roughness: 0.0,
      metalness: 0.1
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(posX, item.height - 0.5, posZ);
    glass.rotation.y = (item.rotation * Math.PI) / 180;
    glass.userData.isFurniture = true;
    scene.add(glass);

    // Legs with metallic finish
    const legGeometry = new THREE.CylinderGeometry(3, 3, item.height - 5, 8);
    const legPositions = [
      { x: -item.width * 0.4, z: -item.depth * 0.4 },
      { x: item.width * 0.4, z: -item.depth * 0.4 },
      { x: -item.width * 0.4, z: item.depth * 0.4 },
      { x: item.width * 0.4, z: item.depth * 0.4 },
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(posX + pos.x, (item.height - 5) / 2, posZ + pos.z);
      leg.castShadow = showShadows;
      leg.userData.isFurniture = true;
      scene.add(leg);
    });

    // Decorative items on table
    const bookGeometry = new THREE.BoxGeometry(15, 3, 20);
    const bookMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    book.position.set(posX - item.width * 0.2, item.height, posZ);
    book.rotation.y = (item.rotation * Math.PI) / 180;
    book.castShadow = showShadows;
    book.userData.isFurniture = true;
    scene.add(book);

    // Vase
    const vaseGeometry = new THREE.CylinderGeometry(3, 4, 15, 16);
    const vaseMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.1 });
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vase.position.set(posX + item.width * 0.25, item.height + 7.5, posZ + item.depth * 0.2);
    vase.castShadow = showShadows;
    vase.userData.isFurniture = true;
    scene.add(vase);
  };

  const createDiningTable = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Table top with realistic wood
    const topGeometry = new THREE.BoxGeometry(item.width, 6, item.depth);
    const top = new THREE.Mesh(topGeometry, material);
    top.position.set(posX, item.height - 3, posZ);
    top.rotation.y = (item.rotation * Math.PI) / 180;
    top.castShadow = showShadows;
    top.receiveShadow = showShadows;
    top.userData.isFurniture = true;
    scene.add(top);

    // Table edge/trim
    const edgeGeometry = new THREE.BoxGeometry(item.width + 4, 2, item.depth + 4);
    const edgeMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(matProps.color).multiplyScalar(0.8),
      roughness: 0.5
    });
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.position.set(posX, item.height - 1, posZ);
    edge.rotation.y = (item.rotation * Math.PI) / 180;
    edge.castShadow = showShadows;
    edge.userData.isFurniture = true;
    scene.add(edge);

    // Legs
    const legGeometry = new THREE.BoxGeometry(8, item.height - 6, 8);
    const legPositions = [
      { x: -item.width * 0.4, z: -item.depth * 0.4 },
      { x: item.width * 0.4, z: -item.depth * 0.4 },
      { x: -item.width * 0.4, z: item.depth * 0.4 },
      { x: item.width * 0.4, z: item.depth * 0.4 },
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(posX + pos.x, (item.height - 6) / 2, posZ + pos.z);
      leg.rotation.y = (item.rotation * Math.PI) / 180;
      leg.castShadow = showShadows;
      leg.userData.isFurniture = true;
      scene.add(leg);
    });
  };

  const createDiningChair = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Seat with cushion
    const seatGeometry = new THREE.BoxGeometry(item.width * 0.9, 4, item.depth * 0.9);
    const seat = new THREE.Mesh(seatGeometry, material);
    seat.position.set(posX, item.height * 0.5, posZ);
    seat.rotation.y = (item.rotation * Math.PI) / 180;
    seat.castShadow = showShadows;
    seat.userData.isFurniture = true;
    scene.add(seat);

    // Seat cushion
    const cushionGeometry = new THREE.BoxGeometry(item.width * 0.85, 3, item.depth * 0.8);
    const cushionMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(matProps.color).multiplyScalar(0.95),
      roughness: 0.85
    });
    const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushion.position.set(posX, item.height * 0.5 + 3, posZ);
    cushion.rotation.y = (item.rotation * Math.PI) / 180;
    cushion.castShadow = showShadows;
    cushion.userData.isFurniture = true;
    scene.add(cushion);

    // Back with slats
    const backGeometry = new THREE.BoxGeometry(item.width * 0.85, item.height * 0.5, 4);
    const back = new THREE.Mesh(backGeometry, material);
    back.position.set(posX, item.height * 0.75, posZ - item.depth * 0.425);
    back.rotation.y = (item.rotation * Math.PI) / 180;
    back.castShadow = showShadows;
    back.userData.isFurniture = true;
    scene.add(back);

    // Back cushion
    const backCushionGeometry = new THREE.BoxGeometry(item.width * 0.8, item.height * 0.35, 3);
    const backCushion = new THREE.Mesh(backCushionGeometry, cushionMaterial);
    backCushion.position.set(posX, item.height * 0.7, posZ - item.depth * 0.38);
    backCushion.rotation.y = (item.rotation * Math.PI) / 180;
    backCushion.castShadow = showShadows;
    backCushion.userData.isFurniture = true;
    scene.add(backCushion);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(2, 2, item.height * 0.5, 8);
    const legPositions = [
      { x: -item.width * 0.35, z: -item.depth * 0.35 },
      { x: item.width * 0.35, z: -item.depth * 0.35 },
      { x: -item.width * 0.35, z: item.depth * 0.35 },
      { x: item.width * 0.35, z: item.depth * 0.35 },
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(posX + pos.x, item.height * 0.25, posZ + pos.z);
      leg.castShadow = showShadows;
      leg.userData.isFurniture = true;
      scene.add(leg);
    });
  };

  const createBookshelf = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Main frame
    const frameGeometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
    const frame = new THREE.Mesh(frameGeometry, material);
    frame.position.set(posX, item.height / 2, posZ);
    frame.rotation.y = (item.rotation * Math.PI) / 180;
    frame.castShadow = showShadows;
    frame.receiveShadow = showShadows;
    frame.userData.isFurniture = true;
    scene.add(frame);

    // Shelves (darker interior)
    const shelfMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3d2817, 
      roughness: 0.6,
      metalness: 0.0
    });
    const shelfCount = 5;
    for (let i = 1; i < shelfCount; i++) {
      const shelfGeometry = new THREE.BoxGeometry(item.width - 4, 3, item.depth - 4);
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(posX, (item.height / shelfCount) * i, posZ);
      shelf.rotation.y = (item.rotation * Math.PI) / 180;
      shelf.userData.isFurniture = true;
      scene.add(shelf);
    }

    // Books (decorative)
    const bookColors = [0x8B4513, 0x2F4F4F, 0x800020, 0x000080, 0x006400, 0x4A4A4A, 0x8B0000];
    for (let shelf = 1; shelf < shelfCount; shelf++) {
      const bookCount = Math.floor(Math.random() * 4) + 2;
      let currentX = posX - item.width * 0.3;
      for (let b = 0; b < bookCount; b++) {
        const bookWidth = 5 + Math.random() * 8;
        const bookHeight = item.height / shelfCount * 0.7;
        const bookGeometry = new THREE.BoxGeometry(bookWidth, bookHeight, item.depth * 0.6);
        const bookMaterial = new THREE.MeshStandardMaterial({ 
          color: bookColors[Math.floor(Math.random() * bookColors.length)],
          roughness: 0.8
        });
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.position.set(currentX + bookWidth / 2, (item.height / shelfCount) * shelf - bookHeight / 2 - 1.5, posZ);
        book.rotation.y = (item.rotation * Math.PI) / 180;
        book.castShadow = showShadows;
        book.userData.isFurniture = true;
        scene.add(book);
        currentX += bookWidth + 2;
      }
    }

    // Decorative items
    // Plant
    const potGeometry = new THREE.CylinderGeometry(5, 4, 8, 16);
    const potMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.set(posX + item.width * 0.3, item.height - 4, posZ);
    pot.castShadow = showShadows;
    pot.userData.isFurniture = true;
    scene.add(pot);

    // Plant leaves
    const leafGeometry = new THREE.SphereGeometry(8, 8, 8);
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8 });
    const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
    leaves.position.set(posX + item.width * 0.3, item.height + 4, posZ);
    leaves.scale.set(1, 1.5, 1);
    leaves.castShadow = showShadows;
    leaves.userData.isFurniture = true;
    scene.add(leaves);
  };

  const createTVStand = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Main body with drawers
    const bodyGeometry = new THREE.BoxGeometry(item.width, item.height * 0.7, item.depth);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(posX, item.height * 0.35 + 5, posZ);
    body.rotation.y = (item.rotation * Math.PI) / 180;
    body.castShadow = showShadows;
    body.receiveShadow = showShadows;
    body.userData.isFurniture = true;
    scene.add(body);

    // Drawer fronts
    const drawerMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(matProps.color).multiplyScalar(0.9),
      roughness: 0.4,
      metalness: 0.1
    });
    [-1, 1].forEach(side => {
      const drawerGeometry = new THREE.BoxGeometry(item.width * 0.35, item.height * 0.25, 2);
      const drawer = new THREE.Mesh(drawerGeometry, drawerMaterial);
      drawer.position.set(posX + side * item.width * 0.2, item.height * 0.35 + 8, posZ + item.depth / 2 - 1);
      drawer.rotation.y = (item.rotation * Math.PI) / 180;
      drawer.userData.isFurniture = true;
      scene.add(drawer);

      // Drawer handle
      const handleGeometry = new THREE.BoxGeometry(10, 2, 2);
      const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, roughness: 0.2, metalness: 0.8 });
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      handle.position.set(posX + side * item.width * 0.2, item.height * 0.35 + 8, posZ + item.depth / 2 + 1);
      handle.rotation.y = (item.rotation * Math.PI) / 180;
      handle.userData.isFurniture = true;
      scene.add(handle);
    });

    // TV (modern flat screen)
    const tvGeometry = new THREE.BoxGeometry(item.width * 0.8, item.height * 0.5, 3);
    const tvMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 0.1,
      metalness: 0.8
    });
    const tv = new THREE.Mesh(tvGeometry, tvMaterial);
    tv.position.set(posX, item.height * 0.85 + 10, posZ - item.depth * 0.4);
    tv.rotation.y = (item.rotation * Math.PI) / 180;
    tv.castShadow = showShadows;
    tv.userData.isFurniture = true;
    scene.add(tv);

    // TV Screen (glow effect)
    const screenGeometry = new THREE.PlaneGeometry(item.width * 0.75, item.height * 0.45);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a2e, 
      emissive: isDarkMode ? 0x16213e : 0x0a0a15,
      emissiveIntensity: isDarkMode ? 0.3 : 0.1,
      roughness: 0.1
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(posX, item.height * 0.85 + 10, posZ - item.depth * 0.4 - 1.6);
    screen.rotation.y = (item.rotation * Math.PI) / 180;
    screen.userData.isFurniture = true;
    scene.add(screen);

    // TV stand base
    const baseGeometry = new THREE.BoxGeometry(item.width * 0.5, 3, item.depth * 0.3);
    const base = new THREE.Mesh(baseGeometry, material);
    base.position.set(posX, item.height * 0.7 + 1.5, posZ - item.depth * 0.35);
    base.rotation.y = (item.rotation * Math.PI) / 180;
    base.castShadow = showShadows;
    base.userData.isFurniture = true;
    scene.add(base);

    // Legs
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    const legGeometry = new THREE.BoxGeometry(4, 5, 4);
    [-1, 1].forEach(side => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(posX + side * item.width * 0.4, 2.5, posZ);
      leg.rotation.y = (item.rotation * Math.PI) / 180;
      leg.castShadow = showShadows;
      leg.userData.isFurniture = true;
      scene.add(leg);
    });
  };

  const createBed = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.5, metalness: 0.1 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Frame with headboard and footboard
    const frameGeometry = new THREE.BoxGeometry(item.width, 15, item.depth);
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(posX, 7.5, posZ);
    frame.rotation.y = (item.rotation * Math.PI) / 180;
    frame.castShadow = showShadows;
    frame.receiveShadow = showShadows;
    frame.userData.isFurniture = true;
    scene.add(frame);

    // Mattress with pillow-top effect
    const mattressGeometry = new THREE.BoxGeometry(item.width - 10, 20, item.depth - 10);
    const mattress = new THREE.Mesh(mattressGeometry, material);
    mattress.position.set(posX, 20, posZ);
    mattress.rotation.y = (item.rotation * Math.PI) / 180;
    mattress.castShadow = showShadows;
    mattress.userData.isFurniture = true;
    scene.add(mattress);

    // Pillows with realistic shape
    const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 });
    const pillowGeometry = new THREE.BoxGeometry(item.width * 0.35, 10, 20);
    [-1, 1].forEach(side => {
      const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
      pillow.position.set(posX + side * item.width * 0.25, 30, posZ - item.depth * 0.35);
      pillow.rotation.y = (item.rotation * Math.PI) / 180;
      pillow.castShadow = showShadows;
      pillow.userData.isFurniture = true;
      scene.add(pillow);
    });

    // Headboard with padding
    const headboardGeometry = new THREE.BoxGeometry(item.width, 60, 8);
    const headboard = new THREE.Mesh(headboardGeometry, frameMaterial);
    headboard.position.set(posX, 45, posZ - item.depth / 2 + 4);
    headboard.rotation.y = (item.rotation * Math.PI) / 180;
    headboard.castShadow = showShadows;
    headboard.userData.isFurniture = true;
    scene.add(headboard);

    // Headboard padding
    const headboardPaddingGeometry = new THREE.BoxGeometry(item.width - 10, 50, 3);
    const headboardPadding = new THREE.Mesh(headboardPaddingGeometry, pillowMaterial);
    headboardPadding.position.set(posX, 45, posZ - item.depth / 2 + 6);
    headboardPadding.rotation.y = (item.rotation * Math.PI) / 180;
    headboardPadding.castShadow = showShadows;
    headboardPadding.userData.isFurniture = true;
    scene.add(headboardPadding);

    // Blanket with fold effect
    const blanketGeometry = new THREE.BoxGeometry(item.width - 15, 5, item.depth * 0.6);
    const blanketMaterial = new THREE.MeshStandardMaterial({ color: 0x4A6FA5, roughness: 0.9 });
    const blanket = new THREE.Mesh(blanketGeometry, blanketMaterial);
    blanket.position.set(posX, 32.5, posZ + item.depth * 0.1);
    blanket.rotation.y = (item.rotation * Math.PI) / 180;
    blanket.castShadow = showShadows;
    blanket.userData.isFurniture = true;
    scene.add(blanket);

    // Additional blanket fold
    const foldGeometry = new THREE.BoxGeometry(item.width - 20, 8, item.depth * 0.15);
    const fold = new THREE.Mesh(foldGeometry, blanketMaterial);
    fold.position.set(posX, 30, posZ + item.depth * 0.25);
    fold.rotation.y = (item.rotation * Math.PI) / 180;
    fold.rotation.z = 0.1;
    fold.castShadow = showShadows;
    fold.userData.isFurniture = true;
    scene.add(fold);

    // Bedside items - nightstand
    const smallNightstandGeometry = new THREE.BoxGeometry(30, 40, 30);
    const smallNightstand = new THREE.Mesh(smallNightstandGeometry, frameMaterial);
    smallNightstand.position.set(posX - item.width / 2 - 20, 20, posZ - item.depth * 0.3);
    smallNightstand.rotation.y = (item.rotation * Math.PI) / 180;
    smallNightstand.castShadow = showShadows;
    smallNightstand.userData.isFurniture = true;
    scene.add(smallNightstand);
  };

  const createNightstand = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Main body with drawers
    const bodyGeometry = new THREE.BoxGeometry(item.width, item.height - 5, item.depth);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(posX, (item.height - 5) / 2 + 5, posZ);
    body.rotation.y = (item.rotation * Math.PI) / 180;
    body.castShadow = showShadows;
    body.receiveShadow = showShadows;
    body.userData.isFurniture = true;
    scene.add(body);

    // Drawer face
    const drawerMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(matProps.color).multiplyScalar(0.8),
      roughness: 0.4,
      metalness: 0.1
    });
    const drawerGeometry = new THREE.BoxGeometry(item.width - 4, item.height * 0.3, 2);
    const drawer = new THREE.Mesh(drawerGeometry, drawerMaterial);
    drawer.position.set(posX, item.height * 0.2 + 5, posZ + item.depth / 2 - 1);
    drawer.rotation.y = (item.rotation * Math.PI) / 180;
    drawer.userData.isFurniture = true;
    scene.add(drawer);

    // Handle
    const handleGeometry = new THREE.BoxGeometry(8, 2, 2);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, roughness: 0.2, metalness: 0.8 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(posX, item.height * 0.2 + 5, posZ + item.depth / 2 + 1);
    handle.rotation.y = (item.rotation * Math.PI) / 180;
    handle.userData.isFurniture = true;
    scene.add(handle);

    // Lamp on nightstand
    const lampBaseGeometry = new THREE.CylinderGeometry(5, 6, 3, 16);
    const lampBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    const lampBase = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
    lampBase.position.set(posX, item.height - 2, posZ);
    lampBase.castShadow = showShadows;
    lampBase.userData.isFurniture = true;
    scene.add(lampBase);

    const lampPoleGeometry = new THREE.CylinderGeometry(2, 2, 20, 8);
    const lampPole = new THREE.Mesh(lampPoleGeometry, lampBaseMaterial);
    lampPole.position.set(posX, item.height + 8, posZ);
    lampPole.castShadow = showShadows;
    lampPole.userData.isFurniture = true;
    scene.add(lampPole);

    const lampShadeGeometry = new THREE.CylinderGeometry(8, 12, 15, 16, 1, true);
    const lampShadeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xF5F5DC, 
      roughness: 0.9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const lampShade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial);
    lampShade.position.set(posX, item.height + 20, posZ);
    lampShade.userData.isFurniture = true;
    scene.add(lampShade);

    // Lamp glow
    const lampLight = new THREE.PointLight(0xFFFACD, 0.5, 100);
    lampLight.position.set(posX, item.height + 15, posZ);
    lampLight.userData.isFurniture = true;
    scene.add(lampLight);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(2, 2, 5, 8);
    const legPositions = [
      { x: -item.width * 0.4, z: -item.depth * 0.4 },
      { x: item.width * 0.4, z: -item.depth * 0.4 },
      { x: -item.width * 0.4, z: item.depth * 0.4 },
      { x: item.width * 0.4, z: item.depth * 0.4 },
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(posX + pos.x, 2.5, posZ + pos.z);
      leg.castShadow = showShadows;
      leg.userData.isFurniture = true;
      scene.add(leg);
    });
  };

  const createWardrobe = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Main body with panels
    const bodyGeometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(posX, item.height / 2, posZ);
    body.rotation.y = (item.rotation * Math.PI) / 180;
    body.castShadow = showShadows;
    body.receiveShadow = showShadows;
    body.userData.isFurniture = true;
    scene.add(body);

    // Door panels (left and right)
    const doorMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(matProps.color).multiplyScalar(0.95),
      roughness: 0.35,
      metalness: 0.05
    });
    
    // Left door
    const leftDoorGeometry = new THREE.BoxGeometry(item.width * 0.48, item.height - 10, 2);
    const leftDoor = new THREE.Mesh(leftDoorGeometry, doorMaterial);
    leftDoor.position.set(posX - item.width * 0.24, item.height / 2, posZ + item.depth / 2 + 1);
    leftDoor.rotation.y = (item.rotation * Math.PI) / 180;
    leftDoor.userData.isFurniture = true;
    scene.add(leftDoor);

    // Right door
    const rightDoor = new THREE.Mesh(leftDoorGeometry, doorMaterial);
    rightDoor.position.set(posX + item.width * 0.24, item.height / 2, posZ + item.depth / 2 + 1);
    rightDoor.rotation.y = (item.rotation * Math.PI) / 180;
    rightDoor.userData.isFurniture = true;
    scene.add(rightDoor);

    // Center line/gap
    const lineMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x000000, 
      roughness: 0.5,
      transparent: true,
      opacity: 0.3
    });
    const lineGeometry = new THREE.BoxGeometry(2, item.height - 10, 2);
    const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
    centerLine.position.set(posX, item.height / 2, posZ + item.depth / 2 + 1);
    centerLine.rotation.y = (item.rotation * Math.PI) / 180;
    centerLine.userData.isFurniture = true;
    scene.add(centerLine);

    // Handles
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, roughness: 0.2, metalness: 0.8 });
    const handleGeometry = new THREE.BoxGeometry(3, 20, 3);
    [-0.2, 0.2].forEach(offset => {
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      handle.position.set(posX + offset * item.width, item.height * 0.4, posZ + item.depth / 2 + 3);
      handle.rotation.y = (item.rotation * Math.PI) / 180;
      handle.userData.isFurniture = true;
      scene.add(handle);
    });

    // Decorative top molding
    const moldingGeometry = new THREE.BoxGeometry(item.width + 4, 5, item.depth + 4);
    const moldingMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(matProps.color).multiplyScalar(0.9),
      roughness: 0.4
    });
    const molding = new THREE.Mesh(moldingGeometry, moldingMaterial);
    molding.position.set(posX, item.height + 2.5, posZ);
    molding.rotation.y = (item.rotation * Math.PI) / 180;
    molding.castShadow = showShadows;
    molding.userData.isFurniture = true;
    scene.add(molding);
  };

  const createDesk = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.5 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Table top with keyboard tray
    const topGeometry = new THREE.BoxGeometry(item.width, 5, item.depth);
    const top = new THREE.Mesh(topGeometry, material);
    top.position.set(posX, item.height - 2.5, posZ);
    top.rotation.y = (item.rotation * Math.PI) / 180;
    top.castShadow = showShadows;
    top.receiveShadow = showShadows;
    top.userData.isFurniture = true;
    scene.add(top);

    // Keyboard tray
    const keyboardGeometry = new THREE.BoxGeometry(60, 2, 25);
    const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.4, metalness: 0.3 });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(posX, item.height - 8, posZ + item.depth * 0.25);
    keyboard.rotation.y = (item.rotation * Math.PI) / 180;
    keyboard.castShadow = showShadows;
    keyboard.userData.isFurniture = true;
    scene.add(keyboard);

    // Legs
    const legGeometry = new THREE.BoxGeometry(5, item.height - 5, 5);
    const legPositions = [
      { x: -item.width * 0.45, z: -item.depth * 0.45 },
      { x: item.width * 0.45, z: -item.depth * 0.45 },
      { x: -item.width * 0.45, z: item.depth * 0.45 },
      { x: item.width * 0.45, z: item.depth * 0.45 },
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(posX + pos.x, (item.height - 5) / 2, posZ + pos.z);
      leg.rotation.y = (item.rotation * Math.PI) / 180;
      leg.castShadow = showShadows;
      leg.userData.isFurniture = true;
      scene.add(leg);
    });

    // Monitor (modern flat panel)
    const monitorGeometry = new THREE.BoxGeometry(50, 30, 2);
    const monitorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.8 });
    const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
    monitor.position.set(posX, item.height + 15, posZ - item.depth * 0.3);
    monitor.rotation.y = (item.rotation * Math.PI) / 180;
    monitor.castShadow = showShadows;
    monitor.userData.isFurniture = true;
    scene.add(monitor);

    // Monitor screen
    const screenGeometry = new THREE.PlaneGeometry(46, 26);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a2e, 
      emissive: isDarkMode ? 0x16213e : 0x0a0a15,
      emissiveIntensity: isDarkMode ? 0.3 : 0.15,
      roughness: 0.1
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(posX, item.height + 15, posZ - item.depth * 0.3 - 1.1);
    screen.rotation.y = (item.rotation * Math.PI) / 180;
    screen.userData.isFurniture = true;
    scene.add(screen);

    // Monitor stand
    const standGeometry = new THREE.BoxGeometry(5, 12, 5);
    const stand = new THREE.Mesh(standGeometry, monitorMaterial);
    stand.position.set(posX, item.height + 6, posZ - item.depth * 0.3);
    stand.castShadow = showShadows;
    stand.userData.isFurniture = true;
    scene.add(stand);

    // Monitor base
    const baseGeometry = new THREE.BoxGeometry(20, 2, 15);
    const base = new THREE.Mesh(baseGeometry, monitorMaterial);
    base.position.set(posX, item.height - 2, posZ - item.depth * 0.3);
    base.castShadow = showShadows;
    base.userData.isFurniture = true;
    scene.add(base);

    // Desk items - keyboard
    const keyboardItemGeometry = new THREE.BoxGeometry(45, 2, 15);
    const keyboardItemMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 });
    const keyboardItem = new THREE.Mesh(keyboardItemGeometry, keyboardItemMaterial);
    keyboardItem.position.set(posX, item.height - 0.5, posZ + item.depth * 0.2);
    keyboardItem.rotation.y = (item.rotation * Math.PI) / 180;
    keyboardItem.userData.isFurniture = true;
    scene.add(keyboardItem);

    // Mouse
    const mouseGeometry = new THREE.BoxGeometry(6, 2, 10);
    const mouse = new THREE.Mesh(mouseGeometry, keyboardItemMaterial);
    mouse.position.set(posX + 35, item.height - 0.5, posZ + item.depth * 0.25);
    mouse.rotation.y = (item.rotation * Math.PI) / 180;
    mouse.userData.isFurniture = true;
    scene.add(mouse);

    // Coffee mug
    const mugGeometry = new THREE.CylinderGeometry(3, 3.5, 6, 16);
    const mugMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
    const mug = new THREE.Mesh(mugGeometry, mugMaterial);
    mug.position.set(posX - item.width * 0.3, item.height + 3, posZ - item.depth * 0.35);
    mug.castShadow = showShadows;
    mug.userData.isFurniture = true;
    scene.add(mug);
  };

  const createOfficeChair = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50, roughness: 0.3, metalness: 0.6 });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    // Seat with mesh effect
    const seatGeometry = new THREE.BoxGeometry(item.width * 0.85, 8, item.depth * 0.85);
    const seat = new THREE.Mesh(seatGeometry, material);
    seat.position.set(posX, item.height * 0.25, posZ);
    seat.rotation.y = (item.rotation * Math.PI) / 180;
    seat.castShadow = showShadows;
    seat.userData.isFurniture = true;
    scene.add(seat);

    // Back with mesh pattern
    const backGeometry = new THREE.BoxGeometry(item.width * 0.8, item.height * 0.5, 6);
    const back = new THREE.Mesh(backGeometry, material);
    back.position.set(posX, item.height * 0.6, posZ - item.depth * 0.35);
    back.rotation.y = (item.rotation * Math.PI) / 180;
    back.castShadow = showShadows;
    back.userData.isFurniture = true;
    scene.add(back);

    // Lumbar support
    const lumbarGeometry = new THREE.BoxGeometry(item.width * 0.6, 8, 4);
    const lumbarMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(matProps.color).multiplyScalar(0.85),
      roughness: 0.7
    });
    const lumbar = new THREE.Mesh(lumbarGeometry, lumbarMaterial);
    lumbar.position.set(posX, item.height * 0.4, posZ - item.depth * 0.35 - 4);
    lumbar.rotation.y = (item.rotation * Math.PI) / 180;
    lumbar.castShadow = showShadows;
    lumbar.userData.isFurniture = true;
    scene.add(lumbar);

    // Central pole
    const poleGeometry = new THREE.CylinderGeometry(3, 3, item.height * 0.25, 8);
    const pole = new THREE.Mesh(poleGeometry, metalMaterial);
    pole.position.set(posX, item.height * 0.12, posZ);
    pole.castShadow = showShadows;
    pole.userData.isFurniture = true;
    scene.add(pole);

    // Base with wheels
    const baseGeometry = new THREE.CylinderGeometry(item.width * 0.3, item.width * 0.3, 3, 5);
    const base = new THREE.Mesh(baseGeometry, metalMaterial);
    base.position.set(posX, 1.5, posZ);
    base.castShadow = showShadows;
    base.userData.isFurniture = true;
    scene.add(base);

    // Wheels
    const wheelGeometry = new THREE.SphereGeometry(3, 8, 8);
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const wheel = new THREE.Mesh(wheelGeometry, metalMaterial);
      wheel.position.set(
        posX + Math.cos(angle) * item.width * 0.28,
        3,
        posZ + Math.sin(angle) * item.width * 0.28
      );
      wheel.castShadow = showShadows;
      wheel.userData.isFurniture = true;
      scene.add(wheel);
    }

    // Armrests with adjustable look
    const armGeometry = new THREE.BoxGeometry(4, 3, item.depth * 0.4);
    [-1, 1].forEach(side => {
      const arm = new THREE.Mesh(armGeometry, metalMaterial);
      arm.position.set(posX + side * item.width * 0.42, item.height * 0.35, posZ - item.depth * 0.1);
      arm.rotation.y = (item.rotation * Math.PI) / 180;
      arm.castShadow = showShadows;
      arm.userData.isFurniture = true;
      scene.add(arm);

      // Armrest pad
      const padGeometry = new THREE.BoxGeometry(8, 2, item.depth * 0.25);
      const pad = new THREE.Mesh(padGeometry, material);
      pad.position.set(posX + side * item.width * 0.42, item.height * 0.35 + 2, posZ - item.depth * 0.1);
      pad.rotation.y = (item.rotation * Math.PI) / 180;
      pad.castShadow = showShadows;
      pad.userData.isFurniture = true;
      scene.add(pad);
    });
  };

  const createDefaultFurniture = (scene: THREE.Scene, item: PlacedFurniture, matProps: { color: string; roughness: number; metalness: number }) => {
    const material = new THREE.MeshStandardMaterial({ ...matProps });
    
    const posX = item.x + item.width / 2 - room.width / 2;
    const posZ = item.y + item.depth / 2 - room.length / 2;

    const geometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(posX, item.height / 2, posZ);
    mesh.rotation.y = (item.rotation * Math.PI) / 180;
    mesh.castShadow = showShadows;
    mesh.receiveShadow = showShadows;
    mesh.userData.isFurniture = true;
    mesh.userData.name = item.name;
    scene.add(mesh);

    // Add edges for definition
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true })
    );
    line.position.copy(mesh.position);
    line.rotation.copy(mesh.rotation);
    line.userData.isFurniture = true;
    scene.add(line);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`h-screen flex flex-col relative overflow-hidden ${isDarkMode ? 'bg-[#1A1E24]' : 'bg-[#F5F5F5]'}`}>
      {/* Animated Header */}
      <motion.header 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-14 flex items-center justify-between px-6 z-10 border-b ${
          isDarkMode 
            ? 'bg-[#2D333A]/95 backdrop-blur-md border-[#3F454D]' 
            : 'bg-white/95 backdrop-blur-md border-[#E5E7EB]'
        }`}
      >
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' 
                : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
          <div className={`h-6 w-px ${isDarkMode ? 'bg-[#3F454D]' : 'bg-[#E5E7EB]'}`} />
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-lg font-semibold flex items-center gap-2 ${
              isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'
            }`}
          >
            <Eye className="w-5 h-5 text-[#86A789]" />
            3D Room View
          </motion.h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark/Light Mode Toggle */}
          <motion.button
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' 
                : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          {/* Auto Rotate Toggle */}
          <motion.button
            onClick={() => setAutoRotate(!autoRotate)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${autoRotate ? 'bg-[#86A789] text-[#1A1E24]' : isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
            title="Auto Rotate"
          >
            <RefreshCw className={`w-5 h-5 ${autoRotate ? 'animate-spin' : ''}`} />
          </motion.button>

          {/* Light Controls */}
          <div className={`flex items-center gap-1 rounded-lg px-2 py-1 ${isDarkMode ? 'bg-[#3F454D]/50' : 'bg-[#F3F4F6]'}`}>
            <motion.button
              onClick={() => setLightIntensity(Math.max(0.3, lightIntensity - 0.2))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 transition-colors ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
              title="Decrease light"
            >
              <Moon className="w-4 h-4" />
            </motion.button>
            <span className={`text-xs w-10 text-center font-mono ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              {Math.round(lightIntensity * 100)}%
            </span>
            <motion.button
              onClick={() => setLightIntensity(Math.min(2, lightIntensity + 0.2))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 transition-colors ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
              title="Increase light"
            >
              <Sun className="w-4 h-4" />
            </motion.button>
          </div>

          <div className={`h-6 w-px mx-2 ${isDarkMode ? 'bg-[#3F454D]' : 'bg-[#E5E7EB]'}`} />

          {/* Annotations Toggle */}
          <motion.button
            onClick={() => setShowAnnotations(!showAnnotations)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${showAnnotations ? 'bg-[#86A789] text-[#1A1E24]' : isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
            title="Toggle Annotations"
          >
            <Type className="w-5 h-5" />
          </motion.button>

          {/* Dimension Lines Toggle */}
          <motion.button
            onClick={() => setShowDimensionLines(!showDimensionLines)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${showDimensionLines ? 'bg-[#86A789] text-[#1A1E24]' : isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
            title="Toggle Dimension Lines"
          >
            <Ruler className="w-5 h-5" />
          </motion.button>

          {/* Shadows Toggle */}
          <motion.button
            onClick={() => setShowShadows(!showShadows)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${showShadows ? 'bg-[#86A789] text-[#1A1E24]' : isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
            title="Toggle Shadows"
          >
            <Box className="w-5 h-5" />
          </motion.button>

          <div className={`h-6 w-px mx-2 ${isDarkMode ? 'bg-[#3F454D]' : 'bg-[#E5E7EB]'}`} />

          {/* Wall Material */}
          <motion.button
            onClick={() => setWallMaterial(m => m === 'matte' ? 'glossy' : m === 'glossy' ? 'textured' : 'matte')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
            title="Wall Material"
          >
            <Layers className="w-5 h-5" />
          </motion.button>

          {/* Floor Material */}
          <motion.button
            onClick={() => setFloorMaterialType(m => m === 'matte' ? 'polished' : m === 'polished' ? 'textured' : 'matte')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
            title="Floor Material"
          >
            <Grid3X3 className="w-5 h-5" />
          </motion.button>

          {/* Camera Preset */}
          <motion.button
            onClick={() => setCameraPreset(p => (p + 1) % cameraPresets.length)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
            title={`Camera: ${cameraPresets[cameraPreset].name}`}
          >
            <Camera className="w-5 h-5" />
          </motion.button>

          {/* Settings Panel Toggle */}
          <motion.button
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${showSettingsPanel ? 'bg-[#86A789] text-[#1A1E24]' : isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          <div className={`h-6 w-px mx-2 ${isDarkMode ? 'bg-[#3F454D]' : 'bg-[#E5E7EB]'}`} />

          {/* Fullscreen */}
          <motion.button
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
          >
            <Maximize2 className="w-5 h-5" />
          </motion.button>

          {/* Toggle Controls */}
          <motion.button
            onClick={() => setShowControls(!showControls)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${showControls ? 'bg-[#86A789] text-[#1A1E24]' : isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#3F454D]/50' : 'text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6]'}`}
          >
            {showControls ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.header>

      {/* 3D Canvas */}
      <div ref={containerRef} className="flex-1" />

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettingsPanel && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`absolute top-20 right-6 z-20 rounded-xl p-4 shadow-2xl border ${
              isDarkMode 
                ? 'bg-[#2D333A]/95 border-[#3F454D]' 
                : 'bg-white/95 border-[#E5E7EB]'
            } min-w-[280px]`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'}`}>
                Settings
              </h3>
              <button 
                onClick={() => setShowSettingsPanel(false)}
                className={`p-1 rounded ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quality Setting */}
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                Quality
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      quality === q 
                        ? 'bg-[#86A789] text-[#1A1E24]' 
                        : isDarkMode 
                          ? 'bg-[#3F454D] text-[#9CA3AF] hover:text-[#E5E7EB]' 
                          : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    {q.charAt(0).toUpperCase() + q.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Presets */}
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                Camera View
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cameraPresets.map((preset, idx) => (
                  <button
                    key={preset.name}
                    onClick={() => setCameraPreset(idx)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      cameraPreset === idx 
                        ? 'bg-[#86A789] text-[#1A1E24]' 
                        : isDarkMode 
                          ? 'bg-[#3F454D] text-[#9CA3AF] hover:text-[#E5E7EB]' 
                          : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Material */}
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                Wall Material
              </label>
              <div className="flex gap-2">
                {(['matte', 'glossy', 'textured'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setWallMaterial(m)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      wallMaterial === m 
                        ? 'bg-[#86A789] text-[#1A1E24]' 
                        : isDarkMode 
                          ? 'bg-[#3F454D] text-[#9CA3AF] hover:text-[#E5E7EB]' 
                          : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Material */}
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                Floor Material
              </label>
              <div className="flex gap-2">
                {(['matte', 'polished', 'textured'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFloorMaterialType(m)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      floorMaterialType === m 
                        ? 'bg-[#86A789] text-[#1A1E24]' 
                        : isDarkMode 
                          ? 'bg-[#3F454D] text-[#9CA3AF] hover:text-[#E5E7EB]' 
                          : 'bg-[#F3F4F6] text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Annotations
                </span>
                <button
                  onClick={() => setShowAnnotations(!showAnnotations)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    showAnnotations ? 'bg-[#86A789]' : isDarkMode ? 'bg-[#3F454D]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                    showAnnotations ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Dimension Lines
                </span>
                <button
                  onClick={() => setShowDimensionLines(!showDimensionLines)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    showDimensionLines ? 'bg-[#86A789]' : isDarkMode ? 'bg-[#3F454D]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                    showDimensionLines ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Shadows
                </span>
                <button
                  onClick={() => setShowShadows(!showShadows)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    showShadows ? 'bg-[#86A789]' : isDarkMode ? 'bg-[#3F454D]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                    showShadows ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Help - Animated */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: -20 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className={`absolute bottom-6 left-6 backdrop-blur-md rounded-xl p-4 text-sm shadow-2xl border ${
              isDarkMode 
                ? 'bg-[#2D333A]/95 border-[#3F454D]' 
                : 'bg-white/95 border-[#E5E7EB]'
            }`}
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`font-semibold mb-3 flex items-center gap-2 ${
                isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'
              }`}
            >
              <Move3D className="w-4 h-4 text-[#86A789]" />
              Controls
            </motion.p>
            <div className="space-y-2">
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={`flex items-center gap-2 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
              >
                <span className={`px-2 py-0.5 rounded text-xs ${isDarkMode ? 'bg-[#3F454D]' : 'bg-[#F3F4F6]'}`}>🖱️</span>
                Left-click + drag: Rotate
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className={`flex items-center gap-2 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
              >
                <span className={`px-2 py-0.5 rounded text-xs ${isDarkMode ? 'bg-[#3F454D]' : 'bg-[#F3F4F6]'}`}>🖱️</span>
                Right-click + drag: Pan
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className={`flex items-center gap-2 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
              >
                <span className={`px-2 py-0.5 rounded text-xs ${isDarkMode ? 'bg-[#3F454D]' : 'bg-[#F3F4F6]'}`}>🖱️</span>
                Scroll: Zoom
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Info Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 20 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className={`absolute bottom-6 right-6 backdrop-blur-md rounded-xl p-4 shadow-2xl border min-w-[220px] ${
              isDarkMode 
                ? 'bg-[#2D333A]/95 border-[#3F454D]' 
                : 'bg-white/95 border-[#E5E7EB]'
            }`}
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className={`font-semibold mb-3 flex items-center gap-2 ${
                isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#86A789]" />
              Room Info
            </motion.p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Room Size</span>
                <span className={`${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'} font-mono`}>{room.width} x {room.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Wall Height</span>
                <span className={`${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'} font-mono`}>280</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Furniture</span>
                <span className={`${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'} font-mono`}>{furniture.length} items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Wall</span>
                <span className={`${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'} font-mono capitalize`}>{wallMaterial}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Floor</span>
                <span className={`${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'} font-mono capitalize`}>{floorMaterialType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Quality</span>
                <span className={`${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'} font-mono capitalize`}>{quality}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Camera</span>
                <span className={`${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'} font-mono`}>{cameraPresets[cameraPreset].name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Theme</span>
                <span className={`${isDarkMode ? 'text-[#E5E7EB]' : 'text-[#1F2937]'} font-mono capitalize`}>{isDarkMode ? 'Dark' : 'Light'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
          isDarkMode ? 'bg-[#1A1E24]' : 'bg-[#F5F5F5]'
        }`}
      >
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-[#86A789] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className={isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Loading 3D Room...</p>
        </div>
      </motion.div>
    </div>
  );
}
