# SMP Notice Board Project

## Project Overview

This is a client-side web application for displaying notices, memos, and circulars to students at SMP (likely an educational institution). The application allows administrators to create, edit, and delete notices, which are then displayed to all users. Notices can be categorized by course, priority, importance, and category. A key feature is the ability to display scrolling messages derived from CSV data files, providing dynamic content like student fee dues.

The project is built with standard web technologies:
- HTML5
- CSS3 (with a dark mode theme)
- JavaScript (ES6+)

It uses localStorage for data persistence and has built-in synchronization capabilities with a JSONhost service for sharing notices across devices.

## Key Features

- **Notice Management**: Create, read, update, and delete notices with rich text content.
- **Categorization**: Notices can be tagged with course, priority, importance, and category.
- **Rich Text Editor**: Basic WYSIWYG editor for notice content.
- **Scrolling Messages**: Display dynamic lists of information (like student fee dues) by parsing CSV files and showing them in an animated scrolling view.
- **Admin Panel**: Password-protected interface for managing notices.
- **Dark/Light Mode**: Toggle between dark and light color schemes.
- **Responsive Design**: Adapts layout for desktop and mobile viewing.
- **Data Persistence**: Uses browser's localStorage to save notices.
- **Cloud Sync**: Built-in synchronization with JSONhost for multi-device access.

## File Structure

- `index.html`: Main HTML structure of the application.
- `style.css`: All styling, including dark mode and responsive design.
- `script.js`: Main application logic, including notice rendering, admin features, CSV parsing, and syncing.
- `smp-notices-sample.json`: Sample data for notices.
- `1.csv`: Sample CSV data file for scrolling messages.
- `README.md`: Brief project description.
- Other markdown files: Documentation and setup guides.

## Development Conventions

- Uses modern JavaScript (ES6+) with `async/await` for asynchronous operations.
- CSS uses custom properties (variables) for consistent theming.
- Responsive design follows a mobile-first approach.
- Code is structured into functions with clear responsibilities.
- Comments in `script.js` provide detailed explanations of complex logic, especially for the CSV scrolling feature.

## Running the Application

1. Simply open `index.html` in a modern web browser.
2. No build process or external dependencies are required.

To access the admin panel:
1. Click the "Admin" button in the header.
2. Enter the admin password (found in `script.js`, currently 'teju*smp').
3. Use the "Add Notice" button to create new notices.

## Data Management

### Local Storage

- Notices are saved to `localStorage` under the key `smpNotices`.
- Preferences like dark mode are also stored in `localStorage`.

### CSV Files

- CSV files are fetched directly by the browser using `fetch`.
- The application expects CSV files to be in the same directory.
- The primary sample file is `1.csv`, which contains student data.
- The CSV parsing logic in `script.js` is optimized for performance.

### JSONhost Sync (Built-in)

- The application can synchronize notices with a JSONhost endpoint.
- Configuration for this is hardcoded in `script.js` under `BUILT_IN_SYNC`.
- It automatically syncs data every 2 minutes when enabled.

## Customization

- **Admin Password**: Change the password in `script.js` (function `handleLogin`).
- **Styling**: Modify `style.css` to change the look and feel.
- **Sync Settings**: Update the `BUILT_IN_SYNC` object in `script.js` with your JSONhost credentials.
- **Sample Data**: Modify `smp-notices-sample.json` or `1.csv` for different initial data.

## Testing

There are no formal unit or integration tests included in the project. Testing is done manually by running the application in a browser and verifying functionality.

1. Open `index.html` in a browser.
2. Test adding, editing, and deleting notices via the admin panel.
3. Verify scrolling messages display correctly for notices with CSV data.
4. Check dark/light mode toggle.
5. Test local storage persistence by refreshing the page.
6. If configured, test JSONhost sync functionality.

## Build/Deployment

There is no build process. The project consists of static files that can be deployed to any web server or run directly from the file system.

1. Ensure all files (`index.html`, `style.css`, `script.js`, `*.csv`) are in the same directory.
2. Serve the directory with a web server, or open `index.html` directly in a browser.

Note: Direct file system access (file://) might have restrictions with `fetch` for CSV files. Using a local web server (e.g., Live Server extension in VS Code) is recommended for development.