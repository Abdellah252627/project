/**
 * Storage handling for the Project Management System
 */

class Storage {
    // Storage keys
    static PROJECTS_KEY = 'pms_projects';
    static TASKS_KEY = 'pms_tasks';
    static USERS_KEY = 'pms_users';
    static CURRENT_USER_KEY = 'pms_current_user';
    static NOTIFICATIONS_KEY = 'pms_notifications';
    static COMMENTS_KEY = 'pms_comments';

    // Get all projects from localStorage
    static getProjects() {
        const projectsJson = localStorage.getItem(this.PROJECTS_KEY);
        return projectsJson ? JSON.parse(projectsJson) : [];
    }

    // Save projects to localStorage
    static saveProjects(projects) {
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    }

    // Get a single project by ID
    static getProject(id) {
        const projects = this.getProjects();
        return projects.find(project => project.id === id);
    }

    // Add a new project
    static addProject(project) {
        const projects = this.getProjects();
        projects.push(project);
        this.saveProjects(projects);
    }

    // Update an existing project
    static updateProject(updatedProject) {
        const projects = this.getProjects();
        const index = projects.findIndex(project => project.id === updatedProject.id);

        if (index !== -1) {
            projects[index] = updatedProject;
            this.saveProjects(projects);
            return true;
        }

        return false;
    }

    // Delete a project
    static deleteProject(id) {
        const projects = this.getProjects();
        const filteredProjects = projects.filter(project => project.id !== id);

        if (projects.length !== filteredProjects.length) {
            this.saveProjects(filteredProjects);

            // Also delete all tasks associated with this project
            const tasks = this.getTasks();
            const filteredTasks = tasks.filter(task => task.projectId !== id);
            this.saveTasks(filteredTasks);

            return true;
        }

        return false;
    }

    // Get all tasks from localStorage
    static getTasks() {
        const tasksJson = localStorage.getItem(this.TASKS_KEY);
        return tasksJson ? JSON.parse(tasksJson) : [];
    }

    // Save tasks to localStorage
    static saveTasks(tasks) {
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }

    // Get tasks for a specific project
    static getProjectTasks(projectId) {
        const tasks = this.getTasks();
        return tasks.filter(task => task.projectId === projectId);
    }

    // Get a single task by ID
    static getTask(id) {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === id);
    }

    // Add a new task
    static addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
    }

    // Update an existing task
    static updateTask(updatedTask) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === updatedTask.id);

        if (index !== -1) {
            tasks[index] = updatedTask;
            this.saveTasks(tasks);
            return true;
        }

        return false;
    }

    // Delete a task
    static deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);

        if (tasks.length !== filteredTasks.length) {
            this.saveTasks(filteredTasks);
            return true;
        }

        return false;
    }

    // Get all users from localStorage
    static getUsers() {
        const usersJson = localStorage.getItem(this.USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    }

    // Save users to localStorage
    static saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    // Get a single user by ID
    static getUser(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    // Add a new user
    static addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
    }

    // Update an existing user
    static updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === updatedUser.id);

        if (index !== -1) {
            users[index] = updatedUser;
            this.saveUsers(users);
            return true;
        }

        return false;
    }

    // Delete a user
    static deleteUser(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);

        if (users.length !== filteredUsers.length) {
            this.saveUsers(filteredUsers);

            // Update tasks assigned to this user
            const tasks = this.getTasks();
            const updatedTasks = tasks.map(task => {
                if (task.assignedTo === id) {
                    task.assignedTo = null;
                }
                return task;
            });

            this.saveTasks(updatedTasks);

            return true;
        }

        return false;
    }

    // Get current user
    static getCurrentUser() {
        const currentUserId = localStorage.getItem(this.CURRENT_USER_KEY);
        if (!currentUserId) return null;

        return this.getUser(currentUserId);
    }

    // Set current user
    static setCurrentUser(userId) {
        localStorage.setItem(this.CURRENT_USER_KEY, userId);
    }

    // Ensure admin user exists
    static ensureAdminUser() {
        const users = this.getUsers();

        // Check if admin user already exists
        const adminUser = users.find(user => user.role === 'admin');

        if (!adminUser) {
            // Create admin user
            const newAdminUser = new User('Admin', 'admin@example.com', 'admin');
            this.addUser(newAdminUser);

            // Set as current user if no current user
            if (!this.getCurrentUser()) {
                this.setCurrentUser(newAdminUser.id);
            }

            return newAdminUser;
        }

        return adminUser;
    }

    // Get all notifications from localStorage
    static getNotifications() {
        const notificationsJson = localStorage.getItem(this.NOTIFICATIONS_KEY);
        return notificationsJson ? JSON.parse(notificationsJson) : [];
    }

    // Save notifications to localStorage
    static saveNotifications(notifications) {
        localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }

    // Get notifications for current user
    static getCurrentUserNotifications() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];

        const notifications = this.getNotifications();
        return notifications.filter(notification =>
            notification.userId === null || notification.userId === currentUser.id
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Get unread notifications count
    static getUnreadNotificationsCount() {
        const notifications = this.getCurrentUserNotifications();
        return notifications.filter(notification => !notification.read).length;
    }

    // Add a new notification
    static addNotification(notification) {
        const notifications = this.getNotifications();
        notifications.push(notification);
        this.saveNotifications(notifications);

        // Return the new notification for potential UI updates
        return notification;
    }

    // Mark notification as read
    static markNotificationAsRead(id) {
        const notifications = this.getNotifications();
        const notification = notifications.find(n => n.id === id);

        if (notification) {
            notification.read = true;
            this.saveNotifications(notifications);
            return true;
        }

        return false;
    }

    // Mark all notifications as read
    static markAllNotificationsAsRead() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        const notifications = this.getNotifications();
        let updated = false;

        notifications.forEach(notification => {
            if ((notification.userId === null || notification.userId === currentUser.id) && !notification.read) {
                notification.read = true;
                updated = true;
            }
        });

        if (updated) {
            this.saveNotifications(notifications);
        }

        return updated;
    }

    // Delete a notification
    static deleteNotification(id) {
        const notifications = this.getNotifications();
        const filteredNotifications = notifications.filter(notification => notification.id !== id);

        if (notifications.length !== filteredNotifications.length) {
            this.saveNotifications(filteredNotifications);
            return true;
        }

        return false;
    }

    // Clear all notifications for current user
    static clearAllNotifications() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        const notifications = this.getNotifications();
        const remainingNotifications = notifications.filter(notification =>
            notification.userId !== null && notification.userId !== currentUser.id
        );

        this.saveNotifications(remainingNotifications);
        return true;
    }

    // Create deadline notification
    static createDeadlineNotification(task) {
        const project = this.getProject(task.projectId);
        if (!project) return null;

        const title = `Upcoming Deadline: ${task.name}`;
        const message = `Task "${task.name}" in project "${project.name}" is due soon.`;

        return new Notification(
            title,
            message,
            'deadline',
            task.id,
            task.assignedTo
        );
    }

    // Create task assignment notification
    static createTaskAssignmentNotification(task, assignedBy) {
        const project = this.getProject(task.projectId);
        if (!project || !task.assignedTo) return null;

        const title = `New Task Assigned`;
        const message = `You have been assigned to task "${task.name}" in project "${project.name}".`;

        return new Notification(
            title,
            message,
            'task',
            task.id,
            task.assignedTo
        );
    }

    // Check for upcoming deadlines and create notifications
    static checkDeadlines() {
        const tasks = this.getTasks();
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

        tasks.forEach(task => {
            if (task.status !== 'completed' && task.deadline) {
                const deadlineDate = new Date(task.deadline);

                // Check if deadline is within the next 2 days
                if (deadlineDate > now && deadlineDate <= twoDaysFromNow) {
                    // Check if notification already exists
                    const notifications = this.getNotifications();
                    const existingNotification = notifications.find(n =>
                        n.type === 'deadline' &&
                        n.relatedId === task.id &&
                        new Date(n.createdAt) > new Date(now - 24 * 60 * 60 * 1000) // Created in the last 24 hours
                    );

                    if (!existingNotification) {
                        const notification = this.createDeadlineNotification(task);
                        if (notification) {
                            this.addNotification(notification);
                        }
                    }
                }
            }
        });
    }

    // Comments management

    // Get all comments from localStorage
    static getComments() {
        const commentsJson = localStorage.getItem(this.COMMENTS_KEY);
        return commentsJson ? JSON.parse(commentsJson) : [];
    }

    // Save comments to localStorage
    static saveComments(comments) {
        localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(comments));
    }

    // Get comments for a specific entity (project or task)
    static getEntityComments(entityType, entityId) {
        const comments = this.getComments();
        return comments.filter(comment =>
            comment.entityType === entityType &&
            comment.entityId === entityId
        );
    }

    // Get a single comment by ID
    static getComment(id) {
        const comments = this.getComments();
        return comments.find(comment => comment.id === id);
    }

    // Add a new comment
    static addComment(comment) {
        const comments = this.getComments();
        comments.push(comment);
        this.saveComments(comments);

        // Process mentions and create notifications
        this.processMentions(comment);

        return comment;
    }

    // Update an existing comment
    static updateComment(updatedComment) {
        const comments = this.getComments();
        const index = comments.findIndex(comment => comment.id === updatedComment.id);

        if (index !== -1) {
            // Store old mentions to compare with new ones
            const oldMentions = [...comments[index].mentions];

            // Update the comment
            comments[index] = updatedComment;
            this.saveComments(comments);

            // Process new mentions that weren't in the old comment
            const newMentions = updatedComment.mentions.filter(mention => !oldMentions.includes(mention));
            if (newMentions.length > 0) {
                this.processMentions(updatedComment, newMentions);
            }

            return true;
        }

        return false;
    }

    // Delete a comment
    static deleteComment(id) {
        const comments = this.getComments();
        const filteredComments = comments.filter(comment => comment.id !== id);

        // Also delete all replies to this comment
        const filteredReplies = filteredComments.filter(comment => comment.parentId !== id);

        if (comments.length !== filteredComments.length || filteredComments.length !== filteredReplies.length) {
            this.saveComments(filteredReplies);
            return true;
        }

        return false;
    }

    // Get replies for a comment
    static getCommentReplies(commentId) {
        const comments = this.getComments();
        return comments.filter(comment => comment.parentId === commentId);
    }

    // Process @mentions in a comment and create notifications
    static processMentions(comment, mentionsToProcess = null) {
        const mentions = mentionsToProcess || comment.mentions;
        if (!mentions || mentions.length === 0) return;

        const users = this.getUsers();
        const currentUser = this.getCurrentUser();

        // Get entity details for the notification message
        let entityName = '';
        let entityType = '';

        if (comment.entityType === 'project') {
            const project = this.getProject(comment.entityId);
            if (project) {
                entityName = project.name;
                entityType = 'project';
            }
        } else if (comment.entityType === 'task') {
            const task = this.getTask(comment.entityId);
            if (task) {
                entityName = task.name;
                entityType = 'task';

                // Also get project name
                const project = this.getProject(task.projectId);
                if (project) {
                    entityName += ` in project "${project.name}"`;
                }
            }
        }

        if (!entityName) return;

        // Get comment author name
        let authorName = 'Someone';
        if (comment.userId && currentUser && comment.userId === currentUser.id) {
            authorName = 'You';
        } else if (comment.userId) {
            const author = this.getUser(comment.userId);
            if (author) {
                authorName = author.name;
            }
        }

        // Create notifications for mentioned users
        mentions.forEach(mention => {
            // Find user by name (case insensitive)
            const mentionedUser = users.find(user =>
                user.name.toLowerCase() === mention.toLowerCase() ||
                user.name.toLowerCase().startsWith(mention.toLowerCase())
            );

            if (mentionedUser && mentionedUser.id !== comment.userId) {
                const title = `You were mentioned in a comment`;
                const message = `${authorName} mentioned you in a comment on ${entityType} "${entityName}"`;

                const notification = new Notification(
                    title,
                    message,
                    'comment',
                    comment.id,
                    mentionedUser.id
                );

                this.addNotification(notification);
            }
        });
    }

    // Create comment notification for entity owner
    static createCommentNotification(comment) {
        // Don't notify if the comment author is the entity owner
        let entityOwnerId = null;
        let entityName = '';
        let entityType = '';

        if (comment.entityType === 'project') {
            const project = this.getProject(comment.entityId);
            if (project) {
                // Projects don't have owners in this system, so notify all users
                entityName = project.name;
                entityType = 'project';
            }
        } else if (comment.entityType === 'task') {
            const task = this.getTask(comment.entityId);
            if (task) {
                entityOwnerId = task.assignedTo;
                entityName = task.name;
                entityType = 'task';

                // Also get project name
                const project = this.getProject(task.projectId);
                if (project) {
                    entityName += ` in project "${project.name}"`;
                }
            }
        }

        if (!entityName) return null;

        // Get comment author name
        let authorName = 'Someone';
        const author = this.getUser(comment.userId);
        if (author) {
            authorName = author.name;
        }

        // If entity has an owner and it's not the comment author, create notification
        if (entityOwnerId && entityOwnerId !== comment.userId) {
            const title = `New comment on your ${entityType}`;
            const message = `${authorName} commented on your ${entityType} "${entityName}"`;

            return new Notification(
                title,
                message,
                'comment',
                comment.id,
                entityOwnerId
            );
        }

        return null;
    }

    // Initialize with sample data if empty
    static initializeWithSampleData() {
        const projects = this.getProjects();
        const tasks = this.getTasks();
        const users = this.getUsers();

        if (projects.length === 0 && tasks.length === 0 && users.length === 0) {
            // Add admin user
            const adminUser = new User('Admin', 'admin@example.com', 'admin');
            this.addUser(adminUser);

            // Add sample user
            const sampleUser = new User('John Doe', 'john@example.com', 'user');
            this.addUser(sampleUser);

            // Add sample project
            const sampleProject = new Project(
                'Website Redesign',
                'Redesign the company website with modern UI/UX',
                'in-progress',
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
            );
            this.addProject(sampleProject);

            // Add sample tasks
            const task1 = new Task(
                'Design mockups',
                sampleProject.id,
                'Create mockups for homepage and product pages',
                'completed',
                'high',
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                sampleUser.id
            );

            const task2 = new Task(
                'Implement frontend',
                sampleProject.id,
                'Convert mockups to HTML/CSS/JS',
                'in-progress',
                'medium',
                new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
                sampleUser.id
            );

            const task3 = new Task(
                'Backend integration',
                sampleProject.id,
                'Connect frontend to backend APIs',
                'not-started',
                'medium',
                new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() // 21 days from now
            );

            this.addTask(task1);
            this.addTask(task2);
            this.addTask(task3);

            // Add sample notifications
            const notification1 = new Notification(
                'Welcome to Project Management System',
                'This is a sample notification to help you get started.',
                'info',
                null,
                null
            );

            const notification2 = new Notification(
                'Task Assigned',
                `You have been assigned to task "Design mockups" in project "Website Redesign".`,
                'task',
                task1.id,
                sampleUser.id
            );

            this.addNotification(notification1);
            this.addNotification(notification2);

            // Set admin as current user
            this.setCurrentUser(adminUser.id);

            return true;
        }

        return false;
    }
}
