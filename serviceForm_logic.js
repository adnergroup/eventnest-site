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
    const serviceDetailsMainHeading = document.getElementById('service-details-main-heading'); // New element for dynamic heading

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

    // Container for accordion sections in Step 3
    const accordionContainer = document.getElementById('accordion-container');

    // Loading spinner and text for submit button
    const submitBtn = document.getElementById('submit-btn');
    const submitButtonText = document.getElementById('submit-button-text');
    const submitSpinner = document.getElementById('submit-spinner');


    let currentStep = 1;
    const totalSteps = providerFormStepsConfig.length;

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
                            <p class="text-xs text-gray-500 mt-1">${serviceSubtypesData[category.value] && Object.keys(serviceSubtypesData[category.value].subcategories).length > 0 ? Object.keys(serviceSubtypesData[category.value].subcategories).join(', ') : 'No specific sub-types listed.'}</p>
                        </div>
                    </label>
                </div>
            `;
            serviceCategoriesContainer.insertAdjacentHTML('beforeend', checkboxHtml);
        });
        attachCheckboxCardListeners(); // Re-attach listeners after generating
    }

    // This function now generates accordion sections
    function generateServiceDetailsAccordion(categoryKey, categoryTitle, subcategoriesData) {
        const accordionId = `${categoryKey.toLowerCase().replace(/\s/g, '-')}-accordion`;
        const existingAccordion = document.getElementById(accordionId);
        if (existingAccordion) {
            existingAccordion.remove(); // Remove existing accordion to regenerate
        }

        const accordionHtml = `
            <div id="${accordionId}" class="border rounded-lg overflow-hidden service-details-accordion">
                <div class="accordion-header flex justify-between items-center p-4 cursor-pointer">
                    <h3 class="font-medium text-gray-800">${categoryTitle} Details</h3>
                    <svg class="accordion-icon w-5 h-5 text-gray-600 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                <div class="accordion-content space-y-4">
                    </div>
            </div>
        `;
        accordionContainer.insertAdjacentHTML('beforeend', accordionHtml);

        const contentDiv = document.querySelector(`#${accordionId} .accordion-content`);
        if (!contentDiv) return;

        // Special handling for "Other" category
        if (categoryKey === "Other") {
            const otherServiceInputHtml = `
                <div>
                    <label for="other-service-details-input" class="block text-sm font-medium text-gray-700 mb-1 required-field">Please describe your service in detail</label>
                    <textarea id="other-service-details-input" name="other-service-details-input" rows="4" placeholder="e.g., specialized event security, unique venue sourcing, etc." class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required></textarea>
                </div>
            `;
            contentDiv.insertAdjacentHTML('beforeend', otherServiceInputHtml);
        } else {
            // General logic for other categories
            for (const subTypeGroupTitle in subcategoriesData) {
                const subTypes = subcategoriesData[subTypeGroupTitle];
                const groupId = `${categoryKey.toLowerCase().replace(/\s/g, '-')}-${subTypeGroupTitle.toLowerCase().replace(/\s/g, '-')}`;

                let groupHtml = `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 required-field" data-group-title="${subTypeGroupTitle}">${subTypeGroupTitle} (Select all that apply)</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                `;

                subTypes.forEach(subType => {
                    const id = `${groupId}-${subType.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    groupHtml += `
                        <div class="checkbox-card border rounded-lg p-4 relative cursor-pointer">
                            <input type="checkbox" id="${id}" name="${groupId}-checkboxes[]" value="${subType}" class="hidden">
                            <label for="${id}" class="flex items-start cursor-pointer">
                                <div class="check-icon">✓</div>
                                <span class="text-sm text-gray-700">${subType}</span>
                            </label>
                        </div>
                    `;
                });
                groupHtml += `</div></div>`;
                contentDiv.insertAdjacentHTML('beforeend', groupHtml);
            }

            // Add Catering specific field if applicable
            if (categoryKey === "Catering") {
                const cateringCapacityHtml = `
                    <div>
                        <label for="catering-capacity" class="block text-sm font-medium text-gray-700 mb-1 required-field">Maximum Capacity</label>
                        <select id="catering-capacity" name="catering-capacity" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                            <option value="" disabled selected>Select maximum number of guests you can cater for</option>
                            <option value="up-to-50">Up to 50 guests</option>
                            <option value="51-100">51-100 guests</option>
                            <option value="101-200">101-200 guests</option>
                            <option value="201-500">201-500 guests</option>
                            <option value="500-plus">500+ guests</option>
                        </select>
                    </div>
                `;
                contentDiv.insertAdjacentHTML('afterbegin', cateringCapacityHtml); // Insert at the beginning of catering content
            }
        }
        attachCheckboxCardListeners(); // Re-attach listeners after generating new content
        attachAccordionListeners(); // Attach listener for the new accordion
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
        if (e.target.id === 'other-service-input' || e.target.id === 'other-service-details-input') {
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

        // Handle "Other Service" specific input field visibility in Step 2
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

    function attachAccordionListeners() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.removeEventListener('click', handleAccordionClick); // Prevent duplicates
            header.addEventListener('click', handleAccordionClick);
        });
    }

    function handleAccordionClick() {
        this.classList.toggle('active'); // Toggle header active state
        const content = this.nextElementSibling; // Get the content div
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
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
            // Show spinner, hide text
            submitButtonText.classList.add('hidden');
            submitSpinner.classList.remove('hidden');
            submitBtn.disabled = true; // Disable button during submission

            // Simulate form submission (e.g., send data to a server)
            console.log('Form data submitted:', getFormData());
            
            setTimeout(() => { // Simulate network request
                // Hide spinner, show text
                submitButtonText.classList.remove('hidden');
                submitSpinner.classList.add('hidden');
                submitBtn.disabled = false; // Re-enable button
                successModal.classList.remove('hidden');
            }, 1500); // 1.5 second delay
        }
    }

    function handleCloseModal() {
        successModal.classList.add('hidden');
        window.location.href = 'index.html'; // Redirect to home page
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
                // Add Catering capacity if selected
                if (category === "Catering") {
                    const cateringCapacitySelect = document.getElementById('catering-capacity');
                    if (cateringCapacitySelect && cateringCapacitySelect.value) {
                        data['catering-capacity'] = cateringCapacitySelect.value;
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
            submitBtn.classList.remove('hidden'); // Show submit button on last step
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden'); // Hide submit button on other steps
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
        accordionContainer.innerHTML = ''; // Clear existing accordion content

        const selectedCategories = Array.from(document.querySelectorAll('input[name="service-categories"]:checked')).map(cb => cb.value);

        if (selectedCategories.length === 0) {
            serviceDetailsMainHeading.textContent = "Service Details (No services selected)";
            accordionContainer.innerHTML = `<p class="text-gray-500">Please go back to "Service Categories" and select at least one service to provide details.</p>`;
        } else {
            serviceDetailsMainHeading.textContent = "Service Details";
            selectedCategories.forEach(categoryKey => {
                const categoryData = serviceSubtypesData[categoryKey];
                if (categoryData) {
                    generateServiceDetailsAccordion(categoryKey, categoryData.title, categoryData.subcategories);
                }
            });
        }
        
        // Set required for generic service details (always visible in step 3)
        serviceLocationsSelect.setAttribute('required', 'required');
        priceRangeSelect.setAttribute('required', 'required');
        leadTimeSelect.setAttribute('required', 'required');

        // Ensure at least the first accordion is open for better UX
        const firstAccordionHeader = document.querySelector('.accordion-header');
        if (firstAccordionHeader && !firstAccordionHeader.classList.contains('active')) {
            firstAccordionHeader.click(); // Programmatically click to open
        }
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
                return otherServiceInput.value.trim() || 'Other Service (description missing)';
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
                const otherDetails = otherDetailsInput ? otherDetailsInput.value.trim() : '';
                if (otherDetails) {
                    allServiceDetails.push(`Other Service Description: ${otherDetails}`);
                } else {
                    allServiceDetails.push(`Other Service Description: Not provided`);
                }
            } else {
                const categoryDetailsData = specificServiceOptions[category];
                if (categoryDetailsData) {
                    for (const groupTitle in categoryDetailsData) {
                        // Correctly target checkboxes within the specific service detail accordion section
                        const checkboxes = document.querySelectorAll(`#${category.toLowerCase().replace(/\s/g, '-')}-accordion input[name="${category.toLowerCase().replace(/\s/g, '-')}-${groupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes[]"]:checked`);
                        const selectedOptions = Array.from(checkboxes).map(cb => cb.value);
                        if (selectedOptions.length > 0) {
                            allServiceDetails.push(`${groupTitle} (${category}): ${selectedOptions.join(', ')}`);
                        }
                    }
                }
                // Add Catering capacity if selected
                if (category === "Catering") {
                    const cateringCapacitySelect = document.getElementById('catering-capacity');
                    if (cateringCapacitySelect && cateringCapacitySelect.value) {
                        allServiceDetails.push(`Catering Capacity: ${cateringCapacitySelect.options[cateringCapacitySelect.selectedIndex].text}`);
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
            // Remove previous error styling
            field.classList.remove('border-red-500');
            if (field.parentElement.classList.contains('shake')) {
                field.parentElement.classList.remove('shake');
            }

            if (!field.value.trim() || (field.tagName === 'SELECT' && field.value === '')) {
                isValid = false;
                field.classList.add('border-red-500');
                if (field.tagName === 'SELECT') {
                    field.parentElement.classList.add('shake');
                    setTimeout(() => {
                        field.parentElement.classList.remove('shake');
                    }, 500);
                }
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
            if (otherServiceCheckboxElement && otherServiceCheckboxElement.checked && otherServiceInputDetail && otherServiceInputDetail.value.trim() === '') {
                isValid = false;
                otherServiceInputDetail.classList.add('border-red-500');
            } else if (otherServiceInputDetail) {
                 otherServiceInputDetail.classList.remove('border-red-500');
            }
        }

        // Step 3: Service Details validation
        if (currentStep === 3) {
            const selectedCategories = Array.from(document.querySelectorAll('input[name="service-categories"]:checked')).map(cb => cb.value);

            // Validate fields within each active accordion section
            selectedCategories.forEach(category => {
                const accordionContent = document.querySelector(`#${category.toLowerCase().replace(/\s/g, '-')}-accordion .accordion-content`);
                if (accordionContent) {
                    const accordionRequiredFields = accordionContent.querySelectorAll('[required]');
                    accordionRequiredFields.forEach(field => {
                        field.classList.remove('border-red-500');
                        if (field.parentElement.classList.contains('shake')) {
                            field.parentElement.classList.remove('shake');
                        }

                        if (!field.value.trim() || (field.tagName === 'SELECT' && field.value === '')) {
                            isValid = false;
                            field.classList.add('border-red-500');
                            if (field.tagName === 'SELECT') {
                                field.parentElement.classList.add('shake');
                                setTimeout(() => {
                                    field.parentElement.classList.remove('shake');
                                }, 500);
                            }
                             // Open the accordion if an error is found within it
                            const header = field.closest('.service-details-accordion').querySelector('.accordion-header');
                            if (header && !header.classList.contains('active')) {
                                header.click();
                            }
                        }
                    });

                    // Validate checkbox groups within each accordion
                    if (category !== 'Other') { // 'Other' category uses a textarea, not checkbox groups
                        const categoryDetails = specificServiceOptions[category];
                        if (categoryDetails) {
                            for (const groupTitle in categoryDetails) {
                                const checkboxes = accordionContent.querySelectorAll(`input[name="${category.toLowerCase().replace(/\s/g, '-')}-${groupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes[]"]`);
                                const checkedCheckboxes = accordionContent.querySelectorAll(`input[name="${category.toLowerCase().replace(/\s/g, '-')}-${groupTitle.toLowerCase().replace(/\s/g, '-')}-checkboxes[]"]:checked`);
                                
                                const groupLabel = accordionContent.querySelector(`label[data-group-title="${groupTitle}"]`);

                                if (checkboxes.length > 0 && checkedCheckboxes.length === 0) {
                                    isValid = false;
                                    if (groupLabel) {
                                        groupLabel.classList.add('text-red-500');
                                    }
                                    // Open the accordion if an error is found within it
                                    const header = groupLabel.closest('.service-details-accordion').querySelector('.accordion-header');
                                    if (header && !header.classList.contains('active')) {
                                        header.click();
                                    }
                                } else {
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
                                     currentSection.querySelector('.text-red-500:not(.hidden)');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        return true;
    }

    // Initial form setup
    initializeForm();
    updateForm();
});