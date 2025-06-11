/**
 * Mobile functionality for the Project Management System
 * Handles mobile sidebar and responsive features
 */
class Mobile {
    // Initialize mobile functionality
    static init() {
        this.setupMobileSidebar();
        this.setupMobileLanguageSync();
        this.setupMobileThemeSync();
        this.setupMobileNavigation();
        
        if (typeof Logger !== 'undefined') {
            Logger.log('Mobile functionality initialized');
        }
    }
    
    // Setup mobile sidebar
    static setupMobileSidebar() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        
        if (!mobileMenuBtn || !closeMobileMenuBtn || !mobileSidebar || !mobileMenuOverlay) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Mobile sidebar elements not found');
            }
            return;
        }
        
        // Open mobile sidebar
        mobileMenuBtn.addEventListener('click', () => {
            mobileSidebar.classList.add('open');
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            if (typeof Logger !== 'undefined') {
                Logger.log('Mobile sidebar opened');
            }
        });
        
        // Close mobile sidebar
        const closeMobileSidebar = () => {
            mobileSidebar.classList.remove('open');
            mobileMenuOverlay.classList.remove('open');
            setTimeout(() => {
                mobileMenuOverlay.classList.add('hidden');
            }, 300); // Match transition duration
            document.body.style.overflow = ''; // Restore scrolling
            
            if (typeof Logger !== 'undefined') {
                Logger.log('Mobile sidebar closed');
            }
        };
        
        closeMobileMenuBtn.addEventListener('click', closeMobileSidebar);
        mobileMenuOverlay.addEventListener('click', closeMobileSidebar);
        
        // Close sidebar on window resize if screen becomes larger
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileSidebar.classList.contains('open')) {
                closeMobileSidebar();
            }
        });
    }
    
    // Sync mobile language selector with desktop
    static setupMobileLanguageSync() {
        const desktopLanguageSelect = document.getElementById('language-select');
        const mobileLanguageSelect = document.getElementById('mobile-language-select');
        
        if (!desktopLanguageSelect || !mobileLanguageSelect) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Language selectors not found');
            }
            return;
        }
        
        // Set initial value
        mobileLanguageSelect.value = desktopLanguageSelect.value;
        
        // Sync from mobile to desktop
        mobileLanguageSelect.addEventListener('change', () => {
            desktopLanguageSelect.value = mobileLanguageSelect.value;
            
            // Trigger change event on desktop selector
            const event = new Event('change');
            desktopLanguageSelect.dispatchEvent(event);
            
            if (typeof Logger !== 'undefined') {
                Logger.log('Language changed from mobile selector');
            }
        });
        
        // Sync from desktop to mobile
        desktopLanguageSelect.addEventListener('change', () => {
            mobileLanguageSelect.value = desktopLanguageSelect.value;
        });
    }
    
    // Sync mobile theme toggle with desktop
    static setupMobileThemeSync() {
        const desktopThemeBtn = document.getElementById('theme-toggle-btn');
        const mobileThemeBtn = document.getElementById('mobile-theme-toggle-btn');
        const mobileThemeText = document.getElementById('mobile-theme-text');
        
        if (!desktopThemeBtn || !mobileThemeBtn || !mobileThemeText) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Theme toggle elements not found');
            }
            return;
        }
        
        // Update mobile theme text and icon
        const updateMobileThemeUI = () => {
            const isDarkMode = document.documentElement.hasAttribute('data-theme');
            const mobileIcon = mobileThemeBtn.querySelector('i');
            
            if (isDarkMode) {
                mobileIcon.classList.remove('fa-moon');
                mobileIcon.classList.add('fa-sun');
                mobileThemeText.textContent = 'Light Mode';
            } else {
                mobileIcon.classList.remove('fa-sun');
                mobileIcon.classList.add('fa-moon');
                mobileThemeText.textContent = 'Dark Mode';
            }
        };
        
        // Set initial state
        updateMobileThemeUI();
        
        // Toggle theme from mobile
        mobileThemeBtn.addEventListener('click', () => {
            // Use the Theme class to toggle
            if (typeof Theme !== 'undefined') {
                Theme.toggleTheme();
                updateMobileThemeUI();
            }
            
            if (typeof Logger !== 'undefined') {
                Logger.log('Theme toggled from mobile button');
            }
        });
        
        // Update mobile UI when desktop theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    updateMobileThemeUI();
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    }
    
    // Setup mobile navigation
    static setupMobileNavigation() {
        const mobileDashboardLink = document.getElementById('mobile-dashboard-link');
        const mobileUserSettingsLink = document.getElementById('mobile-user-settings-link');
        const mobileAdminLink = document.getElementById('mobile-admin-link');
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        
        if (!mobileDashboardLink || !mobileUserSettingsLink || !mobileSidebar || !mobileMenuOverlay) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Mobile navigation elements not found');
            }
            return;
        }
        
        // Close sidebar function
        const closeMobileSidebar = () => {
            mobileSidebar.classList.remove('open');
            mobileMenuOverlay.classList.remove('open');
            setTimeout(() => {
                mobileMenuOverlay.classList.add('hidden');
            }, 300);
            document.body.style.overflow = '';
        };
        
        // Dashboard link
        mobileDashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            UI.showDashboard();
            closeMobileSidebar();
            
            if (typeof Logger !== 'undefined') {
                Logger.log('Navigated to dashboard from mobile menu');
            }
        });
        
        // User settings link
        mobileUserSettingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            UI.showUserModal();
            closeMobileSidebar();
            
            if (typeof Logger !== 'undefined') {
                Logger.log('Opened user settings from mobile menu');
            }
        });
        
        // Admin link
        if (mobileAdminLink) {
            mobileAdminLink.addEventListener('click', (e) => {
                e.preventDefault();
                UI.showAdminDashboard();
                closeMobileSidebar();
                
                if (typeof Logger !== 'undefined') {
                    Logger.log('Navigated to admin dashboard from mobile menu');
                }
            });
        }
    }
}
