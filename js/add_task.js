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
const priorities = ["low", "medium", "urgent"];
const imgBaseURL = "assets/img/addtask_";

// INIT LOGIC
async function renderAddTask(){
    await init();
    chooseMediumPrio(); 
    addSubtaskEventListener();
    setupInputEventListener();
    setupFormEventListeners();
    setupDropdownCloseListener();
    setupEventListenersForItemsDiv();
    disableFormEnterKeySubmission();
}

// DATE LOGIC
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

// ERROR MESSAGE LOGIC
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

// PRIORITY LOGIC
function chooseUrgentPrio() {
    setPriority("urgent");
}

function chooseMediumPrio() {
    setPriority("medium");
}

function chooseLowPrio() {
    setPriority("low");
}

function setPriority(priorityLevel) {
 
    priorities.forEach(prio => {
        const elem = document.getElementById(`priority-${prio}`);
        const imgElem = document.getElementById(`img-${prio}`);
        
        if (prio === priorityLevel) {
            elem.classList.add(`${prio}-priority-active`);
            imgElem.src = `${imgBaseURL}${prio}_white.svg`;
        } else {
            elem.classList.remove(`${prio}-priority-active`);
            imgElem.src = `${imgBaseURL}${prio}.svg`;
        }
    });
}

// ADD TASK LOGIC
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

// CONTACT LOGIC
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

function renderContacts() {
    let itemsDiv = document.getElementById('assigned-to').querySelector('.select-items');
    itemsDiv.innerHTML = '';
    
    for (let i = 0; i < testContacts.length; i++) {
        let contact = testContacts[i];
        createContactOption(contact, itemsDiv, i);
    }
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

// CATEGORY LOGIC
function createCategoryOption(category, itemsDiv, selectedDiv, dropdown) {
    let optionDiv = document.createElement('div');
    optionDiv.textContent = category;
    optionDiv.addEventListener('click', function (event) {
        handleCategoryClick(event, category, selectedDiv, dropdown, itemsDiv);
    });
    itemsDiv.appendChild(optionDiv);
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

function resetCategorySelection() {
    let dropdown = document.getElementById('choose-category');
    dropdown.removeAttribute('data-value'); 
    let selectedDiv = dropdown.querySelector('.select-selected');
    selectedDiv.textContent = 'Select task category'; 
    resetFieldStyle(dropdown); 
}

function clearForm() {
    document.getElementById('add-task').reset();
    chooseMediumPrio(); 
    clearAssignedContacts();
    resetCategorySelection();
    clearSubtasks();
}

// HILFSFUNKTIONEN

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