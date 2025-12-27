/**
 * BaseShape - Base class for all animated shapes
 * 
 * To create a new shape:
 * 1. Create a new file in /js/shapes/
 * 2. Extend BaseShape
 * 3. Define static `config` array with control definitions
 * 4. Implement constructor with matching parameters
 * 5. Implement `draw(elapsed, deltaTime)` method
 * 6. Register with shapeRegistry at the end of the file
 * 
 * Example:
 * ```
 * class MyShape extends BaseShape {
 *   static config = [
 *     { type: 'range', property: 'size', min: 10, max: 500, defaultValue: 100 },
 *     { type: 'color', property: 'color', defaultValue: '#ff0000' }
 *   ];
 * 
 *   constructor(size, color) {
 *     super();
 *     this.size = size;
 *     this.color = color;
 *   }
 * 
 *   draw(elapsed, deltaTime) {
 *     this.updateFilters(elapsed);
 *     // Drawing code using this.size and this.color
 *   }
 * }
 * shapeRegistry.register('MyShape', MyShape);
 * ```
 * 
 * Control types:
 * - range: { type, property, min, max, defaultValue, callback? }
 * - color: { type, property, defaultValue }
 * - checkbox: { type, property, defaultValue }
 * - dropdown: { type, property, defaultValue, options: [{value, label}] }
 * - button: { type, label, method }
 * - header: { type, text }
 */
class BaseShape {
  constructor() {
    this.controls = [];
    this.controlManager = null;
    this.speedMultiplier = 500;
  }

  /**
   * Initialize controls using the ControlManager
   * Called automatically when a shape is created
   * @param {ControlManager} controlManager - The control manager instance
   */
  initializeControls(controlManager) {
    this.controlManager = controlManager;
    
    // Get config from static property
    const config = this.constructor.config || [];
    
    for (const item of config) {
      const controlData = controlManager.addControl(item, this);
      if (controlData) {
        this.controls.push(controlData);
      }
    }
    
    // Add speed multiplier control (common to all shapes)
    const speedControl = controlManager.addControl({
      type: 'range',
      min: 1,
      max: 1000,
      defaultValue: this.speedMultiplier,
      property: 'speedMultiplier'
    }, this);
    if (speedControl) {
      this.controls.push(speedControl);
    }
  }

  /**
   * Clean up controls when shape is removed
   */
  remove() {
    if (this.controlManager) {
      for (const control of this.controls) {
        this.controlManager.removeControl(control);
      }
    }
    this.controls = [];
  }

  /**
   * Update any active filters on controls
   * Call this at the start of your draw() method
   * @param {number} elapsed - Total elapsed time in seconds
   */
  updateFilters(elapsed) {
    if (!this.controlManager) return;
    
    for (const control of this.controls) {
      if (control.filters && control.filters.length > 0) {
        const newValue = this.controlManager.filterManager.computeFilteredValue(
          control.filters,
          elapsed
        );
        
        if (newValue !== null && control.element) {
          control.element.value = newValue;
          const event = new Event('input', { bubbles: true });
          control.element.dispatchEvent(event);
        }
      }
    }
  }

  /**
   * Main draw method - override in subclasses
   * @param {number} elapsed - Total elapsed time in seconds
   * @param {number} deltaTime - Time since last frame
   */
  draw(elapsed, deltaTime) {
    throw new Error('draw() method not implemented');
  }
}
