/**
 * Main application logic for the Project Management System
 */

// Debug logger
const Logger = {
    DEBUG_MODE: true,
    LOG_HISTORY: [],
    MAX_HISTORY: 100,

    log: function(message, data = null) {
        if (this.DEBUG_MODE) {
            const logMessage = data ? `[DEBUG] ${message}` : `[DEBUG] ${message}`;
            console.log(logMessage, data || '');
            this._addToHistory('debug', message, data);
        }
    },

    error: function(message, error = null) {
        if (this.DEBUG_MODE) {
            const errorMessage = error ? `[ERROR] ${message}` : `[ERROR] ${message}`;
            console.error(errorMessage, error || '');
            this._addToHistory('error', message, error);
        }
    },

    warn: function(message, data = null) {
        if (this.DEBUG_MODE) {
            const warnMessage = data ? `[WARNING] ${message}` : `[WARNING] ${message}`;
            console.warn(warnMessage, data || '');
            this._addToHistory('warning', message, data);
        }
    },

    _addToHistory: function(type, message, data) {
        const entry = {
            type: type,
            message: message,
            data: data,
            timestamp: new Date().toISOString()
        };

        this.LOG_HISTORY.unshift(entry);

        // Keep history size limited
        if (this.LOG_HISTORY.length > this.MAX_HISTORY) {
            this.LOG_HISTORY.pop();
        }
    },

    getHistory: function() {
        return this.LOG_HISTORY;
    },

    clearHistory: function() {
        this.LOG_HISTORY = [];
    },

    // Print log history to console
    printHistory: function() {
        console.group('Log History');
        this.LOG_HISTORY.forEach((entry, index) => {
            const prefix = `[${entry.timestamp}] [${entry.type.toUpperCase()}]`;
            console.log(`${index + 1}. ${prefix} ${entry.message}`, entry.data || '');
        });
        console.groupEnd();
    }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    Logger.log('DOM Content Loaded - Initializing application');
    // Initialize the application
    App.init();
});

// App Controller
class App {
    // Initialize the application
    static init() {
        Logger.log('Initializing application');

        try {
            // Initialize storage with sample data if empty
            Storage.initializeWithSampleData();
            Logger.log('Storage initialized');

            // Ensure admin user exists
            const adminUser = Storage.ensureAdminUser();
            Logger.log('Admin user verified', adminUser);

            // Initialize language support
            Language.init();
            UI.initLanguage();
            Logger.log('Language support initialized');

            // Initialize theme support
            Theme.init();
            Logger.log('Theme support initialized');

            // Initialize mobile support
            Mobile.init();
            Logger.log('Mobile support initialized');

            // Initialize notifications
            Notifications.init();
            Logger.log('Notifications system initialized');

            // Initialize comments system
            Comments.init();
            Logger.log('Comments system initialized');

            // Display projects
            UI.displayProjects(Storage.getProjects());
            Logger.log('Projects displayed');

            // Update current user display
            UI.updateCurrentUserDisplay();
            Logger.log('Current user display updated');

            // Add event listeners
            this.loadEventListeners();
            Logger.log('Event listeners loaded');

            // Verify add project button has event listener
            this.verifyAddProjectButton();

            // Diagnose and fix any modal issues
            this.diagnoseModalIssues();

            // Add global error handler
            this.setupGlobalErrorHandler();

            Logger.log('Application initialization complete');

            // Add diagnostic info to window object for debugging
            window.debugApp = {
                diagnose: this.diagnoseModalIssues,
                showModal: UI.openProjectModal,
                logger: Logger,
                storage: Storage
            };

            Logger.log('Debug utilities attached to window.debugApp');
        } catch (error) {
            Logger.error('Error during application initialization', error);
        }
    }

    // Setup global error handler
    static setupGlobalErrorHandler() {
        window.onerror = function(message, source, lineno, colno, error) {
            Logger.error('Global error:', { message, source, lineno, colno, error });
            return false; // Let default error handler run
        };

        window.addEventListener('unhandledrejection', function(event) {
            Logger.error('Unhandled promise rejection:', event.reason);
        });

        Logger.log('Global error handlers set up');
    }

    // Verify add project button has event listener
    static verifyAddProjectButton() {
        const addProjectBtn = document.getElementById('add-project-btn');
        if (!addProjectBtn) {
            Logger.error('Add project button not found in DOM');
            return;
        }

        Logger.log('Add project button found in DOM', addProjectBtn);

        // Force add event listener directly
        addProjectBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            Logger.log('Add project button clicked (from direct onclick handler)');
            UI.showProjectModal();
        };

        Logger.log('Direct onclick handler added to add project button');
    }

    // Diagnose modal issues
    static diagnoseModalIssues() {
        Logger.log('Diagnosing modal issues...');

        try {
            // Check if modal exists
            const modal = document.getElementById('project-modal');
            if (!modal) {
                Logger.error('Project modal not found in DOM');
                return 'Project modal not found in DOM. Will create it dynamically.';
            }

            // Check modal style
            Logger.log('Modal style:', {
                display: modal.style.display,
                visibility: modal.style.visibility,
                opacity: modal.style.opacity,
                zIndex: modal.style.zIndex
            });

            // Check modal content
            const modalContent = modal.querySelector('.modal-content');
            if (!modalContent) {
                Logger.error('Modal content not found');
                return 'Modal content not found. Modal structure may be incorrect.';
            }

            // Check form
            const form = document.getElementById('project-form');
            if (!form) {
                Logger.error('Project form not found');
                return 'Project form not found. Modal structure may be incorrect.';
            }

            // Check event listeners
            const addProjectBtn = document.getElementById('add-project-btn');
            if (!addProjectBtn) {
                Logger.error('Add project button not found');
                return 'Add project button not found. Cannot trigger modal.';
            }

            // Force fix modal
            modal.style.display = 'none';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            modal.style.zIndex = '1000';

            modalContent.style.display = 'block';
            modalContent.style.visibility = 'visible';
            modalContent.style.opacity = '1';

            // Add show class
            modal.classList.remove('show');

            Logger.log('Modal diagnosis complete. Fixed potential issues.');
            return 'Modal diagnosis complete. Fixed potential issues.';
        } catch (error) {
            Logger.error('Error during modal diagnosis:', error);
            return 'Error during modal diagnosis: ' + error.message;
        }
    }

    // Load event listeners
    static loadEventListeners() {
        // Project related events
        const addProjectBtn = document.getElementById('add-project-btn');
        if (addProjectBtn) {
            // Remove any existing event listeners to prevent duplicates
            const newAddProjectBtn = addProjectBtn.cloneNode(true);
            addProjectBtn.parentNode.replaceChild(newAddProjectBtn, addProjectBtn);

            // Add new event listener
            newAddProjectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add project button clicked');
                UI.showProjectModal();
            });
        } else {
            console.error('Add project button not found');
        }

        document.getElementById('back-to-dashboard').addEventListener('click', () => {
            UI.showDashboard();
        });

        // Task related events
        document.getElementById('add-task-btn').addEventListener('click', () => {
            UI.showTaskModal();
        });

        // User related events
        document.getElementById('user-settings-btn').addEventListener('click', () => {
            UI.showUserModal();
        });

        // Admin dashboard events
        const adminDashboardBtn = document.getElementById('admin-dashboard-btn');
        if (adminDashboardBtn) {
            adminDashboardBtn.addEventListener('click', () => {
                UI.showAdminDashboard();
            });
        }

        const backToMainDashboardBtn = document.getElementById('back-to-dashboard-from-admin');
        if (backToMainDashboardBtn) {
            backToMainDashboardBtn.addEventListener('click', () => {
                UI.showDashboard();
            });
        }

        // Admin tools events
        const exportDataBtn = document.getElementById('export-data-btn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                UI.exportData();
            });
        }

        const importDataBtn = document.getElementById('import-data-btn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => {
                UI.importData();
            });
        }

        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                UI.clearData();
            });
        }

        const manageUsersBtn = document.getElementById('manage-users-btn');
        if (manageUsersBtn) {
            manageUsersBtn.addEventListener('click', () => {
                UI.showUserModal();
            });
        }

        const addAdminUserBtn = document.getElementById('add-admin-user-btn');
        if (addAdminUserBtn) {
            addAdminUserBtn.addEventListener('click', () => {
                UI.addAdminUser();
            });
        }

        // Search functionality
        document.getElementById('search-input').addEventListener('input', this.handleSearch);
        document.getElementById('search-btn').addEventListener('click', this.handleSearch);

        // Filter functionality
        document.getElementById('status-filter').addEventListener('change', this.handleProjectFilter);
        document.getElementById('sort-by').addEventListener('change', this.handleProjectFilter);

        document.getElementById('task-status-filter').addEventListener('change', this.handleTaskFilter);
        document.getElementById('task-priority-filter').addEventListener('change', this.handleTaskFilter);

        // Window events for modals
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    // Handle project search
    static handleSearch() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const sortBy = document.getElementById('sort-by').value;

        let projects = Storage.getProjects();

        // Filter by search term
        if (searchTerm) {
            projects = projects.filter(project =>
                project.name.toLowerCase().includes(searchTerm) ||
                (project.description && project.description.toLowerCase().includes(searchTerm))
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            projects = projects.filter(project => project.status === statusFilter);
        }

        // Apply sorting
        projects = App.sortProjects(projects, sortBy);

        // Display filtered projects
        UI.displayProjects(projects);
    }

    // Handle project filtering
    static handleProjectFilter() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const sortBy = document.getElementById('sort-by').value;

        let projects = Storage.getProjects();

        // Filter by search term
        if (searchTerm) {
            projects = projects.filter(project =>
                project.name.toLowerCase().includes(searchTerm) ||
                (project.description && project.description.toLowerCase().includes(searchTerm))
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            projects = projects.filter(project => project.status === statusFilter);
        }

        // Apply sorting
        projects = App.sortProjects(projects, sortBy);

        // Display filtered projects
        UI.displayProjects(projects);
    }

    // Sort projects
    static sortProjects(projects, sortBy) {
        switch (sortBy) {
            case 'name':
                return projects.sort((a, b) => a.name.localeCompare(b.name));
            case 'deadline':
                return projects.sort((a, b) => {
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                });
            case 'date-created':
            default:
                return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    // Handle task filtering
    static handleTaskFilter() {
        const statusFilter = document.getElementById('task-status-filter').value;
        const priorityFilter = document.getElementById('task-priority-filter').value;

        // Get current project ID
        const projectId = document.getElementById('add-task-btn').dataset.projectId;
        if (!projectId) return;

        let tasks = Storage.getProjectTasks(projectId);

        // Apply status filter
        if (statusFilter !== 'all') {
            tasks = tasks.filter(task => task.status === statusFilter);
        }

        // Apply priority filter
        if (priorityFilter !== 'all') {
            tasks = tasks.filter(task => task.priority === priorityFilter);
        }

        // Clear tasks container
        const tasksContainer = document.getElementById('tasks-container');
        tasksContainer.innerHTML = '';

        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <p>${Language.translate('no_tasks_match')}</p>
                </div>
            `;
            return;
        }

        // Display filtered tasks
        tasks.forEach(task => {
            UI.addTaskToList(task);
        });
    }
}
