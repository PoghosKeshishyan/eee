# index.js
Server running on port ${port}



# app.js
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

app.use('/api/user')

# models >> User.js
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    cratedTodos: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Todo',
        },
    ],
}, {
    timestamps: true  // Эта опция добавляет поля createdAt и updatedAt
});


# npm install express-validator
# create folder >> middlewares >> validate.js

# validate.js

const { check } = require('express-validator');

const validate = [
    check('name', 'Name must be between 2 and 20 characters long').isLength({ min: 2, max: 20 }),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];

module.exports = { 
    validate,
};



# routes >> users.js
const { validate } = require('../middlewares/validate');
router.post('/register', validate, register);




# controllers >> users.js
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');

const register = async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ // "Bad Request" — некорректный запрос
            errors: errors.array(),
            message: 'Invalid data during registration',
            //       Некорректные данные при регистрации
        });
    }

    const { name, email, password } = req.body;

    try {
        // Проверяем, существует ли уже пользователь с таким email
        // существующий пользователь
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'This email is already taken, please try another' 
            //           'Этот email уже занят, попробуйте другой'
            });
        }

        // Create a new user
        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
        });
    }
};




# npm install jsonwebtoken
# env >> JWT_SECRET="N22Epz`w}a?f@/3"
# env.example >> JWT_SECRET="N22Epz`w}a?f@/3"


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Please fill in the required fields" });
    }

    try {

        const user = await User.findOne({ email });  // or null
        const isPasswordCorrect = user && (await user.matchPassword(password));
        const secret = process.env.JWT_SECRET;

        if (isPasswordCorrect) {

            res.status(200).json({
                id: user._id,
                email: user.email,
                token: jwt.sign({ id: user._id }, secret, { expiresIn: "1d" }), // 1h
            });

        } else {
            res.status(401).json({ error: 'Invalid credentials' });
            //                          Недействительные учетные данные
        }

    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};