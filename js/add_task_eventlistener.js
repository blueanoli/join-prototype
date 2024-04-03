/** Handles Click Event on a contact, toggling selection state and updating UI */
function handleContactClick(event, contact, optionDiv) {
    event.stopImmediatePropagation();
    let isCheckboxClicked = event.target.classList.contains('checkbox-icon');
    let checkbox = isCheckboxClicked ? event.target : optionDiv.querySelector('.checkbox-icon');

    if (!selectedContacts[contact]) {
        checkbox.src = "assets/img/checkboxchecked_white.svg";
        addAssignedContact(contact);
        selectedContacts[contact] = true;
        optionDiv.style.backgroundColor = "var(--dark-blue)"; 
        optionDiv.classList.add("selected");
    } else {
        checkbox.src = "assets/img/checkboxempty.svg";
        removeAssignedContact(contact);
        selectedContacts[contact] = false;
        optionDiv.style.backgroundColor = ""; 
        optionDiv.classList.remove("selected");
    }
}

/** Handles click event on category and updates selected category */
function handleCategoryClick(event, category, selectedDiv, dropdown, itemsDiv) {
    event.stopPropagation();

    selectedDiv.textContent = category;
    dropdown.setAttribute('data-value', category);
    resetFieldStyle(dropdown);
    hideCategoryError();

    itemsDiv.classList.add('select-hide');
    changeDropdownImg('choose-category', 'close');
}

/** Sets EventListener to prevent form from being submitted on pressing Enter */
function setupFormEventListeners() {
    document.getElementById('add-task').addEventListener('submit', function(event) {
        event.preventDefault();
    });

    document.getElementById('add-task').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
}

/** Sets EventListener to close dropdowns when clicked outside */
function setupDropdownCloseListener() {
    document.addEventListener('click', function(event) {
        let dropdownContacts = document.getElementById('assigned-to');
        let isClickInsideDropdownContacts = dropdownContacts.contains(event.target);
        let dropdownCategory = document.getElementById('choose-category');
        let isClickInsideDropdownCategory = dropdownCategory.contains(event.target);

        if (!isClickInsideDropdownContacts && !dropdownContacts.querySelector('.select-items').classList.contains('select-hide')) {
            toggleDropdown('assigned-to', true); 
        }

        if (!isClickInsideDropdownCategory && !dropdownCategory.querySelector('.select-items').classList.contains('select-hide')) {
            toggleDropdown('choose-category', true); 
            changeDropdownImg('choose-category', 'open'); 
        }
    });
}

/** Sets Input Listener to Subtask to update icon-container on input */
function addSubtaskEventListener(){
    document.getElementById('subtasks').addEventListener('input', function() {
        let inputField = document.getElementById('subtasks');
        let iconContainer = document.getElementById('icon-container');
    
        if(inputField.value.trim() !== '') {
            iconContainer.innerHTML = renderSubtaskIconHTML();
        } else {
            iconContainer.innerHTML = `
                <img class="icon-plus" src="assets/img/addtask_plus.svg" alt="">
            `;
        }
    });
}

/** Sets Input Listener to Subtask to allow add and save on pressing Enter */
function setupInputEventListener() {
    document.getElementById('subtasks').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 13) {
            event.preventDefault(); 
    
            let isEditing = document.querySelector('.editing');
    
            if (isEditing) {
                let subtaskId = isEditing.id; 
                saveEditedSubtask(subtaskId);
            } else {
                addSubtask();
            }
        }
    });
}

/** Adds click event listener which triggers handleContactClick */
function setupEventListenersForItemsDiv() {
    let itemsDiv = document.getElementById('assigned-to').querySelector('.select-items');
        
    itemsDiv.addEventListener('click', function(event) {
        let optionDiv = event.target.closest('.option-item');
        if (!optionDiv) return; 
    
        let index = optionDiv.id.split('-')[1]; 
        let contact = testContacts[index]; 
    
        handleContactClick(event, contact, optionDiv);
    });
}    

/** Adds all event listeners to the page */
function addAllEventListeners(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv) {
    setupFormEventListeners();
    setupDropdownCloseListener();
    setupInputEventListener();
    setupEventListenersForItemsDiv();
    addSubtaskEventListener();
}