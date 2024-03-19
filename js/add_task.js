let subtaskCounter = 0;
let testContacts = ['Max Mustermann', 'Susi Sonne'];
let testCategories = ['Technical Task', 'User Story'];

function checkRequiredField() {
    let fields = [
        {id: 'title', errorId: 'title-error'},
        {id: 'due-date', errorId: 'due-date-error'},
        {id: 'choose-category', errorId: 'category-error', isDiv: true},
    ];

    fields.forEach(field => {
        let inputElement = document.getElementById(field.id);
        let errorMessage = document.getElementById(field.errorId);

        let isFieldEmpty;

        if (field.isDiv) {
            isFieldEmpty = !inputElement.getAttribute('data-value');
        } else {
            isFieldEmpty = inputElement.value.trim() === '';
        }

        if (isFieldEmpty) {
            inputElement.classList.add('input-error');
            errorMessage.style.display = 'block';
        } else {
            inputElement.classList.remove('input-error');
            errorMessage.style.display = 'none';
        }
    });
}


function resetFieldStyle(element) {
    element.classList.remove('input-error');

    let errorId = element.id + '-error';
    let errorElement = document.getElementById(errorId);

    if (errorElement) { 
        errorElement.style.display = 'none';
    }
}

/**
 * Sets the task priority to urgent by updating the UI elements' class and image source accordingly.
 * It also removes the medium and low priority indicators if they are active.
 */
function chooseUrgentPrio() {
    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");

    urgent.classList.add("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent_white.svg";

    removeMediumPrio();
    removeLowPrio();
}

/**
 * Sets the task priority to medium by updating the UI elements' class and image source accordingly.
 * It also removes the low and urgent priority indicators if they are active.
 */
function chooseMediumPrio() {
    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");

    medium.classList.add("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium_white.svg";

    removeLowPrio();
    removeUrgentPrio();
}

/**
 * Sets the task priority to low by updating the UI elements' class and image source accordingly.
 * It also removes the medium and urgent priority indicators if they are active.
 */
function chooseLowPrio() {
    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");

    low.classList.add("low-priority-active");
    lowimg.src = "assets/img/addtask_low_white.svg";

    removeMediumPrio();
    removeUrgentPrio();
}

/**
 * Clears the task form, resets priority indicators and disables the add task button.
 */
function clearForm() {
    document.getElementById('add-task').reset();
    document.getElementById("add-task-btn").disabled = true;

    removeUrgentPrio();
    removeMediumPrio();
    removeLowPrio();
}

/**
 * Adds a new task and displays a notification for a brief period before navigating to the board page.
 */
function addTask() {
    let notification = document.getElementById('notification-container');

    checkRequiredField();

    let isErrorVisible = Array.from(document.querySelectorAll('.error-message')).some(element => element.style.display === 'block');

    if (isErrorVisible) {
        return; 
    }

    notification.classList.add("animate");
    notification.innerHTML = /*html*/ `
    <div class="notification">
        <p>Task added to board</p>
        <img src="assets/img/board_grey.svg" alt="Board">
    </div>
    `;

    setTimeout(() => {
        notification.classList.remove("animate");
        notification.innerHTML = '';
        clearForm();
        window.location.href = "board.html";
    }, 1000);
}


/**
 * Adds a subtask to the task form.
 * Each subtask is assigned a unique ID and can be edited or removed.
 */
function addSubtask(){
    let subtask = document.getElementById('subtasks').value;
    let subtaskcontainer = document.getElementById('subtask-container');
    let subtaskId = 'subtask-' + subtaskCounter++; 

    subtaskcontainer.innerHTML += /*html*/ `
    <div id="${subtaskId}" class="subtask">
        <ul>
            <li>${subtask}</li>
        </ul>
        <div class="subtask-icons">
            <img onclick="editSubtask()" src="assets/img/pencil_grey.svg" alt="">
            <div class="subtask-line"></div>
            <img onclick="removeSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
        </div>
    </div>
    `;
    
    document.getElementById('subtasks').value = '';
}

/**
 * Removes a subtask from the task form based on its unique ID.
 * @param {string} subtaskId - The ID of the subtask to be removed.
 */
function removeSubtask(subtaskId){
    let subtaskElement = document.getElementById(subtaskId);
    if(subtaskElement) {
        subtaskElement.remove(); 
    }
}

/**
 * Populates the assigned-to select element with contact names.
 * Each contact is assigned a unique ID and can be edited or removed.
 * 
 */
function renderContacts() {
    let dropdown = document.getElementById('assigned-to');
    let itemsDiv = dropdown.querySelector('.select-items');
    let assignedTo = document.getElementById('assign-contacts').textContent; 

    itemsDiv.innerHTML = '';

    testContacts.forEach(contact => {
        let optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
  
        let isChecked = assignedTo.includes(contact);
        let checkboxImage = isChecked ? "checkboxchecked.svg" : "checkboxempty.svg";
        optionDiv.innerHTML = /*html*/` 
            <div class="test-contact-container">
            <p class="test-contact">MM</p>
            ${contact} 
            </div>
            <img class="checkbox-icon" src="assets/img/${checkboxImage}">`;

        optionDiv.addEventListener('click', function(event) {
            event.stopImmediatePropagation();
            let isCheckboxClicked = event.target.classList.contains('checkbox-icon');
            let checkbox = isCheckboxClicked ? event.target : this.querySelector('.checkbox-icon');

            if (checkbox.src.includes('checkboxempty')) {
                checkbox.src = "assets/img/checkboxchecked.svg";
                addAssignedContact(contact);
            } else {
                checkbox.src = "assets/img/checkboxempty.svg";
                removeAssignedContact(contact);
            }
        });

        itemsDiv.appendChild(optionDiv);
    });
}


function addAssignedContact(contact) {
    let assignedTo = document.getElementById('assign-contacts');
  
    if (!assignedTo.innerHTML.includes(contact)) {
        assignedTo.innerHTML += `<div class="assigned-contact">${contact}</div>`;
    }
}

function removeAssignedContact(contact) {
    let assignedTo = document.getElementById('assign-contacts');
 
    let contacts = assignedTo.querySelectorAll('.assigned-contact');
    contacts.forEach((elem) => {
        if (elem.textContent === contact) {
            elem.remove();
        }
    });
}

function renderCategories() {
    let dropdown = document.getElementById('choose-category');
    let itemsDiv = dropdown.querySelector('.select-items');
    let selectedDiv = dropdown.querySelector('.select-selected');

    itemsDiv.innerHTML = '';

    testCategories.forEach(category => {
        let optionDiv = document.createElement(`div`);
        optionDiv.textContent = category;
        optionDiv.addEventListener('click', function() {
            selectedDiv.textContent = category;
            dropdown.setAttribute('data-value', category); 
            itemsDiv.classList.add('select-hide');
            changeDropdownImgCat('close');
            resetFieldStyle(dropdown); 
        });
        itemsDiv.appendChild(optionDiv);
    });
}

// HILFSFUNKTIONEN
function removeMediumPrio(){
    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");
    medium.classList.remove("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium.svg";
}

function removeLowPrio(){
    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");
    low.classList.remove("low-priority-active");
    lowimg.src = "assets/img/addtask_low.svg";
}

function removeUrgentPrio(){
    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");
    urgent.classList.remove("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent.svg";
}

function toggleDropdownAssign() {
    let itemsDiv = document.getElementById('assigned-to').querySelector('.select-items');
    itemsDiv.classList.toggle('select-hide');
    changeDropdownImgAssign(itemsDiv.classList.contains('select-hide') ? 'close' : 'open');
}

function changeDropdownImgAssign(state) {
    let img = document.getElementById("img-dropdown");
    img.src = state === 'open' ? "assets/img/addtask_dropdown_up.svg" : "assets/img/addtask_dropdown.svg";
}

function toggleDropdownCat() {
    let itemsDiv = document.getElementById('choose-category').querySelector('.select-items');
    itemsDiv.classList.toggle('select-hide');
    changeDropdownImgCat(itemsDiv.classList.contains('select-hide') ? 'close' : 'open');
}

function changeDropdownImgCat(state) {
    let img = document.getElementById("img-dropdown-cat");
    img.src = state === 'open' ? "assets/img/addtask_dropdown_up.svg" : "assets/img/addtask_dropdown.svg";
}