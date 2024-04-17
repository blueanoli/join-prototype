/** 
* Adds new subtask to the subtask-container, resets input field and updates icon container
*/
function addSubtask() {
    let subtask = document.getElementById('subtasks').value;
    let subtaskcontainer = document.getElementById('subtask-container');
    let subtaskId = `subtask-${Date.now()}-${subtaskCounter++}`;

    subtaskcontainer.innerHTML += renderSubtaskHTML(subtask, subtaskId);

    cancelSubtask();
}

/** 
* Deletes subtask from subtask-container
* @param {string} subtaskId - ID of subtask to delete
*/
function removeSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    if (subtaskElement) {
        subtaskElement.remove();
        subtaskCounter--;
    }
    document.getElementById('subtask-container').style.overflowY = 'auto';
}

/** 
* Sets subtask to editing mode
* @param {string} subtaskId - ID of subtask to edit
*/
function editSubtask(subtaskId) {
    let subtaskDiv = document.getElementById(subtaskId);
    subtaskDiv.classList.add('editing');
    let subtaskText = subtaskDiv.innerText;

    document.getElementById('subtask-container').style.overflowY = 'hidden';
    subtaskDiv.innerHTML = renderSubtaskListHTML(subtaskText, subtaskId);
    document.getElementById(`edit-${subtaskId}`).focus();
}

/**
*  Saves edited value of subtask and updates HTML
* @param {string} subtaskId - ID of subtask to save
*/
function saveEditedSubtask(subtaskId) {
    let subtaskDiv = document.getElementById(subtaskId);
    let inputField = document.getElementById(`edit-${subtaskId}`);
    let newValue = inputField.value;

    subtaskDiv.innerHTML = `
        <ul>
            <li>${newValue}</li>
        </ul>
        <div class="subtask-icons">
            <img onclick="editSubtask('${subtaskId}')" src="assets/img/pencil_grey.svg" alt="">
            <div class="subtask-line"></div>
            <img onclick="removeSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
        </div>
    `;
    subtaskDiv.classList.remove('editing');
    document.getElementById('subtask-container').style.overflowY = 'auto';
}

/** 
* Clears all content of subtask-container
*/
function clearSubtasks() {
    let subtaskContainer = document.getElementById('subtask-container');
    subtaskContainer.innerHTML = '';
    subtaskCounter = 0;
}

/**
*  Resets subtask input field
*/
function cancelSubtask() {
    document.getElementById('subtasks').value = '';
    document.getElementById('icon-container').innerHTML = `
        <img class="icon-plus" src="assets/img/addtask_plus.svg" alt="">
    `;
}