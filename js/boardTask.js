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

/**
 * Deactivates overlay by removing active class and hiding container
 * and sets body's overflow style to 'auto'.
 * @param {HTMLElement} container - container element to deactivate.
*/
function deactivateOverlay(container) {
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.remove('active');
    body.style.overflow = 'auto';
    container.style.display = 'none';
    isOverlayOpen = false;
}

/**
 * Clears innerHTML of specified container
 * @param {HTMLElement} container - container to clear
*/
function clearOverlayContent(container) {
    container.innerHTML = '';
}

/** 
 * Sets editMode to false and closes overlay
 * If original task exists, reverts task data to original task data
*/
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

/**
 * Sets up a listener for click events on the document. If the click event target is not within the edit overlay and the active overlay is not 'add-task', it closes the task overlay.
 */
function setupOverlayCloseListener() {
    document.addEventListener('click', function (event) {
        let editOverlay = document.getElementById('edit-task-overlay');
        let container = document.getElementById('add-task-container-board');
        if (container.getAttribute('data-active-overlay') === 'add-task') {
            return;
        } if (!editOverlay.contains(event.target)) {
            closeTaskOverlay();
        }
    }, true);
}

/** 
 * Sets task to edit mode 
 * @param(index) - index of task to edit
*/
function openEditTask(index) {
    prepareAndSetOverlayContent(index);
    setupListenersAndInitialize(index);
}

/**
 * Prepares and sets the overlay content for editing a task.
 *
 * @param {number} index - The index of the task.
 */
function prepareAndSetOverlayContent(index) {
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
}

/**
 * Sets up event listeners and initializes selected contacts, priority selection, and assigned ID for a task.
 *
 * @param {number} index - The index of the task.
 */
function setupListenersAndInitialize(index) {
    let task = tasksData[index];
    if (!task || !task.assignedTo) {
        return;
    }
    setupEventListenersForItemsDiv();
    initializeSelectedContacts(task);
    setupSubtaskEventListeners(index);
    setupDropdownCloseListener();
    initializePrioritySelectionInEditMode(task.priority);
    getAssignedToId();
}

/** 
 * Checks the chosen priority in edit Mode 
 * @param(taskPriority) - priority of task
 */
function initializePrioritySelectionInEditMode(taskPriority) {
    setPriority(taskPriority, true);
}

/** 
 * Updates task details at specified index 
 * @param(index) - index of task to update
*/
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

/** 
 * Saves changes to task and closes overlay 
 * @param(index) - index of task to save
 */
async function saveEditedTask(index) {
    let task = await updateTaskDetails(index);
    if (!validateTask(task)) {
        return;
    }

    await saveTasksToServer();
    addBoardAnimation("Task was updated", "assets/img/addtask_check_white.svg");
    setTimeout(closeTaskOverlay, 1500);
}

/** 
 * Deletes task from storage
 * @param(index) - index of task to delete
 */
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
 * Opens task addition form with given progress status.If mobile view should be displayed or if overlay is already open, function returns early.
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
 * Checks if window's inner width is below 1000 pixels. If so, redirects to 'add_task.html'
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
 * checking all sections, and setting overlay open to true. Calls 'populateColumnsWithTasks' and 'checkAllSections' functions.
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
 * Loads task form into given container and activates it with given progress status. After HTML is included, it activates container and renders task form.
 * @param {HTMLElement} container - container element to load task form into.
 * @param {string} progressStatus - progress status to activate container with.
 */
function loadTaskForm(container, progressStatus) {
    container.setAttribute('w3-include-html', 'assets/templates/task-form.html');
    container.setAttribute('data-active-overlay', 'add-task');

    includeHTML().then(() => {
        activateContainer(progressStatus);
        renderAddTask();
    });
}

/**
 * Activates container by setting its display style to 'block',
 * adding a click event listener to the close button that calls 'closeAddTask' function once, and setting container's 'data-progress-status' attribute to the given progress status.
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
 * Closes task addition form if overlay is open.Populates columns with tasks, checks all sections, adds 'closing' class to container,
 * removes 'active' class from overlay, resets body's overflow style, removes 'w3-include-html' attribute from container, and sets overlay open to false.
 */
function closeAddTask() {
    manageTasks();
    updateUI();
}

/**
 * Manages tasks by populating columns with tasks, checking all sections, and resetting overlay and selected contacts state.
 */
function manageTasks() {
    if (!isOverlayOpen) return;
    populateColumnsWithTasks(sections);
    checkAllSections();
    isOverlayOpen = false;
    selectedContacts = {};
}

/**
 * Updates the UI by closing the task container, deactivating the overlay, and resetting the body overflow and container attributes.
 */
function updateUI() {
    let container = document.getElementById('add-task-container-board');
    container.removeAttribute('data-active-overlay');
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    container.classList.add('closing');
    overlay.classList.remove('active');
    body.style.overflow = '';
    container.removeAttribute('w3-include-html');
}

/**
 * Validates the task index.
 * @param {number} taskIndex - The index of the task.
 * @returns {boolean} True if the index is valid, false otherwise.
 */
function validateTaskIndex(taskIndex) {
    if (taskIndex === undefined || taskIndex < 0 || taskIndex >= tasksData.length) {
        return false;
    }
    return true;
}

/**
 * Retrieves a task by its index.
 * @param {number} taskIndex - The index of the task.
 * @returns {Object} The task object.
 */
function getTask(taskIndex) {
    return tasksData[taskIndex];
}

/**
 * Opens mini task menu for task at given index.
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