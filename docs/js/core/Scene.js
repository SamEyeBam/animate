/**
 * Scene - Manages multiple shapes on a single canvas
 * 
 * Features:
 * - Multiple shapes rendered in layer order
 * - Per-shape visibility and pause controls
 * - Collapsible control panels per shape
 * - Add/remove shapes dynamically
 */
class Scene {
    constructor() {
        this.layers = []; // Array of { id, shape, visible, paused, collapsed }
        this.nextLayerId = 1;
    }

    /**
     * Add a shape to the scene
     * @param {string} shapeName - Name of the shape class
     * @param {object} initialValues - Initial property values
     * @returns {number} Layer ID
     */
    addShape(shapeName, initialValues = {}) {
        const shape = shapeRegistry.createInstance(shapeName, initialValues);
        
        if (!shape) {
            throw new Error(`Failed to create shape: ${shapeName}`);
        }

        const layer = {
            id: this.nextLayerId++,
            name: shapeName,
            shape: shape,
            visible: true,
            paused: false,
            collapsed: false
        };

        this.layers.push(layer);
        return layer.id;
    }

    /**
     * Remove a shape from the scene
     * @param {number} layerId - Layer ID to remove
     */
    removeShape(layerId) {
        const index = this.layers.findIndex(l => l.id === layerId);
        if (index !== -1) {
            const layer = this.layers[index];
            // Clean up controls
            if (layer.shape.remove) {
                layer.shape.remove();
            }
            this.layers.splice(index, 1);
        }
    }

    /**
     * Get a layer by ID
     * @param {number} layerId
     * @returns {object|null}
     */
    getLayer(layerId) {
        return this.layers.find(l => l.id === layerId) || null;
    }

    /**
     * Toggle layer visibility
     * @param {number} layerId
     */
    toggleVisibility(layerId) {
        const layer = this.getLayer(layerId);
        if (layer) {
            layer.visible = !layer.visible;
        }
    }

    /**
     * Toggle layer pause state
     * @param {number} layerId
     */
    togglePause(layerId) {
        const layer = this.getLayer(layerId);
        if (layer) {
            layer.paused = !layer.paused;
        }
    }

    /**
     * Toggle layer control panel collapsed state
     * @param {number} layerId
     */
    toggleCollapsed(layerId) {
        const layer = this.getLayer(layerId);
        if (layer) {
            layer.collapsed = !layer.collapsed;
        }
    }

    /**
     * Move a layer up in the render order
     * @param {number} layerId
     */
    moveUp(layerId) {
        const index = this.layers.findIndex(l => l.id === layerId);
        if (index > 0) {
            [this.layers[index - 1], this.layers[index]] = [this.layers[index], this.layers[index - 1]];
        }
    }

    /**
     * Move a layer down in the render order
     * @param {number} layerId
     */
    moveDown(layerId) {
        const index = this.layers.findIndex(l => l.id === layerId);
        if (index < this.layers.length - 1) {
            [this.layers[index], this.layers[index + 1]] = [this.layers[index + 1], this.layers[index]];
        }
    }

    /**
     * Draw all visible shapes
     * @param {number} elapsed - Total elapsed time
     * @param {number} deltaTime - Time since last frame
     */
    draw(elapsed, deltaTime) {
        for (const layer of this.layers) {
            if (layer.visible && !layer.paused) {
                layer.shape.draw(elapsed, deltaTime);
            }
        }
    }

    /**
     * Get all layers
     * @returns {array}
     */
    getLayers() {
        return this.layers;
    }

    /**
     * Clear all layers
     */
    clear() {
        for (const layer of this.layers) {
            if (layer.shape.remove) {
                layer.shape.remove();
            }
        }
        this.layers = [];
    }

    /**
     * Export scene to JSON
     * @returns {object} Scene data
     */
    exportToJSON() {
        return {
            version: 1,
            layers: this.layers.map(layer => {
                const shape = layer.shape;
                const ShapeClass = shape.constructor;
                const config = ShapeClass.config || [];
                
                // Extract current values from shape
                const values = {};
                config.forEach(item => {
                    if (item.property && shape.hasOwnProperty(item.property)) {
                        values[item.property] = shape[item.property];
                    }
                });
                
                // Also save speedMultiplier
                values.speedMultiplier = shape.speedMultiplier;

                // Extract filter settings and control bounds from shape.controls
                const filters = {};
                const controlBounds = {};
                if (shape.controls) {
                    for (const control of shape.controls) {
                        const property = control.config?.property;
                        if (!property) continue;
                        
                        // Save filters
                        if (control.filters && control.filters.length > 0) {
                            filters[property] = control.filters.map(f => ({
                                type: f.type,
                                params: { ...f.params }
                            }));
                        }
                        
                        // Save custom min/max bounds if different from original
                        if (control.configState) {
                            const { min, max, originalMin, originalMax } = control.configState;
                            if (min !== originalMin || max !== originalMax) {
                                controlBounds[property] = { min, max };
                            }
                        }
                    }
                }

                return {
                    name: layer.name,
                    visible: layer.visible,
                    paused: layer.paused,
                    collapsed: layer.collapsed,
                    values: values,
                    filters: filters,
                    controlBounds: controlBounds
                };
            })
        };
    }

    /**
     * Import scene from JSON
     * @param {object} data - Scene data
     * @param {SceneUI} sceneUI - UI instance to rebuild panels
     */
    importFromJSON(data, sceneUI) {
        // Clear existing
        this.clear();
        if (sceneUI) {
            sceneUI.clearAllPanels();
        }

        // Validate version
        if (!data.version || !data.layers) {
            throw new Error('Invalid scene data');
        }

        // Recreate layers
        for (const layerData of data.layers) {
            try {
                // Check if shape type exists
                if (!shapeRegistry.get(layerData.name)) {
                    console.warn(`Shape "${layerData.name}" not found, skipping`);
                    continue;
                }

                const layerId = this.addShape(layerData.name, layerData.values);
                const layer = this.getLayer(layerId);
                
                if (!layer || !layer.shape) {
                    console.warn(`Failed to create layer for "${layerData.name}"`);
                    continue;
                }

                layer.visible = layerData.visible !== false;
                layer.paused = layerData.paused || false;
                layer.collapsed = layerData.collapsed || false;

                // Create UI panel (this also creates controls, applies filters and bounds)
                if (sceneUI) {
                    sceneUI.createLayerPanel(layer, layerData.filters, layerData.controlBounds);
                }
            } catch (e) {
                console.warn(`Failed to load shape "${layerData.name}":`, e.message);
            }
        }
    }
}

// Global scene instance
const scene = new Scene();
