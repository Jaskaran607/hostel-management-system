// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initHostelFiltering();
    initBookingForm();
    initDatePickers();
    initPriceRangeSliders();
    initImageCarousels();
    
    // Show current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// 1. Navigation Functionality
function initNavbar() {
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarNav = document.querySelector('#navbarNav');
    
    if (navbarToggler && navbarNav) {
        navbarToggler.addEventListener('click', function() {
            navbarNav.classList.toggle('show');
        });
    }
    
    // Active link highlighting
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (currentPage === linkPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// 2. Hostel Filtering System
function initHostelFiltering() {
    const searchInput = document.querySelector('.search-filter input');
    const filterButton = document.querySelector('.search-filter button');
    const hostelCards = document.querySelectorAll('.hostel-card');
    const facilityCheckboxes = document.querySelectorAll('.facilities-filter input[type="checkbox"]');
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    
    if (!searchInput || !filterButton) return;
    
    // Search functionality
    searchInput.addEventListener('input', filterHostels);
    filterButton.addEventListener('click', filterHostels);
    
    // Facility filter
    facilityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterHostels);
    });
    
    // Price range filter
    if (priceMinInput && priceMaxInput) {
        priceMinInput.addEventListener('input', function() {
            document.getElementById('priceMinValue').textContent = this.value;
            filterHostels();
        });
        
        priceMaxInput.addEventListener('input', function() {
            document.getElementById('priceMaxValue').textContent = this.value;
            filterHostels();
        });
    }
    
    function filterHostels() {
        const searchTerm = searchInput.value.toLowerCase();
        const minPrice = parseInt(priceMinInput?.value) || 0;
        const maxPrice = parseInt(priceMaxInput?.value) || 300;
        
        // Get selected facilities
        const selectedFacilities = Array.from(facilityCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.id);
        
        hostelCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-text').textContent.toLowerCase();
            const price = parseInt(card.querySelector('.price').textContent.replace('$', ''));
            const facilities = Array.from(card.querySelectorAll('.hostel-features .badge'))
                .map(badge => badge.querySelector('i').className.split('-').pop());
            
            // Check search term
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            
            // Check price range
            const matchesPrice = price >= minPrice && price <= maxPrice;
            
            // Check facilities (if any are selected)
            const matchesFacilities = selectedFacilities.length === 0 || 
                selectedFacilities.every(facility => facilities.includes(facility));
            
            // Show/hide card based on filters
            if (matchesSearch && matchesPrice && matchesFacilities) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// 3. Booking Form Validation
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateBookingForm()) {
            // Form is valid - proceed to payment
            alert('Form validated successfully! Redirecting to payment...');
            // In a real app, you would submit the form or navigate to payment page
            // window.location.href = 'payment.html';
        }
    });
    
    function validateBookingForm() {
        let isValid = true;
        const requiredFields = bookingForm.querySelectorAll('[required]');
        
        // Validate required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                markInvalid(field);
            } else {
                markValid(field);
            }
        });
        
        // Validate email format
        const emailField = bookingForm.querySelector('#email');
        if (emailField && !isValidEmail(emailField.value)) {
            isValid = false;
            markInvalid(emailField);
        }
        
        // Validate phone number
        const phoneField = bookingForm.querySelector('#phone');
        if (phoneField && !isValidPhone(phoneField.value)) {
            isValid = false;
            markInvalid(phoneField);
        }
        
        // Validate check-in date is in future
        const checkInField = bookingForm.querySelector('#checkIn');
        if (checkInField) {
            const checkInDate = new Date(checkInField.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (checkInDate < today) {
                isValid = false;
                markInvalid(checkInField, 'Check-in date must be in the future');
            }
        }
        
        // Validate terms checkbox
        const termsCheckbox = bookingForm.querySelector('#terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            isValid = false;
            markInvalid(termsCheckbox, 'You must accept the terms and conditions');
        }
        
        return isValid;
    }
    
    function markInvalid(element, message = 'This field is required') {
        const formGroup = element.closest('.form-group') || element.closest('.form-check');
        if (!formGroup) return;
        
        formGroup.classList.add('invalid');
        
        // Add or update error message
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger small mt-1';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    function markValid(element) {
        const formGroup = element.closest('.form-group') || element.closest('.form-check');
        if (!formGroup) return;
        
        formGroup.classList.remove('invalid');
        
        // Remove error message if exists
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function isValidPhone(phone) {
        return /^[\d\s\-()+]{10,}$/.test(phone);
    }
}

// 4. Date Pickers
function initDatePickers() {
    const checkInInput = document.getElementById('checkIn');
    const durationSelect = document.getElementById('duration');
    const checkOutDisplay = document.getElementById('checkOutDisplay');
    
    if (!checkInInput) return;
    
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);
    
    // Calculate and display check-out date when inputs change
    function updateCheckOutDate() {
        if (!checkInInput.value || !durationSelect) return;
        
        const checkInDate = new Date(checkInInput.value);
        const duration = parseInt(durationSelect.value) || 1;
        const checkOutDate = new Date(checkInDate);
        
        checkOutDate.setMonth(checkOutDate.getMonth() + duration);
        
        if (checkOutDisplay) {
            checkOutDisplay.textContent = checkOutDate.toLocaleDateString();
        }
    }
    
    checkInInput.addEventListener('change', updateCheckOutDate);
    if (durationSelect) {
        durationSelect.addEventListener('change', updateCheckOutDate);
    }
    
    // Initialize on load
    updateCheckOutDate();
}

// 5. Price Range Sliders
function initPriceRangeSliders() {
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (!priceMin || !priceMax) return;
    
    // Ensure min doesn't exceed max
    priceMin.addEventListener('input', function() {
        if (parseInt(this.value) > parseInt(priceMax.value)) {
            this.value = priceMax.value;
        }
    });
    
    // Ensure max doesn't go below min
    priceMax.addEventListener('input', function() {
        if (parseInt(this.value) < parseInt(priceMin.value)) {
            this.value = priceMin.value;
        }
    });
}

// 6. Image Carousels/Galleries
function initImageCarousels() {
    // Initialize hostel image carousel if exists
    const hostelCarousel = document.querySelector('#hostelCarousel');
    
    if (hostelCarousel) {
        const carousel = new bootstrap.Carousel(hostelCarousel, {
            interval: 5000,
            ride: 'carousel'
        });
        
        // Add click handlers for thumbnail navigation
        const thumbnails = document.querySelectorAll('.carousel-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                carousel.to(index);
            });
        });
    }
}

// 7. Utility Functions
function debounce(func, wait = 300) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 8. AJAX Functions for PHP Integration
function loadHostels(callback) {
    fetch('api/hostels.php')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error loading hostels:', error));
}

function submitBookingForm(formData, callback) {
    fetch('api/bookings.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => console.error('Error submitting booking:', error));
}
