let subtaskCounter = 0;
let testContacts = ['Albert Wesker', 'Chris Redfield', 'Jill Valentine', 'Brad Vickers', 'Claire Redfield', 'Barry Burton', 'Brian Irons'];
let testCategories = ['Technical Task', 'User Story'];
let selectedContacts = {};
let fields = [
    { id: 'title', errorId: 'title-error' },
    { id: 'due-date', errorId: 'due-date-error' },
    { id: 'choose-category', errorId: 'category-error', isDiv: true },
];
let isFieldEmpty;

async function renderAddTask(){
    await init();
    chooseMediumPrio();
    addSubtaskEventListener();
    setupInputEventListener();
    setupFormEventListeners();
    setupDropdownCloseListener();
}

function validateDate(inputElement) {
    let inputValue = inputElement.value;
    let datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    let addTaskButton = document.getElementById('add-task-btn');
    
    if (!datePattern.test(inputValue)) {
      inputElement.setCustomValidity('Please enter correct format dd/mm/yyyy');
      addTaskButton.disabled = true; 
    } else {
      inputElement.setCustomValidity('');
      addTaskButton.disabled = false; 
    }
    inputElement.reportValidity();
  }

function showErrorMessage(inputElement, errorMessage) {
    inputElement.classList.add('input-error');
    errorMessage.style.display = 'block';
}

function hideErrorMessage(inputElement, errorMessage) {
    inputElement.classList.remove('input-error');
    errorMessage.style.display = 'none';
}

function checkRequiredField() {
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let inputElement = document.getElementById(field.id);
        let errorMessage = document.getElementById(field.errorId);

        if (field.isDiv) {
            isFieldEmpty = !inputElement.getAttribute('data-value');
        } else {
            isFieldEmpty = inputElement.value.trim() === '';
        }

        if (isFieldEmpty) {
            showErrorMessage(inputElement, errorMessage);
        } else {
            hideErrorMessage(inputElement, errorMessage);
        }
    }
}

function resetFieldStyle(element) {
    element.classList.remove('input-error');

    let errorId = element.id + '-error';
    let errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function chooseUrgentPrio() {
    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");

    urgent.classList.add("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent_white.svg";

    removeMediumPrio();
    removeLowPrio();
}

function chooseMediumPrio() {
    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");

    medium.classList.add("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium_white.svg";

    removeLowPrio();
    removeUrgentPrio();
}

function chooseLowPrio() {
    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");

    low.classList.add("low-priority-active");
    lowimg.src = "assets/img/addtask_low_white.svg";

    removeMediumPrio();
    removeUrgentPrio();
}

function addTask() {
    let isErrorVisible = false;
    let errorElements = document.querySelectorAll('.error-message');

    checkRequiredField();
    
    for (let i = 0; i < errorElements.length; i++) {
        if (errorElements[i].style.display === 'block') {
            isErrorVisible = true;
            break;
        }
    }

    if (isErrorVisible) {
        return;
    }
    addTaskAnimation();
}

function addTaskAnimation(){
    let notification = document.getElementById('notification-container');

    notification.classList.add("animate");
    notification.innerHTML = renderNotificationHTML();

    setTimeout(function() {
        notification.classList.remove("animate");
        notification.innerHTML = '';
        clearForm();
        window.location.href = "board.html";
    }, 1000);
}

function createContactOption(contact, itemsDiv, index) {
    let initials = getInitials(contact);
    let color = getColorForInitials(initials);
    let isChecked = selectedContacts[contact] === true; 
    let checkboxImage = isChecked ? "checkboxchecked_white.svg" : "checkboxempty.svg";
    let optionDiv = document.createElement('div');

    optionDiv.className = 'option-item';
    optionDiv.id = 'contact-' + index;
    optionDiv.innerHTML = renderContactHTML(contact, color, initials, checkboxImage);

    if (isChecked) {
        optionDiv.style.backgroundColor = "var(--dark-blue)"; 
        optionDiv.classList.add("selected");
    }

    optionDiv.addEventListener('click', function (event) {
        handleContactClick(event, contact, optionDiv);
    });

    itemsDiv.appendChild(optionDiv);
}

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

function renderContacts() {
    let itemsDiv = document.getElementById('assigned-to').querySelector('.select-items');
    itemsDiv.innerHTML = '';
    
    testContacts.forEach((contact, index) => {
        createContactOption(contact, itemsDiv, index);
    });
}

function addAssignedContact(contact) {
    let assignedTo = document.getElementById('assign-contacts');

    if (!assignedTo.innerHTML.includes(contact)) {
        let initials = getInitials(contact); 
        let color = getColorForInitials(initials); 

        assignedTo.innerHTML += renderAssignedContactHTML(initials, color);
    }
}

function removeAssignedContact(contact) {
    let assignedTo = document.getElementById('assign-contacts');
    let contacts = assignedTo.querySelectorAll('.assigned-contact');
    let contactInitials = getInitials(contact); 

    contacts.forEach((elem) => {
        let elemInitials = elem.querySelector('.test-contact').textContent; 
        if (elemInitials === contactInitials) {
            elem.remove(); 
        }
    });

    selectedContacts[contact] = false;
    updateCheckboxForContact(contact, false);
}

function updateCheckboxForContact(contact, isChecked) {
    let dropdown = document.getElementById('assigned-to');
    let itemsDiv = dropdown.querySelector('.select-items');
    let options = itemsDiv.querySelectorAll('.option-item');

    options.forEach((option) => {
        if (option.textContent.includes(contact)) {
            let checkbox = option.querySelector('.checkbox-icon');
            checkbox.src = isChecked ? "assets/img/checkboxchecked_white.svg" : "assets/img/checkboxempty.svg";
        }
    });
}

function filterContacts(){
    let search = document.getElementById('contact-search-input').value.toLowerCase();
    filterContactsBySearch(search);
}

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

function createCategoryOption(category, itemsDiv, selectedDiv, dropdown) {
    let optionDiv = document.createElement('div');
    optionDiv.textContent = category;
    optionDiv.addEventListener('click', function (event) {
        handleCategoryClick(event, category, selectedDiv, dropdown, itemsDiv);
    });
    itemsDiv.appendChild(optionDiv);
}

function handleCategoryClick(event, category, selectedDiv, dropdown, itemsDiv) {
    event.stopPropagation();

    selectedDiv.textContent = category;
    dropdown.setAttribute('data-value', category);
    resetFieldStyle(dropdown);
    hideCategoryError();

    itemsDiv.classList.add('select-hide');
    changeDropdownImg('choose-category', 'close');
}

function hideCategoryError() {
    let errorElement = document.getElementById('category-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function renderCategories() {
    let dropdown = document.getElementById('choose-category');
    let itemsDiv = dropdown.querySelector('.select-items');
    let selectedDiv = dropdown.querySelector('.select-selected');

    itemsDiv.innerHTML = '';

    testCategories.forEach(category => {
        createCategoryOption(category, itemsDiv, selectedDiv, dropdown);
    });
}

function clearForm() {
    document.getElementById('add-task').reset();
    document.getElementById("add-task-btn").disabled = false;

    removeLowPrio();
    removeUrgentPrio();
    chooseMediumPrio();
    clearAssignedContacts();
    resetCategorySelection();
    clearSubtasks();
}

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

function setupDropdownCloseListener() {
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('assigned-to');
        const isClickInsideDropdown = dropdown.contains(event.target);

        if (!isClickInsideDropdown && !dropdown.querySelector('.select-items').classList.contains('select-hide')) {
            toggleDropdown('assigned-to', true); 
        }
    });
}

// HILFSFUNKTIONEN
function removeLowPrio() {
    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");
    low.classList.remove("low-priority-active");
    lowimg.src = "assets/img/addtask_low.svg";
}

function removeMediumPrio() {
    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");
    medium.classList.remove("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium.svg";
}

function removeUrgentPrio() {
    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");
    urgent.classList.remove("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent.svg";
}

function toggleDropdown(elementId, forceClose = false) {
    let dropdown = document.getElementById(elementId);
    let itemsDiv = dropdown.querySelector('.select-items');
    let searchInput = document.getElementById('contact-search-input');
    let selectSelected = dropdown.querySelector('.select-selected');

    if (forceClose || !itemsDiv.classList.contains('select-hide')) {
        itemsDiv.classList.add('select-hide');
        if (elementId === 'assigned-to') { 
            searchInput.classList.add('select-hide');
            selectSelected.style.display = 'block';
        }
        changeDropdownImg(elementId, 'close');
    } else {
        itemsDiv.classList.remove('select-hide');
        if (elementId === 'assigned-to') { 
            searchInput.classList.remove('select-hide');
            selectSelected.style.display = 'none';
            searchInput.focus();
        }
        changeDropdownImg(elementId, 'open');
    }
}

function changeDropdownImg(elementId, state) {
    let imgId = elementId === 'choose-category' ? "img-dropdown-cat" : "img-dropdown";
    let img = document.getElementById(imgId);
    if (img) { 
        img.src = state === 'open' ? "assets/img/addtask_dropdown_up.svg" : "assets/img/addtask_dropdown.svg";
    }
}

function clearAssignedContacts() {
    let assignedTo = document.getElementById('assign-contacts');
    assignedTo.innerHTML = '';

    Object.keys(selectedContacts).forEach(key => {
        selectedContacts[key] = false;
    });

    renderContacts();
}

function resetCategorySelection() {
    let dropdown = document.getElementById('choose-category');
    dropdown.removeAttribute('data-value'); 
    let selectedDiv = dropdown.querySelector('.select-selected');
    selectedDiv.textContent = 'Select task category'; 
    resetFieldStyle(dropdown); 
}

document.addEventListener('DOMContentLoaded', function() {
     let form = document.getElementById('add-task');
     if (form) {
        form.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                return false;
            }
        });
    }
});