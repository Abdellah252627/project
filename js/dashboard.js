/**
 * Dashboard and Reports functionality for the Project Management System
 * Handles data visualization, charts, and reports generation
 */
class Dashboard {
    // DOM elements
    static dashboardContainer;
    static projectsChartContainer;
    static tasksStatusChartContainer;
    static tasksPriorityChartContainer;
    static projectProgressChartContainer;
    static ganttChartContainer;
    static userPerformanceContainer;
    static deadlinesContainer;
    static kpiContainer;
    
    // Chart instances
    static projectsChart;
    static tasksStatusChart;
    static tasksPriorityChart;
    static projectProgressChart;
    static ganttChart;
    static userPerformanceChart;
    
    // Initialize dashboard
    static init() {
        // Initialize DOM elements
        this.dashboardContainer = document.getElementById('reports-dashboard');
        this.projectsChartContainer = document.getElementById('projects-chart-container');
        this.tasksStatusChartContainer = document.getElementById('tasks-status-chart-container');
        this.tasksPriorityChartContainer = document.getElementById('tasks-priority-chart-container');
        this.projectProgressChartContainer = document.getElementById('project-progress-chart-container');
        this.ganttChartContainer = document.getElementById('gantt-chart-container');
        this.userPerformanceContainer = document.getElementById('user-performance-container');
        this.deadlinesContainer = document.getElementById('deadlines-container');
        this.kpiContainer = document.getElementById('kpi-container');
        
        // Set up event listeners
        this.setupEventListeners();
        
        if (typeof Logger !== 'undefined') {
            Logger.log('Dashboard system initialized');
        }
    }
    
    // Set up event listeners
    static setupEventListeners() {
        // Dashboard navigation
        const dashboardNavItems = document.querySelectorAll('.dashboard-nav-item');
        dashboardNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                this.showDashboardSection(target);
            });
        });
        
        // Export buttons
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => {
                this.exportToPdf();
            });
        }
        
        const exportExcelBtn = document.getElementById('export-excel-btn');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => {
                this.exportToExcel();
            });
        }
        
        const exportCsvBtn = document.getElementById('export-csv-btn');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                this.exportToCsv();
            });
        }
        
        // Print button
        const printReportBtn = document.getElementById('print-report-btn');
        if (printReportBtn) {
            printReportBtn.addEventListener('click', () => {
                this.printReport();
            });
        }
        
        // Filter buttons
        const filterProjectSelect = document.getElementById('filter-project');
        if (filterProjectSelect) {
            filterProjectSelect.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        const filterDateRangeSelect = document.getElementById('filter-date-range');
        if (filterDateRangeSelect) {
            filterDateRangeSelect.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        // Refresh button
        const refreshDashboardBtn = document.getElementById('refresh-dashboard-btn');
        if (refreshDashboardBtn) {
            refreshDashboardBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }
    }
    
    // Show dashboard
    static showDashboard() {
        // Hide other views
        document.querySelector('.dashboard').classList.add('hidden');
        document.getElementById('project-details').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
        
        // Show reports dashboard
        this.dashboardContainer.classList.remove('hidden');
        
        // Load dashboard data
        this.loadDashboardData();
        
        if (typeof Logger !== 'undefined') {
            Logger.log('Reports dashboard shown');
        }
    }
    
    // Show specific dashboard section
    static showDashboardSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');
        }
        
        // Update active nav item
        const navItems = document.querySelectorAll('.dashboard-nav-item');
        navItems.forEach(item => {
            if (item.dataset.target === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Load dashboard data
    static loadDashboardData() {
        // Load projects and tasks data
        const projects = Storage.getProjects();
        const tasks = Storage.getTasks();
        const users = Storage.getUsers();
        
        // Populate project filter dropdown
        this.populateProjectFilter(projects);
        
        // Create charts
        this.createTaskStatusChart(tasks);
        this.createTaskPriorityChart(tasks);
        this.createProjectProgressChart(projects, tasks);
        this.createGanttChart(projects, tasks);
        this.createUserPerformanceReport(users, tasks);
        this.createUpcomingDeadlinesReport(tasks);
        this.createKPIReport(projects, tasks);
        
        if (typeof Logger !== 'undefined') {
            Logger.log('Dashboard data loaded');
        }
    }
    
    // Populate project filter dropdown
    static populateProjectFilter(projects) {
        const filterProjectSelect = document.getElementById('filter-project');
        if (!filterProjectSelect) return;
        
        // Clear existing options
        filterProjectSelect.innerHTML = '';
        
        // Add "All Projects" option
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = Language.translate('all_projects');
        filterProjectSelect.appendChild(allOption);
        
        // Add project options
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            filterProjectSelect.appendChild(option);
        });
    }
    
    // Create task status chart (pie chart)
    static createTaskStatusChart(tasks) {
        if (!this.tasksStatusChartContainer) return;
        
        // Count tasks by status
        const statusCounts = {
            'not-started': 0,
            'in-progress': 0,
            'completed': 0
        };
        
        tasks.forEach(task => {
            if (statusCounts.hasOwnProperty(task.status)) {
                statusCounts[task.status]++;
            }
        });
        
        // Prepare chart data
        const data = {
            labels: [
                Language.translate('not_started'),
                Language.translate('in_progress'),
                Language.translate('completed')
            ],
            datasets: [{
                data: [
                    statusCounts['not-started'],
                    statusCounts['in-progress'],
                    statusCounts['completed']
                ],
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#4bc0c0'
                ]
            }]
        };
        
        // Create or update chart
        if (this.tasksStatusChart) {
            this.tasksStatusChart.data = data;
            this.tasksStatusChart.update();
        } else {
            const ctx = this.tasksStatusChartContainer.getContext('2d');
            this.tasksStatusChart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: Language.translate('tasks_by_status')
                        }
                    }
                }
            });
        }
    }
    
    // Create task priority chart (pie chart)
    static createTaskPriorityChart(tasks) {
        if (!this.tasksPriorityChartContainer) return;
        
        // Count tasks by priority
        const priorityCounts = {
            'low': 0,
            'medium': 0,
            'high': 0
        };
        
        tasks.forEach(task => {
            if (priorityCounts.hasOwnProperty(task.priority)) {
                priorityCounts[task.priority]++;
            }
        });
        
        // Prepare chart data
        const data = {
            labels: [
                Language.translate('low'),
                Language.translate('medium'),
                Language.translate('high')
            ],
            datasets: [{
                data: [
                    priorityCounts['low'],
                    priorityCounts['medium'],
                    priorityCounts['high']
                ],
                backgroundColor: [
                    '#4bc0c0',
                    '#ffcd56',
                    '#ff6384'
                ]
            }]
        };
        
        // Create or update chart
        if (this.tasksPriorityChart) {
            this.tasksPriorityChart.data = data;
            this.tasksPriorityChart.update();
        } else {
            const ctx = this.tasksPriorityChartContainer.getContext('2d');
            this.tasksPriorityChart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: Language.translate('tasks_by_priority')
                        }
                    }
                }
            });
        }
    }
}
