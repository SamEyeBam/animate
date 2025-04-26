import * as THREE from 'three';

export const FloralPhyllo = ({ scene, rotation, params, viewport, objectsToDispose = [] }) => {
  const { 
    width,
    depth, 
    start, 
    colour1, 
    colour2 
  } = params;
  
  // The effective rotation with start offset
  const effectiveRotation = rotation + start;
  
  // Generate points in phyllotaxis pattern
  for (let n = 1; n <= depth; n++) {
    // Calculate position using phyllotaxis formula
    // Use the golden angle (137.5 degrees) for natural-looking pattern
    const a = n * 0.1 + effectiveRotation / 100;
    const r = Math.sqrt(n) * (width / 25);
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    
    // Calculate color using gradient based on position in the sequence
    const colorFraction = n / depth;
    const color = lerpColor(colour1, colour2, colorFraction);
    
    // Create a petal/eye shape at this position
    createPetal(scene, n/2 + 10, x, y, 0, color, objectsToDispose);
  }
};

// Helper function to create a petal/eye shape
function createPetal(scene, size, x, y, z, color, objectsToDispose) {
  // Create a custom shape for the petal/eye
  const shape = new THREE.Shape();
  
  // Define control points for the petal shape
  const halfSize = size / 2;
  
  // Starting point
  shape.moveTo(-halfSize, 0);
  
  // Top curve
  shape.quadraticCurveTo(0, halfSize, halfSize, 0);
  
  // Bottom curve
  shape.quadraticCurveTo(0, -halfSize, -halfSize, 0);
  
  // Create geometry from shape
  const geometry = new THREE.ShapeGeometry(shape);
  
  // Create material with specified color
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    side: THREE.DoubleSide
  });
  
  // Create mesh and position it
  const petal = new THREE.Mesh(geometry, material);
  petal.position.set(x, y, z);
  
  // Calculate angle based on position relative to origin
  const angle = Math.atan2(y, x);
  petal.rotation.z = angle; // Rotate to face outward
  
  // Add stroke outline
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({ 
    color: new THREE.Color(0x000000),
    linewidth: 1 
  });
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  
  petal.add(edges);
  scene.add(petal);
  
  // Add to objects to dispose list
  if (objectsToDispose) {
    objectsToDispose.push(petal);
    // Also track the edges for disposal
    objectsToDispose.push(edges);
  }
}

// Convert hex color string to THREE.js color and interpolate
function lerpColor(colorA, colorB, t) {
  const a = new THREE.Color(colorA);
  const b = new THREE.Color(colorB);
  
  return new THREE.Color(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t
  ).getHex();
}