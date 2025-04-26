import { useState, useMemo, useCallback } from 'react';
import { button, buttonGroup, folder, monitor } from 'leva';
import { applyFilters, getDefaultFilterParams, FILTER_TYPES } from './filters';

/**
 * Custom hook to manage a numeric control value with additive filters in Leva.
 *
 * @param {string} key - A unique key for this control (used in Leva schema).
 * @param {number} initialValue - The initial base value.
 * @param {object} options - Leva control options (min, max, step, label, etc.).
 * @returns {[Function, object]} A tuple containing:
 *   - A function `getFilteredValue(time)` that returns the value with filters applied for the given time.
 *   - A Leva schema fragment for this control and its filters.
 */
export function useFilteredControl(key, initialValue, options = {}) {
  const [baseValue, setBaseValue] = useState(initialValue);
  const [filters, setFilters] = useState([]);

  const label = options.label || key;

  // --- Filter Management Functions --- 
  const addFilter = useCallback((type) => {
    const newFilter = {
      id: Date.now() + Math.random(),
      type: type,
      ...getDefaultFilterParams(type),
    };
    setFilters((prev) => [...prev, newFilter]);
  }, []);

  const removeFilter = useCallback((id) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFilter = useCallback((id, newParams) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...newParams } : f))
    );
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  // --- Leva Schema Generation --- 
  const schema = useMemo(() => {
    const controlSchema = {};

    // 1. Base Value Slider
    controlSchema[key] = {
      ...options,
      value: baseValue,
      label: `Base ${label}`,
      onChange: setBaseValue,
    };

    // 2. Filters Folder
    const filterControls = {};
    // Prefix keys with the control key to ensure uniqueness
    filterControls[`${key}_Add Filter`] = buttonGroup({
      // Dynamically create buttons for available filter types
      ...Object.entries(FILTER_TYPES).reduce((acc, [name, type]) => {
        acc[name] = () => addFilter(type);
        return acc;
      }, {}),
    });
    filterControls[`${key}_Applied`] = monitor(filters.length, { graph: false });
    filterControls[`${key}_Clear`] = button(clearFilters, {
      label: 'Clear All',
      disabled: filters.length === 0
    });

    // 3. Individual Filter Controls
    filters.forEach((filter, index) => {
      const filterKey = `${key}_filter_${filter.id}`;
      const filterFolderContent = {};

      filterFolderContent[`type_${filter.id}`] = {
        value: filter.type,
        options: Object.values(FILTER_TYPES),
        label: 'Type',
        onChange: (newType) => updateFilter(filter.id, { type: newType, ...getDefaultFilterParams(newType) }),
      };

      // Common Amplitude Control (adjust range based on param if needed)
      filterFolderContent[`amp_${filter.id}`] = {
        value: filter.amplitude,
        min: 0,
        max: options.max ? options.max * 0.5 : 50, // Example: Max amplitude is half of base max
        step: (options.max ? options.max * 0.5 : 50) / 100, // Example step
        label: 'Amplitude',
        onChange: (v) => updateFilter(filter.id, { amplitude: v }),
      };

      // Common Frequency Control
      filterFolderContent[`freq_${filter.id}`] = {
        value: filter.frequency,
        min: 0.1,
        max: 10,
        step: 0.1,
        label: 'Frequency',
        onChange: (v) => updateFilter(filter.id, { frequency: v }),
      };

      filterFolderContent[`remove_${filter.id}`] = button(() => removeFilter(filter.id), { label: 'Remove' });

      // Add the folder for this specific filter
      filterControls[filterKey] = folder(filterFolderContent, {
        collapsed: true,
        label: `${label} Filter ${index + 1} (${filter.type})`,
      });
    });

    // Add the main filters folder under the base control's key
    controlSchema[`${label} Filters`] = folder(filterControls);

    return controlSchema;

  }, [key, label, options, baseValue, filters, addFilter, removeFilter, updateFilter, clearFilters]);

  // --- Filtered Value Calculation --- 
  const getFilteredValue = useCallback((time) => {
    // Ensure baseValue is treated as a number
    const numericBaseValue = Number(baseValue);
    if (isNaN(numericBaseValue)) {
        console.warn(`Base value for ${key} is not a number:`, baseValue);
        return 0; // Or initialValue
    }
    const filtered = applyFilters(numericBaseValue, filters, time);
    // Optional: Clamp the filtered value to the original min/max if desired
    if (options.min !== undefined && options.max !== undefined) {
        return Math.max(options.min, Math.min(filtered, options.max));
    }
    return filtered;
  }, [baseValue, filters, key, options.min, options.max]);

  return [getFilteredValue, schema];
}
