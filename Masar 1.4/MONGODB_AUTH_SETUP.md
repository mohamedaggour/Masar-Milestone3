# MongoDB Authentication Setup Guide

This guide will help you get the Masar app up and running with MongoDB authentication.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI installed globally (`npm install -g expo-cli`)

## Project Structure

```
Masar Updated 3/
├── server.js                 # Express backend server
├── package.json             # Dependencies
├── .env                     # Environment variables
├── App.js                   # Main app navigation
├── src/
│   ├── screens/
│   │   ├── Login.js        # Login screen
│   │   ├── Signup.js       # Signup screen
│   │   ├── Profile.js      # User profile screen
│   │   └── ...other screens
│   ├── context/
│   │   └── UserContext.js  # Authentication context
│   └── components/
│       └── ...
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd "Masar Updated 3"
npm install
```

This will install:
- **Frontend**: React Native, Expo, React Navigation
- **Backend**: Express, MongoDB (Mongoose), bcryptjs, jsonwebtoken

### 2. Configure Environment

The `.env` file is already configured with:
```
PORT=5000
MONGODB_URI=mongodb+srv://mo_masar:Mo201567@masar1.tcv6q8u.mongodb.net/masar
JWT_SECRET=your_secret_key_change_in_production
```

**Important**: For production, change the `JWT_SECRET` to a secure random string.

### 3. Start the Backend Server

In a terminal:
```bash
npm run server
```

You should see:
```
MongoDB connected
Server running on port 5000
```

### 4. Start the Expo App

In another terminal:
```bash
npm start
```

Then choose:
- Press `w` for web
- Press `i` for iOS simulator
- Press `a` for Android emulator

## How It Works

### Authentication Flow

1. **User Opens App** → Login/Signup screens are shown
2. **User Signs Up** → 
   - Data sent to backend
   - Password hashed with bcryptjs
   - User created in MongoDB with balance = 0
   - JWT token generated
3. **User Logs In** →
   - Credentials verified against MongoDB
   - JWT token generated
   - User redirected to home screen
4. **User Logged In** →
   - Tabs navigation visible
   - All features accessible
   - Balance starts at 0 EGP
5. **User Logs Out** →
   - Session cleared
   - Redirected to Login screen

### Database Schema

Users in MongoDB have the following structure:
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  balance: Number (default: 0),
  createdAt: Date
}
```

### API Endpoints

#### Sign Up
```
POST /auth/signup
Body: {
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
  phone: "+201234567890"
}
Response: {
  success: true,
  token: "jwt_token_here",
  user: { id, email, name, phone, balance }
}
```

#### Log In
```
POST /auth/login
Body: {
  email: "user@example.com",
  password: "password123"
}
Response: {
  success: true,
  token: "jwt_token_here",
  user: { id, email, name, phone, balance }
}
```

#### Get User
```
GET /auth/user/:userId
Response: {
  success: true,
  user: { id, email, name, phone, balance }
}
```

#### Update Balance
```
PUT /auth/user/:userId/balance
Body: {
  balance: 100
}
Response: {
  success: true,
  user: { id, email, name, phone, balance }
}
```

## Testing the App

### Test Sign Up Flow
1. Open the app → You see Login screen
2. Click "Sign Up"
3. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `+201234567890`
   - Password: `password123`
   - Confirm: `password123`
4. Click "Create Account"
5. You should be redirected to Home screen
6. Balance should be `0 EGP`

### Test Log In Flow
1. Click Settings → Logout
2. Fill in the login form:
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Sign In"
4. You should be redirected to Home screen
5. Balance should still be `0 EGP`

### Test Add Funds
1. While logged in, go to Home
2. Click "+ Add Funds"
3. Enter amount (e.g., `50`)
4. Balance should update to `50 EGP`

### Test Logout
1. Go to Settings
2. Click "Logout"
3. You should be redirected to Login screen

## Features Implemented

✅ **Authentication System**
- Sign up with email, password, name, phone
- Secure password hashing (bcryptjs)
- JWT token generation and storage
- Persistent login with AsyncStorage

✅ **Starting Balance**
- All new users start with 0 EGP balance
- Balance stored in MongoDB
- Balance persists across app restarts

✅ **Initial Screen**
- App opens to Login/Signup if not authenticated
- Automatically shows Home if already logged in

✅ **Logout Functionality**
- Available in Settings tab and Profile tab
- Clears all user data
- Redirects to Login screen

✅ **User Profile**
- Display user name, email, phone
- Show membership date
- Logout button in Profile

✅ **Error Handling**
- Email validation
- Password validation (min 6 characters)
- Password confirmation matching
- Duplicate email detection
- Invalid login credentials
- Network error handling

## Troubleshooting

### Backend Connection Issues
- Make sure backend is running: `npm run server`
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas account has correct IP whitelist

### Login Issues
- Check email is exactly as registered
- Password is case-sensitive
- Account may not exist yet

### Balance Not Updating
- Make sure you're logged in
- Wait a moment for API response
- Check network connection

### App Not Starting
- Delete `node_modules` folder: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear cache: `npm start -- --reset-cache`

## Configuration for Device Testing

To test on an actual device (not simulator):

1. **Find your computer's IP address**:
   ```bash
   # On Mac/Linux
   ifconfig | grep inet
   
   # On Windows
   ipconfig
   ```

2. **Update API URL in UserContext.js**:
   ```javascript
   const API_URL = 'http://YOUR_IP_ADDRESS:5000';
   ```

3. **Make sure device is on same WiFi**

4. **Make sure firewall allows port 5000**

## MongoDB Atlas Tips

- Connection string is already configured
- Database name: `masar`
- Collections created automatically on first use
- Check collections at: https://cloud.mongodb.com

## Security Notes

⚠️ **For Production**:
1. Change `JWT_SECRET` in `.env`
2. Change MongoDB password
3. Enable additional MongoDB security (2FA, IP whitelist)
4. Use HTTPS instead of HTTP
5. Add rate limiting on API endpoints
6. Implement refresh tokens for JWT
7. Add input validation and sanitization
8. Use environment-specific `.env` files

## Next Steps

- Add email verification for signups
- Implement password reset functionality
- Add payment integration
- Implement trip history persistence in MongoDB
- Add user preferences/settings to MongoDB
- Implement admin dashboard

## Support

For issues or questions, check:
1. Console logs in terminal
2. MongoDB Atlas logs
3. Network tab in browser DevTools
4. Make sure all dependencies are installed
