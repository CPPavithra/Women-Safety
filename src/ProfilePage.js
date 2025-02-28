import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';
import homeIcon from './images/home.png';
import { sendAlertEmail } from "./emailService";
import navigationIcon from './images/navigation.jpg';
import profileIcon from './images/profile.png';
import otherAlertsIcon from "./images/other_alerts.png"; // Replace with actual image path
import { startVideoRecording } from "./recordvideo.js";
import safetyIcon from "./images/safety.png"; // Replace with actual image path
import { Link } from 'react-router-dom';

function ProfilePage() {
    const [profilePicture, setProfilePicture] = useState('');
    const [name, setName] = useState('');
    const [medicalInfo, setMedicalInfo] = useState('');
    const [contact1, setContact1] = useState({ name: '', phone: '' });
    const [contact2, setContact2] = useState({ name: '', phone: '' });
    const [contact3, setContact3] = useState({ name: '', phone: '' });

    // Fetch profile data when the component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('https://she-curity.onrender.com/api/get-profile');
                const data = response.data;

                setProfilePicture(data.profilePicture || '');
                setName(data.name || '');
                setMedicalInfo(data.medicalInfo || '');
                setContact1(data.contacts[0] || { name: '', phone: '' });
                setContact2(data.contacts[1] || { name: '', phone: '' });
                setContact3(data.contacts[2] || { name: '', phone: '' });
            } catch (error) {
                console.error('Error fetching profile data:', error);
                alert('Failed to fetch profile data.');
            }
        };

        fetchProfileData();
    }, []);

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            // Upload the profile picture if one is selected
            let profilePicturePath = profilePicture;
            if (profilePicture && !profilePicture.startsWith('http')) {
                const formData = new FormData();
                formData.append('profilePicture', profilePicture);

                const uploadResponse = await axios.post('https://she-curity.onrender.com/api/upload-profile-picture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                profilePicturePath = uploadResponse.data.filePath;
            }

            // Save the profile data
            const profileData = {
                name,
                medicalInfo,
                contacts: [
                    contact1,
                    contact2,
                    contact3,
                ],
                profilePicture: profilePicturePath,
            };

            const saveResponse = await axios.post('https://she-curity.onrender.com/api/save-profile', profileData);

            alert(saveResponse.data.message);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile.');
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-picture">
                        {profilePicture && (profilePicture.startsWith('http') ? (
                            <img src={`http://localhost:5000${profilePicture}`} alt="Profile" />
                        ) : (
                            <img src={profilePicture} alt="Profile" />
                        ))}
                            <label for="file-upload" class="custom-file-upload">
                                                    Choose File
                                                                    </label>
                                    <input id="file-upload" type="file" onChange={handlePictureChange} />
                        {/* <input type="file" onChange={handlePictureChange} /> */}
                    </div>
                    <div className="profile-info">
                        <h2>{name || 'Your Name'}</h2>
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                        <label>Medical Information</label>
                        <textarea
                            value={medicalInfo}
                            onChange={(e) => setMedicalInfo(e.target.value)}
                            placeholder="Enter any medical information"
                        ></textarea>
                    </div>
                </div>
                <div className="emergency-contacts">
                    <div className="contact">
                        <h4>Contact 1</h4>
                        <div className="contact-info">
                            <input
                                type="text"
                                value={contact1.name}
                                onChange={(e) => setContact1({ ...contact1, name: e.target.value })}
                                placeholder=" Name"
                            />
                            <input
                                type="text"
                                value={contact1.phone}
                                onChange={(e) => setContact1({ ...contact1, phone: e.target.value })}
                                placeholder=" Number"
                            />
                        </div>
                    </div>
                    <div className="contact">
                        <h4>Contact 2</h4>
                        <div className="contact-info">
                            <input
                                type="text"
                                value={contact2.name}
                                onChange={(e) => setContact2({ ...contact2, name: e.target.value })}
                                placeholder="Name"
                            />
                            <input
                                type="text"
                                value={contact2.phone}
                                onChange={(e) => setContact2({ ...contact2, phone: e.target.value })}
                                placeholder="Number"
                            />
                        </div>
                    </div>
                    <div className="contact">
                        <h4>Contact 3</h4>
                        <div className="contact-info">
                            <input
                                type="text"
                                value={contact3.name}
                                onChange={(e) => setContact3({ ...contact3, name: e.target.value })}
                                placeholder="Name"
                            />
                                <input
                                type="text"
                                value={contact3.phone}
                                onChange={(e) => setContact3({ ...contact3, phone: e.target.value })}
                                placeholder="Number"
                            />
                        </div>
                    </div>
                </div>
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="logout-button">Logout</button>
            </div>
<div className="navbar">
  <div className="nav-item">
    <Link to="/" className="nav-link">
      <img src={homeIcon} alt="Home" className="contact-image" />
      <span className="nav-text">Home</span>
    </Link>
  </div>

  <div className="nav-item">
    <Link to="/navigation" className="nav-link">
      <img src={navigationIcon} alt="Navigation" className="contact-image" />
      <span className="nav-text">Navigation</span>
    </Link>
  </div>

  <div className="nav-item">
    <Link to="/profile" className="nav-link">
      <img src={profileIcon} alt="Profile" className="contact-image" />
      <span className="nav-text">Profile</span>
    </Link>
  </div>

  <div className="nav-item">
    <Link to="/other-alerts" className="nav-link">
      <img src={otherAlertsIcon} alt="Other Alerts" className="contact-image" />
      <span className="nav-text">Other Alerts <span style={{ color: "red" }}>!</span></span>
    </Link>
  </div>

  <div className="nav-item">
    <Link to="/safetymeasures" className="nav-link">
      <img src={safetyIcon} alt="Safety Measures" className="contact-image" />
      <span className="nav-text">Safety Measures</span>
    </Link>
  </div>
</div>

        </div>
    );
}

export default ProfilePage;
