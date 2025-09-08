// eventForm_logic.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('event-form');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const stepLabel = document.getElementById('step-label');
    const stepCounter = document.getElementById('step-counter');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');

    // Select dropdowns to be populated dynamically
    const locationSelect = document.getElementById('location');
    const eventTypeSelect = document.getElementById('event-type');
    const serviceCategorySelect = document.getElementById('service-category');
    const budgetSelect = document.getElementById('budget');

    const otherLocationContainer = document.getElementById('other-location-container');
    const deliveryOptions = document.querySelectorAll('.delivery-option');
    const deliveryAddressContainer = document.getElementById('delivery-address-container');
    const eventDateInput = document.getElementById('event-date');
    const dateError = document.getElementById('date-error');
    const subcategoryError = document.getElementById('subcategory-error');
    const submitBtn = document.getElementById('submit-btn');

    // Subcategory option containers
    const cateringOptions = document.getElementById('catering-options');
    const photographyOptions = document.getElementById('photography-options');
    const decorationsOptions = document.getElementById('decorations-options');
    const avOptions = document.getElementById('av-options');
    const transportOptions = document.getElementById('transport-options');
    const cleaningOptions = document.getElementById('cleaning-options');
    const kidsOptions = document.getElementById('kids-options');
    const culturalOptions = document.getElementById('cultural-options');
    const otherServiceOptions = document.getElementById('other-service-options');
    const subcategoryOptionsContainer = document.getElementById('subcategory-options-container');
    
    let currentStep = 1;
    const totalSteps = formStepsConfig.length; // Get total steps from external config

    // --- Initialization Functions ---

    function populateSelect(selectElement, optionsArray, defaultValue = null) {
        selectElement.innerHTML = ''; // Clear existing options
        optionsArray.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.text;
            if (optionData.disabled) {
                option.disabled = true;
            }
            if (optionData.selected) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
        if (defaultValue) {
            selectElement.value = defaultValue;
        }
    }

    function initializeFormElements() {
        // Populate dropdowns from data.js
        populateSelect(locationSelect, locations, "Wellington");
        populateSelect(eventTypeSelect, eventTypes, "Birthday");
        populateSelect(serviceCategorySelect, serviceCategories, "Catering");
        populateSelect(budgetSelect, budgetRanges);

        // Set minimum date to today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayFormatted = `${yyyy}-${mm}-${dd}`;
        eventDateInput.setAttribute('min', todayFormatted);
        
        // Initialize the selected service in localStorage
        localStorage.setItem('selectedService', serviceCategorySelect.value);
    }

    // --- Event Listeners ---
    
    locationSelect.addEventListener('change', handleLocationChange);
    eventTypeSelect.addEventListener('change', updateSummary); // Add listener for eventTypeSelect
    serviceCategorySelect.addEventListener('change', handleServiceCategoryChange);
    eventDateInput.addEventListener('change', handleEventDateChange);
    budgetSelect.addEventListener('change', updateSummary); // Add listener for budgetSelect
    form.addEventListener('input', handleFormInput); // For real-time summary updates
    deliveryOptions.forEach(option => {
        option.addEventListener('click', handleDeliveryOptionClick);
    });
    nextBtn.addEventListener('click', handleNextButtonClick);
    prevBtn.addEventListener('click', handlePrevButtonClick);
    form.addEventListener('submit', handleFormSubmit);
    closeModal.addEventListener('click', handleCloseModalClick);

    // Initial form setup
    initializeFormElements(); // Call initialization
    updateForm();
    updateSubcategoryOptions(); // Explicitly call on load to ensure correct subcategory display
    attachCheckboxListeners(); // Attach listeners for initial checkboxes

    // --- Handlers ---

    function handleLocationChange() {
        const otherLocationInput = document.getElementById('other-location');
        if (this.value === 'Other') {
            otherLocationContainer.classList.remove('hidden');
            otherLocationInput.setAttribute('required', 'required');
        } else {
            otherLocationContainer.classList.add('hidden');
            otherLocationInput.removeAttribute('required');
            otherLocationInput.value = ''; // Clear value if not 'Other'
        }
        updateSummary();
    }

    function handleServiceCategoryChange() {
        localStorage.setItem('selectedService', this.value);
        updateSubcategoryOptions();
        updateSummary();
    }

    function handleEventDateChange() {
        validateEventDate();
        updateSummary();
    }

    function handleFormInput(event) {
        // Remove error styling on input for most fields
        if (event.target.classList.contains('border-red-500')) {
            event.target.classList.remove('border-red-500');
        }
        // Specific handling for subcategory error when checkboxes are interacted with
        if (event.target.type === 'checkbox' && event.target.name.includes('Subservices')) {
            const currentSubcategoryContainer = document.getElementById(`${localStorage.getItem('selectedService').toLowerCase()}-options`);
            if (currentSubcategoryContainer && subcategoryOptionsContainer.classList.contains('border-red-500')) {
                const checkedSubcategories = currentSubcategoryContainer.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedSubcategories.length > 0) {
                    subcategoryOptionsContainer.classList.remove('border-red-500');
                    subcategoryError.style.display = 'none';
                }
            }
        }
        updateSummary();
    }

    function handleDeliveryOptionClick() {
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;
        
        deliveryOptions.forEach(opt => {
            opt.classList.remove('primary-border', 'primary-light-bg');
            opt.classList.remove('border-red-500'); // Remove error border on selection
        });
        this.classList.add('primary-border', 'primary-light-bg');
        
        const streetAddressInput = document.getElementById('street-address');
        const suburbInput = document.getElementById('suburb');
        const cityInput = document.getElementById('city');
        const postcodeInput = document.getElementById('postcode');

        if (radio.value === 'delivery') {
            deliveryAddressContainer.classList.remove('hidden');
            streetAddressInput.setAttribute('required', 'required');
            suburbInput.setAttribute('required', 'required');
            cityInput.setAttribute('required', 'required');
            postcodeInput.setAttribute('required', 'required');
        } else {
            deliveryAddressContainer.classList.add('hidden');
            streetAddressInput.removeAttribute('required');
            suburbInput.removeAttribute('required');
            cityInput.removeAttribute('required');
            postcodeInput.removeAttribute('required');
            streetAddressInput.value = '';
            suburbInput.value = '';
            cityInput.value = '';
            postcodeInput.value = '';
        }
        updateSummary();
    }

    function handleNextButtonClick() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateForm();
                document.querySelector('.form-section.active').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    function handlePrevButtonClick() {
        if (currentStep > 1) {
            currentStep--;
            updateForm();
            document.querySelector('.form-section.active').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!document.getElementById('terms').checked) {
            const modalContent = `
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Terms and Conditions Required</h3>
                    <p class="text-gray-600 mb-6">Please agree to the Terms of Service and Privacy Policy to proceed.</p>
                    <button id="close-alert-modal" class="w-full primary-bg hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                        OK
                    </button>
                </div>
            `;
            showModal(modalContent);
            return;
        }
        
        submitBtn.innerHTML = '<div class="spinner"></div> Submitting...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = 'Get Matched with Service Providers <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
            submitBtn.disabled = false;
            successModal.classList.remove('hidden');
        }, 2000);
    }

    function handleCloseModalClick() {
        successModal.classList.add('hidden');
        form.reset();
        currentStep = 1;
        updateForm();
    }

    // --- Core Functions ---

    function validateEventDate() {
        const selectedDate = new Date(eventDateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        if (selectedDate < today) {
            eventDateInput.classList.add('border-red-500');
            dateError.style.display = 'block';
            return false;
        } else {
            eventDateInput.classList.remove('border-red-500');
            dateError.style.display = 'none';
            return true;
        }
    }

    function updateSubcategoryOptions() {
        const selectedService = localStorage.getItem('selectedService');
        
        // Hide all subcategory option containers
        [cateringOptions, photographyOptions, decorationsOptions, avOptions,
         transportOptions, cleaningOptions, kidsOptions, culturalOptions,
         otherServiceOptions].forEach(container => {
            container.classList.add('hidden');
        });
        
        // Remove required attribute from all subcategory fields
        document.querySelectorAll('#subcategory-options-container input, #subcategory-options-container textarea').forEach(field => {
            field.removeAttribute('required');
            field.classList.remove('border-red-500'); // Remove error styling
        });
        subcategoryError.style.display = 'none'; // Hide subcategory error
        
        // Show appropriate subcategory options based on selection and set required for specific fields
        let currentSubcategoryContainer = null;
        if (selectedService === 'Catering') {
            currentSubcategoryContainer = cateringOptions;
        } else if (selectedService === 'Photography') {
            currentSubcategoryContainer = photographyOptions;
        } else if (selectedService === 'Decorations') {
            currentSubcategoryContainer = decorationsOptions;
        } else if (selectedService === 'AV') {
            currentSubcategoryContainer = avOptions;
        } else if (selectedService === 'Transport') {
            currentSubcategoryContainer = transportOptions;
        } else if (selectedService === 'Cleaning') {
            currentSubcategoryContainer = cleaningOptions;
        } else if (selectedService === 'Kids') {
            currentSubcategoryContainer = kidsOptions;
        } else if (selectedService === 'Cultural') {
            currentSubcategoryContainer = culturalOptions;
        } else if (selectedService === 'Other') {
            currentSubcategoryContainer = otherServiceOptions;
            document.getElementById('other-service-details').setAttribute('required', 'required');
        }

        if (currentSubcategoryContainer) {
            currentSubcategoryContainer.classList.remove('hidden');
        }
        
        attachCheckboxListeners();
    }

    function attachCheckboxListeners() {
        document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(checkbox => {
            checkbox.removeEventListener('change', handleCheckboxVisualChange);
            checkbox.addEventListener('change', handleCheckboxVisualChange);
        });
    }

    function handleCheckboxVisualChange() {
        const container = this.closest('.checkbox-container');
        if (this.checked) {
            container.classList.add('selected');
        } else {
            container.classList.remove('selected');
        }
        updateSummary(); // Real-time summary update
    }
            
    function updateForm() {
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(formStepsConfig[currentStep - 1].id).classList.add('active');
        
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        
        stepCounter.textContent = `${currentStep}/${totalSteps}`;
        stepLabel.textContent = `Step ${currentStep} of ${totalSteps}: ${formStepsConfig[currentStep-1].label}`;
        
        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
        
        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
        
        if (currentStep === totalSteps) {
            updateSummary();
        }
    }
            
    function getSubcategoryInfo() {
        const selectedService = localStorage.getItem('selectedService');
        let subcategoryValues = [];
        let subcategoryLabel = '';
        let containerId = '';

        if (selectedService === 'Catering') {
            containerId = 'catering-options';
            subcategoryLabel = 'Catering Services & Cuisine';
        } else if (selectedService === 'Photography') {
            containerId = 'photography-options';
            subcategoryLabel = 'Photography Styles';
        } else if (selectedService === 'Decorations') {
            containerId = 'decorations-options';
            subcategoryLabel = 'Decoration Style';
        } else if (selectedService === 'AV') {
            containerId = 'av-options';
            subcategoryLabel = 'AV Requirements';
        } else if (selectedService === 'Transport') {
            containerId = 'transport-options';
            subcategoryLabel = 'Transport Type';
        } else if (selectedService === 'Cleaning') {
            containerId = 'cleaning-options';
            subcategoryLabel = 'Cleaning Service';
        } else if (selectedService === 'Kids') {
            containerId = 'kids-options';
            subcategoryLabel = 'Kids Entertainment';
        } else if (selectedService === 'Cultural') {
            containerId = 'cultural-options';
            subcategoryLabel = 'Cultural Service';
        } else if (selectedService === 'Other') {
            const textarea = document.getElementById('other-service-details');
            if (textarea.value) {
                subcategoryValues.push(textarea.value.substring(0, 50) + (textarea.value.length > 50 ? '...' : ''));
                subcategoryLabel = 'Service Details';
            }
            return { value: subcategoryValues.join(', '), label: subcategoryLabel };
        }

        if (containerId) {
            const checkedCheckboxes = document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`);
            checkedCheckboxes.forEach(checkbox => {
                subcategoryValues.push(checkbox.value);
            });
        }
        
        return { value: subcategoryValues.join(', '), label: subcategoryLabel };
    }
            
    function updateSummary() {
        // Handle location display (including "Other" option)
        if (locationSelect.value === 'Other' && document.getElementById('other-location').value) {
            document.getElementById('summary-location').textContent = document.getElementById('other-location').value;
        } else {
            document.getElementById('summary-location').textContent = locationSelect.value || 'Not specified';
        }
        
        const eventDate = document.getElementById('event-date').value;
        document.getElementById('summary-date').textContent = eventDate ? new Date(eventDate).toLocaleDateString() : 'Not specified';
        
        document.getElementById('summary-type').textContent = eventTypeSelect.value || 'Not specified';
        
        document.getElementById('summary-service').textContent = serviceCategorySelect.options[serviceCategorySelect.selectedIndex].text || 'Not specified';
        
        const guests = document.getElementById('guests').value;
        document.getElementById('summary-guests').textContent = guests ? guests : 'Not specified';
        
        document.getElementById('summary-budget').textContent = budgetSelect.options[budgetSelect.selectedIndex].text || 'Not specified';
        
        const eventOverview = document.getElementById('event-overview').value;
        document.getElementById('summary-overview').textContent = eventOverview || 'Not specified';
        
        const subcategoryInfo = getSubcategoryInfo();
        if (subcategoryInfo.value) {
            document.getElementById('summary-subcategory-label').textContent = subcategoryInfo.label;
            document.getElementById('summary-subcategory').textContent = subcategoryInfo.value;
            document.getElementById('summary-subcategory-container').classList.remove('hidden');
        } else {
            document.getElementById('summary-subcategory-container').classList.add('hidden');
        }
        
        const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked');
        if (deliveryMethod) {
            document.getElementById('summary-delivery').textContent = deliveryMethod.value === 'delivery' ? 'Delivery to Location' : 'Pickup';
            
            if (deliveryMethod.value === 'delivery') {
                const street = document.getElementById('street-address').value;
                const suburb = document.getElementById('suburb').value;
                const city = document.getElementById('city').value;
                const postcode = document.getElementById('postcode').value;
                
                if (street || suburb || city || postcode) {
                    const addressParts = [];
                    if (street) addressParts.push(street);
                    if (suburb) addressParts.push(suburb);
                    if (city) addressParts.push(city);
                    if (postcode) addressParts.push(postcode);
                    
                    document.getElementById('summary-address').textContent = addressParts.join(', ');
                    document.getElementById('summary-address-container').classList.remove('hidden');
                } else {
                    document.getElementById('summary-address-container').classList.add('hidden');
                }
            } else {
                document.getElementById('summary-address-container').classList.add('hidden');
            }
        } else {
            document.getElementById('summary-delivery').textContent = 'Not specified';
            document.getElementById('summary-address-container').classList.add('hidden');
        }

        // Update organiser info summary
        document.getElementById('summary-name').textContent = document.getElementById('name').value || 'Not specified';
        document.getElementById('summary-email').textContent = document.getElementById('email').value || 'Not specified';
        document.getElementById('summary-mobile').textContent = document.getElementById('mobile').value || 'Not specified';
    }
            
    function validateCurrentStep() {
        const currentSection = document.getElementById(formStepsConfig[currentStep - 1].id);
        const requiredFields = currentSection.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                if (field.tagName === 'SELECT') {
                    field.parentElement.classList.add('shake');
                    setTimeout(() => {
                        field.parentElement.classList.remove('shake');
                    }, 500);
                }
            } else {
                field.classList.remove('border-red-500');
            }
        });
        
        // Specific validation for step 1
        if (currentStep === 1) {
            if (locationSelect.value === 'Other' && document.getElementById('other-location').value.trim() === '') {
                isValid = false;
                document.getElementById('other-location').classList.add('border-red-500');
            }
            if (eventDateInput.value && !validateEventDate()) {
                isValid = false;
            }

            const selectedService = localStorage.getItem('selectedService');
            let subcategoryContainer = null;

            if (selectedService === 'Catering') {
                subcategoryContainer = cateringOptions;
            } else if (selectedService === 'Photography') {
                subcategoryContainer = photographyOptions;
            } else if (selectedService === 'Decorations') {
                subcategoryContainer = decorationsOptions;
            } else if (selectedService === 'AV') {
                subcategoryContainer = avOptions;
            } else if (selectedService === 'Transport') {
                subcategoryContainer = transportOptions;
            } else if (selectedService === 'Cleaning') {
                subcategoryContainer = cleaningOptions;
            } else if (selectedService === 'Kids') {
                subcategoryContainer = kidsOptions;
            } else if (selectedService === 'Cultural') {
                subcategoryContainer = culturalOptions;
            }

            if (subcategoryContainer && !subcategoryContainer.classList.contains('hidden')) {
                const checkedSubcategories = subcategoryContainer.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedSubcategories.length === 0 && selectedService !== 'Other') { // 'Other' service has a textarea, not checkboxes
                    isValid = false;
                    subcategoryOptionsContainer.classList.add('border-red-500');
                    subcategoryError.style.display = 'block';
                } else {
                    subcategoryOptionsContainer.classList.remove('border-red-500');
                    subcategoryError.style.display = 'none';
                }
            }
        }
        
        // Specific validation for step 3 (Service Delivery)
        if (currentStep === 3) {
            const deliveryMethodChecked = document.querySelector('input[name="delivery-method"]:checked');
            if (!deliveryMethodChecked) {
                isValid = false;
                deliveryOptions.forEach(option => {
                    option.classList.add('border-red-500');
                });
            } else {
                deliveryOptions.forEach(option => {
                    option.classList.remove('border-red-500');
                });
            }

            if (deliveryMethodChecked && deliveryMethodChecked.value === 'delivery') {
                const addressFields = [
                    document.getElementById('street-address'),
                    document.getElementById('suburb'),
                    document.getElementById('city'),
                    document.getElementById('postcode')
                ];
                
                addressFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('border-red-500');
                    }
                });
                
                const postcode = document.getElementById('postcode');
                if (postcode.value && !/^\d{4}$/.test(postcode.value)) {
                    isValid = false;
                    postcode.classList.add('border-red-500');
                }
            }
        }
        
        if (!isValid) {
            const firstInvalidField = currentSection.querySelector('.border-red-500');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        return true;
    }

    function showModal(contentHtml) {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'generic-modal';
        modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modalOverlay.innerHTML = `
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                ${contentHtml}
            </div>
        `;
        document.body.appendChild(modalOverlay);

        const closeGenericModalBtn = document.getElementById('close-alert-modal');
        if (closeGenericModalBtn) {
            closeGenericModalBtn.addEventListener('click', () => {
                modalOverlay.remove();
            });
        }
    }
});
