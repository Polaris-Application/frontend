// Colour configuration helper functions (plain JS)

/** Validate a configuration object.
 *  Returns an array of human-readable error messages. Empty array ⇒ valid. */
export function validateConfig(cfg) {
  const errors = [];

  if (!cfg.bands || cfg.bands.length < 2) {
    errors.push('At least two colour bands are required.');
    return errors;
  }

  // Ensure bands are in ascending order (by `from`)
  const sorted = [...cfg.bands].sort((a, b) => a.from - b.from);
  sorted.forEach((band, idx) => {
    const { from, to, colour } = band;
    if (from >= to) {
      errors.push(`Band ${idx + 1} has invalid range (from >= to).`);
    }
    if (!/^#([0-9a-fA-F]{6})$/.test(colour)) {
      errors.push(`Band ${idx + 1} has invalid colour value.`);
    }
    if (idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      if (to !== next.from) {
        errors.push(`Gap/overlap between bands ${idx + 1} and ${idx + 2}.`);
      }
    }
  });

  return errors;
}

/** Given a band, split it into 2 halves (equal ranges).
 *  Returns `[firstHalf, secondHalf]`. */
export function splitBand(band) {
  const mid = (band.from + band.to) / 2;
  const first = { ...band, to: mid };
  const second = { ...band, from: mid };
  return [first, second];
}

export function generateDefaultConfig() {
  // Simple default gradient mirroring current Map implementation
  const bands = [
    { from: 0, to: 40, colour: '#00ff00', label: 'Excellent' },
    { from: 40, to: 60, colour: '#ffff00', label: 'Good' },
    { from: 60, to: 80, colour: '#ff9900', label: 'Fair' },
    { from: 80, to: 100, colour: '#ff0000', label: 'Poor' },
  ];
  return { mode: 'strength', bands };
} 