// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    initAdminSidebar();
    initDataTables();
    initAdminModals();
    initChartJS();
});

// 1. Admin Sidebar Toggle
function initAdminSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
            
            // Save preference in localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
        
        // Load saved preference
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            sidebar.classList.add('collapsed');
            document.querySelector('.main-content').classList.add('expanded');
        }
    }
}

// 2. Data Tables Initialization
function initDataTables() {
    const dataTables = document.querySelectorAll('.admin-table');
    
    dataTables.forEach(table => {
        new simpleDatatables.DataTable(table, {
            searchable: true,
            fixedHeight: true,
            perPage: 10,
            labels: {
                placeholder: "Search...",
                perPage: "{select} entries per page",
                noRows: "No data found",
                info: "Showing {start} to {end} of {rows} entries"
            }
        });
    });
}

// 3. Modal Dialogs for Admin
function initAdminModals() {
    // Delete confirmation modals
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const modal = document.querySelector(target);
            
            if (modal) {
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
                
                // Set up confirm button
                const confirmBtn = modal.querySelector('.confirm-delete');
                if (confirmBtn) {
                    confirmBtn.href = this.href;
                }
            }
        });
    });
}

// 4. Charts for Dashboard
function initChartJS() {
    const occupancyChart = document.getElementById('occupancyChart');
    const revenueChart = document.getElementById('revenueChart');
    
    if (occupancyChart) {
        new Chart(occupancyChart, {
            type: 'doughnut',
            data: {
                labels: ['Occupied', 'Available', 'Maintenance'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#e74a3b'
                    ],
                    hoverBackgroundColor: [
                        '#2e59d9',
                        '#17a673',
                        '#be2617'
                    ],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    if (revenueChart) {
        new Chart(revenueChart, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: "Revenue",
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
                    borderColor: "#4e73df",
                    data: [4215, 5312, 6251, 7841, 9821, 14984],
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// 5. Form Handling for Admin
function handleAdminForms() {
    const forms = document.querySelectorAll('.admin-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const action = this.getAttribute('action');
            const method = this.getAttribute('method') || 'POST';
            
            fetch(action, {
                method: method,
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('success', data.message);
                    
                    // Redirect or reload if needed
                    if (data.redirect) {
                        setTimeout(() => {
                            window.location.href = data.redirect;
                        }, 1500);
                    } else if (data.reload) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    }
                } else {
                    showAlert('danger', data.message || 'An error occurred');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('danger', 'An error occurred while processing your request');
            });
        });
    });
}

function showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }, 5000);
}
