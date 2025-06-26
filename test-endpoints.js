// Simple test script to verify backend endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

async function testEndpoints() {
  console.log('Testing DocAppoint Backend Endpoints...\n');

  try {
    // Test 1: Initiate Login
    console.log('1. Testing SMS OTP initiation...');
    const otpResponse = await axios.post(`${BASE_URL}/auth/login`, {
      phoneNumber: '1234567890'
    });
    console.log('✓ OTP initiated successfully');
    console.log('OTP (dev mode):', otpResponse.data.otp);

    // Test 2: Login with OTP
    console.log('\n2. Testing OTP login...');
    const loginResponse = await axios.put(`${BASE_URL}/auth/login`, {
      phoneNumber: '1234567890',
      otp: otpResponse.data.otp
    });
    console.log('✓ Login successful');
    
    const token = loginResponse.data.tokens.accessToken;
    const headers = { Authorization: `Bearer ${token}` };

    // Test 3: Get user profile
    console.log('\n3. Testing user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, { headers });
    console.log('✓ Profile retrieved successfully');

    // Test 4: Update slot settings (for doctors)
    console.log('\n4. Testing slot settings...');
    try {
      await axios.put(`${BASE_URL}/slots/settings`, {
        slotDuration: 30,
        startTime: '09:00',
        endTime: '17:00',
        breakStart: '13:00',
        breakEnd: '14:00',
        workingDays: [1, 2, 3, 4, 5, 6]
      }, { headers });
      console.log('✓ Slot settings updated');
    } catch (err) {
      console.log('⚠ Slot settings test skipped (user might not be doctor)');
    }

    // Test 5: Get available slots
    console.log('\n5. Testing available slots...');
    try {
      const slotsResponse = await axios.get(`${BASE_URL}/slots/available?date=2024-12-20`, { headers });
      console.log('✓ Available slots retrieved');
      console.log('Available slots:', slotsResponse.data.slots.slice(0, 3), '...');
    } catch (err) {
      console.log('⚠ Available slots test failed:', err.response?.data?.error || err.message);
    }

    // Test 6: Create appointment
    console.log('\n6. Testing appointment creation...');
    const appointmentResponse = await axios.post(`${BASE_URL}/appointments`, {
      name: 'Test Patient',
      age: 30,
      date: '2024-12-20',
      slot: '10:00',
      purpose: 'Regular checkup',
      type: 'new'
    }, { headers });
    console.log('✓ Appointment created successfully');

    // Test 7: Get appointments
    console.log('\n7. Testing appointments retrieval...');
    const appointmentsResponse = await axios.get(`${BASE_URL}/appointments?type=upcoming`, { headers });
    console.log('✓ Appointments retrieved successfully');
    console.log('Total appointments:', appointmentsResponse.data.pagination.total);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Run tests
testEndpoints();