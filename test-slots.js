const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

async function testSlots() {
  try {
    console.log('Testing slot availability...\n');

    // First, create a user and get token
    const otpResponse = await axios.post(`${BASE_URL}/auth/login`, {
      phoneNumber: '1234567890'
    });
    
    const loginResponse = await axios.put(`${BASE_URL}/auth/login`, {
      phoneNumber: '1234567890',
      otp: otpResponse.data.otp
    });
    
    const token = loginResponse.data.tokens.accessToken;
    const headers = { Authorization: `Bearer ${token}` };

    // Test available slots for today
    const today = new Date().toISOString().split('T')[0];
    console.log(`Testing available slots for ${today}...`);
    
    const slotsResponse = await axios.get(`${BASE_URL}/slots/available?date=${today}`, { headers });
    console.log('Available slots:', slotsResponse.data.slots);
    
    if (slotsResponse.data.slots.length > 0) {
      console.log('✅ Slots are available!');
    } else {
      console.log('❌ No slots available');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
  }
}

testSlots();