let autoScrollInterval;

/** Initializes hover effects for all mini task containers. */
function initializeHoverEffect() {
    document.querySelectorAll('.mini-task-container').forEach(minitask => {
        initializeMinitaskHoverEvents(minitask);
    });
}

/**
 * Initializes hover events for a mini task.
 * @param {Element} minitask - Mini task element.
 */
function initializeMinitaskHoverEvents(minitask) {
    if (isLargeScreen()) {
        setHoverEvents(minitask);
    } else {
        minitask.style.cursor = 'pointer';
    }
}

/**
 * Sets hover events for a mini task.
 * @param {Element} minitask - Mini task element.
 */
function setHoverEvents(minitask) {
    let hoverTimer;
    minitask.addEventListener('mouseenter', () => handleMouseEnter(minitask, hoverTimer));
    minitask.addEventListener('mousedown', () => handleMouseDown(minitask));
    minitask.addEventListener('mouseup', () => handleMouseUp(minitask));
    minitask.addEventListener('mouseleave', () => handleMouseLeave(minitask, hoverTimer));
}

/**
 * Handles mouse enter event for mini task.
 * @param {Element} minitask - Mini task element.
 * @param {number} hoverTimer - Hover timer.
 */
function handleMouseEnter(minitask, hoverTimer) {
    hoverTimer = setTimeout(() => {
        minitask.style.cursor = 'grab';
    }, 500);
}

/**
 * Handles mouse down event for mini task.
 * @param {Element} minitask - Mini task element.
 */
function handleMouseDown(minitask) {
    minitask.style.cursor = 'grabbing';
}

/**
 * Handles mouse up event for mini task.
 * @param {Element} minitask - Mini task element.
 */
function handleMouseUp(minitask) {
    minitask.style.cursor = 'grab';
}

/**
 * Handles mouse leave event for mini task.
 * @param {Element} minitask - Mini task element.
 * @param {number} hoverTimer - Hover timer.
 */
function handleMouseLeave(minitask, hoverTimer) {
    clearTimeout(hoverTimer);
    minitask.style.cursor = 'pointer';
}

/**
 * Initializes drag and drop events
*/
function initializeDragAndDrop() {
    initializeTasksDragEvents();
    initializeColumnsDragEvents();
    initializeHoverEffect();
}

/**
 * Initializes drag events for all mini task containers
*/
function initializeTasksDragEvents() {
    document.querySelectorAll('.mini-task-container').forEach(item => {
        item.addEventListener('dragstart', handleDragStartEvent);
        item.addEventListener('dragend', handleDragEndEvent);
    });
}

/**
 * Initializes drag events for all progress columns.
 */
function initializeColumnsDragEvents() {
    document.querySelectorAll('.progress-column').forEach(column => {
        initializeColumnDragEvents(column);
    });
}

/**
 * Initializes drag events for column.
 * @param {Element} column - Column element.
 */
function initializeColumnDragEvents(column) {
    const dropZone = column.querySelector('.dotted-container-drag-drop');
    column.addEventListener('dragover', event => handleDragOverEvent(event, dropZone));
    column.addEventListener('dragleave', event => handleDragLeaveEvent(event, column, dropZone));
    column.addEventListener('drop', handleDropEvent);
}

/**
 * Handles drag start event.
 * @param {Event} event - Drag start event.
 */
function handleDragStartEvent(event) {
    if (isLargeScreen()) {
        handleDragStart(event);
    }
}

/**
 * Handles drag end event.
 * @param {Event} event - Drag start event.
 */
function handleDragEndEvent(event) {
    if (isLargeScreen()) {
        handleDragEnd(event);
    }
}

/**
 * Handles drag over event.
 * @param {Element} dropZone - Drop zone element.
 */
function handleDragOverEvent(event, dropZone) {
    if (isLargeScreen()) {
        event.preventDefault();
        dropZone.style.display = 'block';
    }
}

/**
 * Handles drag leave event.
 * @param {Element} column - Column element.
 */
function handleDragLeaveEvent(event, column, dropZone) {
    if (isLargeScreen() && !column.contains(event.relatedTarget)) {
        dropZone.style.display = 'none';
    }
}

/** Handles drop event. */
function handleDropEvent(event) {
    if (isLargeScreen()) {
        handleDrop(event);
    }
}

/**
 * Checks if screen size is large.
 * @returns {boolean} - True if screen width is greater than 1240, else false.
 */
function isLargeScreen() {
    return window.innerWidth > 1240;
}

/**
 * Handles window resize event by reinitializing drag and drop functionality
*/
function handleResize() {
    initializeDragAndDrop();
}

/**
 * Handles drag start event.
 * @param {Event} event - Drag start event.
 */
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
    event.target.classList.add('dragging');
    document.addEventListener('mousemove', handleMouseMove);
}

/**
 * Adds 'dragstart' and 'dragend' event listeners to all mini task containers
*/
document.querySelectorAll('.mini-task-container').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', function (e) {
        e.target.classList.remove('dragging');
    });
});

/**
 * Handles drag over event.
*/
function handleDragOver(event) {
    event.preventDefault();
}

/**
 * Handles drop event
*/
function handleDrop(event) {
    event.preventDefault();
    let taskIndex = event.dataTransfer.getData('text/plain');
    let taskElement = getTaskElement(taskIndex);
    let targetContainer = getTargetContainer(event);
    if (!targetContainer || !taskElement) {
        return;
    }
    moveTaskToContainer(taskElement, targetContainer);
    hidePlaceholderIfPresent(targetContainer);
    updateTaskStatus(parseInt(taskIndex, 10), targetContainer.id);
    checkAllSections();
}

/**
 * Retrieves task element with specified index.
 * @param {number} taskIndex - Index of task.
 * @returns {Element} - Task element.
 */
function getTaskElement(taskIndex) {
    return document.querySelector(`.mini-task-container[data-task-id="${taskIndex}"]`);
}

/**
 * Retrieves target container from event.
 * @returns {Element} - Target container element.
 */
function getTargetContainer(event) {
    if (event.target.classList.contains('dotted-container-drag-drop')) {
        return event.target.previousElementSibling;
    } else {
        return event.target.closest('.dotted-container');
    }
}

/**
 * Moves task element to target container.
 * @param {Element} taskElement - Task element.
 * @param {Element} targetContainer - Target container.
 */
function moveTaskToContainer(taskElement, targetContainer) {
    targetContainer.appendChild(taskElement);
}

/**
 * Hides placeholder if present in target container.
 * @param {Element} targetContainer - Target container.
 */
function hidePlaceholderIfPresent(targetContainer) {
    let placeholder = targetContainer.querySelector('.empty-column');
    if (placeholder) {
        placeholder.style.display = 'none';
    }
}

/**
 * Handles drag end event
*/
function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    document.querySelectorAll('.dotted-container-drag-drop').forEach(dropZone => {
        dropZone.style.display = 'none';
    });
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
    document.removeEventListener('mousemove', handleMouseMove);
}

/**
 * Updates status of task.
 * @param {number} taskIndex - Index of task.
 * @param {string} newColumnId - ID of new column.
 */
async function updateTaskStatus(taskIndex, newColumnId) {
    if (taskIndex < 0 || taskIndex >= tasksData.length) {
        return;
    }

    tasksData[taskIndex].progress = newColumnId.replace('board-', '').replace('-container', '');
    saveTasksToServer();
    displayAllTasks();
    checkAllSections();
}

/** 
 * Handles mouse move event
 */
function handleMouseMove(event) {
    checkAndClearInterval();
    handleScrolling(event);
}

/**
 * Checks if an auto-scroll interval is active and clears it if it is.
 */
function checkAndClearInterval() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
}

/**
 * Handles scrolling based on the mouse position. If the mouse is within a certain margin from the top or bottom of the window, it starts auto-scrolling.
 *
 * @param {Event} event - The mousemove event.
 */
function handleScrolling(event) {
    let scrollSpeed = 1;
    let scrollMargin = 200;
    if (event.clientY < scrollMargin + 500) {
        autoScrollInterval = setInterval(() => {
            window.scrollTo({ top: window.scrollY - scrollSpeed, behavior: 'smooth' });
        }, 500);
    } else if (window.innerHeight - event.clientY < scrollMargin + 500) {
        autoScrollInterval = setInterval(() => {
            window.scrollTo({ top: window.scrollY + scrollSpeed, behavior: 'smooth' });
        }, 500);
    }
}

/**
 *  Changes color of button on mouseover and mouseout events
 */
function changeButtonColor() {
    let btnMobile = document.getElementById('add-task-btn-board-mobile');

    if (btnMobile) {
        btnMobile.addEventListener('mouseover', function () {
            btnMobile.src = 'assets/img/board_add_mobile_hover.svg';
        });

        btnMobile.addEventListener('mouseout', function () {
            btnMobile.src = 'assets/img/board_add_mobile.svg';
        });
    }
}

/** 
 * Sets up event listeners for edit form
 */
function setupEditFormEventListeners() {
    let editForm = document.querySelector('.edit-task-container');
    if (editForm) {
        editForm.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                return false;
            }
        });
    }
}

/** 
 * Disables form submission on pressing the Enter key.
 */
function disableEditFormEnterKeySubmission() {
    let form = document.getElementById('edit-task-container');
    if (form) {
        form.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                return false;
            }
        });
    }
}

/**  
 * Sets up an event listener for the edit input. 
 */
function setupEditInputEventListener(index) {
    let subtaskInput = document.getElementById('edit-subtasks');
    subtaskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            addEditSubtask(index);
        }
    });
}

/** 
 * Adds event listeners to the board  
 */
function addBoardEventListeners() {
    document.body.addEventListener('click', function (event) {
        if (event.target.matches('.edit-icon-task')) {
            let taskId = event.target.getAttribute('data-task-id');
            openEditTask(taskId);
        }
    });
    handleResize();
    changeButtonColor();
    window.addEventListener('resize', handleResize);
}

/**
 *  Sets up event listeners for subtasks. 
 */
function setupSubtaskEventListeners(index) {
    setupEditFormEventListeners();
    disableEditFormEnterKeySubmission();
    setupEditInputEventListener(index);
}