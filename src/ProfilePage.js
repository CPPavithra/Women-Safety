import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './NavBar'; // Import the unified Navbar
import { useNavigate } from 'react-router-dom';

// --- Self-Contained Assets ---

// 1. SVG Icons
const BackIcon = () => (
  <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
  </svg>
);
const DefaultUserIcon = () => (
  <svg className="profile-picture-placeholder-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);
const EditIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
  </svg>
);
const LogoutIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
  </svg>
);

// 2. Embedded CSS
const ProfilePageStyles = () => (
  <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

  .profile-container {
    min-height: 100vh;
    background-color: #1A1D2F;
    color: #F0F0F0;
    font-family: 'Poppins', sans-serif;
    padding: 1rem 1rem 100px 1rem;
    box-sizing: border-box;
  }
  .profile-header {
    width: 100%; display: flex; align-items: center; justify-content: center;
    position: relative; padding: 1rem 0;
  }
  .back-btn {
    position: absolute; left: 0; background: #2A2D3F;
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50%;
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background-color 0.2s ease;
  }
  .back-btn:hover { background-color: #3a3e52; }
  .back-icon { width: 24px; height: 24px; stroke: #FFFFFF; }
  .header-title { font-size: 1.25rem; font-weight: 600; color: #FFFFFF; }
  
  .profile-picture-section {
    display: flex; flex-direction: column; align-items: center;
    margin: 1.5rem 0 2.5rem 0;
  }
  .profile-picture-wrapper {
    position: relative;
    width: 140px; height: 140px;
  }
  .profile-picture {
    width: 100%; height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #007BFF;
  }
  .profile-picture-placeholder {
    width: 100%; height: 100%;
    border-radius: 50%;
    background: #2A2D3F;
    border: 3px solid #444;
    display: flex; align-items: center; justify-content: center;
  }
  .profile-picture-placeholder-svg {
    width: 80px; height: 80px;
    stroke: #B0B0B0;
  }
  #file-upload {
    display: none;
  }
  .profile-edit-btn {
    position: absolute;
    bottom: 5px; right: 5px;
    background: #007BFF;
    border-radius: 50%;
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    border: 2px solid #1A1D2F;
    transition: background-color 0.2s ease;
  }
  .profile-edit-btn:hover { background-color: #0056b3; }
  .profile-edit-btn svg { width: 20px; height: 20px; stroke: white; }

  .profile-form {
    width: 100%; max-width: 500px;
    margin: 0 auto;
  }
  .profile-form h3 {
    font-size: 1.2rem;
    font-weight: 500;
    color: #007BFF;
    margin-top: 1.5rem; margin-bottom: 1rem;
    border-bottom: 1px solid #444;
    padding-bottom: 5px;
  }
  .profile-form label {
    display: block;
    font-size: 0.9rem;
    color: #B0B0B0;
    margin-bottom: 8px;
  }
  .profile-form input[type="text"],
  .profile-form textarea {
    width: 100%;
    padding: 12px;
    background: #2A2D3F;
    border: 1px solid #444;
    border-radius: 8px;
    color: #FFFFFF;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    margin-bottom: 1rem;
    box-sizing: border-box; /* Important */
    transition: border-color 0.2s ease;
  }
  .profile-form input[type="text"]:focus,
  .profile-form textarea:focus {
    outline: none;
    border-color: #007BFF;
  }
  .profile-form textarea {
    min-height: 100px;
    resize: vertical;
  }
  .contact-group { margin-bottom: 1rem; }
  .contact-group input[type="text"] { margin-bottom: 8px; }

  .profile-actions {
    display: flex; flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    margin: 2rem auto 0 auto;
  }
  .save-btn {
    padding: 15px;
    background: #007BFF;
    color: white; border: none;
    border-radius: 8px; font-weight: 600;
    font-size: 1rem; cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .save-btn:hover { background-color: #0056b3; }
  .logout-btn {
    padding: 14px;
    background: #2A2D3F;
    color: #E63946;
    border: 1px solid #E63946;
    border-radius: 8px;
    font-weight: 600; font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 8px;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  .logout-btn:hover { background-color: #E63946; color: white; }
  .logout-btn svg { width: 18px; stroke: currentColor; }
  `}</style>
);

// --- Main ProfilePage Component ---

const serverUrl = 'https://she-curity.onrender.com';

function ProfilePage() {
  const [profilePicture, setProfilePicture] = useState(''); // Stores the URL for display
  const [profileFile, setProfileFile] = useState(null); // Stores the new File object for upload
  const [name, setName] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [contact1, setContact1] = useState({ name: '', phone: '' });
  const [contact2, setContact2] = useState({ name: '', phone: '' });
  const [contact3, setContact3] = useState({ name: '', phone: '' });
  const navigate = useNavigate();

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/get-profile`);
        const data = response.data;
        // Prepend server URL to the relative path
        setProfilePicture(data.profilePicture ? `${serverUrl}/${data.profilePicture}` : '');
        setName(data.name || '');
        setMedicalInfo(data.medicalInfo || '');
        setContact1(data.contacts[0] || { name: '', phone: '' });
        setContact2(data.contacts[1] || { name: '', phone: '' });
        setContact3(data.contacts[2] || { name: '', phone: '' });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file); // Store the actual file for upload
      setProfilePicture(URL.createObjectURL(file)); // Set local preview URL
    }
  };

  const handleSave = async () => {
    let profilePicturePath = ''; // This will be the relative path sent to the backend

    try {
      // Step 1: Upload new picture IF one was selected
      if (profileFile) {
        const formData = new FormData();
        formData.append('profilePicture', profileFile);

        const uploadResponse = await axios.post(`${serverUrl}/api/upload-profile-picture`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profilePicturePath = uploadResponse.data.filePath; // Get new relative path
      } else if (profilePicture) {
        // No new file, send back the old path (strip the server URL)
        profilePicturePath = profilePicture.replace(`${serverUrl}/`, '');
      }

      // Step 2: Save all profile data
      const profileData = {
        name,
        medicalInfo,
        contacts: [contact1, contact2, contact3],
        profilePicture: profilePicturePath,
      };

      const saveResponse = await axios.post(`${serverUrl}/api/save-profile`, profileData);
      alert(saveResponse.data.message || 'Profile saved successfully!');

    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    }
  };

  const handleLogout = () => {
    // You would clear any auth tokens here
    // e.g., localStorage.removeItem('authToken');
    alert('Logged out successfully.');
    navigate('/'); // Navigate to login or home page
  };

  return (
    <>
      <ProfilePageStyles />
      <div className="profile-container">
        <header className="profile-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            <BackIcon />
          </button>
          <h1 className="header-title">Your Profile</h1>
        </header>

        <div className="profile-picture-section">
          <div className="profile-picture-wrapper">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-picture-placeholder">
                <DefaultUserIcon />
              </div>
            )}
            <label htmlFor="file-upload" className="profile-edit-btn">
              <EditIcon />
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={handlePictureChange} />
          </div>
        </div>

        <div className="profile-form">
          <h3>Personal Info</h3>
          <label htmlFor="name-input">Name</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <label htmlFor="medical-input">Medical Information</label>
          <textarea
            id="medical-input"
            value={medicalInfo}
            onChange={(e) => setMedicalInfo(e.target.value)}
            placeholder="e.g., Blood type, allergies..."
          ></textarea>

          <h3>Emergency Contacts</h3>
          <div className="contact-group">
            <label>Contact 1</label>
            <input
              type="text"
              value={contact1.name}
              onChange={(e) => setContact1({ ...contact1, name: e.target.value })}
              placeholder="Contact 1 Name"
            />
            <input
              type="text"
              value={contact1.phone}
              onChange={(e) => setContact1({ ...contact1, phone: e.target.value })}
              placeholder="Contact 1 Phone"
            />
          </div>
          <div className="contact-group">
            <label>Contact 2</label>
            <input
              type="text"
              value={contact2.name}
              onChange={(e) => setContact2({ ...contact2, name: e.g.target.value })}
              placeholder="Contact 2 Name"
            />
            <input
              type="text"
              value={contact2.phone}
              onChange={(e) => setContact2({ ...contact2, phone: e.g.target.value })}
              placeholder="Contact 2 Phone"
            />
          </div>
          <div className="contact-group">
            <label>Contact 3</label>
            <input
              type="text"
              value={contact3.name}
              onChange={(e) => setContact3({ ...contact3, name: e.g.target.value })}
              placeholder="Contact 3 Name"
            />
            <input
              type="text"
              value={contact3.phone}
              onChange={(e) => setContact3({ ...contact3, phone: e.g.target.value })}
              placeholder="Contact 3 Phone"
            />
          </div>

          <div className="profile-actions">
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout <LogoutIcon />
            </button>
          </div>
        </div>
        
        <Navbar />
      </div>
    </>
  );
}

export default ProfilePage;
