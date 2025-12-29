/**
 * ControlFactory - Creates DOM elements for different control types
 * 
 * Separated from ControlManager for cleaner code organization
 * Features collapsible settings panels and inline filter configuration
 */
class ControlFactory {
  constructor(controlManager) {
    this.controlManager = controlManager;
  }

  /**
   * Create a control based on type
   * @param {object} config - Control configuration
   * @param {object} instance - Shape instance to bind to
   * @param {HTMLElement} container - Container element
   * @returns {object} Control data { element, listener, type, config }
   */
  create(config, instance, container) {
    switch (config.type) {
      case 'range':
        return this.createRange(config, instance, container);
      case 'color':
        return this.createColor(config, instance, container);
      case 'checkbox':
        return this.createCheckbox(config, instance, container);
      case 'dropdown':
        return this.createDropdown(config, instance, container);
      case 'button':
        return this.createButton(config, instance, container);
      case 'header':
        return this.createHeader(config, container);
      default:
        console.warn(`Unknown control type: ${config.type}`);
        return null;
    }
  }

  /**
   * Create a collapsible section with a toggle arrow
   */
  createCollapsible(title, className, defaultOpen = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `collapsible-section ${className}`;

    const header = document.createElement('div');
    header.className = 'collapsible-header';

    const arrow = document.createElement('span');
    arrow.className = 'collapsible-arrow';
    arrow.textContent = defaultOpen ? '▼' : '▶';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'collapsible-title';
    titleSpan.textContent = title;

    header.appendChild(arrow);
    header.appendChild(titleSpan);

    const content = document.createElement('div');
    content.className = 'collapsible-content';
    content.style.display = defaultOpen ? 'block' : 'none';

    header.addEventListener('click', () => {
      const isOpen = content.style.display !== 'none';
      content.style.display = isOpen ? 'none' : 'block';
      arrow.textContent = isOpen ? '▶' : '▼';
    });

    wrapper.appendChild(header);
    wrapper.appendChild(content);

    return { wrapper, content, header, arrow };
  }

  /**
   * Create a range slider control with collapsible settings and filters
   */
  createRange(config, instance, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-container control-range-container';

    // Main row: label + value + slider
    const mainRow = document.createElement('div');
    mainRow.className = 'control-main-row';

    // Label showing property name
    const label = document.createElement('span');
    label.className = 'control-label-inline';
    label.textContent = config.property;

    // Value display (editable)
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'control-value';
    valueDisplay.id = `elText${config.property}`;
    valueDisplay.textContent = instance[config.property] ?? config.defaultValue;

    // Range input
    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'control control-range';
    input.id = `el${config.property}`;
    input.min = config.min;
    input.max = config.max;
    input.value = instance[config.property] ?? config.defaultValue;

    // Store original config bounds for reference
    const configState = {
      min: config.min,
      max: config.max,
      originalMin: config.min,
      originalMax: config.max
    };

    // Event listener
    const listener = (event) => {
      const newValue = parseFloat(event.target.value);
      instance[config.property] = newValue;
      valueDisplay.textContent = Math.round(newValue * 100) / 100;
      if (config.callback) {
        config.callback(instance, newValue);
      }
    };
    input.addEventListener('input', listener);

    mainRow.appendChild(label);
    mainRow.appendChild(valueDisplay);
    wrapper.appendChild(mainRow);
    wrapper.appendChild(input);

    // Options row with toggle buttons
    const optionsRow = document.createElement('div');
    optionsRow.className = 'control-options-row';

    // Settings toggle button
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'control-toggle-btn';
    settingsBtn.innerHTML = '⚙';
    settingsBtn.title = 'Settings';

    // Filters toggle button
    const filtersBtn = document.createElement('button');
    filtersBtn.className = 'control-toggle-btn';
    filtersBtn.innerHTML = '◇';
    filtersBtn.title = 'Filters';

    optionsRow.appendChild(settingsBtn);
    optionsRow.appendChild(filtersBtn);
    wrapper.appendChild(optionsRow);

    // Settings panel (hidden by default)
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'control-settings-panel';
    settingsPanel.style.display = 'none';

    // Min setting
    const minRow = this.createSettingRow('Min', configState.min, (val) => {
      configState.min = val;
      input.min = val;
    });

    // Max setting
    const maxRow = this.createSettingRow('Max', configState.max, (val) => {
      configState.max = val;
      input.max = val;
    });

    settingsPanel.appendChild(minRow);
    settingsPanel.appendChild(maxRow);
    wrapper.appendChild(settingsPanel);

    // Settings toggle
    settingsBtn.addEventListener('click', () => {
      const isOpen = settingsPanel.style.display !== 'none';
      settingsPanel.style.display = isOpen ? 'none' : 'block';
      settingsBtn.classList.toggle('active', !isOpen);
    });

    // Filters panel (hidden by default)
    const filtersPanel = document.createElement('div');
    filtersPanel.className = 'control-filters-panel';
    filtersPanel.style.display = 'none';

    // Add filter dropdown
    const addFilterRow = document.createElement('div');
    addFilterRow.className = 'add-filter-row';

    const filterSelect = document.createElement('select');
    filterSelect.className = 'filter-type-select';
    filterSelect.innerHTML = '<option value="">+ Add Filter...</option>';

    const filters = this.controlManager.filterManager.getAvailableFilters();
    for (const filter of filters) {
      const opt = document.createElement('option');
      opt.value = filter.id;
      opt.textContent = filter.name;
      filterSelect.appendChild(opt);
    }

    addFilterRow.appendChild(filterSelect);
    filtersPanel.appendChild(addFilterRow);

    // Container for active filters
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-list';
    filtersPanel.appendChild(filtersContainer);

    wrapper.appendChild(filtersPanel);

    // Filters toggle
    filtersBtn.addEventListener('click', () => {
      const isOpen = filtersPanel.style.display !== 'none';
      filtersPanel.style.display = isOpen ? 'none' : 'block';
      filtersBtn.classList.toggle('active', !isOpen);
    });

    container.appendChild(wrapper);

    const controlData = {
      element: input,
      listener,
      type: 'range',
      config,
      configState,
      wrapper,
      filtersContainer,
      filters: [],
      label,
      valueDisplay,
      settingsPanel,
      filtersPanel,
      filtersBtn
    };

    // Filter dropdown handler
    filterSelect.addEventListener('change', () => {
      if (filterSelect.value) {
        this.controlManager.addFilter(controlData, config, filterSelect.value);
        filterSelect.value = ''; // Reset dropdown
        // Update filter button to show filter count
        this.updateFilterBadge(controlData);
      }
    });

    return controlData;
  }

  /**
   * Create a setting row with label and number input
   */
  createSettingRow(label, value, onChange) {
    const row = document.createElement('div');
    row.className = 'setting-row';

    const labelEl = document.createElement('span');
    labelEl.className = 'setting-label';
    labelEl.textContent = label;

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'setting-input';
    input.value = value;

    input.addEventListener('change', (e) => {
      onChange(parseFloat(e.target.value));
    });

    row.appendChild(labelEl);
    row.appendChild(input);
    return row;
  }

  /**
   * Update filter badge on button
   */
  updateFilterBadge(controlData) {
    const count = controlData.filters.length;
    if (count > 0) {
      controlData.filtersBtn.innerHTML = `◆ ${count}`;
      controlData.filtersBtn.classList.add('has-filters');
    } else {
      controlData.filtersBtn.innerHTML = '◇';
      controlData.filtersBtn.classList.remove('has-filters');
    }
  }

  /**
   * Create a color picker control
   */
  createColor(config, instance, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-container control-color-container';

    const mainRow = document.createElement('div');
    mainRow.className = 'control-main-row';

    const label = document.createElement('span');
    label.className = 'control-label-inline';
    label.textContent = config.property;

    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'control control-color';
    input.id = `el${config.property}`;
    
    // Handle both RGB array and hex string for initial value
    const currentValue = instance[config.property] ?? config.defaultValue;
    if (Array.isArray(currentValue)) {
      input.value = rgbArrayToHex(currentValue);
    } else {
      input.value = currentValue;
      // Also convert the instance value to RGB array if it's hex
      instance[config.property] = hexToRgbArray(currentValue);
    }

    const listener = (event) => {
      const hexValue = event.target.value;
      // Convert hex to RGB array for internal use
      const rgbValue = hexToRgbArray(hexValue);
      instance[config.property] = rgbValue;
      if (config.callback) {
        config.callback(instance, rgbValue);
      }
    };
    input.addEventListener('input', listener);

    mainRow.appendChild(label);
    mainRow.appendChild(input);
    wrapper.appendChild(mainRow);
    container.appendChild(wrapper);

    return {
      element: input,
      listener,
      type: 'color',
      config,
      wrapper,
      label
    };
  }

  /**
   * Create a checkbox control
   */
  createCheckbox(config, instance, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-container control-checkbox-container';

    const mainRow = document.createElement('div');
    mainRow.className = 'control-main-row';

    const label = document.createElement('span');
    label.className = 'control-label-inline';
    label.textContent = config.property;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'control control-checkbox';
    input.id = `el${config.property}`;
    input.checked = instance[config.property] ?? config.defaultValue;

    const listener = (event) => {
      const newValue = event.target.checked;
      instance[config.property] = newValue;
      if (config.callback) {
        config.callback(instance, newValue);
      }
    };
    input.addEventListener('change', listener);

    mainRow.appendChild(label);
    mainRow.appendChild(input);
    wrapper.appendChild(mainRow);
    container.appendChild(wrapper);

    return {
      element: input,
      listener,
      type: 'checkbox',
      config,
      wrapper,
      label
    };
  }

  /**
   * Create a dropdown select control
   */
  createDropdown(config, instance, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-container';

    const label = document.createElement('p');
    label.className = 'control-label';
    label.id = `elText${config.property}`;
    label.textContent = `${config.property}: ${config.defaultValue}`;

    const select = document.createElement('select');
    select.className = 'control control-dropdown';
    select.id = `el${config.property}`;

    for (const option of config.options || []) {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.label;
      select.appendChild(opt);
    }
    select.value = instance[config.property] ?? config.defaultValue;

    const listener = (event) => {
      const newValue = event.target.value;
      instance[config.property] = newValue;
      label.textContent = `${config.property}: ${newValue}`;
      if (config.callback) {
        config.callback(instance, newValue);
      }
    };
    select.addEventListener('change', listener);

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    container.appendChild(wrapper);

    return {
      element: select,
      listener,
      type: 'dropdown',
      config,
      wrapper,
      label
    };
  }

  /**
   * Create a button control
   */
  createButton(config, instance, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-container';

    const button = document.createElement('button');
    button.className = 'control control-button button-8';
    button.textContent = config.label || config.property;

    const listener = () => {
      if (config.method && typeof instance[config.method] === 'function') {
        instance[config.method]();
      }
      if (config.callback) {
        config.callback(instance);
      }
    };
    button.addEventListener('click', listener);

    wrapper.appendChild(button);
    container.appendChild(wrapper);

    return {
      element: button,
      listener,
      type: 'button',
      config,
      wrapper
    };
  }

  /**
   * Create a header/separator
   */
  createHeader(config, container) {
    const header = document.createElement('p');
    header.className = 'header';
    header.id = `elHeader${(config.text || '').replace(/\s+/g, '')}`;
    header.textContent = config.text || '';
    container.appendChild(header);

    return {
      element: header,
      listener: null,
      type: 'header',
      config,
      wrapper: header
    };
  }

  /**
   * Create filter controls UI with collapsible settings
   */
  createFilterUI(filterInstance, filterDef, controlData, controlConfig) {
    const filterDiv = document.createElement('div');
    filterDiv.className = 'filter-item';

    // Header row with type dropdown and remove button
    const headerRow = document.createElement('div');
    headerRow.className = 'filter-item-header';

    // Filter type dropdown (allows changing filter type)
    const typeSelect = document.createElement('select');
    typeSelect.className = 'filter-type-dropdown';
    
    const filters = this.controlManager.filterManager.getAvailableFilters();
    for (const filter of filters) {
      const opt = document.createElement('option');
      opt.value = filter.id;
      opt.textContent = filter.name;
      if (filter.id === filterInstance.type) {
        opt.selected = true;
      }
      typeSelect.appendChild(opt);
    }

    // Settings toggle button
    const settingsToggle = document.createElement('button');
    settingsToggle.className = 'filter-settings-toggle';
    settingsToggle.innerHTML = '⚙';
    settingsToggle.title = 'Filter settings';

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'filter-remove-btn';
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove filter';

    headerRow.appendChild(typeSelect);
    headerRow.appendChild(settingsToggle);
    headerRow.appendChild(removeBtn);
    filterDiv.appendChild(headerRow);

    // Settings panel (collapsible)
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'filter-settings-panel';
    settingsPanel.style.display = 'none';

    // Create controls for filter parameters
    const paramInputs = {};
    this.buildFilterParams(settingsPanel, filterInstance, filterDef, controlConfig, paramInputs);

    filterDiv.appendChild(settingsPanel);

    // Toggle settings
    settingsToggle.addEventListener('click', () => {
      const isOpen = settingsPanel.style.display !== 'none';
      settingsPanel.style.display = isOpen ? 'none' : 'block';
      settingsToggle.classList.toggle('active', !isOpen);
    });

    // Handle filter type change
    typeSelect.addEventListener('change', () => {
      const newType = typeSelect.value;
      const newFilterDef = this.controlManager.filterManager.getFilter(newType);
      
      // Update filter instance type
      filterInstance.type = newType;
      
      // Reset params to defaults for new type
      filterInstance.params = {};
      for (const ctrl of newFilterDef.controls) {
        if (ctrl.name === 'min') {
          filterInstance.params.min = controlConfig.min ?? 0;
        } else if (ctrl.name === 'max') {
          filterInstance.params.max = controlConfig.max ?? 100;
        } else {
          filterInstance.params[ctrl.name] = ctrl.defaultValue ?? 1;
        }
      }
      
      // Rebuild params UI
      settingsPanel.innerHTML = '';
      this.buildFilterParams(settingsPanel, filterInstance, newFilterDef, controlConfig, paramInputs);
    });

    // Remove handler
    removeBtn.addEventListener('click', () => {
      this.controlManager.removeFilter(controlData, filterInstance);
      this.updateFilterBadge(controlData);
    });

    filterInstance.element = filterDiv;
    return filterDiv;
  }

  /**
   * Build filter parameter controls
   */
  buildFilterParams(container, filterInstance, filterDef, controlConfig, paramInputs) {
    for (const paramDef of filterDef.controls) {
      const paramRow = document.createElement('div');
      paramRow.className = 'filter-param-row';

      const paramLabel = document.createElement('span');
      paramLabel.className = 'filter-param-label';
      paramLabel.textContent = paramDef.label;

      const paramValue = document.createElement('span');
      paramValue.className = 'filter-param-value';
      paramValue.textContent = filterInstance.params[paramDef.name];

      const paramInput = document.createElement('input');
      paramInput.type = 'range';
      paramInput.className = 'filter-param-slider';

      // Determine bounds
      if (paramDef.name === 'min' || paramDef.name === 'max') {
        // Use much wider bounds for filter min/max - can go beyond control range
        paramInput.min = (controlConfig.min ?? 0) - Math.abs(controlConfig.max - controlConfig.min);
        paramInput.max = (controlConfig.max ?? 100) + Math.abs(controlConfig.max - controlConfig.min);
        paramInput.value = filterInstance.params[paramDef.name];
      } else {
        paramInput.min = paramDef.min ?? 0.1;
        paramInput.max = paramDef.max ?? 10;
        paramInput.step = paramDef.step ?? 0.1;
        paramInput.value = filterInstance.params[paramDef.name];
      }

      // Settings button for this parameter (to adjust its min/max)
      const paramSettingsBtn = document.createElement('button');
      paramSettingsBtn.className = 'param-settings-btn';
      paramSettingsBtn.innerHTML = '⋯';
      paramSettingsBtn.title = 'Adjust range';

      // Mini settings panel for param bounds
      const paramBoundsPanel = document.createElement('div');
      paramBoundsPanel.className = 'param-bounds-panel';
      paramBoundsPanel.style.display = 'none';

      const boundsRow = document.createElement('div');
      boundsRow.className = 'param-bounds-row';

      const minInput = document.createElement('input');
      minInput.type = 'number';
      minInput.className = 'param-bound-input';
      minInput.value = paramInput.min;
      minInput.placeholder = 'min';

      const maxInput = document.createElement('input');
      maxInput.type = 'number';
      maxInput.className = 'param-bound-input';
      maxInput.value = paramInput.max;
      maxInput.placeholder = 'max';

      boundsRow.appendChild(minInput);
      boundsRow.appendChild(maxInput);
      paramBoundsPanel.appendChild(boundsRow);

      minInput.addEventListener('change', () => {
        paramInput.min = parseFloat(minInput.value);
      });
      maxInput.addEventListener('change', () => {
        paramInput.max = parseFloat(maxInput.value);
      });

      paramSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = paramBoundsPanel.style.display !== 'none';
        paramBoundsPanel.style.display = isOpen ? 'none' : 'flex';
      });

      paramInput.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        filterInstance.params[paramDef.name] = value;
        paramValue.textContent = Math.round(value * 100) / 100;
      });

      const topRow = document.createElement('div');
      topRow.className = 'filter-param-top-row';
      topRow.appendChild(paramLabel);
      topRow.appendChild(paramValue);
      topRow.appendChild(paramSettingsBtn);

      paramRow.appendChild(topRow);
      paramRow.appendChild(paramInput);
      paramRow.appendChild(paramBoundsPanel);
      container.appendChild(paramRow);

      paramInputs[paramDef.name] = paramInput;
    }
  }
}
