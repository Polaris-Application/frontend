import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import 'leaflet.heat';
import { useLocationData } from '../../hooks/useLocationData';

// A dedicated component to render / update the heat-map layer. Using a child
// component lets us grab the Leaflet map instance via the `useMap` hook instead
// of poking at DOM internals ( _leaflet_map ).

// Calculate distance between two points
const getDistance = (latlng, point) => {
  const lat1 = latlng.lat || latlng[0];
  const lng1 = latlng.lng || latlng[1];
  const [lat2, lng2] = point;
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
};

// Helper function to find nearest point
const findNearestPoint = (latlng, points) => {
  let nearest = null;
  let minDist = Infinity;
  points.forEach((point, idx) => {
    const dist = getDistance(latlng, point);
    if (dist < minDist) {
      minDist = dist;
      nearest = [point, idx];
    }
  });
  return nearest;
};

// Create popup content
const createPopupContent = (point, rawData, qualityLabel = null, powerLabel = null) => {
  // point: [lat, lng, value], rawData: original object
  if (!rawData) {
    // fallback to old behavior
    const [lat, lng, value] = point;
    const quality =
      value >= 80 ? 'Very Good' : value >= 60 ? 'Good' : value >= 40 ? 'Fair' : 'Poor';
    return `
      <div style="font-family: monospace; font-size: 12px;">
        <strong>Signal Information</strong><br/>
        ----------------------<br/>
        Time: ${new Date().toLocaleString()}<br/>
        Loc: (${lat.toFixed(6)}, ${lng.toFixed(6)})<br/>
        Quality: ${value.toFixed(1)} [${quality}]<br/>
        ----------------------<br/>
      </div>
    `;
  }
  // Show all fields from rawData
  return `
    <div style="font-family: monospace; font-size: 12px;">
      <strong>Signal Information</strong><br/>
      ----------------------<br/>
      User: ${rawData.user}<br/>
      Time: ${rawData.timestamp}<br/>
      Lat: ${rawData.latitude}<br/>
      Lng: ${rawData.longitude}<br/>
      PLMN: ${rawData.plmn_id}<br/>
      TAC/LAC: ${rawData.tac_lac}<br/>
      Cell ID: ${rawData.cell_id}<br/>
      Band: ${rawData.band}<br/>
      ARFCN: ${rawData.arfcn}<br/>
      Network: ${rawData.network_type}<br/>
      Power: ${rawData.power} ${powerLabel ? "(" + powerLabel + ")" : ""}<br/>
      RSRP: ${rawData.rsrp}<br/>
      RSRQ: ${rawData.rsrq}<br/>
      RSSI: ${rawData.rssi}<br/>
      RSCP: ${rawData.rscp}<br/>
      Quality: ${rawData.quality} ${qualityLabel ? "(" + qualityLabel + ")" : ""}<br/>
      ----------------------<br/>
    </div>
  `;
};

// Helper to get the value for coloring based on mode
const getValueForMode = (data, mode) => {
  if (mode === 'power') {
    return data.power !== null ? parseFloat(data.power) : 0;
  } else if (mode === 'quality') {
    return data.quality !== null ? parseFloat(data.quality) : 0;
  }
  return 0;
};

const createGradientFromConfig = (bands) => {
  if (!bands || bands.length === 0) return null;
  // Map band value ranges to gradient stops (0-1), but keep color mapping by value in getBandColour
  const entries = bands.map((b, i) => {
    const ratio = i / (bands.length - 1);
    return [ratio, b.colour];
  });
  return Object.fromEntries(entries);
};

const getBandColour = (val, colorMode, cfg) => {
  if (!cfg) return undefined;
  const band = cfg.mode[colorMode].find((b) => val >= b.from && val < b.to) || cfg.mode[colorMode][cfg.mode[colorMode].length - 1];
  return [band?.colour];
};

const getBandLabel = (data, cfg) => {
  if (!cfg) return undefined;
  const power = data.power !== null ? parseFloat(data.power) : 0;
  const quality = data.quality !== null ? parseFloat(data.quality) : 0;
  const powerLabel = cfg.mode["power"].find((b) => power >= b.from && power < b.to) || cfg.mode["power"][cfg.mode["power"].length - 1]
  const qualityLabel = cfg.mode["quality"].find((b) => quality >= b.from && quality < b.to) || cfg.mode["quality"][cfg.mode["quality"].length - 1]
  return [powerLabel?.label, qualityLabel?.label];
};

const HeatmapLayer = ({ points, rawDataList, colorMode, colourConfig }) => {
  const map = useMap();
  const gradientFromConfig = useMemo(() => createGradientFromConfig(colourConfig.mode[colorMode]), [colourConfig, colorMode]);

  useEffect(() => {
    if (!map || !points.length) return;
    map.eachLayer((layer) => {
      if (layer.options && layer.options.isHeatmap) {
        map.removeLayer(layer);
      }
    });
    // Use the actual value for intensity, normalized to the band range
    let min = Infinity, max = -Infinity;
    points.forEach(([, , value]) => {
      if (value < min) min = value;
      if (value > max) max = value;
    });
    const heatData = points.map(([lat, lng, value]) => {
      // Normalize to band range if bands exist
      let intensity = 0.5;
      if (colourConfig && colourConfig.bands && colourConfig.bands.length > 0) {
        const bandMin = colourConfig.bands[0].from;
        const bandMax = colourConfig.bands[colourConfig.bands.length - 1].to;
        intensity = (value - bandMin) / (bandMax - bandMin || 1);
        intensity = Math.max(0, Math.min(1, intensity));
      }
      return [lat, lng, intensity];
    });
    const heat = L.heatLayer(heatData, {
      radius: 20,
      blur: 15,
      maxZoom: 18,
      max: 1.0,
      gradient: gradientFromConfig,
      isHeatmap: true,
    }).addTo(map);
    const handleClick = (e) => {
      const [nearestPoint, idx] = findNearestPoint(e.latlng, points);
      const [powerLabel, qualityLabel] = getBandLabel(rawDataList[idx], colourConfig)
      if (nearestPoint && getDistance(e.latlng, nearestPoint) < 0.001) {
        L.popup()
          .setLatLng([nearestPoint[0], nearestPoint[1]])
          .setContent(createPopupContent(nearestPoint, rawDataList[idx], qualityLabel, powerLabel))
          .openOn(map);
      }
    };
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
      map.removeLayer(heat);
    };
  }, [map, points, colorMode, gradientFromConfig, colourConfig]);
  return null;
};

// Marker layer: renders individual points without meshing them together
const MarkersLayer = ({ points, colorMode, colourConfig, rawDataList }) => {
  const getColor = (val) => {
    if (colourConfig) {
      return getBandColour(val, colorMode, colourConfig);
    }
    return ['#00ff00', 'No Label']; // fallback
  };
  return (
    <>
      {points.map(([lat, lng, value], idx) => {
        const color = getColor(value);
        const rawData = rawDataList && rawDataList[idx];
        const [powerLabel, qualityLabel] = getBandLabel(rawData, colourConfig); 
        return (
          <CircleMarker
            key={idx}
            center={[lat, lng]}
            radius={6}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }}
          >
            <Popup>
              <div dangerouslySetInnerHTML={{ __html: createPopupContent([lat, lng, value], rawData, qualityLabel, powerLabel) }} />
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
};

const Map = ({
  center = [35.7123, 51.4133],
  zoom = 15,
  height = '400px',
  width = '100%',
  view = 'markers', // 'heatmap' | 'markers'
  colorMode = 'power', // 'power' | 'quality'
  colourConfig = null,
  marginTop = '0px', // margin-top for the map container
  // Update: set default to 1 minute (60000 ms)
  refreshInterval = 60000, // ms, options: 60000 (1 min), 120000 (2 min), 300000 (5 min)
}) => {
  const { data: locationData, loading, error } = useLocationData(refreshInterval);
  // Map data to [lat, lng, value] based on colorMode
  const points = useMemo(() => {
    if (!locationData || !Array.isArray(locationData)) return [];
    return locationData.map(d => [
      parseFloat(d.latitude),
      parseFloat(d.longitude),
      getValueForMode(d, colorMode)
    ]);
  }, [locationData, colorMode]);
  return (
    <div style={{ height, width, marginTop }}>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Base map without labels */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        {/* Overlay tile layer that contains only labels; we bump brightness via CSS */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          className="map-labels-tile"
        />
        {/* Dynamic overlay based on selected view */}
        {view === 'heatmap' ? (
          <HeatmapLayer points={points} rawDataList={locationData} colorMode={colorMode} colourConfig={colourConfig} />
        ) : (
          <MarkersLayer points={points} colorMode={colorMode} colourConfig={colourConfig} rawDataList={locationData} />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;