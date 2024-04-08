let subtaskCounter = 0;
let testCategories = ['Technical Task', 'User Story'];
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

/** Initializes AddTask */
async function renderAddTask(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv){
    await init();
    await loadTasksFromServer();
    chooseMediumPrio(); 
    addAllEventListeners(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv);
}

/** Validates due-date input field to ensure that selected date is not in the past */
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

/** Shows error message if specific input field is empty */
function showErrorMessage(inputElement, errorMessage) {
    inputElement.classList.add('input-error');
    errorMessage.style.display = 'block';
}

/** Hides error message if specific input field is not empty */
function hideErrorMessage(inputElement, errorMessage) {
    inputElement.classList.remove('input-error');
    errorMessage.style.display = 'none';
}

/** Checks if each field in given list is empty and shows or hides error message accordingly */
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

/** Resets style of input field and hides error message */
function resetFieldStyle(element) {
    let errorId = element.id + '-error';
    let errorElement = document.getElementById(errorId);

    if (errorElement) {
        hideErrorMessage(element, errorElement);
    } else {
        element.classList.remove('input-error');
    }
}

/** Sets priority to urgent */
function chooseUrgentPrio() {
    setPriority("urgent", isEditMode);
}

/** Sets priority to medium */
function chooseMediumPrio() {
    setPriority("medium", isEditMode);
}

/** Sets priority to low */
function chooseLowPrio() {
    setPriority("low", isEditMode);
}

/** Sets selected priority to given priority level */
function setSelectedPriority(priorityLevel) {
    selectedPriority = priorityLevel;
}

/** Sets edited task priority to given priority level */
function setEditedTaskPriority(priorityLevel, isEditModeFlag) {
    if (isEditModeFlag) {
        editedTaskPriority = priorityLevel;
    }
}

/** Updates UI to show selected priority */
function updatePriorityUI(priorityLevel) {
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

/** Sets priority to given priority level */
function setPriority(priorityLevel, isEditModeFlag) {
    setSelectedPriority(priorityLevel);
    setEditedTaskPriority(priorityLevel, isEditModeFlag);
    updatePriorityUI(priorityLevel);
}

/** Validates required fields, if there are no errors it creates a new task and plays animation */
async function addTask() {
    checkRequiredField();
    if (hasErrors() || !checkDueDate()) {
        return;
    }

    let newTask = createNewTask();
    tasksData.push(newTask);
    saveTasksToServer();
    addTaskAnimation();
}

/** Checks if there are any error messages displayed */ 
function hasErrors() {
    let errorElements = document.querySelectorAll('.error-message');
    for (let i = 0; i < errorElements.length; i++) {
        if (errorElements[i].style.display === 'block') {
            return true;
        }
    }
    return false;
}

/** Creates a new task object with properties title, dueDate, category, priority, assignedTo, description, subtasks, progress and returns it */
function createNewTask() {
    let taskId = generateUniqueTaskId();
    let container = document.getElementById('add-task-container-board');
    let progress = container ? container.getAttribute('data-progress-status') || 'todo' : 'todo';
    let title = document.getElementById('title').value;
    let dueDate = document.getElementById('due-date').value;
    let category = document.getElementById('choose-category').getAttribute('data-value');
    let priority = selectedPriority; 
    let assignedTo = transformSelectedContactsToAssignedTo(selectedContacts);
    let description = document.getElementById('description').value;
    let subtasks = prepareSubtasks(taskId);

    return { id: taskId, title, dueDate, category, priority, assignedTo, description, subtasks, progress };
}

function generateUniqueTaskId() {
    return Date.now().toString();
}

/** Triggers animation to notify user that task has been added, then clears form and redirects user to board */
function addTaskAnimation(){
    let notification = document.getElementById('notification-container');

    notification.classList.add("animate");
    notification.innerHTML = renderNotificationHTML("Task added to board", "assets/img/board_grey.svg");

    setTimeout(function() {
        notification.classList.remove("animate");
        notification.innerHTML = '';
        clearForm();

        if (window.location.href.endsWith('board.html')) {
            closeAddTask();
            displayAllTasks();
        } else {
            window.location.href = "board.html";
        }
    }, 1000);
}

/** Creates new category option element, sets text to provided category and adds eventlistener */
function createCategoryOption(category, itemsDiv, selectedDiv, dropdown) {
    let optionDiv = document.createElement('div');
    optionDiv.textContent = category;
    optionDiv.addEventListener('click', function (event) {
        handleCategoryClick(event, category, selectedDiv, dropdown, itemsDiv);
    });
    itemsDiv.appendChild(optionDiv);
}

/** Hides error message for category section */
function hideCategoryError() {
    let errorElement = document.getElementById('category-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

/** Appends new category option from Array to dropdown */
function renderCategories() {
    let dropdown = document.getElementById('choose-category');
    let itemsDiv = dropdown.querySelector('.select-items');
    let selectedDiv = dropdown.querySelector('.select-selected');

    itemsDiv.innerHTML = '';

    for (let i = 0; i < testCategories.length; i++) {
        let category = testCategories[i];
        createCategoryOption(category, itemsDiv, selectedDiv, dropdown);
    }
}

/** Resets dropdown menu by removing value and setting placeholder text */
function resetCategorySelection() {
    let dropdown = document.getElementById('choose-category');
    dropdown.removeAttribute('data-value'); 
    let selectedDiv = dropdown.querySelector('.select-selected');
    selectedDiv.textContent = 'Select task category'; 
    resetFieldStyle(dropdown); 
}

/** Resets every field of the form and sets prio to medium */
function clearForm() {
    document.getElementById('add-task').reset();
    chooseMediumPrio(); 
    clearAssignedContacts();
    resetCategorySelection();
    clearSubtasks();
}

/** Toggles visibility of dropdown either forcing it to close if forceClose is true or staying open */
function toggleDropdown(elementId, forceClose = false) {
    let dropdown = document.getElementById(elementId);
    let itemsDiv = dropdown.querySelector('.select-items');
    let isOpen = !itemsDiv.classList.contains('select-hide');
    let action = forceClose || isOpen ? 'add' : 'remove';

    toggleElement(itemsDiv, action, 'select-hide');
    let assignedToId = getAssignedToId();
    if (elementId === assignedToId) {
        toggleAssignedTo(dropdown, action);
    }

    let state = action === 'add' ? 'close' : 'open';
    changeDropdownImg(elementId, state);
}

/**
 * Toggles a class on an HTML element based on the provided action.
 *
 * @param {HTMLElement} element - The HTML element to toggle the class on.
 * @param {string} action - The action to perform. Should be either 'add' or 'remove'.
 * @param {string} className - The class to add or remove.
 */
function toggleElement(element, action, className) {
    element.classList[action](className);
}

/** Toggles visibility of contact search input */
function toggleAssignedTo(dropdown, action) {
    let searchInput = document.getElementById('contact-search-input');
    let selectSelected = dropdown.querySelector('.select-selected');

    toggleElement(searchInput, action, 'select-hide');
    selectSelected.style.display = action === 'add' ? 'block' : 'none';
    if (action === 'remove') searchInput.focus();
}

/** Toggles dropdown img between up and down */
function changeDropdownImg(elementId, state) {
    let imgId = elementId === 'choose-category' ? 'img-dropdown-cat' : 'img-dropdown';
    let img = document.getElementById(imgId);
    if (img) {
        img.src = state === 'open' ? "assets/img/addtask_dropdown_up.svg" : "assets/img/addtask_dropdown.svg";
    }
}