import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active styling

// --- SVG Icons (replaces image imports) ---

const HomeIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const NavigationIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);

const ProfileIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const AlertsIcon = () => (
   <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SafetyIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);


// --- Styles (replaces CSS import) ---

const NavbarStyles = () => (
  <style>{`
    /*
      IMPORTANT: To prevent content from being hidden behind the fixed navbar,
      add padding to the bottom of your main app container or body.
      For example, in your main App.css:
      
      .your-main-app-content-wrapper {
        padding-bottom: 80px; // Should be slightly more than the navbar height
      }
    */

    /* --- Main Navbar Container --- */
    .navbar {
      position: fixed;
      bottom: 15px; /* Float slightly above the bottom edge */
      left: 50%;
      transform: translateX(-50%);
      width: 95%; /* Don't stretch fully edge-to-edge on mobile */
      max-width: 450px; /* Max width for larger screens */
      background-color: #2A2D3F; /* Consistent dark theme color */
      display: flex;
      justify-content: space-around;
      align-items: center; /* Vertically center the content */
      height: 65px; /* Set a fixed height */
      padding: 0 10px; /* Horizontal padding */
      border-radius: 20px; /* Fully rounded corners */
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3); /* Deeper, more subtle shadow */
      border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border for glass effect */
      z-index: 1000;
    }

    /* --- Navigation Links --- */
    .nav-link {
      position: relative; /* Needed for the notification badge positioning */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #B0B0B0; /* Default muted color for inactive icons */
      font-size: 12px;
      font-weight: 500;
      font-family: 'Poppins', sans-serif; /* Consistent modern font */
      height: 100%;
      width: 100%;
      border-radius: 12px; /* Rounded corners for the active "pill" */
      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    /* --- Active State Styling (from NavLink) --- */
    .nav-link.active {
      color: #FFFFFF; /* Bright white for active text */
      background-color: rgba(0, 123, 255, 0.2); /* Subtle blue "pill" background */
    }
    
    .nav-link.active .nav-icon {
        stroke: #FFFFFF; /* Active icon color */
    }

    .nav-link:not(.active):hover {
      color: #FFFFFF; /* Highlight on hover for inactive icons */
    }

    .nav-link:not(.active):hover .nav-icon {
        stroke: #FFFFFF; /* Highlight icon on hover */
    }

    /* --- Icons and Text --- */
    .nav-icon {
      width: 26px;
      height: 26px;
      margin-bottom: 4px;
      stroke: #B0B0B0; /* Default icon color */
      transition: stroke 0.2s ease-in-out;
    }

    .nav-text {
      position: relative; /* Required for notification badge positioning */
      display: inline-flex; /* Align text and badge */
      align-items: center;
      justify-content: center;
    }

    /* --- Notification Badge --- */
    .notification-badge {
      position: absolute;
      top: -2px; /* Position it relative to the text */
      right: -8px;
      width: 8px;
      height: 8px;
      background-color: #E63946; /* High-visibility red */
      border-radius: 50%;
      border: 1.5px solid #2A2D3F; /* Match the navbar background for a "cutout" look */
    }
  `}</style>
);


// --- Main Navbar Component ---

const Navbar = () => {
  return (
    <>
      <NavbarStyles /> {/* Inject the styles into the document */}
      <nav className="navbar">
        <NavLink to="/" className="nav-link">
          <HomeIcon />
          <span className="nav-text">Home</span>
        </NavLink>

        <NavLink to="/navigation" className="nav-link">
          <NavigationIcon />
          <span className="nav-text">Navigation</span>
        </NavLink>

        <NavLink to="/profile" className="nav-link">
          <ProfileIcon />
          <span className="nav-text">Profile</span>
        </NavLink>

        <NavLink to="/other-alerts" className="nav-link">
          <AlertsIcon />
          <span className="nav-text">
            Alerts
            <span className="notification-badge"></span>
          </span>
        </NavLink>

        <NavLink to="/safetymeasures" className="nav-link">
          <SafetyIcon />
          <span className="nav-text">Safety</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;

