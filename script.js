// Sample notices data
// Global CSV messages cache
let csvMessagesCache = {};

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
        scrollingMessages: {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        }
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
        scrollingMessages: {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        }
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
        scrollingMessages: {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        }
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
        scrollingMessages: {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        }
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
        scrollingMessages: {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        }
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
        scrollingMessages: {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        }
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
        scrollingMessages: {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        }
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
    loadScrollingMessagesSettings();
    
    // Load scrolling messages for notices that have them enabled
    for (const notice of notices) {
        if (notice.scrollingMessages && notice.scrollingMessages.enabled && notice.scrollingMessages.csvFileName) {
            notice.scrollingMessages.messages = await loadCSVMessages(notice.scrollingMessages.csvFileName);
        }
    }
    
    renderNotices();
    setupEventListeners();
    updateNavigation();
    if (BUILT_IN_SYNC.enabled) {
        setupAutoSync();
        // Initial sync test
        setTimeout(testBuiltInConnection, 2000);
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
    
    updateNavDots();
}

// Create individual notice card
function createNoticeCard(notice, index) {
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
            ${notice.scrollingMessages && notice.scrollingMessages.enabled && notice.scrollingMessages.messages.length > 0 ? 
                createScrollingMessagesHTML(notice.scrollingMessages.title, notice.scrollingMessages.messages, notice.scrollingMessages.speed) : ''}
            ${notice.link ? `<a href="${notice.link}" target="_blank" class="notice-link">View Link</a>` : ''}
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

// Update navigation dots
function updateNavDots() {
    navDots.innerHTML = '';
    notices.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `nav-dot ${index === currentNoticeIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => scrollToNotice(index));
        navDots.appendChild(dot);
    });
}

// Scroll to specific notice
function scrollToNotice(index) {
    const noticeCards = document.querySelectorAll('.notice-card');
    if (noticeCards[index]) {
        noticeCards[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        currentNoticeIndex = index;
        updateNavigation();
    }
}

// Update navigation state
function updateNavigation() {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentNoticeIndex);
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
    
    // Scrolling messages settings are now handled per-notice
    // No global event listeners needed

    // Enhanced touch/swipe events for mobile
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isScrolling = false;
    let touchStarted = false;

    noticeContainer.addEventListener('touchstart', (e) => {
        // Don't interfere with button clicks
        if (e.target.classList.contains('edit-btn') || 
            e.target.classList.contains('delete-btn') ||
            e.target.closest('.edit-btn') ||
            e.target.closest('.delete-btn')) {
            return;
        }
        
        touchStarted = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
        isScrolling = false;
        
        // Prevent default scroll behavior during swipe
        e.preventDefault();
    }, { passive: false });

    noticeContainer.addEventListener('touchmove', (e) => {
        if (!touchStarted) return;
        
        // Don't interfere with button interactions
        if (e.target.classList.contains('edit-btn') || 
            e.target.classList.contains('delete-btn') ||
            e.target.closest('.edit-btn') ||
            e.target.closest('.delete-btn')) {
            return;
        }
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);

        // Determine if user is scrolling vertically or swiping horizontally
        if (diffY > diffX) {
            isScrolling = true;
        }

        // If horizontal swipe, prevent default scrolling
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    noticeContainer.addEventListener('touchend', (e) => {
        if (!touchStarted) return;
        touchStarted = false;

        // Don't interfere with button interactions
        if (e.target.classList.contains('edit-btn') || 
            e.target.classList.contains('delete-btn') ||
            e.target.closest('.edit-btn') ||
            e.target.closest('.delete-btn')) {
            return;
        }

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        const timeDiff = Date.now() - startTime;

        // Only handle horizontal swipes (ignore vertical scrolling)
        if (!isScrolling && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30 && timeDiff < 500) {
            e.preventDefault();
            
            if (diffX > 0 && currentNoticeIndex < notices.length - 1) {
                // Swipe left - next notice
                scrollToNotice(currentNoticeIndex + 1);
            } else if (diffX < 0 && currentNoticeIndex > 0) {
                // Swipe right - previous notice
                scrollToNotice(currentNoticeIndex - 1);
            }
        }
    });

    // Mouse events for desktop swipe simulation
    let mouseStartX = 0;
    let isMouseDown = false;

    noticeContainer.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouseStartX = e.clientX;
    });

    noticeContainer.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;

        const diffX = mouseStartX - e.clientX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0 && currentNoticeIndex < notices.length - 1) {
                scrollToNotice(currentNoticeIndex + 1);
            } else if (diffX < 0 && currentNoticeIndex > 0) {
                scrollToNotice(currentNoticeIndex - 1);
            }
        }
    });

    noticeContainer.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });

    // Scroll event to update current notice
    noticeContainer.addEventListener('scroll', debounce(updateCurrentNoticeOnScroll, 100));
    
    // Add window focus event to sync when switching devices
    window.addEventListener('focus', () => {
        if (BUILT_IN_SYNC.enabled && BUILT_IN_SYNC.jsonHostId) {
            setTimeout(syncFromRemoteWithRetry, 500);
        }
    });
    
    // Add online/offline event listeners for better sync management
    window.addEventListener('online', () => {
        if (BUILT_IN_SYNC.enabled) {
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
        
        // Re-render cards to show edit/delete buttons
        renderNotices();
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
            notices[noticeIndex] = {
                ...notices[noticeIndex],
                title: document.getElementById('noticeTitle').value,
                content: noticeContent.innerHTML,
                course: document.getElementById('noticeCourse').value,
                priority: document.getElementById('noticePriority').value,
                importance: noticeImportance.value,
                category: document.getElementById('noticeCategory').value,
                link: document.getElementById('noticeLink').value || ''
            };
            // Update scrolling messages for this notice
            await updateNoticeScrollingMessages(editingNoticeId);
        }
        editingNoticeId = null;
        submitBtn.textContent = 'Add Notice';
    } else {
        // Add new notice - ID will be reassigned during sorting
        const newNotice = {
            id: notices.length + 1,
            title: document.getElementById('noticeTitle').value,
            content: noticeContent.innerHTML,
            course: document.getElementById('noticeCourse').value,
            priority: document.getElementById('noticePriority').value,
            importance: noticeImportance.value,
            category: document.getElementById('noticeCategory').value,
            date: new Date().toISOString().split('T')[0],
            link: document.getElementById('noticeLink').value || '',
            scrollingMessages: {
                enabled: false,
                title: '',
                csvFileName: '',
                speed: 'normal',
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
    setTimeout(() => scrollToNotice(0), 100);
}

// Update current notice index based on scroll position
function updateCurrentNoticeOnScroll() {
    const containerRect = noticeContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    const noticeCards = document.querySelectorAll('.notice-card');
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    noticeCards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });
    
    if (closestIndex !== currentNoticeIndex) {
        currentNoticeIndex = closestIndex;
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
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
}

// Admin logout function
function handleLogout() {
    isAdminLoggedIn = false;
    adminPanel.style.display = 'none';
    
    // Hide add notice and logout buttons, show admin button
    addNoticeBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
    adminBtn.style.display = 'block';
    
    renderNotices(); // Re-render to remove edit buttons
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
        document.getElementById('noticeLink').value = notice.link || '';
        
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
                setTimeout(() => scrollToNotice(currentNoticeIndex), 100);
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
        await makeJsonHostRequest('GET', `/json/${BUILT_IN_SYNC.jsonHostId}`);
        updateSyncStatus('connected', 'Auto-sync enabled');
        
        // Try to sync from remote on startup with retry logic
        setTimeout(syncFromRemoteWithRetry, 1000);
    } catch (error) {
        updateSyncStatus('error', `Connection failed: ${error.message}`);
        console.error('Built-in sync connection failed:', error);
        // Retry connection after 30 seconds
        setTimeout(testBuiltInConnection, 30000);
    }
}

// Sync from remote with retry logic
async function syncFromRemoteWithRetry(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await syncFromRemote();
            return; // Success, exit retry loop
        } catch (error) {
            console.warn(`Sync attempt ${i + 1} failed:`, error);
            if (i < retries - 1) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }
    console.error('All sync attempts failed');
}


// Sync notices to JSONhost
async function syncToRemote() {
    if (!BUILT_IN_SYNC.enabled || !BUILT_IN_SYNC.jsonHostId || !BUILT_IN_SYNC.jsonHostToken) {
        throw new Error('Sync not configured');
    }

    const syncData = {
        notices: notices,
        lastModified: new Date().toISOString(),
        version: '1.0'
    };

    await makeJsonHostRequest('POST', `/json/${BUILT_IN_SYNC.jsonHostId}`, syncData, true);
    console.log('Synced to remote successfully');
}

// Sync notices from JSONhost
async function syncFromRemote() {
    if (!BUILT_IN_SYNC.enabled || !BUILT_IN_SYNC.jsonHostId) {
        throw new Error('Sync not configured');
    }

    try {
        const remoteData = await makeJsonHostRequest('GET', `/json/${BUILT_IN_SYNC.jsonHostId}`);
        
        if (remoteData && remoteData.notices) {
            notices = remoteData.notices;
            saveLocalNotices();
            renderNotices();
            updateNavigation();
            console.log('Synced from remote successfully');
        }
    } catch (error) {
        console.error('Sync from remote failed:', error);
        // If remote doesn't exist, initialize it with current data
        if (error.message.includes('404')) {
            await syncToRemote();
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
                await syncToRemote();
                updateSyncStatus('connected', `Last synced: ${new Date().toLocaleTimeString()}`);
            } catch (error) {
                console.error('Auto-sync failed:', error);
                // Try to sync from remote to get latest data
                try {
                    await syncFromRemote();
                    updateSyncStatus('connected', `Synced from remote: ${new Date().toLocaleTimeString()}`);
                } catch (syncError) {
                    console.error('Fallback sync from remote also failed:', syncError);
                    updateSyncStatus('error', 'Sync issues detected');
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
                setTimeout(() => scrollToNotice(currentNoticeIndex), 100);
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
        notices = JSON.parse(saved);
        // Ensure backward compatibility - add scrollingMessages to existing notices
        notices.forEach(notice => {
            if (!notice.scrollingMessages) {
                notice.scrollingMessages = {
                    enabled: false,
                    title: '',
                    csvFileName: '',
                    speed: 'normal',
                    messages: []
                };
            }
        });
        saveLocalNotices(); // Save updated structure
    }
}

// Save notices to localStorage
function saveLocalNotices() {
    localStorage.setItem('smpNotices', JSON.stringify(notices));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    loadLocalNotices();
    await init();
});

// CSV Parsing and Scrolling Messages Functions
async function parseCSVFile(fileName) {
    try {
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`Could not fetch ${fileName}`);
        }
        const csvText = await response.text();
        return parseCSVText(csvText);
    } catch (error) {
        console.error('Error parsing CSV file:', error);
        return [];
    }
}

function parseCSVText(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const messages = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        // Create a formatted message from the row data
        const message = `${row[headers[1]] || 'N/A'} - ${row[headers[2]] || ''} ${row[headers[3]] || ''} - Fee Dues: ${row[headers[5]] || '0'}`;
        messages.push(message);
    }
    
    return messages;
}

function createScrollingMessagesHTML(title, messages, speed = 'normal') {
    if (!messages || messages.length === 0) return '';
    
    const messagesHTML = messages.map(message => 
        `<div class="message-item">${message}</div>`
    ).join('');
    
    return `
        <div class="scrolling-messages">
            <h4>${title || 'Scrolling Messages'}</h4>
            <div class="messages-container">
                <div class="messages-scroll ${speed}">
                    ${messagesHTML}
                    ${messagesHTML} <!-- Duplicate for seamless scrolling -->
                </div>
            </div>
        </div>
    `;
}

function loadScrollingMessagesSettings() {
    // This function is no longer needed as settings are per-notice
    // But we keep it for compatibility during the init process
}

async function loadCSVMessages(csvFileName) {
    if (!csvFileName) return [];
    
    // Check cache first
    if (csvMessagesCache[csvFileName]) {
        return csvMessagesCache[csvFileName];
    }
    
    // Load and cache messages
    const messages = await parseCSVFile(csvFileName);
    csvMessagesCache[csvFileName] = messages;
    return messages;
}

async function updateNoticeScrollingMessages(noticeId) {
    const enableCheckbox = document.getElementById('enableScrollingMessages');
    const titleInput = document.getElementById('scrollingTitle');
    const csvFileInput = document.getElementById('csvFileName');
    const speedSelect = document.getElementById('scrollingSpeed');
    
    const notice = notices.find(n => n.id === noticeId);
    if (!notice) return;
    
    // Initialize scrollingMessages if it doesn't exist
    if (!notice.scrollingMessages) {
        notice.scrollingMessages = {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        };
    }
    
    notice.scrollingMessages.enabled = enableCheckbox.checked;
    notice.scrollingMessages.title = titleInput.value;
    notice.scrollingMessages.csvFileName = csvFileInput.value;
    notice.scrollingMessages.speed = speedSelect.value || 'normal';
    
    if (notice.scrollingMessages.enabled && notice.scrollingMessages.csvFileName) {
        notice.scrollingMessages.messages = await loadCSVMessages(notice.scrollingMessages.csvFileName);
    } else {
        notice.scrollingMessages.messages = [];
    }
    
    saveLocalNotices();
}

function loadNoticeScrollingSettings(notice) {
    const enableCheckbox = document.getElementById('enableScrollingMessages');
    const titleInput = document.getElementById('scrollingTitle');
    const csvFileInput = document.getElementById('csvFileName');
    const speedSelect = document.getElementById('scrollingSpeed');
    
    if (!notice.scrollingMessages) {
        notice.scrollingMessages = {
            enabled: false,
            title: '',
            csvFileName: '',
            speed: 'normal',
            messages: []
        };
    }
    
    if (enableCheckbox) enableCheckbox.checked = notice.scrollingMessages.enabled;
    if (titleInput) titleInput.value = notice.scrollingMessages.title;
    if (csvFileInput) csvFileInput.value = notice.scrollingMessages.csvFileName;
    if (speedSelect) speedSelect.value = notice.scrollingMessages.speed || 'normal';
}

// Make functions globally accessible
window.editNotice = editNotice;
window.deleteNotice = deleteNoticeWithSync;