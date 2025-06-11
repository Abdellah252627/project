/**
 * UI handling for the Project Management System
 */

class UI {
    // DOM elements
    static projectsContainer = document.getElementById('projects-container');
    static projectDetails = document.getElementById('project-details');
    static projectTitle = document.getElementById('project-title');
    static projectStatus = document.getElementById('project-status');
    static projectDeadline = document.getElementById('project-deadline');
    static projectDescription = document.getElementById('project-description');
    static tasksContainer = document.getElementById('tasks-container');
    static languageSelect = document.getElementById('language-select');
    static adminDashboard = document.getElementById('admin-dashboard');
    static adminDashboardBtn = document.getElementById('admin-dashboard-btn');

    // Display all projects
    static displayProjects(projects) {
        this.projectsContainer.innerHTML = '';

        if (projects.length === 0) {
            this.projectsContainer.innerHTML = `
                <div class="empty-state">
                    <p>${Language.translate('no_projects_found')}</p>
                </div>
            `;
            return;
        }

        projects.forEach(project => {
            this.addProjectToList(project);
        });
    }

    // Add a single project to the projects list
    static addProjectToList(project) {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project-card');
        projectElement.dataset.id = project.id;

        // Get tasks for this project to show count
        const tasks = Storage.getProjectTasks(project.id);
        const completedTasks = tasks.filter(task => task.status === 'completed').length;

        projectElement.innerHTML = `
            <div class="project-card-header">
                <h3 class="project-card-title">${project.name}</h3>
                <div class="project-card-actions">
                    <button class="btn btn-small edit-project" data-id="${project.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger delete-project" data-id="${project.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="project-card-info">
                <span class="status status-${project.status}">${this.formatStatus(project.status)}</span>
                <p class="project-card-description">${project.description || Language.translate('no_description')}</p>
            </div>
            <div class="project-card-footer">
                <span>${Language.translate('deadline_label')} ${project.getFormattedDeadline()}</span>
                <span>${Language.translate('tasks_label')} ${completedTasks}/${tasks.length}</span>
            </div>
        `;

        this.projectsContainer.appendChild(projectElement);

        // Add event listener to view project details
        projectElement.addEventListener('click', (e) => {
            // Ignore clicks on buttons
            if (e.target.closest('.edit-project') || e.target.closest('.delete-project')) {
                return;
            }

            this.showProjectDetails(project.id);
        });

        // Add event listeners for edit and delete buttons
        const editBtn = projectElement.querySelector('.edit-project');
        editBtn.addEventListener('click', () => this.showEditProjectModal(project.id));

        const deleteBtn = projectElement.querySelector('.delete-project');
        deleteBtn.addEventListener('click', () => this.confirmDeleteProject(project.id));
    }

    // Show project details
    static showProjectDetails(projectId) {
        const project = Storage.getProject(projectId);
        if (!project) return;

        // Hide projects list and show project details
        document.querySelector('.dashboard').classList.add('hidden');
        this.projectDetails.classList.remove('hidden');

        // Update project details
        this.projectTitle.textContent = project.name;
        this.projectStatus.textContent = this.formatStatus(project.status);
        this.projectStatus.className = `status status-${project.status}`;
        this.projectDeadline.textContent = project.getFormattedDeadline();
        this.projectDescription.textContent = project.description || Language.translate('no_description');

        // Update labels with translations
        document.querySelector('.project-info .info-item:nth-child(1) .label').textContent = Language.translate('status');
        document.querySelector('.project-info .info-item:nth-child(2) .label').textContent = Language.translate('deadline_label');
        document.querySelector('.project-info .info-item:nth-child(3) .label').textContent = Language.translate('description');

        // Set project ID on add task button
        document.getElementById('add-task-btn').dataset.projectId = projectId;

        // Display tasks for this project
        this.displayTasks(projectId);

        // Load comments for this project
        if (typeof Comments !== 'undefined') {
            Comments.setCurrentEntity('project', projectId);
        }

        // Add event listeners
        document.getElementById('back-to-dashboard').addEventListener('click', this.showDashboard);
        document.getElementById('edit-project-btn').addEventListener('click', () => this.showEditProjectModal(projectId));
        document.getElementById('delete-project-btn').addEventListener('click', () => this.confirmDeleteProject(projectId));
    }

    // Show dashboard
    static showDashboard() {
        document.querySelector('.dashboard').classList.remove('hidden');
        document.getElementById('project-details').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
    }

    // Show admin dashboard
    static showAdminDashboard() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        // Hide other views
        document.querySelector('.dashboard').classList.add('hidden');
        document.getElementById('project-details').classList.add('hidden');

        // Show admin dashboard
        document.getElementById('admin-dashboard').classList.remove('hidden');

        // Update admin dashboard content
        this.updateAdminDashboardContent();

        if (typeof Logger !== 'undefined') {
            Logger.log('Admin dashboard shown');
        }
    }

    // Update admin dashboard content
    static updateAdminDashboardContent() {
        // Update dashboard title
        document.getElementById('admin-dashboard-title').textContent = Language.translate('admin_dashboard');

        // Update back button text
        document.querySelector('#back-to-dashboard-from-admin .back-text').textContent = Language.translate('back');

        // Update stats
        const projects = Storage.getProjects();
        const tasks = Storage.getTasks();
        const users = Storage.getUsers();
        const completedTasks = tasks.filter(task => task.status === 'completed');

        document.getElementById('projects-count').textContent = projects.length;
        document.getElementById('tasks-count').textContent = tasks.length;
        document.getElementById('users-count').textContent = users.length;
        document.getElementById('completed-tasks-count').textContent = completedTasks.length;

        // Update stats labels
        document.querySelector('.admin-stat-card:nth-child(1) p').textContent = Language.translate('projects');
        document.querySelector('.admin-stat-card:nth-child(2) p').textContent = Language.translate('tasks');
        document.querySelector('.admin-stat-card:nth-child(3) p').textContent = Language.translate('users');
        document.querySelector('.admin-stat-card:nth-child(4) p').textContent = Language.translate('completed_tasks');

        // Update panel titles
        document.querySelector('.admin-panel:nth-child(1) h3').textContent = Language.translate('system_status');
        document.querySelector('.admin-panel:nth-child(2) h3').textContent = Language.translate('user_management');
        document.querySelector('.admin-panel:nth-child(3) h3').textContent = Language.translate('system_tools');

        // Update system status
        document.querySelector('.status-item:nth-child(1) .status-label').textContent = Language.translate('system_version') + ':';
        document.querySelector('.status-item:nth-child(2) .status-label').textContent = Language.translate('last_update') + ':';
        document.querySelector('.status-item:nth-child(3) .status-label').textContent = Language.translate('current_admin') + ':';

        // Set last update date
        const lastUpdateDate = new Date().toLocaleDateString();
        document.getElementById('last-update-date').textContent = lastUpdateDate;

        // Set current admin name
        const adminUser = Storage.getUsers().find(user => user.role === 'admin');
        if (adminUser) {
            document.getElementById('current-admin-name').textContent = adminUser.name;
        }

        // Update button texts
        document.getElementById('manage-users-btn').innerHTML = `<i class="fas fa-users-cog"></i> ${Language.translate('manage_users')}`;
        document.getElementById('add-admin-user-btn').innerHTML = `<i class="fas fa-user-shield"></i> ${Language.translate('add_admin')}`;
        document.getElementById('export-data-btn').innerHTML = `<i class="fas fa-file-export"></i> ${Language.translate('export_data')}`;
        document.getElementById('import-data-btn').innerHTML = `<i class="fas fa-file-import"></i> ${Language.translate('import_data')}`;
        document.getElementById('clear-data-btn').innerHTML = `<i class="fas fa-trash-alt"></i> ${Language.translate('clear_data')}`;

        if (typeof Logger !== 'undefined') {
            Logger.log('Admin dashboard content updated');
        }
    }

    // Show user modal with admin check
    static showUserModal() {
        // Check if current user is admin for user management
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        // Show user modal
        const userModal = document.getElementById('user-modal');
        userModal.style.display = 'block';

        // Display users
        this.displayUsers(document.getElementById('users-container'));

        if (typeof Logger !== 'undefined') {
            Logger.log('User modal shown');
        }
    }

    // Display tasks for a project
    static displayTasks(projectId) {
        const tasks = Storage.getProjectTasks(projectId);
        this.tasksContainer.innerHTML = '';

        if (tasks.length === 0) {
            this.tasksContainer.innerHTML = `
                <div class="empty-state">
                    <p>${Language.translate('no_tasks_found')}</p>
                </div>
            `;
            return;
        }

        tasks.forEach(task => {
            this.addTaskToList(task);
        });
    }

    // Add a single task to the tasks list
    static addTaskToList(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.dataset.id = task.id;

        // Get assigned user name if any
        let assignedUserName = Language.translate('unassigned');
        if (task.assignedTo) {
            const user = Storage.getUser(task.assignedTo);
            if (user) {
                assignedUserName = user.name;
            }
        }

        taskElement.innerHTML = `
            <div class="task-info">
                <h4 class="task-name">${task.name}</h4>
                <div class="task-meta">
                    <span class="status status-${task.status}">${this.formatStatus(task.status)}</span>
                    <span class="priority priority-${task.priority}">${this.formatPriority(task.priority)}</span>
                    <span>${Language.translate('due')} ${task.getFormattedDeadline()}</span>
                    <span>${Language.translate('assigned')} ${assignedUserName}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-small edit-task" data-id="${task.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-small btn-danger delete-task" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        this.tasksContainer.appendChild(taskElement);

        // Add event listeners
        const editBtn = taskElement.querySelector('.edit-task');
        editBtn.addEventListener('click', () => this.showEditTaskModal(task.id));

        const deleteBtn = taskElement.querySelector('.delete-task');
        deleteBtn.addEventListener('click', () => this.confirmDeleteTask(task.id));
    }

    // Direct method to open project modal - can be called from HTML
    static openProjectModal() {
        if (typeof Logger !== 'undefined') {
            Logger.log('openProjectModal called directly');
        }

        // Force show the modal
        this.showProjectModal();

        return false; // Prevent default action if called from an onclick
    }

    // Show add/edit project modal
    static showProjectModal(projectId = null) {
        if (typeof Logger !== 'undefined') {
            Logger.log('showProjectModal called', { projectId });
        }

        try {
            // Get modal element
            const modal = document.getElementById('project-modal');
            if (!modal) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Project modal not found in DOM');
                }

                // Try to create the modal if it doesn't exist
                this.createProjectModal();
                return;
            }

            // Get form element
            const form = document.getElementById('project-form');
            if (!form) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Project form not found in DOM');
                }
                return;
            }

            // Get modal title element
            const modalTitle = document.getElementById('project-modal-title');
            if (!modalTitle) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Project modal title not found in DOM');
                }
                return;
            }

            // Reset form
            form.reset();

            // Check if we're using RTL language
            const isRTL = Language.getCurrentLanguage().direction === 'rtl';
            if (typeof Logger !== 'undefined') {
                Logger.log('Current language direction:', isRTL ? 'RTL' : 'LTR');
            }

            // Apply RTL specific styling to the modal if needed
            if (isRTL) {
                modal.style.textAlign = 'right';
                modal.style.direction = 'rtl';
                modal.querySelectorAll('input, textarea, select').forEach(el => {
                    el.style.textAlign = 'right';
                    el.style.direction = 'rtl';
                });
            } else {
                modal.style.textAlign = '';
                modal.style.direction = '';
                modal.querySelectorAll('input, textarea, select').forEach(el => {
                    el.style.textAlign = '';
                    el.style.direction = '';
                });
            }

            // Ensure all text elements are translated
            this.translateProjectModal();

            if (projectId) {
                // Edit existing project
                const project = Storage.getProject(projectId);
                if (!project) {
                    if (typeof Logger !== 'undefined') {
                        Logger.error('Project not found:', projectId);
                    }
                    return;
                }

                modalTitle.textContent = Language.translate('edit_project');
                document.getElementById('project-name').value = project.name;
                document.getElementById('project-description-input').value = project.description;
                document.getElementById('project-status-input').value = project.status;

                if (project.deadline) {
                    // Format date for input (YYYY-MM-DD)
                    const deadlineDate = new Date(project.deadline);
                    const formattedDate = deadlineDate.toISOString().split('T')[0];
                    document.getElementById('project-deadline-input').value = formattedDate;
                }

                form.dataset.projectId = projectId;
            } else {
                // Add new project
                modalTitle.textContent = Language.translate('add_new_project');
                delete form.dataset.projectId;
            }

            // Remove existing event listeners to prevent duplicates
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                const newCloseBtn = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

                // Add event listener
                newCloseBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }

            const cancelBtn = document.getElementById('cancel-project-btn');
            if (cancelBtn) {
                const newCancelBtn = cancelBtn.cloneNode(true);
                cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

                // Add event listener
                newCancelBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }

            // Handle form submission
            form.removeEventListener('submit', this.handleProjectFormSubmit); // Remove to prevent duplicates
            form.addEventListener('submit', this.handleProjectFormSubmit);

            // Show modal - make sure it's visible
            modal.style.display = 'block';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';

            // Ensure modal is in front
            modal.style.zIndex = '1000';

            // Ensure modal content is visible
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.display = 'block';
                modalContent.style.visibility = 'visible';
                modalContent.style.opacity = '1';
            }

            // Focus on the project name field
            setTimeout(() => {
                const projectNameInput = document.getElementById('project-name');
                if (projectNameInput) {
                    projectNameInput.focus();
                }
            }, 100);

            if (typeof Logger !== 'undefined') {
                Logger.log('Project modal should be visible now', {
                    modalDisplay: modal.style.display,
                    modalVisibility: modal.style.visibility,
                    modalZIndex: modal.style.zIndex
                });
            }
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error showing project modal:', error);
            } else {
                console.error('Error showing project modal:', error);
            }
        }
    }

    // Create project modal if it doesn't exist
    static createProjectModal() {
        if (typeof Logger !== 'undefined') {
            Logger.log('Creating project modal');
        }

        try {
            // Check if modal already exists
            if (document.getElementById('project-modal')) {
                if (typeof Logger !== 'undefined') {
                    Logger.warn('Project modal already exists');
                }
                return;
            }

            // Create modal element
            const modal = document.createElement('div');
            modal.id = 'project-modal';
            modal.className = 'modal';

            // Create modal content
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2 id="project-modal-title">${Language.translate('add_new_project')}</h2>
                    <form id="project-form">
                        <div class="form-group">
                            <label for="project-name">${Language.translate('project_name')}</label>
                            <input type="text" id="project-name" required>
                        </div>
                        <div class="form-group">
                            <label for="project-description-input">${Language.translate('description')}</label>
                            <textarea id="project-description-input" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="project-status-input">${Language.translate('status')}</label>
                            <select id="project-status-input">
                                <option value="not-started">${Language.translate('not_started')}</option>
                                <option value="in-progress">${Language.translate('in_progress')}</option>
                                <option value="completed">${Language.translate('completed')}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="project-deadline-input">${Language.translate('deadline')}</label>
                            <input type="date" id="project-deadline-input">
                        </div>
                        <div class="form-actions">
                            <button type="button" id="cancel-project-btn" class="btn">${Language.translate('cancel')}</button>
                            <button type="submit" id="save-project-btn" class="btn btn-primary">${Language.translate('save_project')}</button>
                        </div>
                    </form>
                </div>
            `;

            // Append modal to body
            document.body.appendChild(modal);

            if (typeof Logger !== 'undefined') {
                Logger.log('Project modal created and added to DOM');
            }

            // Show the modal
            setTimeout(() => {
                this.showProjectModal();
            }, 100);
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error creating project modal:', error);
            } else {
                console.error('Error creating project modal:', error);
            }
        }
    }

    // Translate project modal elements
    static translateProjectModal() {
        if (typeof Logger !== 'undefined') {
            Logger.log('Translating project modal');
        }

        try {
            // Get modal element
            const modal = document.getElementById('project-modal');
            if (!modal) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Project modal not found in DOM during translation');
                }
                return;
            }

            // Get modal title
            const modalTitle = document.getElementById('project-modal-title');
            if (modalTitle) {
                // Set title based on whether we're editing or adding
                const form = document.getElementById('project-form');
                if (form && form.dataset.projectId) {
                    modalTitle.textContent = Language.translate('edit_project');
                } else {
                    modalTitle.textContent = Language.translate('add_new_project');
                }
            }

            // Translate form labels
            const projectNameLabel = document.querySelector('label[for="project-name"]');
            if (projectNameLabel) {
                projectNameLabel.textContent = Language.translate('project_name');
            }

            const descriptionLabel = document.querySelector('label[for="project-description-input"]');
            if (descriptionLabel) {
                descriptionLabel.textContent = Language.translate('description');
            }

            const statusLabel = document.querySelector('label[for="project-status-input"]');
            if (statusLabel) {
                statusLabel.textContent = Language.translate('status');
            }

            const deadlineLabel = document.querySelector('label[for="project-deadline-input"]');
            if (deadlineLabel) {
                deadlineLabel.textContent = Language.translate('deadline');
            }

            // Translate status options
            const statusInput = document.getElementById('project-status-input');
            if (statusInput && statusInput.options.length >= 3) {
                statusInput.options[0].textContent = Language.translate('not_started');
                statusInput.options[1].textContent = Language.translate('in_progress');
                statusInput.options[2].textContent = Language.translate('completed');
            }

            // Translate buttons
            const cancelBtn = document.getElementById('cancel-project-btn');
            if (cancelBtn) {
                cancelBtn.textContent = Language.translate('cancel');
            }

            const saveBtn = document.getElementById('save-project-btn');
            if (saveBtn) {
                saveBtn.textContent = Language.translate('save_project');
            }

            // Apply RTL specific styling if needed
            const isRTL = Language.getCurrentLanguage().direction === 'rtl';
            if (typeof Logger !== 'undefined') {
                Logger.log('Applying RTL styling:', isRTL);
            }

            // Apply RTL styles
            this.applyRTLStyles(isRTL);

            if (typeof Logger !== 'undefined') {
                Logger.log('Project modal translation complete');
            }
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error translating project modal:', error);
            } else {
                console.error('Error translating project modal:', error);
            }
        }
    }

    // Apply RTL styles to the project modal
    static applyRTLStyles(isRTL) {
        try {
            const modal = document.getElementById('project-modal');
            if (!modal) return;

            const formActions = document.querySelector('#project-form .form-actions');
            const formGroups = document.querySelectorAll('#project-form .form-group');

            if (isRTL) {
                // Set document direction
                document.documentElement.dir = 'rtl';

                // Set modal direction
                modal.style.direction = 'rtl';
                modal.style.textAlign = 'right';

                // Set form actions direction
                if (formActions) {
                    formActions.style.flexDirection = 'row-reverse';
                }

                // Adjust form groups for RTL
                formGroups.forEach(group => {
                    group.style.textAlign = 'right';
                    const label = group.querySelector('label');
                    if (label) {
                        label.style.textAlign = 'right';
                        label.style.display = 'block';
                        label.style.marginBottom = '0.5rem';
                    }

                    // Adjust input fields for RTL
                    const inputs = group.querySelectorAll('input, textarea, select');
                    inputs.forEach(input => {
                        input.style.textAlign = 'right';
                        input.style.direction = 'rtl';
                    });
                });

                // Adjust modal title for RTL
                const modalTitle = document.getElementById('project-modal-title');
                if (modalTitle) {
                    modalTitle.style.textAlign = 'right';
                }

                // Adjust close button position for RTL
                const closeBtn = document.querySelector('#project-modal .close');
                if (closeBtn) {
                    closeBtn.style.left = '1.5rem';
                    closeBtn.style.right = 'auto';
                }

                // Adjust modal content for RTL
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.style.direction = 'rtl';
                    modalContent.style.textAlign = 'right';
                }
            } else {
                // Set document direction
                document.documentElement.dir = 'ltr';

                // Reset modal direction
                modal.style.direction = '';
                modal.style.textAlign = '';

                // Reset form actions direction
                if (formActions) {
                    formActions.style.flexDirection = 'row';
                }

                // Reset form groups for LTR
                formGroups.forEach(group => {
                    group.style.textAlign = '';
                    const label = group.querySelector('label');
                    if (label) {
                        label.style.textAlign = '';
                        label.style.display = '';
                        label.style.marginBottom = '';
                    }

                    // Reset input fields for LTR
                    const inputs = group.querySelectorAll('input, textarea, select');
                    inputs.forEach(input => {
                        input.style.textAlign = '';
                        input.style.direction = '';
                    });
                });

                // Reset modal title for LTR
                const modalTitle = document.getElementById('project-modal-title');
                if (modalTitle) {
                    modalTitle.style.textAlign = '';
                }

                // Reset close button position for LTR
                const closeBtn = document.querySelector('#project-modal .close');
                if (closeBtn) {
                    closeBtn.style.left = '';
                    closeBtn.style.right = '';
                }

                // Reset modal content for LTR
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.style.direction = '';
                    modalContent.style.textAlign = '';
                }
            }
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error applying RTL styles:', error);
            } else {
                console.error('Error applying RTL styles:', error);
            }
        }
    }

    // Show edit project modal
    static showEditProjectModal(projectId) {
        this.showProjectModal(projectId);
    }

    // Handle project form submission
    static handleProjectFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const name = document.getElementById('project-name').value.trim();
        const description = document.getElementById('project-description-input').value.trim();
        const status = document.getElementById('project-status-input').value;
        const deadline = document.getElementById('project-deadline-input').value;

        // Validate project name
        if (!name) {
            // Show validation message in the current language
            const message = Language.translate('enter_project_name');
            alert(message);
            document.getElementById('project-name').focus();
            return;
        }

        // Validate deadline if provided
        if (deadline) {
            const deadlineDate = new Date(deadline);
            if (isNaN(deadlineDate.getTime())) {
                // Show validation message in the current language
                const message = Language.translate('invalid_date');
                alert(message);
                document.getElementById('project-deadline-input').focus();
                return;
            }
        }

        const projectId = form.dataset.projectId;

        try {
            if (projectId) {
                // Update existing project
                const project = Storage.getProject(projectId);
                if (project) {
                    project.update({
                        name,
                        description,
                        status,
                        deadline: deadline || null
                    });

                    Storage.updateProject(project);

                    // Update UI if project details are shown
                    if (!document.getElementById('project-details').classList.contains('hidden')) {
                        UI.showProjectDetails(projectId);
                    }
                }
            } else {
                // Create new project
                const newProject = new Project(name, description, status, deadline || null);
                Storage.addProject(newProject);
            }

            // Refresh projects list
            UI.displayProjects(Storage.getProjects());

            // Close modal
            document.getElementById('project-modal').style.display = 'none';
        } catch (error) {
            console.error('Error saving project:', error);
            // Show error message in the current language
            const message = Language.translate('error_saving_project');
            alert(message);
        }
    }

    // Confirm delete project
    static confirmDeleteProject(projectId) {
        if (confirm(Language.translate('confirm_delete_project'))) {
            Storage.deleteProject(projectId);

            // If we're in project details view, go back to dashboard
            if (!document.getElementById('project-details').classList.contains('hidden')) {
                this.showDashboard();
            }

            // Refresh projects list
            this.displayProjects(Storage.getProjects());
        }
    }

    // Show add/edit task modal
    static showTaskModal(taskId = null) {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');
        const modalTitle = document.getElementById('task-modal-title');
        const assignedToSelect = document.getElementById('task-assigned-to');

        // Reset form
        form.reset();

        // Populate users dropdown
        this.populateUsersDropdown(assignedToSelect);

        if (taskId) {
            // Edit existing task
            const task = Storage.getTask(taskId);
            if (!task) return;

            modalTitle.textContent = Language.translate('edit_task');
            document.getElementById('task-name').value = task.name;
            document.getElementById('task-description').value = task.description;
            document.getElementById('task-status').value = task.status;
            document.getElementById('task-priority').value = task.priority;

            if (task.deadline) {
                // Format date for input (YYYY-MM-DD)
                const deadlineDate = new Date(task.deadline);
                const formattedDate = deadlineDate.toISOString().split('T')[0];
                document.getElementById('task-deadline').value = formattedDate;
            }

            if (task.assignedTo) {
                assignedToSelect.value = task.assignedTo;
            }

            form.dataset.taskId = taskId;
            form.dataset.projectId = task.projectId;

            // Load comments for this task
            if (typeof Comments !== 'undefined') {
                Comments.setCurrentEntity('task', taskId);
            }
        } else {
            // Add new task
            modalTitle.textContent = Language.translate('add_new_task');
            delete form.dataset.taskId;

            // Get project ID from add task button
            const projectId = document.getElementById('add-task-btn').dataset.projectId;
            form.dataset.projectId = projectId;

            // Hide comments section for new tasks
            const commentsSection = modal.querySelector('.comments-section');
            if (commentsSection) {
                commentsSection.style.display = 'none';
            }
        }

        // Show modal
        modal.style.display = 'block';

        // Add event listeners
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('cancel-task-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Handle form submission
        form.addEventListener('submit', this.handleTaskFormSubmit);
    }

    // Show edit task modal
    static showEditTaskModal(taskId) {
        this.showTaskModal(taskId);
    }

    // Handle task form submission
    static handleTaskFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const name = document.getElementById('task-name').value;
        const description = document.getElementById('task-description').value;
        const status = document.getElementById('task-status').value;
        const priority = document.getElementById('task-priority').value;
        const deadline = document.getElementById('task-deadline').value;
        const assignedTo = document.getElementById('task-assigned-to').value;

        if (!name) {
            alert(Language.translate('enter_task_name'));
            return;
        }

        const projectId = form.dataset.projectId;
        const taskId = form.dataset.taskId;

        if (taskId) {
            // Update existing task
            const task = Storage.getTask(taskId);
            if (task) {
                task.update({
                    name,
                    description,
                    status,
                    priority,
                    deadline: deadline || null,
                    assignedTo: assignedTo || null
                });

                Storage.updateTask(task);
            }
        } else {
            // Create new task
            const newTask = new Task(
                name,
                projectId,
                description,
                status,
                priority,
                deadline || null,
                assignedTo || null
            );

            Storage.addTask(newTask);

            // Create notification for task assignment if assigned to someone
            if (assignedTo) {
                Notifications.createTaskAssignmentNotification(newTask);
            }
        }

        // Refresh tasks list
        UI.displayTasks(projectId);

        // Close modal
        document.getElementById('task-modal').style.display = 'none';
    }

    // Confirm delete task
    static confirmDeleteTask(taskId) {
        if (confirm(Language.translate('confirm_delete_task'))) {
            const task = Storage.getTask(taskId);
            if (task) {
                Storage.deleteTask(taskId);

                // Refresh tasks list
                this.displayTasks(task.projectId);
            }
        }
    }

    // Populate users dropdown
    static populateUsersDropdown(selectElement) {
        // Clear existing options except the first one
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }

        // Add users to dropdown
        const users = Storage.getUsers();
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            selectElement.appendChild(option);
        });
    }

    // Show user modal
    static showUserModal() {
        const modal = document.getElementById('user-modal');
        const usersContainer = document.getElementById('users-container');
        const userFormContainer = document.getElementById('user-form-container');
        const form = document.getElementById('user-form');

        // Reset form
        form.reset();
        delete form.dataset.userId;

        // Hide form initially
        userFormContainer.classList.add('hidden');

        // Display users
        this.displayUsers(usersContainer);

        // Show modal
        modal.style.display = 'block';

        // Add event listeners
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('add-user-btn').addEventListener('click', () => {
            // Show user form for adding
            userFormContainer.classList.remove('hidden');
            document.getElementById('user-form-title').textContent = Language.translate('add_new_user');
            delete form.dataset.userId;
        });

        document.getElementById('cancel-user-btn').addEventListener('click', () => {
            userFormContainer.classList.add('hidden');
        });

        // Handle form submission
        form.addEventListener('submit', this.handleUserFormSubmit);
    }

    // Display users
    static displayUsers(container) {
        const users = Storage.getUsers();
        container.innerHTML = '';

        if (users.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>${Language.translate('no_users_found')}</p>
                </div>
            `;
            return;
        }

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user-item');

            // Add admin badge if user is admin
            const adminBadge = user.role === 'admin' ?
                `<span class="admin-badge">${Language.translate('admin')}</span>` : '';

            userElement.innerHTML = `
                <div class="user-info">
                    <div class="user-name-container">
                        <span class="user-name">${user.name}</span>
                        ${adminBadge}
                    </div>
                    <span class="user-email">${user.email}</span>
                </div>
                <div class="user-actions">
                    <button class="btn btn-small edit-user" data-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger delete-user" data-id="${user.id}" ${user.role === 'admin' ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            container.appendChild(userElement);

            // Add event listeners
            const editBtn = userElement.querySelector('.edit-user');
            editBtn.addEventListener('click', () => this.showEditUserForm(user.id));

            const deleteBtn = userElement.querySelector('.delete-user');
            // Prevent deleting admin users
            if (user.role !== 'admin') {
                deleteBtn.addEventListener('click', () => this.confirmDeleteUser(user.id));
            }
        });
    }

    // Show edit user form
    static showEditUserForm(userId) {
        const user = Storage.getUser(userId);
        if (!user) return;

        const userFormContainer = document.getElementById('user-form-container');
        const form = document.getElementById('user-form');

        // Show form
        userFormContainer.classList.remove('hidden');
        document.getElementById('user-form-title').textContent = Language.translate('edit_user');

        // Populate form
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;

        // Check if role select exists, if not create it
        let roleSelect = document.getElementById('user-role');
        if (!roleSelect) {
            // Create role field if it doesn't exist
            const roleGroup = document.createElement('div');
            roleGroup.classList.add('form-group');
            roleGroup.innerHTML = `
                <label for="user-role">${Language.translate('role')}</label>
                <select id="user-role">
                    <option value="user">${Language.translate('user_role')}</option>
                    <option value="admin">${Language.translate('admin_role')}</option>
                </select>
            `;

            // Insert before the form actions
            const formActions = form.querySelector('.form-actions');
            form.insertBefore(roleGroup, formActions);

            roleSelect = document.getElementById('user-role');
        }

        // Set role value
        roleSelect.value = user.role || 'user';

        // Set user ID
        form.dataset.userId = userId;
    }

    // Handle user form submission
    static handleUserFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;

        // Get role if the field exists
        const roleSelect = document.getElementById('user-role');
        const role = roleSelect ? roleSelect.value : 'user';

        if (!name || !email) {
            alert(Language.translate('enter_name_email'));
            return;
        }

        const userId = form.dataset.userId;

        if (userId) {
            // Update existing user
            const user = Storage.getUser(userId);
            if (user) {
                user.update({ name, email, role });
                Storage.updateUser(user);
            }
        } else {
            // Create new user
            const newUser = new User(name, email, role);
            Storage.addUser(newUser);
        }

        // Refresh users list
        UI.displayUsers(document.getElementById('users-container'));

        // Hide form
        document.getElementById('user-form-container').classList.add('hidden');

        // Reset form
        form.reset();
        delete form.dataset.userId;

        // Update current user display if needed
        UI.updateCurrentUserDisplay();
    }

    // Confirm delete user
    static confirmDeleteUser(userId) {
        if (confirm(Language.translate('confirm_delete_user'))) {
            Storage.deleteUser(userId);

            // Refresh users list
            this.displayUsers(document.getElementById('users-container'));

            // Update current user display if needed
            this.updateCurrentUserDisplay();
        }
    }

    // Update current user display and admin controls
    static updateCurrentUserDisplay() {
        // This method is kept for compatibility with existing code
        // but no longer updates the UI since the current-user element has been removed

        // We still get the current user for potential future use
        const currentUser = Storage.getCurrentUser();

        // Update admin dashboard button visibility
        this.updateAdminControls(currentUser);

        if (typeof Logger !== 'undefined') {
            Logger.log('Current user updated',
                currentUser ? currentUser.name : 'Guest User');
        }
    }

    // Update admin controls visibility based on user role
    static updateAdminControls(user) {
        if (user && user.isAdmin && user.isAdmin()) {
            // Show admin dashboard button
            if (this.adminDashboardBtn) {
                this.adminDashboardBtn.classList.remove('hidden');
                this.adminDashboardBtn.classList.add('show');
            }

            // Show all admin-only elements
            document.querySelectorAll('.admin-only').forEach(el => {
                el.classList.remove('hidden');
                el.classList.add('show');
            });

            if (typeof Logger !== 'undefined') {
                Logger.log('Admin controls shown for admin user', user.name);
            }
        } else {
            // Hide admin dashboard button
            if (this.adminDashboardBtn) {
                this.adminDashboardBtn.classList.add('hidden');
                this.adminDashboardBtn.classList.remove('show');
            }

            // Hide all admin-only elements
            document.querySelectorAll('.admin-only').forEach(el => {
                el.classList.add('hidden');
                el.classList.remove('show');
            });

            if (typeof Logger !== 'undefined') {
                Logger.log('Admin controls hidden for non-admin user');
            }
        }
    }

    // Admin functions

    // Export all data as JSON
    static exportData() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        try {
            // Get all data
            const data = {
                projects: Storage.getProjects(),
                tasks: Storage.getTasks(),
                users: Storage.getUsers(),
                version: '1.0.0',
                exportDate: new Date().toISOString()
            };

            // Convert to JSON
            const jsonData = JSON.stringify(data, null, 2);

            // Create download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pms_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            if (typeof Logger !== 'undefined') {
                Logger.log('Data exported successfully');
            }
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error exporting data:', error);
            }
            alert('Error exporting data: ' + error.message);
        }
    }

    // Import data from JSON file
    static importData() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        try {
            // Create file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';

            // Handle file selection
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);

                        // Validate data structure
                        if (!data.projects || !data.tasks || !data.users) {
                            throw new Error('Invalid data format');
                        }

                        // Import data
                        localStorage.setItem(Storage.PROJECTS_KEY, JSON.stringify(data.projects));
                        localStorage.setItem(Storage.TASKS_KEY, JSON.stringify(data.tasks));
                        localStorage.setItem(Storage.USERS_KEY, JSON.stringify(data.users));

                        // Ensure admin user exists
                        Storage.ensureAdminUser();

                        // Refresh UI
                        UI.displayProjects(Storage.getProjects());
                        UI.updateCurrentUserDisplay();
                        UI.updateAdminDashboardContent();

                        if (typeof Logger !== 'undefined') {
                            Logger.log('Data imported successfully');
                        }

                        alert('Data imported successfully');
                    } catch (error) {
                        if (typeof Logger !== 'undefined') {
                            Logger.error('Error importing data:', error);
                        }
                        alert('Error importing data: ' + error.message);
                    }
                };
                reader.readAsText(file);
            };

            // Trigger file selection
            input.click();
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error importing data:', error);
            }
            alert('Error importing data: ' + error.message);
        }
    }

    // Clear all data
    static clearData() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        // Confirm action
        if (!confirm(Language.translate('confirm_clear_data'))) {
            return;
        }

        try {
            // Clear all data
            localStorage.removeItem(Storage.PROJECTS_KEY);
            localStorage.removeItem(Storage.TASKS_KEY);
            localStorage.removeItem(Storage.USERS_KEY);

            // Ensure admin user exists
            Storage.ensureAdminUser();

            // Refresh UI
            UI.displayProjects(Storage.getProjects());
            UI.updateCurrentUserDisplay();
            UI.updateAdminDashboardContent();

            if (typeof Logger !== 'undefined') {
                Logger.log('All data cleared successfully');
            }

            alert('All data cleared successfully');
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error clearing data:', error);
            }
            alert('Error clearing data: ' + error.message);
        }
    }

    // Add a new admin user
    static addAdminUser() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        // Show user form
        this.showUserModal();

        // Pre-select admin role
        const roleSelect = document.getElementById('user-role');
        if (roleSelect) {
            roleSelect.value = 'admin';
        }
    }

    // Admin functions

    // Export all data as JSON
    static exportData() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        try {
            // Get all data
            const data = {
                projects: Storage.getProjects(),
                tasks: Storage.getTasks(),
                users: Storage.getUsers(),
                version: '1.0.0',
                exportDate: new Date().toISOString()
            };

            // Convert to JSON
            const jsonData = JSON.stringify(data, null, 2);

            // Create download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pms_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            if (typeof Logger !== 'undefined') {
                Logger.log('Data exported successfully');
            }
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error exporting data:', error);
            }
            alert('Error exporting data: ' + error.message);
        }
    }

    // Import data from JSON file
    static importData() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        try {
            // Create file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';

            // Handle file selection
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);

                        // Validate data structure
                        if (!data.projects || !data.tasks || !data.users) {
                            throw new Error('Invalid data format');
                        }

                        // Import data
                        localStorage.setItem(Storage.PROJECTS_KEY, JSON.stringify(data.projects));
                        localStorage.setItem(Storage.TASKS_KEY, JSON.stringify(data.tasks));
                        localStorage.setItem(Storage.USERS_KEY, JSON.stringify(data.users));

                        // Ensure admin user exists
                        Storage.ensureAdminUser();

                        // Refresh UI
                        UI.displayProjects(Storage.getProjects());
                        UI.updateCurrentUserDisplay();
                        UI.updateAdminDashboardContent();

                        if (typeof Logger !== 'undefined') {
                            Logger.log('Data imported successfully');
                        }

                        alert('Data imported successfully');
                    } catch (error) {
                        if (typeof Logger !== 'undefined') {
                            Logger.error('Error importing data:', error);
                        }
                        alert('Error importing data: ' + error.message);
                    }
                };
                reader.readAsText(file);
            };

            // Trigger file selection
            input.click();
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error importing data:', error);
            }
            alert('Error importing data: ' + error.message);
        }
    }

    // Clear all data
    static clearData() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        // Confirm action
        if (!confirm(Language.translate('confirm_clear_data'))) {
            return;
        }

        try {
            // Clear all data
            localStorage.removeItem(Storage.PROJECTS_KEY);
            localStorage.removeItem(Storage.TASKS_KEY);
            localStorage.removeItem(Storage.USERS_KEY);

            // Ensure admin user exists
            Storage.ensureAdminUser();

            // Refresh UI
            UI.displayProjects(Storage.getProjects());
            UI.updateCurrentUserDisplay();
            UI.updateAdminDashboardContent();

            if (typeof Logger !== 'undefined') {
                Logger.log('All data cleared successfully');
            }

            alert('All data cleared successfully');
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Error clearing data:', error);
            }
            alert('Error clearing data: ' + error.message);
        }
    }

    // Add a new admin user
    static addAdminUser() {
        // Check if current user is admin
        const currentUser = Storage.getCurrentUser();
        if (!currentUser || !currentUser.isAdmin()) {
            alert(Language.translate('access_denied'));
            return;
        }

        // Show user form
        this.showUserModal();

        // Pre-select admin role
        const roleSelect = document.getElementById('user-role');
        if (roleSelect) {
            roleSelect.value = 'admin';
        }
    }

    // Format status for display
    static formatStatus(status) {
        switch (status) {
            case 'not-started':
                return 'Not Started';
            case 'in-progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    }

    // Format priority for display
    static formatPriority(priority) {
        return Language.translate(priority);
    }

    // Format status for display
    static formatStatus(status) {
        return Language.translate(status.replace('-', '_'));
    }

    // Initialize language support
    static initLanguage() {
        // Set up language selector
        this.languageSelect.addEventListener('change', (e) => {
            Language.setLanguage(e.target.value);

            // Additional failsafe: ensure the indicator is removed after UI update
            window.addEventListener('load', this.hideLanguageIndicator, { once: true });
            document.addEventListener('DOMContentLoaded', this.hideLanguageIndicator, { once: true });

            // Force hide after a reasonable timeout (8 seconds)
            setTimeout(this.hideLanguageIndicator, 8000);
        });

        // Set initial language
        const currentLang = Language.getCurrentLanguage().code;
        this.languageSelect.value = currentLang;
    }

    // Helper method to hide language change indicator
    static hideLanguageIndicator() {
        const indicator = document.getElementById('language-change-indicator');
        if (indicator && indicator.classList.contains('active')) {
            indicator.classList.remove('active');
            console.log('Language change indicator forcibly hidden');
        }
    }

    // Update UI with current language
    static updateLanguage() {
        // Update static elements
        document.getElementById('app-title').textContent = Language.translate('project_management_system');
        document.getElementById('language-label').textContent = Language.translate('language') + ':';
        document.querySelector('.dashboard-header h2').textContent = Language.translate('projects_dashboard');
        // Update add project button with proper translation
        const addProjectBtn = document.getElementById('add-project-btn');
        addProjectBtn.innerHTML = `<i class="fas fa-plus"></i> ${Language.translate('new_project')}`;
        // Make sure the button is properly aligned for RTL languages
        if (Language.getCurrentLanguage().direction === 'rtl') {
            addProjectBtn.style.direction = 'rtl';
        } else {
            addProjectBtn.style.direction = '';
        }
        document.getElementById('search-input').placeholder = Language.translate('search_projects');

        // Update select options
        const statusFilter = document.getElementById('status-filter');
        statusFilter.options[0].textContent = Language.translate('all_statuses');
        statusFilter.options[1].textContent = Language.translate('not_started');
        statusFilter.options[2].textContent = Language.translate('in_progress');
        statusFilter.options[3].textContent = Language.translate('completed');

        const sortBy = document.getElementById('sort-by');
        sortBy.options[0].textContent = Language.translate('date_created');
        sortBy.options[1].textContent = Language.translate('deadline');
        sortBy.options[2].textContent = Language.translate('name');

        // Update back button
        const backBtn = document.getElementById('back-to-dashboard');
        if (backBtn) {
            backBtn.innerHTML = `<i class="fas fa-arrow-left"></i> ${Language.translate('back')}`;
        }

        // Update task section
        const tasksHeader = document.querySelector('.tasks-header h3');
        if (tasksHeader) {
            tasksHeader.textContent = Language.translate('tasks');
        }

        const addTaskBtn = document.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.innerHTML = `<i class="fas fa-plus"></i> ${Language.translate('new_task')}`;
        }

        const taskStatusFilter = document.getElementById('task-status-filter');
        if (taskStatusFilter) {
            taskStatusFilter.options[0].textContent = Language.translate('all_statuses');
            taskStatusFilter.options[1].textContent = Language.translate('not_started');
            taskStatusFilter.options[2].textContent = Language.translate('in_progress');
            taskStatusFilter.options[3].textContent = Language.translate('completed');
        }

        const taskPriorityFilter = document.getElementById('task-priority-filter');
        if (taskPriorityFilter) {
            taskPriorityFilter.options[0].textContent = Language.translate('all_priorities');
            taskPriorityFilter.options[1].textContent = Language.translate('low');
            taskPriorityFilter.options[2].textContent = Language.translate('medium');
            taskPriorityFilter.options[3].textContent = Language.translate('high');
        }

        // Update project modal if it's visible
        const projectModal = document.getElementById('project-modal');
        if (projectModal && projectModal.style.display === 'block') {
            // If the modal is open, use our dedicated translation method
            this.translateProjectModal();
        } else {
            // Otherwise just update the title for when it opens later
            document.getElementById('project-modal-title').textContent =
                document.getElementById('project-form').dataset.projectId ?
                Language.translate('edit_project') :
                Language.translate('add_new_project');
        }

        // Update task modal
        const taskModalTitle = document.getElementById('task-modal-title');
        if (taskModalTitle) {
            taskModalTitle.textContent =
                document.getElementById('task-form').dataset.taskId ?
                Language.translate('edit_task') :
                Language.translate('add_new_task');
        }

        const taskLabels = document.querySelectorAll('#task-modal label');
        if (taskLabels.length > 0) {
            for (const label of taskLabels) {
                if (label.getAttribute('for') === 'task-name') {
                    label.textContent = Language.translate('task_name');
                } else if (label.getAttribute('for') === 'task-description') {
                    label.textContent = Language.translate('description');
                } else if (label.getAttribute('for') === 'task-status') {
                    label.textContent = Language.translate('status');
                } else if (label.getAttribute('for') === 'task-priority') {
                    label.textContent = Language.translate('priority');
                } else if (label.getAttribute('for') === 'task-deadline') {
                    label.textContent = Language.translate('deadline');
                } else if (label.getAttribute('for') === 'task-assigned-to') {
                    label.textContent = Language.translate('assigned_to');
                }
            }
        }

        const taskStatus = document.getElementById('task-status');
        if (taskStatus) {
            taskStatus.options[0].textContent = Language.translate('not_started');
            taskStatus.options[1].textContent = Language.translate('in_progress');
            taskStatus.options[2].textContent = Language.translate('completed');
        }

        const taskPriority = document.getElementById('task-priority');
        if (taskPriority) {
            taskPriority.options[0].textContent = Language.translate('low');
            taskPriority.options[1].textContent = Language.translate('medium');
            taskPriority.options[2].textContent = Language.translate('high');
        }

        const taskAssignedTo = document.getElementById('task-assigned-to');
        if (taskAssignedTo && taskAssignedTo.options.length > 0) {
            taskAssignedTo.options[0].textContent = Language.translate('unassigned');
        }

        document.getElementById('cancel-task-btn').textContent = Language.translate('cancel');
        document.getElementById('save-task-btn').textContent = Language.translate('save_task');

        // Update user modal
        const userModalTitle = document.querySelector('#user-modal h2');
        if (userModalTitle) {
            userModalTitle.textContent = Language.translate('user_management');
        }

        const usersHeader = document.querySelector('.user-list-section h3');
        if (usersHeader) {
            usersHeader.textContent = Language.translate('users');
        }

        const addUserBtn = document.getElementById('add-user-btn');
        if (addUserBtn) {
            addUserBtn.innerHTML = `<i class="fas fa-plus"></i> ${Language.translate('add_user')}`;
        }

        const userFormTitle = document.getElementById('user-form-title');
        if (userFormTitle) {
            userFormTitle.textContent =
                document.getElementById('user-form').dataset.userId ?
                Language.translate('edit_user') :
                Language.translate('add_new_user');
        }

        const userLabels = document.querySelectorAll('#user-form label');
        if (userLabels.length > 0) {
            for (const label of userLabels) {
                if (label.getAttribute('for') === 'user-name') {
                    label.textContent = Language.translate('name');
                } else if (label.getAttribute('for') === 'user-email') {
                    label.textContent = Language.translate('email');
                }
            }
        }

        document.getElementById('cancel-user-btn').textContent = Language.translate('cancel');
        document.getElementById('save-user-btn').textContent = Language.translate('save_user');

        // Update current user display
        this.updateCurrentUserDisplay();

        // Update notifications if available
        if (typeof Notifications !== 'undefined') {
            Notifications.updateTranslations();
            if (typeof Logger !== 'undefined') {
                Logger.log('Notifications translations updated');
            }
        }

        // Refresh projects list to update all dynamic content
        this.displayProjects(Storage.getProjects());

        // If project details are shown, refresh them too
        if (!this.projectDetails.classList.contains('hidden')) {
            const projectId = document.getElementById('add-task-btn').dataset.projectId;
            if (projectId) {
                this.showProjectDetails(projectId);
            }
        }

        // Final failsafe: ensure the indicator is hidden after all UI updates
        setTimeout(this.hideLanguageIndicator, 500);
    }
}
