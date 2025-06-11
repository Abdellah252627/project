/**
 * Comments functionality for the Project Management System
 * Handles comment display, creation, editing, and deletion
 */
class Comments {
    // DOM elements
    static projectCommentsContainer;
    static projectCommentInput;
    static addProjectCommentBtn;
    static showMarkdownGuideBtn;
    static markdownGuide;

    static taskCommentsContainer;
    static taskCommentInput;
    static addTaskCommentBtn;
    static showTaskMarkdownGuideBtn;
    static taskMarkdownGuide;

    // Current entity being viewed
    static currentEntityType = null;
    static currentEntityId = null;

    // Mentions dropdown
    static mentionsDropdown = null;
    static mentionsList = [];
    static currentMentionInput = null;
    static mentionStartPosition = -1;
    static selectedMentionIndex = -1;

    // Initialize comments system
    static init() {
        // Initialize DOM elements
        this.projectCommentsContainer = document.getElementById('project-comments-container');
        this.projectCommentInput = document.getElementById('project-comment-input');
        this.addProjectCommentBtn = document.getElementById('add-project-comment-btn');
        this.showMarkdownGuideBtn = document.getElementById('show-markdown-guide-btn');
        this.markdownGuide = document.getElementById('markdown-guide');

        this.taskCommentsContainer = document.getElementById('task-comments-container');
        this.taskCommentInput = document.getElementById('task-comment-input');
        this.addTaskCommentBtn = document.getElementById('add-task-comment-btn');
        this.showTaskMarkdownGuideBtn = document.getElementById('show-task-markdown-guide-btn');
        this.taskMarkdownGuide = document.getElementById('task-markdown-guide');

        // Set up event listeners
        this.setupEventListeners();

        // Create mentions dropdown
        this.createMentionsDropdown();

        if (typeof Logger !== 'undefined') {
            Logger.log('Comments system initialized');
        }
    }

    // Set up event listeners
    static setupEventListeners() {
        // Project comments
        if (this.addProjectCommentBtn) {
            this.addProjectCommentBtn.addEventListener('click', () => {
                this.addComment('project');
            });
        }

        if (this.showMarkdownGuideBtn && this.markdownGuide) {
            this.showMarkdownGuideBtn.addEventListener('click', () => {
                this.markdownGuide.classList.toggle('hidden');
            });
        }

        if (this.projectCommentInput) {
            this.projectCommentInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.addComment('project');
                }
            });

            // Handle @mentions
            this.projectCommentInput.addEventListener('input', (e) => {
                this.handleMentionInput(e, this.projectCommentInput);
            });

            this.projectCommentInput.addEventListener('keydown', (e) => {
                this.handleMentionKeydown(e, this.projectCommentInput);
            });
        }

        // Task comments
        if (this.addTaskCommentBtn) {
            this.addTaskCommentBtn.addEventListener('click', () => {
                this.addComment('task');
            });
        }

        if (this.showTaskMarkdownGuideBtn && this.taskMarkdownGuide) {
            this.showTaskMarkdownGuideBtn.addEventListener('click', () => {
                this.taskMarkdownGuide.classList.toggle('hidden');
            });
        }

        if (this.taskCommentInput) {
            this.taskCommentInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.addComment('task');
                }
            });

            // Handle @mentions
            this.taskCommentInput.addEventListener('input', (e) => {
                this.handleMentionInput(e, this.taskCommentInput);
            });

            this.taskCommentInput.addEventListener('keydown', (e) => {
                this.handleMentionKeydown(e, this.taskCommentInput);
            });
        }

        // Close mentions dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mentionsDropdown &&
                !this.mentionsDropdown.contains(e.target) &&
                e.target !== this.projectCommentInput &&
                e.target !== this.taskCommentInput) {
                this.hideMentionsDropdown();
            }
        });
    }

    // Set current entity
    static setCurrentEntity(type, id) {
        this.currentEntityType = type;
        this.currentEntityId = id;

        // Load comments for the entity
        this.loadComments();
    }

    // Load comments for the current entity
    static loadComments() {
        if (!this.currentEntityType || !this.currentEntityId) return;

        const comments = Storage.getEntityComments(this.currentEntityType, this.currentEntityId);
        const container = this.currentEntityType === 'project' ?
            this.projectCommentsContainer : this.taskCommentsContainer;

        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // If no comments, show empty state
        if (comments.length === 0) {
            container.innerHTML = `
                <div class="empty-comments">
                    <p>${Language.translate('no_comments')}</p>
                </div>
            `;
            return;
        }

        // Group comments by parent (for replies)
        const topLevelComments = comments.filter(comment => !comment.parentId);

        // Sort comments by creation date (newest first)
        topLevelComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Add comments to container
        topLevelComments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            container.appendChild(commentElement);
        });
    }

    // Create comment element
    static createCommentElement(comment, isReply = false) {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment-item');
        if (isReply) commentElement.classList.add('reply-item');

        const user = Storage.getUser(comment.userId);
        const currentUser = Storage.getCurrentUser();
        const isCurrentUserComment = currentUser && comment.userId === currentUser.id;

        // Get user initials for avatar
        let userInitials = '?';
        if (user) {
            userInitials = user.name.split(' ')
                .map(part => part.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2);
        }

        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">
                    <div class="comment-author-avatar">${userInitials}</div>
                    <div class="comment-author-name">${user ? user.name : 'Unknown User'}</div>
                </div>
                <div class="comment-meta">
                    <span class="comment-date">${comment.getFormattedDate()}</span>
                    ${comment.isEdited ? `<span class="comment-edited">(${Language.translate('edited')})</span>` : ''}
                </div>
            </div>
            <div class="comment-content">${comment.getFormattedContent()}</div>
            <div class="comment-actions">
                <button class="comment-action-btn reply-btn" data-id="${comment.id}">
                    <i class="fas fa-reply"></i> ${Language.translate('reply')}
                </button>
                ${isCurrentUserComment ? `
                <button class="comment-action-btn edit-btn" data-id="${comment.id}">
                    <i class="fas fa-edit"></i> ${Language.translate('edit_comment')}
                </button>
                <button class="comment-action-btn delete-btn" data-id="${comment.id}">
                    <i class="fas fa-trash"></i> ${Language.translate('delete_comment')}
                </button>
                ` : ''}
            </div>
            <div class="comment-replies" id="replies-${comment.id}"></div>
            <div class="reply-form-container" id="reply-form-${comment.id}" style="display: none;">
                <div class="reply-form">
                    <textarea class="reply-input" placeholder="${Language.translate('reply_placeholder')}"></textarea>
                    <div class="comment-form-actions">
                        <button class="btn btn-small cancel-reply-btn" data-id="${comment.id}">
                            ${Language.translate('cancel')}
                        </button>
                        <button class="btn btn-primary submit-reply-btn" data-id="${comment.id}">
                            ${Language.translate('reply')}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        const replyBtn = commentElement.querySelector('.reply-btn');
        if (replyBtn) {
            replyBtn.addEventListener('click', () => {
                this.showReplyForm(comment.id);
            });
        }

        const editBtn = commentElement.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.editComment(comment);
            });
        }

        const deleteBtn = commentElement.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteComment(comment.id);
            });
        }

        const cancelReplyBtn = commentElement.querySelector('.cancel-reply-btn');
        if (cancelReplyBtn) {
            cancelReplyBtn.addEventListener('click', () => {
                this.hideReplyForm(comment.id);
            });
        }

        const submitReplyBtn = commentElement.querySelector('.submit-reply-btn');
        if (submitReplyBtn) {
            submitReplyBtn.addEventListener('click', () => {
                this.submitReply(comment.id);
            });
        }

        // Load replies
        const replies = Storage.getCommentReplies(comment.id);
        if (replies.length > 0) {
            const repliesContainer = commentElement.querySelector(`#replies-${comment.id}`);

            // Sort replies by creation date (oldest first for replies)
            replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            replies.forEach(reply => {
                const replyElement = this.createCommentElement(reply, true);
                repliesContainer.appendChild(replyElement);
            });
        }

        return commentElement;
    }

    // Add a new comment
    static addComment(type) {
        if (!this.currentEntityId) return;

        const input = type === 'project' ? this.projectCommentInput : this.taskCommentInput;
        if (!input || !input.value.trim()) return;

        const currentUser = Storage.getCurrentUser();
        if (!currentUser) {
            alert('You must be logged in to add comments');
            return;
        }

        const comment = new Comment(
            input.value.trim(),
            this.currentEntityType,
            this.currentEntityId,
            currentUser.id
        );

        Storage.addComment(comment);

        // Create notification for entity owner
        const notification = Storage.createCommentNotification(comment);
        if (notification) {
            Storage.addNotification(notification);
        }

        // Clear input
        input.value = '';

        // Reload comments
        this.loadComments();

        if (typeof Logger !== 'undefined') {
            Logger.log(`Comment added to ${this.currentEntityType} ${this.currentEntityId}`);
        }
    }

    // Show reply form
    static showReplyForm(commentId) {
        const replyForm = document.getElementById(`reply-form-${commentId}`);
        if (replyForm) {
            replyForm.style.display = 'block';

            // Focus on textarea
            const textarea = replyForm.querySelector('.reply-input');
            if (textarea) {
                textarea.focus();

                // Add mention handling
                textarea.addEventListener('input', (e) => {
                    this.handleMentionInput(e, textarea);
                });

                textarea.addEventListener('keydown', (e) => {
                    this.handleMentionKeydown(e, textarea);

                    // Submit on Ctrl+Enter
                    if (e.key === 'Enter' && e.ctrlKey) {
                        this.submitReply(commentId);
                    }
                });
            }
        }
    }

    // Hide reply form
    static hideReplyForm(commentId) {
        const replyForm = document.getElementById(`reply-form-${commentId}`);
        if (replyForm) {
            replyForm.style.display = 'none';

            // Clear textarea
            const textarea = replyForm.querySelector('.reply-input');
            if (textarea) {
                textarea.value = '';
            }
        }
    }

    // Submit reply
    static submitReply(parentId) {
        const replyForm = document.getElementById(`reply-form-${parentId}`);
        if (!replyForm) return;

        const textarea = replyForm.querySelector('.reply-input');
        if (!textarea || !textarea.value.trim()) return;

        const currentUser = Storage.getCurrentUser();
        if (!currentUser) {
            alert('You must be logged in to reply to comments');
            return;
        }

        const parentComment = Storage.getComment(parentId);
        if (!parentComment) return;

        const reply = new Comment(
            textarea.value.trim(),
            this.currentEntityType,
            this.currentEntityId,
            currentUser.id,
            parentId
        );

        Storage.addComment(reply);

        // Create notification for parent comment author
        if (parentComment.userId !== currentUser.id) {
            const parentAuthor = Storage.getUser(parentComment.userId);
            if (parentAuthor) {
                const title = `New reply to your comment`;
                const message = `${currentUser.name} replied to your comment`;

                const notification = new Notification(
                    title,
                    message,
                    'comment',
                    reply.id,
                    parentComment.userId
                );

                Storage.addNotification(notification);
            }
        }

        // Hide reply form
        this.hideReplyForm(parentId);

        // Reload comments
        this.loadComments();

        if (typeof Logger !== 'undefined') {
            Logger.log(`Reply added to comment ${parentId}`);
        }
    }

    // Edit comment
    static editComment(comment) {
        const commentElement = document.querySelector(`.comment-item .edit-btn[data-id="${comment.id}"]`).closest('.comment-item');
        if (!commentElement) return;

        const contentElement = commentElement.querySelector('.comment-content');
        if (!contentElement) return;

        // Save original content
        const originalContent = comment.content;

        // Replace content with textarea
        contentElement.innerHTML = `
            <textarea class="edit-comment-textarea">${originalContent}</textarea>
            <div class="comment-form-actions">
                <button class="btn btn-small cancel-edit-btn">
                    ${Language.translate('cancel')}
                </button>
                <button class="btn btn-primary save-edit-btn">
                    ${Language.translate('save_comment')}
                </button>
            </div>
        `;

        // Focus on textarea
        const textarea = contentElement.querySelector('.edit-comment-textarea');
        if (textarea) {
            textarea.focus();

            // Add mention handling
            textarea.addEventListener('input', (e) => {
                this.handleMentionInput(e, textarea);
            });

            textarea.addEventListener('keydown', (e) => {
                this.handleMentionKeydown(e, textarea);

                // Submit on Ctrl+Enter
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.saveEditedComment(comment.id, textarea.value);
                }

                // Cancel on Escape
                if (e.key === 'Escape') {
                    this.cancelEditComment(comment);
                }
            });
        }

        // Add event listeners
        const cancelBtn = contentElement.querySelector('.cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelEditComment(comment);
            });
        }

        const saveBtn = contentElement.querySelector('.save-edit-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                if (textarea) {
                    this.saveEditedComment(comment.id, textarea.value);
                }
            });
        }
    }

    // Cancel edit comment
    static cancelEditComment(comment) {
        const commentElement = document.querySelector(`.comment-item .edit-btn[data-id="${comment.id}"]`).closest('.comment-item');
        if (!commentElement) return;

        const contentElement = commentElement.querySelector('.comment-content');
        if (!contentElement) return;

        // Restore original content
        contentElement.innerHTML = comment.getFormattedContent();
    }

    // Save edited comment
    static saveEditedComment(commentId, newContent) {
        if (!newContent.trim()) return;

        const comment = Storage.getComment(commentId);
        if (!comment) return;

        // Update comment
        comment.update(newContent.trim());
        Storage.updateComment(comment);

        // Reload comments
        this.loadComments();

        if (typeof Logger !== 'undefined') {
            Logger.log(`Comment ${commentId} edited`);
        }
    }

    // Delete comment
    static deleteComment(commentId) {
        if (!confirm(Language.translate('confirm_delete_comment'))) return;

        if (Storage.deleteComment(commentId)) {
            // Reload comments
            this.loadComments();

            if (typeof Logger !== 'undefined') {
                Logger.log(`Comment ${commentId} deleted`);
            }
        }
    }

    // Create mentions dropdown
    static createMentionsDropdown() {
        if (this.mentionsDropdown) return;

        this.mentionsDropdown = document.createElement('div');
        this.mentionsDropdown.classList.add('mentions-dropdown');
        this.mentionsDropdown.style.display = 'none';
        document.body.appendChild(this.mentionsDropdown);
    }

    // Handle mention input
    static handleMentionInput(e, inputElement) {
        const text = inputElement.value;
        const cursorPosition = inputElement.selectionStart;

        // Find @ symbol before cursor
        let startPos = cursorPosition - 1;
        while (startPos >= 0 && text[startPos] !== '@' && text[startPos] !== ' ' && text[startPos] !== '\n') {
            startPos--;
        }

        if (startPos >= 0 && text[startPos] === '@') {
            const query = text.substring(startPos + 1, cursorPosition).toLowerCase();
            this.showMentionsDropdown(query, inputElement, startPos);
        } else {
            this.hideMentionsDropdown();
        }
    }

    // Handle mention keydown
    static handleMentionKeydown(e, inputElement) {
        if (!this.mentionsDropdown || this.mentionsDropdown.style.display === 'none') return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectNextMention();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectPreviousMention();
                break;
            case 'Enter':
            case 'Tab':
                if (!e.ctrlKey) {
                    e.preventDefault();
                    this.insertSelectedMention(inputElement);
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.hideMentionsDropdown();
                break;
        }
    }

    // Show mentions dropdown
    static showMentionsDropdown(query, inputElement, startPosition) {
        const users = Storage.getUsers();

        // Filter users by query
        this.mentionsList = users.filter(user =>
            user.name.toLowerCase().includes(query)
        );

        if (this.mentionsList.length === 0) {
            this.hideMentionsDropdown();
            return;
        }

        // Update dropdown position
        const inputRect = inputElement.getBoundingClientRect();
        const lineHeight = parseInt(window.getComputedStyle(inputElement).lineHeight);
        const lines = inputElement.value.substr(0, startPosition).split('\n');
        const lineCount = lines.length;

        this.mentionsDropdown.style.top = `${inputRect.top + lineCount * lineHeight}px`;
        this.mentionsDropdown.style.left = `${inputRect.left + 20}px`;

        // Update dropdown content
        this.mentionsDropdown.innerHTML = '';
        this.mentionsList.forEach((user, index) => {
            const item = document.createElement('div');
            item.classList.add('mention-item');
            if (index === 0) item.classList.add('active');
            item.textContent = user.name;

            item.addEventListener('click', () => {
                this.selectedMentionIndex = index;
                this.insertSelectedMention(inputElement);
            });

            this.mentionsDropdown.appendChild(item);
        });

        // Show dropdown
        this.mentionsDropdown.style.display = 'block';
        this.currentMentionInput = inputElement;
        this.mentionStartPosition = startPosition;
        this.selectedMentionIndex = 0;
    }

    // Hide mentions dropdown
    static hideMentionsDropdown() {
        if (this.mentionsDropdown) {
            this.mentionsDropdown.style.display = 'none';
            this.currentMentionInput = null;
            this.mentionStartPosition = -1;
            this.selectedMentionIndex = -1;
        }
    }

    // Select next mention
    static selectNextMention() {
        if (this.selectedMentionIndex < this.mentionsList.length - 1) {
            this.selectedMentionIndex++;
            this.updateSelectedMention();
        }
    }

    // Select previous mention
    static selectPreviousMention() {
        if (this.selectedMentionIndex > 0) {
            this.selectedMentionIndex--;
            this.updateSelectedMention();
        }
    }

    // Update selected mention
    static updateSelectedMention() {
        const items = this.mentionsDropdown.querySelectorAll('.mention-item');
        items.forEach((item, index) => {
            if (index === this.selectedMentionIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Insert selected mention
    static insertSelectedMention(inputElement) {
        if (this.selectedMentionIndex === -1 || !this.mentionsList[this.selectedMentionIndex]) {
            this.hideMentionsDropdown();
            return;
        }

        const selectedUser = this.mentionsList[this.selectedMentionIndex];
        const text = inputElement.value;
        const beforeMention = text.substring(0, this.mentionStartPosition);
        const afterMention = text.substring(inputElement.selectionStart);

        // Insert mention
        inputElement.value = `${beforeMention}@${selectedUser.name} ${afterMention}`;

        // Set cursor position after mention
        const newPosition = this.mentionStartPosition + selectedUser.name.length + 2; // +2 for @ and space
        inputElement.setSelectionRange(newPosition, newPosition);

        // Hide dropdown
        this.hideMentionsDropdown();

        // Focus on input
        inputElement.focus();
    }

    // Update translations
    static updateTranslations() {
        try {
            // Update comments title
            const projectCommentsTitle = document.getElementById('comments-title');
            if (projectCommentsTitle) {
                projectCommentsTitle.textContent = Language.translate('comments');
            }

            const taskCommentsTitle = document.getElementById('task-comments-title');
            if (taskCommentsTitle) {
                taskCommentsTitle.textContent = Language.translate('comments');
            }

            // Update placeholders
            if (this.projectCommentInput) {
                this.projectCommentInput.placeholder = Language.translate('comment_placeholder');
            }

            if (this.taskCommentInput) {
                this.taskCommentInput.placeholder = Language.translate('comment_placeholder');
            }

            // Update buttons
            if (this.addProjectCommentBtn) {
                this.addProjectCommentBtn.innerHTML = `<i class="fas fa-comment"></i> ${Language.translate('add_comment')}`;
            }

            if (this.addTaskCommentBtn) {
                this.addTaskCommentBtn.innerHTML = `<i class="fas fa-comment"></i> ${Language.translate('add_comment')}`;
            }

            // Reload comments to update all text
            this.loadComments();

            if (typeof Logger !== 'undefined') {
                Logger.log('Comments: Translations updated');
            }
        } catch (error) {
            console.error('Comments: Error updating translations', error);
            if (typeof Logger !== 'undefined') {
                Logger.error('Comments: Error updating translations', error);
            }
        }
    }
}
