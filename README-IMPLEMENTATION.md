# DocAppoint Backend Implementation

## New Features Implemented

### 1. Slot Management System
- **Models**: `SlotSettings` and `BlockedSlot` for managing doctor availability
- **Controller**: `slot.controller.ts` with full CRUD operations
- **Routes**: `/api/slots/*` endpoints

### 2. Google Authentication
- **Enhanced**: `auth.controller.ts` to support Google Sign-In via Firebase
- **Support**: Both SMS OTP and Google authentication methods

### 3. Enhanced Appointment System
- **Updated**: Appointment model to support dynamic time slots
- **Improved**: Status management (pending, confirmed, completed, cancelled)

## API Endpoints

### Slot Management
```
GET    /api/slots                 - Get doctor's slot settings and blocked slots
GET    /api/slots/available       - Get available slots for a date
PUT    /api/slots/settings        - Update slot settings
POST   /api/slots/block          - Block a specific slot
POST   /api/slots/unblock        - Unblock a specific slot
```

### Authentication
```
POST   /api/auth/login           - Initiate SMS OTP login
PUT    /api/auth/login           - Complete login (SMS OTP or Google)
POST   /api/auth/refresh         - Refresh tokens
```

### Appointments (Enhanced)
```
GET    /api/appointments         - Get appointments (role-based filtering)
POST   /api/appointments         - Create appointment
GET    /api/appointments/:id     - Get specific appointment
PATCH  /api/appointments/:id     - Update appointment
```

## Database Schema

### SlotSettings
```javascript
{
  doctor: ObjectId,           // Reference to doctor
  slotDuration: Number,       // 15, 30, 45, or 60 minutes
  startTime: String,          // "09:00"
  endTime: String,            // "17:00"
  breakStart: String,         // "13:00"
  breakEnd: String,           // "14:00"
  workingDays: [Number]       // [1,2,3,4,5,6] (Mon-Sat)
}
```

### BlockedSlot
```javascript
{
  doctor: ObjectId,           // Reference to doctor
  date: String,               // "2024-12-20"
  slot: String                // "10:00"
}
```

### Updated Appointment
```javascript
{
  // ... existing fields
  slot: String,               // Dynamic time slot (e.g., "10:00")
  status: String              // pending, confirmed, completed, cancelled
}
```

## How to Test

1. **Start the backend**:
   ```bash
   cd /home/infin1ty/GitHub/Personal/DocAppoint-BE
   npm run dev
   ```

2. **Run test script**:
   ```bash
   node test-endpoints.js
   ```

3. **Test with frontend**:
   - Start frontend: `npm run dev` (port 3000)
   - Backend runs on port 4000
   - Test Google Sign-In and slot management features

## Key Features

### For Doctors:
- Set working hours and slot duration
- Block/unblock specific time slots
- View and manage appointments
- Mark appointments as completed

### For Patients:
- Book appointments with real-time slot availability
- Edit/cancel appointments
- Choose between SMS OTP or Google Sign-In

### System Features:
- Real-time slot availability checking
- Conflict prevention (no double booking)
- Role-based access control
- JWT token authentication
- Firebase Google authentication integration

## Environment Variables Required
```
PORT=4000
DB_URL=mongodb://localhost:27017/docAppoint
JWT_SECRET=your_jwt_secret
FIREBASE_* (Firebase configuration for Google auth)
```

The implementation is complete and ready for testing!