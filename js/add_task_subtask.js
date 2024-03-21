function addSubtask() {
    let subtask = document.getElementById('subtasks').value;
    let subtaskcontainer = document.getElementById('subtask-container');
    let subtaskId = 'subtask-' + subtaskCounter++;

    subtaskcontainer.innerHTML += renderSubtaskHTML(subtask, subtaskId);

    document.getElementById('subtasks').value = '';
}

function removeSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    if (subtaskElement) {
        subtaskElement.remove();
        subtaskCounter--;
    }
}

function editSubtask(subtaskId) {
    let subtaskDiv = document.getElementById(subtaskId);
    subtaskDiv.classList.add('editing');
    let subtaskText = subtaskDiv.innerText;

    subtaskDiv.innerHTML = renderSubtaskListHTML(subtaskText, subtaskId);

    document.getElementById(`edit-${subtaskId}`).focus();
}

function saveEditedSubtask(subtaskId) {
    let subtaskDiv = document.getElementById(subtaskId);
    let inputField = document.getElementById(`edit-${subtaskId}`);
    let newValue = inputField.value;

    subtaskDiv.innerText = newValue;
    subtaskDiv.classList.remove('editing');
}

function clearSubtasks() {
    let subtaskContainer = document.getElementById('subtask-container');
    subtaskContainer.innerHTML = '';
    subtaskCounter = 0; 
}