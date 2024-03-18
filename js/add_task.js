let subtaskCounter = 0;
let testContacts = ['Max Mustermann', 'Susi Sonne'];
let testCategories = ['Technical Task', 'User Story'];

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

    if (notification.innerHTML !== '') {
        return;
    }else{
    notification.classList.add("animate");

    notification.innerHTML = /*html*/ `
    <div class="notification">
        <p>Task added to board</p>
        <img src="assets/img/board_grey.svg" alt="Board">
    </div>
    `;

    setTimeout(() => {
        notification.classList.remove("animate");
        notification.innerHTML = ''
        clearForm();
        window.location.href = "board.html";
    }, 1000);
}
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
    let selectedDiv = dropdown.querySelector('.select-selected');

    itemsDiv.innerHTML = '';

    testContacts.forEach(testContacts => {
        let optionDiv = document.createElement(`div`);
        optionDiv.innerHTML = /*html*/ `
        ${testContacts} <img id="img-checkbox-con" onclick="assignContact('${testContacts}')" src="assets/img/checkboxempty.svg">
        `;
        optionDiv.addEventListener('click', function() {
            selectedDiv.innerHTML = `${testContacts}`;
            itemsDiv.classList.add('select-hide');
            changeDropdownImgAssign('close');
        });
        itemsDiv.appendChild(optionDiv);
    });
}

function assignContact(testContacts) {
    let assignedTo = document.getElementById('assign-contacts');
    assignedTo.innerHTML += /*html*/ `
    <div class="assigned-contact">${testContacts}</div>
    `;
}

function renderCategories() {
    let dropdown = document.getElementById('choose-category');
    let itemsDiv = dropdown.querySelector('.select-items');
    let selectedDiv = dropdown.querySelector('.select-selected');

    itemsDiv.innerHTML = '';

    testCategories.forEach(testCategories => {
        let optionDiv = document.createElement(`div`);
        optionDiv.innerHTML = /*html*/ `
        ${testCategories}
        `;
        optionDiv.addEventListener('click', function() {
            selectedDiv.innerHTML = `${testCategories}`;
            itemsDiv.classList.add('select-hide');
            changeDropdownImgCat('close');
        });
        itemsDiv.appendChild(optionDiv);
    });
}

function assignCategory(testCategories) {
    let taskCategory = document.getElementById('choose-category');
    taskCategory.innerHTML = /*html*/ `
    <div>${testCategories}</div>
    `;
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
}

function changeDropdownImgCat(state) {
    let img = document.getElementById("img-dropdown-cat");
    img.src = state === 'open' ? "assets/img/addtask_dropdown_up.svg" : "assets/img/addtask_dropdown.svg";
}