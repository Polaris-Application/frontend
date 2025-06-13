import React from 'react';

const BandsTable = ({ bands, onChange }) => {
  // Ensure bands are continuous: when one changes, update adjacent
  const handleChange = (idx, field, value) => {
    let newBands = bands.map((b, i) => ({ ...b }));
    if (field === 'from') {
      // Only allow changing the first band's 'from'
      if (idx === 0) {
        newBands[0].from = value;
        if (newBands.length > 1) newBands[0].to = Math.max(value, newBands[0].to);
      }
    } else if (field === 'to') {
      newBands[idx].to = value;
      if (idx + 1 < newBands.length) {
        newBands[idx + 1].from = value;
      }
    } else {
      newBands[idx][field] = value;
    }
    onChange(newBands);
  };

  return (
    <table className="bands-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginBottom: "6px"}}>
      <thead>
        <tr>
          <th style={{ width: '25%' }}>From</th>
          <th style={{ width: '25%' }}>To</th>
          <th style={{ width: '25%' }}>color</th>
          <th style={{ width: '25%' }}>Label</th>
        </tr>
      </thead>
      <tbody>
        {bands.map((band, idx) => (
          <tr key={idx}>
            <td style={{ padding: '6px' }}>
              <input
                type="number"
                value={band.from}
                onChange={(e) => handleChange(idx, 'from', Number(e.target.value))}
                style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center', margin: '0 auto', display: 'block' }}
                disabled={idx !== 0}
              />
            </td>
            <td style={{ padding: '6px' }}>
              <input
                type="number"
                value={band.to}
                onChange={(e) => handleChange(idx, 'to', Number(e.target.value))}
                style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center', margin: '0 auto', display: 'block' }}
                disabled={idx === bands.length - 1}
              />
            </td>
            <td style={{ padding: '6px', textAlign: 'center' }}>
              <div style={{ background: 'var(--color-input)', borderRadius: '6px', padding: '2px 4px', display: 'flex', justifyContent: 'center', alignItems: 'center' , height: "100%"}}>
                <input
                  type="color"
                  value={band.colour}
                  onChange={(e) => handleChange(idx, 'colour', e.target.value)}
                  style={{ height: '32px', margin: '0 auto', display: 'block', background: 'none', border: 'none', padding: 0 }}
                />
              </div>
            </td>
            <td style={{ padding: '6px' }}>
              <input
                type="text"
                value={band.label ?? ''}
                onChange={(e) => handleChange(idx, 'label', e.target.value)}
                placeholder="Label"
                style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center', margin: '0 auto', display: 'block' }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Helper for default bands per mode
const defaultBandsByMode = {
  strength: [
    { from: 0, to: 40, colour: '#00ff00', label: 'Excellent' },
    { from: 40, to: 60, colour: '#ffff00', label: 'Good' },
    { from: 60, to: 80, colour: '#ff9900', label: 'Fair' },
    { from: 80, to: 100, colour: '#ff0000', label: 'Poor' },
  ],
  quality: [
    { from: 0, to: 40, colour: '#00ff7f', label: 'Very Good' },
    { from: 40, to: 60, colour: '#ffd633', label: 'Good' },
    { from: 60, to: 80, colour: '#ff9900', label: 'Fair' },
    { from: 80, to: 100, colour: '#ff3333', label: 'Poor' },
  ],
};

export { defaultBandsByMode };
export default BandsTable;