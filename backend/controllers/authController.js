const User = require("../models/User");

// 🔐 Register user
const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ fullName, email, password, role });
    res.json({ user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// 🔐 Login user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { register, login };
