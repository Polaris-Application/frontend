import React, { useEffect, useState } from 'react';
import { validateConfig, generateDefaultConfig } from '../../utils/colourConfig.js';
import BandsTable from './BandsTable';
import ModeSelector from './ModeSelector';
import AddBandButton from './AddBandButton';
import { defaultBandsByMode } from './BandsTable';
import './ColourConfigurator.css';

const ColourConfigurator = ({currentConfig, onApply, onClose }) => {
  // Store separate configs for each mode
  const [editMode, setEditMode] = useState("power") 

  const [draftConfig, setDraftConfig] = useState(currentConfig);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setErrors(validateConfig(draftConfig));
  }, [draftConfig]);

  // When mode changes, save current bands to previous mode, switch to new mode's bands
  const handleModeChange = (m) => {
    setEditMode(m);
  };

  const handleBandsChange = (newBands) => {
    setDraftConfig((c) => ({
      ...c,
      mode: {
        ...c.mode,
        [editMode]: newBands,
      },
    }));
  };

  const handleRefreshTimeChange = (e) => {
    const value = Number(e.target.value);
    setDraftConfig((c) => ({ ...c, refreshTime: value }));
  };

  const handleReset = () => {
    setDraftConfig((c) => ({
      ...c,
      mode: {
        ...c.mode,
        [editMode]: defaultBandsByMode[editMode],
      },
    }));
  };

  const handleApply = () => {
    const errs = validateConfig(draftConfig);
    if (errs.length === 0) {
      onApply(draftConfig);
    } else {
      setErrors(errs);
    }
  };

  return (
    <div className="colour-configurator">
      <header className="config-header">
        <h3 style={{ margin: 0 }}>Colour Configuration</h3>
        {onClose && (
          <button className="close-btn" onClick={onClose}>&times;</button>
        )}
      </header>

      <div className="config-section">
        <label htmlFor="refresh-time" style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Refresh Interval</label>
        <select
          id="refresh-time"
          value={draftConfig.refreshTime ?? 60}
          onChange={handleRefreshTimeChange}
          style={{ width: '100%', boxSizing: 'border-box', marginBottom: 12, padding: 6, borderRadius: 4, border: '1px solid var(--color-border)' }}
        >
          <option value={60}>1 minute</option>
          <option value={120}>2 minutes</option>
          <option value={300}>5 minutes</option>
        </select>
      </div>

      <div className="config-section">
        <h4>Mode</h4>
        <ModeSelector value={editMode} onChange={handleModeChange} />
      </div>

      <div className="config-section">
        <h4>Bands</h4>
        <BandsTable cfg={draftConfig} editMode={editMode} onChange={handleBandsChange} />
        <AddBandButton cfg={draftConfig} editMode={editMode} onChange={handleBandsChange} />
      </div>

      {errors.length > 0 && (
        <div className="config-errors">
          <ul>
            {errors
            .filter(([mode, e], _) => mode == editMode)
            .map(([_, e], i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="config-action-bar">
        <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
        <button
          type="button"
          onClick={handleApply}
          disabled={errors.length > 0}
          className="apply-btn"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default ColourConfigurator;