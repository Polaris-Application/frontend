import React, { useEffect, useState } from 'react';
import { validateConfig, generateDefaultConfig } from '../../utils/colourConfig.js';
import BandsTable from './BandsTable';
import ModeSelector from './ModeSelector';
import AddBandButton from './AddBandButton';
import { defaultBandsByMode } from './BandsTable';
import './ColourConfigurator.css';

const ColourConfigurator = ({ mode, bands, onApply, onClose }) => {
  // Store separate configs for each mode
  const [modeBands, setModeBands] = useState({
    strength: mode === 'strength' ? bands : defaultBandsByMode.strength,
    quality: mode === 'quality' ? bands : defaultBandsByMode.quality,
  });
  const [draftConfig, setDraftConfig] = useState({ mode, bands, refreshTime: 10 });
  const [errors, setErrors] = useState([]);

  // Only update draftConfig when mode changes from parent (not on every modeBands change)
  useEffect(() => {
    setDraftConfig((c) => ({ ...c, mode, bands: modeBands[mode] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    setErrors(validateConfig(draftConfig));
  }, [draftConfig]);

  // When mode changes, save current bands to previous mode, switch to new mode's bands
  const handleModeChange = (m) => {
    setModeBands((prev) => ({ ...prev, [draftConfig.mode]: draftConfig.bands }));
    setDraftConfig((c) => ({ ...c, mode: m, bands: modeBands[m] || defaultBandsByMode[m] }));
  };

  const handleBandsChange = (newBands) => {
    setDraftConfig((c) => ({ ...c, bands: newBands }));
    setModeBands((prev) => ({ ...prev, [draftConfig.mode]: newBands }));
  };

  const handleRefreshTimeChange = (e) => {
    const value = Number(e.target.value);
    setDraftConfig((c) => ({ ...c, refreshTime: value }));
  };

  const handleReset = () => {
    setDraftConfig((c) => ({ ...c, bands: defaultBandsByMode[draftConfig.mode] }));
    setModeBands((prev) => ({ ...prev, [draftConfig.mode]: defaultBandsByMode[draftConfig.mode] }));
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
        <ModeSelector value={draftConfig.mode} onChange={handleModeChange} />
      </div>

      <div className="config-section">
        <h4>Bands</h4>
        <BandsTable bands={draftConfig.bands} onChange={handleBandsChange} />
        <AddBandButton bands={draftConfig.bands} onChange={handleBandsChange} />
      </div>

      {errors.length > 0 && (
        <div className="config-errors">
          <ul>
            {errors.map((e, i) => (
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