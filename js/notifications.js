/**
 * Notifications functionality for the Project Management System
 * Handles notification display, creation, and management
 */
class Notifications {
    // DOM elements
    static notificationsBtn;
    static notificationsBadge;
    static notificationsContainer;
    static notificationsList;
    static markAllReadBtn;
    static clearAllNotificationsBtn;

    // Initialize notifications
    static init() {
        // Initialize DOM elements
        this.notificationsBtn = document.getElementById('notifications-btn');
        this.notificationsBadge = document.getElementById('notifications-badge');
        this.notificationsContainer = document.getElementById('notifications-container');
        this.notificationsList = document.getElementById('notifications-list');
        this.markAllReadBtn = document.getElementById('mark-all-read-btn');
        this.clearAllNotificationsBtn = document.getElementById('clear-all-notifications-btn');
        this.notificationsTitle = document.getElementById('notifications-title');

        // Check if required elements exist
        if (!this.notificationsBtn || !this.notificationsContainer) {
            console.error('Notifications: Required DOM elements not found');
            if (typeof Logger !== 'undefined') {
                Logger.error('Notifications: Required DOM elements not found', {
                    notificationsBtn: !!this.notificationsBtn,
                    notificationsContainer: !!this.notificationsContainer
                });
            }
            return;
        }

        this.setupEventListeners();
        this.updateNotifications();
        this.setupNotificationChecker();
        this.updateTranslations();

        // Listen for language changes
        document.addEventListener('language-changed', () => {
            this.updateTranslations();
        });

        if (typeof Logger !== 'undefined') {
            Logger.log('Notifications system initialized');
        }
    }

    // Update translations
    static updateTranslations() {
        try {
            // Update notifications title
            if (this.notificationsTitle && typeof Language !== 'undefined') {
                this.notificationsTitle.textContent = Language.translate('notifications');
            }

            // Update button titles
            if (this.markAllReadBtn && typeof Language !== 'undefined') {
                this.markAllReadBtn.title = Language.translate('mark_all_read');
            }

            if (this.clearAllNotificationsBtn && typeof Language !== 'undefined') {
                this.clearAllNotificationsBtn.title = Language.translate('clear_all');
            }

            // Update notifications button title
            if (this.notificationsBtn && typeof Language !== 'undefined') {
                this.notificationsBtn.title = Language.translate('notifications');
            }

            if (typeof Logger !== 'undefined') {
                Logger.log('Notifications: Translations updated');
            }
        } catch (error) {
            console.error('Notifications: Error updating translations', error);
            if (typeof Logger !== 'undefined') {
                Logger.error('Notifications: Error updating translations', error);
            }
        }
    }

    // Setup event listeners
    static setupEventListeners() {
        // Toggle notifications container
        if (this.notificationsBtn) {
            // Remove any existing event listeners to prevent duplicates
            this.notificationsBtn.removeEventListener('click', this._handleNotificationBtnClick);

            // Add click event listener with a named function for easier removal
            this._handleNotificationBtnClick = () => {
                this.toggleNotificationsContainer();
            };

            this.notificationsBtn.addEventListener('click', this._handleNotificationBtnClick);

            if (typeof Logger !== 'undefined') {
                Logger.log('Notifications: Button click event listener added');
            }
        } else {
            console.error('Notifications: Button element not found for event listener');
            if (typeof Logger !== 'undefined') {
                Logger.error('Notifications: Button element not found for event listener');
            }
        }

        // Close notifications when clicking outside
        document.removeEventListener('click', this._handleDocumentClick);
        this._handleDocumentClick = (e) => {
            if (this.notificationsContainer &&
                !this.notificationsContainer.contains(e.target) &&
                e.target !== this.notificationsBtn &&
                !this.notificationsContainer.classList.contains('hidden')) {
                this.notificationsContainer.classList.add('hidden');

                if (typeof Logger !== 'undefined') {
                    Logger.log('Notifications: Container closed by clicking outside');
                }
            }
        };
        document.addEventListener('click', this._handleDocumentClick);

        // Mark all as read
        if (this.markAllReadBtn) {
            this.markAllReadBtn.removeEventListener('click', this._handleMarkAllReadClick);
            this._handleMarkAllReadClick = () => {
                this.markAllAsRead();
            };
            this.markAllReadBtn.addEventListener('click', this._handleMarkAllReadClick);
        } else {
            console.warn('Notifications: Mark all read button not found');
        }

        // Clear all notifications
        if (this.clearAllNotificationsBtn) {
            this.clearAllNotificationsBtn.removeEventListener('click', this._handleClearAllClick);
            this._handleClearAllClick = () => {
                this.clearAllNotifications();
            };
            this.clearAllNotificationsBtn.addEventListener('click', this._handleClearAllClick);
        } else {
            console.warn('Notifications: Clear all button not found');
        }

        if (typeof Logger !== 'undefined') {
            Logger.log('Notifications: All event listeners set up');
        }
    }

    // Toggle notifications container
    static toggleNotificationsContainer() {
        if (!this.notificationsContainer) {
            console.error('Notifications: Container element not found');
            if (typeof Logger !== 'undefined') {
                Logger.error('Notifications: Container element not found when toggling');
            }
            return;
        }

        // Toggle visibility
        const isHidden = this.notificationsContainer.classList.contains('hidden');

        if (isHidden) {
            // Show the container
            this.notificationsContainer.classList.remove('hidden');
            this.updateNotifications();

            if (typeof Logger !== 'undefined') {
                Logger.log('Notifications container opened');
            }
        } else {
            // Hide the container
            this.notificationsContainer.classList.add('hidden');

            if (typeof Logger !== 'undefined') {
                Logger.log('Notifications container closed');
            }
        }
    }

    // Update notifications display
    static updateNotifications() {
        if (!this.notificationsList) {
            console.error('Notifications: Notifications list element not found');
            if (typeof Logger !== 'undefined') {
                Logger.error('Notifications: Notifications list element not found when updating');
            }
            return;
        }

        try {
            const notifications = Storage.getCurrentUserNotifications();
            const unreadCount = Storage.getUnreadNotificationsCount();

            // Update badge
            if (this.notificationsBadge) {
                if (unreadCount > 0) {
                    this.notificationsBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                    this.notificationsBadge.classList.remove('hidden');
                } else {
                    this.notificationsBadge.classList.add('hidden');
                }
            } else {
                console.warn('Notifications: Badge element not found');
            }

            // Clear current notifications
            this.notificationsList.innerHTML = '';

            // If no notifications, show empty state
            if (notifications.length === 0) {
                this.notificationsList.innerHTML = `
                    <div class="empty-notifications">
                        <p>${Language.translate('no_notifications')}</p>
                    </div>
                `;
                return;
            }

            // Add notifications to the list
            notifications.forEach(notification => {
                const notificationElement = this.createNotificationElement(notification);
                this.notificationsList.appendChild(notificationElement);
            });

            if (typeof Logger !== 'undefined') {
                Logger.log(`Updated notifications display: ${notifications.length} notifications, ${unreadCount} unread`);
            }
        } catch (error) {
            console.error('Notifications: Error updating notifications', error);
            if (typeof Logger !== 'undefined') {
                Logger.error('Notifications: Error updating notifications', error);
            }
        }
    }

    // Create notification element
    static createNotificationElement(notification) {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification-item');
        notificationElement.classList.add(notification.type);

        if (!notification.read) {
            notificationElement.classList.add('unread');
        }

        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${notification.getIconClass()}"></i>
                <div class="notification-content">
                    <div class="notification-header">
                        <span class="notification-title">${notification.title}</span>
                        <span class="notification-time">${notification.getFormattedDate()}</span>
                    </div>
                    <div class="notification-message">${notification.message}</div>
                </div>
            </div>
            <div class="notification-actions">
                ${!notification.read ?
                    `<button class="btn btn-small mark-read-btn" data-id="${notification.id}">
                        <i class="fas fa-check"></i> ${Language.translate('mark_read')}
                    </button>` : ''}
                <button class="btn btn-small btn-danger delete-notification-btn" data-id="${notification.id}">
                    <i class="fas fa-trash"></i> ${Language.translate('delete_notification')}
                </button>
            </div>
        `;

        // Add event listeners
        const markReadBtn = notificationElement.querySelector('.mark-read-btn');
        if (markReadBtn) {
            markReadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markAsRead(notification.id);
            });
        }

        const deleteBtn = notificationElement.querySelector('.delete-notification-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteNotification(notification.id);
            });
        }

        // Add click event to mark as read and navigate if related item exists
        notificationElement.addEventListener('click', () => {
            if (!notification.read) {
                this.markAsRead(notification.id);
            }

            if (notification.relatedId) {
                this.navigateToRelatedItem(notification);
            }
        });

        return notificationElement;
    }

    // Mark notification as read
    static markAsRead(id) {
        if (Storage.markNotificationAsRead(id)) {
            this.updateNotifications();

            if (typeof Logger !== 'undefined') {
                Logger.log('Notification marked as read', id);
            }
        }
    }

    // Mark all notifications as read
    static markAllAsRead() {
        if (Storage.markAllNotificationsAsRead()) {
            this.updateNotifications();

            if (typeof Logger !== 'undefined') {
                Logger.log('All notifications marked as read');
            }
        }
    }

    // Delete notification
    static deleteNotification(id) {
        if (Storage.deleteNotification(id)) {
            this.updateNotifications();

            if (typeof Logger !== 'undefined') {
                Logger.log('Notification deleted', id);
            }
        }
    }

    // Clear all notifications
    static clearAllNotifications() {
        if (Storage.clearAllNotifications()) {
            this.updateNotifications();

            if (typeof Logger !== 'undefined') {
                Logger.log('All notifications cleared');
            }
        }
    }

    // Navigate to related item
    static navigateToRelatedItem(notification) {
        if (!notification.relatedId) return;

        // Check if it's a task
        const task = Storage.getTask(notification.relatedId);
        if (task) {
            const project = Storage.getProject(task.projectId);
            if (project) {
                UI.showProjectDetails(project.id);

                if (typeof Logger !== 'undefined') {
                    Logger.log('Navigated to task', task.id);
                }
            }
            return;
        }

        // Check if it's a project
        const project = Storage.getProject(notification.relatedId);
        if (project) {
            UI.showProjectDetails(project.id);

            if (typeof Logger !== 'undefined') {
                Logger.log('Navigated to project', project.id);
            }
            return;
        }
    }

    // Setup notification checker
    static setupNotificationChecker() {
        // Check for deadlines every minute
        setInterval(() => {
            Storage.checkDeadlines();
            this.updateNotifications();

            if (typeof Logger !== 'undefined') {
                Logger.log('Checked for deadlines');
            }
        }, 60000); // 60 seconds

        // Initial check
        Storage.checkDeadlines();
    }

    // Create notification for task assignment
    static createTaskAssignmentNotification(task) {
        const notification = Storage.createTaskAssignmentNotification(task);
        if (notification) {
            Storage.addNotification(notification);
            this.updateNotifications();

            if (typeof Logger !== 'undefined') {
                Logger.log('Task assignment notification created', task.id);
            }
        }
    }
}
