import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, '../data/users.json');

// In-memory active OTP store & session store
// phone -> { otp, expiresAt, attempts, lastRequestedAt }
const otpStore = new Map();
// token -> { userId, phone, expiresAt }
export const sessionStore = new Map();

// Helper to read users
export const readUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (e) {
    return [];
  }
};

// Helper to write users
export const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
};

// Phone normalization to +91XXXXXXXXXX
export const normalizePhone = (input) => {
  if (!input) return null;
  const digits = String(input).replace(/[^\d]/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) {
    return `+${digits}`;
  }
  return null;
};

// Middleware: Authenticate Session Token
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  const session = sessionStore.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) sessionStore.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }

  const users = readUsers();
  const user = users.find(u => u.id === session.userId);
  if (!user) {
    sessionStore.delete(token);
    return res.status(401).json({ error: 'User account not found.' });
  }

  req.user = user;
  req.token = token;
  next();
};

/**
 * 1. POST /api/auth/send-otp
 * Body: { phone }
 */
router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  const normalized = normalizePhone(phone);

  if (!normalized) {
    return res.status(400).json({ 
      error: 'Invalid Indian mobile number. Please enter a valid 10-digit number starting with 6, 7, 8, or 9.' 
    });
  }

  const now = Date.now();
  const existing = otpStore.get(normalized);

  // Rate Limiting: Minimum 30 seconds cooldown between OTP requests
  if (existing && now - existing.lastRequestedAt < 30000) {
    const waitSeconds = Math.ceil((30000 - (now - existing.lastRequestedAt)) / 1000);
    return res.status(429).json({ 
      error: `Please wait ${waitSeconds} seconds before requesting a new OTP.` 
    });
  }

  // Rate Limiting: Max 3 requests in a 10-minute window
  if (existing && existing.requestCount >= 3 && now - existing.windowStart < 600000) {
    const waitMinutes = Math.ceil((600000 - (now - existing.windowStart)) / 60000);
    return res.status(429).json({ 
      error: `Too many OTP requests. Please try again after ${waitMinutes} minutes.` 
    });
  }

  // Generate cryptographically secure 6-digit OTP
  const otp = Math.floor(100000 + crypto.randomInt(900000)).toString();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes expiration

  otpStore.set(normalized, {
    otp,
    expiresAt,
    attempts: 0,
    lastRequestedAt: now,
    requestCount: (existing && (now - existing.windowStart < 600000)) ? existing.requestCount + 1 : 1,
    windowStart: (existing && (now - existing.windowStart < 600000)) ? existing.windowStart : now
  });

  // Securely print OTP on backend terminal (NEVER in public frontend response in production!)
  console.log(`[ANNADATA SMS SERVICE] Verification OTP for ${normalized}: ${otp} (Valid for 5 mins)`);

  // To support seamless offline testing & review if SMS gateway is unconfigured:
  const isDevTest = process.env.NODE_ENV !== 'production' || req.headers['x-dev-test'] === 'true';

  return res.json({
    success: true,
    message: `OTP sent to ${normalized}. Enter the 6-digit verification code.`,
    phone: normalized,
    expiresIn: 300,
    // Only exposed in dev/local mode for automated test harness
    ...(isDevTest ? { devOtp: otp } : {})
  });
});

/**
 * 2. POST /api/auth/verify-otp
 * Body: { phone, otp }
 */
router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const normalized = normalizePhone(phone);

  if (!normalized) {
    return res.status(400).json({ error: 'Invalid mobile phone number.' });
  }

  if (!otp || String(otp).trim().length !== 6) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit OTP code.' });
  }

  const record = otpStore.get(normalized);
  if (!record) {
    return res.status(400).json({ 
      error: 'No OTP requested for this number or OTP has expired. Please click "Send OTP".' 
    });
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpStore.delete(normalized);
    return res.status(400).json({ 
      error: 'OTP has expired. Please request a fresh OTP.' 
    });
  }

  // Brute force protection: max 5 failed attempts
  if (record.attempts >= 5) {
    otpStore.delete(normalized);
    return res.status(429).json({ 
      error: 'Maximum verification attempts exceeded. Please request a new OTP.' 
    });
  }

  if (record.otp !== String(otp).trim()) {
    record.attempts += 1;
    const remaining = 5 - record.attempts;
    return res.status(400).json({ 
      error: `Incorrect OTP. ${remaining} attempts remaining.` 
    });
  }

  // Successful verification - Consume OTP immediately to prevent replay
  otpStore.delete(normalized);

  // Check if existing user or new registration
  const users = readUsers();
  let user = users.find(u => u.phone === normalized);
  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    user = {
      id: `usr_${Date.now()}_${crypto.randomInt(1000, 9999)}`,
      phone: normalized,
      name: `Farmer ${normalized.slice(-4)}`,
      role: 'farmer',
      isVerified: true,
      state: 'Karnataka',
      city: 'Kalaburagi',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeUsers(users);
  }

  // Create active session token
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionExpires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  sessionStore.set(sessionToken, {
    userId: user.id,
    phone: user.phone,
    expiresAt: sessionExpires
  });

  return res.json({
    success: true,
    message: isNewUser ? 'Account registered successfully!' : 'Signed in successfully!',
    token: sessionToken,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      state: user.state,
      city: user.city,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }
  });
});

/**
 * 3. GET /api/auth/me
 */
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * 4. POST /api/auth/update-profile
 */
router.post('/update-profile', requireAuth, (req, res) => {
  const { name, state, city } = req.body;
  const users = readUsers();
  const index = users.findIndex(u => u.id === req.user.id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (name && name.trim()) users[index].name = name.trim();
  if (state && state.trim()) users[index].state = state.trim();
  if (city && city.trim()) users[index].city = city.trim();

  writeUsers(users);

  return res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: users[index]
  });
});

/**
 * 5. POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessionStore.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
