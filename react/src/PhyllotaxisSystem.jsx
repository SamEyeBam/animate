import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls, folder } from 'leva'; // Import leva controls

// Default values matching original config
const DEFAULTS = {
  width: 24,
  nMax: 300,
  color1: '#2D81FC',
  color2: '#FC0362',
  pointSize: 5.0, // Added point size control
};

function PhyllotaxisSystem({ speedMultiplier }) { // Accept global speed multiplier
  const pointsRef = useRef();
  const positionBufferRef = useRef();
  const colorBufferRef = useRef();

  // Leva controls specific to Phyllotaxis
  const { width, nMax, color1, color2, pointSize } = useControls('Phyllotaxis', {
    // Group controls in a folder
      width: { value: DEFAULTS.width, min: 1, max: 50, step: 1, label: 'Width Factor' },
      nMax: { value: DEFAULTS.nMax, min: 10, max: 5000, step: 10, label: 'Particle Count' },
      pointSize: { value: DEFAULTS.pointSize, min: 0.1, max: 20, step: 0.1, label: 'Point Size' },
      Colors: folder({ // Sub-folder for colors
        color1: { value: DEFAULTS.color1, label: 'Color 1' },
        color2: { value: DEFAULTS.color2, label: 'Color 2' },
      })
  });

  // Memoize particle data generation, recalculate if controls change
  const particles = useMemo(() => {
    const positions = new Float32Array(nMax * 3);
    const colors = new Float32Array(nMax * 3);
    const tempColor = new THREE.Color();
    const col1 = new THREE.Color(color1);
    const col2 = new THREE.Color(color2);

    for (let i = 0; i < nMax; i++) {
      const n = i;
      const radius = width * Math.sqrt(n);
      const angle = 0; // Initial angle

      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = radius * Math.sin(angle);
      positions[i * 3 + 2] = 0;

      tempColor.copy(col1).lerp(col2, n / nMax);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }
    return { positions, colors };
    // Dependencies: recalculate when these control values change
  }, [nMax, width, color1, color2]);

  // Update positions in the animation loop
  useFrame((state) => {
    if (!positionBufferRef.current || !colorBufferRef.current) return;

    // Use combined speed (global * local if needed, here just global)
    const time = state.clock.elapsedTime * speedMultiplier * 0.3; // Adjusted speed factor
    const positions = positionBufferRef.current.array;

    for (let i = 0; i < nMax; i++) {
      const n = i;
      const radius = width * Math.sqrt(n);
      const angle = n * time; // Angle driven by time and index

      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = radius * Math.sin(angle);
      // z remains 0
    }
    positionBufferRef.current.needsUpdate = true;

    // Update point size if material exists
    if (pointsRef.current && pointsRef.current.material) {
        pointsRef.current.material.size = pointSize;
    }
  });

  // Effect to update buffers when particles data changes (due to control changes)
  React.useEffect(() => {
    if (positionBufferRef.current) {
      positionBufferRef.current.array = particles.positions;
      positionBufferRef.current.needsUpdate = true;
    }
    if (colorBufferRef.current) {
      colorBufferRef.current.array = particles.colors;
      colorBufferRef.current.needsUpdate = true;
    }
  }, [particles]);


  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* Use keys to force re-creation if nMax changes drastically */}
        <bufferAttribute
          key={`pos-${nMax}`}
          ref={positionBufferRef}
          attach="attributes-position"
          count={particles.positions.length / 3} // Use actual length
          array={particles.positions}
          itemSize={3}
          usage={THREE.DynamicDrawUsage} // Mark as dynamic
        />
        <bufferAttribute
          key={`col-${nMax}`}
          ref={colorBufferRef}
          attach="attributes-color"
          count={particles.colors.length / 3} // Use actual length
          array={particles.colors}
          itemSize={3}
          usage={THREE.DynamicDrawUsage} // Mark as dynamic
        />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        vertexColors={true}
        sizeAttenuation={true}
        depthWrite={false} // Often good for particles
        blending={THREE.AdditiveBlending} // Example blending mode
      />
    </points>
  );
}

export default PhyllotaxisSystem;
