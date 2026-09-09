const axios = require('axios');
const PROD_URL = 'https://salman-backend.onrender.com/api';

async function checkSharedSlot() {
  const date = '2026-09-15';
  const menRes = await axios.get(`${PROD_URL}/appointments/availability?date=${date}&service=male-haircut`);
  const womenRes = await axios.get(`${PROD_URL}/appointments/availability?date=${date}&service=female-balayage`);

  const men11Slot = (menRes.data?.data || []).find(s => s.time === '11:00 AM');
  const women11Slot = (womenRes.data?.data || []).find(s => s.time === '11:00 AM');

  console.log('--- 11:00 AM Slot Status Check ---');
  console.log('Men 11:00 AM Slot:', men11Slot);
  console.log('Women 11:00 AM Slot:', women11Slot);
}

checkSharedSlot();
