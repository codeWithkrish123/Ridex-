const User = require('../models/user');
const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const axios = require('axios');
const logger = require('../utils/logger');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
function register(req, res) {
  res.json({ message: "Register OK" });
}

function login(req, res) {
  res.json({ message: "Login OK" });
}

function getMe(req, res) {
  res.json({ message: "GetMe OK" });
}

function logout(req, res) {
  res.json({ message: "Logout OK" });
}

function updateDetails(req, res) {
  res.json({ message: "UpdateDetails OK" });
}

function updatePassword(req, res) {
  res.json({ message: "UpdatePassword OK" });
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword,
};


// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict',
  };

  // Respond with token
  const response = {
    success: true,
    token,
  };
  res.status(statusCode).cookie('token', token, cookieOptions).json(response);
};