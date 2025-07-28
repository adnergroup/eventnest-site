// serviceForm_logic.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('provider-form');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const stepLabel = document.getElementById('step-label');
    const stepCounter = document.getElementById('step-counter');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');
    const serviceError = document.getElementById('service-error');

    // Select dropdowns to be populated dynamically
    const businessTypeSelect = document.getElementById('business-type');
    const yearsOperatingSelect = document.getElementById('years-operating');
    const serviceLocationsSelect = document.getElementById('service-locations');
    const priceRangeSelect = document.getElementById('price-range');
    const leadTimeSelect = document.getElementById('lead-time');

    // Checkbox containers for service categories
    const serviceCategoriesContainer = document.getElementById('service-categories-container');
    const otherServiceCheckbox = document.getElementById('other-service');
    const otherServiceInputContainer = document.getElementById('other-service-input-container');
    const otherServiceInput = document.getElementById('other-service-input');

    // Service details sections
    const cateringDetails = document.getElementById('catering-details');
    const photographyDetails = document.getElementById('photography-details');
    const decorationsDetails = document.getElementById('decorations-details');
    const avDetails = document.getElementById('av-details');
    const transportDetails = document.getElementById('transport-details');
    const cleaningDetails = document.getElementById('cleaning-details');
    const kidsDetails = document.getElementById('kids-details');
    const culturalDetails = document.getElementById('cultural-details');
    const otherServiceDetailsSection = document.getElementById('other-service-details-section');

    let currentStep = 1;
    const totalSteps = providerFormStepsConfig.length;

    // Generic Modal elements (for alerts)
    // These elements are not defined in the HTML, so let's comment them out or add them if needed.
    // const genericModal = document.getElementById('generic-modal');
    // const genericModalContent = document.getElementById('generic-modal-content');

    // --- Initialization Functions ---

    function populateSelect(selectElement, optionsArray) {
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
    }

    function generateServiceCategoryCheckboxes() {
        serviceCategoriesContainer.innerHTML = ''; // Clear existing
        providerServiceCategories.forEach(category => {
            const checkboxHtml = `
                <div class="checkbox-card border rounded-lg p-4 relative cursor-pointer">
                    <input type="checkbox" id="${category.value.toLowerCase().replace(/\s/g, '-')}" name="service-categories" value="${category.value}" class="hidden">
                    <label for="${category.value.toLowerCase().replace(/\s/g, '-')}" class="flex items-start cursor-pointer">
                        <div class="check-icon">✓</div>
                        <div>
                            <div class="flex items-center">
                                <span class="text-lg mr-2">${category.icon}</span>
                                <span class="font-medium">${category.text}</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">${serviceSubtypesData[category.value] ? Object.keys(serviceSubtypesData[category.value].subcategories).join(', ') : ''}</p>
                        </div>
                    </label>
                </div>
            `;
            serviceCategoriesContainer.insertAdjacentHTML('beforeend', checkboxHtml);
        });
        attachCheckboxCardListeners(); // Re-attach listeners after generating
    }

    function populateSpecificServiceCheckboxes(categoryId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container with ID "${containerId}" not found for category "${categoryId}".`);
            return;
        }
        container.innerHTML = ''; // Clear existing
        const categoryData = specificServiceOptions[categoryId];

        if (categoryData) {
            for (const subTypeGroupTitle in categoryData) {
                const subTypes = categoryData[subTypeGroupTitle];
                // Check if group label already exists to avoid duplication if called multiple times
                let groupLabel = container.querySelector(`label[data-group-title="${subTypeGroupTitle}"]`);
                if (!groupLabel) {
                    groupLabel = document.createElement('label');
                    groupLabel.className = 'block text-sm font-medium text-gray-700 mb-2 required-field';
                    groupLabel.textContent = subTypeGroupTitle + ' (Select all that apply)';
                    groupLabel.setAttribute('data-group-title', subTypeGroupTitle); // Custom attribute to identify
                    container.appendChild(groupLabel);
                }


                const gridDiv = document.createElement('div');
                gridDiv.className = 'grid grid-cols-1 md:grid-cols-2 gap-3';

                subTypes.forEach(subType => {
                    const id = `${categoryId}-${subTypeGroupTitle.toLowerCase().replace(/\s/g, '-')}-${subType.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    const checkboxHtml = `
                        <div class="checkbox-card border rounded-lg p-4 relative cursor-pointer">
                            <input type="checkbox" id="${id}" name="${categoryId}-${subTypeGroupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes[]" value="${subType}" class="hidden">
                            <label for="${id}" class="flex items-start cursor-pointer">
                                <div class="check-icon">✓</div>
                                <span class="text-sm text-gray-700">${subType}</span>
                            </label>
                        </div>
                    `;
                    gridDiv.insertAdjacentHTML('beforeend', checkboxHtml);
                });
                container.appendChild(gridDiv);
            }
        }
        attachCheckboxCardListeners(); // Re-attach listeners
    }

    function initializeForm() {
        populateSelect(businessTypeSelect, businessTypes);
        populateSelect(yearsOperatingSelect, yearsOperating);
        populateSelect(serviceLocationsSelect, locations); // Use the common locations data
        populateSelect(priceRangeSelect, priceRanges);
        populateSelect(leadTimeSelect, leadTimes);
        generateServiceCategoryCheckboxes(); // Generate initial service categories
    }

    // --- Event Handlers ---

    function attachCheckboxCardListeners() {
        document.querySelectorAll('.checkbox-card').forEach(card => {
            // Remove existing listener to prevent duplicates
            card.removeEventListener('click', handleCheckboxCardClick);
            // Add new listener
            card.addEventListener('click', handleCheckboxCardClick);
        });
    }

    function handleCheckboxCardClick(e) {
        const checkbox = this.querySelector('input[type="checkbox"]');
        
        // Prevent toggling if clicking directly on the input field inside "Other Service"
        if (e.target.id === 'other-service-input') {
            return;
        }

        // Toggle the checkbox state
        checkbox.checked = !checkbox.checked;

        // Apply/remove 'selected' class based on checkbox state
        if (checkbox.checked) {
            this.classList.add('selected');
        } else {
            this.classList.remove('selected');
        }

        // Handle "Other Service" specific input field visibility
        if (checkbox.id === 'other-service') {
            if (checkbox.checked) {
                otherServiceInputContainer.classList.remove('hidden');
                otherServiceInput.setAttribute('required', 'required');
            } else {
                otherServiceInputContainer.classList.add('hidden');
                otherServiceInput.removeAttribute('required');
                otherServiceInput.value = ''; // Clear value when unchecked
            }
        }

        // Hide service error if any service is selected
        const anyServiceSelected = document.querySelector('input[name="service-categories"]:checked');
        if (anyServiceSelected) {
            serviceError.classList.add('hidden');
        }
        updateSummary(); // Update summary on any checkbox change
    }

    // Handle input changes for real-time validation feedback and summary updates
    form.addEventListener('input', function(event) {
        if (event.target.classList.contains('border-red-500')) {
            event.target.classList.remove('border-red-500');
        }
        updateSummary();
    });

    // Helper function to handle button clicks and prevent default
    function handleButtonClick(event, action) {
        event.preventDefault(); // Prevent form submission
        action();
    }

    nextBtn.addEventListener('click', (event) => handleButtonClick(event, handleNextButtonClick));
    prevBtn.addEventListener('click', (event) => handleButtonClick(event, handlePrevButtonClick));
    form.addEventListener('submit', handleSubmit);
    closeModal.addEventListener('click', handleCloseModal);

    // --- Core Functions ---

    function handleNextButtonClick() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateForm();
            }
        }
    }

    function handlePrevButtonClick() {
        if (currentStep > 1) {
            currentStep--;
            updateForm();
        }
    }

    function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateCurrentStep()) {
            // Simulate form submission (e.g., send data to a server)
            console.log('Form data submitted:', getFormData());
            
            // Show success modal
            successModal.classList.remove('hidden');
            // Optionally, clear the form here: form.reset();
        }
    }

    function handleCloseModal() {
        successModal.classList.add('hidden');
        // Redirect to home page or reset form
        window.location.href = 'index.html'; // Adjust as needed
    }

    function getFormData() {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            // Handle multiple selections for checkboxes and multi-selects
            if (key.endsWith('[]')) {
                const cleanKey = key.slice(0, -2); // Remove '[]'
                if (!data[cleanKey]) {
                    data[cleanKey] = [];
                }
                data[cleanKey].push(value);
            } else {
                data[key] = value;
            }
        }

        // Add selected service categories and their sub-options
        const selectedServiceCategories = Array.from(document.querySelectorAll('input[name="service-categories"]:checked')).map(checkbox => {
            if (checkbox.id === 'other-service') {
                return otherServiceInput.value.trim() || 'Other Service';
            }
            return checkbox.value;
        });
        data['selected-service-categories'] = selectedServiceCategories;

        selectedServiceCategories.forEach(category => {
            if (category === 'Other') {
                const otherDetailsInput = document.getElementById('other-service-details-input');
                if (otherDetailsInput) {
                    data['other-service-description'] = otherDetailsInput.value;
                }
            } else {
                const categoryDetails = specificServiceOptions[category];
                if (categoryDetails) {
                    for (const groupTitle in categoryDetails) {
                        const checkboxes = document.querySelectorAll(`input[name="${category.toLowerCase().replace(/\s/g, '-')}-${groupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes[]"]:checked`);
                        const selectedOptions = Array.from(checkboxes).map(cb => cb.value);
                        if (selectedOptions.length > 0) {
                            data[`${category.toLowerCase().replace(/\s/g, '-')}-${groupTitle.toLowerCase().replace(/\s/g, '-')}`] = selectedOptions;
                        }
                    }
                }
            }
        });

        // Handle multi-select for service locations
        data['service-locations'] = Array.from(serviceLocationsSelect.selectedOptions).map(option => option.value);

        return data;
    }

    function updateForm() {
        // Hide all sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show current section
        document.getElementById(providerFormStepsConfig[currentStep - 1].id).classList.add('active');
        
        // Update progress bar
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update step indicators
        stepCounter.textContent = `${currentStep}/${totalSteps}`;
        stepLabel.textContent = `Step ${currentStep} of ${totalSteps}: ${providerFormStepsConfig[currentStep-1].label}`;
        
        // Show/hide navigation buttons
        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
        
        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
            // Ensure submit button is visible and styled correctly on last step
            const submitButton = document.getElementById('submit-btn');
            if (submitButton) {
                submitButton.classList.remove('hidden'); // Make sure it's visible if hidden by other logic
            }
        } else {
            nextBtn.classList.remove('hidden');
            const submitButton = document.getElementById('submit-btn');
            if (submitButton) {
                // Optionally hide submit button on other steps if it's placed within the navigation buttons div
                // submitButton.classList.add('hidden');
            }
        }
        
        // Specific logic for Step 3 (Service Details)
        if (currentStep === 3) {
            updateServiceDetailsSections();
        }

        // Update summary on the last step
        if (currentStep === totalSteps) {
            updateSummary();
        }
    }

    function updateServiceDetailsSections() {
        // Hide all specific service details sections first
        document.querySelectorAll('.service-details').forEach(section => {
            section.classList.add('hidden');
            // Also remove required attributes from all fields within these sections
            section.querySelectorAll('[required]').forEach(field => field.removeAttribute('required'));
        });

        // Get all selected service categories
        const selectedCategories = Array.from(document.querySelectorAll('input[name="service-categories"]:checked')).map(cb => cb.value);

        // Show relevant service details sections and set required fields
        selectedCategories.forEach(category => {
            const detailsSection = document.getElementById(`${category.toLowerCase().replace(/\s/g, '-')}-details`);
            if (detailsSection) {
                detailsSection.classList.remove('hidden');
                // Dynamically populate and set required for sub-options within these sections
                if (specificServiceOptions[category]) {
                    for (const subTypeGroupTitle in specificServiceOptions[category]) {
                        const containerId = `${category.toLowerCase().replace(/\s/g, '-')}-${subTypeGroupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes`;
                        populateSpecificServiceCheckboxes(category, containerId);
                    }
                }
            }
        });
        
        // Handle "Other" service specifically
        const otherServiceChecked = document.getElementById('other-service') && document.getElementById('other-service').checked;
        if (otherServiceChecked) {
            otherServiceDetailsSection.classList.remove('hidden');
            const otherServiceDetailsInput = document.getElementById('other-service-details-input');
            if (otherServiceDetailsInput) {
                otherServiceDetailsInput.setAttribute('required', 'required');
            }
        }


        // Set required for generic service details (always visible in step 3)
        serviceLocationsSelect.setAttribute('required', 'required');
        priceRangeSelect.setAttribute('required', 'required');
        leadTimeSelect.setAttribute('required', 'required');
    }

    function updateSummary() {
        document.getElementById('summary-business-name').textContent = document.getElementById('business-name').value || 'Not specified';
        
        const businessTypeOption = businessTypeSelect.options[businessTypeSelect.selectedIndex];
        document.getElementById('summary-business-type').textContent = businessTypeOption ? businessTypeOption.text : 'Not specified';
        
        const yearsOperatingOption = yearsOperatingSelect.options[yearsOperatingSelect.selectedIndex];
        document.getElementById('summary-years').textContent = yearsOperatingOption ? yearsOperatingOption.text : 'Not specified';
        
        const selectedLocations = Array.from(serviceLocationsSelect.selectedOptions).map(option => option.text);
        document.getElementById('summary-locations').textContent = selectedLocations.length > 0 ? selectedLocations.join(', ') : 'Not specified';
        
        const selectedServiceCategories = Array.from(document.querySelectorAll('input[name="service-categories"]:checked')).map(checkbox => {
            if (checkbox.id === 'other-service') {
                return otherServiceInput.value.trim() || 'Other Service';
            }
            return checkbox.value;
        });
        document.getElementById('summary-services').textContent = selectedServiceCategories.length > 0 ? selectedServiceCategories.join(', ') : 'None selected';

        // Collect specific service details
        let allServiceDetails = [];
        const selectedMainCategories = Array.from(document.querySelectorAll('input[name="service-categories"]:checked')).map(cb => cb.value);

        selectedMainCategories.forEach(category => {
            if (category === 'Other') {
                const otherDetailsInput = document.getElementById('other-service-details-input');
                const otherDetails = otherDetailsInput ? otherDetailsInput.value : ''; // Check if element exists
                if (otherDetails) {
                    allServiceDetails.push(`Other: ${otherDetails}`);
                }
            } else {
                const categoryDetails = specificServiceOptions[category];
                if (categoryDetails) {
                    for (const groupTitle in categoryDetails) {
                        // Correctly target checkboxes within the specific service detail section
                        const checkboxes = document.querySelectorAll(`#${category.toLowerCase().replace(/\s/g, '-')}-details input[name="${category.toLowerCase().replace(/\s/g, '-')}-${groupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes[]"]:checked`);
                        const selectedOptions = Array.from(checkboxes).map(cb => cb.value);
                        if (selectedOptions.length > 0) {
                            allServiceDetails.push(`${groupTitle} (${category}): ${selectedOptions.join(', ')}`);
                        }
                    }
                }
            }
        });

        const priceRangeOption = priceRangeSelect.options[priceRangeSelect.selectedIndex];
        if (priceRangeOption && priceRangeOption.value) {
            allServiceDetails.push(`Price Range: ${priceRangeOption.text}`);
        }
        const leadTimeOption = leadTimeSelect.options[leadTimeSelect.selectedIndex];
        if (leadTimeOption && leadTimeOption.value) {
            allServiceDetails.push(`Lead Time: ${leadTimeOption.text}`);
        }

        document.getElementById('summary-service-details').textContent = allServiceDetails.length > 0 ? allServiceDetails.join('; ') : 'No specific details provided.';


        document.getElementById('summary-contact-name').textContent = document.getElementById('contact-name').value || 'Not specified';
        document.getElementById('summary-email').textContent = document.getElementById('business-email').value || 'Not specified';
        document.getElementById('summary-phone').textContent = document.getElementById('business-phone').value || 'Not specified';
        document.getElementById('summary-address').textContent = document.getElementById('business-address').value || 'Not specified';
    }

    function validateCurrentStep() {
        const currentSection = document.getElementById(providerFormStepsConfig[currentStep - 1].id);
        const requiredFields = currentSection.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim() || (field.tagName === 'SELECT' && field.value === '')) { // Added check for empty select
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
        
        // Step 2: Service Categories validation
        if (currentStep === 2) {
            const anyServiceSelected = document.querySelector('input[name="service-categories"]:checked');
            if (!anyServiceSelected) {
                isValid = false;
                serviceError.classList.remove('hidden');
            } else {
                serviceError.classList.add('hidden');
            }
            
            // Validate "Other" service input if selected
            const otherServiceCheckboxElement = document.getElementById('other-service');
            const otherServiceInputDetail = document.getElementById('other-service-input'); // This is the input in step 2
            if (otherServiceCheckboxElement && otherServiceCheckboxElement.checked && otherServiceInputDetail.value.trim() === '') {
                isValid = false;
                otherServiceInputDetail.classList.add('border-red-500');
            } else if (otherServiceInputDetail) { // Ensure element exists before trying to remove class
                 otherServiceInputDetail.classList.remove('border-red-500');
            }
        }

        // Step 3: Service Details validation
        if (currentStep === 3) {
            const selectedCategories = Array.from(document.querySelectorAll('input[name="service-categories"]:checked')).map(cb => cb.value);
            
            // Check if generic service details (locations, price, lead time) are filled
            const genericRequiredFields = [serviceLocationsSelect, priceRangeSelect, leadTimeSelect];
            genericRequiredFields.forEach(field => {
                if (!field.value.trim() || (field.tagName === 'SELECT' && field.value === '')) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            selectedCategories.forEach(category => {
                if (category === 'Other') {
                    const otherServiceDetailsInput = document.getElementById('other-service-details-input'); // This is the input in step 3
                    if (otherServiceDetailsInput && otherServiceDetailsInput.value.trim() === '') {
                        isValid = false;
                        otherServiceDetailsInput.classList.add('border-red-500');
                    } else if (otherServiceDetailsInput) {
                        otherServiceDetailsInput.classList.remove('border-red-500');
                    }
                } else {
                    const categoryDetails = specificServiceOptions[category];
                    if (categoryDetails) {
                        for (const groupTitle in categoryDetails) {
                            // Target checkboxes within the specific category's section in step 3
                            const checkboxes = document.querySelectorAll(`#${category.toLowerCase().replace(/\s/g, '-')}-details input[name="${category.toLowerCase().replace(/\s/g, '-')}-${groupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes[]"]`);
                            const checkedCheckboxes = document.querySelectorAll(`#${category.toLowerCase().replace(/\s/g, '-')}-details input[name="${category.toLowerCase().replace(/\s/g, '-')}-${groupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes[]"]:checked`);
                            
                            // Only validate if there are checkboxes for this group and none are checked
                            if (checkboxes.length > 0 && checkedCheckboxes.length === 0) {
                                isValid = false;
                                // Highlight the label of the group if no checkbox is selected
                                // Find the parent div of the checkboxes and then the label within it
                                const containerDiv = checkboxes.length > 0 ? checkboxes[0].closest('.space-y-4') : null;
                                if (containerDiv) {
                                    const groupLabel = containerDiv.querySelector(`label[data-group-title="${groupTitle}"]`);
                                    if (groupLabel) {
                                        groupLabel.classList.add('text-red-500');
                                    }
                                }
                            } else {
                                // Remove error styling if validation passes
                                const containerDiv = checkboxes.length > 0 ? checkboxes[0].closest('.space-y-4') : null;
                                if (containerDiv) {
                                    const groupLabel = containerDiv.querySelector(`label[data-group-title="${groupTitle}"]`);
                                    if (groupLabel) {
                                        groupLabel.classList.remove('text-red-500');
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        
        if (!isValid) {
            const firstInvalidField = currentSection.querySelector('.border-red-500') || 
                                     currentSection.querySelector('.text-red-500:not(.hidden)'); // Check for visible error messages
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        return true;
    }

    // This showModal function seems to be for a generic alert, but genericModal is not defined in the HTML.
    // I'm commenting it out to avoid errors. If a generic modal is needed, it must be added to the HTML.
    /*
    function showModal(contentHtml) {
        genericModalContent.innerHTML = contentHtml;
        genericModal.classList.remove('hidden');

        const closeGenericModalBtn = genericModal.querySelector('#close-alert-modal');
        if (closeGenericModalBtn) {
            closeGenericModalBtn.addEventListener('click', () => {
                genericModal.classList.add('hidden');
            });
        }
    }
    */

    // Initial form setup
    initializeForm();
    updateForm();
});