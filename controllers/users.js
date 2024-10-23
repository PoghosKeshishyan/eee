const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

// Логин пользователя
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Please fill in the required fields" });
    }

    try {

        const user = await User.findOne({ username });  // or null
        const isPasswordCorrect = user && (await user.matchPassword(password));
        const secret = process.env.JWT_SECRET;

        if (isPasswordCorrect) {

            res.status(200).json({
                id: user._id,
                username: user.username,
                token: jwt.sign({ id: user._id }, secret, { expiresIn: "1d" }), // 1h
            });

        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};
