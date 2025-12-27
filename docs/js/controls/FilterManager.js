/**
 * FilterManager - Manages filter plugins and computes filtered values
 * 
 * Filters modify control values over time (e.g., oscillate a slider)
 */
class FilterManager {
  constructor() {
    this.filterTypes = new Map();
    this.registerBuiltinFilters();
  }

  /**
   * Register built-in filter types
   */
  registerBuiltinFilters() {
    // Sine wave filter
    this.registerFilter('sin', {
      name: 'Sine Wave',
      compute: (params, elapsed) => {
        const { min, max, rate } = params;
        const halfRange = (max - min) / 2;
        return min + halfRange + Math.sin(rate * elapsed * 2) * halfRange;
      },
      controls: [
        { name: 'min', type: 'range', label: 'Min' },
        { name: 'max', type: 'range', label: 'Max' },
        { name: 'rate', type: 'range', label: 'Rate', min: 0.1, max: 10, defaultValue: 1 }
      ]
    });

    // Triangle wave filter
    this.registerFilter('triangle', {
      name: 'Triangle Wave',
      compute: (params, elapsed) => {
        const { min, max, rate } = params;
        const period = (2 * Math.PI) / rate;
        const t = (elapsed % period) / period;
        const triangleValue = t < 0.5 ? t * 2 : 2 - t * 2;
        return min + (max - min) * triangleValue;
      },
      controls: [
        { name: 'min', type: 'range', label: 'Min' },
        { name: 'max', type: 'range', label: 'Max' },
        { name: 'rate', type: 'range', label: 'Rate', min: 0.1, max: 10, defaultValue: 1 }
      ]
    });

    // Sawtooth wave filter
    this.registerFilter('sawtooth', {
      name: 'Sawtooth Wave',
      compute: (params, elapsed) => {
        const { min, max, rate } = params;
        const period = (2 * Math.PI) / rate;
        const t = (elapsed % period) / period;
        return min + (max - min) * t;
      },
      controls: [
        { name: 'min', type: 'range', label: 'Min' },
        { name: 'max', type: 'range', label: 'Max' },
        { name: 'rate', type: 'range', label: 'Rate', min: 0.1, max: 10, defaultValue: 1 }
      ]
    });

    // Square wave filter
    this.registerFilter('square', {
      name: 'Square Wave',
      compute: (params, elapsed) => {
        const { min, max, rate } = params;
        const sinValue = Math.sin(rate * elapsed * 2);
        return sinValue >= 0 ? max : min;
      },
      controls: [
        { name: 'min', type: 'range', label: 'Min' },
        { name: 'max', type: 'range', label: 'Max' },
        { name: 'rate', type: 'range', label: 'Rate', min: 0.1, max: 10, defaultValue: 1 }
      ]
    });

    // Random/noise filter
    this.registerFilter('noise', {
      name: 'Noise',
      compute: (params, elapsed) => {
        const { min, max, smoothness } = params;
        // Simple smooth random using sin of elapsed with random-ish multiplier
        const noise = Math.sin(elapsed * 17.3) * Math.cos(elapsed * 31.7) * 0.5 + 0.5;
        return min + (max - min) * noise;
      },
      controls: [
        { name: 'min', type: 'range', label: 'Min' },
        { name: 'max', type: 'range', label: 'Max' },
        { name: 'smoothness', type: 'range', label: 'Smoothness', min: 1, max: 100, defaultValue: 50 }
      ]
    });

    // Linear interpolation (ping-pong)
    this.registerFilter('linear', {
      name: 'Linear (Ping-Pong)',
      compute: (params, elapsed) => {
        const { min, max, duration } = params;
        const cycleTime = elapsed % (duration * 2);
        const t = cycleTime < duration 
          ? cycleTime / duration 
          : 1 - (cycleTime - duration) / duration;
        return min + (max - min) * t;
      },
      controls: [
        { name: 'min', type: 'range', label: 'Min' },
        { name: 'max', type: 'range', label: 'Max' },
        { name: 'duration', type: 'range', label: 'Duration (s)', min: 0.5, max: 30, defaultValue: 5 }
      ]
    });
  }

  /**
   * Register a custom filter type
   * @param {string} id - Unique filter identifier
   * @param {object} filterDef - Filter definition with name, compute, controls
   */
  registerFilter(id, filterDef) {
    this.filterTypes.set(id, filterDef);
  }

  /**
   * Get all available filter types
   * @returns {Array} Array of {id, name} objects
   */
  getAvailableFilters() {
    const filters = [];
    for (const [id, def] of this.filterTypes) {
      filters.push({ id, name: def.name });
    }
    return filters;
  }

  /**
   * Get filter definition by id
   * @param {string} id - Filter type id
   * @returns {object|null} Filter definition
   */
  getFilter(id) {
    return this.filterTypes.get(id) || null;
  }

  /**
   * Compute the combined value from multiple filters
   * @param {Array} filters - Array of active filter instances
   * @param {number} elapsed - Elapsed time in seconds
   * @returns {number|null} Computed value or null if no filters
   */
  computeFilteredValue(filters, elapsed) {
    if (!filters || filters.length === 0) return null;

    let totalValue = 0;
    for (const filter of filters) {
      const filterDef = this.getFilter(filter.type);
      if (filterDef) {
        totalValue += filterDef.compute(filter.params, elapsed);
      }
    }
    return totalValue;
  }

  /**
   * Create a filter instance with default params
   * @param {string} type - Filter type id
   * @param {object} controlConfig - The control's config (for min/max defaults)
   * @returns {object} Filter instance
   */
  createFilterInstance(type, controlConfig) {
    const filterDef = this.getFilter(type);
    if (!filterDef) {
      throw new Error(`Unknown filter type: ${type}`);
    }

    const params = {};
    for (const ctrl of filterDef.controls) {
      if (ctrl.name === 'min') {
        params.min = controlConfig.min ?? 0;
      } else if (ctrl.name === 'max') {
        params.max = controlConfig.max ?? 100;
      } else {
        params[ctrl.name] = ctrl.defaultValue ?? 1;
      }
    }

    return {
      type,
      params,
      element: null // Will hold DOM reference for cleanup
    };
  }
}

// Global singleton
const filterManager = new FilterManager();
