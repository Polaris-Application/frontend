import React from 'react';
import { splitBand } from '../../utils/colourConfig.js';

const AddBandButton = ({ bands, onChange }) => {
  const handleAdd = () => {
    if (!bands.length) return;
    // Find band with largest range
    let idx = 0;
    let maxSpan = -Infinity;
    bands.forEach((b, i) => {
      const span = b.to - b.from;
      if (span > maxSpan) {
        maxSpan = span;
        idx = i;
      }
    });
    const [first, second] = splitBand(bands[idx]);
    // Ensure continuity: second.from = first.to
    second.from = first.to;
    // Insert and update bands
    const newBands = [...bands.slice(0, idx), first, second, ...bands.slice(idx + 1)];
    // Fix all bands to be continuous
    for (let i = 1; i < newBands.length; i++) {
      newBands[i].from = newBands[i - 1].to;
    }
    onChange(newBands);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => {
          if (bands.length <= 2) return;
          // Remove band with largest range
          let idx = 0;
          let maxSpan = -Infinity;
          bands.forEach((b, i) => {
            const span = b.to - b.from;
            if (span > maxSpan) {
              maxSpan = span;
              idx = i;
            }
          });
          const newBands = [...bands.slice(0, idx), ...bands.slice(idx + 1)];
          onChange(newBands);
        }}
        className="remove-band-btn"
        disabled={bands.length <= 2}
        title={bands.length <= 2 ? 'At least two bands required' : 'Remove band with largest range'}
      >
        Remove Band
      </button>
      <button type="button" onClick={handleAdd} className="add-band-btn">
        Add Band
      </button>
    </div>
  );
};

export default AddBandButton;