/**
 * Language support for the Project Management System
 */

class Language {
    // Available languages
    static LANGUAGES = {
        en: {
            code: 'en',
            name: 'English',
            direction: 'ltr'
        },
        es: {
            code: 'es',
            name: 'Español',
            direction: 'ltr'
        },
        ar: {
            code: 'ar',
            name: 'العربية',
            direction: 'rtl'
        }
    };

    // Default language
    static DEFAULT_LANGUAGE = 'en';

    // Storage key for language preference
    static LANGUAGE_KEY = 'pms_language';

    // Current language
    static currentLanguage = null;

    // Translations
    static translations = {
        // General
        'project_management_system': {
            en: 'Project Management System',
            es: 'Sistema de Gestión de Proyectos',
            ar: 'نظام إدارة المشاريع'
        },
        'guest_user': {
            en: 'Guest User',
            es: 'Usuario Invitado',
            ar: 'مستخدم زائر'
        },
        'language': {
            en: 'Language',
            es: 'Idioma',
            ar: 'اللغة'
        },

        // Dashboard
        'projects_dashboard': {
            en: 'Projects Dashboard',
            es: 'Panel de Proyectos',
            ar: 'لوحة المشاريع'
        },
        'new_project': {
            en: 'New Project',
            es: 'Nuevo Proyecto',
            ar: 'إضافة مشروع'
        },
        'search_projects': {
            en: 'Search projects...',
            es: 'Buscar proyectos...',
            ar: 'البحث عن المشاريع...'
        },
        'all_statuses': {
            en: 'All Statuses',
            es: 'Todos los Estados',
            ar: 'جميع الحالات'
        },
        'not_started': {
            en: 'Not Started',
            es: 'No Iniciado',
            ar: 'لم يبدأ'
        },
        'in_progress': {
            en: 'In Progress',
            es: 'En Progreso',
            ar: 'قيد التنفيذ'
        },
        'completed': {
            en: 'Completed',
            es: 'Completado',
            ar: 'مكتمل'
        },
        'date_created': {
            en: 'Date Created',
            es: 'Fecha de Creación',
            ar: 'تاريخ الإنشاء'
        },
        'deadline': {
            en: 'Deadline',
            es: 'Fecha Límite',
            ar: 'الموعد النهائي'
        },
        'name': {
            en: 'Name',
            es: 'Nombre',
            ar: 'الاسم'
        },
        'no_projects_found': {
            en: 'No projects found. Create your first project!',
            es: 'No se encontraron proyectos. ¡Crea tu primer proyecto!',
            ar: 'لم يتم العثور على مشاريع. أنشئ مشروعك الأول!'
        },
        'no_description': {
            en: 'No description provided.',
            es: 'No se proporcionó descripción.',
            ar: 'لم يتم تقديم وصف.'
        },
        'deadline_label': {
            en: 'Deadline:',
            es: 'Fecha Límite:',
            ar: 'الموعد النهائي:'
        },
        'tasks_label': {
            en: 'Tasks:',
            es: 'Tareas:',
            ar: 'المهام:'
        },

        // Project Details
        'back': {
            en: 'Back',
            es: 'Volver',
            ar: 'رجوع'
        },
        'status': {
            en: 'Status:',
            es: 'Estado:',
            ar: 'الحالة:'
        },
        'description': {
            en: 'Description:',
            es: 'Descripción:',
            ar: 'الوصف:'
        },
        'tasks': {
            en: 'Tasks',
            es: 'Tareas',
            ar: 'المهام'
        },
        'new_task': {
            en: 'New Task',
            es: 'Nueva Tarea',
            ar: 'مهمة جديدة'
        },
        'all_priorities': {
            en: 'All Priorities',
            es: 'Todas las Prioridades',
            ar: 'جميع الأولويات'
        },
        'low': {
            en: 'Low',
            es: 'Baja',
            ar: 'منخفضة'
        },
        'medium': {
            en: 'Medium',
            es: 'Media',
            ar: 'متوسطة'
        },
        'high': {
            en: 'High',
            es: 'Alta',
            ar: 'عالية'
        },
        'no_tasks_found': {
            en: 'No tasks found. Create your first task!',
            es: 'No se encontraron tareas. ¡Crea tu primera tarea!',
            ar: 'لم يتم العثور على مهام. أنشئ مهمتك الأولى!'
        },
        'no_tasks_match': {
            en: 'No tasks match your filters.',
            es: 'Ninguna tarea coincide con tus filtros.',
            ar: 'لا توجد مهام تطابق عوامل التصفية الخاصة بك.'
        },

        // Forms
        'add_new_project': {
            en: 'Add New Project',
            es: 'Agregar Nuevo Proyecto',
            ar: 'إضافة مشروع جديد'
        },
        'edit_project': {
            en: 'Edit Project',
            es: 'Editar Proyecto',
            ar: 'تحرير المشروع'
        },
        'project_name': {
            en: 'Project Name',
            es: 'Nombre del Proyecto',
            ar: 'اسم المشروع'
        },
        'cancel': {
            en: 'Cancel',
            es: 'Cancelar',
            ar: 'إلغاء'
        },
        'save_project': {
            en: 'Save Project',
            es: 'Guardar Proyecto',
            ar: 'حفظ المشروع'
        },
        'add_new_task': {
            en: 'Add New Task',
            es: 'Agregar Nueva Tarea',
            ar: 'إضافة مهمة جديدة'
        },
        'edit_task': {
            en: 'Edit Task',
            es: 'Editar Tarea',
            ar: 'تحرير المهمة'
        },
        'task_name': {
            en: 'Task Name',
            es: 'Nombre de la Tarea',
            ar: 'اسم المهمة'
        },
        'priority': {
            en: 'Priority',
            es: 'Prioridad',
            ar: 'الأولوية'
        },
        'assigned_to': {
            en: 'Assigned To',
            es: 'Asignado a',
            ar: 'مُسند إلى'
        },
        'unassigned': {
            en: 'Unassigned',
            es: 'Sin asignar',
            ar: 'غير مُسند'
        },
        'save_task': {
            en: 'Save Task',
            es: 'Guardar Tarea',
            ar: 'حفظ المهمة'
        },
        'due': {
            en: 'Due:',
            es: 'Vence:',
            ar: 'تاريخ الاستحقاق:'
        },
        'assigned': {
            en: 'Assigned:',
            es: 'Asignado:',
            ar: 'مُسند:'
        },

        // User Management
        'user_management': {
            en: 'User Management',
            es: 'Gestión de Usuarios',
            ar: 'إدارة المستخدمين'
        },
        'users': {
            en: 'Users',
            es: 'Usuarios',
            ar: 'المستخدمون'
        },
        'add_user': {
            en: 'Add User',
            es: 'Agregar Usuario',
            ar: 'إضافة مستخدم'
        },
        'add_new_user': {
            en: 'Add New User',
            es: 'Agregar Nuevo Usuario',
            ar: 'إضافة مستخدم جديد'
        },
        'edit_user': {
            en: 'Edit User',
            es: 'Editar Usuario',
            ar: 'تحرير المستخدم'
        },
        'email': {
            en: 'Email',
            es: 'Correo Electrónico',
            ar: 'البريد الإلكتروني'
        },
        'save_user': {
            en: 'Save User',
            es: 'Guardar Usuario',
            ar: 'حفظ المستخدم'
        },
        'no_users_found': {
            en: 'No users found. Add your first user!',
            es: 'No se encontraron usuarios. ¡Agrega tu primer usuario!',
            ar: 'لم يتم العثور على مستخدمين. أضف مستخدمك الأول!'
        },
        'role': {
            en: 'Role',
            es: 'Rol',
            ar: 'الدور'
        },
        'admin': {
            en: 'Admin',
            es: 'Administrador',
            ar: 'مسؤول'
        },
        'user_role': {
            en: 'User',
            es: 'Usuario',
            ar: 'مستخدم'
        },
        'admin_role': {
            en: 'Administrator',
            es: 'Administrador',
            ar: 'مسؤول النظام'
        },

        // Admin Dashboard
        'admin_dashboard': {
            en: 'Admin Dashboard',
            es: 'Panel de Administración',
            ar: 'لوحة تحكم المسؤول'
        },
        'projects': {
            en: 'Projects',
            es: 'Proyectos',
            ar: 'المشاريع'
        },
        'tasks': {
            en: 'Tasks',
            es: 'Tareas',
            ar: 'المهام'
        },
        'completed_tasks': {
            en: 'Completed Tasks',
            es: 'Tareas Completadas',
            ar: 'المهام المكتملة'
        },
        'system_status': {
            en: 'System Status',
            es: 'Estado del Sistema',
            ar: 'حالة النظام'
        },
        'system_version': {
            en: 'System Version',
            es: 'Versión del Sistema',
            ar: 'إصدار النظام'
        },
        'last_update': {
            en: 'Last Update',
            es: 'Última Actualización',
            ar: 'آخر تحديث'
        },
        'current_admin': {
            en: 'Current Admin',
            es: 'Administrador Actual',
            ar: 'المسؤول الحالي'
        },
        'user_management': {
            en: 'User Management',
            es: 'Gestión de Usuarios',
            ar: 'إدارة المستخدمين'
        },
        'manage_users': {
            en: 'Manage Users',
            es: 'Administrar Usuarios',
            ar: 'إدارة المستخدمين'
        },
        'add_admin': {
            en: 'Add Admin',
            es: 'Añadir Administrador',
            ar: 'إضافة مسؤول'
        },
        'system_tools': {
            en: 'System Tools',
            es: 'Herramientas del Sistema',
            ar: 'أدوات النظام'
        },
        'export_data': {
            en: 'Export Data',
            es: 'Exportar Datos',
            ar: 'تصدير البيانات'
        },
        'import_data': {
            en: 'Import Data',
            es: 'Importar Datos',
            ar: 'استيراد البيانات'
        },
        'clear_data': {
            en: 'Clear All Data',
            es: 'Borrar Todos los Datos',
            ar: 'مسح جميع البيانات'
        },
        'confirm_clear_data': {
            en: 'Are you sure you want to clear all data? This action cannot be undone.',
            es: '¿Estás seguro de que deseas borrar todos los datos? Esta acción no se puede deshacer.',
            ar: 'هل أنت متأكد من أنك تريد مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.'
        },
        'access_denied': {
            en: 'Access Denied. Admin privileges required.',
            es: 'Acceso Denegado. Se requieren privilegios de administrador.',
            ar: 'تم رفض الوصول. مطلوب صلاحيات المسؤول.'
        },

        // Notifications
        'notifications': {
            en: 'Notifications',
            es: 'Notificaciones',
            ar: 'الإشعارات'
        },
        'no_notifications': {
            en: 'No notifications',
            es: 'No hay notificaciones',
            ar: 'لا توجد إشعارات'
        },
        'mark_all_read': {
            en: 'Mark all as read',
            es: 'Marcar todo como leído',
            ar: 'تعيين الكل كمقروء'
        },
        'clear_all': {
            en: 'Clear all',
            es: 'Borrar todo',
            ar: 'مسح الكل'
        },
        'mark_read': {
            en: 'Mark as read',
            es: 'Marcar como leído',
            ar: 'تعيين كمقروء'
        },
        'delete_notification': {
            en: 'Delete',
            es: 'Eliminar',
            ar: 'حذف'
        },
        'just_now': {
            en: 'Just now',
            es: 'Ahora mismo',
            ar: 'الآن'
        },
        'minute_ago': {
            en: 'minute ago',
            es: 'minuto atrás',
            ar: 'دقيقة مضت'
        },
        'minutes_ago': {
            en: 'minutes ago',
            es: 'minutos atrás',
            ar: 'دقائق مضت'
        },
        'hour_ago': {
            en: 'hour ago',
            es: 'hora atrás',
            ar: 'ساعة مضت'
        },
        'hours_ago': {
            en: 'hours ago',
            es: 'horas atrás',
            ar: 'ساعات مضت'
        },
        'day_ago': {
            en: 'day ago',
            es: 'día atrás',
            ar: 'يوم مضى'
        },
        'days_ago': {
            en: 'days ago',
            es: 'días atrás',
            ar: 'أيام مضت'
        },
        'task_assigned': {
            en: 'Task Assigned',
            es: 'Tarea Asignada',
            ar: 'تم تعيين مهمة'
        },
        'upcoming_deadline': {
            en: 'Upcoming Deadline',
            es: 'Fecha Límite Próxima',
            ar: 'موعد نهائي قادم'
        },

        // Comments
        'comments': {
            en: 'Comments',
            es: 'Comentarios',
            ar: 'التعليقات'
        },
        'add_comment': {
            en: 'Add Comment',
            es: 'Añadir Comentario',
            ar: 'إضافة تعليق'
        },
        'reply': {
            en: 'Reply',
            es: 'Responder',
            ar: 'رد'
        },
        'edit_comment': {
            en: 'Edit Comment',
            es: 'Editar Comentario',
            ar: 'تعديل التعليق'
        },
        'delete_comment': {
            en: 'Delete Comment',
            es: 'Eliminar Comentario',
            ar: 'حذف التعليق'
        },
        'confirm_delete_comment': {
            en: 'Are you sure you want to delete this comment?',
            es: '¿Estás seguro de que quieres eliminar este comentario?',
            ar: 'هل أنت متأكد من أنك تريد حذف هذا التعليق؟'
        },
        'no_comments': {
            en: 'No comments yet. Be the first to comment!',
            es: 'Aún no hay comentarios. ¡Sé el primero en comentar!',
            ar: 'لا توجد تعليقات حتى الآن. كن أول من يعلق!'
        },
        'comment_placeholder': {
            en: 'Write your comment here... Use @ to mention users and Markdown for formatting',
            es: 'Escribe tu comentario aquí... Usa @ para mencionar usuarios y Markdown para formatear',
            ar: 'اكتب تعليقك هنا... استخدم @ لذكر المستخدمين و Markdown للتنسيق'
        },
        'reply_placeholder': {
            en: 'Write your reply here...',
            es: 'Escribe tu respuesta aquí...',
            ar: 'اكتب ردك هنا...'
        },
        'save_comment': {
            en: 'Save Comment',
            es: 'Guardar Comentario',
            ar: 'حفظ التعليق'
        },
        'cancel': {
            en: 'Cancel',
            es: 'Cancelar',
            ar: 'إلغاء'
        },
        'edited': {
            en: 'edited',
            es: 'editado',
            ar: 'تم التعديل'
        },
        'show_replies': {
            en: 'Show Replies',
            es: 'Mostrar Respuestas',
            ar: 'عرض الردود'
        },
        'hide_replies': {
            en: 'Hide Replies',
            es: 'Ocultar Respuestas',
            ar: 'إخفاء الردود'
        },
        'markdown_guide': {
            en: 'Markdown Guide',
            es: 'Guía de Markdown',
            ar: 'دليل Markdown'
        },
        'markdown_bold': {
            en: 'Bold: **text**',
            es: 'Negrita: **texto**',
            ar: 'غامق: **نص**'
        },
        'markdown_italic': {
            en: 'Italic: *text*',
            es: 'Cursiva: *texto*',
            ar: 'مائل: *نص*'
        },
        'markdown_link': {
            en: 'Link: [text](url)',
            es: 'Enlace: [texto](url)',
            ar: 'رابط: [نص](رابط)'
        },
        'markdown_list': {
            en: 'List: * item or 1. item',
            es: 'Lista: * elemento o 1. elemento',
            ar: 'قائمة: * عنصر أو 1. عنصر'
        },
        'markdown_heading': {
            en: 'Heading: # Heading',
            es: 'Título: # Título',
            ar: 'عنوان: # عنوان'
        },
        'mention_users': {
            en: 'Mention users with @username',
            es: 'Menciona usuarios con @nombreusuario',
            ar: 'ذكر المستخدمين باستخدام @اسم_المستخدم'
        },

        // Alerts and Confirmations
        'enter_project_name': {
            en: 'Please enter a project name',
            es: 'Por favor, ingresa un nombre de proyecto',
            ar: 'الرجاء إدخال اسم المشروع'
        },
        'enter_task_name': {
            en: 'Please enter a task name',
            es: 'Por favor, ingresa un nombre de tarea',
            ar: 'الرجاء إدخال اسم المهمة'
        },
        'enter_name_email': {
            en: 'Please enter both name and email',
            es: 'Por favor, ingresa tanto el nombre como el correo electrónico',
            ar: 'الرجاء إدخال كل من الاسم والبريد الإلكتروني'
        },
        'invalid_date': {
            en: 'Please enter a valid date',
            es: 'Por favor, ingresa una fecha válida',
            ar: 'الرجاء إدخال تاريخ صحيح'
        },
        'error_saving_project': {
            en: 'An error occurred while saving the project',
            es: 'Ocurrió un error al guardar el proyecto',
            ar: 'حدث خطأ أثناء حفظ المشروع'
        },
        'confirm_delete_project': {
            en: 'Are you sure you want to delete this project? All associated tasks will also be deleted.',
            es: '¿Estás seguro de que deseas eliminar este proyecto? Todas las tareas asociadas también se eliminarán.',
            ar: 'هل أنت متأكد من أنك تريد حذف هذا المشروع؟ سيتم حذف جميع المهام المرتبطة به أيضًا.'
        },
        'confirm_delete_task': {
            en: 'Are you sure you want to delete this task?',
            es: '¿Estás seguro de que deseas eliminar esta tarea?',
            ar: 'هل أنت متأكد من أنك تريد حذف هذه المهمة؟'
        },
        'confirm_delete_user': {
            en: 'Are you sure you want to delete this user? Tasks assigned to this user will be unassigned.',
            es: '¿Estás seguro de que deseas eliminar este usuario? Las tareas asignadas a este usuario quedarán sin asignar.',
            ar: 'هل أنت متأكد من أنك تريد حذف هذا المستخدم؟ سيتم إلغاء تعيين المهام المسندة إلى هذا المستخدم.'
        }
    };

    // Initialize language
    static init() {
        // Get saved language preference or use default
        const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY) || this.DEFAULT_LANGUAGE;
        this.setLanguage(savedLanguage);
    }

    // Get current language
    static getCurrentLanguage() {
        return this.currentLanguage || this.LANGUAGES[this.DEFAULT_LANGUAGE];
    }

    // Set language
    static setLanguage(languageCode) {
        if (this.LANGUAGES[languageCode]) {
            // Show language change indicator
            const indicator = document.getElementById('language-change-indicator');

            // Make sure indicator is visible
            indicator.classList.add('active');

            try {
                // Calculate appropriate delay based on language (RTL languages need more time)
                const isRTL = this.LANGUAGES[languageCode].direction === 'rtl';

                // Ensure the indicator is shown before proceeding
                setTimeout(() => {
                    try {
                        // Update language settings
                        this.currentLanguage = this.LANGUAGES[languageCode];
                        localStorage.setItem(this.LANGUAGE_KEY, languageCode);

                        // Update HTML lang attribute
                        document.documentElement.lang = languageCode;

                        // Update direction for RTL support
                        document.documentElement.dir = this.currentLanguage.direction;

                        // Update UI with new language
                        this.updateUI();

                        // Dispatch language-changed event
                        const event = new CustomEvent('language-changed', {
                            detail: { language: languageCode }
                        });
                        document.dispatchEvent(event);

                        // Use requestAnimationFrame to ensure the UI has been updated
                        // before hiding the indicator
                        requestAnimationFrame(() => {
                            // Give RTL languages more time to render properly
                            const delay = isRTL ? 800 : 400;

                            setTimeout(() => {
                                // Hide the indicator
                                indicator.classList.remove('active');

                                // Double-check that the indicator is hidden after a short delay
                                setTimeout(() => {
                                    if (indicator.classList.contains('active')) {
                                        indicator.classList.remove('active');
                                    }
                                }, 200);
                            }, delay);
                        });
                    } catch (error) {
                        console.error('Error during language update:', error);
                        // Ensure indicator is hidden even if there's an error
                        indicator.classList.remove('active');
                    }
                }, 100);
            } catch (error) {
                console.error('Error in setLanguage:', error);
                // Ensure indicator is hidden even if there's an error
                indicator.classList.remove('active');
            }

            return true;
        }
        return false;
    }

    // Get translation
    static translate(key) {
        const lang = this.getCurrentLanguage().code;
        if (this.translations[key] && this.translations[key][lang]) {
            return this.translations[key][lang];
        }
        // Fallback to English if translation not found
        if (this.translations[key] && this.translations[key]['en']) {
            return this.translations[key]['en'];
        }
        // Return key as is if no translation found
        return key;
    }

    // Update UI with current language
    static updateUI() {
        // This will be called after language change to update all text in the UI
        // The actual implementation will be in UI.js
        if (typeof UI !== 'undefined' && UI.updateLanguage) {
            UI.updateLanguage();
        }

        // Update comments if available
        if (typeof Comments !== 'undefined' && Comments.updateTranslations) {
            Comments.updateTranslations();
        }
    }
}
