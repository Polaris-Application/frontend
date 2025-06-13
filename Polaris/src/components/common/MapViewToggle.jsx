import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import './MapViewToggle.css';

const MapViewToggle = ({ value = 'heatmap', onChange }) => {
  const options = [
    { label: 'HeatMap', val: 'heatmap' },
    { label: 'Points', val: 'markers' },
  ];

  return (
    <LayoutGroup id="map-view-toggle">
      <div className="map-view-toggle">
        {options.map((opt) => (
          <button
            key={opt.val}
            type="button"
            className={`toggle-option ${opt.val} ${value === opt.val ? 'selected' : ''}`}
            onClick={() => onChange?.(opt.val)}
          >
            {value === opt.val && (
              <motion.span
                layoutId="toggle-bg"
                className={`toggle-bg ${opt.val}`}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="toggle-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
};

export default MapViewToggle; 