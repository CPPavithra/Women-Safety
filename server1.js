const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Endpoint to upload profile picture
app.post('/api/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
  try {
    if (req.file) {
      res.status(200).json({
        message: 'Profile picture uploaded successfully',
        filePath: `/uploads/${req.file.filename}`
      });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during file upload', error: error.message });
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to save profile data
app.post('/api/save-profile', (req, res) => {
  const profileData = req.body;

  if (!profileData || !profileData.contacts) {
    return res.status(400).json({ message: 'Invalid profile data' });
  }

  const filePath = path.join(__dirname, 'uploads', 'profileData.json');

  fs.writeFile(filePath, JSON.stringify(profileData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to save profile data', error: err.message });
    }
    res.status(200).json({ message: 'Profile data saved successfully' });
  });
});

// Endpoint to get profile data
app.get('/api/get-profile', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'uploads', 'profileData.json'));
    const profileData = JSON.parse(data);
    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile data' });
  }
});

// Endpoint for Help Signup
app.post('/api/help-signup', (req, res) => {
  const { name, email, phone, locationplace, helptype, password } = req.body;

  // Validation
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!name.trim()) return res.status(400).json({ error: "Name is required" });
  if (!email.match(emailRegex)) return res.status(400).json({ error: "Invalid email address" });
  if (!phone.match(phoneRegex)) return res.status(400).json({ error: "Invalid 10-digit phone number" });
  if (!locationplace.trim()) return res.status(400).json({ error: "Location is required" });
  if (!helptype.trim()) return res.status(400).json({ error: "Help type is required" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

  // Save help user data
  const filePath = path.join(__dirname, 'uploads', 'helpUsers.json');
  let helpUsers = [];

  // Read existing data if file exists
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    helpUsers = JSON.parse(data);
  }

  // Add new user
  const newUser = { name, email, phone, locationplace, helptype, password };
  helpUsers.push(newUser);

  // Write back to file
  fs.writeFile(filePath, JSON.stringify(helpUsers, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to register user" });
    }
    res.status(201).json({ message: "Help user registered successfully" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

