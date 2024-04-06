/**
 * Handles click event on task.
 * Gets task from tasks data using given index, gets overlay container,
 * renders task overlay HTML, activates overlay, and shows overlay container.
 *
 * @param {number} index - Index of task in tasks data.
 */
function handleTaskClick(index) {
    let task = tasksData[index];
    let overlayContainer = document.getElementById('edit-task-overlay');
    
    renderTaskOverlayHTML(task, index);
    activateOverlay(overlayContainer);
    overlayContainer.style.display = 'block'; 
}

/** Deactivates overlay by removing active class and hiding container */
function deactivateOverlay(container) {
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.remove('active');
    body.style.overflow = 'auto';
    container.style.display = 'none'; 
}

/** Clears innerHTML of specified container */
function clearOverlayContent(container) {
    container.innerHTML = '';
}

/** Sets editMode to false and closes overlay */
function closeTaskOverlay() {
    isEditMode = false;
    let overlayContainer = document.getElementById('edit-task-overlay');

    deactivateOverlay(overlayContainer);
    clearOverlayContent(overlayContainer);
    displayAllTasks();
    checkAllSections();
}

/** Generates HTML for each subtask */
function generateSubtasksHtml(task, index) {
    return task.subtasks.map((subtask, subtaskIndex) => {
        let subtaskId = `edit-subtask-${index}-${subtaskIndex}`;
        return renderEditSubtaskHTML(subtask.title, subtaskId, subtask.completed);
    }).join('');
}

/** Sets task to edit mode */
function openEditTask(index) {
    isEditMode = true;
    let editOverlay = document.getElementById('edit-task-overlay');
    let task = tasksData[index];

    if (!task || !task.assignedTo) {
        return; 
    }

    let assignedContactsHtml = generateAssignedContactsHtml(task);
    let subtasksHtml = generateSubtasksHtml(task, index);
    let htmlContent = renderEditTaskOverlayHTML(task, assignedContactsHtml, subtasksHtml, index);
    editOverlay.innerHTML = htmlContent;

    setupEventListenersForItemsDiv();
    initializeSelectedContacts(task);
    setupSubtaskEventListeners();
    initializePrioritySelectionInEditMode(task.priority);
    getAssignedToId();
}

/** Checks the chosen priority in edit Mode  */
function initializePrioritySelectionInEditMode(taskPriority) {
    setPriority(taskPriority, true);
}


/** Updates task at specified index */
async function saveEditedTask(index){
    let task = tasksData[index]; 
    task.title = document.getElementById('edit-title').value;
    task.description = document.getElementById('edit-description').value;
    task.dueDate = document.getElementById('due-date').value;
    task.priority = editedTaskPriority || "medium";
    task.assignedTo = transformSelectedContactsToAssignedTo(selectedContacts);
    task.subtasks = prepareSubtasks(task.id);

    await saveTasksToServer();
    addBoardAnimation("Task was updated", "assets/img/addtask_check_white.svg");
    setTimeout(closeTaskOverlay, 1500);
}

/** Deletes task from storage */
async function deleteTask(index) {
    tasksData.splice(index, 1);
    await saveTasksToServer();
    addBoardAnimation("Task was deleted", "assets/img/delete_blue.svg");
    setTimeout(closeTaskOverlay, 1500);
}

/**
 * Adds an animation to the board with a notification message and an image.
 * @param {string} text - The notification message to display.
 * @param {string} imgSrc - The source URL of the image to display.
 */
function addBoardAnimation(text, imgSrc) {
    let notification = document.getElementById('notification-container-edit');

    if (notification) {
        notification.innerHTML = renderNotificationHTML(text, imgSrc);
        notification.classList.add("animate");

        setTimeout(() => {
            notification.classList.remove("animate");
            notification.innerHTML = '';
        }, 2000);
    }
}

/**
 * Opens task addition form with given progress status.
 * If mobile view should be displayed or if overlay is already open, function returns early.
 * Else, it prepares board for new task, activates overlay, and loads task form.
 *
 * @param {string} progressStatus - progress status of new task.
 */
function openAddTask(progressStatus) {
    if (shouldRedirectToMobileView()) return;

    if (isOverlayOpen) return;
    prepareBoardForNewTask();
    selectedContacts = {};

    let container = document.getElementById('add-task-container-board');
    activateOverlay(container);
    loadTaskForm(container, progressStatus);
}

/**
 * Checks if window's inner width is below 1000 pixels.
 * If so, redirects to 'add_task.html'
 *
 * @returns {boolean} - True if window's inner width is below 1000 pixels, false otherwise.
 */
function shouldRedirectToMobileView() {
    if (window.innerWidth < 1000) {
        window.location.href = 'add_task.html';
        return true;
    }
    return false;
}

/**
 * Prepares board for new task by populating columns with tasks,
 * checking all sections, and setting overlay open to true.
 */
function prepareBoardForNewTask() {
    populateColumnsWithTasks(sections);
    checkAllSections();
    isOverlayOpen = true;
}

/**
 * Activates overlay by adding 'active' class to overlay and container,
 * removing 'closing' class and setting body's overflow to 'hidden'.
 *
 * @param {HTMLElement} container - container element to activate.
 */
function activateOverlay(container) {
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    container.classList.remove('closing');
    container.classList.add('active');
}

/**
 * Loads task form into given container and activates it with given progress status.
 * After HTML is included, it activates container and renders task form.
 *
 * @param {HTMLElement} container - container element to load task form into.
 * @param {string} progressStatus - progress status to activate container with.
 */
function loadTaskForm(container, progressStatus) {
    container.setAttribute('w3-include-html', 'assets/templates/task-form.html');

    includeHTML().then(() => {
        activateContainer(progressStatus);
        renderAddTask();
    });
}

/**
 * Activates container by setting its display style to 'block',
 * adding a click event listener to the close button that calls 'closeAddTask' function once,
 * and setting container's 'data-progress-status' attribute to the given progress status.
 *
 * @param {string} progressStatus - progress status to set on container.
 */
function activateContainer(progressStatus) {
    let container = document.getElementById('add-task-container-board');
    container.style.display = 'block';

    let closeButton = document.getElementById('close-task-btn');
    if (closeButton) {
        closeButton.addEventListener('click', closeAddTask, { once: true });
    }
    container.setAttribute('data-progress-status', progressStatus);
}

/**
 * Closes task addition form if overlay is open.
 * Populates columns with tasks, checks all sections, adds 'closing' class to container,
 * removes 'active' class from overlay, resets body's overflow style,
 * removes 'w3-include-html' attribute from container, and sets overlay open to false.
 */
function closeAddTask() {
    if (!isOverlayOpen) return;
    populateColumnsWithTasks(sections)
    checkAllSections();

    let container = document.getElementById('add-task-container-board');
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    container.classList.add('closing');
    overlay.classList.remove('active');
    body.style.overflow = '';
    container.removeAttribute('w3-include-html');

    isOverlayOpen = false; 
}

/**
 * Adds subtask to task being edited.
 * Gets subtask input value and if not empty, calculates task and subtask indices,
 * generates subtask ID, and appends rendered subtask HTML to subtask container.
 * Clears subtask input and updates 'edit-icon-container' HTML.
 */
async function addEditSubtask() {
    let subtaskInput = document.getElementById('edit-subtasks'); 
    let subtaskValue = subtaskInput.value.trim();

    if (subtaskValue) {
        let taskIndex = tasksData.length - 1;  
        tasksData[taskIndex].subtasks.push({ title: subtaskValue, completed: false });
        await saveTasksToServer();  

        let subtasksHtml = generateSubtasksHtml(tasksData[taskIndex], taskIndex);
        document.getElementById('subtask-container').innerHTML = subtasksHtml;

        subtaskInput.value = ''; 
    }
}

/**
 * Removes subtask with given ID from DOM and updates tasks data in storage.
 *
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
 *
 * @param {string} subtaskId - The ID of the subtask to edit.
 */
function editEditSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let subtaskValue = subtaskElement.querySelector('li').textContent;
    subtaskElement.innerHTML = renderEditSubtaskInputHTML(subtaskValue, subtaskId);
}

/**
 * Saves edited subtask with given ID.
 * Gets input field and trimmed value, and if value is not empty,
 * gets subtask element and replaces HTML with rendered saved subtask HTML.
 *
 * @param {string} subtaskId - ID of subtask to save.
 */
function saveEditedEditSubtask(subtaskId) {
    let inputField = document.querySelector(`#${subtaskId} input`);
    let newValue = inputField.value.trim();
    if(newValue) {
        let subtaskElement = document.getElementById(subtaskId);
        subtaskElement.innerHTML = renderSavedEditSubtaskHTML(newValue, subtaskId);
    }
}

/** Clears all subtasks from subtask container by setting innerHTML to empty string. */
function clearEditSubtasks() {
    document.getElementById('subtask-container').innerHTML = '';
}

/**
 * Cancels editing of subtask with given ID.
 * Gets subtask element and its original value from dataset,
 * then replaces subtask element's HTML with rendered saved subtask HTML using original value.
 *
 * @param {string} subtaskId - ID of subtask to cancel editing.
 */
function cancelEditSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let originalValue = subtaskElement.dataset.originalValue;
    subtaskElement.innerHTML = renderSavedEditSubtaskHTML(originalValue, subtaskId);
}

/**
 * Returns HTML string for editable subtask input field.
 * Input field's value is set to given value, and it has onblur event handler that calls 'saveEditedEditSubtask'.
 * HTML also includes span with two images, one for removing the subtask and one for saving the edited subtask.
 *
 * @param {string} value - Value to set on input field.
 * @param {string} subtaskId - ID of subtask.
 * @returns {string} - HTML string for editable subtask input field.
 */
function renderEditSubtaskInputHTML(value, subtaskId) {
    return `
        <input type="text" value="${value}" onblur="saveEditedEditSubtask('${subtaskId}')">
        <span class="icon-container">
            <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
            <span>|</span>
            <img onclick="saveEditedEditSubtask('${subtaskId}')" src="assets/img/addtask_check.svg" alt="">
        </span>
    `;
}

/**
 * Returns HTML string for saved subtask.
 * Subtask includes list item with the given value and div with two images,
 * one for editing subtask and one for removing subtask.
 *
 * @param {string} value - Value of subtask.
 * @param {string} subtaskId - ID of subtask.
 * @returns {string} - HTML string for saved subtask.
 */
function renderSavedEditSubtaskHTML(value, subtaskId) {
    return `
        <li>${value}</li>
        <div class="subtask-icons">
            <img onclick="editEditSubtask('${subtaskId}')" src="assets/img/pencil_grey.svg" alt="">
            <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
        </div>
    `;
}

/**
 * Returns HTML string for subtask in edit mode.
 * Subtask includes list item with given title and a completed data attribute,
 * and div with two images, one for editing subtask and one for removing subtask.
 *
 * @param {string} subtaskTitle - Title of subtask.
 * @param {string} subtaskId - ID of subtask.
 * @param {boolean} completed - Completion status of subtask.
 * @returns {string} - HTML string for subtask in edit mode.
 */
function renderEditSubtaskHTML(subtaskTitle, subtaskId, completed) {
    return /*html*/ `
        <div id="${subtaskId}" class="subtask">
            <ul>
                <li data-completed="${completed}">${subtaskTitle}</li>
            </ul>
            <div class="subtask-icons">
                <img onclick="editEditSubtask('${subtaskId}')" src="assets/img/pencil_grey.svg" alt="Edit">
                <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="Delete">
            </div>
        </div>`;
}

/**
 * Opens mini task menu for task at given index.
 * Stops propagation of click event, hides mini task content, and shows mini task menu.
 *
 * @param {Event} event - Click event.
 * @param {number} index - Index of the task.
 */
function openMinitaskMenu(event, index) {
    event.stopPropagation();
    let minitaskContent = document.getElementById(`mini-task-content${index}`);
    minitaskContent.style.display = 'none';
    let minitaskMenu = document.getElementById(`mini-task-menu${index}`);
    minitaskMenu.style.display = 'block';
}

/**
 * Closes mini task menu for task at given index.
 * Stops propagation of click event, hides mini task menu, and shows mini task content.
 *
 * @param {Event} event - Click event.
 * @param {number} index - Index of task.
 */
function closeMinitaskMenu(event, index) {
    event.stopPropagation();
    let minitaskMenu = document.getElementById(`mini-task-menu${index}`);
    minitaskMenu.style.display = 'none';
    let minitaskContent = document.getElementById(`mini-task-content${index}`);
    minitaskContent.style.display = 'block';
}