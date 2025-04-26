import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useAnimationStore from '../store/animationStore';
import { PolyTwistColourWidth } from './animations/PolyTwistColourWidth';
import { FloralPhyllo } from './animations/FloralPhyllo';
import { RaysInShape } from './animations/RaysInShape';

const AnimationScene = () => {
  const { selectedAnimation, elapsedTime, rotation, updateAnimation, animations, paused } = useAnimationStore();
  const lastTimeRef = useRef(0);
  const sceneRef = useRef();
  const objectsToDisposeRef = useRef([]);
  const { viewport, size } = useThree();

  // Helper function to properly dispose of Three.js objects
  const disposeObjects = () => {
    if (objectsToDisposeRef.current.length > 0) {
      objectsToDisposeRef.current.forEach(object => {
        // Dispose of geometries
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        // Dispose of materials (could be an array or a single material)
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      // Clear the disposal list
      objectsToDisposeRef.current = [];
    }
  };

  // Clear scene when animation changes
  useEffect(() => {
    if (sceneRef.current) {
      // Dispose of all existing objects first
      disposeObjects();
      
      while (sceneRef.current.children.length > 0) {
        const child = sceneRef.current.children[0];
        sceneRef.current.remove(child);
      }
    }
  }, [selectedAnimation]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      disposeObjects();
    };
  }, []);

  // Update animation on each frame
  useFrame((state, delta) => {
    if (!paused) {
      updateAnimation(delta);
    }
    
    // Get the current animation parameters
    const animationParams = animations[selectedAnimation].parameters;
    
    // Get elapsed time in seconds
    const currentTime = elapsedTime;
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    // Clear the scene for a new frame
    if (sceneRef.current) {
      // Dispose of previous objects first to prevent memory leaks
      disposeObjects();
      
      while (sceneRef.current.children.length > 0) {
        const child = sceneRef.current.children[0];
        sceneRef.current.remove(child);
      }
      
      // Array to collect objects created in this frame for later disposal
      const newObjects = [];
      
      // Render the selected animation
      switch (selectedAnimation) {
        case 'PolyTwistColourWidth':
          PolyTwistColourWidth({
            scene: sceneRef.current,
            rotation,
            params: animationParams,
            viewport,
            objectsToDispose: newObjects
          });
          break;
        case 'FloralPhyllo':
          FloralPhyllo({
            scene: sceneRef.current,
            rotation,
            params: animationParams,
            viewport,
            objectsToDispose: newObjects
          });
          break;
        case 'RaysInShape':
          RaysInShape({
            scene: sceneRef.current,
            elapsedTime: currentTime,
            deltaTime,
            params: animationParams,
            viewport,
            objectsToDispose: newObjects
          });
          break;
        default:
          // Default: render nothing
          break;
      }
      
      // Store objects for disposal in the next frame
      objectsToDisposeRef.current = newObjects;
    }
  });

  return (
    <group ref={sceneRef} />
  );
};

export default AnimationScene;