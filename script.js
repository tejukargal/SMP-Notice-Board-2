// Sample notices data
let notices = [
    {
        id: 1,
        title: "Semester Exam Time Table",
        content: "The time table for upcoming semester examinations has been released. Students are advised to check the examination schedule and prepare accordingly.",
        course: "ALL",
        priority: "High",
        category: "Notice",
        date: "2025-08-20",
        link: ""
    },
    {
        id: 2,
        title: "Workshop on AutoCAD",
        content: "A hands-on workshop on AutoCAD software will be conducted for final year students. Registration is mandatory.",
        course: "CE",
        priority: "Medium",
        category: "Notice",
        date: "2025-08-18",
        link: ""
    },
    {
        id: 3,
        title: "Industrial Visit - Toyota Motors",
        content: "Industrial visit to Toyota Motors manufacturing unit has been arranged for mechanical engineering students.",
        course: "ME",
        priority: "Medium",
        category: "Notice",
        date: "2025-08-17",
        link: ""
    },
    {
        id: 4,
        title: "Scholarship Applications Open",
        content: "Merit-based scholarship applications are now open for all courses. Last date for submission is 30th August 2025.",
        course: "ALL",
        priority: "High",
        category: "Memo",
        date: "2025-08-15",
        link: "https://scholarship.gov.in"
    },
    {
        id: 5,
        title: "Programming Contest Results",
        content: "Results of the inter-department programming contest have been declared. Congratulations to all winners!",
        course: "CS",
        priority: "Low",
        category: "Result",
        date: "2025-08-14",
        link: ""
    },
    {
        id: 6,
        title: "Circuit Design Competition",
        content: "Annual circuit design competition for Electronics and Electrical students. Prize money up to Rs. 10,000.",
        course: "EC",
        priority: "Medium",
        category: "Notice",
        date: "2025-08-12",
        link: ""
    },
    {
        id: 7,
        title: "Power System Lab Schedule",
        content: "New schedule for Power System Laboratory has been updated. Check the timetable for revised timings.",
        course: "EE",
        priority: "Medium",
        category: "Memo",
        date: "2025-08-10",
        link: ""
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

// Sync elements
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
function init() {
    loadDarkModePreference();
    renderNotices();
    setupEventListeners();
    updateNavigation();
    if (BUILT_IN_SYNC.enabled) {
        setupAutoSync();
        // Initial sync test
        setTimeout(testBuiltInConnection, 2000);
    }
}

// Render all notices
function renderNotices() {
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

    // Enhanced touch/swipe events for mobile
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isScrolling = false;
    let touchStarted = false;

    noticeContainer.addEventListener('touchstart', (e) => {
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
}

// Handle admin login
function handleLogin() {
    const password = adminPassword.value;
    if (password === 'teju*smp') {
        isAdminLoggedIn = true;
        loginModal.style.display = 'none';
        adminPanel.style.display = 'flex';
        adminPassword.value = '';
        adminBtn.textContent = 'Admin ✓';
        adminBtn.style.background = '#27ae60';
        
        // Show logout button and hide admin button
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
function handleNoticeSubmission(e) {
    e.preventDefault();
    
    if (editingNoticeId) {
        // Update existing notice
        const noticeIndex = notices.findIndex(n => n.id === editingNoticeId);
        if (noticeIndex !== -1) {
            notices[noticeIndex] = {
                ...notices[noticeIndex],
                title: document.getElementById('noticeTitle').value,
                content: document.getElementById('noticeContent').value,
                course: document.getElementById('noticeCourse').value,
                priority: document.getElementById('noticePriority').value,
                category: document.getElementById('noticeCategory').value,
                link: document.getElementById('noticeLink').value || ''
            };
        }
        editingNoticeId = null;
        submitBtn.textContent = 'Add Notice';
    } else {
        // Add new notice
        const newNotice = {
            id: Math.max(...notices.map(n => n.id)) + 1,
            title: document.getElementById('noticeTitle').value,
            content: document.getElementById('noticeContent').value,
            course: document.getElementById('noticeCourse').value,
            priority: document.getElementById('noticePriority').value,
            category: document.getElementById('noticeCategory').value,
            date: new Date().toISOString().split('T')[0],
            link: document.getElementById('noticeLink').value || ''
        };
        notices.unshift(newNotice);
    }

    saveLocalNotices();
    renderNotices();
    noticeForm.reset();
    adminPanel.style.display = 'none';
    
    // Scroll to the first notice if new, or stay at current if editing
    if (!editingNoticeId) {
        setTimeout(() => scrollToNotice(0), 100);
    }
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
    adminBtn.textContent = 'Admin';
    adminBtn.style.background = '#e74c3c';
    adminPanel.style.display = 'none';
    
    // Hide logout button and show admin button
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
        document.getElementById('noticeContent').value = notice.content;
        document.getElementById('noticeCourse').value = notice.course;
        document.getElementById('noticePriority').value = notice.priority;
        document.getElementById('noticeCategory').value = notice.category;
        document.getElementById('noticeLink').value = notice.link || '';
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
        
        // Try to sync from remote on startup
        setTimeout(syncFromRemote, 1000);
    } catch (error) {
        updateSyncStatus('error', `Connection failed: ${error.message}`);
        console.error('Built-in sync connection failed:', error);
    }
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
        // Auto-sync every 3 minutes
        autoSyncInterval = setInterval(async () => {
            try {
                await syncToRemote();
                updateSyncStatus('connected', `Last synced: ${new Date().toLocaleTimeString()}`);
            } catch (error) {
                console.error('Auto-sync failed:', error);
                updateSyncStatus('error', 'Auto-sync failed');
            }
        }, 3 * 60 * 1000);
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
    }
}

// Save notices to localStorage
function saveLocalNotices() {
    localStorage.setItem('smpNotices', JSON.stringify(notices));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadLocalNotices();
    init();
});

// Make functions globally accessible
window.editNotice = editNotice;
window.deleteNotice = deleteNoticeWithSync;