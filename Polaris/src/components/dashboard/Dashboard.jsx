import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import Map from '../charts/Map.jsx';
import MapViewToggle from '../common/MapViewToggle.jsx';
import MapColorToggle from '../common/MapColorToggle.jsx';
import CountUpNumber from '../common/CountUpNumber.jsx';
import ColourConfigurator from '../ColourConfigurator';
import { loadConfig, saveConfig } from '../../utils/persistence';
import './Dashboard.css';
import { IoIosSettings } from "react-icons/io";
import { MdUpdate, MdLoop } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import { getRelativeTime } from '../../utils/getReletiveTime.js';


const Dashboard = () => {
  const { user, logout } = useAuthContext();
  
  // Center position
  const centerLat = 35.7123;
  const centerLng = 51.4133;
  
  // Generate random value between min and max
  const getRandomValue = (min = 60, max = 95) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Create a path of points
  const createPathPoints = () => {
    const points = [];
    
    // Main vertical path near center
    for (let i = 0; i < 15; i++) {
      points.push([
        centerLat + (i * 0.0003) - 0.0015, // Offset slightly from center
        centerLng + (Math.sin(i * 0.8) * 0.0002), // Smaller sine wave
        getRandomValue()
      ]);
    }

    // Short horizontal path intersecting the vertical
    for (let i = 0; i < 10; i++) {
      points.push([
        centerLat - 0.0005, // Fixed latitude near center
        centerLng + (i * 0.0003) - 0.001, // Spread around center longitude
        getRandomValue()
      ]);
    }

    // Diagonal path
    for (let i = 0; i < 12; i++) {
      points.push([
        centerLat + (i * 0.0002) - 0.001,
        centerLng + (i * 0.0002) - 0.001,
        getRandomValue()
      ]);
    }

    return points;
  };

  const [, forceRender] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceRender((s) => s + 1); // Trigger re-render every second
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // State for heat map points with random values
  const [heatMapPoints, setHeatMapPoints] = useState(createPathPoints());

  const [colorMode, setColorMode] = useState("power")
  // Example mobile / event counts that increment over time to showcase animation
  const [mobileCount, setMobileCount] = useState(5);
  const [eventCount, setEventCount] = useState(1200);

  // Toggle between 'heatmap' and 'markers' view for the map
  const [mapView, setMapView] = useState('heatmap');

  // Colour configuration state (loaded from persistence)
  const [colourConfig, setColourConfig] = useState(loadConfig());

  const [showConfigurator, setShowConfigurator] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTimerRef = useRef(null);

  // Helper to get refresh time from config (default 1 min)
  const getRefreshTime = () => {
    // Use only allowed values: 60, 120, 300 (seconds)
    const allowed = [60, 120, 300];
    const val = Number(colourConfig.refreshTime);
    return allowed.includes(val) ? val : 60;
  };

  // Update function
  const doUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setHeatMapPoints(createPathPoints());
      setLastUpdated(new Date());
      setIsUpdating(false);
    }, 1000);
  };

  // Auto-refresh timer effect
  useEffect(() => {
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
    }
    if (!showConfigurator) {
      const scheduleUpdate = () => {
        updateTimerRef.current = setTimeout(() => {
          doUpdate();
          scheduleUpdate();
        }, getRefreshTime() * 1000);
      };
      scheduleUpdate();
    }
    return () => {
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colourConfig.refreshTime, showConfigurator]);

  const handleApplyConfig = (cfg) => {
    saveConfig(cfg);
    setColourConfig(cfg);
    setShowConfigurator(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value"><CountUpNumber value={mobileCount} mountDelay={1.6} /></span>
              <span className="stat-label">Mobile Devices</span>
            </div>
            <div className="stat-item">
              <span className="stat-value"><CountUpNumber value={eventCount} mountDelay={1.8} /></span>
              <span className="stat-label">Event Count</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="map-header">
            <div style={{height: "100%"}}>
              <h2 style={{marginBottom: '5px'}}>Signal Strength Map</h2>
              <p style={{marginBottom: '0px', marginTop: '2px', height: '100%'}} className="heat-map-info">Click on points to view detailed signal information</p>
            </div>
            <div className="toggle-stack">
              <MapViewToggle value={mapView} onChange={setMapView} />
              <MapColorToggle
                value={colorMode}
                onChange={(mode) => {
                  setColorMode(mode)
                }}
              />
              <div className='map-button-container'>
                {lastUpdated && (
                  <span className="last-updated-text" style={{ marginRight:"10px", marginTop: "5px", fontSize: '0.85rem', color: '#666' }}>
                    Updated {getRelativeTime(lastUpdated)}
                  </span>
                )}
                <button
                  className='map-update-button'
                  type="button"
                  onClick={doUpdate}
                  title="Refresh data"
                  disabled={isUpdating}
                >
                  <motion.div
                    animate={isUpdating ? { rotate: 360 } : { rotate: 0 }}
                    transition={isUpdating ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      transformOrigin: 'center center'
                    }}
                  >
                    {isUpdating ? <MdLoop size={22} /> : <MdUpdate size={22} />}
                  </motion.div>
                </button>
                <button className='map-settings-button'
                  type="button"
                  onClick={() => setShowConfigurator((s) => !s)}
                  title="Configure colours"
                >
                  <IoIosSettings size={22} />
                </button>
              </div>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {showConfigurator && (
              <motion.div
                key="configurator"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <ColourConfigurator
                  currentConfig={colourConfig}
                  onApply={handleApplyConfig}
                  onClose={() => setShowConfigurator(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Map 
            marginTop="10px"
            height="500px"
            width="100%" 
            points={heatMapPoints}
            center={[centerLat, centerLng]}
            zoom={16} // Increased zoom to better see the concentrated points
            view={mapView}
            colorMode={colorMode}
            colourConfig={colourConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;