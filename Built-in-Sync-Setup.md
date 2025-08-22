# Built-in JSONhost Sync Setup Instructions

## 🔧 Quick Setup (5 Minutes)

### Step 1: Create JSONhost Account
1. Go to [jsonhost.com](https://jsonhost.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Upload Initial Data
1. Upload the `smp-notices-sample.json` file to JSONhost
2. Note the JSON ID (e.g., `abc123def456`)
3. Enable POST/PATCH requests in admin settings
4. Copy your API Authorization Token

### Step 3: Configure the App
1. Open `script.js` file
2. Find the `BUILT_IN_SYNC` configuration (around line 99)
3. Replace the values:

```javascript
const BUILT_IN_SYNC = {
    jsonHostId: 'your-actual-json-id-here', // Replace with your JSONhost ID
    jsonHostToken: 'your-actual-token-here', // Replace with your API token
    autoSync: true,
    enabled: true // Set to false to disable all sync
};
```

### Step 4: Save and Test
1. Save the `script.js` file
2. Open `index.html` in your browser
3. Check the sync status indicator in admin panel
4. Add/edit a notice to test automatic syncing

## 🎯 Features

### ✅ **What Works Automatically:**
- **Auto-sync every 3 minutes** when enabled
- **Real-time sync** after adding/editing/deleting notices
- **Startup sync** - downloads latest data when app loads
- **Auto-initialization** - creates remote data if it doesn't exist
- **Local storage backup** - works offline with sync when online
- **Status indicators** - shows sync connection status

### 🔄 **Sync Behavior:**
- **On startup**: Downloads latest notices from cloud
- **After changes**: Immediately uploads changes to cloud
- **Every 3 minutes**: Background sync to cloud
- **Offline mode**: Saves locally, syncs when online

### 📊 **Status Indicators:**
- **🟢 Connected**: "Auto-sync enabled" or "Last synced: [time]"
- **🟡 Connecting**: "Testing connection..."
- **🔴 Error**: "Connection failed" or "Sync disabled"

## 🛠️ Configuration Options

### Enable/Disable Sync
```javascript
const BUILT_IN_SYNC = {
    enabled: false // Set to false to disable all sync features
};
```

### Change Sync Frequency
```javascript
// In setupAutoSync() function, change interval (currently 3 minutes)
3 * 60 * 1000  // 3 minutes in milliseconds
```

### Disable Auto-Sync (Manual Only)
```javascript
const BUILT_IN_SYNC = {
    autoSync: false // Disables automatic background sync
};
```

## 🔐 Security Notes

### Protect Your Credentials
- Keep your API token private
- Don't commit credentials to public repositories
- Consider using environment variables for production

### Example with Environment Variables:
```javascript
const BUILT_IN_SYNC = {
    jsonHostId: process.env.JSONHOST_ID || 'fallback-id',
    jsonHostToken: process.env.JSONHOST_TOKEN || 'fallback-token',
    autoSync: true,
    enabled: true
};
```

## 🌐 Multi-Device Setup

### Setting up on Additional Devices:
1. Copy the same `BUILT_IN_SYNC` configuration to all devices
2. Open the app on each device
3. Latest notices will automatically download
4. All changes sync across all devices

### Conflict Resolution:
- **Last change wins** - most recent edit takes priority
- **Automatic sync** prevents most conflicts
- **Local backup** ensures no data loss

## 🚨 Troubleshooting

### Common Issues:

1. **"Connection failed"**
   - Check JSONhost ID is correct
   - Verify API token is valid
   - Ensure POST/PATCH requests are enabled on JSONhost

2. **"Sync disabled"**
   - Set `enabled: true` in BUILT_IN_SYNC config
   - Check internet connection

3. **"Auto-sync failed"**
   - Usually temporary network issue
   - Check browser console for detailed error
   - Sync will retry automatically

### Console Debugging:
Open browser developer tools (F12) and check console for:
- `Synced to remote successfully`
- `Synced from remote successfully`
- `Auto-sync completed`

## 📱 Testing Your Setup

### Verification Steps:
1. **Test 1**: Add a notice → should see "Synced: [time]"
2. **Test 2**: Open app in another browser/device → should load same notices
3. **Test 3**: Edit notice → should sync across devices
4. **Test 4**: Check browser console for sync messages

### Sample Test Data:
The app includes sample notices for all courses (CE, ME, EC, CS, EE). You can:
- Edit existing notices to test sync
- Add new notices with different priorities
- Delete notices to test removal sync

## 📈 Usage Monitoring

### Check Your JSONhost Usage:
1. Login to your JSONhost dashboard
2. Monitor API request count
3. Track data storage usage
4. Adjust sync frequency if needed

### Optimize for Usage Limits:
- Reduce auto-sync frequency for high-traffic sites
- Use manual sync for development/testing
- Monitor console logs for excessive API calls

---

**Ready to go!** Your SMP Notice Board now has enterprise-level cross-device syncing built right in.