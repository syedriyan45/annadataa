import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from './auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HIERARCHY_FILE = path.join(__dirname, '../data/karnatakaHierarchy.json');
const PLOTS_FILE = path.join(__dirname, '../data/plots.json');

const readPlots = () => {
  try {
    if (!fs.existsSync(PLOTS_FILE)) return [];
    const content = fs.readFileSync(PLOTS_FILE, 'utf-8');
    return content ? JSON.parse(content) : [];
  } catch (e) {
    return [];
  }
};

const writePlots = (plots) => {
  fs.writeFileSync(PLOTS_FILE, JSON.stringify(plots, null, 2), 'utf-8');
};

/**
 * 1. GET /api/bhoomi/hierarchy
 * Returns authentic Karnataka administrative hierarchy (Districts -> Taluks -> Hoblis -> Villages)
 */
router.get('/hierarchy', (req, res) => {
  try {
    if (!fs.existsSync(HIERARCHY_FILE)) {
      return res.status(404).json({ error: 'Administrative hierarchy data not found.' });
    }
    const data = JSON.parse(fs.readFileSync(HIERARCHY_FILE, 'utf-8'));
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load administrative hierarchy.' });
  }
});

/**
 * 2. POST /api/bhoomi/verify
 * Validates survey, surnoc, hissa and returns transparent official Bhoomi state portal status
 */
router.post('/verify', (req, res) => {
  const { district, taluk, hobli, village, surveyNo, surnocNo, hissaNo, period } = req.body;

  if (!district || !taluk || !hobli || !village) {
    return res.status(400).json({ error: 'All administrative location fields (District, Taluk, Hobli, Village) are required.' });
  }

  if (!surveyNo || !surveyNo.trim()) {
    return res.status(400).json({ error: 'Survey Number is required.' });
  }

  if (!surnocNo || !surnocNo.trim()) {
    return res.status(400).json({ error: 'Surnoc Number is required.' });
  }

  if (!hissaNo || !hissaNo.trim()) {
    return res.status(400).json({ error: 'Hissa Number is required.' });
  }

  // Authentic transparency report:
  // Explains that official government Bhoomi RTC database requires authentication via official state portal
  return res.json({
    success: true,
    isOfficialLookupAvailable: false,
    message: 'Official Government of Karnataka Bhoomi RTC database requires authentication via the official state portal.',
    officialPortalUrl: 'https://landrecords.karnataka.gov.in/',
    disclaimer: 'ANNADAATA satellite analysis provides remote-sensing agricultural vegetation indices. It is not an official legal RTC land title certificate.',
    enteredData: {
      district,
      taluk,
      hobli,
      village,
      surveyNo: surveyNo.trim(),
      surnocNo: surnocNo.trim(),
      hissaNo: hissaNo.trim(),
      period: period || 'Current Year (2025-2026)'
    }
  });
});

/**
 * 3. GET /api/bhoomi/plots
 * Returns user's saved plots for satellite monitoring
 */
router.get('/plots', requireAuth, (req, res) => {
  const allPlots = readPlots();
  const userPlots = allPlots.filter(p => p.userId === req.user.id);
  return res.json({ success: true, data: userPlots });
});

/**
 * 4. POST /api/bhoomi/plots
 * Saves user plot with genuine user coordinates / polygon
 */
router.post('/plots', requireAuth, (req, res) => {
  const {
    plotName,
    state,
    district,
    taluk,
    hobli,
    village,
    surveyNo,
    surnocNo,
    hissaNo,
    areaAcres,
    coordinates,
    polygonGeoJson
  } = req.body;

  if (!surveyNo || !district || !village) {
    return res.status(400).json({ error: 'District, Village, and Survey Number are required to register plot.' });
  }

  const newPlot = {
    id: `plot_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
    userId: req.user.id,
    plotName: plotName ? plotName.trim() : `Survey ${surveyNo} (${village})`,
    state: state || 'Karnataka',
    district,
    taluk: taluk || '',
    hobli: hobli || '',
    village,
    surveyNo: String(surveyNo).trim(),
    surnocNo: surnocNo ? String(surnocNo).trim() : '*',
    hissaNo: hissaNo ? String(hissaNo).trim() : '1',
    areaAcres: areaAcres ? Number(areaAcres) : null,
    coordinates: coordinates || null, // [lat, lng]
    polygonGeoJson: polygonGeoJson || null,
    boundaryType: 'user-defined',
    dataSource: 'User Registered Agricultural Plot',
    createdAt: new Date().toISOString()
  };

  const allPlots = readPlots();
  allPlots.unshift(newPlot);
  writePlots(allPlots);

  return res.status(201).json({
    success: true,
    message: 'Agricultural land registered for satellite monitoring.',
    data: newPlot
  });
});

/**
 * 5. DELETE /api/bhoomi/plots/:id
 */
router.delete('/plots/:id', requireAuth, (req, res) => {
  const allPlots = readPlots();
  const index = allPlots.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Plot not found.' });
  }

  if (allPlots[index].userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to delete this plot.' });
  }

  allPlots.splice(index, 1);
  writePlots(allPlots);

  return res.json({ success: true, message: 'Plot removed from monitoring list.' });
});

export default router;
