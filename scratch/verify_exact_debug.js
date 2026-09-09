const axios = require('axios');

async function testExactRequests() {
  const date = '2026-09-23';
  const service = 'Hair Spa';

  console.log('====================================================');
  console.log('[BOOKING DEBUG] TESTING EXACT AVAILABILITY REQUESTS');
  console.log('====================================================\n');

  // Local API Test
  const localUrl = `http://localhost:5000/api/appointments/availability?date=${date}&service=${encodeURIComponent(service)}`;
  console.log('[LOCAL TEST]');
  console.log('[BOOKING DEBUG] API BASE URL: http://localhost:5000/api');
  console.log('[BOOKING DEBUG] AVAILABILITY URL:', localUrl);
  console.log('[BOOKING DEBUG] DATE:', date);
  const startLocal = Date.now();
  try {
    const resLocal = await axios.get(localUrl, { timeout: 10000 });
    console.log('[BOOKING DEBUG] RESPONSE STATUS:', resLocal.status);
    console.log('[BOOKING DEBUG] RESPONSE TIME:', Date.now() - startLocal, 'ms');
    const slots = resLocal.data?.data || [];
    console.log('[BOOKING DEBUG] TOTAL SLOTS:', slots.length);
    if (slots.length > 0) {
      console.log('[BOOKING DEBUG] FIRST 3 SLOTS:', slots.slice(0, 3).map(s => `${s.time} (${s.status})`).join(', '));
    }
  } catch (err) {
    console.error('[BOOKING DEBUG] LOCAL ERROR:', err.message, err.response ? err.response.status : 'No Response');
  }

  // Production API Test
  const prodUrl = `https://salman-backend.onrender.com/api/appointments/availability?date=${date}&service=${encodeURIComponent(service)}`;
  console.log('\n[PRODUCTION TEST]');
  console.log('[BOOKING DEBUG] API BASE URL: https://salman-backend.onrender.com/api');
  console.log('[BOOKING DEBUG] AVAILABILITY URL:', prodUrl);
  console.log('[BOOKING DEBUG] DATE:', date);
  const startProd = Date.now();
  try {
    const resProd = await axios.get(prodUrl, { timeout: 45000 });
    console.log('[BOOKING DEBUG] RESPONSE STATUS:', resProd.status);
    console.log('[BOOKING DEBUG] RESPONSE TIME:', Date.now() - startProd, 'ms');
    const slotsProd = resProd.data?.data || [];
    console.log('[BOOKING DEBUG] TOTAL SLOTS:', slotsProd.length);
    if (slotsProd.length > 0) {
      console.log('[BOOKING DEBUG] FIRST 3 SLOTS:', slotsProd.slice(0, 3).map(s => `${s.time} (${s.status})`).join(', '));
    }
  } catch (err) {
    console.error('[BOOKING DEBUG] PROD ERROR:', err.message, err.response ? err.response.status : 'No Response');
  }

  console.log('\n====================================================');
  console.log('EXACT REQUESTS TEST COMPLETE');
  console.log('====================================================');
}

testExactRequests();
