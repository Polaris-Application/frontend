import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import './MapViewToggle.css';

const options = [
  { label: 'Strength', val: 'power' },
  { label: 'Quality', val: 'quality' },
];

const MapColorToggle = ({ value = 'strength', onChange }) => (
  <LayoutGroup id="map-color-toggle">
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
              layoutId="toggle-bg-color"
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

export default MapColorToggle; 