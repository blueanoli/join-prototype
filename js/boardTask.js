/**
 * Handles click event on task.
 * Gets task from tasks data using given index, gets overlay container,
 * renders task overlay HTML, activates overlay, and shows overlay container.
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
    isOverlayOpen = false;
}

/** Clears innerHTML of specified container */
function clearOverlayContent(container) {
    container.innerHTML = '';
}

/** Sets editMode to false and closes overlay */
function closeTaskOverlay() {
    isEditMode = false;
    let overlayContainer = document.getElementById('edit-task-overlay');

    if (originalTask) {
        tasksData[originalTask.index] = originalTask.data;
        originalTask = null;
    }

    deactivateOverlay(overlayContainer);
    clearOverlayContent(overlayContainer);
    displayAllTasks();
    checkAllSections();
}

/** Generates HTML for each subtask */
function generateSubtasksHtml(task) {
    return task.subtasks.map((subtask) => {
        // Stelle sicher, dass jede Subtask eine eindeutige ID basierend auf der aktuellen Zeit erhält.
        if (!subtask.id) {
            subtask.id = `edit-subtask-${task.id}-${Date.now()}`;
        }
        return renderEditSubtaskHTML(subtask.title, subtask.id, subtask.completed);
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
    setupDropdownCloseListener();
    initializePrioritySelectionInEditMode(task.priority);
    getAssignedToId();
}

/** Checks the chosen priority in edit Mode  */
function initializePrioritySelectionInEditMode(taskPriority) {
    setPriority(taskPriority, true);
}

/** Updates task details at specified index */
async function updateTaskDetails(index) {
    let task = tasksData[index];
    task.title = document.getElementById('edit-title').value;
    task.description = document.getElementById('edit-description').value;
    task.dueDate = document.getElementById('due-date').value;
    task.priority = editedTaskPriority || "medium";
    task.assignedTo = transformSelectedContactsToAssignedTo(selectedContacts);
    task.subtasks = prepareSubtasks(task.id);
    return task;
}

/** Prepares subtasks for task with given ID */
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

/** Saves changes to task and closes overlay */
async function saveEditedTask(index) {
    let task = await updateTaskDetails(index);
    if (!validateTask(task)) {
        return;
    }

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
 * @param {string} progressStatus - progress status of new task.
 */
function openAddTask(progressStatus) {
    if (shouldRedirectToMobileView()) return;
    if (isOverlayOpen) return;

    let container = document.getElementById('add-task-container-board');
    activateOverlay(container);
    loadTaskForm(container, progressStatus);
}

/**
 * Checks if window's inner width is below 1000 pixels.
 * If so, redirects to 'add_task.html'
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
 * @param {HTMLElement} container - container element to activate.
 */
function activateOverlay(container) {
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    container.classList.remove('closing');
    container.classList.add('active');
    isOverlayOpen = true;

    setTimeout(() => {
        prepareBoardForNewTask();
    }, 250);
}

/**
 * Loads task form into given container and activates it with given progress status.
 * After HTML is included, it activates container and renders task form.
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
 * removes 'active' class from overlay, resets body's overflow style, removes 'w3-include-html' attribute from container, and sets overlay open to false.
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
    selectedContacts = {};
}

/**
 * Adds subtask to task being edited. Gets subtask input value and if not empty, calculates task and subtask indices,
 * generates subtask ID, and appends rendered subtask HTML to subtask container.
 * Clears subtask input and updates 'edit-icon-container' HTML.
 */
async function addEditSubtask(taskIndex) {
    if (taskIndex === undefined || taskIndex < 0 || taskIndex >= tasksData.length) {
        return;
    }

    let task = tasksData[taskIndex];
    if (!task) {
        return;
    }

    let subtaskInput = document.getElementById('edit-subtasks');
    let subtaskValue = subtaskInput.value.trim();

    if (subtaskValue) {
        let newSubtaskId = `subtask-${task.id}-${Date.now()}`;
        let newSubtask = {
            id: newSubtaskId,
            title: subtaskValue,
            completed: false
        };

        task.subtasks.push(newSubtask);
        await saveTasksToServer();

        let newSubtaskHtml = renderEditSubtaskHTML(newSubtask.title, newSubtask.id, newSubtask.completed);
        document.getElementById('subtask-container').insertAdjacentHTML('beforeend', newSubtaskHtml);
        subtaskInput.value = '';
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
    if (newValue) {
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
function cancelEditSubtask() {
    let subtaskElement = document.getElementById('edit-subtasks');
    subtaskElement.value = '';
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