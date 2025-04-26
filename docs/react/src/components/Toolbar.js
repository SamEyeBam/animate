import React from 'react';
import { HexColorPicker } from 'react-colorful';
import useAnimationStore from '../store/animationStore';
import ControlFilter from './ControlFilter';

const Toolbar = ({ isVisible }) => {
  const { 
    selectedAnimation,
    setSelectedAnimation,
    animations,
    updateParameter,
    addFilter,
    paused,
    togglePause,
    resetAnimation,
    speedMultiplier,
  } = useAnimationStore();

  const currentAnimation = animations[selectedAnimation];
  
  const handleAnimationChange = (e) => {
    setSelectedAnimation(e.target.value);
  };

  const handleParameterChange = (property, value) => {
    updateParameter(property, value);
  };

  const renderControl = (control) => {
    const value = currentAnimation.parameters[control.property];
    
    switch (control.type) {
      case 'range':
        return (
          <div className="control-row" key={control.property}>
            <label htmlFor={`control-${control.property}`}>{control.label || control.property}:</label>
            <input
              id={`control-${control.property}`}
              type="range"
              min={control.min}
              max={control.max}
              step={1}
              value={value}
              onChange={(e) => handleParameterChange(control.property, parseFloat(e.target.value))}
              className="range-control"
            />
            <span className="value">{Math.round(value * 100) / 100}</span>
            
            <button 
              className="add-filter-button"
              onClick={() => addFilter(control.property)}
            >
              +
            </button>
          </div>
        );
        
      case 'color':
        return (
          <div className="control-container" key={control.property}>
            <label htmlFor={`control-${control.property}`}>{control.label || control.property}:</label>
            <div style={{ margin: '10px 0' }}>
              <div 
                style={{ 
                  width: '100%', 
                  height: '20px', 
                  background: value,
                  marginBottom: '5px',
                  border: '1px solid #444'
                }}
              />
              <HexColorPicker 
                color={value} 
                onChange={(color) => handleParameterChange(control.property, color)} 
              />
            </div>
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="control-row" key={control.property}>
            <label htmlFor={`control-${control.property}`}>{control.label || control.property}:</label>
            <input
              id={`control-${control.property}`}
              type="checkbox"
              checked={value}
              onChange={(e) => handleParameterChange(control.property, e.target.checked)}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderFilters = (property) => {
    const filters = currentAnimation.filters[property];
    if (!filters || filters.length === 0) return null;
    
    return (
      <div className="filter-container">
        <div className="filter-header">Filters</div>
        {filters.map((filter, index) => (
          <ControlFilter 
            key={`${property}-filter-${index}`}
            filter={filter}
            property={property}
            index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`toolbar ${isVisible ? '' : 'hidden'}`}>
      <h2>Animation Controls</h2>
      
      <div className="control-container">
        <label htmlFor="animation-selector">Animation:</label>
        <select
          id="animation-selector"
          value={selectedAnimation}
          onChange={handleAnimationChange}
          className="shape-selector"
        >
          {Object.keys(animations).map(animName => (
            <option key={animName} value={animName}>{animName}</option>
          ))}
        </select>
      </div>
      
      <div className="control-container">
        <button 
          className="button"
          onClick={togglePause}
        >
          {paused ? 'Play' : 'Pause'}
        </button>
        <button 
          className="button button-reset"
          onClick={resetAnimation}
        >
          Reset
        </button>
      </div>
      
      <div className="control-row">
        <label htmlFor="speed-multiplier">Speed:</label>
        <input
          id="speed-multiplier"
          type="range"
          min={1}
          max={500}
          value={speedMultiplier}
          onChange={(e) => useAnimationStore.setState({ speedMultiplier: parseInt(e.target.value) })}
          className="range-control"
        />
        <span className="value">{speedMultiplier}</span>
      </div>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h3>Parameters</h3>
      {currentAnimation.config.map(control => (
        <React.Fragment key={control.property}>
          {renderControl(control)}
          {renderFilters(control.property)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Toolbar;