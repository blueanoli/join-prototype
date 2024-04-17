/**
 * Handles click event on contact, toggling its selection state.
 *
 * @param {Event} event - Click event.
 * @param {Object} contact - Contact object.
 * @param {HTMLElement} optionDiv - Div element representing contact option.
 */
function handleContactClick(event, contactName, optionDiv) {
    event.stopImmediatePropagation();
    let checkbox = getCheckboxFromEvent(event, optionDiv);

    // Stelle sicher, dass checkbox und contactName definiert sind, bevor du fortfährst
    if (!checkbox || typeof contactName === 'undefined') return;

    toggleContactSelection(contactName);

    if (!isContactSelected(contactName)) {
        deselectContact(contactName, checkbox, optionDiv);
    } else {
        selectContact(contactName, checkbox, optionDiv);
    }
    updateAssignedContactsView();
}

/**
 * Returns checkbox element from a click event.
 * @param {Event} event - Click event.
 * @param {HTMLElement} optionDiv - Div element containing checkbox.
 * @returns {HTMLElement} - Checkbox element.
 */
function getCheckboxFromEvent(event, optionDiv) {
    if (!optionDiv) return null;
    let isCheckboxClicked = event.target.classList.contains('checkbox-icon');
    return isCheckboxClicked ? event.target : optionDiv.querySelector('.checkbox-icon');
}

/**
 * Checks if contact is selected.
 * @param {Object} contact - Contact to check.
 * @returns {boolean} - True if contact is selected, else false.
 */
function isContactSelected(contact) {
    return selectedContacts[contact];
}

/**
 * Deselects contact, updates checkbox image, removes contact from assigned list, and updates style.
 *
 * @param {Object} contact - Contact to deselect.
 * @param {HTMLElement} checkbox - Checkbox element of contact.
 * @param {HTMLElement} optionDiv - Div element representing contact option.
 */
function deselectContact(contactName, checkbox, optionDiv) {
    checkbox.src = "assets/img/checkboxempty.svg";
    optionDiv.style.backgroundColor = "";
    optionDiv.classList.remove("selected");
}

/**
 * Selects contact, updates checkbox image, adds contact to assigned list, and updates style.
 *
 * @param {Object} contact - Contact to select.
 * @param {HTMLElement} checkbox - Checkbox element of contact.
 * @param {HTMLElement} optionDiv - Div element representing contact option.
 */
function selectContact(contactName, checkbox, optionDiv) {
    checkbox.src = "assets/img/checkboxchecked_white.svg";
    addAssignedContact(contactName);
    optionDiv.style.backgroundColor = "var(--dark-blue)";
    optionDiv.classList.add("selected");
}

/**
 * Handles click event on category, updating selected category and hiding category dropdown.
 *
 * @param {Event} event - Click event.
 * @param {string} category - Clicked category.
 * @param {HTMLElement} selectedDiv - Div element representing selected category.
 * @param {HTMLElement} dropdown - Dropdown element.
 * @param {HTMLElement} itemsDiv - Div element containing category items.
 */
function handleCategoryClick(event, category, selectedDiv, dropdown, itemsDiv) {
    event.stopPropagation();

    selectedDiv.textContent = category;
    dropdown.setAttribute('data-value', category);
    resetFieldStyle(dropdown);
    hideCategoryError();

    itemsDiv.classList.add('select-hide');
    changeDropdownImg('choose-category', 'close');
}

/**
 * Sets up event listeners for the form to prevent submission on pressing Enter.
 */
function setupFormEventListeners() {
    document.getElementById('add-task').addEventListener('submit', function (event) {
        event.preventDefault();
    });

    document.getElementById('add-task').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
}

/**
 * Handles click event on dropdown, toggling its visibility and changing its image if necessary.
 *
 * @param {Event} event - Click event.
 * @param {string} dropdownId - Id of dropdown element.
 * @param {string} dropdownName - Name of dropdown.
 */
function handleDropdownClick(event, dropdownId, dropdownName) {
    let dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    let isClickInsideDropdown = dropdown.contains(event.target);
    if (!isClickInsideDropdown && !dropdown.querySelector('.select-items').classList.contains('select-hide')) {
        toggleDropdown(dropdownId, true);
        if (dropdownName === 'category' && document.getElementById('img-dropdown')) {
            changeDropdownImg('choose-category', 'open');
        }
    }
}

/**
 * Sets up a click event listener on the document to handle dropdown clicks.
*/
function setupDropdownCloseListener() {
    document.addEventListener('click', function (event) {
        let assignedToId = getAssignedToId();

        if (document.getElementById(assignedToId)) {
            handleDropdownClick(event, assignedToId, 'contacts');
        }

        if (document.getElementById('choose-category')) {
            handleDropdownClick(event, 'choose-category', 'category');
        }
    });
}

/** 
 * Sets Input Listener to Subtask to update icon-container on input
*/
function addSubtaskEventListener() {
    document.getElementById('subtasks').addEventListener('input', function () {
        let inputField = document.getElementById('subtasks');
        let iconContainer = document.getElementById('icon-container');

        if (inputField.value.trim() !== '') {
            iconContainer.innerHTML = renderSubtaskIconHTML();
        } else {
            iconContainer.innerHTML = `
                <img class="icon-plus" src="assets/img/addtask_plus.svg" alt="">
            `;
        }
    });
}

/**
 * Sets Input Listener to Subtask to allow add and save on pressing Enter
*/
function setupInputEventListener() {
    document.getElementById('subtasks').addEventListener('keydown', function (event) {
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

/**
 * Adds click event listener which triggers handleContactClick
 */
function setupEventListenersForItemsDiv() {
    let assignedToId = getAssignedToId();
    let itemsDiv = document.getElementById(assignedToId).querySelector('.select-items');

    itemsDiv.addEventListener('click', function (event) {
        let optionDiv = event.target.closest('.option-item');
        if (!optionDiv) return;

        // Hier extrahieren wir den Kontaktname basierend auf dem Index.
        let index = parseInt(optionDiv.id.split('-')[1], 10);
        let contactName = Object.keys(testContacts)[index];  // Verwende Object.keys(), um den Namen des Kontakts basierend auf dem Index zu erhalten.

        handleContactClick(event, contactName, optionDiv);
    });
}


/**
*Adds all event listeners to the page
*/
function addAllEventListeners(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv) {
    setupFormEventListeners();
    setupDropdownCloseListener();
    setupInputEventListener();
    setupEventListenersForItemsDiv();
    addSubtaskEventListener();
}