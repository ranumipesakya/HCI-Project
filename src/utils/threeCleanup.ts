//updates by Ishira
import * as THREE from 'three';

export function cleanupThreeScene(
scene: THREE.Scene,
renderer?: THREE.WebGLRenderer)
{
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  });

  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }
}