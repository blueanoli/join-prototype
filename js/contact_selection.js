let testContacts = ['Albert Wesker', 'Chris Redfield', 'Jill Valentine', 'Brad Vickers', 'Claire Redfield', 'Barry Burton', 'Brian Irons'];
let selectedContacts = {};

function getAssignedToId() {
    return isEditMode ? 'edit-assigned-to' : 'assigned-to';
}
function getAssignedContactsContainerId() {
    return isEditMode ? 'edit-assign-contacts' : 'assign-contacts';
}

function initializeSelectedContacts(task) {
    selectedContacts = {};
    task.assignedTo.forEach(contact => {
        selectedContacts[contact.name] = true;
    });
}

/** Generates HTML for each contact assigned to task */
function generateAssignedContactsHtml(task) {
    return task.assignedTo.map(contact => `
        <div class="contact-icon-container">
            <p class="test-contact" style="background-color: ${contact.color}">${contact.initials}</p>
        </div>
    `).join('');
}

/** Toggles selection status of contact */
function toggleContactSelection(contactName) {
    let wasSelected = selectedContacts[contactName];
    selectedContacts[contactName] = !wasSelected;

    updateDropdownDisplay(contactName, selectedContacts[contactName]);
    updateAssignedContactsView();
}

/** Updates the display of the dropdown */
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

/** Updated view of assigned contact by clearing current view */
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


function transformSelectedContactsToAssignedTo(selectedContacts) {
    return Object.entries(selectedContacts)
        .filter(([name, isSelected]) => isSelected) 
        .map(([name]) => ({
            name, 
            color: getColorForInitials(getInitials(name)), 
            initials: getInitials(name) 
        }));
}

/** Generates ContactOption for a dropdown menu */
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
    console.log('After adding contact:', selectedContacts); 
}

function removeAssignedContact(contactName) {
    let assignedToId = getAssignedToId();
    let assignedTo = document.getElementById(assignedToId);
    let contactElement = assignedTo.querySelector(`[data-contact-name="${contactName}"]`);
    if (contactElement) {
        contactElement.remove();
    }
    selectedContacts[contactName] = false;
    console.log('After removing contact:', selectedContacts);
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
