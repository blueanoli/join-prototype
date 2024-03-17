let subtaskCounter = 0;
let contacts = ['Max Mustermann', 'Susi Sonne'];

/**
 * Initializes the script by including HTML content dynamically.
 */
function init() {
    includeHTML();
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

    contacts.forEach(contact => {
        let optionDiv = document.createElement(`div`);
        optionDiv.innerHTML = /*html*/ `
        ${contact} <img id="img-checkbox" onclick="assignContact('${contact}')" src="assets/img/checkboxempty.svg">
        `;
        optionDiv.addEventListener('click', function() {
            selectedDiv.innerHTML = `${contact}`;
            itemsDiv.classList.add('select-hide');
            changeDropdownImg('close');
        });
        itemsDiv.appendChild(optionDiv);
    });
}

function assignContact(contact) {
    let assignedTo = document.getElementById('assign-contacts');
    assignedTo.innerHTML += /*html*/ `
    <div class="assigned-contact">${contact}</div>
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

function toggleDropdown() {
    let itemsDiv = document.getElementById('assigned-to').querySelector('.select-items');
    itemsDiv.classList.toggle('select-hide');
    changeDropdownImg(itemsDiv.classList.contains('select-hide') ? 'close' : 'open');
}

function changeDropdownImg(state) {
    let img = document.getElementById("img-dropdown");
    img.src = state === 'open' ? "assets/img/addtask_dropdown_up.svg" : "assets/img/addtask_dropdown.svg";
}

document.getElementById('assigned-to').addEventListener('click', function(e) {
    e.stopPropagation();
});