import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EmergencyMap.css';
import Navbar from './NavBar';

const BackIcon = () => (
  <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const LocateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    <circle cx="12" cy="12" r="9" strokeDasharray="4 2" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// User location: blue pulsing circle
const userLocationIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;
    background:#4A90D9;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 0 6px rgba(74,144,217,0.3);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Destination: red pin
const destIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:14px;height:14px;
    background:#e74c3c;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 2px 6px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function formatDistance(meters) {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
}

function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}min`;
}

const EmergencyMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [status, setStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const suggestTimer = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors & © CartoDB',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setStatus('Locating you…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        setIsLocating(false);
        setStatus('Location found. Now search for a destination.');

        if (mapInstanceRef.current) {
          if (userMarkerRef.current) userMarkerRef.current.remove();
          userMarkerRef.current = L.marker([lat, lng], { icon: userLocationIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('You are here')
            .openPopup();
          mapInstanceRef.current.setView([lat, lng], 15);
        }
      },
      (err) => {
        setIsLocating(false);
        setStatus(`Could not get location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Auto-locate on mount
  useEffect(() => {
    locateUser();
  }, [locateUser]);

  // Nominatim autocomplete
  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(suggestTimer.current);
    if (val.length < 3) { setSuggestions([]); return; }
    suggestTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&countrycodes=in`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    }, 400);
  };

  const clearRoute = () => {
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }
    setRouteInfo(null);
  };

  const handleSuggestionSelect = async (place) => {
    setSuggestions([]);
    setSearchQuery(place.display_name);
    const destLat = parseFloat(place.lat);
    const destLng = parseFloat(place.lon);

    if (!userLocation) {
      setStatus('Please enable location first to get directions.');
      return;
    }

    clearRoute();
    setIsRouting(true);
    setStatus('Calculating safest walking route…');

    // Place destination marker
    if (mapInstanceRef.current) {
      destMarkerRef.current = L.marker([destLat, destLng], { icon: destIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(place.display_name.split(',')[0])
        .openPopup();
    }

    try {
      const url =
        `https://router.project-osrm.org/route/v1/foot/` +
        `${userLocation.lng},${userLocation.lat};${destLng},${destLat}` +
        `?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.code !== 'Ok' || !data.routes?.length) {
        setStatus('No route found. Try a different destination.');
        setIsRouting(false);
        return;
      }

      const route = data.routes[0];
      const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

      if (mapInstanceRef.current) {
        routeLayerRef.current = L.polyline(coords, {
          color: '#4A90D9',
          weight: 5,
          opacity: 0.85,
        }).addTo(mapInstanceRef.current);

        mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [40, 40] });
      }

      setRouteInfo({
        distance: formatDistance(route.distance),
        duration: formatDuration(route.duration),
        destination: place.display_name.split(',')[0],
      });
      setStatus('');
    } catch (err) {
      setStatus('Routing failed. Please check your connection.');
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <div className="emergency-container">
      <header>
        <button className="back-btn" onClick={() => navigate('/')}>
          <BackIcon />
        </button>
        <h1 className="header-title">SAFEST PATH</h1>
      </header>

      <div className="map-container">
        {/* Search bar */}
        <div className="search-wrapper">
          <div className="search-row">
            <div className="search-input-wrap">
              <SearchIcon />
              <input
                type="text"
                className="search-input"
                placeholder="Search destination…"
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => searchQuery.length >= 3 && setSuggestions(suggestions)}
              />
            </div>
            <button
              className="locate-btn"
              onClick={locateUser}
              disabled={isLocating}
              title="Re-locate me"
            >
              <LocateIcon />
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((s) => (
                <li key={s.place_id} onClick={() => handleSuggestionSelect(s)}>
                  <strong>{s.display_name.split(',')[0]}</strong>
                  <span>{s.display_name.split(',').slice(1, 3).join(',')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Status message */}
        {(status || isRouting) && (
          <p className="map-status">{isRouting ? 'Calculating route…' : status}</p>
        )}

        {/* Route info card */}
        {routeInfo && (
          <div className="route-info-card">
            <div className="route-info-dest">{routeInfo.destination}</div>
            <div className="route-info-metrics">
              <span className="route-metric">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                {routeInfo.distance}
              </span>
              <span className="route-metric">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {routeInfo.duration} walking
              </span>
            </div>
          </div>
        )}

        <div ref={mapRef} id="emergency-map" />
      </div>

      <Navbar />
    </div>
  );
};

export default EmergencyMap;
