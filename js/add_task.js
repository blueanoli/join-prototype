function init() {
    includeHTML();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function chooseUrgentPrio() {
    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");

    urgent.classList.add("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent_white.svg";

    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");
    medium.classList.remove("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium.svg";

    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");
    low.classList.remove("low-priority-active");
    lowimg.src = "assets/img/addtask_low.svg";
}

function chooseMediumPrio() {
    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");

    medium.classList.add("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium_white.svg";

    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");
    urgent.classList.remove("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent.svg";

    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");
    low.classList.remove("low-priority-active");
    lowimg.src = "assets/img/addtask_low.svg";
}

function chooseLowPrio() {
    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");

    low.classList.add("low-priority-active");
    lowimg.src = "assets/img/addtask_low_white.svg";

    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");
    urgent.classList.remove("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent.svg";

    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");
    medium.classList.remove("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium.svg";
}

function clearForm() {
    document.getElementById('add-task').reset();
    document.getElementById("priority-urgent").classList.remove("urgent-priority-active");
    document.getElementById("priority-medium").classList.remove("medium-priority-active");
    document.getElementById("priority-low").classList.remove("low-priority-active");
    document.getElementById("img-urgent").src = "assets/img/addtask_urgent.svg";
    document.getElementById("img-medium").src = "assets/img/addtask_medium.svg";
    document.getElementById("img-low").src = "assets/img/addtask_low.svg";
    document.getElementById("add-task-btn").disabled = true;
}

function addTask() {
    window.location.href = 'board.html';
}

function addSubtask(){
    let subtask = document.getElementById('subtasks').value;
    let subtaskcontainer = document.getElementById('subtask-container');

    subtaskcontainer.innerHTML += /*html*/ `
    <div class="subtask">
        <ul>
            <li>${subtask}</li>
        </ul>
        <div class="subtask-icons">
            <img onclick="editSubtask()" class="icon-plus" src="assets/img/pencil_grey.svg" alt="">
            <div class="subtask-line"></div>
            <img onclick="removeSubtask()" class="icon-plus" src="assets/img/delete.svg" alt="">
        </div>
    </div>
    `;
    document.getElementById('subtasks').value = '';
}