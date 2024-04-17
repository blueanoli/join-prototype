let testContacts = {};
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
 * Updates the test contacts from the server.
 */
function updateTestContactsFromServer() {
    let updatedTestContacts = {};

    contacts.forEach(contact => {
        updatedTestContacts[contact.name] = contact.color;
    });
    testContacts = updatedTestContacts;
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
            let contact = contacts.find(c => c.name === contactName);
            if (contact) {
                let initials = getInitials(contactName);
                let color = contact.color;
                let newContactHtml = renderAssignedContactHTML(initials, color, contactName);
                assignedContactsContainer.innerHTML += newContactHtml;
            }
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
        .map(([name]) => {
            let contact = contacts.find(contact => contact.name === name);
            return {
                name,
                color: contact.color,
                initials: getInitials(name)
            };
        });
}

/**
 * Creates HTML option for contact and appends it to itemsDiv.
 * Option includes contact's initials, color, checkbox image, and selected class and background color if contact is selected.
 * @param {string} contact - Name of contact.
 * @param {HTMLElement} itemsDiv - Div to which contact option will be appended.
 * @param {number} index - Index of contact in list.
 */
function createContactOption(contactName, color, itemsDiv, index) {
    let initials = getInitials(contactName);
    let isChecked = selectedContacts[contactName] === true;
    let checkboxImage = isChecked ? "checkboxchecked_white.svg" : "checkboxempty.svg";
    let selectedClass = isChecked ? " selected" : "";
    let backgroundColorStyle = isChecked ? " style='background-color: var(--dark-blue);'" : "";
    let optionHTML = renderContactOptionHTML(contactName, color, initials, checkboxImage, selectedClass, backgroundColorStyle, index);

    itemsDiv.innerHTML += optionHTML;
}


/**
 * Creates and appends new contact option for each contact in Array to the dropdown menu
*/
function renderContacts() {
    let itemsDivId = getAssignedToId();
    let itemsDiv = document.getElementById(itemsDivId).querySelector('.select-items');
    itemsDiv.innerHTML = '';

    Object.keys(testContacts).forEach((contactName, index) => {
        let color = testContacts[contactName];
        createContactOption(contactName, color, itemsDiv, index);
    });
}

/**
 * Adds contact to assign-contacts element if it's not already present
 */
function validateContactName(contactName) {
    if (!contactName) {
        console.error('addAssignedContact wurde mit undefined contactName aufgerufen');
        return false;
    }
    return true;
}

/**
 * Finds a contact by name.
 * @param {string} contactName - The name of the contact.
 * @returns {Object|null} The contact object or null if not found.
 */
function findContact(contactName) {
    let contact = contacts.find(c => c.name === contactName);
    if (!contact) {
        console.error(`Kontakt mit dem Namen ${contactName} nicht gefunden.`);
        return null;
    }
    return contact;
}

/**
 * Adds a contact to the assigned list.
 * @param {Object} contact - The contact object.
 * @param {string} contactName - The name of the contact.
 */
function addContactToAssigned(contact, contactName) {
    let initials = getInitials(contactName);
    let color = contact.color;
    let assignedToId = getAssignedToId();
    let assignedTo = document.getElementById(assignedToId);

    assignedTo.innerHTML += renderAssignedContactHTML(initials, color, contactName);
    selectedContacts[contactName] = true;
}

/**
 * Adds a contact to the assigned list if valid and not already selected.
 * @param {string} contactName - The name of the contact.
 */
function addAssignedContact(contactName) {
    if (!validateContactName(contactName)) {
        return;
    }

    if (!selectedContacts[contactName]) {
        let contact = findContact(contactName);
        if (!contact) {
            return;
        }
        addContactToAssigned(contact, contactName);
    }
}

/** 
 * Removes contact from assign-contacts element if it's present 
 * @param {string} contactName - Name of contact to remove
*/
function removeAssignedContact(contactName) {
    let assignedToId = getAssignedToId();
    let assignedTo = document.getElementById(assignedToId);
    let contactElement = assignedTo.querySelector(`[data-contact-name="${contactName}"]`);
    if (contactElement) {
        contactElement.remove();
    }
    selectedContacts[contactName] = false;
}

/** 
 * Updates checkbox image for specified contact to reflect whether or not its selected 
 * @param {string} contact - Name of contact to update
 * @param {boolean} isChecked - Whether or not contact is selected
 * */
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

/** 
 * Gets search term from contact-search-input field and filters contacts 
*/
function filterContacts() {
    let search = document.getElementById('contact-search-input').value.toLowerCase();
    filterContactsBySearch(search);
}

/**
 * Retrieves a contact option element by index.
 * @param {number} index - The index of the contact.
 * @returns {Element} The contact option element.
 */
function getContactOption(index) {
    return document.getElementById('contact-' + index);
}

/**
 * Filters a contact option based on a search term.
 * @param {Element} option - The contact option element.
 * @param {string} contactName - The name of the contact.
 * @param {string} search - The search term.
 */
function filterContactOption(option, contactName, search) {
    let names = contactName.toLowerCase().split(' ');

    if (names.some(name => name.startsWith(search))) {
        option.style.display = 'flex';
    } else {
        option.style.display = 'none';
    }
}

/** 
 * Filters contacts displaying only those whose first or last name start with the search term 
 * @param {string} search - Search term to filter contacts by
 * */
function filterContactsBySearch(search) {
    let index = 0;
    for (const contactName in testContacts) {
        if (testContacts.hasOwnProperty(contactName)) {
            let option = getContactOption(index);

            if (!option) {
                index++;
                continue;
            }
            filterContactOption(option, contactName, search);
            index++;
        }
    }
}
/** 
 * Clears assign-contacts element, resets selection status to false and re-renders contacts
*/
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