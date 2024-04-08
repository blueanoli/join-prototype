/**
* Returns string of HTML for notification, given notification text and image source.
*
* @param {string} text - Text for notification.
* @param {string} imgSrc - Source URL for notification image.
* @returns {string} - HTML string for notification.
*/
function renderNotificationHTML(text, imgSrc) {
    return /*html*/ `
    <div class="notification">
        <p>${text}</p>
        <img src="${imgSrc}" alt="Notification Icon">
    </div>
    `;
}

/**
* Returns string of HTML for subtask, given subtask text and id.
*
* @param {string} subtask - Text for subtask.
* @param {string} subtaskId - Id for subtask.
* @returns {string} - HTML string for subtask.
*/
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

/**
* Returns string of HTML for editable subtask list item, given subtask text and id.
*
* @param {string} subtaskText - Text for subtask.
* @returns {string} - HTML string for editable subtask list item.
*/
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

/** 
* Returns HTML for subtask icon
*/
function renderSubtaskIconHTML() {
    return /*html*/`
    <img onclick="cancelSubtask()" class="icon-cancel" src="assets/img/cancel_dark.svg" alt="">
    <div class="subtask-line"></div>
    <img onclick="addSubtask()" class="icon-confirm" src="assets/img/addtask_check.svg" alt="">`;
}

/** 
* Returns HTML that provides contact with name, color, initals and checkboximg
*/
function renderContactHTML(contact, color, initials, checkboxImage) {
    return /*html*/ `
        <div class="test-contact-container">
            <p class="test-contact" style="background-color: ${color};">${initials}</p>
            ${contact} 
        </div>
        <img class="checkbox-icon" src="assets/img/${checkboxImage}">
    `;
}

/** 
* Returns HTML for assigned contact
*/
function renderAssignedContactHTML(initials, color, contactName) {
    return /*html*/`
        <div class="assigned-contact" data-contact-name="${contactName}">
            <div class="test-contact" style="background-color: ${color};">${initials}</div>
        </div>`;
}


/**
* Returns HTML that provides contact option with contact details, selected class, backgroundcolor and index
*/
function renderContactOptionHTML(contact, color, initials, checkboxImage, selectedClass, backgroundColorStyle, index){
    return /*html*/`
        <div class='option-item${selectedClass}' id='contact-${index}'${backgroundColorStyle}>
            ${renderContactHTML(contact, color, initials, checkboxImage)}
        </div>
`;
}