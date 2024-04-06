let testContacts = ['Albert Wesker', 'Chris Redfield', 'Jill Valentine', 'Brad Vickers', 'Claire Redfield', 'Barry Burton', 'Brian Irons'];
let selectedContacts = {};

/**
 * Returns ID of element that displays assigned contacts, based on current mode.
 * If app is in edit mode, it returns ID for edit form else it returns ID for addtask form
 * @returns {string} - ID of element that displays assigned contacts.
 */
function getAssignedToId() {
    return isEditMode ? 'edit-assigned-to' : 'assigned-to';
}

/**
 * Returns ID of container that holds assigned contacts, based on current mode.
 * If app is in edit mode, it returns ID for edit form container else it returns ID for addtask form container
 * @returns {string} - ID of container that holds assigned contacts.
 */
function getAssignedContactsContainerId() {
    return isEditMode ? 'edit-assign-contacts' : 'assign-contacts';
}

/**
 * Initializes selectedContacts object with contacts assigned to task.
 * @param {Object} task - Task object with 'assignedTo' property, which is an array of contact objects.
 * Each contact object has a 'name' property.
 */
function initializeSelectedContacts(task) {
    selectedContacts = {};
    task.assignedTo.forEach(contact => {
        selectedContacts[contact.name] = true;
    });
}

/**
 * Generates HTML for each contact assigned to task.
 * @param {Object} task - Task object with 'assignedTo' property, which is an array of contact objects.
 * Each contact object has a 'color' and 'initials' property.
 * @returns {string} - HTML string for assigned contacts.
 */
function generateAssignedContactsHtml(task) {
    return task.assignedTo.map(contact => `
        <div class="contact-icon-container">
            <p class="test-contact" style="background-color: ${contact.color}">${contact.initials}</p>
        </div>
    `).join('');
}

/**
 * Toggles selection status of contact. If contact was previously selected, it will be deselected, and vice versa.
 * After toggling, it updates dropdown display and view of assigned contacts.
 * @param {string} contactName - Name of contact to toggle.
 */
function toggleContactSelection(contactName) {
    let wasSelected = selectedContacts[contactName];
    selectedContacts[contactName] = !wasSelected;

    updateDropdownDisplay(contactName, selectedContacts[contactName]);
    updateAssignedContactsView();
}

/**
 * Updates display of dropdown menu to show selection status of contact.
 * If contact is selected, it adds 'selected' class to option and changes checkbox icon to checked.
 * If contact is not selected, it removes 'selected' class and changes checkbox icon to unchecked.
 * @param {string} contactName - Name of contact to update.
 * @param {boolean} isSelected - Selection status of contact.
 */
function updateDropdownDisplay(contactName, isSelected) {
    const contactOptions = document.querySelectorAll('.option-item');
    contactOptions.forEach(option => {
        if (option.textContent.trim().includes(contactName)) { 
            const checkboxIcon = option.querySelector('.checkbox-icon');
            if (isSelected) {
                option.classList.add('selected');
                checkboxIcon.src = 'assets/img/checkboxchecked_white.svg'; 
            } else {
                option.classList.remove('selected');
                checkboxIcon.src = 'assets/img/checkboxempty.svg';
            }
        }
    });
}

/**
 * Updates view of assigned contacts. First clears assigned contacts container.
 * Then, for each selected contact, it generates initials, gets color for initials,
 * renders HTML for assigned contact, and adds it to assigned contacts container.
 */
function updateAssignedContactsView() {
    const assignedContactsContainer = document.getElementById(getAssignedContactsContainerId());
    assignedContactsContainer.innerHTML = ''; 

    for (const contactName in selectedContacts) {
        if (selectedContacts[contactName]) {
            let initials = getInitials(contactName);
            let color = getColorForInitials(initials);
            let newContactHtml = renderAssignedContactHTML(initials, color);
            assignedContactsContainer.innerHTML += newContactHtml;
        }
    }
}

/**
 * Transforms selectedContacts object into an array of contact objects suitable for assignment to task.
 * Each contact object includes contact's name, color and initials.
 * @param {Object} selectedContacts - Object where each key is contact name and corresponding value is a boolean indicating whether the contact is selected.
 * @returns {Object[]} - Array of contact objects, each with 'name', 'color', and 'initials' properties.
 */
function transformSelectedContactsToAssignedTo(selectedContacts) {
    return Object.entries(selectedContacts)
        .filter(([name, isSelected]) => isSelected) 
        .map(([name]) => ({
            name, 
            color: getColorForInitials(getInitials(name)), 
            initials: getInitials(name) 
        }));
}

/**
 * Creates HTML option for contact and appends it to itemsDiv.
 * Option includes contact's initials, color, checkbox image, and selected class and background color if contact is selected.
 * 
 * @param {string} contact - Name of contact.
 * @param {HTMLElement} itemsDiv - Div to which contact option will be appended.
 * @param {number} index - Index of contact in list.
 */
function createContactOption(contact, itemsDiv, index) {
    let initials = getInitials(contact);
    let color = getColorForInitials(initials);
    let isChecked = selectedContacts[contact] === true; 
    let checkboxImage = isChecked ? "checkboxchecked_white.svg" : "checkboxempty.svg";
    let selectedClass = isChecked ? " selected" : "";
    let backgroundColorStyle = isChecked ? " style='background-color: var(--dark-blue);'" : "";

    let optionHTML = renderContactOptionHTML(contact, color, initials, checkboxImage, selectedClass, backgroundColorStyle, index);

    itemsDiv.innerHTML += optionHTML;
}

/** Creates and appends new contact option for each contact in Array to the dropdown menu */
function renderContacts() {
    let itemsDivId = getAssignedToId();
    let itemsDiv = document.getElementById(itemsDivId).querySelector('.select-items');
    itemsDiv.innerHTML = '';
    
    for (let i = 0; i < testContacts.length; i++) {
        let contact = testContacts[i];
        createContactOption(contact, itemsDiv, i);
    }
}

/** Adds contact to assign-contacts element if it's not already present */
function addAssignedContact(contactName) {
    if (!selectedContacts[contactName]) {
        let initials = getInitials(contactName);
        let color = getColorForInitials(initials);
        let assignedToId = getAssignedToId();
        let assignedTo = document.getElementById(assignedToId);
        assignedTo.innerHTML += renderAssignedContactHTML(initials, color, contactName);
        selectedContacts[contactName] = true;
    }
}

function removeAssignedContact(contactName) {
    let assignedToId = getAssignedToId();
    let assignedTo = document.getElementById(assignedToId);
    let contactElement = assignedTo.querySelector(`[data-contact-name="${contactName}"]`);
    if (contactElement) {
        contactElement.remove();
    }
    selectedContacts[contactName] = false;
}

/** Updates checkbox image for specified contact to reflect whether or not its selected */
function updateCheckboxForContact(contact, isChecked) {
    let assignedToId = getAssignedToId();
    let dropdown = document.getElementById(assignedToId);
    let itemsDiv = dropdown.querySelector('.select-items');
    let options = itemsDiv.querySelectorAll('.option-item');

    options.forEach((option) => {
        if (option.textContent.includes(contact)) {
            let checkbox = option.querySelector('.checkbox-icon');
            checkbox.src = isChecked ? "assets/img/checkboxchecked_white.svg" : "assets/img/checkboxempty.svg";
        }
    });
}

/** Gets search term from contact-search-input field and filters contacts */
function filterContacts(){
    let search = document.getElementById('contact-search-input').value.toLowerCase();
    filterContactsBySearch(search);
}

/** Filters contacts displaying only those whose first or last name start with the search term */
function filterContactsBySearch(search) {
    search = search.toLowerCase();

    for (let i = 0; i < testContacts.length; i++) {
        let contact = testContacts[i].toLowerCase();
        let option = document.getElementById('contact-' + i);
        let names = contact.split(' ');

        if (names[0].startsWith(search) || (names.length > 1 && names[1].startsWith(search))) {
            option.style.display = 'flex';
        } else {
            option.style.display = 'none';
        }
    }
}

/** Clears assign-contacts element, resets selection status to false and re-renders contacts */
function clearAssignedContacts() {
    let assignedTo = document.getElementById('assign-contacts');
    assignedTo.innerHTML = '';

    for (let key in selectedContacts) {
        if (selectedContacts.hasOwnProperty(key)) { 
            selectedContacts[key] = false; 
        }
    }

    renderContacts();
}
