import * as THREE from 'three';

export const RaysInShape = ({ scene, elapsedTime, deltaTime, params, viewport, objectsToDispose = [] }) => {
  const {
    rays,
    speed,
    doesWave,
    speedVertRate,
    speedHorrRate,
    speedVert,
    speedHorr,
    boxSize,
    trailLength,
    lineWidth,
    fade,
    colourFree,
    colourContained,
    boxVisible
  } = params;

  // Define box boundaries
  const halfBoxSize = boxSize / 200;
  const boxLeft = -halfBoxSize;
  const boxRight = halfBoxSize;
  const boxTop = -halfBoxSize;
  const boxBottom = halfBoxSize;

  // Draw the box if visible
  if (boxVisible) {
    const boxGeometry = new THREE.BufferGeometry();
    const boxVertices = new Float32Array([
      boxLeft, boxTop, 0,
      boxRight, boxTop, 0,
      boxRight, boxBottom, 0,
      boxLeft, boxBottom, 0,
      boxLeft, boxTop, 0
    ]);
    boxGeometry.setAttribute('position', new THREE.BufferAttribute(boxVertices, 3));
    const boxMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const box = new THREE.Line(boxGeometry, boxMaterial);
    scene.add(box);
    
    // Track box for disposal
    if (objectsToDispose) {
      objectsToDispose.push(box);
    }
  }

  // Calculate current wave values if waves are enabled
  let currentSpeedVert = speedVert;
  let currentSpeedHorr = speedHorr;

  if (doesWave) {
    const vertRate = speedVertRate / 1000;
    const horrRate = speedHorrRate / 1000;
    currentSpeedVert = Math.sin(elapsedTime * vertRate) * 85 + 100;
    currentSpeedHorr = Math.sin(elapsedTime * horrRate) * 85 + 100;
  }
  
  // Generate rays
  const actualRayCount = Math.min(rays, 100); // Limit for performance
  for (let i = 0; i < actualRayCount; i++) {
    const angle = (i * 360) / actualRayCount;
    
    // Create ray trajectory
    const positions = generateRayPositions(
      0, 0, 0, // Start at center
      angle,
      speed / 10000,
      currentSpeedVert / 100,
      currentSpeedHorr / 100,
      boxLeft,
      boxRight,
      boxTop,
      boxBottom,
      elapsedTime
    );
    
    // Draw the ray trail
    drawRayTrail(
      scene, 
      positions, 
      Math.min(trailLength, 30), // Limit trail length for performance
      lineWidth / 10, 
      colourContained, 
      fade,
      objectsToDispose
    );
    
    // Draw center-bound rays from collision points
    positions.forEach(pos => {
      if (pos.collision) {
        const angleToCenter = Math.atan2(-pos.y, -pos.x) * 180 / Math.PI;
        
        const centerTrail = generateCenterRayPositions(
          pos.x, pos.y, 0,
          angleToCenter,
          speed / 8000,
          Math.min(trailLength / 2, 15) // Limit trail length for performance
        );
        
        drawRayTrail(
          scene, 
          centerTrail, 
          Math.min(trailLength / 2, 15),
          lineWidth / 10, 
          colourFree, 
          fade,
          objectsToDispose
        );
      }
    });
  }
};

// Generate positions for a ray
function generateRayPositions(
  startX, startY, startZ,
  angle,
  speed,
  speedVert,
  speedHorr,
  boxLeft,
  boxRight,
  boxTop,
  boxBottom,
  elapsedTime
) {
  const positions = [];
  let x = startX;
  let y = startY;
  let z = startZ;
  let currentAngle = angle;
  let collisionCount = 0;
  const maxCollisions = 5; // Limit collisions for performance
  
  // Calculate initial direction
  const radians = (currentAngle * Math.PI) / 180;
  let dirX = Math.cos(radians);
  let dirY = Math.sin(radians);
  
  // Add starting position
  positions.push({ x, y, z, angle: currentAngle });
  
  // Move ray until collision or max collisions reached
  while (collisionCount < maxCollisions) {
    // Calculate new position
    const dx = speedHorr * speed * dirX;
    const dy = speedVert * speed * dirY;
    
    x += dx;
    y += dy;
    
    // Check for collisions
    let collision = null;
    
    // Check horizontal boundaries
    if (x < boxLeft) {
      x = boxLeft;
      currentAngle = 180 - currentAngle;
      collision = 'left';
    } else if (x > boxRight) {
      x = boxRight;
      currentAngle = 180 - currentAngle;
      collision = 'right';
    }
    
    // Check vertical boundaries
    if (y < boxTop) {
      y = boxTop;
      currentAngle = 360 - currentAngle;
      collision = 'top';
    } else if (y > boxBottom) {
      y = boxBottom;
      currentAngle = 360 - currentAngle;
      collision = 'bottom';
    }
    
    // Normalize angle
    currentAngle = ((currentAngle % 360) + 360) % 360;
    
    // Add position to array
    positions.push({ 
      x, y, z, 
      angle: currentAngle,
      collision
    });
    
    // If collision occurred, update direction and increment counter
    if (collision) {
      const newRadians = (currentAngle * Math.PI) / 180;
      dirX = Math.cos(newRadians);
      dirY = Math.sin(newRadians);
      collisionCount++;
    }
    
    // Break if we're outside the box
    if (x < boxLeft * 2 || x > boxRight * 2 || y < boxTop * 2 || y > boxBottom * 2) {
      break;
    }
  }
  
  return positions;
}

// Generate center-bound ray positions
function generateCenterRayPositions(startX, startY, startZ, angle, speed, trailLength) {
  const positions = [];
  let x = startX;
  let y = startY;
  let z = startZ;
  
  // Calculate direction toward center
  const radians = (angle * Math.PI) / 180;
  const dirX = Math.cos(radians);
  const dirY = Math.sin(radians);
  
  // Add starting position
  positions.push({ x, y, z, angle });
  
  // Generate trail points
  for (let i = 0; i < trailLength; i++) {
    // Move toward center
    x += dirX * speed;
    y += dirY * speed;
    
    // Add to positions
    positions.push({ x, y, z, angle });
    
    // If very close to center, stop
    if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) {
      break;
    }
  }
  
  return positions;
}

// Draw a ray trail
function drawRayTrail(scene, positions, maxPoints, lineWidth, color, fade, objectsToDispose) {
  // Use only a portion of positions for performance
  const usePositions = positions.slice(0, maxPoints);
  
  // Create line segments for the ray
  for (let i = 1; i < usePositions.length; i++) {
    const prev = usePositions[i - 1];
    const curr = usePositions[i];
    
    // Calculate opacity based on position in trail if fade is enabled
    let opacity = 1;
    if (fade) {
      opacity = 1 - (i / usePositions.length);
    }
    
    // Create geometry for line segment
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      prev.x, prev.y, prev.z,
      curr.x, curr.y, curr.z
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Create material with appropriate color
    const material = new THREE.LineBasicMaterial({
      color: curr.collision ? 0xffff00 : new THREE.Color(color),
      transparent: fade,
      opacity: opacity,
      linewidth: lineWidth
    });
    
    // Create and add the line
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    
    // Track line for disposal
    if (objectsToDispose) {
      objectsToDispose.push(line);
    }
  }
}