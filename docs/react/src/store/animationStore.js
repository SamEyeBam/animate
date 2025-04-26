import { create } from 'zustand';

// Animation definitions with their configurations
const animationConfigs = {
  PolyTwistColourWidth: [
    { type: "range", min: 3, max: 10, defaultValue: 5, property: "sides", label: "Sides" },
    { type: "range", min: 400, max: 2000, defaultValue: 400, property: "width", label: "Width" },
    { type: "range", min: 2, max: 5, defaultValue: 5, property: "lineWidth", label: "Line Width" },
    { type: "range", min: 1, max: 100, defaultValue: 50, property: "depth", label: "Depth" },
    { type: "range", min: -180, max: 180, defaultValue: -90, property: "rotation", label: "Rotation" },
    { type: "range", min: 1, max: 500, defaultValue: 100, property: "speedMultiplier", label: "Speed" },
    { type: "color", defaultValue: "#4287f5", property: "colour1", label: "Color 1" },
    { type: "color", defaultValue: "#42f57b", property: "colour2", label: "Color 2" },
  ],
  FloralPhyllo: [
    { type: "range", min: 1, max: 600, defaultValue: 300, property: "width", label: "Width" },
    { type: "range", min: 1, max: 300, defaultValue: 150, property: "depth", label: "Depth" },
    { type: "range", min: 0, max: 3141, defaultValue: 0, property: "start", label: "Start" },
    { type: "color", defaultValue: "#4287f5", property: "colour1", label: "Color 1" },
    { type: "color", defaultValue: "#FC0362", property: "colour2", label: "Color 2" },
  ],
  RaysInShape: [
    { type: "range", min: 50, max: 1000, defaultValue: 500, property: "rays", label: "Rays" },
    { type: "range", min: 1, max: 30, defaultValue: 2, property: "speed", label: "Speed" },
    { type: "checkbox", defaultValue: true, property: "doesWave", label: "Wave Effect" },
    { type: "range", min: 1, max: 200, defaultValue: 100, property: "speedVertRate", label: "Vertical Rate" },
    { type: "range", min: 1, max: 200, defaultValue: 100, property: "speedHorrRate", label: "Horizontal Rate" },
    { type: "range", min: 1, max: 200, defaultValue: 100, property: "speedVert", label: "Vertical Speed" },
    { type: "range", min: 1, max: 200, defaultValue: 100, property: "speedHorr", label: "Horizontal Speed" },
    { type: "range", min: 10, max: 2000, defaultValue: 800, property: "boxSize", label: "Box Size" },
    { type: "range", min: 1, max: 80, defaultValue: 5, property: "trailLength", label: "Trail Length" },
    { type: "range", min: 1, max: 500, defaultValue: 5, property: "lineWidth", label: "Line Width" },
    { type: "checkbox", defaultValue: false, property: "fade", label: "Fade Effect" },
    { type: "color", defaultValue: "#43dbad", property: "colourFree", label: "Free Color" },
    { type: "color", defaultValue: "#f05c79", property: "colourContained", label: "Contained Color" },
    { type: "checkbox", defaultValue: false, property: "boxVisible", label: "Show Box" },
  ]
};

// Generate default parameters for each animation
const generateDefaultParameters = (config) => {
  const defaults = {};
  config.forEach(item => {
    defaults[item.property] = item.defaultValue;
  });
  return defaults;
};

// Helper function to create an animation state object
const createAnimationState = () => {
  const animations = {};

  Object.keys(animationConfigs).forEach(animName => {
    animations[animName] = {
      config: animationConfigs[animName],
      parameters: generateDefaultParameters(animationConfigs[animName]),
      baseParameters: generateDefaultParameters(animationConfigs[animName]), // Store original values
      filters: {} // Will store filters applied to parameters
    };
  });

  return animations;
};

// Create the store
const useAnimationStore = create((set, get) => ({
  // Store all animation configurations and their parameters
  animations: createAnimationState(),

  // Currently selected animation
  selectedAnimation: 'PolyTwistColourWidth',

  // Animation control
  paused: false,
  elapsedTime: 0,
  rotation: 0,
  speedMultiplier: 100,

  // Set the selected animation
  setSelectedAnimation: (animationName) => {
    set({ selectedAnimation: animationName });
  },

  // Toggle pause state
  togglePause: () => {
    set(state => ({ paused: !state.paused }));
  },

  // Reset the animation
  resetAnimation: () => {
    set({ rotation: 0, elapsedTime: 0 });
  },

  // Update a parameter for the current animation
  updateParameter: (property, value) => {
    set(state => {
      const animName = state.selectedAnimation;
      return {
        animations: {
          ...state.animations,
          [animName]: {
            ...state.animations[animName],
            parameters: {
              ...state.animations[animName].parameters,
              [property]: value
            },
            baseParameters: {
              ...state.animations[animName].baseParameters,
              [property]: value
            }
          }
        }
      };
    });
  },

  // Add a filter to a parameter
  addFilter: (property, filterType = 'sine') => {
    set(state => {
      const animName = state.selectedAnimation;
      const config = state.animations[animName].config.find(c => c.property === property);

      if (!config) return state;

      // Calculate default min and max based on the base parameter value
      const baseValue = state.animations[animName].baseParameters[property];
      const range = config.max - config.min;
      const offset = range * 0.2; // 20% of range

      // Create default filter with min/max values
      const newFilter = {
        type: filterType,
        min: baseValue - offset,
        max: baseValue + offset,
        frequency: 0.3, // Hz - cycles per second
        phase: Math.random() * Math.PI * 2, // Random phase offset between 0 and 2π
        enabled: true
      };

      const currentFilters = state.animations[animName].filters[property] || [];

      return {
        animations: {
          ...state.animations,
          [animName]: {
            ...state.animations[animName],
            filters: {
              ...state.animations[animName].filters,
              [property]: [...currentFilters, newFilter]
            }
          }
        }
      };
    });
  },

  // Update a filter
  updateFilter: (property, filterIndex, filterProperty, value) => {
    set(state => {
      const animName = state.selectedAnimation;
      const filters = state.animations[animName].filters[property] || [];

      if (filterIndex >= filters.length) return state;

      const updatedFilters = [...filters];
      updatedFilters[filterIndex] = {
        ...updatedFilters[filterIndex],
        [filterProperty]: value
      };

      return {
        animations: {
          ...state.animations,
          [animName]: {
            ...state.animations[animName],
            filters: {
              ...state.animations[animName].filters,
              [property]: updatedFilters
            }
          }
        }
      };
    });
  },

  // Remove a filter
  removeFilter: (property, filterIndex) => {
    set(state => {
      const animName = state.selectedAnimation;
      const filters = state.animations[animName].filters[property] || [];

      if (filterIndex >= filters.length) return state;

      const updatedFilters = filters.filter((_, i) => i !== filterIndex);

      return {
        animations: {
          ...state.animations,
          [animName]: {
            ...state.animations[animName],
            filters: {
              ...state.animations[animName].filters,
              [property]: updatedFilters
            }
          }
        }
      };
    });
  },

  // Update the animation state on each frame
  updateAnimation: (deltaTime) => {
    set(state => {
      if (state.paused) return state;

      const newElapsedTime = state.elapsedTime + deltaTime;
      const newRotation = state.rotation + (deltaTime * state.speedMultiplier / 100);

      // Apply filters to parameters
      const animName = state.selectedAnimation;
      const animation = state.animations[animName];
      const updatedParameters = { ...animation.parameters };

      // Process each parameter that has filters
      Object.entries(animation.filters).forEach(([property, filters]) => {
        if (!filters || filters.length === 0) return;

        // Start with the base parameter value (unmodified by filters)
        const baseValue = animation.baseParameters[property];

        // Find the config for this property to get min/max bounds
        const config = animation.config.find(c => c.property === property);
        const propMin = config?.min;
        const propMax = config?.max;

        // Calculate the combined effect of all filters
        let totalModification = 0;

        // Apply each filter to build up the modifications
        filters.forEach(filter => {
          if (!filter.enabled) return;

          if (filter.type === 'sine') {
            // Calculate sine wave value based on time and filter properties
            const frequency = filter.frequency || 0.3; // Hz
            const phase = filter.phase || 0;
            const min = filter.min || baseValue - 10;
            const max = filter.max || baseValue + 10;

            // Calculate center and amplitude from min/max
            const center = (min + max) / 2;
            const amplitude = (max - min) / 2;

            // Create sinusoidal oscillation between min and max values
            // const sineValue = center + Math.sin(newElapsedTime * 2 * Math.PI * frequency + phase) * amplitude;
            const sineValue = min + amplitude + Math.sin(newElapsedTime * (1 / frequency)) * amplitude;

            // Instead of direct modification, calculate the difference from base
            const modification = sineValue;

            console.log(`Filter: ${property}, Sine Value: ${sineValue}, Modification: ${modification}`);
            // Add this filter's contribution to the total
            totalModification += modification;

          }
        });

        // Apply total modification to base value
        // let filteredValue = baseValue + totalModification;
        let filteredValue = totalModification;

        // Constrain to the property's min/max if available
        if (propMin !== undefined && filteredValue < propMin) filteredValue = propMin;
        if (propMax !== undefined && filteredValue > propMax) filteredValue = propMax;

        // Update the parameter with the filtered value
        updatedParameters[property] = filteredValue;
      });

      return {
        elapsedTime: newElapsedTime,
        rotation: newRotation,
        animations: {
          ...state.animations,
          [animName]: {
            ...animation,
            parameters: updatedParameters
          }
        }
      };
    });
  }
}));

export default useAnimationStore;