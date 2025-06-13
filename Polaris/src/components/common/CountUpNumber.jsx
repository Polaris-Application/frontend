import React, { useEffect, useState, useRef } from 'react';
import { animate } from 'framer-motion';

/**
 * Animated number counter that smoothly counts to `value`.
 * @param {number} value       Final value to display.
 * @param {number} duration    Animation duration in seconds.
 * @param {function} format    Optional formatter function for the number.
 */
const CountUpNumber = ({ value = 0, duration = 2, format = (v) => v, mountDelay = 0 }) => {
  const [display, setDisplay] = useState(0);
  const [initialised, setInitialised] = useState(false);
  const prevValRef = useRef(0);

  useEffect(() => {
    // If this is the first time, optionally wait for mountDelay
    const start = () => {
      const controls = animate(prevValRef.current, value, {
        duration,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplay(Math.floor(latest)),
      });
      setInitialised(true);
      prevValRef.current = value;
      return controls;
    };

    let controls;
    if (!initialised && mountDelay > 0) {
      const t = setTimeout(() => {
        controls = start();
      }, mountDelay * 1000);
      return () => {
        clearTimeout(t);
        controls?.stop();
      };
    } else {
      controls = start();
      return () => controls.stop();
    }
  }, [value, duration]);

  return <span>{format(display)}</span>;
};

export default CountUpNumber; 