/**
 * ShapeRegistry - Automatically registers and manages available shape classes
 * Shapes register themselves when loaded, no manual map needed
 */
class ShapeRegistry {
  constructor() {
    this.shapes = new Map();
  }

  /**
   * Register a shape class
   * @param {string} name - The name of the shape
   * @param {class} shapeClass - The shape class constructor
   */
  register(name, shapeClass) {
    if (this.shapes.has(name)) {
      console.warn(`Shape "${name}" is already registered. Overwriting.`);
    }
    this.shapes.set(name, shapeClass);
  }

  /**
   * Get a shape class by name
   * @param {string} name - The name of the shape
   * @returns {class|null} The shape class or null if not found
   */
  get(name) {
    return this.shapes.get(name) || null;
  }

  /**
   * Create an instance of a shape
   * @param {string} name - The name of the shape
   * @param {object} initialValues - Initial property values (overrides defaults)
   * @returns {BaseShape} The shape instance
   */
  createInstance(name, initialValues = {}) {
    const ShapeClass = this.get(name);
    if (!ShapeClass) {
      throw new Error(`Unknown shape: "${name}". Available shapes: ${this.getAvailableNames().join(', ')}`);
    }
    
    // Get the static config to determine constructor argument order
    const config = ShapeClass.config || [];
    
    // Build positional arguments array from config defaults + initialValues overrides
    const args = config
      .filter(item => item.property) // Only items with properties
      .map(item => {
        // Use provided value or fall back to default
        return initialValues.hasOwnProperty(item.property) 
          ? initialValues[item.property] 
          : item.defaultValue;
      });
    
    return new ShapeClass(...args);
  }

  /**
   * Get all registered shape names (alphabetically sorted)
   * @returns {string[]} Array of shape names
   */
  getAvailableNames() {
    return Array.from(this.shapes.keys()).sort((a, b) => a.localeCompare(b));
  }

  /**
   * Get the config definition for a shape
   * @param {string} name - The name of the shape
   * @returns {array|null} The config array or null
   */
  getConfig(name) {
    const ShapeClass = this.get(name);
    if (!ShapeClass) return null;
    return ShapeClass.config || [];
  }

  /**
   * Check if a shape is registered
   * @param {string} name - The name of the shape
   * @returns {boolean}
   */
  has(name) {
    return this.shapes.has(name);
  }
}

// Global singleton instance
const shapeRegistry = new ShapeRegistry();
