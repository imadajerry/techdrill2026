const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pendingRegistrations = new Map();

function createTokenPayload(user) {
  return {
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function createAuthResponse(user, token) {
  return {
    success: true,
    data: {
      token,
      role: user.role,
      user,
    },
    message: 'Login successful.',
  };
}

function normalizeUserRecord(user) {
  return {
    id: String(user.id),
    name: user.username,
    email: user.email,
    role: 'customer',
  };
}

function createOtp() {
  return '123456';
}

// 🔐 REGISTER
const registerUser = (req, res) => {
  const { name, username, email, password } = req.body;
  const resolvedName = (name || username || '').trim();
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!resolvedName || !normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required.',
    });
  }

  User.getUserByEmail(normalizedEmail, async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Database error.',
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    pendingRegistrations.set(normalizedEmail, {
      username: resolvedName,
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      otp: createOtp(),
    });

    return res.status(201).json({
      success: true,
      data: {
        email: normalizedEmail,
      },
      message: 'OTP sent. Use 123456 in the current backend implementation.',
    });
  });
};

// 🔐 LOGIN
const verifyOtp = (req, res) => {
  const normalizedEmail = (req.body.email || '').trim().toLowerCase();
  const otp = (req.body.otp || '').trim();
  const pendingRegistration = pendingRegistrations.get(normalizedEmail);

  if (!normalizedEmail || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and OTP are required.',
    });
  }

  if (!pendingRegistration) {
    return res.status(404).json({
      success: false,
      message: 'Registration session not found. Start again.',
    });
  }

  if (pendingRegistration.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP.',
    });
  }

  User.createUser(
    {
      username: pendingRegistration.username,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
    },
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Database error.',
        });
      }

      pendingRegistrations.delete(normalizedEmail);

      return res.status(201).json({
        success: true,
        data: {
          email: normalizedEmail,
        },
        message: 'Account verified. You can log in now.',
      });
    },
  );
};

const loginUser = (req, res) => {
  const normalizedEmail = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  User.getUserByEmail(normalizedEmail, async (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error.',
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.',
      });
    }

    const normalizedUser = normalizeUserRecord(user);
    const token = jwt.sign(
      createTokenPayload(normalizedUser),
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' },
    );

    return res.status(200).json(createAuthResponse(normalizedUser, token));
  });
};

// 🚪 LOGOUT
const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: 'Logout successful.',
  });
};

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  logoutUser,
};
