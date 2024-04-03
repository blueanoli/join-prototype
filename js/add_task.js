// GLOBAL VARIABLE -------------------------------------------------------------------------------------------------------------------------------
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
let selectedPriority = "medium";
let isEditMode = false;
let editedTaskPriority;

// INIT LOGIC -------------------------------------------------------------------------------------------------------------------------------
async function renderAddTask(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv){
    await init();
    loadTasksFromLocalStorage();
    chooseMediumPrio(); 
    addAllEventListeners(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv);
}

// DATE LOGIC -------------------------------------------------------------------------------------------------------------------------------
function checkDueDate() {
    let dueDateInput = document.getElementById('due-date');
    let dueDate = dueDateInput.value;
    let today = new Date();
    let dueDateObj = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    dueDateObj.setHours(0, 0, 0, 0);

    if (dueDateObj < today) {
        dueDateInput.setCustomValidity("Please choose a date in the future");
        dueDateInput.reportValidity();
        return false; 
    } else {
        dueDateInput.setCustomValidity("");
        return true; 
    }
}

// ERROR MESSAGE LOGIC -----------------------------------------------------------------------------------------------------------------------------
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

// PRIORITY LOGIC -------------------------------------------------------------------------------------------------------------------------------
function chooseUrgentPrio() {
    setPriority("urgent", isEditMode);
}

function chooseMediumPrio() {
    setPriority("medium", isEditMode);
}

function chooseLowPrio() {
    setPriority("low", isEditMode);
}

function setPriority(priorityLevel, isEditModeFlag) {
    selectedPriority = priorityLevel; 

    if (isEditModeFlag) {
        editedTaskPriority = priorityLevel;
    }else {
        selectedPriority = priorityLevel;
    }

    for (let i = 0; i < priorities.length; i++) {
        let prio = priorities[i];
        let elem = document.getElementById(`priority-${prio}`);
        let imgElem = document.getElementById(`img-${prio}`);

        if (prio === priorityLevel) {
            elem.classList.add(`${prio}-priority-active`);
            imgElem.src = `${imgBaseURL}${prio}_white.svg`;
        } else {
            elem.classList.remove(`${prio}-priority-active`);
            imgElem.src = `${imgBaseURL}${prio}.svg`;
        }
    }
}

// ADD TASK LOGIC -------------------------------------------------------------------------------------------------------------------------------
function addTask() {
    checkRequiredField();
    checkDueDate();
    if (hasErrors() || !isDateValid()) {
        return;
    }

    let newTask = createNewTask();
    tasksData.push(newTask);
    saveTasksToLocalStorage();
    addTaskAnimation();
}

function hasErrors() {
    let errorElements = document.querySelectorAll('.error-message');
    for (let i = 0; i < errorElements.length; i++) {
        if (errorElements[i].style.display === 'block') {
            return true;
        }
    }
    return false;
}

function isDateValid() {
    return checkDueDate();
}

function createNewTask() {
    let container = document.getElementById('add-task-container-board');
    let progress = container ? container.getAttribute('data-progress-status') || 'todo' : 'todo';
    let title = document.getElementById('title').value;
    let dueDate = document.getElementById('due-date').value;
    let category = document.getElementById('choose-category').getAttribute('data-value');
    let priority = selectedPriority; 
    let assignedTo = transformSelectedContactsToAssignedTo(selectedContacts);
    let description = document.getElementById('description').value;
    let subtasks = prepareSubtasks();

    return { title, dueDate, category, priority, assignedTo, description, subtasks, progress };
}

function addTaskAnimation(){
    let notification = document.getElementById('notification-container');

    notification.classList.add("animate");
    notification.innerHTML = renderNotificationHTML("Task added to board", "assets/img/board_grey.svg");

    setTimeout(function() {
        notification.classList.remove("animate");
        notification.innerHTML = '';
        clearForm();
        window.location.href = "board.html";
    }, 1000);
}

// CONTACT LOGIC -------------------------------------------------------------------------------------------------------------------------------
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

// CATEGORY LOGIC -------------------------------------------------------------------------------------------------------------------------------
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

// CLEAR FORM LOGIC -------------------------------------------------------------------------------------------------------------------------------
function clearForm() {
    document.getElementById('add-task').reset();
    chooseMediumPrio(); 
    clearAssignedContacts();
    resetCategorySelection();
    clearSubtasks();
}

// HILFSFUNKTIONEN -------------------------------------------------------------------------------------------------------------------------------
function toggleDropdown(elementId, forceClose = false) {
    let dropdown = document.getElementById(elementId);
    let itemsDiv = dropdown.querySelector('.select-items');
    let isOpen = !itemsDiv.classList.contains('select-hide');
    let action = forceClose || isOpen ? 'add' : 'remove';

    toggleElement(itemsDiv, action, 'select-hide');
    if (elementId === 'assigned-to') {
        toggleAssignedTo(dropdown, action);
    }

    let state = action === 'add' ? 'close' : 'open';
    changeDropdownImg(elementId, state);
}
function toggleElement(element, action, className) {
    element.classList[action](className);
}

function toggleAssignedTo(dropdown, action) {
    let searchInput = document.getElementById('contact-search-input');
    let selectSelected = dropdown.querySelector('.select-selected');

    toggleElement(searchInput, action, 'select-hide');
    selectSelected.style.display = action === 'add' ? 'block' : 'none';
    if (action === 'remove') searchInput.focus();
}

function changeDropdownImg(elementId, state) {
    let imgId = elementId === 'choose-category' ? 'img-dropdown-cat' : 'img-dropdown';
    let img = document.getElementById(imgId);
    if (img) {
        img.src = state === 'open' ? "assets/img/addtask_dropdown_up.svg" : "assets/img/addtask_dropdown.svg";
    }
}