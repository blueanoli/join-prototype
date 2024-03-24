function renderNotificationHTML() {
    return /*html*/ `
    <div class="notification">
        <p>Task added to board</p>
        <img src="assets/img/board_grey.svg" alt="Board">
    </div>
    `;
}

function renderSubtaskHTML(subtask, subtaskId) {
    return /*html*/ `
    <div id="${subtaskId}" class="subtask">
        <ul>
            <li>${subtask}</li>
        </ul>
        <div class="subtask-icons">
            <img onclick="editSubtask('${subtaskId}')" src="assets/img/pencil_grey.svg" alt="">
            <div class="subtask-line"></div>
            <img onclick="removeSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
        </div>
    </div>`;
}

function renderSubtaskListHTML(subtaskText, subtaskId) {
    return /*html*/`
        <div class="edit-subtask-container">
        <input type="text" value="${subtaskText}" id="edit-${subtaskId}">
        <span class="icon-container">
            <img onclick="removeSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
            <span>|</span>
            <img onclick="saveEditedSubtask('${subtaskId}')" src="assets/img/addtask_check.svg" alt="">
        </span>
        </div>`;
}

function renderSubtaskIconHTML() {
    return /*html*/`
    <img onclick="cancelSubtask()" class="icon-cancel" src="assets/img/cancel_dark.svg" alt="">
    <div class="subtask-line"></div>
    <img onclick="addSubtask()" class="icon-confirm" src="assets/img/addtask_check.svg" alt="">`;
}

function renderContactHTML(contact, color, initials, checkboxImage) {
    return /*html*/ `
        <div class="test-contact-container">
            <p class="test-contact" style="background-color: ${color};">${initials}</p>
            ${contact} 
        </div>
        <img class="checkbox-icon" src="assets/img/${checkboxImage}">
    `;
}

function renderAssignedContactHTML(initials, color) {
    return /*html*/`
    <div class="assigned-contact">
        <div class="test-contact" style="background-color: ${color};">${initials}</div>
    </div>`;
}

function renderContactOptionHTML(contact, color, initials, checkboxImage, selectedClass, backgroundColorStyle, index){
    return /*html*/`
        <div class='option-item${selectedClass}' id='contact-${index}'${backgroundColorStyle}>
            ${renderContactHTML(contact, color, initials, checkboxImage)}
        </div>
`;
}