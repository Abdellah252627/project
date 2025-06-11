/**
 * Theme management for the Project Management System
 * Handles dark mode toggle and persistence
 */
class Theme {
    // Theme storage key
    static THEME_KEY = 'pms_theme';
    
    // Initialize theme
    static init() {
        // Get saved theme or use system preference
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        
        if (savedTheme) {
            // Apply saved theme
            this.setTheme(savedTheme);
        } else {
            // Check for system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.setTheme('dark');
            } else {
                this.setTheme('light');
            }
            
            // Listen for system preference changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
        
        // Add event listener to theme toggle button
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        if (typeof Logger !== 'undefined') {
            Logger.log('Theme system initialized');
        }
    }
    
    // Set theme (dark or light)
    static setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.updateThemeIcon('dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.updateThemeIcon('light');
        }
        
        // Save theme preference
        localStorage.setItem(this.THEME_KEY, theme);
        
        if (typeof Logger !== 'undefined') {
            Logger.log(`Theme set to ${theme} mode`);
        }
    }
    
    // Toggle between dark and light theme
    static toggleTheme() {
        const currentTheme = localStorage.getItem(this.THEME_KEY) || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.setTheme(newTheme);
        
        if (typeof Logger !== 'undefined') {
            Logger.log(`Theme toggled to ${newTheme} mode`);
        }
    }
    
    // Update theme toggle button icon
    static updateThemeIcon(theme) {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (!themeToggleBtn) return;
        
        const icon = themeToggleBtn.querySelector('i');
        if (!icon) return;
        
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeToggleBtn.title = 'Switch to Light Mode';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeToggleBtn.title = 'Switch to Dark Mode';
        }
    }
    
    // Get current theme
    static getCurrentTheme() {
        return localStorage.getItem(this.THEME_KEY) || 'light';
    }
    
    // Check if dark mode is active
    static isDarkMode() {
        return this.getCurrentTheme() === 'dark';
    }
}
