import React from 'react';
import useAnimationStore from '../store/animationStore';

const ControlFilter = ({ filter, property, index }) => {
  const { updateFilter, removeFilter } = useAnimationStore();
  
  const handleFilterChange = (filterProperty, value) => {
    updateFilter(property, index, filterProperty, value);
  };

  return (
    <div className="filter">
      <div className="filter-header">
        Filter {index + 1}: {filter.min} to {filter.max} @ {filter.frequency.toFixed(2)}Hz
      </div>
      
      <div className="control-row">
        <label>Min:</label>
        <input 
          type="range" 
          className="range-control"
          value={filter.min} 
          min={-200}
          max={filter.max}
          onChange={(e) => handleFilterChange('min', parseFloat(e.target.value))}
        />
        <span className="value">{Math.round(filter.min)}</span>
      </div>
      
      <div className="control-row">
        <label>Max:</label>
        <input 
          type="range" 
          className="range-control"
          value={filter.max} 
          min={filter.min}
          max={200}
          onChange={(e) => handleFilterChange('max', parseFloat(e.target.value))}
        />
        <span className="value">{Math.round(filter.max)}</span>
      </div>
      
      <div className="control-row">
        <label>Frequency:</label>
        <input 
          type="range" 
          className="range-control"
          value={filter.frequency * 100} 
          min={1}
          max={200}
          onChange={(e) => handleFilterChange('frequency', parseFloat(e.target.value) / 100)}
        />
        <span className="value">{filter.frequency.toFixed(2)}Hz</span>
      </div>
      
      <button 
        className="button button-reset" 
        style={{ marginTop: '5px', fontSize: '11px', padding: '3px 8px' }}
        onClick={() => removeFilter(property, index)}
      >
        Remove Filter
      </button>
    </div>
  );
};

export default ControlFilter;