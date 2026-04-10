const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ok, fail } = require('../utils/responseHelper');

const pendingRegistrations = new Map();

function createTokenPayload(user) {
  return {
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function normalizeUserRecord(user) {
  return {
    id: String(user.id),
    name: user.username,
    email: user.email,
    role: user.role || 'customer',
  };
}

const { sendOtpEmail } = require('../utils/mailer');

function createOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔐 REGISTER
const registerUser = (req, res) => {
  const { name, username, email, password } = req.body;
  const resolvedName = (name || username || '').trim();
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!resolvedName || !normalizedEmail || !password) {
    return fail(res, 'Name, email, and password are required.');
  }

  User.getUserByEmail(normalizedEmail, async (err, results) => {
    if (err) {
      console.error(err);
      return fail(res, 'Database error.', 500);
    }

    if (results.length > 0) {
      return fail(res, 'An account with this email already exists.', 409);
    }

    const otp = createOtp();

    // Send the OTP via email
    const emailSent = await sendOtpEmail(normalizedEmail, otp);
    if (!emailSent) {
      return fail(res, 'Failed to send OTP email. Please try again later.', 500);
    }

    pendingRegistrations.set(normalizedEmail, {
      username: resolvedName,
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      otp: otp,
    });

    return ok(res, { email: normalizedEmail }, 'OTP sent to your email.', 201);
  });
};

// ✅ VERIFY OTP
const verifyOtp = (req, res) => {
  const normalizedEmail = (req.body.email || '').trim().toLowerCase();
  const otp = (req.body.otp || '').trim();
  const pendingRegistration = pendingRegistrations.get(normalizedEmail);

  if (!normalizedEmail || !otp) {
    return fail(res, 'Email and OTP are required.');
  }

  if (!pendingRegistration) {
    return fail(res, 'Registration session not found. Start again.', 404);
  }

  if (pendingRegistration.otp !== otp) {
    return fail(res, 'Invalid OTP.');
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
        return fail(res, 'Database error.', 500);
      }

      pendingRegistrations.delete(normalizedEmail);
      return ok(res, { email: normalizedEmail }, 'Account verified. You can log in now.', 201);
    },
  );
};

// 🔐 LOGIN
const loginUser = (req, res) => {
  const normalizedEmail = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  User.getUserByEmail(normalizedEmail, async (err, results) => {
    if (err) {
      return fail(res, 'Database error.', 500);
    }

    if (results.length === 0) {
      return fail(res, 'User not found.', 401);
    }

    const user = results[0];

    // Check if user is blocked
    if (user.status === 'blocked') {
      return fail(res, 'Your account has been blocked. Contact support.', 403);
    }

    if (user.status === 'pending') {
      return fail(res, 'Your account is pending approval.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return fail(res, 'Invalid password.', 401);
    }

    const normalizedUser = normalizeUserRecord(user);
    const token = jwt.sign(
      createTokenPayload(normalizedUser),
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' },
    );

    return ok(res, {
      token,
      role: normalizedUser.role,
      user: normalizedUser,
    }, 'Login successful.');
  });
};

// 🚪 LOGOUT
const logoutUser = (req, res) => {
  return ok(res, null, 'Logout successful.');
};

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  logoutUser,
};
