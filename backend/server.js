require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
/**
 * Origin URL for CORS. Adjust this to match your frontend URL.
 * For example, if your frontend is running on http://localhost:3000,
 * change this to 'http://localhost:3000'.
 */
app.use(cors({ origin: 'https://pro-1-three.vercel.app/' })); // Adjust for your frontend
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDBcd 
connectDB();

// Authentication middleware
const authMiddleware = (req, res, next) => {

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes')(authMiddleware, upload));
app.use('/api/slots', require('./routes/slotRoutes')(authMiddleware));

// Basic route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

const cors = require('cors');
app.use(cors({
    origin: 'https://pro-1-three.vercel.app/',
    credentials: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
