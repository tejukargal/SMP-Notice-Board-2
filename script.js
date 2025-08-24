// Sample notices data
// CSV data cache - following reference implementation structure
let csvData = {};

// CSV loading status
let csvLoadingStatus = {
    loaded: false,
    files: {},
    promises: {}
};

let notices = [
    {
        id: 1,
        title: "Semester Exam Time Table",
        content: "The time table for upcoming semester examinations has been released. Students are advised to check the examination schedule and prepare accordingly.",
        course: "ALL",
        priority: "High",
        importance: "Critical",
        category: "Notice",
        date: "2025-08-20",
        link: "",
        scrollingEnabled: false,
        scrollingLabel: '',
        scrollingSpeed: 'medium',
        order: 1
    },
    {
        id: 2,
        title: "Workshop on AutoCAD",
        content: "A hands-on workshop on AutoCAD software will be conducted for final year students. Registration is mandatory.",
        course: "CE",
        priority: "Medium",
        importance: "Urgent",
        category: "Notice",
        date: "2025-08-18",
        link: "",
        scrollingEnabled: false,
        scrollingLabel: '',
        scrollingSpeed: 'medium',
        order: 1
    },
    {
        id: 3,
        title: "Industrial Visit - Toyota Motors",
        content: "Industrial visit to Toyota Motors manufacturing unit has been arranged for mechanical engineering students.",
        course: "ME",
        priority: "Medium",
        importance: "Important",
        category: "Notice",
        date: "2025-08-17",
        link: "",
        scrollingEnabled: false,
        scrollingLabel: '',
        scrollingSpeed: 'medium',
        order: 1
    },
    {
        id: 4,
        title: "Scholarship Applications Open",
        content: "Merit-based scholarship applications are now open for all courses. Last date for submission is 30th August 2025.",
        course: "ALL",
        priority: "High",
        importance: "Urgent",
        category: "Memo",
        date: "2025-08-15",
        link: "https://scholarship.gov.in",
        scrollingEnabled: false,
        scrollingLabel: '',
        scrollingSpeed: 'medium',
        order: 1
    },
    {
        id: 5,
        title: "Programming Contest Results",
        content: "Results of the inter-department programming contest have been declared. Congratulations to all winners!",
        course: "CS",
        priority: "Low",
        importance: "Normal",
        category: "Result",
        date: "2025-08-14",
        link: "",
        scrollingEnabled: false,
        scrollingLabel: '',
        scrollingSpeed: 'medium',
        order: 1
    },
    {
        id: 6,
        title: "Circuit Design Competition",
        content: "Annual circuit design competition for Electronics and Electrical students. Prize money up to Rs. 10,000.",
        course: "EC",
        priority: "Medium",
        importance: "Important",
        category: "Notice",
        date: "2025-08-12",
        link: "",
        scrollingEnabled: false,
        scrollingLabel: '',
        scrollingSpeed: 'medium',
        order: 1
    },
    {
        id: 7,
        title: "Power System Lab Schedule",
        content: "New schedule for Power System Laboratory has been updated. Check the timetable for revised timings.",
        course: "EE",
        priority: "Medium",
        importance: "Normal",
        category: "Memo",
        date: "2025-08-10",
        link: "",
        scrollingEnabled: false,
        scrollingLabel: '',
        scrollingSpeed: 'medium',
        order: 1
    }
];

// DOM elements
const noticeContainer = document.getElementById('noticeContainer');
const navDots = document.getElementById('navDots');
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const closeAdmin = document.getElementById('closeAdmin');
const loginModal = document.getElementById('loginModal');
const adminPassword = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const cancelLogin = document.getElementById('cancelLogin');
const noticeForm = document.getElementById('noticeForm');
const darkModeToggle = document.getElementById('darkModeToggle');
const logoutBtn = document.getElementById('logoutBtn');
const submitBtn = document.getElementById('submitBtn');
const addNoticeBtn = document.getElementById('addNoticeBtn');
const addLinkBtn = document.getElementById('addLinkBtn');
const linksContainer = document.getElementById('linksContainer');

// Form elements
const noticeContent = document.getElementById('noticeContent');
const noticeImportance = document.getElementById('noticeImportance');

// Sync elements (keeping but not showing errors in UI)
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

let currentNoticeIndex = 0;
let isAdminLoggedIn = false;
let editingNoticeId = null;

// Built-in JSONhost sync settings - Replace with your actual values
const BUILT_IN_SYNC = {
    jsonHostId: '790a8951ca2405bc23345a3cef5ccabb', // Replace with your JSONhost ID
    jsonHostToken: '9y0qzr1ic6ctvqzxxp8dfv7j1s930gxz', // Replace with your API token
    autoSync: true,
    enabled: true // Set to false to disable all sync
};

let autoSyncInterval = null;

// Initialize the app
async function init() {
    loadDarkModePreference();
    
    // Load all CSV files at startup - following reference implementation
    await loadAllCSVFiles();
    
    // Initialize with demo scrolling notice if no notices exist
    if (notices.length === 0) {
        console.log('📝 No notices found, creating demo notice with scrolling');
        createDemoScrollingNotice();
    } else {
        // Check if we have any scrolling notices, if not create one for testing
        const hasScrollingNotice = notices.some(notice => notice.scrollingEnabled);
        console.log(`🔍 Existing notices: ${notices.length}, Has scrolling notice: ${hasScrollingNotice}`);
        
        if (!hasScrollingNotice) {
            console.log('❌ No scrolling notices found, enabling scrolling for first notice');
            // Enable scrolling for the first notice as a demo
            if (notices.length > 0) {
                notices[0].scrollingEnabled = true;
                notices[0].scrollingLabel = 'Student Fee Dues List';
                notices[0].scrollingSpeed = 'medium';
                notices[0].order = 1;
                console.log(`✅ Enabled scrolling for notice: "${notices[0].title}"`);
                saveLocalNotices(); // Save the updated notice
            }
        } else {
            console.log('✅ Found existing scrolling notices');
        }
    }
    
    renderNotices();
    setupEventListeners();
    updateNavigation();
    
    // Initialize scrolling animations after rendering
    setTimeout(() => initializeScrollingAnimations(), 100);
    
    if (BUILT_IN_SYNC.enabled) {
        setupAutoSync();
        setTimeout(testBuiltInConnection, 2000);
    }
}

// Legacy function - no longer needed with reference implementation

// Create a demo notice with scrolling messages to showcase the feature
function createDemoScrollingNotice() {
    const demoNotice = {
        id: `demo-${Date.now()}`,
        title: 'Fee Dues Notice - Student List',
        content: '<p><strong>Important Notice:</strong> The following students have pending fee dues. Please contact the accounts office immediately to clear your dues.</p><p>Payment can be made at the college office during working hours (9:00 AM - 4:00 PM).</p><p>For any queries, contact the accounts department at extension 234.</p>',
        course: 'ALL',
        priority: 'High',
        importance: 'Critical',
        category: 'Notice',
        date: new Date().toISOString().split('T')[0],
        link: '',
        scrollingEnabled: true,
        scrollingLabel: 'Student Fee Dues List',
        scrollingSpeed: 'medium',
        order: 1
    };
    
    notices.push(demoNotice);
    saveLocalNotices();
    
    console.log('Demo scrolling notice created successfully');
}

// Load all available CSV files at startup - following reference implementation
async function loadAllCSVFiles() {
    console.log('🔍 Loading CSV files at startup...');
    
    // Try to load common CSV files
    const csvFiles = ['students.csv', '1.csv', '2.csv', '3.csv', '4.csv', '5.csv'];
    
    for (const fileName of csvFiles) {
        try {
            const csvText = await fetchCSVFile(fileName);
            if (csvText) {
                // Store raw CSV text for processing
                csvData[fileName] = csvText;
                const lineCount = csvText.trim().split('\n').length;
                console.log(`✅ Loaded CSV file ${fileName} with ${lineCount} lines`);
            }
        } catch (error) {
            // File doesn't exist or error loading, skip silently
            console.log(`❌ CSV file ${fileName} not found or error loading:`, error.message);
        }
    }
    
    console.log(`📊 Loaded ${Object.keys(csvData).length} CSV files:`, Object.keys(csvData));
    console.log(`📋 CSV data available:`, csvData);
}

// Fetch CSV file content
async function fetchCSVFile(fileName) {
    try {
        const response = await fetch(fileName);
        if (response.ok) {
            return await response.text();
        }
        return null;
    } catch (error) {
        console.log(`Error fetching ${fileName}:`, error);
        return null;
    }
}

// Get CSV data for a notice based on its order - following reference implementation
function getCSVDataForNotice(notice) {
    const order = notice.order || 1;
    
    // Try different file naming patterns
    const possibleFiles = [
        `${order}.csv`,           // 1.csv, 2.csv, etc.
        'students.csv',           // Default fallback
        `data${order}.csv`,       // data1.csv, data2.csv
        `file${order}.csv`        // file1.csv, file2.csv
    ];
    
    for (const fileName of possibleFiles) {
        if (csvData[fileName]) {
            console.log(`📁 Using ${fileName} for notice "${notice.title}" (order: ${order})`);
            return csvData[fileName];
        }
    }
    
    console.log(`❌ No CSV data found for notice "${notice.title}" (order: ${order})`);
    return '';
}

// Get scroll speed multiplier - following reference implementation
function getScrollSpeed(speedSetting = 'medium') {
    const speeds = {
        'slow': 2.0,     // Slow and readable
        'medium': 1.5,   // Optimal for reading
        'fast': 1.0,     // Faster pace for long lists
        'speed': 0.8     // Very fast scrolling for very long lists
    };
    return speeds[speedSetting] || speeds['medium'];
}

// Calculate optimal scroll speed based on row count
function calculateOptimalScrollSpeed(rowCount) {
    if (rowCount <= 10) return 1.5;  // Faster for fewer rows
    if (rowCount <= 50) return 1.0;
    if (rowCount <= 100) return 0.7;
    return 0.4; // Much faster for many rows
}

// Create scrolling text HTML - following reference implementation
function createScrollingTextHTML(csvText, label, speed = 'medium') {
    console.log(`🎨 Creating scrolling text for label: "${label}", CSV length: ${csvText ? csvText.length : 0}, speed: ${speed}`);
    
    try {
        // Check if we have CSV data
        if (!csvText || csvText.trim().length === 0) {
            console.log(`⚠️ No CSV data available for label: "${label}"`);
            return createEmptyScrollingMessage(label);
        }
        
        // Parse CSV text properly
        const lines = csvText.trim().split('\n').filter(line => line.trim());
        console.log(`📝 Processing ${lines.length} CSV lines`);
        
        if (lines.length < 2) {
            console.log(`❌ Insufficient CSV data (${lines.length} lines) for label: "${label}"`);
            return createEmptyScrollingMessage(label);
        }

        // Parse headers and data rows
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const dataRows = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });

        // Create sanitized data structure
        const sanitizedData = {
            headers: headers,
            rows: dataRows
        };

        // Create mobile column-based format
        const createMobileRowHTML = (row, index) => {
            const rowCells = sanitizedData.headers.map((header, colIndex) => {
                const cellValue = formatCellValue(row[header] || '', header, colIndex);
                const sanitizedValue = escapeHtml(cellValue);
                // Check if value looks like an amount
                const isAmount = /(?:rs\.?|₹|\$|fee|amount|due|paid|balance|total|sum)/i.test(header) || 
                               /(?:rs\.?\s*\d|₹\s*\d|\d+\.?\d*\s*(?:rs|₹)|\d+\.\d+)/i.test(sanitizedValue);
                const isNumeric = /^\d+\.?\d*$/.test(sanitizedValue) || isAmount;
                const cellClass = isNumeric ? 'csv-cell-numeric' : 'csv-cell-text';
                return `<div class="csv-column ${cellClass}" data-column="${colIndex}" title="${sanitizedValue}">${sanitizedValue}</div>`;
            }).join('');
            return `<div class="csv-mobile-row" data-row="${index}">${rowCells}</div>`;
        };

        // Create original and duplicated rows for seamless scrolling
        const originalMobileRowsHTML = sanitizedData.rows.map(createMobileRowHTML).join('');
        const duplicatedMobileRowsHTML = sanitizedData.rows.map((row, index) => 
            createMobileRowHTML(row, index + sanitizedData.rows.length)
        ).join('');
        const allMobileRowsHTML = originalMobileRowsHTML + duplicatedMobileRowsHTML;

        // Enhanced timing calculation with adaptive speed
        const totalRows = sanitizedData.rows.length;
        const baseSpeed = calculateOptimalScrollSpeed(totalRows);
        const minDuration = speed === 'speed' ? 3 : (speed === 'fast' ? 5 : 10);
        const animationDuration = Math.max(totalRows * baseSpeed, minDuration);
        
        // Generate unique ID for this scrolling instance
        const instanceId = `csv-scroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        console.log(`✅ Generated scrolling HTML for "${label}" with ${totalRows} rows, duration: ${animationDuration}s`);

        return `
            <div class="scrolling-message-inline" id="${instanceId}" data-rows="${totalRows}">
                <div class="scrolling-label">
                    <div>
                        ${escapeHtml(label)}
                    </div>
                    <span class="scrolling-count">(${totalRows} records)</span>
                </div>
                <hr class="scrolling-separator">
                <div class="scrolling-content-area">
                    <div class="scrolling-animation"
                         style="--scroll-duration: ${animationDuration}s; --total-rows: ${totalRows};"
                         data-animation-duration="${animationDuration}"
                         data-total-rows="${totalRows}">
                        ${allMobileRowsHTML}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error creating scrolling message HTML:', error);
        return createErrorScrollingMessage(label, error.message);
    }
}

// Helper functions
function createEmptyScrollingMessage(label) {
    return `
        <div class="scrolling-message-inline">
            <div class="scrolling-label">
                <div>${escapeHtml(label)}</div>
                <span class="scrolling-count">(No data)</span>
            </div>
            <div class="scrolling-content-area" style="height: 80px; display: flex; align-items: center; justify-content: center;">
                <p style="color: #7f8c8d; font-style: italic; margin: 0;">Loading CSV data...</p>
            </div>
        </div>
    `;
}

function createErrorScrollingMessage(label, error) {
    return `
        <div class="scrolling-message-inline">
            <div class="scrolling-label">
                <div>${escapeHtml(label)}</div>
                <span class="scrolling-count">(Error)</span>
            </div>
            <div class="scrolling-content">
                <p style="color: #e74c3c; font-style: italic;">Error: ${escapeHtml(error)}</p>
            </div>
        </div>
    `;
}

function formatCellValue(value, header, colIndex) {
    return String(value);
}

function escapeHtml(text) {
    if (typeof text !== 'string') {
        text = String(text);
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize scrolling animations after DOM insertion
function initializeScrollingAnimations() {
    const scrollContainers = document.querySelectorAll('.scrolling-message-inline');
    console.log(`Found ${scrollContainers.length} CSV scrolling containers`);
    
    scrollContainers.forEach(container => {
        const scrollContent = container.querySelector('.scrolling-animation');
        if (scrollContent) {
            const duration = scrollContent.dataset.animationDuration || '25';
            console.log(`Initializing animation for container ${container.id} with duration ${duration}s`);
            
            // Ensure animation is properly applied
            scrollContent.style.setProperty('--scroll-duration', `${duration}s`);
            scrollContent.style.animation = `scroll-csv-smooth ${duration}s linear infinite`;
            
            // Force reflow to ensure animation starts
            scrollContent.offsetHeight;
        }
        
        // Add mobile touch events for pause/resume
        const scrollContentArea = container.querySelector('.scrolling-content-area');
        if (scrollContentArea) {
            setupScrollingTouchEvents(scrollContentArea);
        }
    });
}

// Setup touch events for mobile pause/resume functionality
function setupScrollingTouchEvents(scrollContentArea) {
    let isPaused = false;

    const togglePause = () => {
        isPaused = !isPaused;
        if (isPaused) {
            scrollContentArea.classList.add('paused');
        } else {
            scrollContentArea.classList.remove('paused');
        }
        console.log(`Scrolling messages ${isPaused ? 'paused' : 'resumed'}`);
    };

    if ('ontouchstart' in window) {
        // Mobile device
        let touchStartTime = 0;
        scrollContentArea.addEventListener('touchstart', () => {
            touchStartTime = Date.now();
        }, { passive: true });

        scrollContentArea.addEventListener('touchend', (e) => {
            if (Date.now() - touchStartTime < 300) {
                e.preventDefault();
                togglePause();
            }
        });
    } else {
        // Desktop device
        scrollContentArea.addEventListener('click', (e) => {
            e.preventDefault();
            togglePause();
        });
    }
}

// Sort notices by importance and reassign serial numbers
function sortAndReorderNotices() {
    const importanceOrder = {
        'Critical': 1,
        'Urgent': 2,
        'Important': 3,
        'Normal': 4
    };
    
    // Sort by importance, then by date (newest first)
    notices.sort((a, b) => {
        const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
        if (importanceDiff !== 0) return importanceDiff;
        return new Date(b.date) - new Date(a.date);
    });
    
    // Reassign serial numbers based on new order
    notices.forEach((notice, index) => {
        notice.id = index + 1;
    });
}

// Render all notices
function renderNotices() {
    sortAndReorderNotices();
    noticeContainer.innerHTML = '';
    
    notices.forEach((notice, index) => {
        const noticeCard = createNoticeCard(notice, index);
        noticeContainer.appendChild(noticeCard);
    });
    
    setCardBorderColors();
    updateNavDots();
}

// Set card border color to match header color
function setCardBorderColors() {
    const noticeCards = document.querySelectorAll('.notice-card');
    noticeCards.forEach(card => {
        const header = card.querySelector('.notice-header');
        if (header) {
            const headerColor = window.getComputedStyle(header).backgroundColor;
            card.style.border = `2px solid ${headerColor}`;
        }
    });
}

// Create individual notice card
function createNoticeCard(notice, index) {
    console.log(`📋 Creating card for notice: "${notice.title}", scrollingEnabled: ${notice.scrollingEnabled}, scrollingLabel: "${notice.scrollingLabel}"`);
    
    const card = document.createElement('div');
    card.className = 'notice-card';
    card.innerHTML = `
        <div class="notice-header">
            <div class="notice-header-left">
                <div class="notice-number">No. ${notice.id}</div>
                <h2 class="notice-title">${notice.title}</h2>
            </div>
            <div class="notice-header-right">
                <div class="notice-header-right-top">
                    ${isAdminLoggedIn ? `
                        <button class="edit-btn" title="Edit Notice">✏️</button>
                        <button class="delete-btn" title="Delete Notice">🗑️</button>
                    ` : ''}
                    <span class="priority-tag priority-${notice.priority.toLowerCase()}">${notice.priority}</span>
                </div>
                <div class="notice-header-right-bottom">
                    <div class="notice-date">${formatDate(notice.date)}</div>
                </div>
            </div>
        </div>
        <div class="notice-body">
            <div class="notice-tags">
                <span class="course-tag">${notice.course}</span>
                <span class="category-tag">${notice.category}</span>
            </div>
            <div class="notice-content">${notice.content}</div>
            ${notice.scrollingEnabled && notice.scrollingLabel ? 
                createScrollingTextHTML(getCSVDataForNotice(notice), notice.scrollingLabel, notice.scrollingSpeed) : ''}
            <div class="notice-links">
                ${notice.links && notice.links.map(link => `<a href="${link.url}" target="_blank" class="notice-link">${link.title}</a>`).join('') || ''}
            </div>
        </div>
    `;
    
    // Add event listeners for edit/delete buttons if admin is logged in
    if (isAdminLoggedIn) {
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => editNotice(notice.id));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteNoticeWithSync(notice.id));
        }
    }
    
    // Setup touch events for scrolling messages in this card
    const scrollContentArea = card.querySelector('.scrolling-content-area');
    if (scrollContentArea) {
        setupScrollingTouchEvents(scrollContentArea);
    }
    
    return card;
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Update navigation with card numbers instead of dots
function updateNavDots() {
    navDots.innerHTML = '';
    
    // Create card numbers container
    const numbersContainer = document.createElement('div');
    numbersContainer.className = 'nav-numbers-container';
    
    notices.forEach((notice, index) => {
        const numberEl = document.createElement('div');
        numberEl.className = `nav-number ${index === currentNoticeIndex ? 'active' : ''}`;
        numberEl.textContent = `${index + 1}`;
        numberEl.title = `Card ${index + 1}: ${notice.title}`;
        numberEl.addEventListener('click', () => {
            const cardWidth = noticeContainer.querySelector('.notice-card').offsetWidth;
            noticeContainer.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        });
        numbersContainer.appendChild(numberEl);
    });
    
    // Add total count indicator
    const totalIndicator = document.createElement('div');
    totalIndicator.className = 'nav-total';
    totalIndicator.textContent = `/ ${notices.length}`;
    
    navDots.appendChild(numbersContainer);
    navDots.appendChild(totalIndicator);
}



// Update navigation state
function updateNavigation() {
    const numbers = document.querySelectorAll('.nav-number');
    numbers.forEach((number, index) => {
        number.classList.toggle('active', index === currentNoticeIndex);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Admin button click
    adminBtn.addEventListener('click', () => {
        if (isAdminLoggedIn) {
            adminPanel.style.display = 'flex';
            resetNoticeForm();
        } else {
            loginModal.style.display = 'flex';
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', handleLogout);

    // Add notice button
    addNoticeBtn.addEventListener('click', () => {
        adminPanel.style.display = 'flex';
        resetNoticeForm();
    });

    // Add link button
    addLinkBtn.addEventListener('click', addLinkInput);

    // Rich text editor functionality
    setupRichTextEditor();

    // Close admin panel
    closeAdmin.addEventListener('click', () => {
        adminPanel.style.display = 'none';
        resetNoticeForm();
    });


    // Login functionality
    loginBtn.addEventListener('click', handleLogin);
    cancelLogin.addEventListener('click', () => {
        loginModal.style.display = 'none';
        adminPassword.value = '';
    });

    // Enter key for login
    adminPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    // Notice form submission
    noticeForm.addEventListener('submit', handleNoticeSubmissionWithSync);
    
    // Add event listener for scrolling enabled checkbox to show/hide options
    const scrollingEnabledCheckbox = document.getElementById('scrollingEnabled');
    const scrollingOptions = document.getElementById('scrollingOptions');
    
    if (scrollingEnabledCheckbox && scrollingOptions) {
        scrollingEnabledCheckbox.addEventListener('change', function() {
            scrollingOptions.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Simplified swipe handling - relying on CSS scroll snap
    noticeContainer.addEventListener('scroll', debounce(updateCurrentNoticeOnScroll, 150));

    noticeContainer.addEventListener('scroll', debounce(updateCurrentNoticeOnScroll, 150));

    // Add window focus event to sync when switching devices
    window.addEventListener('focus', async () => {
        if (BUILT_IN_SYNC.enabled && BUILT_IN_SYNC.jsonHostId) {
            console.log('Window focused - clearing CSV cache and syncing from remote...');
            clearCSVCache(); // Clear cache to ensure fresh CSV data
            setTimeout(syncFromRemoteWithRetry, 500);
        }
    });
    
    // Add online/offline event listeners for better sync management
    window.addEventListener('online', async () => {
        if (BUILT_IN_SYNC.enabled) {
            console.log('Device back online - reconnecting...');
            setTimeout(testBuiltInConnection, 1000);
        }
    });
}

// Handle admin login
function handleLogin() {
    const password = adminPassword.value;
    if (password === 'teju*smp') {
        isAdminLoggedIn = true;
        loginModal.style.display = 'none';
        adminPassword.value = '';
        
        // Show add notice and logout buttons, hide admin button
        addNoticeBtn.style.display = 'block';
        logoutBtn.style.display = 'block';
        adminBtn.style.display = 'none';
        
        // Efficiently update existing cards to show edit/delete buttons instead of full re-render
        updateAdminButtons(true);
    } else {
        alert('Invalid admin keyword!');
        adminPassword.value = '';
    }
}

// Handle notice form submission
async function handleNoticeSubmission(e) {
    e.preventDefault();
    
    if (editingNoticeId) {
        // Update existing notice
        const noticeIndex = notices.findIndex(n => n.id === editingNoticeId);
        if (noticeIndex !== -1) {
            const links = [];
            const linkInputGroups = linksContainer.querySelectorAll('.link-input-group');
            linkInputGroups.forEach(group => {
                const title = group.querySelector('.link-title-input').value;
                const url = group.querySelector('.link-url-input').value;
                if (title && url) {
                    links.push({ title, url });
                }
            });

            notices[noticeIndex] = {
                ...notices[noticeIndex],
                title: document.getElementById('noticeTitle').value,
                content: noticeContent.innerHTML,
                course: document.getElementById('noticeCourse').value,
                priority: document.getElementById('noticePriority').value,
                importance: noticeImportance.value,
                category: document.getElementById('noticeCategory').value,
                links: links
            };
            // Update scrolling messages for this notice
            await updateNoticeScrollingMessages(editingNoticeId);
        }
        editingNoticeId = null;
        submitBtn.textContent = 'Add Notice';
    } else {
        const links = [];
        const linkInputGroups = linksContainer.querySelectorAll('.link-input-group');
        linkInputGroups.forEach(group => {
            const title = group.querySelector('.link-title-input').value;
            const url = group.querySelector('.link-url-input').value;
            if (title && url) {
                links.push({ title, url });
            }
        });

        const newNotice = {
            id: notices.length + 1,
            title: document.getElementById('noticeTitle').value,
            content: noticeContent.innerHTML,
            course: document.getElementById('noticeCourse').value,
            priority: document.getElementById('noticePriority').value,
            importance: noticeImportance.value,
            category: document.getElementById('noticeCategory').value,
            date: new Date().toISOString().split('T')[0],
            links: links,
            scrollingMessages: {
                enabled: false,
                title: '',
                csvFileName: '',
                speed: 'auto',
                messages: []
            }
        };
        notices.push(newNotice);
        // Update scrolling messages for the new notice
        await updateNoticeScrollingMessages(newNotice.id);
    }

    saveLocalNotices();
    renderNotices();
    resetNoticeForm();
    adminPanel.style.display = 'none';
    
    // Scroll to the first notice after sorting
    setTimeout(() => {
        noticeContainer.scrollTo({ left: 0, behavior: 'smooth' });
    }, 100);
}

// Update current notice index based on scroll position
function updateCurrentNoticeOnScroll() {
    const scrollLeft = noticeContainer.scrollLeft;
    const cardWidth = noticeContainer.querySelector('.notice-card').offsetWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);

    if (newIndex !== currentNoticeIndex) {
        currentNoticeIndex = newIndex;
        updateNavigation();
    }
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Dark mode functions
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDarkMode);
}

function loadDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'false') {
        document.body.classList.remove('dark-mode');
        darkModeToggle.textContent = '🌙';
    } else {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
}

// Efficiently update admin buttons without full re-render to prevent mobile freeze
function updateAdminButtons(show) {
    // Use requestAnimationFrame for smoother updates on mobile
    requestAnimationFrame(() => {
        const noticeCards = document.querySelectorAll('.notice-card');
    
    noticeCards.forEach((card, index) => {
        const notice = notices[index];
        if (!notice) return;
        
        const headerRight = card.querySelector('.notice-header-right-top');
        if (!headerRight) return;
        
        // Remove existing admin buttons
        const existingEditBtn = headerRight.querySelector('.edit-btn');
        const existingDeleteBtn = headerRight.querySelector('.delete-btn');
        
        if (existingEditBtn) existingEditBtn.remove();
        if (existingDeleteBtn) existingDeleteBtn.remove();
        
        // Add admin buttons if showing
        if (show) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.title = 'Edit Notice';
            editBtn.innerHTML = '✏️';
            editBtn.addEventListener('click', () => editNotice(notice.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = 'Delete Notice';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', () => deleteNoticeWithSync(notice.id));
            
            // Insert before the priority tag
            const priorityTag = headerRight.querySelector('.priority-tag');
            if (priorityTag) {
                headerRight.insertBefore(editBtn, priorityTag);
                headerRight.insertBefore(deleteBtn, priorityTag);
            } else {
                headerRight.appendChild(editBtn);
                headerRight.appendChild(deleteBtn);
            }
        }
    });
    }); // End requestAnimationFrame
}

// Add a new link input group to the form
function addLinkInput() {
    const linkInputGroup = document.createElement('div');
    linkInputGroup.className = 'link-input-group';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Link Title';
    titleInput.className = 'link-title-input';

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'Link URL';
    urlInput.className = 'link-url-input';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-link-btn';
    removeBtn.textContent = '-';
    removeBtn.addEventListener('click', () => {
        linkInputGroup.remove();
    });

    linkInputGroup.appendChild(titleInput);
    linkInputGroup.appendChild(urlInput);
    linkInputGroup.appendChild(removeBtn);

    linksContainer.appendChild(linkInputGroup);
}

// Admin logout function
function handleLogout() {
    isAdminLoggedIn = false;
    adminPanel.style.display = 'none';
    
    // Hide add notice and logout buttons, show admin button
    addNoticeBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
    adminBtn.style.display = 'block';
    
    // Efficiently update existing cards to hide edit/delete buttons instead of full re-render
    updateAdminButtons(false);
}

// Edit notice function
function editNotice(noticeId) {
    const notice = notices.find(n => n.id === noticeId);
    if (notice) {
        editingNoticeId = noticeId;
        document.getElementById('noticeTitle').value = notice.title;
        noticeContent.innerHTML = notice.content;
        document.getElementById('noticeCourse').value = notice.course;
        document.getElementById('noticePriority').value = notice.priority;
        noticeImportance.value = notice.importance || 'Normal';
        document.getElementById('noticeCategory').value = notice.category;
        
        linksContainer.innerHTML = '';
        if (notice.links) {
            notice.links.forEach(link => {
                addLinkInput();
                const linkInputGroups = linksContainer.querySelectorAll('.link-input-group');
                const lastGroup = linkInputGroups[linkInputGroups.length - 1];
                lastGroup.querySelector('.link-title-input').value = link.title;
                lastGroup.querySelector('.link-url-input').value = link.url;
            });
        }
        
        // Load scrolling message settings for this notice
        loadNoticeScrollingSettings(notice);
        
        submitBtn.textContent = 'Update Notice';
        adminPanel.style.display = 'flex';
    }
}

// Delete notice function
function deleteNotice(noticeId) {
    if (confirm('Are you sure you want to delete this notice?')) {
        notices = notices.filter(n => n.id !== noticeId);
        saveLocalNotices();
        renderNotices();
        if (currentNoticeIndex >= notices.length) {
            currentNoticeIndex = notices.length - 1;
            if (currentNoticeIndex >= 0) {
                const cardWidth = noticeContainer.querySelector('.notice-card').offsetWidth;
                noticeContainer.scrollTo({
                    left: currentNoticeIndex * cardWidth,
                    behavior: 'smooth'
                });
            }
        }
    }
}

// Reset notice form
function resetNoticeForm() {
    editingNoticeId = null;
    submitBtn.textContent = 'Add Notice';
    noticeForm.reset();
    noticeContent.innerHTML = '';
    linksContainer.innerHTML = '';
    
    // Reset scrolling messages fields
    const enableCheckbox = document.getElementById('enableScrollingMessages');
    const titleInput = document.getElementById('scrollingTitle');
    const csvFileInput = document.getElementById('csvFileName');
    const speedSelect = document.getElementById('scrollingSpeed');
    
    if (enableCheckbox) enableCheckbox.checked = false;
    if (titleInput) titleInput.value = '';
    if (csvFileInput) csvFileInput.value = '';
    if (speedSelect) speedSelect.value = '';
}

// Setup rich text editor
function setupRichTextEditor() {
    const editorButtons = document.querySelectorAll('.editor-btn');
    
    editorButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const command = button.getAttribute('data-command');
            
            // Focus the editor before executing command
            noticeContent.focus();
            
            // Execute the formatting command
            document.execCommand(command, false, null);
            
            // Update button states
            updateEditorButtonStates();
        });
    });
    
    // Update button states when selection changes
    noticeContent.addEventListener('mouseup', updateEditorButtonStates);
    noticeContent.addEventListener('keyup', updateEditorButtonStates);
}

// Update editor button states based on current selection
function updateEditorButtonStates() {
    const editorButtons = document.querySelectorAll('.editor-btn');
    
    editorButtons.forEach(button => {
        const command = button.getAttribute('data-command');
        
        try {
            if (document.queryCommandState(command)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        } catch (e) {
            // Some commands don't support queryCommandState
            button.classList.remove('active');
        }
    });
}

// Tab switching function
function switchTab(tab) {
    if (tab === 'notice') {
        noticeTab.classList.add('active');
        syncTab.classList.remove('active');
        noticePanel.style.display = 'block';
        syncPanel.style.display = 'none';
    } else {
        syncTab.classList.add('active');
        noticeTab.classList.remove('active');
        syncPanel.style.display = 'block';
        noticePanel.style.display = 'none';
    }
}

// JSONhost API functions
async function makeJsonHostRequest(method, endpoint, data = null, useAuth = false) {
    if (!BUILT_IN_SYNC.enabled) {
        throw new Error('Sync is disabled');
    }

    const url = `https://jsonhost.com${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (useAuth && BUILT_IN_SYNC.jsonHostToken) {
        options.headers['Authorization'] = BUILT_IN_SYNC.jsonHostToken;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('JSONhost request failed:', error);
        throw error;
    }
}

// Sync status functions
function updateSyncStatus(status, message) {
    statusIndicator.className = `status-indicator ${status}`;
    statusText.textContent = message;
    
    const syncStatus = document.getElementById('syncStatus');
    syncStatus.className = 'sync-status';
    
    if (status === 'connected') {
        syncStatus.style.borderLeftColor = '#27ae60';
    } else if (status === 'connecting') {
        syncStatus.style.borderLeftColor = '#f39c12';
    } else {
        syncStatus.style.borderLeftColor = '#e74c3c';
    }
}

// Test built-in connection to JSONhost
async function testBuiltInConnection() {
    if (!BUILT_IN_SYNC.enabled) {
        updateSyncStatus('error', 'Sync disabled');
        return;
    }

    updateSyncStatus('connecting', 'Testing connection...');
    
    try {
        // First test if remote exists
        const remoteData = await makeJsonHostRequest('GET', `/json/${BUILT_IN_SYNC.jsonHostId}`);
        updateSyncStatus('connected', 'Auto-sync enabled');
        
        // If we have local notices and remote is empty/invalid, push local data first
        if (notices.length > 0 && (!remoteData || !remoteData.notices || remoteData.notices.length === 0)) {
            console.log('🔄 Local data exists but remote is empty - pushing local data to remote');
            await syncToRemote();
        } else {
            // Try to sync from remote on startup with retry logic
            setTimeout(syncFromRemoteWithRetry, 1000);
        }
    } catch (error) {
        // If 404, remote doesn't exist - initialize with local data
        if (error.message.includes('404') && notices.length > 0) {
            console.log('🔄 Remote not found - initializing with local data');
            try {
                await syncToRemote();
                updateSyncStatus('connected', 'Remote initialized with local data');
            } catch (initError) {
                updateSyncStatus('error', 'Failed to initialize remote');
                console.error('Failed to initialize remote:', initError);
            }
        } else {
            updateSyncStatus('error', `Connection failed: ${error.message}`);
            console.error('Built-in sync connection failed:', error);
            // Retry connection after 30 seconds
            setTimeout(testBuiltInConnection, 30000);
        }
    }
}

// Sync from remote with retry logic
async function syncFromRemoteWithRetry(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await syncFromRemote();
            console.log('Sync from remote completed successfully');
            return; // Success, exit retry loop
        } catch (error) {
            console.warn(`Sync attempt ${i + 1} failed:`, error);
            if (i < retries - 1) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }
    console.error('All sync attempts failed - using local data');
}


// Sync notices to JSONhost
async function syncToRemote() {
    if (!BUILT_IN_SYNC.enabled || !BUILT_IN_SYNC.jsonHostId || !BUILT_IN_SYNC.jsonHostToken) {
        throw new Error('Sync not configured');
    }

    // Create a copy of notices with scrolling message metadata (but not the actual messages)
    const noticesToSync = notices.map(notice => ({
        ...notice,
        scrollingMessages: notice.scrollingMessages ? {
            enabled: notice.scrollingMessages.enabled,
            title: notice.scrollingMessages.title,
            csvFileName: notice.scrollingMessages.csvFileName,
            speed: notice.scrollingMessages.speed,
            // Don't sync the actual messages array - they will be loaded from CSV on each device
            messages: []
        } : undefined
    }));

    const syncData = {
        notices: noticesToSync,
        lastModified: new Date().toISOString(),
        version: '1.1' // Increment version to indicate support for scrolling messages
    };

    await makeJsonHostRequest('POST', `/json/${BUILT_IN_SYNC.jsonHostId}`, syncData, true);
    console.log('Synced to remote successfully with scrolling message metadata');
}

// Sync notices from JSONhost
async function syncFromRemote() {
    if (!BUILT_IN_SYNC.enabled || !BUILT_IN_SYNC.jsonHostId) {
        throw new Error('Sync not configured');
    }

    try {
        const remoteData = await makeJsonHostRequest('GET', `/json/${BUILT_IN_SYNC.jsonHostId}`);
        
        if (remoteData && remoteData.notices && Array.isArray(remoteData.notices)) {
            console.log(`📥 Syncing ${remoteData.notices.length} notices from remote`);
            
            // Only update if we actually received valid data
            if (remoteData.notices.length > 0 || notices.length === 0) {
                const previousNoticesCount = notices.length;
                notices = remoteData.notices;
                
                // Ensure backward compatibility for all synced notices
                notices.forEach(notice => {
                    if (!notice.scrollingMessages) {
                        notice.scrollingMessages = {
                            enabled: false,
                            title: '',
                            csvFileName: '',
                            speed: 'auto',
                            messages: []
                        };
                    }
                    // Handle old scrolling structure
                    if (notice.scrollingEnabled !== undefined && !notice.scrollingMessages.enabled) {
                        notice.scrollingMessages.enabled = notice.scrollingEnabled;
                        notice.scrollingMessages.title = notice.scrollingLabel || '';
                        notice.scrollingMessages.speed = notice.scrollingSpeed || 'medium';
                    }
                });
                
                // Reload scrolling messages for all notices that have them enabled
                console.log('Loading scrolling messages after sync...');
                for (const notice of notices) {
                    if (notice.scrollingMessages && notice.scrollingMessages.enabled && notice.scrollingMessages.csvFileName) {
                        try {
                            console.log(`Loading messages for notice ${notice.id} from ${notice.scrollingMessages.csvFileName}`);
                            notice.scrollingMessages.messages = await loadCSVMessages(notice.scrollingMessages.csvFileName, true); // Force reload
                            console.log(`Loaded ${notice.scrollingMessages.messages.length} messages for notice ${notice.id}`);
                        } catch (csvError) {
                            console.warn(`Failed to load CSV messages for notice ${notice.id}:`, csvError);
                            notice.scrollingMessages.messages = [];
                        }
                    }
                }
                
                saveLocalNotices();
                renderNotices();
                updateNavigation();
                console.log(`✅ Synced from remote successfully: ${previousNoticesCount} → ${notices.length} notices`);
            } else {
                console.log('📭 Remote has empty notices but local has data - skipping sync to prevent data loss');
            }
        } else {
            console.log('📭 No valid notice data found in remote response');
        }
    } catch (error) {
        console.error('Sync from remote failed:', error);
        // If remote doesn't exist or is empty, initialize it with current local data
        if (error.message.includes('404') || error.message.includes('not found')) {
            if (notices.length > 0) {
                console.log('🔄 Remote not found but local data exists - initializing remote with local data');
                await syncToRemote();
            }
        } else {
            console.warn('⚠️ Sync failed but keeping local data intact');
        }
    }
}


// Setup auto-sync
function setupAutoSync() {
    if (autoSyncInterval) {
        clearInterval(autoSyncInterval);
        autoSyncInterval = null;
    }

    if (BUILT_IN_SYNC.enabled && BUILT_IN_SYNC.autoSync && BUILT_IN_SYNC.jsonHostId && BUILT_IN_SYNC.jsonHostToken) {
        // Auto-sync every 2 minutes with improved error handling
        autoSyncInterval = setInterval(async () => {
            try {
                // First sync from remote to get any new changes from other devices
                await syncFromRemote();
                
                // Then sync to remote (push local changes) to ensure consistency
                await syncToRemote();
                updateSyncStatus('connected', `Last synced: ${new Date().toLocaleTimeString()}`);
                
                console.log('Auto-sync cycle completed successfully');
            } catch (error) {
                console.error('Auto-sync failed:', error);
                // Try to sync from remote to get latest data as fallback
                try {
                    await syncFromRemote();
                    updateSyncStatus('connected', `Synced from remote: ${new Date().toLocaleTimeString()}`);
                } catch (syncError) {
                    console.error('Fallback sync from remote also failed:', syncError);
                    updateSyncStatus('error', 'Sync issues detected - using local data');
                }
            }
        }, 2 * 60 * 1000);
    }
}

// Enhanced notice submission with auto-sync
async function handleNoticeSubmissionWithSync(e) {
    await handleNoticeSubmission(e);
    
    // Auto-sync after adding/editing notices
    if (BUILT_IN_SYNC.enabled && BUILT_IN_SYNC.autoSync && BUILT_IN_SYNC.jsonHostId && BUILT_IN_SYNC.jsonHostToken) {
        try {
            await syncToRemote();
            updateSyncStatus('connected', `Synced: ${new Date().toLocaleTimeString()}`);
        } catch (error) {
            console.error('Auto-sync after submission failed:', error);
        }
    }
}

// Enhanced delete with auto-sync
async function deleteNoticeWithSync(noticeId) {
    if (confirm('Are you sure you want to delete this notice?')) {
        notices = notices.filter(n => n.id !== noticeId);
        saveLocalNotices();
        renderNotices();
        if (currentNoticeIndex >= notices.length) {
            currentNoticeIndex = notices.length - 1;
            if (currentNoticeIndex >= 0) {
                const cardWidth = noticeContainer.querySelector('.notice-card').offsetWidth;
                noticeContainer.scrollTo({
                    left: currentNoticeIndex * cardWidth,
                    behavior: 'smooth'
                });
            }
        }
        
        // Auto-sync after deleting notices
        if (BUILT_IN_SYNC.enabled && BUILT_IN_SYNC.autoSync && BUILT_IN_SYNC.jsonHostId && BUILT_IN_SYNC.jsonHostToken) {
            try {
                await syncToRemote();
                updateSyncStatus('connected', `Synced: ${new Date().toLocaleTimeString()}`);
            } catch (error) {
                console.error('Auto-sync after deletion failed:', error);
            }
        }
    }
}

// Load notices from localStorage on startup
function loadLocalNotices() {
    const saved = localStorage.getItem('smpNotices');
    if (saved) {
        try {
            const parsedNotices = JSON.parse(saved);
            if (Array.isArray(parsedNotices)) {
                notices = parsedNotices;
                console.log(`📂 Loaded ${notices.length} notices from localStorage`);
                
                // Ensure backward compatibility - add scrollingMessages to existing notices
                notices.forEach(notice => {
                    if (!notice.scrollingMessages) {
                        notice.scrollingMessages = {
                            enabled: false,
                            title: '',
                            csvFileName: '',
                            speed: 'auto',
                            messages: []
                        };
                    }
                    // Handle old structure migration
                    if (notice.scrollingEnabled !== undefined && !notice.scrollingMessages.enabled) {
                        notice.scrollingMessages.enabled = notice.scrollingEnabled;
                        notice.scrollingMessages.title = notice.scrollingLabel || '';
                        notice.scrollingMessages.speed = notice.scrollingSpeed || 'medium';
                    }
                });
                saveLocalNotices(); // Save updated structure
            } else {
                console.warn('⚠️ Invalid notices format in localStorage - starting fresh');
                notices = [];
            }
        } catch (error) {
            console.error('❌ Failed to parse localStorage notices:', error);
            notices = [];
        }
    } else {
        console.log('📭 No notices found in localStorage');
        notices = [];
    }
}

// Save notices to localStorage
function saveLocalNotices() {
    try {
        localStorage.setItem('smpNotices', JSON.stringify(notices));
        console.log(`💾 Saved ${notices.length} notices to localStorage`);
    } catch (error) {
        console.error('❌ Failed to save notices to localStorage:', error);
        // Try to clear some space and retry once
        try {
            localStorage.removeItem('tempData'); // Clear any temp data
            localStorage.setItem('smpNotices', JSON.stringify(notices));
            console.log('✅ Retry save successful after clearing temp data');
        } catch (retryError) {
            console.error('❌ Retry save also failed:', retryError);
        }
    }
}

// Preload CSV files at startup for instant access
async function preloadCSVFiles() {
    console.log('🚀 Starting CSV preload process...');
    
    // Automatically add CSV files used by notices to the startup list
    const csvFilesFromNotices = new Set(STARTUP_CSV_FILES);
    for (const notice of notices) {
        if (notice.scrollingMessages && notice.scrollingMessages.enabled && notice.scrollingMessages.csvFileName) {
            csvFilesFromNotices.add(notice.scrollingMessages.csvFileName);
        }
    }
    
    const filesToLoad = Array.from(csvFilesFromNotices);
    console.log(`📋 Files to preload: ${filesToLoad.join(', ')}`);
    
    const loadPromises = [];
    
    for (const fileName of filesToLoad) {
        console.log(`Starting preload of ${fileName}...`);
        const loadPromise = parseCSVFile(fileName).then(messages => {
            csvMessagesCache[fileName] = messages;
            csvLoadingStatus.files[fileName] = 'loaded';
            console.log(`✅ Preloaded ${fileName}: ${messages.length} messages`);
            return { fileName, messages };
        }).catch(error => {
            csvLoadingStatus.files[fileName] = 'error';
            console.warn(`❌ Failed to preload ${fileName}:`, error);
            return { fileName, messages: [], error };
        });
        
        csvLoadingStatus.promises[fileName] = loadPromise;
        loadPromises.push(loadPromise);
    }
    
    // Wait for all CSV files to load
    try {
        console.log(`⏳ Loading ${loadPromises.length} CSV files...`);
        const results = await Promise.all(loadPromises);
        csvLoadingStatus.loaded = true;
        
        const totalMessages = results.reduce((sum, result) => sum + (result.messages?.length || 0), 0);
        const successCount = results.filter(r => !r.error).length;
        
        console.log(`🎉 CSV preloading complete! ${successCount}/${filesToLoad.length} files loaded successfully`);
        console.log(`📊 Total messages available: ${totalMessages}`);
        
        return results;
    } catch (error) {
        console.error('❌ Error during CSV preloading:', error);
        csvLoadingStatus.loaded = true; // Mark as complete even if some failed
        return [];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    loadLocalNotices();
    
    // Initialize app
    await init();
});

// CSV Parsing and Scrolling Messages Functions
async function parseCSVFile(fileName) {
    try {
        console.log(`📥 Fetching CSV file: ${fileName}`);
        const response = await fetch(fileName, { cache: 'force-cache' }); // Enable caching
        if (!response.ok) {
            throw new Error(`Could not fetch ${fileName} (${response.status})`);
        }
        const csvText = await response.text();
        console.log(`📊 Processing CSV data (${csvText.length} chars)`);
        return await parseCSVText(csvText);
    } catch (error) {
        console.error('❌ Error parsing CSV file:', error);
        return [];
    }
}

async function parseCSVText(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    // Use batch processing for better performance
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const messages = [];
    
    // Optimize CSV parsing with batch processing
    const maxLines = Math.min(lines.length, 500); // Reduced to 500 for better performance
    const batchSize = 50; // Process in batches
    
    // Pre-determine header indices for faster access (Updated for new CSV structure)
    const studentNameIndex = 0; // "Student Name" is first column
    const yearIndex = 1; // "Year" is second column  
    const courseIndex = 2; // "Course" is third column
    const feeDuesIndex = 3; // "Fee Dues" is fourth column
    
    // Process in batches for better performance
    for (let batch = 1; batch < maxLines; batch += batchSize) {
        const batchEnd = Math.min(batch + batchSize, maxLines);
        
        for (let i = batch; i < batchEnd; i++) {
            const line = lines[i];
            if (!line || !line.trim()) continue;
            
            // Fast CSV parsing - split and trim in one operation
            const values = line.split(',');
            if (values.length < 4) continue; // Skip malformed rows (now expecting 4 columns)
            
            // Direct access without object creation for speed
            const studentName = (values[studentNameIndex] || 'N/A').trim().replace(/"/g, '');
            const year = (values[yearIndex] || '').trim().replace(/"/g, '');
            const course = (values[courseIndex] || '').trim().replace(/"/g, '');
            const feeDues = (values[feeDuesIndex] || '0').trim().replace(/"/g, '');
            
            // Create optimized message format
            const message = `${studentName} - ${year} ${course} - Dues: ₹${feeDues}`;
            messages.push(message);
        }
        
        // Yield control every batch to prevent UI blocking
        if (batch % (batchSize * 4) === 1) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    console.log(`✅ Optimized parsing (4-column CSV): ${messages.length} messages from ${lines.length - 1} total rows`);
    return messages;
}

function createScrollingMessagesHTML(title, messages, speed = 'auto') {
    if (!messages || messages.length === 0) {
        return `
            <div class="scrolling-messages">
                <h4>${title || 'Scrolling Messages'} (Loading...)</h4>
                <div class="messages-container">
                    <div class="messages-scroll">
                        <div class="message-item">Loading messages...</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Optimize HTML generation with join for better performance
    const messageCount = Math.min(messages.length, 200); // Limit displayed messages for performance
    const visibleMessages = messages.slice(0, messageCount);
    
    // Use template literals efficiently
    const messagesHTML = visibleMessages.map(message => 
        `<div class="message-item">${message}</div>`
    ).join('');
    
    // Optimized speed calculation for exactly 3 rows per second
    // Formula: duration = (total_visible_rows) / 3 rows_per_second
    // We duplicate messages, so total rows = messageCount * 2
    const totalRows = messageCount * 2;
    let baseDuration = Math.max(15, Math.round(totalRows / 3)); // 3 rows per second baseline
    
    // Speed multipliers (keeping 3 rows/sec as default 'auto')
    let finalDuration = baseDuration;
    switch(speed) {
        case 'ultra-slow': finalDuration = Math.round(baseDuration * 3.5); break;  // ~0.85 rows/sec
        case 'very-slow': finalDuration = Math.round(baseDuration * 2.5); break;   // ~1.2 rows/sec
        case 'slow': finalDuration = Math.round(baseDuration * 1.8); break;        // ~1.7 rows/sec
        case 'normal': finalDuration = Math.round(baseDuration * 1.2); break;      // ~2.5 rows/sec
        case 'fast': finalDuration = Math.round(baseDuration * 0.8); break;        // ~3.75 rows/sec
        case 'very-fast': finalDuration = Math.round(baseDuration * 0.6); break;   // ~5 rows/sec
        default: finalDuration = baseDuration; // 3 rows/second (optimal readability)
    }
    
    const calculatedDuration = Math.max(10, finalDuration);
    const actualSpeed = (totalRows / calculatedDuration).toFixed(1);
    
    // Generate unique ID for this scrolling container
    const containerId = `scroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const html = `
        <div class="scrolling-messages">
            <h4>${title || 'Scrolling Messages'} (${messageCount} entries, ${actualSpeed} rows/sec)</h4>
            <div class="messages-container">
                <div class="messages-scroll" id="${containerId}" data-message-count="${messageCount}" style="animation-duration: ${calculatedDuration}s;">
                    ${messagesHTML}
                    ${messagesHTML}
                </div>
            </div>
        </div>
    `;
    
    console.log(`🎨 Generated scrolling: ${messageCount} entries, ${calculatedDuration}s duration, ${actualSpeed} rows/sec`);
    return html;
}

function loadScrollingMessagesSettings() {
    // This function is no longer needed as settings are per-notice
    // But we keep it for compatibility during the init process
}

async function loadCSVMessages(csvFileName, forceReload = false) {
    if (!csvFileName) return [];
    
    // Check if it's a startup CSV file and is already loaded
    if (!forceReload && csvMessagesCache[csvFileName]) {
        console.log(`✅ Using preloaded/cached messages for ${csvFileName}: ${csvMessagesCache[csvFileName].length} entries`);
        return csvMessagesCache[csvFileName];
    }
    
    // If it's a startup CSV file and currently loading, wait for it
    if (STARTUP_CSV_FILES.includes(csvFileName) && csvLoadingStatus.promises[csvFileName]) {
        console.log(`⏳ Waiting for preload of ${csvFileName}...`);
        try {
            const result = await csvLoadingStatus.promises[csvFileName];
            return result.messages || [];
        } catch (error) {
            console.warn(`Failed to wait for preload of ${csvFileName}:`, error);
        }
    }
    
    console.log(`📂 Loading CSV messages from ${csvFileName}...`);
    // Load and cache messages
    const messages = await parseCSVFile(csvFileName);
    csvMessagesCache[csvFileName] = messages;
    console.log(`Loaded ${messages.length} messages from ${csvFileName}`);
    return messages;
}

// Clear CSV cache to force fresh data loading
function clearCSVCache(csvFileName = null) {
    if (csvFileName) {
        delete csvMessagesCache[csvFileName];
        console.log(`Cleared cache for ${csvFileName}`);
    } else {
        csvMessagesCache = {};
        console.log('Cleared all CSV cache');
    }
}

// Update scrolling messages display for a specific notice without full re-render
function updateScrollingMessagesDisplay(notice) {
    // Find all notice cards and update the one with matching notice ID
    const noticeCards = document.querySelectorAll('.notice-card');
    noticeCards.forEach(card => {
        const noticeTitle = card.querySelector('.notice-title');
        if (noticeTitle && noticeTitle.textContent === notice.title) {
            const noticeBody = card.querySelector('.notice-body');
            const existingScrollingContainer = card.querySelector('.scrolling-messages');
            
            if (notice.scrollingMessages && notice.scrollingMessages.enabled && notice.scrollingMessages.messages.length > 0) {
                // Create or update scrolling messages
                const newHTML = createScrollingMessagesHTML(
                    notice.scrollingMessages.title, 
                    notice.scrollingMessages.messages, 
                    notice.scrollingMessages.speed
                );
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHTML;
                const newScrollingContainer = tempDiv.firstElementChild;
                
                if (existingScrollingContainer) {
                    // Replace existing
                    existingScrollingContainer.parentNode.replaceChild(newScrollingContainer, existingScrollingContainer);
                    console.log(`🔄 Updated scrolling messages for: ${notice.title}`);
                } else {
                    // Add new scrolling container before the link (if any)
                    const noticeLink = card.querySelector('.notice-link');
                    if (noticeLink) {
                        noticeBody.insertBefore(newScrollingContainer, noticeLink);
                    } else {
                        noticeBody.appendChild(newScrollingContainer);
                    }
                    console.log(`➕ Added scrolling messages to: ${notice.title}`);
                }
            } else {
                // Remove scrolling messages if disabled or empty
                if (existingScrollingContainer) {
                    existingScrollingContainer.remove();
                    console.log(`➖ Removed scrolling messages from: ${notice.title}`);
                }
            }
        }
    });
}

async function updateNoticeScrollingMessages(noticeId) {
    const enableCheckbox = document.getElementById('scrollingEnabled');
    const labelInput = document.getElementById('scrollingLabel');
    const speedSelect = document.getElementById('scrollingSpeed');
    
    const notice = notices.find(n => n.id === noticeId);
    if (!notice) return;
    
    console.log(`🔄 Updating scrolling settings for notice ${noticeId}...`);
    
    // Update notice with new structure
    notice.scrollingEnabled = enableCheckbox ? enableCheckbox.checked : false;
    notice.scrollingLabel = labelInput ? labelInput.value : '';
    notice.scrollingSpeed = speedSelect ? speedSelect.value || 'medium' : 'medium';
    notice.order = notice.order || 1;
    
    console.log(`📋 Settings: enabled=${notice.scrollingEnabled}, label=${notice.scrollingLabel}, speed=${notice.scrollingSpeed}`);
    
    saveLocalNotices();
}

function loadNoticeScrollingSettings(notice) {
    const enableCheckbox = document.getElementById('scrollingEnabled');
    const labelInput = document.getElementById('scrollingLabel');
    const speedSelect = document.getElementById('scrollingSpeed');
    const scrollingOptions = document.getElementById('scrollingOptions');
    
    // Initialize defaults if not present
    if (notice.scrollingEnabled === undefined) {
        notice.scrollingEnabled = false;
        notice.scrollingLabel = '';
        notice.scrollingSpeed = 'medium';
        notice.order = 1;
    }
    
    if (enableCheckbox) enableCheckbox.checked = notice.scrollingEnabled;
    if (labelInput) labelInput.value = notice.scrollingLabel || '';
    if (speedSelect) speedSelect.value = notice.scrollingSpeed || 'medium';
    if (scrollingOptions) scrollingOptions.style.display = notice.scrollingEnabled ? 'block' : 'none';
}

// Legacy function - removed in favor of simpler approach

// Make functions globally accessible
window.editNotice = editNotice;
window.deleteNotice = deleteNoticeWithSync;