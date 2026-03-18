//updates by Ishira
import * as THREE from 'three';

export const createOakWood = () =>
new THREE.MeshPhysicalMaterial({
  color: 0xc4a882,
  roughness: 0.65,
  metalness: 0,
  clearcoat: 0.1
});
export const createWalnutWood = () =>
new THREE.MeshPhysicalMaterial({
  color: 0x5c3d2e,
  roughness: 0.6,
  metalness: 0,
  clearcoat: 0.15
});
export const createGreyFabric = () =>
new THREE.MeshPhysicalMaterial({
  color: 0x8a8a8a,
  roughness: 0.95,
  metalness: 0
});
export const createBeigeFabric = () =>
new THREE.MeshPhysicalMaterial({
  color: 0xc8b99a,
  roughness: 0.92,
  metalness: 0
});
export const createLeather = () =>
new THREE.MeshPhysicalMaterial({
  color: 0x3d2b1f,
  roughness: 0.5,
  metalness: 0,
  clearcoat: 0.2
});
export const createBlackMetal = () =>
new THREE.MeshPhysicalMaterial({
  color: 0x1a1a1a,
  roughness: 0.3,
  metalness: 0.9
});
export const createBrassMetal = () =>
new THREE.MeshPhysicalMaterial({
  color: 0xb5a642,
  roughness: 0.35,
  metalness: 0.85
});
export const createMarble = () =>
new THREE.MeshPhysicalMaterial({
  color: 0xf0ece8,
  roughness: 0.2,
  metalness: 0,
  clearcoat: 0.3
});
export const createWhiteFabric = () =>
new THREE.MeshPhysicalMaterial({
  color: 0xf5f0eb,
  roughness: 0.9,
  metalness: 0
});