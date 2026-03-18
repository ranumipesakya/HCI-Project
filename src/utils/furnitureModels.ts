import * as THREE from 'three';
import {
  createOakWood,
  createGreyFabric,
  createBlackMetal,
  createBeigeFabric,
  createWhiteFabric,
  createWalnutWood,
  createLeather,
  createBrassMetal,
  createMarble
} from './materials';

// Helper to enable shadows
const enableShadows = (group: THREE.Group) => {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

// Enhanced Sofa with more details
export const createSofa = (colorHex?: string) => {
  const group = new THREE.Group();
  const fabric = createGreyFabric();
  if (colorHex) fabric.color.set(colorHex);
  const wood = createOakWood();
  const metal = createBrassMetal();

  // Main frame/base
  const baseGeo = new THREE.BoxGeometry(2.4, 0.12, 0.95);
  const base = new THREE.Mesh(baseGeo, wood);
  base.position.y = 0.15;
  group.add(base);

  // Seat cushions - 3 large cushions
  const seatGeo1 = new THREE.BoxGeometry(0.75, 0.18, 0.7);
  const seat1 = new THREE.Mesh(seatGeo1, fabric);
  seat1.position.set(-0.72, 0.35, 0.05);
  group.add(seat1);

  const seat2 = new THREE.Mesh(seatGeo1, fabric);
  seat2.position.set(0, 0.35, 0.05);
  group.add(seat2);

  const seat3 = new THREE.Mesh(seatGeo1, fabric);
  seat3.position.set(0.72, 0.35, 0.05);
  group.add(seat3);

  // Back cushions - 3 pieces
  const backGeo1 = new THREE.BoxGeometry(0.72, 0.55, 0.18);
  const back1 = new THREE.Mesh(backGeo1, fabric);
  back1.position.set(-0.72, 0.72, -0.32);
  group.add(back1);

  const back2 = new THREE.Mesh(backGeo1, fabric);
  back2.position.set(0, 0.72, -0.32);
  group.add(back2);

  const back3 = new THREE.Mesh(backGeo1, fabric);
  back3.position.set(0.72, 0.72, -0.32);
  group.add(back3);

  // Arms with rounded edges
  const armGeo = new THREE.BoxGeometry(0.18, 0.45, 0.85);
  const arm1 = new THREE.Mesh(armGeo, fabric);
  arm1.position.set(-1.15, 0.42, 0);
  group.add(arm1);

  const arm2 = new THREE.Mesh(armGeo, fabric);
  arm2.position.set(1.15, 0.42, 0);
  group.add(arm2);

  // Throw pillows for decoration
  const pillowGeo = new THREE.BoxGeometry(0.25, 0.25, 0.1);
  const pillow1 = new THREE.Mesh(pillowGeo, fabric);
  pillow1.position.set(-0.95, 0.65, -0.2);
  pillow1.rotation.z = 0.15;
  group.add(pillow1);

  const pillow2 = new THREE.Mesh(pillowGeo, fabric);
  pillow2.position.set(0.95, 0.65, -0.2);
  pillow2.rotation.z = -0.15;
  group.add(pillow2);

  // Legs - tapered wooden legs
  const legGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.15, 8);
  const positions = [
    [-1.05, 0.075, 0.38],
    [1.05, 0.075, 0.38],
    [-1.05, 0.075, -0.38],
    [1.05, 0.075, -0.38]
  ];

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, wood);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Metal leg accents
  const metalLegGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8);
  const metalPositions = [
    [-0.5, 0.22, 0.4],
    [0.5, 0.22, 0.4],
    [-0.5, 0.22, -0.4],
    [0.5, 0.22, -0.4]
  ];

  metalPositions.forEach((pos) => {
    const leg = new THREE.Mesh(metalLegGeo, metal);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  enableShadows(group);
  return group;
};

// Enhanced Dining Chair
export const createDiningChair = (colorHex?: string) => {
  const group = new THREE.Group();
  const fabric = createBeigeFabric();
  if (colorHex) fabric.color.set(colorHex);
  const wood = createOakWood();

  // Seat with slight curve
  const seatShape = new THREE.Shape();
  seatShape.moveTo(-0.22, -0.22);
  seatShape.lineTo(0.22, -0.22);
  seatShape.lineTo(0.22, 0.22);
  seatShape.lineTo(-0.22, 0.22);
  seatShape.closePath();

  const seatGeo = new THREE.ExtrudeGeometry(seatShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 });
  const seat = new THREE.Mesh(seatGeo, fabric);
  seat.position.y = 0.45;
  seat.rotation.x = -Math.PI / 2;
  group.add(seat);

  // Curved backrest
  const backGeo = new THREE.BoxGeometry(0.44, 0.42, 0.035);
  const back = new THREE.Mesh(backGeo, wood);
  back.position.set(0, 0.72, -0.22);
  back.rotation.x = -0.08;
  group.add(back);

  // Backrest support curve
  const supportGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8);
  const support1 = new THREE.Mesh(supportGeo, wood);
  support1.position.set(-0.18, 0.5, -0.2);
  support1.rotation.x = Math.PI / 2;
  group.add(support1);

  const support2 = new THREE.Mesh(supportGeo, wood);
  support2.position.set(0.18, 0.5, -0.2);
  support2.rotation.x = Math.PI / 2;
  group.add(support2);

  // Elegant legs - slightly angled
  const legGeo = new THREE.CylinderGeometry(0.018, 0.022, 0.45, 8);
  const positions = [
    [-0.18, 0.225, 0.18],
    [0.18, 0.225, 0.18],
    [-0.18, 0.225, -0.18],
    [0.18, 0.225, -0.18]
  ];

  positions.forEach((pos, i) => {
    const leg = new THREE.Mesh(legGeo, wood);
    leg.position.set(pos[0], pos[1], pos[2]);
    // Slight outward angle for stability
    if (i === 0) leg.rotation.z = 0.05;
    if (i === 1) leg.rotation.z = -0.05;
    if (i === 2) leg.rotation.z = 0.05;
    if (i === 3) leg.rotation.z = -0.05;
    group.add(leg);
  });

  // Cross supports
  const crossGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.34, 6);
  const cross1 = new THREE.Mesh(crossGeo, wood);
  cross1.position.set(0, 0.12, 0.18);
  cross1.rotation.z = Math.PI / 2;
  group.add(cross1);

  const cross2 = new THREE.Mesh(crossGeo, wood);
  cross2.position.set(0, 0.12, -0.18);
  cross2.rotation.z = Math.PI / 2;
  group.add(cross2);

  enableShadows(group);
  return group;
};

// Modern Coffee Table
export const createCoffeeTable = (colorHex?: string) => {
  const group = new THREE.Group();
  const wood = createOakWood();
  if (colorHex) wood.color.set(colorHex);
  const metal = createBlackMetal();
  const marble = createMarble();

  // Tabletop with rounded edges
  const topGeo = new THREE.BoxGeometry(1.3, 0.045, 0.7);
  const top = new THREE.Mesh(topGeo, marble);
  top.position.y = 0.42;
  group.add(top);

  // Wood accent strip
  const stripGeo = new THREE.BoxGeometry(1.28, 0.015, 0.05);
  const strip = new THREE.Mesh(stripGeo, wood);
  strip.position.set(0, 0.45, 0.3);
  group.add(strip);

  // Lower shelf
  const shelfGeo = new THREE.BoxGeometry(1.1, 0.03, 0.5);
  const shelf = new THREE.Mesh(shelfGeo, wood);
  shelf.position.y = 0.18;
  group.add(shelf);

  // Hairpin metal legs
  const legGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.4, 8);
  const positions = [
    [-0.6, 0.2, 0.28],
    [0.6, 0.2, 0.28],
    [-0.6, 0.2, -0.28],
    [0.6, 0.2, -0.28]
  ];

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, metal);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Cross bars
  const barGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.1, 6);
  const bar1 = new THREE.Mesh(barGeo, metal);
  bar1.position.set(0, 0.08, 0.28);
  bar1.rotation.z = Math.PI / 2;
  group.add(bar1);

  const bar2 = new THREE.Mesh(barGeo, metal);
  bar2.position.set(0, 0.08, -0.28);
  bar2.rotation.z = Math.PI / 2;
  group.add(bar2);

  enableShadows(group);
  return group;
};

// Modern Dining Table
export const createDiningTable = (colorHex?: string) => {
  const group = new THREE.Group();
  const wood = createOakWood();
  if (colorHex) wood.color.set(colorHex);
  const metal = createBlackMetal();

  // Main tabletop
  const topGeo = new THREE.BoxGeometry(2.0, 0.05, 1.0);
  const top = new THREE.Mesh(topGeo, wood);
  top.position.y = 0.76;
  group.add(top);

  // Tapered edge detail
  const edgeGeo = new THREE.BoxGeometry(2.02, 0.015, 1.02);
  const edge = new THREE.Mesh(edgeGeo, wood);
  edge.position.y = 0.728;
  group.add(edge);

  // Solid wood legs
  const legGeo = new THREE.BoxGeometry(0.08, 0.73, 0.08);
  const positions = [
    [-0.9, 0.365, 0.4],
    [0.9, 0.365, 0.4],
    [-0.9, 0.365, -0.4],
    [0.9, 0.365, -0.4]
  ];

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, wood);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Cross support beam
  const beamGeo = new THREE.BoxGeometry(1.6, 0.05, 0.05);
  const beam = new THREE.Mesh(beamGeo, metal);
  beam.position.set(0, 0.15, 0);
  group.add(beam);

  // Footrest bar
  const footGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.7, 8);
  const foot = new THREE.Mesh(footGeo, metal);
  foot.position.set(0, 0.08, 0);
  foot.rotation.z = Math.PI / 2;
  group.add(foot);

  enableShadows(group);
  return group;
};

// Luxurious Armchair
export const createArmchair = (colorHex?: string) => {
  const group = new THREE.Group();
  const fabric = createGreyFabric();
  if (colorHex) fabric.color.set(colorHex);
  const wood = createWalnutWood();

  // Deep seat
  const seatGeo = new THREE.BoxGeometry(0.65, 0.22, 0.62);
  const seat = new THREE.Mesh(seatGeo, fabric);
  seat.position.set(0, 0.32, 0.05);
  group.add(seat);

  // Plush back with slight curve
  const backGeo = new THREE.BoxGeometry(0.62, 0.55, 0.14);
  const back = new THREE.Mesh(backGeo, fabric);
  back.position.set(0, 0.68, -0.25);
  group.add(back);

  // Rolled arms
  const armGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.55, 16);
  const arm1 = new THREE.Mesh(armGeo, fabric);
  arm1.position.set(-0.36, 0.48, 0);
  arm1.rotation.x = Math.PI / 2;
  group.add(arm1);

  const arm2 = new THREE.Mesh(armGeo, fabric);
  arm2.position.set(0.36, 0.48, 0);
  arm2.rotation.x = Math.PI / 2;
  group.add(arm2);

  // Decorative buttons on back
  const buttonGeo = new THREE.SphereGeometry(0.02, 8, 8);
  const buttonMat = createLeather();
  const buttonPositions = [
    [-0.15, 0.75, -0.17],
    [0.15, 0.75, -0.17],
    [-0.15, 0.62, -0.17],
    [0.15, 0.62, -0.17]
  ];
  buttonPositions.forEach(pos => {
    const button = new THREE.Mesh(buttonGeo, buttonMat);
    button.position.set(pos[0], pos[1], pos[2]);
    group.add(button);
  });

  // Comfort cushion
  const cushionGeo = new THREE.BoxGeometry(0.5, 0.08, 0.45);
  const cushion = new THREE.Mesh(cushionGeo, fabric);
  cushion.position.set(0, 0.45, 0.08);
  group.add(cushion);

  // Tapered wooden legs
  const legGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.22, 8);
  const positions = [
    [-0.32, 0.11, 0.28],
    [0.32, 0.11, 0.28],
    [-0.32, 0.11, -0.28],
    [0.32, 0.11, -0.28]
  ];

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, wood);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Brass casters
  const casterGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const brass = createBrassMetal();
  positions.forEach(pos => {
    const caster = new THREE.Mesh(casterGeo, brass);
    caster.position.set(pos[0], 0.01, pos[2]);
    group.add(caster);
  });

  enableShadows(group);
  return group;
};

// Modern Platform Bed
export const createBed = (colorHex?: string) => {
  const group = new THREE.Group();
  const fabric = createGreyFabric();
  if (colorHex) fabric.color.set(colorHex);
  const mattressMat = createWhiteFabric();
  const wood = createWalnutWood();
  const metal = createBrassMetal();

  // Platform base
  const baseGeo = new THREE.BoxGeometry(1.7, 0.15, 2.1);
  const base = new THREE.Mesh(baseGeo, wood);
  base.position.y = 0.15;
  group.add(base);

  // Mattress
  const mattressGeo = new THREE.BoxGeometry(1.6, 0.22, 2.0);
  const mattress = new THREE.Mesh(mattressGeo, mattressMat);
  mattress.position.y = 0.335;
  group.add(mattress);

  // Top mattress / comfort layer
  const topMattressGeo = new THREE.BoxGeometry(1.55, 0.06, 1.95);
  const topMattress = new THREE.Mesh(topMattressGeo, fabric);
  topMattress.position.y = 0.475;
  group.add(topMattress);

  // Upholstered headboard
  const headboardGeo = new THREE.BoxGeometry(1.75, 0.9, 0.12);
  const headboard = new THREE.Mesh(headboardGeo, fabric);
  headboard.position.set(0, 0.7, -1.02);
  group.add(headboard);

  // Headboard frame
  const frameGeo = new THREE.BoxGeometry(1.8, 0.95, 0.04);
  const frame = new THREE.Mesh(frameGeo, wood);
  frame.position.set(0, 0.7, -1.08);
  group.add(frame);

  // Decorative brass accents on headboard
  const accentGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
  const accent1 = new THREE.Mesh(accentGeo, metal);
  accent1.position.set(-0.6, 0.7, -0.96);
  accent1.rotation.x = Math.PI / 2;
  group.add(accent1);

  const accent2 = new THREE.Mesh(accentGeo, metal);
  accent2.position.set(0.6, 0.7, -0.96);
  accent2.rotation.x = Math.PI / 2;
  group.add(accent2);

  // Pillows
  const pillowGeo = new THREE.BoxGeometry(0.55, 0.12, 0.35);
  const pillow1 = new THREE.Mesh(pillowGeo, fabric);
  pillow1.position.set(-0.35, 0.56, -0.75);
  pillow1.rotation.x = 0.1;
  group.add(pillow1);

  const pillow2 = new THREE.Mesh(pillowGeo, fabric);
  pillow2.position.set(0.35, 0.56, -0.75);
  pillow2.rotation.x = 0.1;
  group.add(pillow2);

  // Hidden bed frame legs
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8);
  const positions = [
    [-0.75, 0.04, 0.95],
    [0.75, 0.04, 0.95],
    [-0.75, 0.04, -0.95],
    [0.75, 0.04, -0.95]
  ];

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, metal);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  enableShadows(group);
  return group;
};

// Modern Bookshelf
export const createBookshelf = (colorHex?: string) => {
  const group = new THREE.Group();
  const wood = createOakWood();
  if (colorHex) wood.color.set(colorHex);
  const metal = createBrassMetal();

  // Main frame sides
  const sideGeo = new THREE.BoxGeometry(0.04, 1.85, 0.36);
  const side1 = new THREE.Mesh(sideGeo, wood);
  side1.position.set(-0.42, 0.925, 0);
  group.add(side1);

  const side2 = new THREE.Mesh(sideGeo, wood);
  side2.position.set(0.42, 0.925, 0);
  group.add(side2);

  // Back panel
  const backGeo = new THREE.BoxGeometry(0.8, 1.85, 0.02);
  const back = new THREE.Mesh(backGeo, wood);
  back.position.set(0, 0.925, -0.17);
  group.add(back);

  // Shelves - 5 adjustable shelves
  const shelfGeo = new THREE.BoxGeometry(0.76, 0.032, 0.34);
  for (let i = 0; i < 5; i++) {
    const shelf = new THREE.Mesh(shelfGeo, wood);
    shelf.position.set(0, 0.15 + i * 0.42, 0);
    group.add(shelf);
  }

  // Top cap
  const topGeo = new THREE.BoxGeometry(0.88, 0.04, 0.38);
  const top = new THREE.Mesh(topGeo, wood);
  top.position.set(0, 1.87, 0);
  group.add(top);

  // Bottom base
  const bottomGeo = new THREE.BoxGeometry(0.88, 0.06, 0.38);
  const bottom = new THREE.Mesh(bottomGeo, wood);
  bottom.position.set(0, 0.03, 0);
  group.add(bottom);

  // Brass support brackets
  const bracketGeo = new THREE.BoxGeometry(0.02, 0.15, 0.02);
  for (let i = 1; i < 5; i++) {
    const bracket1 = new THREE.Mesh(bracketGeo, metal);
    bracket1.position.set(-0.35, 0.2 + i * 0.42, 0.16);
    group.add(bracket1);

    const bracket2 = new THREE.Mesh(bracketGeo, metal);
    bracket2.position.set(0.35, 0.2 + i * 0.42, 0.16);
    group.add(bracket2);
  }

  enableShadows(group);
  return group;
};

// Modern TV Stand
export const createTVStand = (colorHex?: string) => {
  const group = new THREE.Group();
  const wood = createOakWood();
  if (colorHex) wood.color.set(colorHex);
  const metal = createBlackMetal();
  const marble = createMarble();

  // Main body
  const bodyGeo = new THREE.BoxGeometry(1.6, 0.32, 0.42);
  const body = new THREE.Mesh(bodyGeo, wood);
  body.position.y = 0.35;
  group.add(body);

  // Marble top
  const topGeo = new THREE.BoxGeometry(1.65, 0.025, 0.45);
  const top = new THREE.Mesh(topGeo, marble);
  top.position.y = 0.52;
  group.add(top);

  // Open shelf compartment
  const shelfGeo = new THREE.BoxGeometry(0.72, 0.18, 0.38);
  const shelf = new THREE.Mesh(shelfGeo, wood);
  shelf.position.set(0, 0.18, 0);
  group.add(shelf);

  // Drawer fronts (left and right)
  const drawerGeo = new THREE.BoxGeometry(0.38, 0.14, 0.02);
  const drawer1 = new THREE.Mesh(drawerGeo, wood);
  drawer1.position.set(-0.55, 0.42, 0.2);
  group.add(drawer1);

  const drawer2 = new THREE.Mesh(drawerGeo, wood);
  drawer2.position.set(0.55, 0.42, 0.2);
  group.add(drawer2);

  // Brass handles
  const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8);
  const brass = createBrassMetal();
  const handle1 = new THREE.Mesh(handleGeo, brass);
  handle1.position.set(-0.55, 0.42, 0.22);
  handle1.rotation.x = Math.PI / 2;
  group.add(handle1);

  const handle2 = new THREE.Mesh(handleGeo, brass);
  handle2.position.set(0.55, 0.42, 0.22);
  handle2.rotation.x = Math.PI / 2;
  group.add(handle2);

  // Hairpin legs
  const legGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8);
  const positions = [
    [-0.75, 0.09, 0.16],
    [0.75, 0.09, 0.16],
    [-0.75, 0.09, -0.16],
    [0.75, 0.09, -0.16]
  ];

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, metal);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  // Cable management hole
  const holeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16);
  const hole = new THREE.Mesh(holeGeo, metal);
  hole.position.set(0, 0.36, 0.18);
  hole.rotation.x = Math.PI / 2;
  group.add(hole);

  enableShadows(group);
  return group;
};

// Sectional Sofa (new)
export const createSectionalSofa = (colorHex?: string) => {
  const group = new THREE.Group();
  const fabric = createGreyFabric();
  if (colorHex) fabric.color.set(colorHex);
  const wood = createOakWood();

  // L-shaped main section
  const mainGeo = new THREE.BoxGeometry(2.0, 0.18, 0.8);
  const main = new THREE.Mesh(mainGeo, fabric);
  main.position.set(0, 0.32, 0);
  group.add(main);

  // L-shaped extension
  const extGeo = new THREE.BoxGeometry(0.8, 0.18, 0.8);
  const ext = new THREE.Mesh(extGeo, fabric);
  ext.position.set(1.2, 0.32, 0.8);
  group.add(ext);

  // Back sections
  const backMainGeo = new THREE.BoxGeometry(1.9, 0.5, 0.15);
  const backMain = new THREE.Mesh(backMainGeo, fabric);
  backMain.position.set(0, 0.62, -0.35);
  group.add(backMain);

  const backExtGeo = new THREE.BoxGeometry(0.7, 0.5, 0.15);
  const backExt = new THREE.Mesh(backExtGeo, fabric);
  backExt.position.set(1.2, 0.62, 0.4);
  backExt.rotation.y = Math.PI / 2;
  group.add(backExt);

  // Corner seat cushion
  const cornerGeo = new THREE.BoxGeometry(0.75, 0.16, 0.75);
  const corner = new THREE.Mesh(cornerGeo, fabric);
  corner.position.set(1.2, 0.32, 0.8);
  group.add(corner);

  // Arms
  const armGeo = new THREE.BoxGeometry(0.15, 0.4, 0.8);
  const arm1 = new THREE.Mesh(armGeo, fabric);
  arm1.position.set(-1.0, 0.4, 0);
  group.add(arm1);

  // Chaise cushion
  const chaiseGeo = new THREE.BoxGeometry(0.75, 0.16, 1.4);
  const chaise = new THREE.Mesh(chaiseGeo, fabric);
  chaise.position.set(1.2, 0.32, 0.35);
  group.add(chaise);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.12, 8);
  const positions = [
    [-0.9, 0.06, 0.3],
    [0.9, 0.06, 0.3],
    [-0.9, 0.06, -0.3],
    [0.9, 0.06, -0.3],
    [0.5, 0.06, 1.2],
    [1.8, 0.06, 1.2],
    [0.5, 0.06, 0.5],
    [1.8, 0.06, 0.5]
  ];

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, wood);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  enableShadows(group);
  return group;
};

// Modern Lounge Chair (new)
export const createLoungeChair = (colorHex?: string) => {
  const group = new THREE.Group();
  const fabric = createBeigeFabric();
  if (colorHex) fabric.color.set(colorHex);
  const wood = createWalnutWood();
  const metal = createBrassMetal();

  // Shell body
  const shellGeo = new THREE.SphereGeometry(0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const shell = new THREE.Mesh(shellGeo, fabric);
  shell.position.set(0, 0.45, 0);
  shell.scale.set(1, 0.8, 1);
  group.add(shell);

  // Seat cushion
  const cushionGeo = new THREE.BoxGeometry(0.5, 0.1, 0.45);
  const cushion = new THREE.Mesh(cushionGeo, fabric);
  cushion.position.set(0, 0.38, 0.05);
  group.add(cushion);

  // Headrest
  const headrestGeo = new THREE.BoxGeometry(0.35, 0.15, 0.08);
  const headrest = new THREE.Mesh(headrestGeo, fabric);
  headrest.position.set(0, 0.72, -0.15);
  headrest.rotation.x = 0.2;
  group.add(headrest);

  // Wooden base/legs
  const baseGeo = new THREE.BoxGeometry(0.5, 0.04, 0.5);
  const base = new THREE.Mesh(baseGeo, wood);
  base.position.y = 0.2;
  group.add(base);

  // Central support
  const supportGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.18, 16);
  const support = new THREE.Mesh(supportGeo, metal);
  support.position.y = 0.09;
  group.add(support);

  // Brass foot
  const footGeo = new THREE.TorusGeometry(0.15, 0.015, 8, 24);
  const foot = new THREE.Mesh(footGeo, metal);
  foot.position.y = 0.02;
  foot.rotation.x = Math.PI / 2;
  group.add(foot);

  enableShadows(group);
  return group;
};

export const getModelGenerator = (type: string) => {
  switch (type) {
    case 'sofa':
      return createSofa;
    case 'chair':
      return createDiningChair;
    case 'coffeetable':
      return createCoffeeTable;
    case 'diningtable':
      return createDiningTable;
    case 'armchair':
      return createArmchair;
    case 'bed':
      return createBed;
    case 'bookshelf':
      return createBookshelf;
    case 'tvstand':
      return createTVStand;
    case 'sectional':
      return createSectionalSofa;
    case 'lounge':
      return createLoungeChair;
    default:
      return createSofa;
  }
};
