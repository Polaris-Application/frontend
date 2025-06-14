import React from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import './ModeSelector.css';

const options = [
  { label: 'Strength', val: 'power' },
  { label: 'Quality', val: 'quality' },
];

const ModeSelector = ({ value, onChange }) => (
  <LayoutGroup id="mode-selector">
    <div className="mode-selector">
      {options.map((opt) => (
        <button
          key={opt.val}
          type="button"
          className={`toggle-option ${value === opt.val ? 'selected' : ''}`}
          onClick={() => onChange?.(opt.val)}
        >
          {value === opt.val && (
            <motion.span
              layoutId="mode-toggle-bg"
              className="toggle-bg"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="toggle-label">{opt.label}</span>
        </button>
      ))}
    </div>
  </LayoutGroup>
);

export default ModeSelector; 