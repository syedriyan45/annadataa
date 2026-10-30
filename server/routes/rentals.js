import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { requireAuth, readUsers, normalizePhone, sessionStore } from './auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RENTALS_FILE = path.join(__dirname, '../data/rentals.json');

// Helper to read rentals from database
export const readRentals = () => {
  try {
    if (!fs.existsSync(RENTALS_FILE)) return [];
    const content = fs.readFileSync(RENTALS_FILE, 'utf-8');
    return content ? JSON.parse(content) : [];
  } catch (e) {
    return [];
  }
};

// Helper to write rentals to database
export const writeRentals = (rentals) => {
  fs.writeFileSync(RENTALS_FILE, JSON.stringify(rentals, null, 2), 'utf-8');
};

/**
 * 1. GET /api/rentals
 * Public: Returns ONLY real, database-saved, approved, available, non-deleted listings.
 * Zero listings in database = returns []
 */
router.get('/', (req, res) => {
  try {
    const allRentals = readRentals();
    const users = readUsers();

    const { type, minPrice, maxPrice, state, city } = req.query;

    let filtered = allRentals.filter(item => {
      // Must be approved, available, not deleted
      if (item.status !== 'approved') return false;
      if (!item.available) return false;
      if (item.isDeleted) return false;

      // Optional filters
      if (type && type !== 'All' && item.equipmentType !== type) return false;
      if (minPrice && item.rentalPrice < Number(minPrice)) return false;
      if (maxPrice && item.rentalPrice > Number(maxPrice)) return false;
      if (state && item.state && item.state.toLowerCase() !== state.toLowerCase()) return false;
      if (city && item.city && item.city.toLowerCase() !== city.toLowerCase()) return false;

      return true;
    });

    // Populate owner public details safely (never expose private tokens or passwords)
    const sanitized = filtered.map(item => {
      const owner = users.find(u => u.id === item.ownerId);
      const { contactPhone, ownerPhone, ...publicItem } = item;
      return {
        ...publicItem,
        ownerName: owner ? owner.name : item.ownerName || 'Equipment owner',
        isOwnerVerified: owner ? Boolean(owner.isVerified) : Boolean(item.phoneVerified),
        ownerPhone: item.showPhoneToPublic ? (owner ? owner.phone : ownerPhone || contactPhone || null) : null
      };
    });

    return res.json({
      success: true,
      count: sanitized.length,
      data: sanitized
    });
  } catch (err) {
    console.error('Error fetching rentals:', err);
    return res.status(500).json({ error: 'Failed to retrieve rental equipment from database.' });
  }
});

/**
 * 2. GET /api/rentals/my
 * Protected: Returns equipment listings belonging to the authenticated user
 */
router.get('/my', requireAuth, (req, res) => {
  try {
    const allRentals = readRentals();
    const myListings = allRentals.filter(r => r.ownerId === req.user.id && !r.isDeleted);
    return res.json({
      success: true,
      count: myListings.length,
      data: myListings
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve your listings.' });
  }
});

/**
 * 3. GET /api/rentals/:id
 * Public: Returns details of a specific verified listing
 */
router.get('/:id', (req, res) => {
  const allRentals = readRentals();
  const item = allRentals.find(r => r.id === req.params.id && !r.isDeleted && r.status === 'approved');

  if (!item) {
    return res.status(404).json({ error: 'Rental listing not found or no longer available.' });
  }

  const users = readUsers();
  const owner = users.find(u => u.id === item.ownerId);

  return res.json({
    success: true,
    data: (() => {
      const { contactPhone, ownerPhone, ...publicItem } = item;
      return { ...publicItem, ownerName: owner ? owner.name : item.ownerName, isOwnerVerified: owner ? Boolean(owner.isVerified) : Boolean(item.phoneVerified), ownerPhone: item.showPhoneToPublic ? (owner ? owner.phone : ownerPhone || contactPhone || null) : null };
    })()
  });
});

/**
 * 4. POST /api/rentals
 * Public guest and authenticated owner submission. All new listings remain private pending approval.
 */
router.post('/', (req, res) => {
  try {
    const body = req.body || {};
    const authHeader = req.headers.authorization || '';
    let owner = null;
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const session = sessionStore.get(token);
      if (session && session.expiresAt > Date.now()) {
        owner = readUsers().find(user => user.id === session.userId) || null;
      }
    }

    const ownerName = String(owner?.name || body.ownerName || '').trim();
    const phone = normalizePhone(owner?.phone || body.contactPhone);
    const name = String(body.name || '').trim();
    const equipmentType = String(body.equipmentType || '').trim();
    const priceNum = Number(body.rentalPrice);
    const billingUnit = String(body.billingUnit || '').trim();
    const locationRequired = String(body.village || body.pickupLocation || '').trim();

    if (ownerName.length < 2 || ownerName.length > 100) {
      return res.status(400).json({ error: 'Owner full name is required (2–100 characters).' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'Enter a valid Indian mobile number (10 digits starting with 6–9).' });
    }
    if (name.length < 3 || name.length > 120) {
      return res.status(400).json({ error: 'Equipment name is required (3–120 characters).' });
    }
    const validTypes = ['Tractor', 'Harvester', 'Rotavator', 'Cultivator', 'Seed Drill', 'Thresher', 'Power Sprayer', 'Drone Sprayer', 'Water Pump', 'Laser Leveller', 'Baler', 'Other Machinery'];
    if (!validTypes.includes(equipmentType)) {
      return res.status(400).json({ error: `Select a supported equipment type: ${validTypes.join(', ')}.` });
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0 || priceNum > 10000000) {
      return res.status(400).json({ error: 'Enter a valid rental price greater than zero.' });
    }
    const validUnits = ['per hour', 'per day', 'per acre', 'per week'];
    if (!validUnits.includes(billingUnit)) {
      return res.status(400).json({ error: 'Select a valid rental billing unit.' });
    }
    if (!locationRequired || locationRequired.length > 120) {
      return res.status(400).json({ error: 'Village or pickup location is required (max 120 characters).' });
    }
    const isEnginePowered = ['Tractor', 'Harvester', 'Power Sprayer', 'Water Pump', 'Drone Sprayer'].includes(equipmentType);
    const horsepower = String(body.horsepower || '').trim().slice(0, 30) || null;
    const engineCapacity = String(body.engineCapacity || '').trim().slice(0, 30) || null;
    if (isEnginePowered && !horsepower && !engineCapacity) {
      return res.status(400).json({ error: 'Provide horsepower or engine capacity for this equipment type.' });
    }

    const idempotencyKey = String(req.headers['idempotency-key'] || '').trim().slice(0, 150);
    const allRentals = readRentals();
    if (idempotencyKey) {
      const duplicate = allRentals.find(item => item.idempotencyKey === idempotencyKey);
      if (duplicate) {
        return res.status(200).json({ success: true, duplicate: true, message: 'This submission has already been received.', data: duplicate });
      }
    }

    const safeText = (value, max = 150) => String(value || '').trim().slice(0, max) || null;
    const state = safeText(body.state, 80) || safeText(owner?.state, 80);
    const district = safeText(body.district, 100) || safeText(owner?.city, 100);
    const newListing = {
      id: `rent_${Date.now()}_${crypto.randomBytes(5).toString('hex')}`,
      idempotencyKey: idempotencyKey || null,
      ownerId: owner?.id || null,
      ownerName,
      ownerPhone: phone,
      contactPhone: phone,
      phoneVerified: Boolean(owner?.isVerified),
      showPhoneToPublic: body.showPhoneToPublic === true,
      name,
      category: 'Farming Machinery',
      equipmentType,
      brand: safeText(body.brand, 80),
      model: safeText(body.model, 80),
      horsepower,
      engineCapacity,
      fuelType: safeText(body.fuelType, 50),
      condition: safeText(body.condition, 60) || 'Good',
      photoUrl: safeText(body.photoUrl, 1000),
      rentalPrice: priceNum,
      billingUnit,
      availableFrom: safeText(body.availableFrom, 40),
      availableTo: safeText(body.availableTo, 40),
      pickupLocation: [safeText(body.village, 120), safeText(body.hobli, 100), safeText(body.taluk, 100), district, state].filter(Boolean).join(', '),
      village: safeText(body.village, 120),
      hobli: safeText(body.hobli, 100),
      taluk: safeText(body.taluk, 100),
      district,
      serviceArea: safeText(body.serviceArea, 300),
      rentalTerms: safeText(body.rentalTerms, 1500),
      state: state || null,
      city: district || null,
      status: 'pending_approval',
      available: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    allRentals.unshift(newListing);
    writeRentals(allRentals);
    return res.status(201).json({
      success: true,
      message: 'Equipment submission saved. It will appear publicly only after verification and approval.',
      data: { ...newListing, ownerPhone: undefined, contactPhone: undefined }
    });
  } catch (err) {
    console.error('Error creating rental:', err);
    return res.status(500).json({ error: 'Server error while saving equipment submission.' });
  }
});

/**
 * Admin review endpoint. Configure RENTALS_ADMIN_KEY on the server to enable approval/rejection.
 * Never expose this key in frontend code.
 */
router.post('/:id/review', (req, res) => {
  const configuredKey = process.env.RENTALS_ADMIN_KEY;
  const suppliedKey = String(req.headers['x-admin-key'] || '');
  if (!configuredKey || !suppliedKey || Buffer.byteLength(suppliedKey) !== Buffer.byteLength(configuredKey) || !crypto.timingSafeEqual(Buffer.from(suppliedKey), Buffer.from(configuredKey))) {
    return res.status(403).json({ error: 'Administrator authorization required.' });
  }
  const decision = String(req.body?.status || '');
  if (!['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({ error: 'Review status must be approved or rejected.' });
  }
  const allRentals = readRentals();
  const item = allRentals.find(listing => listing.id === req.params.id && !listing.isDeleted);
  if (!item) return res.status(404).json({ error: 'Equipment submission not found.' });
  item.status = decision;
  item.available = decision === 'approved' && req.body?.available !== false;
  item.reviewedAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();
  writeRentals(allRentals);
  return res.json({ success: true, message: `Listing ${decision}.`, data: { ...item, ownerPhone: undefined, contactPhone: undefined } });
});

/**
 * 5. PUT /api/rentals/:id
 * Protected: Update own listing with strict ownership check
 */
router.put('/:id', requireAuth, (req, res) => {
  const allRentals = readRentals();
  const index = allRentals.findIndex(r => r.id === req.params.id && !r.isDeleted);

  if (index === -1) {
    return res.status(404).json({ error: 'Rental listing not found.' });
  }

  // ENFORCE SERVER-SIDE AUTHORIZATION: Only owner can edit
  if (allRentals[index].ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized. You can only edit your own equipment listings.' });
  }

  const updates = req.body;
  const allowed = [
    'name', 'brand', 'model', 'horsepower', 'engineCapacity', 'condition',
    'photoUrl', 'rentalPrice', 'billingUnit', 'available', 'availableFrom',
    'availableTo', 'pickupLocation', 'serviceArea', 'rentalTerms', 'showPhoneToPublic'
  ];

  allowed.forEach(field => {
    if (updates[field] !== undefined) {
      allRentals[index][field] = updates[field];
    }
  });
  if (allRentals[index].status !== 'approved') allRentals[index].available = false;
  if (updates.available === true && allRentals[index].status !== 'approved') {
    return res.status(409).json({ error: 'Only approved listings can be marked available.' });
  }

  allRentals[index].updatedAt = new Date().toISOString();
  writeRentals(allRentals);

  return res.json({
    success: true,
    message: 'Listing updated successfully.',
    data: allRentals[index]
  });
});

/**
 * 6. DELETE /api/rentals/:id
 * Protected: Delete own listing with strict ownership check
 */
router.delete('/:id', requireAuth, (req, res) => {
  const allRentals = readRentals();
  const index = allRentals.findIndex(r => r.id === req.params.id && !r.isDeleted);

  if (index === -1) {
    return res.status(404).json({ error: 'Rental listing not found.' });
  }

  // ENFORCE SERVER-SIDE AUTHORIZATION: Only owner can delete
  if (allRentals[index].ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized. You can only delete your own equipment listings.' });
  }

  // Soft delete
  allRentals[index].isDeleted = true;
  allRentals[index].available = false;
  allRentals[index].updatedAt = new Date().toISOString();
  writeRentals(allRentals);

  return res.json({
    success: true,
    message: 'Equipment listing removed successfully.'
  });
});

export default router;
