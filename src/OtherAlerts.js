import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './NavBar'; // Import the unified Navbar

// --- Self-Contained Assets ---

// 1. SVG Icons (replaces emojis and file imports)
const BackIcon = () => (
  <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
  </svg>
);
const EveTeasingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const MedicalIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L12 22M2 12L22 12"></path><rect x="9" y="9" width="6" height="6" rx="1"></rect></svg>;
const SafeZoneIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const WorkshopIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8l4 4-4 4M4 8h8M4 16h8"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const HelplineIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;

// 2. Built-in Modal Component (replaces ModalComponent import)
const ModalComponent = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onRequestClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button className="modal-close-btn" onClick={onRequestClose}>Close</button>
      </div>
    </div>
  );
};

// 3. Embedded CSS
const OtherAlertsStyles = () => <style>{`
  /* Main Page Container */
  .alert-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #1A1D2F;
    color: #F0F0F0;
    font-family: 'Poppins', sans-serif;
    padding: 1rem;
    padding-bottom: 100px;
  }

  /* Header */
  .alerts-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 1rem 0;
    margin-bottom: 1rem;
  }
  .back-btn {
    position: absolute;
    left: 0;
    background: #2A2D3F;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .back-btn:hover { background-color: #3a3e52; }
  .back-icon { width: 24px; height: 24px; stroke: #FFFFFF; }
  .header-title { font-size: 1.25rem; font-weight: 600; color: #FFFFFF; }

  /* Alert List */
  .alert-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .alert-card {
    background: #2A2D3F;
    border-radius: 15px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: 1px solid #3a3e52;
  }
  .alert-card:hover { 
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  .alert-icon-wrapper {
    background: rgba(0, 123, 255, 0.1);
    border-radius: 50%;
    width: 50px; height: 50px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .alert-icon-wrapper svg { width: 28px; height: 28px; stroke: #007BFF; }
  .alert-info h2 { font-size: 1.1rem; font-weight: 600; margin: 0 0 5px 0; color: #FFFFFF; }
  .alert-info p { font-size: 0.9rem; color: #B0B0B0; margin: 0; }

  /* Floating Action Button (FAB) */
  .add-alert-fab {
    position: fixed;
    bottom: 90px;
    right: 25px;
    width: 60px; height: 60px;
    border-radius: 50%;
    background: linear-gradient(45deg, #007BFF, #0056b3);
    color: white;
    font-size: 36px;
    font-weight: 300;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
    transition: transform 0.2s ease;
    z-index: 999;
  }
  .add-alert-fab:hover { transform: scale(1.05) rotate(90deg); }

  /* Modal Styling */
  .modal-backdrop {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 1001;
  }
  .modal-content {
    background: #2A2D3F;
    padding: 25px;
    border-radius: 15px;
    width: 90%;
    max-width: 450px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.4);
  }
  .modal-content h2 { font-size: 1.5rem; margin-top: 0; color: #FFFFFF; }
  .modal-content p { color: #B0B0B0; }
  .modal-content ul { list-style: none; padding: 0; }
  .modal-content li { background: #1A1D2F; padding: 10px; border-radius: 8px; margin-bottom: 8px; font-size: 0.9rem; }
  .modal-form label { display: block; margin-bottom: 10px; font-weight: 500; color: #B0B0B0;}
  .modal-form input, .modal-form textarea, .modal-content input {
    width: 100%;
    padding: 12px;
    background: #1A1D2F;
    border: 1px solid #444;
    border-radius: 8px;
    color: #FFFFFF;
    font-family: 'Poppins', sans-serif;
    margin-top: 5px;
    box-sizing: border-box;
  }
  .modal-form input:focus, .modal-form textarea:focus, .modal-content input:focus { outline: none; border-color: #007BFF; }
  .modal-form textarea { resize: vertical; min-height: 80px; }
  .modal-submit-btn, .modal-search-btn {
    width: 100%;
    padding: 12px;
    background: #007BFF;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    margin-top: 15px;
    transition: background-color 0.2s ease;
  }
  .modal-submit-btn:hover, .modal-search-btn:hover { background-color: #0056b3; }
  .modal-close-btn { 
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px solid #444;
    border-radius: 8px;
    color: #B0B0B0;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  .modal-close-btn:hover { background-color: #3a3e52; color: #FFFFFF; }
`}</style>;


// Hardcoded Data
const initialAlerts = [
  { type: "Eve Teasing Alert", icon: <EveTeasingIcon />, sendEmail: true },
  { type: "Medical Alert", icon: <MedicalIcon />, sendEmail: true },
  { type: "Safe Zone Nearby", icon: <SafeZoneIcon /> },
  { type: "Self-Defense Workshop", icon: <WorkshopIcon /> },
  { type: "Women's Helpline", icon: <HelplineIcon /> }
];

const hardcodedSafeZones = {
  "SRM": [{ name: "SRM University", address: "Kattankulathur, Chennai" }],
  "IIT": [{ name: "IIT Madras", address: "Guindy, Chennai" }],
};
const hardcodedWorkshops = [
  "Women's Safety & Self-Defense - Chennai",
  "Self-Defense Training - Bangalore",
];

// --- Main OtherAlerts Component ---
const OtherAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isAddAlert, setIsAddAlert] = useState(false);
  const [safeZoneSearch, setSafeZoneSearch] = useState("");
  const [safeZones, setSafeZones] = useState([]);

  const handleAlertClick = (selectedAlert) => {
    setCurrentAlert(selectedAlert); // Set the full alert object
    if (selectedAlert.type === "Self-Defense Workshop") {
      setCurrentAlert({ ...selectedAlert, details: hardcodedWorkshops.join("\n") });
    } else if (selectedAlert.type === "Women's Helpline") {
      setCurrentAlert({ ...selectedAlert, details: "Call 1091 for women's helpline" });
    }
    setIsAddAlert(false);
    setIsModalOpen(true);
  };

  const handleAddAlertClick = () => {
    setCurrentAlert({ type: "", details: "", icon: <EveTeasingIcon />, sendEmail: true });
    setIsAddAlert(true);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentAlert(null);
    setSafeZoneSearch("");
    setSafeZones([]);
  };
  
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const newAlert = {
      type: form.type.value,
      details: form.details.value,
      icon: <EveTeasingIcon />, // Default icon for custom alerts
      sendEmail: true,
    };
    // Here you would typically call an API like `sendAlertEmail(newAlert)`
    console.log("Sending alert:", newAlert);
    setAlerts([...alerts, newAlert]);
    handleModalClose();
  };

  const handleSafeZoneSearch = () => {
    const result = hardcodedSafeZones[safeZoneSearch.toUpperCase()] || [];
    setSafeZones(result);
  };

  const renderModalContent = () => {
    if (!currentAlert) return null;

    switch (currentAlert.type) {
      case "Safe Zone Nearby":
        return (
          <>
            <h2>{currentAlert.type}</h2>
            <input
              type="text"
              placeholder="Enter location (e.g., SRM, IIT)"
              value={safeZoneSearch}
              onChange={(e) => setSafeZoneSearch(e.target.value)}
            />
            <button className="modal-search-btn" onClick={handleSafeZoneSearch}>Search</button>
            <ul>
              {safeZones.length > 0 ? (
                safeZones.map((zone, index) => (
                  <li key={index}><strong>{zone.name}</strong> - {zone.address}</li>
                ))
              ) : (
                <p>No safe zones found for this query.</p>
              )}
            </ul>
          </>
        );
      case "Eve Teasing Alert":
      case "Medical Alert":
        return (
          <form className="modal-form" onSubmit={handleFormSubmit}>
            <h2>{currentAlert.type}</h2>
            <p>Enter details below to send an immediate alert.</p>
            <input type="hidden" name="type" defaultValue={currentAlert.type} />
            <label>Details:</label>
            <textarea name="details" required />
            <button type="submit" className="modal-submit-btn">Send Alert</button>
          </form>
        );
      default:
        if (isAddAlert) {
          return (
            <form className="modal-form" onSubmit={handleFormSubmit}>
              <h2>Add Custom Alert</h2>
              <label>Alert Type:</label>
              <input type="text" name="type" required />
              <label>Details:</label>
              <textarea name="details" required />
              <button type="submit" className="modal-submit-btn">Submit</button>
            </form>
          );
        }
        return (
          <>
            <h2>{currentAlert.type}</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{currentAlert.details}</p>
          </>
        );
    }
  };

  return (
    <>
      <OtherAlertsStyles />
      <div className="alert-container">
        <header className="alerts-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            <BackIcon />
          </button>
          <h1 className="header-title">Other Alerts</h1>
        </header>

        <div className="alert-list">
          {alerts.map((alert, index) => (
            <div key={index} className="alert-card" onClick={() => handleAlertClick(alert)}>
              <div className="alert-icon-wrapper">{alert.icon}</div>
              <div className="alert-info">
                <h2>{alert.type}</h2>
                <p>Tap to view details or send an alert</p>
              </div>
            </div>
          ))}
        </div>

        <button className="add-alert-fab" onClick={handleAddAlertClick}>+</button>

        <ModalComponent isOpen={isModalOpen} onRequestClose={handleModalClose}>
          {renderModalContent()}
        </ModalComponent>
        
        <Navbar />
      </div>
    </>
  );
};

export default OtherAlerts;
