//updated by ranumipesakya
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Product } from '../data/products';
import { getModelGenerator } from '../utils/furnitureModels';
import { cleanupThreeScene } from '../utils/threeCleanup';
import { ViewerControls } from './ViewerControls';
interface ProductViewer3DProps {
  product: Product;
  selectedColor: string;
}
export function ProductViewer3D({
  product,
  selectedColor
}: ProductViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e8e2db');
    scene.fog = new THREE.Fog('#e8e2db', 5, 15);
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(3, 2, 3);
    cameraRef.current = camera;
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    containerRef.current.appendChild(renderer.domElement);
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controls.target.set(0, 0.5, 0);
    controlsRef.current = controls;
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const hemiLight = new THREE.HemisphereLight(0xffeedd, 0x080820, 0.5);
    scene.add(hemiLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffeebb, 0.8);
    fillLight.position.set(-3, 4, -2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xddddff, 0.5);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);
    // Floor
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0eb,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    // Add Product Model
    const generateModel = getModelGenerator(product.modelType);
    const model = generateModel(selectedColor);
    // Center model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x = -center.x;
    model.position.z = -center.z;
    scene.add(model);
    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 1.0;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
      containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      cleanupThreeScene(scene, renderer);
      if (
      containerRef.current &&
      renderer.domElement.parentNode === containerRef.current)
      {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [product.id, product.modelType, selectedColor, autoRotate]); // Re-run if product or color changes
  const handlePresetClick = (
  preset: 'front' | 'side' | 'top' | 'perspective') =>
  {
    if (!cameraRef.current || !controlsRef.current) return;
    setAutoRotate(false);
    const cam = cameraRef.current;
    // Simple instant transition for presets
    switch (preset) {
      case 'front':
        cam.position.set(0, 1, 4);
        break;
      case 'side':
        cam.position.set(4, 1, 0);
        break;
      case 'top':
        cam.position.set(0, 5, 0.1); // slight offset to prevent gimbal lock
        break;
      case 'perspective':
        cam.position.set(3, 2, 3);
        break;
    }
    controlsRef.current.target.set(0, 0.5, 0);
    controlsRef.current.update();
  };
  return (
    <div className="relative w-full h-full bg-[#e8e2db]">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      <ViewerControls
        onPresetClick={handlePresetClick}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)} />
      
    </div>);

}