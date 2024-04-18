/** 
 * Generates HTML for each subtask 
 * @param(task) - task to generate subtasks for
*/
function generateSubtasksHtml(task) {
    return task.subtasks.map((subtask) => {
        // Stelle sicher, dass jede Subtask eine eindeutige ID basierend auf der aktuellen Zeit erhält.
        if (!subtask.id) {
            subtask.id = `edit-subtask-${task.id}-${Date.now()}`;
        }
        return renderEditSubtaskHTML(subtask.title, subtask.id, subtask.completed);
    }).join('');
}

/** 
 * Prepares subtasks for task with given ID
 * @param(task) - ID of task to prepare subtasks for
 */
function validateTask(task) {
    if (!task.title.trim()) {
        addBoardAnimation("Task title cannot be empty", "assets/img/cancel_white.svg");
        titleInput.scrollIntoView({ behavior: 'smooth' });
        return false;
    }

    if (!checkDueDate(task.dueDate)) {
        addBoardAnimation("Due date can't be in the past", "assets/img/cancel_white.svg");
        return false;
    }

    return true;
}

/**
 * Retrieves the trimmed value of the subtask input.
 * @returns {string} The trimmed input value.
 */
function getSubtaskInputValue() {
    let subtaskInput = document.getElementById('edit-subtasks');
    return subtaskInput.value.trim();
}

/**
 * Creates a new subtask.
 * @param {Object} task - The task object.
 * @param {string} subtaskValue - The value of the subtask.
 * @returns {Object} The new subtask object.
 */
function createNewSubtask(task, subtaskValue) {
    let newSubtaskId = `subtask-${task.id}-${Date.now()}`;
    return {
        id: newSubtaskId,
        title: subtaskValue,
        completed: false
    };
}

/**
 * Adds a new subtask to the DOM.
 * @param {Object} newSubtask - The new subtask object.
 */
function addNewSubtaskToDOM(newSubtask) {
    let newSubtaskHtml = renderEditSubtaskHTML(newSubtask.title, newSubtask.id, newSubtask.completed);
    document.getElementById('subtask-container').insertAdjacentHTML('beforeend', newSubtaskHtml);
}

/**
 * Clears the subtask input field.
 */
function clearSubtaskInput() {
    let subtaskInput = document.getElementById('edit-subtasks');
    subtaskInput.value = '';
}

/**
 * Adds subtask to task being edited. Gets subtask input value and if not empty, calculates task and subtask indices,
 * generates subtask ID, and appends rendered subtask HTML to subtask container. Clears subtask input and updates 'edit-icon-container' HTML.
 * @param {number} taskIndex - Index of task being edited.
 */
function addEditSubtask(taskIndex) {
    let task = validateAndFetchTask(taskIndex);
    if (!task) {
        return;
    }
    let subtaskValue = getSubtaskInputValue();
    createAndAddSubtask(task, subtaskValue);
}

/**
 * Validates the task index and fetches the task.
 *
 * @param {number} taskIndex - The index of the task.
 * @returns {Object|null} The task object or null if invalid index or task not found.
 */
function validateAndFetchTask(taskIndex) {
    if (!validateTaskIndex(taskIndex)) {
        return null;
    }
    let task = getTask(taskIndex);
    if (!task) {
        return null;
    }
    return task;
}

/**
 * Creates a new subtask and adds it to the DOM if the subtask value is not empty.
 *
 * @param {Object} task - The task object.
 * @param {string} subtaskValue - The value of the subtask.
 */
function createAndAddSubtask(task, subtaskValue) {
    if (subtaskValue) {
        let newSubtask = createNewSubtask(task, subtaskValue);
        addNewSubtaskToDOM(newSubtask);
        clearSubtaskInput();
    }
}

/**
 * Removes subtask with given ID from DOM and updates tasks data in storage.
 * @param {string} subtaskId - ID of subtask to remove.
 */
async function removeEditSubtask(subtaskId) {
    let subtask = document.getElementById(subtaskId);
    subtask.remove();
    await saveTasksToServer();
}

/**
 * Edits subtask with given ID and gets subtask element and value, then replaces subtask element's HTML
 * with rendered subtask input HTML.
 * @param {string} subtaskId - The ID of the subtask to edit.
 */
function editEditSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let subtaskValue = subtaskElement.querySelector('li').textContent;
    subtaskElement.innerHTML = renderEditSubtaskInputHTML(subtaskValue, subtaskId);
}

/**
 * Saves edited subtask with given ID.
 * Gets input field and trimmed value, and if value is not empty, gets subtask element and replaces HTML with rendered saved subtask HTML.
 * @param {string} subtaskId - ID of subtask to save.
 */
function saveEditedEditSubtask(subtaskId) {
    let inputField = document.querySelector(`#${subtaskId} input`);
    let newValue = inputField.value.trim();
    if (newValue) {
        let subtaskElement = document.getElementById(subtaskId);
        subtaskElement.innerHTML = renderSavedEditSubtaskHTML(newValue, subtaskId);
    }
}

/** 
 * Clears all subtasks from subtask container by setting innerHTML to empty string.
*/
function clearEditSubtasks() {
    document.getElementById('subtask-container').innerHTML = '';
}

/**
 * Cancels editing of subtask with given ID.
 * Gets subtask element and its original value from dataset,
 * then replaces subtask element's HTML with rendered saved subtask HTML using original value.
 * @param {string} subtaskId - ID of subtask to cancel editing.
 */
function cancelEditSubtask() {
    let subtaskElement = document.getElementById('edit-subtasks');
    subtaskElement.value = '';
}
