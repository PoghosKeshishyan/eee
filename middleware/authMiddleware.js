const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        // Extract token from authorization header
        let token = req.headers.authorization?.split(' ')[1]; //Bеarer 1qasda231290a8ds

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the decoded ID
        const user = await User.findById(decoded.id);

        // If user not found, return error
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // Add user to request object
        req.user = user;

        // Proceed to the next middleware or controller
        next();
    } catch (error) {
        // Handle token verification or other errors
        res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = {
    protect,
};
