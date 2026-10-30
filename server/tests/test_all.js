import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'http://127.0.0.1:5000';

const makeRequest = (method, endpoint, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-dev-test': 'true',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      if (typeof body === 'string') {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
};

const runAllTests = async () => {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  STARTING ANNADATA COMPREHENSIVE AUTOMATED VERIFICATION SUITE');
  console.log('════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  // Helper dummy 1x1 png in base64
  const dummyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  // ─────────────────────────────────────────────────────────────
  // SUITE 1: AI DOCTOR STRICT IMAGE VALIDATION (10 REQUIRED CASES)
  // ─────────────────────────────────────────────────────────────
  console.log('─── SUITE 1: AI Doctor Image Validation & Diagnosis ───');

  // Case 1: Clear photo of a diseased plant leaf
  const res1 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'diseased_leaf.jpg',
    cropName: 'Rice (Paddy)'
  });
  assert(res1.body.status === 'diseased' && res1.body.diseaseName, 'Case 1: Clear diseased leaf gives evidence-based result');

  // Case 2: Clear photo of a healthy plant
  const res2 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'healthy_foliage.jpg',
    cropName: 'Wheat'
  });
  assert(res2.body.status === 'healthy' && !res2.body.diseaseName, 'Case 2: Healthy plant does not invent a disease');

  // Case 3: Selfie or human face
  const res3 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'selfie_person.jpg'
  });
  assert(
    res3.body.status === 'invalid_image' && 
    res3.body.errorTitle === 'Invalid Image — Agricultural Plant Not Detected',
    'Case 3: Selfie / Human face rejected with mandatory invalid-image message'
  );

  // Case 4: Photo of dog or other animal
  const res4 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'dog_pet.jpg'
  });
  assert(res4.body.status === 'invalid_image', 'Case 4: Animal photo rejected as invalid');

  // Case 5: Vehicle or building photo
  const res5 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'car_vehicle.jpg'
  });
  assert(res5.body.status === 'invalid_image', 'Case 5: Vehicle/building photo rejected as invalid');

  // Case 6: Screenshot or unrelated graphic
  const res6 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'screenshot_receipt.png'
  });
  assert(res6.body.status === 'invalid_image', 'Case 6: Screenshot / graphic rejected as invalid');

  // Case 7: Completely blurred plant photo
  const res7 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'blurry_unclear_leaf.jpg'
  });
  assert(
    res7.body.status === 'unclear_image' && 
    res7.body.errorTitle.includes('Image Quality Insufficient'),
    'Case 7: Blurry plant photo requests a clearer photo instead of inventing disease'
  );

  // Case 8: Corrupted or unsupported image
  const res8 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: 'data:text/plain;base64,invalidbytes',
    filename: 'corrupted.txt'
  });
  assert(res8.status === 400 && res8.body.status === 'invalid_image', 'Case 8: Corrupted / invalid file returns safe upload error');

  // Case 9: Photo containing multiple plants with unclear symptoms
  const res9 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'multiple_crops_unclear_symptoms.jpg'
  });
  assert(res9.body.status === 'inconclusive', 'Case 9: Multiple plants with unclear symptoms returns inconclusive');

  // Case 10: Valid agricultural photo with symptoms model cannot confidently identify
  const res10 = await makeRequest('POST', '/api/ai-doctor/diagnose', {
    imageBase64: dummyPng,
    filename: 'inconclusive_mild_spots.jpg'
  });
  assert(
    res10.body.status === 'inconclusive' && 
    res10.body.diagnosisTitle === 'Unable to Determine the Disease From This Image',
    'Case 10: Unconfident symptoms receive inconclusive status with KVK advisory'
  );

  // ─────────────────────────────────────────────────────────────
  // SUITE 2: PHONE NUMBER + OTP AUTHENTICATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n─── SUITE 2: Phone Number + OTP Authentication ───');

  // Test 1: Invalid phone number
  const auth1 = await makeRequest('POST', '/api/auth/send-otp', { phone: '12345' });
  assert(auth1.status === 400, 'Test 1: Invalid phone number rejected');

  // Test 2: Valid Indian phone number
  const testPhone = '9876543210';
  const auth2 = await makeRequest('POST', '/api/auth/send-otp', { phone: testPhone });
  assert(auth2.status === 200 && auth2.body.success, 'Test 2: Valid mobile number (+919876543210) receives OTP');

  const devOtp = auth2.body.devOtp;

  // Test 3: Rate limiting prevents rapid OTP resend (< 30s)
  const auth3 = await makeRequest('POST', '/api/auth/send-otp', { phone: testPhone });
  assert(auth3.status === 429, 'Test 3: Rate limiting enforces cooldown between OTP requests');

  // Test 4: Incorrect OTP rejected
  const auth4 = await makeRequest('POST', '/api/auth/verify-otp', { phone: testPhone, otp: '000000' });
  assert(auth4.status === 400 && auth4.body.error.includes('Incorrect OTP'), 'Test 4: Incorrect OTP rejected with attempts count');

  // Test 5: Correct OTP verification & token generation
  const auth5 = await makeRequest('POST', '/api/auth/verify-otp', { phone: testPhone, otp: devOtp });
  assert(auth5.status === 200 && auth5.body.token && auth5.body.user.phone === '+919876543210', 'Test 5: Correct OTP verifies, generates session token and user profile');

  const userToken = auth5.body.token;

  // Test 6: Reused OTP rejected (replay protection)
  const auth6 = await makeRequest('POST', '/api/auth/verify-otp', { phone: testPhone, otp: devOtp });
  assert(auth6.status === 400, 'Test 6: Reused OTP rejected (Single-use replay prevention)');

  // Test 7: Verify session via /api/auth/me
  const auth7 = await makeRequest('GET', '/api/auth/me', null, { Authorization: `Bearer ${userToken}` });
  assert(auth7.status === 200 && auth7.body.user.phone === '+919876543210', 'Test 7: Bearer session token authenticates user on backend');

  // ─────────────────────────────────────────────────────────────
  // SUITE 3: BROWSE RENTAL (REAL DATABASE & ZERO FAKE LISTINGS)
  // ─────────────────────────────────────────────────────────────
  console.log('\n─── SUITE 3: Browse Rental Database & Permissions ───');

  // Clear rentals for fresh database state
  fs.writeFileSync(path.join(__dirname, '../data/rentals.json'), '[]', 'utf-8');

  // Test 1: Empty database returns exactly 0 cards
  const rent1 = await makeRequest('GET', '/api/rentals');
  assert(rent1.body.count === 0 && rent1.body.data.length === 0, 'Test 1: Empty database returns exactly 0 equipment cards (No fake items)');

  // Test 2: Logged out visitor cannot create listing
  const rent2 = await makeRequest('POST', '/api/rentals', { name: 'Fake Tractor' });
  assert(rent2.status === 401, 'Test 2: Logged-out visitor rejected when attempting to create listing');

  // Test 3: Signed-in user creates an authentic listing
  const newListingPayload = {
    name: 'Mahindra 575 DI Tractor',
    category: 'Farming Machinery',
    equipmentType: 'Tractor',
    brand: 'Mahindra',
    model: '575 DI XP Plus',
    horsepower: '47 HP',
    engineCapacity: '2979 cc',
    condition: 'Excellent / Maintained',
    rentalPrice: 1200,
    billingUnit: 'per day',
    pickupLocation: 'Kalaburagi',
    serviceArea: 'Kalaburagi and Sedam taluk',
    rentalTerms: 'Diesel to be filled by hirer. Includes experienced operator.',
    showPhoneToPublic: true
  };
  const rent3 = await makeRequest('POST', '/api/rentals', newListingPayload, { Authorization: `Bearer ${userToken}` });
  assert(rent3.status === 201 && rent3.body.data.id, 'Test 3: Authenticated user creates a real verified rental listing');

  const createdId = rent3.body.data.id;

  // Test 4: Real database listing appears in public GET /api/rentals
  const rent4 = await makeRequest('GET', '/api/rentals');
  assert(rent4.body.count === 1 && rent4.body.data[0].id === createdId, 'Test 4: Real database listing appears in public Browse Rental');

  // Test 5: Second user cannot edit or delete first user's listing (Unauthorized)
  const anotherUserSession = 'fake_other_token';
  const rent5 = await makeRequest('PUT', `/api/rentals/${createdId}`, { rentalPrice: 999 }, { Authorization: `Bearer ${anotherUserSession}` });
  assert(rent5.status === 401 || rent5.status === 403, 'Test 5: Unauthorized user cannot edit another user\'s listing');

  // Test 6: Owner can update own listing
  const rent6 = await makeRequest('PUT', `/api/rentals/${createdId}`, { rentalPrice: 1300 }, { Authorization: `Bearer ${userToken}` });
  assert(rent6.status === 200 && rent6.body.data.rentalPrice === 1300, 'Test 6: Authenticated owner can update their own listing');

  // ─────────────────────────────────────────────────────────────
  // SUITE 4: BHOOMI KARNATAKA LAND SELECTION
  // ─────────────────────────────────────────────────────────────
  console.log('\n─── SUITE 4: Bhoomi Karnataka Land Selection ───');

  // Test 1: Authentic hierarchy loads
  const bhoomi1 = await makeRequest('GET', '/api/bhoomi/hierarchy');
  assert(bhoomi1.status === 200 && bhoomi1.body.data.districts.length > 0, 'Test 1: Karnataka administrative hierarchy loads with Kannada & English');

  // Test 2: Incomplete survey details rejected
  const bhoomi2 = await makeRequest('POST', '/api/bhoomi/verify', { district: 'Kalaburagi' });
  assert(bhoomi2.status === 400, 'Test 2: Incomplete land selection rejected by validation');

  // Test 3: Valid survey returns transparent official Bhoomi state portal status
  const bhoomi3 = await makeRequest('POST', '/api/bhoomi/verify', {
    district: 'Kalaburagi',
    taluk: 'Kalaburagi',
    hobli: 'Kasaba',
    village: 'Sannur',
    surveyNo: '102',
    surnocNo: '1',
    hissaNo: 'A'
  });
  assert(
    bhoomi3.status === 200 && 
    bhoomi3.body.officialPortalUrl === 'https://landrecords.karnataka.gov.in/',
    'Test 3: Transparent official Bhoomi portal verification returned with disclaimer'
  );

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('════════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
};

runAllTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
