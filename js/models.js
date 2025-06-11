/**
 * Models for the Project Management System
 */

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Project class
class Project {
    constructor(name, description = '', status = 'not-started', deadline = null) {
        this.id = generateId();
        this.name = name;
        this.description = description;
        this.status = status;
        this.deadline = deadline;
        this.createdAt = new Date().toISOString();
    }

    // Update project details
    update(data) {
        this.name = data.name || this.name;
        this.description = data.description !== undefined ? data.description : this.description;
        this.status = data.status || this.status;
        this.deadline = data.deadline !== undefined ? data.deadline : this.deadline;
    }

    // Get formatted creation date
    getFormattedCreatedDate() {
        return formatDate(this.createdAt);
    }

    // Get formatted deadline
    getFormattedDeadline() {
        return formatDate(this.deadline);
    }
}

// Task class
class Task {
    constructor(name, projectId, description = '', status = 'not-started', priority = 'medium', deadline = null, assignedTo = null) {
        this.id = generateId();
        this.name = name;
        this.projectId = projectId;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.deadline = deadline;
        this.assignedTo = assignedTo;
        this.createdAt = new Date().toISOString();
    }

    // Update task details
    update(data) {
        this.name = data.name || this.name;
        this.description = data.description !== undefined ? data.description : this.description;
        this.status = data.status || this.status;
        this.priority = data.priority || this.priority;
        this.deadline = data.deadline !== undefined ? data.deadline : this.deadline;
        this.assignedTo = data.assignedTo !== undefined ? data.assignedTo : this.assignedTo;
    }

    // Get formatted creation date
    getFormattedCreatedDate() {
        return formatDate(this.createdAt);
    }

    // Get formatted deadline
    getFormattedDeadline() {
        return formatDate(this.deadline);
    }
}

// User class
class User {
    constructor(name, email, role = 'user') {
        this.id = generateId();
        this.name = name;
        this.email = email;
        this.role = role; // 'admin' or 'user'
        this.createdAt = new Date().toISOString();
    }

    // Update user details
    update(data) {
        this.name = data.name || this.name;
        this.email = data.email || this.email;
        this.role = data.role || this.role;
    }

    // Check if user is admin
    isAdmin() {
        return this.role === 'admin';
    }
}

// Notification class
class Notification {
    constructor(title, message, type, relatedId = null, userId = null) {
        this.id = generateId();
        this.title = title;
        this.message = message;
        this.type = type; // 'info', 'warning', 'success', 'danger'
        this.relatedId = relatedId; // ID of related project or task
        this.userId = userId; // ID of user this notification is for (null = all users)
        this.createdAt = new Date().toISOString();
        this.read = false;
    }

    // Mark notification as read
    markAsRead() {
        this.read = true;
    }

    // Get formatted creation date
    getFormattedDate() {
        const date = new Date(this.createdAt);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) {
            return 'Just now';
        } else if (diffMin < 60) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        } else if (diffDay < 7) {
            return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Get icon class based on notification type
    getIconClass() {
        switch (this.type) {
            case 'info':
                return 'fa-info-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'success':
                return 'fa-check-circle';
            case 'danger':
                return 'fa-exclamation-circle';
            case 'deadline':
                return 'fa-calendar-alt';
            case 'task':
                return 'fa-tasks';
            case 'project':
                return 'fa-project-diagram';
            case 'user':
                return 'fa-user';
            case 'comment':
                return 'fa-comment';
            default:
                return 'fa-bell';
        }
    }
}

// Comment class
class Comment {
    constructor(content, entityType, entityId, userId, parentId = null) {
        this.id = generateId();
        this.content = content;
        this.entityType = entityType; // 'project' or 'task'
        this.entityId = entityId; // ID of the project or task
        this.userId = userId; // ID of the user who created the comment
        this.parentId = parentId; // ID of parent comment (for replies), null for top-level comments
        this.createdAt = new Date().toISOString();
        this.updatedAt = this.createdAt;
        this.mentions = this.extractMentions(content);
        this.isEdited = false;
    }

    // Update comment content
    update(content) {
        this.content = content;
        this.updatedAt = new Date().toISOString();
        this.mentions = this.extractMentions(content);
        this.isEdited = true;
    }

    // Extract @mentions from content
    extractMentions(content) {
        const mentions = [];
        const mentionRegex = /@(\w+)/g;
        let match;

        while ((match = mentionRegex.exec(content)) !== null) {
            mentions.push(match[1]);
        }

        return mentions;
    }

    // Get formatted creation date
    getFormattedDate() {
        const date = new Date(this.createdAt);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) {
            return 'Just now';
        } else if (diffMin < 60) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        } else if (diffDay < 7) {
            return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Format content with Markdown and @mentions
    getFormattedContent() {
        // Replace Markdown syntax with HTML
        let formattedContent = this.content
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Lists
            .replace(/^\s*\n\* (.*)/gm, '<ul>\n<li>$1</li>')
            .replace(/^\* (.*)/gm, '<li>$1</li>')
            .replace(/^\s*\n- (.*)/gm, '<ul>\n<li>$1</li>')
            .replace(/^- (.*)/gm, '<li>$1</li>')
            .replace(/^\s*\n\d+\. (.*)/gm, '<ol>\n<li>$1</li>')
            .replace(/^\d+\. (.*)/gm, '<li>$1</li>')
            // Line breaks
            .replace(/\n/g, '<br>');

        // Replace @mentions with styled spans
        formattedContent = formattedContent.replace(/@(\w+)/g, '<span class="mention">@$1</span>');

        return formattedContent;
    }
}
