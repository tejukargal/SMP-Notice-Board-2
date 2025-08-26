# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an SMP Notice Board application - a web-based notice management system for engineering colleges. It displays notices in a modern card-based interface with horizontal swiping, dark/light mode support, admin management capabilities, and cross-device synchronization.

## Application Architecture

### Core Components
- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Data Storage**: localStorage + optional JSONhost cloud sync
- **Styling**: Custom CSS with dark/light themes and mobile-first responsive design
- **Authentication**: Simple keyword-based admin access (`teju*smp`)

### Key Files Structure
- `index.html` - Main application interface with admin panel and login modal
- `script.js` - All application logic including notice management, sync, and UI interactions
- `style.css` - Complete styling with responsive design and dark/light themes
- `1.csv` - Student data for scrolling messages (format: Name,Father,Year,Course,Amount)
- `smp-notices-sample.json` - Sample data structure for notices

### Data Models

#### Notice Object Structure
```javascript
{
    id: Number,               // Auto-generated unique ID
    title: String,           // Notice headline
    content: String,         // HTML content (rich text)
    course: String,          // "CE|ME|EC|CS|EE|ALL"
    priority: String,        // "High|Medium|Low"
    importance: String,      // "Critical|Urgent|Important|Normal"
    category: String,        // "Notice|Memo|Result|Link"
    date: String,           // YYYY-MM-DD format
    links: Array,           // [{title, url}] optional external links
    fontSize: String,       // CSS font-size value
    scrollingEnabled: Boolean,   // Enable CSV scrolling messages
    scrollingLabel: String,     // Label for scrolling section
    scrollingSpeed: String,     // "slow|medium|fast|speed"
    order: Number              // For CSV file selection (1.csv, 2.csv, etc.)
}
```

#### CSV Data Structure
CSV files should follow this format for scrolling messages:
```
Student Name,Father Name,Year,Course,Total Paid
SHRUSTI,ABC,1st Yr,CS,11988
SYED SUHAN,ABC,1st Yr,CS,11988
```

**Expected CSV Columns:**
- Column 0: Student Name (string)
- Column 1: Father Name (string) 
- Column 2: Year (string, e.g., "1st Yr", "2nd Yr")
- Column 3: Course (string, e.g., "CS", "CE", "ME", "EC", "EE")
- Column 4: Total Paid (number/string, fees amount)

## Development Commands

### Running the Application
```bash
# Simply open in any web server or directly in browser
open index.html
# OR serve with any local server
python -m http.server 8000
# OR
npx serve .
```

### No Build Process Required
This is a static HTML/CSS/JavaScript application with no build dependencies.

## Key Functionality

### Notice Management
- **CRUD Operations**: Create, read, update, delete notices via admin panel
- **Rich Text Editing**: Built-in WYSIWYG editor with formatting options
- **Priority Sorting**: Automatic sorting by importance (Critical → Urgent → Important → Normal)
- **Course Filtering**: Notices targeted to specific engineering departments
- **Link Attachments**: Support for external URLs with custom titles

### Scrolling Messages Feature
- **CSV Integration**: Reads student data from numbered CSV files (1.csv, 2.csv, etc.)
- **Dynamic Display**: Smooth scrolling animation of student fee/dues information
- **Mobile Optimized**: Touch to pause/resume functionality
- **Performance Optimized**: Batched processing and caching for large datasets

### Cross-Device Synchronization
- **JSONhost Integration**: Cloud sync using JSONhost.com service
- **Auto-sync**: Background synchronization every 2 minutes when enabled
- **Real-time Sync**: Immediate sync after notice modifications
- **Offline Support**: Works offline with sync when connection restored
- **Configuration**: Edit `BUILT_IN_SYNC` object in script.js:1957

```javascript
const BUILT_IN_SYNC = {
    jsonHostId: 'your-jsonhost-id',
    jsonHostToken: 'your-api-token', 
    autoSync: true,
    enabled: true
};
```

### UI/UX Features
- **Mobile-First Design**: Optimized for touch devices with grid layout on mobile
- **Card-Based Interface**: Grid layout for notices (responsive columns)
- **Dark/Light Themes**: Toggle between themes with preference storage
- **Responsive Layout**: Grid auto-fits to screen size (300px+ columns)
- **Rich Animations**: Smooth transitions and hover effects
- **Popup Modals**: Click-to-expand detailed notice view with scrolling content

## Admin Access

### Login Credentials
- **Admin Keyword**: `teju*smp`
- **Access**: Click "Admin" button → enter keyword → full CRUD access

### Admin Features
- Add/Edit/Delete notices
- Rich text content editing
- Manage external links
- Configure scrolling messages
- Sync settings and controls

## Important Implementation Details

### Notice Rendering Logic
- **Auto-sorting**: `sortAndReorderNotices()` function prioritizes by importance then date
- **Serial Numbers**: IDs are reassigned after sorting to maintain sequence
- **Color Coding**: Each card gets unique gradient colors via CSS nth-child selectors
- **Grid Layout**: Uses CSS Grid with `repeat(auto-fit, minmax(300px, 1fr))` for responsive columns
- **Popup System**: Cards are compact; full content shown in modal on click

### CSV Processing
- **File Loading**: `loadAllCSVFiles()` preloads common CSV files at startup
- **Dynamic Association**: Uses notice.order property to map to CSV files (1.csv, 2.csv)
- **Optimized Parsing**: Batch processing for performance with large datasets
- **Error Handling**: Graceful fallbacks when CSV files are missing

### Sync Architecture  
- **Local First**: Always save to localStorage immediately
- **Background Sync**: Periodic uploads to cloud storage
- **Conflict Resolution**: Last-write-wins with local backup preservation
- **Status Indicators**: Real-time sync status in admin panel

### Mobile Performance
- **Hardware Acceleration**: CSS transforms with will-change properties
- **Touch Optimization**: Proper touch-action and tap-highlight settings
- **Scroll Snap**: Native scroll-snap for card positioning
- **Memory Management**: Efficient DOM manipulation and event handling

## Configuration Notes

### Sync Setup
1. Create account at jsonhost.com
2. Upload `smp-notices-sample.json` or empty structure
3. Enable POST/PATCH requests 
4. Configure `BUILT_IN_SYNC` in script.js with your credentials
5. Test connection in admin panel

### CSV Data Setup
- Place CSV files as `1.csv`, `2.csv`, etc. in root directory
- Configure notice.order property to match CSV file number
- CSV format: Student Name, Father Name, Year, Course, Total Paid

### Theme Customization
- CSS custom properties in `:root` define color scheme
- Dark mode variants in `.dark-mode` selectors
- Responsive breakpoints at 768px and 480px

## Development Tips

### Common Tasks
- **Testing CSV**: Use browser dev tools to check `csvData` object for loaded files
- **Debugging Sync**: Check console for sync status messages and connection errors
- **Layout Issues**: Grid layout adapts automatically; check CSS Grid DevTools
- **Performance**: Scrolling messages use hardware acceleration and batched processing

### File Structure Navigation
- All core logic in `script.js` (no build system required)
- CSS custom properties for easy theming in `style.css`
- Sample data structure in `smp-notices-sample.json`
- Student data in `1.csv` (extensible to 2.csv, 3.csv, etc.)