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
    }
}

function editSubtask(subtaskId) {
    let subtaskDiv = document.getElementById(subtaskId);
    subtaskDiv.classList.add('editing');

    let subtaskLi = subtaskDiv.querySelector('li');
    let subtaskText = subtaskLi.innerText;

    subtaskLi.innerHTML = renderSubtaskListHTML(subtaskText, subtaskId);

    document.getElementById(`edit-${subtaskId}`).focus();
}

function saveEditedSubtask(subtaskId) {
    let subtaskDiv = document.getElementById(subtaskId);
    let inputField = document.getElementById(`edit-${subtaskId}`);
    let newValue = inputField.value;

    subtaskDiv.querySelector('li').innerText = newValue;
    subtaskDiv.classList.remove('editing');
}