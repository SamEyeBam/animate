/**
 * ControlManager - Manages UI controls for shapes
 * 
 * Handles creation, updates, and cleanup of control panels
 * Ready for Phase 2 multi-shape support (panels per shape)
 */
class ControlManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.filterManager = filterManager; // Use global FilterManager
    this.factory = new ControlFactory(this);
    
    // Track all active controls (for future multi-shape, keyed by shape id)
    this.activeControls = new Map();
  }

  /**
   * Add a filter to a control
   */
  addFilter(controlData, controlConfig, filterType) {
    const filterInstance = this.filterManager.createFilterInstance(filterType, controlConfig);
    const filterDef = this.filterManager.getFilter(filterType);

    if (!controlData.filters) {
      controlData.filters = [];
    }

    // Create filter UI
    const filterUI = this.factory.createFilterUI(
      filterInstance,
      filterDef,
      controlData,
      controlConfig
    );

    controlData.filtersContainer.appendChild(filterUI);
    controlData.filters.push(filterInstance);
  }

  /**
   * Remove a filter from a control
   */
  removeFilter(controlData, filterInstance) {
    const index = controlData.filters.indexOf(filterInstance);
    if (index > -1) {
      controlData.filters.splice(index, 1);
      if (filterInstance.element && filterInstance.element.parentNode) {
        filterInstance.element.parentNode.removeChild(filterInstance.element);
      }
    }
  }

  /**
   * Add a control for a shape
   * @param {object} config - Control configuration
   * @param {BaseShape} instance - Shape instance
   * @returns {object} Control data
   */
  addControl(config, instance) {
    return this.factory.create(config, instance, this.container);
  }

  /**
   * Remove a control
   * @param {object} controlData - Control data from addControl
   */
  removeControl(controlData) {
    if (!controlData) return;

    // Remove event listeners
    if (controlData.element && controlData.listener) {
      const eventType = controlData.type === 'checkbox' ? 'change' : 
                        controlData.type === 'dropdown' ? 'change' : 'input';
      controlData.element.removeEventListener(eventType, controlData.listener);
    }

    // Remove filters
    if (controlData.filters) {
      for (const filter of controlData.filters) {
        if (filter.element && filter.element.parentNode) {
          filter.element.parentNode.removeChild(filter.element);
        }
      }
    }

    // Remove wrapper element
    if (controlData.wrapper && controlData.wrapper.parentNode) {
      controlData.wrapper.parentNode.removeChild(controlData.wrapper);
    }
  }

  /**
   * Clear all controls
   */
  clearAll() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.activeControls.clear();
  }

  /**
   * Update a control's displayed value programmatically
   */
  updateControlValue(property, value) {
    const element = document.getElementById(`el${property}`);
    const label = document.getElementById(`elText${property}`);

    if (element) {
      element.value = value;
    }
    if (label) {
      label.textContent = Math.round(value * 100) / 100;
    }
  }
}
