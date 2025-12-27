// filepath: c:\Users\samkl\Documents\GitHub\animate\docs\react\src\filters.js
import * as THREE from 'three'; // Might be needed for future filters

// Additive filter application function
export function applyFilters(baseValue, filters = [], time) {
  let offset = 0;
  filters.forEach(filter => {
    switch (filter.type) {
      case 'sin':
        // Ensure defaults if properties are missing
        offset += Math.sin(time * (filter.frequency ?? 1)) * (filter.amplitude ?? 0);
        break;
      // --- Add Noise Filter --- 
      case 'noise':
        // Simple pseudo-random noise using time and an offset
        // Use a combination of sin functions for a smoother noise
        const noiseVal = (Math.sin(time * (filter.frequency ?? 1) * 1.3 + filter.id * 10) + Math.sin(time * (filter.frequency ?? 1) * 2.7 + filter.id * 5)) / 2;
        offset += noiseVal * (filter.amplitude ?? 0);
        break;
      // --- End Noise Filter ---
      default:
        console.warn(`Unknown filter type: ${filter.type}`);
    }
  });
  return baseValue + offset;
}

// Function to get default parameters for a filter type
export function getDefaultFilterParams(type) {
  switch (type) {
    case 'sin':
      return { amplitude: 10, frequency: 1 };
    case 'noise': // Default for noise
      return { amplitude: 5, frequency: 1 }; // Added frequency for noise control
    default:
      return {};
  }
}

// Available filter types (for dropdowns)
export const FILTER_TYPES = {
  SIN: 'sin',
  NOISE: 'noise',
};