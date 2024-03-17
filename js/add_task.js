let subtaskCounter = 0;

function init() {
    includeHTML();
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

function clearForm() {
    document.getElementById('add-task').reset();
    document.getElementById("add-task-btn").disabled = true;

    removeUrgentPrio();
    removeMediumPrio();
    removeLowPrio();
}

function addTask() {
    let notification = document.getElementById('notification-container');

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

function removeSubtask(subtaskId){
    let subtaskElement = document.getElementById(subtaskId);
    if(subtaskElement) {
        subtaskElement.remove(); 
    }
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