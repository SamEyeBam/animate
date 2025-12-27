/**
 * SceneUI - Manages the UI for multi-shape scenes
 * 
 * Creates collapsible panels for each shape with:
 * - Layer controls (visibility, pause, reorder, remove)
 * - Shape-specific controls
 * - Add new shape interface
 */
class SceneUI {
  constructor(scene, containerId) {
    this.scene = scene;
    this.container = document.getElementById(containerId);
    this.layerPanels = new Map(); // layerId -> { panel, controlManager }
    
    this.createSceneControls();
  }

  /**
   * Create the main scene control area (add shape button, etc.)
   */
  createSceneControls() {
    // Scene header
    const header = document.createElement('div');
    header.className = 'scene-header';
    header.innerHTML = `
      <h3>Scene Layers</h3>
      <div class="scene-header-buttons">
        <button class="scene-btn" id="add-shape-btn" title="Add Shape">+ Add</button>
        <button class="scene-btn" id="save-scene-btn" title="Save Scene">💾 Save</button>
        <button class="scene-btn" id="load-scene-btn" title="Load Scene">📂 Load</button>
        <button class="scene-btn" id="presets-btn" title="Presets">⭐ Presets</button>
      </div>
    `;
    this.container.insertBefore(header, this.container.firstChild);

    // Shape picker modal (hidden by default)
    this.createShapePicker();
    
    // Presets modal
    this.createPresetsModal();
    
    // Hidden file input for loading
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'scene-file-input';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Add shape button handler
    document.getElementById('add-shape-btn').addEventListener('click', () => {
      this.showShapePicker();
    });
    
    // Save button handler
    document.getElementById('save-scene-btn').addEventListener('click', () => {
      this.saveScene();
    });
    
    // Load button handler
    document.getElementById('load-scene-btn').addEventListener('click', () => {
      document.getElementById('scene-file-input').click();
    });
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.loadScene(e.target.files[0]);
        e.target.value = ''; // Reset for same file
      }
    });
    
    // Presets button handler
    document.getElementById('presets-btn').addEventListener('click', () => {
      this.showPresetsModal();
    });
  }

  /**
   * Save current scene to file
   */
  saveScene() {
    const data = this.scene.exportToJSON();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `scene-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Load scene from file
   */
  loadScene(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.scene.importFromJSON(data, this);
      } catch (err) {
        alert('Failed to load scene: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  /**
   * Create presets modal
   */
  createPresetsModal() {
    const modal = document.createElement('div');
    modal.className = 'presets-modal';
    modal.id = 'presets-modal';
    modal.style.display = 'none';
    
    modal.innerHTML = `
      <div class="presets-content">
        <h3>Presets</h3>
        <div class="presets-actions">
          <button class="preset-save-current-btn">💾 Save Current as Preset</button>
        </div>
        <div class="presets-list" id="presets-list">
          <p class="presets-empty">No presets saved yet</p>
        </div>
        <button class="button presets-cancel">Close</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load and display presets
    this.refreshPresetsList();
    
    // Event handlers
    modal.querySelector('.presets-cancel').addEventListener('click', () => {
      this.hidePresetsModal();
    });
    
    modal.querySelector('.preset-save-current-btn').addEventListener('click', () => {
      this.saveCurrentAsPreset();
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hidePresetsModal();
      }
    });
  }

  showPresetsModal() {
    this.refreshPresetsList();
    document.getElementById('presets-modal').style.display = 'flex';
  }

  hidePresetsModal() {
    document.getElementById('presets-modal').style.display = 'none';
  }

  /**
   * Get user presets from localStorage
   */
  getPresets() {
    try {
      return JSON.parse(localStorage.getItem('animation-presets') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Get built-in presets
   */
  getBuiltInPresets() {
    return typeof BUILT_IN_PRESETS !== 'undefined' ? BUILT_IN_PRESETS : [];
  }

  /**
   * Save presets to localStorage
   */
  savePresets(presets) {
    localStorage.setItem('animation-presets', JSON.stringify(presets));
  }

  /**
   * Save current scene as a preset
   */
  saveCurrentAsPreset() {
    const name = prompt('Enter preset name:');
    if (!name) return;
    
    const presets = this.getPresets();
    const data = this.scene.exportToJSON();
    
    presets.push({
      name: name,
      date: new Date().toISOString(),
      data: data
    });
    
    this.savePresets(presets);
    this.refreshPresetsList();
  }

  /**
   * Load a preset (built-in or user)
   */
  loadPreset(index, isBuiltIn = false) {
    const presets = isBuiltIn ? this.getBuiltInPresets() : this.getPresets();
    if (index >= 0 && index < presets.length) {
      this.scene.importFromJSON(presets[index].data, this);
      this.hidePresetsModal();
    }
  }

  /**
   * Delete a user preset by index
   */
  deletePreset(index) {
    const presets = this.getPresets();
    if (index >= 0 && index < presets.length) {
      if (confirm(`Delete preset "${presets[index].name}"?`)) {
        presets.splice(index, 1);
        this.savePresets(presets);
        this.refreshPresetsList();
      }
    }
  }

  /**
   * Refresh the presets list UI
   */
  refreshPresetsList() {
    const container = document.getElementById('presets-list');
    if (!container) return;
    
    const builtInPresets = this.getBuiltInPresets();
    const userPresets = this.getPresets();
    
    let html = '';
    
    // Built-in presets section
    if (builtInPresets.length > 0) {
      html += '<div class="presets-section-header">Built-in Presets</div>';
      html += builtInPresets.map((preset, index) => `
        <div class="preset-item preset-builtin" data-index="${index}" data-builtin="true">
          <div class="preset-info">
            <span class="preset-name">${preset.name}</span>
            <span class="preset-description">${preset.description || `${preset.data.layers.length} layer(s)`}</span>
          </div>
          <div class="preset-actions">
            <button class="preset-load-btn" data-index="${index}" data-builtin="true">Load</button>
          </div>
        </div>
      `).join('');
    }
    
    // User presets section
    html += '<div class="presets-section-header">My Presets</div>';
    if (userPresets.length === 0) {
      html += '<p class="presets-empty">No saved presets yet</p>';
    } else {
      html += userPresets.map((preset, index) => `
        <div class="preset-item" data-index="${index}">
          <div class="preset-info">
            <span class="preset-name">${preset.name}</span>
            <span class="preset-layers">${preset.data.layers.length} layer(s)</span>
          </div>
          <div class="preset-actions">
            <button class="preset-load-btn" data-index="${index}">Load</button>
            <button class="preset-delete-btn" data-index="${index}">🗑</button>
          </div>
        </div>
      `).join('');
    }
    
    container.innerHTML = html;
    
    // Add event listeners
    container.querySelectorAll('.preset-load-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isBuiltIn = btn.dataset.builtin === 'true';
        this.loadPreset(parseInt(btn.dataset.index), isBuiltIn);
      });
    });
    
    container.querySelectorAll('.preset-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.deletePreset(parseInt(btn.dataset.index));
      });
    });
  }

  /**
   * Create the shape picker modal with tabs
   */
  createShapePicker() {
    const modal = document.createElement('div');
    modal.className = 'shape-picker-modal';
    modal.id = 'shape-picker-modal';
    modal.style.display = 'none';

    const shapes = shapeRegistry.getAvailableNames();
    const shapesHtml = shapes.map(name => 
      `<button class="shape-picker-btn" data-shape="${name}">${name}</button>`
    ).join('');

    const builtInPresets = this.getBuiltInPresets();
    const builtInHtml = builtInPresets.map((preset, i) => 
      `<button class="shape-picker-btn preset-btn" data-preset-index="${i}" data-builtin="true">
        <span class="preset-btn-name">${preset.name}</span>
        <span class="preset-btn-info">${preset.data.layers.length} layer(s)</span>
      </button>`
    ).join('');

    modal.innerHTML = `
      <div class="shape-picker-container">
        <h3>Add Layer</h3>
        <div class="shape-picker-tabs">
          <button class="shape-picker-tab active" data-tab="shapes">Shapes</button>
          <button class="shape-picker-tab" data-tab="presets">Presets</button>
        </div>
        <div class="shape-picker-content">
          <div class="shape-picker-panel active" id="panel-shapes">
            <div class="shape-picker-buttons">
              ${shapesHtml}
            </div>
          </div>
          <div class="shape-picker-panel" id="panel-presets">
            <div class="shape-picker-section">
              <div class="shape-picker-section-title">Built-in</div>
              <div class="shape-picker-buttons">
                ${builtInHtml}
              </div>
            </div>
            <div class="shape-picker-section">
              <div class="shape-picker-section-title">My Presets</div>
              <div class="shape-picker-buttons" id="picker-user-presets">
                <p class="presets-empty">No saved presets</p>
              </div>
            </div>
          </div>
        </div>
        <button class="shape-picker-cancel">Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Tab switching
    modal.querySelectorAll('.shape-picker-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.shape-picker-tab').forEach(t => t.classList.remove('active'));
        modal.querySelectorAll('.shape-picker-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
      });
    });

    // Cancel button
    modal.querySelector('.shape-picker-cancel').addEventListener('click', () => {
      this.hideShapePicker();
    });

    // Shape buttons
    modal.querySelectorAll('.shape-picker-btn[data-shape]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.addShapeToScene(btn.dataset.shape);
        this.hideShapePicker();
      });
    });

    // Preset buttons (add as layers, don't replace)
    modal.querySelectorAll('.preset-btn[data-builtin="true"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.addPresetAsLayers(parseInt(btn.dataset.presetIndex), true);
        this.hideShapePicker();
      });
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideShapePicker();
      }
    });
  }

  /**
   * Refresh user presets in the picker
   */
  refreshPickerUserPresets() {
    const container = document.getElementById('picker-user-presets');
    if (!container) return;

    const userPresets = this.getPresets();
    
    if (userPresets.length === 0) {
      container.innerHTML = '<p class="presets-empty">No saved presets</p>';
      return;
    }

    container.innerHTML = userPresets.map((preset, i) => 
      `<button class="shape-picker-btn preset-btn" data-preset-index="${i}" data-builtin="false">
        <span class="preset-btn-name">${preset.name}</span>
        <span class="preset-btn-info">${preset.data.layers.length} layer(s)</span>
      </button>`
    ).join('');

    container.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.addPresetAsLayers(parseInt(btn.dataset.presetIndex), false);
        this.hideShapePicker();
      });
    });
  }

  /**
   * Add preset layers to scene (without clearing existing)
   */
  addPresetAsLayers(index, isBuiltIn) {
    const presets = isBuiltIn ? this.getBuiltInPresets() : this.getPresets();
    if (index < 0 || index >= presets.length) return;

    const preset = presets[index];
    for (const layerData of preset.data.layers) {
      try {
        if (!shapeRegistry.get(layerData.name)) {
          console.warn(`Shape "${layerData.name}" not found, skipping`);
          continue;
        }

        const layerId = this.scene.addShape(layerData.name, layerData.values);
        const layer = this.scene.getLayer(layerId);

        if (!layer || !layer.shape) continue;

        layer.visible = layerData.visible !== false;
        layer.paused = layerData.paused || false;
        layer.collapsed = layerData.collapsed !== false;

        // Create panel with filters and bounds
        this.createLayerPanel(layer, layerData.filters, layerData.controlBounds);
      } catch (e) {
        console.warn(`Failed to add layer "${layerData.name}":`, e.message);
      }
    }
  }

  showShapePicker() {
    this.refreshPickerUserPresets();
    document.getElementById('shape-picker-modal').style.display = 'flex';
  }

  hideShapePicker() {
    document.getElementById('shape-picker-modal').style.display = 'none';
  }

  /**
   * Add a shape to the scene and create its UI panel
   * @param {string} shapeName
   */
  addShapeToScene(shapeName) {
    const layerId = this.scene.addShape(shapeName);
    const layer = this.scene.getLayer(layerId);
    
    // Create the layer panel UI first (it will contain the controls)
    this.createLayerPanel(layer);
  }

  /**
   * Create a collapsible panel for a layer
   * @param {object|number} layerOrId - Layer object or layer ID
   * @param {object} savedFilters - Optional saved filter settings to restore
   * @param {object} savedBounds - Optional saved control bounds to restore
   */
  createLayerPanel(layerOrId, savedFilters = null, savedBounds = null) {
    // Handle both layer object and layer ID
    const layer = typeof layerOrId === 'number' 
      ? this.scene.getLayer(layerOrId) 
      : layerOrId;
    
    if (!layer || !layer.shape) {
      console.warn('Cannot create panel: layer or shape is undefined');
      return;
    }

    const panel = document.createElement('div');
    panel.className = 'layer-panel';
    panel.id = `layer-panel-${layer.id}`;

    // Layer header with controls
    const header = document.createElement('div');
    header.className = 'layer-header';
    header.innerHTML = `
      <span class="layer-collapse-btn" data-layer="${layer.id}">▼</span>
      <span class="layer-name">${layer.name}</span>
      <div class="layer-controls">
        <button class="layer-btn layer-visibility" data-layer="${layer.id}" title="Toggle visibility">👁</button>
        <button class="layer-btn layer-pause" data-layer="${layer.id}" title="Pause/Play">⏸</button>
        <button class="layer-btn layer-up" data-layer="${layer.id}" title="Move up">↑</button>
        <button class="layer-btn layer-down" data-layer="${layer.id}" title="Move down">↓</button>
        <button class="layer-btn layer-remove" data-layer="${layer.id}" title="Remove">✕</button>
      </div>
    `;

    // Layer content (shape controls container)
    const content = document.createElement('div');
    content.className = 'layer-content';
    content.id = `layer-content-${layer.id}`;

    panel.appendChild(header);
    panel.appendChild(content);

    // Add to layers container
    const shapesContainer = document.getElementById('layers-container');
    if (shapesContainer) {
      shapesContainer.appendChild(panel);
    } else {
      this.container.appendChild(panel);
    }

    // Create a control manager specifically for this layer's content
    const layerControlManager = new ControlManager(content.id);
    
    // Initialize the shape's controls into the layer content
    layer.shape.initializeControls(layerControlManager);

    // Restore saved control bounds if provided
    if (savedBounds) {
      this.applyBoundsToShape(layer.shape, savedBounds);
    }

    // Restore saved filters if provided
    if (savedFilters) {
      this.applyFiltersToShape(layer.shape, layerControlManager, savedFilters);
    }

    // Store both panel and control manager
    this.layerPanels.set(layer.id, { panel, controlManager: layerControlManager });

    // Attach event handlers
    this.attachLayerHandlers(layer.id, panel);
    
    // Apply collapsed state
    if (layer.collapsed) {
      this.updateLayerUI(layer.id);
    }
  }

  /**
   * Apply saved filters to a shape's controls
   */
  applyFiltersToShape(shape, controlManager, savedFilters) {
    if (!savedFilters || !shape.controls) return;

    for (const control of shape.controls) {
      // Property is stored in control.config.property
      const property = control.config?.property;
      if (!property || !savedFilters[property]) continue;
      
      const filterDataArray = savedFilters[property];
      const controlConfig = control.config || {};
      
      for (const filterData of filterDataArray) {
        // Create filter instance with saved params
        const filterInstance = {
          type: filterData.type,
          params: { ...filterData.params }
        };
        
        const filterDef = controlManager.filterManager.getFilter(filterData.type);
        if (!filterDef) continue;

        // Create filter UI
        const filterUI = controlManager.factory.createFilterUI(
          filterInstance,
          filterDef,
          control,
          controlConfig
        );

        if (control.filtersContainer) {
          control.filtersContainer.appendChild(filterUI);
        }
        
        if (!control.filters) {
          control.filters = [];
        }
        control.filters.push(filterInstance);
        
        // Update filter badge
        controlManager.factory.updateFilterBadge(control);
      }
    }
  }

  /**
   * Apply saved control bounds to a shape's controls
   */
  applyBoundsToShape(shape, savedBounds) {
    if (!savedBounds || !shape.controls) return;

    for (const control of shape.controls) {
      const property = control.config?.property;
      if (!property || !savedBounds[property]) continue;
      
      const bounds = savedBounds[property];
      
      // Update configState
      if (control.configState) {
        control.configState.min = bounds.min;
        control.configState.max = bounds.max;
      }
      
      // Update the input element's min/max
      if (control.element) {
        control.element.min = bounds.min;
        control.element.max = bounds.max;
      }
      
      // Update the settings panel inputs if they exist
      if (control.settingsPanel) {
        const inputs = control.settingsPanel.querySelectorAll('.setting-input');
        if (inputs[0]) inputs[0].value = bounds.min;
        if (inputs[1]) inputs[1].value = bounds.max;
      }
    }
  }

  /**
   * Attach event handlers for layer controls
   */
  attachLayerHandlers(layerId, panel) {
    // Collapse toggle
    panel.querySelector('.layer-collapse-btn').addEventListener('click', () => {
      this.toggleCollapse(layerId);
    });

    // Visibility toggle
    panel.querySelector('.layer-visibility').addEventListener('click', () => {
      this.scene.toggleVisibility(layerId);
      this.updateLayerUI(layerId);
    });

    // Pause toggle
    panel.querySelector('.layer-pause').addEventListener('click', () => {
      this.scene.togglePause(layerId);
      this.updateLayerUI(layerId);
    });

    // Move up
    panel.querySelector('.layer-up').addEventListener('click', () => {
      this.scene.moveUp(layerId);
      this.reorderPanels();
    });

    // Move down
    panel.querySelector('.layer-down').addEventListener('click', () => {
      this.scene.moveDown(layerId);
      this.reorderPanels();
    });

    // Remove
    panel.querySelector('.layer-remove').addEventListener('click', () => {
      this.removeLayer(layerId);
    });
  }

  /**
   * Toggle collapse state for a layer panel
   */
  toggleCollapse(layerId) {
    const layer = this.scene.getLayer(layerId);
    if (!layer) return;

    layer.collapsed = !layer.collapsed;
    this.updateLayerUI(layerId);
  }

  /**
   * Update layer UI to reflect current state
   */
  updateLayerUI(layerId) {
    const layer = this.scene.getLayer(layerId);
    const layerData = this.layerPanels.get(layerId);
    if (!layer || !layerData) return;
    
    const panel = layerData.panel;

    // Update collapse
    const collapseBtn = panel.querySelector('.layer-collapse-btn');
    const content = panel.querySelector('.layer-content');
    if (layer.collapsed) {
      collapseBtn.textContent = '▶';
      content.style.display = 'none';
    } else {
      collapseBtn.textContent = '▼';
      content.style.display = 'block';
    }

    // Update visibility button
    const visBtn = panel.querySelector('.layer-visibility');
    visBtn.style.opacity = layer.visible ? '1' : '0.4';

    // Update pause button
    const pauseBtn = panel.querySelector('.layer-pause');
    pauseBtn.textContent = layer.paused ? '▶' : '⏸';
  }

  /**
   * Reorder panels to match scene layer order
   */
  reorderPanels() {
    const container = document.getElementById('layers-container') || this.container;
    
    for (const layer of this.scene.getLayers()) {
      const layerData = this.layerPanels.get(layer.id);
      if (layerData && layerData.panel) {
        container.appendChild(layerData.panel); // Moves to end, in order
      }
    }
  }

  /**
   * Remove a layer and its panel
   */
  removeLayer(layerId) {
    const layerData = this.layerPanels.get(layerId);
    
    // Clean up control manager
    if (layerData && layerData.controlManager) {
      layerData.controlManager.clearAll();
    }
    
    // Remove from scene
    this.scene.removeShape(layerId);
    
    // Remove panel from DOM
    if (layerData && layerData.panel && layerData.panel.parentNode) {
      layerData.panel.parentNode.removeChild(layerData.panel);
    }
    this.layerPanels.delete(layerId);
  }

  /**
   * Clear all layer panels (for import)
   */
  clearAllPanels() {
    for (const [layerId, layerData] of this.layerPanels) {
      if (layerData.controlManager) {
        layerData.controlManager.clearAll();
      }
      if (layerData.panel && layerData.panel.parentNode) {
        layerData.panel.parentNode.removeChild(layerData.panel);
      }
    }
    this.layerPanels.clear();
  }

  /**
   * Clear all layer panels and scene
   */
  clearAll() {
    this.clearAllPanels();
    this.scene.clear();
  }
}
