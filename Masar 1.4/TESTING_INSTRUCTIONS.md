# Testing Instructions

## Full Setup & Testing Flow

### Phase 1: Environment Setup

**Step 1: Install All Dependencies**
```bash
cd "Masar Updated 3"
npm install
```

Expected output:
```
added XXX packages in XXs
```

**Step 2: Verify MongoDB Connection**
- Check that your MongoDB Atlas credentials are correct in `.env`
- Connection string: `mongodb+srv://mo_masar:Mo201567@masar1.tcv6q8u.mongodb.net/masar`

### Phase 2: Start Services

**Step 3: Start Backend Server (Terminal 1)**
```bash
npm run server
```

Expected output:
```
MongoDB connected
Server running on port 5000
```

If you see errors:
- Check MongoDB Atlas credentials
- Ensure port 5000 is available
- Check internet connection

**Step 4: Start Frontend App (Terminal 2)**
```bash
npm start
```

Expected output:
```
> expo start
...
Expo DevTools is running at ws://localhost:19000
Ready at http://localhost:19000
```

**Step 5: Choose Platform**
- Press `w` for Web
- Press `i` for iOS Simulator
- Press `a` for Android Emulator

### Phase 3: Authentication Testing

#### Test 3A: Sign Up Flow ✅

1. **App loads** → You see the **Login** screen (not home screen)
2. **Tap** "Sign Up" link at bottom
3. **Fill in the form**:
   ```
   Full Name: John Doe
   Email: john@test.com
   Phone: +201234567890
   Password: password123
   Confirm Password: password123
   ```
4. **Click** "Create Account"
5. **Wait** for processing (should see loading spinner)
6. **Verify Success**:
   - You're redirected to **Home** screen
   - Balance shows **0 EGP** ✅
   - All tabs (Home, Booking, Stations, Settings, Profile) are visible

**Test Tip**: Check browser console for any errors

#### Test 3B: Login Flow (Same Account)

1. **Go to** Settings tab
2. **Scroll down** and click **"Logout"**
3. **Confirm** logout in alert dialog
4. **You see** Login screen again
5. **Fill in**:
   ```
   Email: john@test.com
   Password: password123
   ```
6. **Click** "Sign In"
7. **Verify Success**:
   - Redirected to Home
   - Same balance (0 EGP) persists ✅
   - All screens accessible

**Test Tip**: Password is case-sensitive

#### Test 3C: Login with Wrong Credentials

1. **On Login screen**, enter:
   ```
   Email: john@test.com
   Password: wrongpassword
   ```
2. **Click** "Sign In"
3. **Verify Error**: Alert shows "Invalid email or password" ✅

#### Test 3D: Duplicate Email on Signup

1. **Go to** Settings → Logout
2. **On Signup**, try to register with:
   ```
   Email: john@test.com  (same as before)
   (fill other fields)
   ```
3. **Click** "Create Account"
4. **Verify Error**: Alert shows "Email already registered" ✅

#### Test 3E: Signup Validation

1. **On Signup screen**, try submitting with blank fields
2. **Verify**: Error messages show for each field ✅
3. **Try** password under 6 characters
4. **Verify**: Error "Password must be at least 6 characters" ✅
5. **Try** non-matching passwords
6. **Verify**: Error "Passwords do not match" ✅

### Phase 4: User Profile Testing

#### Test 4A: Profile Display When Logged In

1. **Go to** Profile tab
2. **Verify displayed**:
   - User avatar/icon ✅
   - Full name (John Doe) ✅
   - Membership date ✅
3. **Scroll down** to see:
   - Email (john@test.com) ✅
   - Phone (+201234567890) ✅
   - Logout button ✅

#### Test 4B: Profile When Logged Out

1. **Logout** from Settings
2. **Navigate** to Profile (if still in tabs)
3. **Verify**: Shows "Not Logged In" message ✅

### Phase 5: Balance Testing

#### Test 5A: Initial Balance

1. **After signup**, go to Home
2. **Verify**: Balance shows "EGP 0.00" ✅

#### Test 5B: Add Funds

1. **On Home**, click "+ Add Funds"
2. **Enter amount**: 50
3. **Verify**:
   - Modal appears (if implemented)
   - Balance updates to 50 EGP ✅
4. **Logout and login again**
5. **Verify**: Balance still 50 EGP (persisted) ✅

### Phase 6: Navigation Testing

#### Test 6A: Tab Navigation When Logged In

1. **After login**, verify all tabs work:
   - **Home** - Shows balance and features ✅
   - **Booking** - Booking interface ✅
   - **Stations** - Map with metro stations ✅
   - **Settings** - Settings and logout ✅
   - **Profile** - User profile ✅

#### Test 6B: Cannot Access Tabs When Logged Out

1. **Logout**
2. **Verify**: Only Login/Signup screens visible ✅
3. **Cannot access** any other screens

### Phase 7: Persistence Testing

#### Test 7A: App Restart (Web)

1. **While logged in**, refresh the page (F5)
2. **Verify**: Still logged in, balance persists ✅
3. **Logout**
4. **Refresh**
5. **Verify**: Back to Login screen ✅

#### Test 7B: App Restart (Mobile Simulator)

1. **Close and reopen** the app
2. **Verify**: Maintains login state ✅

### Phase 8: Multiple Accounts Testing

#### Test 8A: Create Second Account

1. **Logout** from first account
2. **Sign up** with:
   ```
   Email: jane@test.com
   Password: jane123456
   Name: Jane Smith
   Phone: +201234567891
   ```
3. **Verify**: Successfully created ✅
4. **Verify**: Fresh 0 EGP balance ✅

#### Test 8B: Switch Between Accounts

1. **Logout**
2. **Login** with john@test.com
3. **Verify**: Johns's data (previous balance) ✅
4. **Logout**
5. **Login** with jane@test.com
6. **Verify**: Jane's data (0 EGP) ✅

### Phase 9: Error Handling

#### Test 9A: Network Error Handling

1. **Turn off internet**
2. **Try to login/signup**
3. **Verify**: Shows appropriate error ✅
4. **Turn on internet**
5. **Try again** - should work ✅

#### Test 9B: Invalid Email Format

1. **On Signup**, enter email: `notanemail`
2. **Try submit**
3. **Verify**: Error "Invalid email format" ✅

#### Test 9C: Missing Required Fields

1. **On Signup**, leave Name empty
2. **Try submit**
3. **Verify**: Error "Name is required" ✅

## Test Data to Use

### Test Account 1
```
Email: john@test.com
Password: password123
Name: John Doe
Phone: +201234567890
```

### Test Account 2
```
Email: jane@test.com
Password: jane123456
Name: Jane Smith
Phone: +201234567891
```

### Test Account 3
```
Email: admin@test.com
Password: admin12345
Name: Admin User
Phone: +201234567892
```

## Expected Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Signup | ✅ | Creates user with 0 balance |
| Login | ✅ | Authenticates with email/password |
| Logout | ✅ | Clears session |
| Login Screen First | ✅ | Shown if not authenticated |
| Initial Balance 0 | ✅ | All new users |
| Profile Display | ✅ | Shows user info |
| Persistence | ✅ | Survives app restart |
| Multi-account | ✅ | Can switch between users |
| Error Messages | ✅ | Appropriate validation |
| Balance Updates | ✅ | Syncs with backend |

## Troubleshooting During Testing

| Issue | Solution |
|-------|----------|
| Backend not connecting | Ensure `npm run server` is running |
| Login page doesn't appear | App might be cached, try hard refresh |
| Signup fails with network error | Check backend server is running |
| Balance not updating | Ensure backend is responding, check console |
| Can't add funds | If not implemented, that's expected |
| Stuck on loading | Check backend logs, might be MongoDB issue |

## Console Debugging

Check your browser console or app logs for:
- `POST /auth/signup` requests/responses
- `POST /auth/login` requests/responses
- `MongoDB connected` message
- Any error messages

## Final Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Login screen shows on app load
- [ ] Can sign up successfully
- [ ] Balance initializes to 0 EGP
- [ ] Can login with email/password
- [ ] Can logout
- [ ] Profile shows user info
- [ ] All tabs accessible when logged in
- [ ] Data persists across app restart
- [ ] Error messages show correctly
- [ ] Multiple accounts work independently

## Success Criteria

✅ All tests pass → MongoDB authentication is working correctly!

You can now:
- Deploy the app with persistent user authentication
- Add more features (payments, trip history, etc.)
- Scale the backend independently
