# JSONhost Setup Guide for SMP Notice Board

## 📋 Overview
This guide will help you set up JSONhost integration for cross-device syncing of your SMP Notice Board data.

## 🔄 JSON Data Structure

The app uses the following JSON structure for storing notices:

```json
{
  "notices": [
    {
      "id": 1,
      "title": "Notice Title",
      "content": "Notice content description",
      "course": "CE|ME|EC|CS|EE|ALL",
      "priority": "High|Medium|Low",
      "category": "Notice|Memo|Result|Link",
      "date": "YYYY-MM-DD",
      "link": "https://optional-link.com"
    }
  ],
  "lastModified": "2025-08-22T12:00:00.000Z",
  "version": "1.0"
}
```

### 📊 Field Descriptions

| Field | Type | Description | Required | Values |
|-------|------|-------------|----------|---------|
| `id` | Number | Unique identifier for each notice | Yes | Auto-generated |
| `title` | String | Notice headline/title | Yes | Any text |
| `content` | String | Detailed notice content | Yes | Any text |
| `course` | String | Target course/department | Yes | CE, ME, EC, CS, EE, ALL |
| `priority` | String | Notice priority level | Yes | High, Medium, Low |
| `category` | String | Notice type/category | Yes | Notice, Memo, Result, Link |
| `date` | String | Notice publication date | Yes | YYYY-MM-DD format |
| `link` | String | Optional external link | No | Valid URL or empty string |

## 🚀 Setup Instructions

### Step 1: Create JSONhost Account
1. Go to [JSONhost.com](https://jsonhost.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Upload Initial Data
1. **Option A: Upload Sample File**
   - Download the `smp-notices-sample.json` file from this directory
   - Upload it to JSONhost via their web interface

2. **Option B: Create Empty Structure**
   ```json
   {
     "notices": [],
     "lastModified": "2025-08-22T12:00:00.000Z",
     "version": "1.0"
   }
   ```

### Step 3: Get Your Credentials
1. After uploading, note your **JSON ID** (e.g., `abc123def456ghi789`)
2. Go to your JSONhost admin interface
3. Enable **POST/PATCH requests**
4. Copy your **API Authorization Token**

### Step 4: Configure SMP Notice Board
1. Open your SMP Notice Board app
2. Login as admin using keyword: `teju*smp`
3. Go to **Sync Settings** tab
4. Enter your JSONhost ID and API token
5. Click **Test Connection** to verify
6. Click **Save Settings**
7. Enable **Auto-Sync** if desired

## 🔧 Sync Operations

### Manual Sync Options
- **Sync Now**: Upload current local data to cloud
- **Upload Local Data**: Force overwrite remote with local data
- **Download Remote Data**: Force overwrite local with remote data
- **Clear Local Data**: Delete all local notices (keeps remote data)

### Auto-Sync Features
- **Automatic Upload**: Syncs every 5 minutes when enabled
- **Real-time Sync**: Uploads after adding/editing/deleting notices
- **Offline Support**: Works offline, syncs when connection restored

## 🛡️ Security Notes

### API Token Security
- Keep your API token private and secure
- Don't share your JSONhost credentials
- Regularly rotate your API token if needed

### Data Privacy
- All data is encrypted in transit (HTTPS)
- JSONhost stores data securely in cloud
- Only you have access to your JSON data

## 🔄 Data Flow

```
Local App ←→ JSONhost Cloud ←→ Other Devices
     ↓              ↓              ↓
  Browser      Cloud Storage   Other Browsers
 localStorage      (JSON)      localStorage
```

## 🚨 Troubleshooting

### Common Issues
1. **Connection Failed**
   - Check your JSONhost ID is correct
   - Verify API token is valid
   - Ensure POST/PATCH requests are enabled

2. **Sync Failed**
   - Check internet connection
   - Verify API token hasn't expired
   - Try uploading data manually first

3. **Data Not Syncing**
   - Ensure auto-sync is enabled
   - Check that both ID and token are configured
   - Verify notices are being saved locally first

### Error Messages
- `HTTP 401`: Invalid or missing API token
- `HTTP 403`: POST/PATCH requests not enabled
- `HTTP 404`: JSONhost ID not found
- `HTTP 429`: Daily request limit reached

## 📱 Multi-Device Usage

### Setup on Additional Devices
1. Open SMP Notice Board on new device
2. Login as admin (`teju*smp`)
3. Go to Sync Settings
4. Enter same JSONhost ID and API token
5. Click **Download Remote Data** to get existing notices
6. Enable auto-sync for continuous syncing

### Data Conflict Resolution
- **Upload Local**: Use when local data is most recent
- **Download Remote**: Use when remote data is most recent
- **Manual Review**: Check both sources before deciding

## 🔄 Backup Recommendations

1. **Regular Exports**: Periodically download your JSON data from JSONhost
2. **Local Backups**: Browser localStorage serves as local backup
3. **Multiple Devices**: Use sync across multiple devices as distributed backup

## 📊 Usage Limits

### JSONhost Free Tier
- **Storage**: Limited JSON file size
- **Requests**: Daily API request limits
- **Features**: Basic GET/POST/PATCH operations

### Optimization Tips
- Auto-sync reduces manual sync requests
- Batch operations when possible
- Monitor your daily usage in JSONhost dashboard

---

**Need Help?** 
- Check JSONhost documentation: [docs.jsonhost.com](https://docs.jsonhost.com)
- Verify your app admin keyword: `teju*smp`
- Ensure your JSON structure matches the sample exactly