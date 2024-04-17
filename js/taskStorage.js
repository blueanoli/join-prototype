let tasksData = [];
const categoryToSvgMap = {
    "Technical Task": "assets/img/technical_task.svg",
    "User Story": "assets/img/user_story.svg"
};

/** 
 * Initializes the task data. 
*/
async function initializeTaskData() {
    const storedTasks = await getItem('tasksData');
    if (!storedTasks) {
        await saveTasksToServer();
    } else {
        tasksData = JSON.parse(storedTasks);
        displayAllTasks();
    }
}

/** 
 * Saves the task data to the server.
*/
async function saveTasksToServer() {
    await setItem('tasksData', JSON.stringify(tasksData));
}

/** 
 * Loads the task data from the server. 
*/
async function loadTasksFromServer() {
    const storedTasks = await getItem('tasksData');
    if (storedTasks) {
        tasksData = JSON.parse(storedTasks);
    }
    if (typeof displayAllTasks === "function") {
        displayAllTasks();
    }
}

/**
 * Updates progress of task.
 * @param {number} taskId - ID of task.
 * @param {string} newColumnId - ID of new column.
 */
async function updateTaskProgress(taskId, newColumnId) {
    let task = tasksData[taskId];
    if (task) {
        const newProgress = newColumnId.replace('board-', '').replace('-container', '');
        task.progress = newProgress;
        await saveTasksToServer();
    }
}

/**
 * Updates progress of task for mobile.
 * @param {Event} event - The event.
 * @param {number} index - The index of the task.
 * @param {string} newProgress - The new progress.
 */
async function updateTaskProgressMobile(event, index, newProgress) {
    event.stopPropagation();
    tasksData[index].progress = newProgress;
    await saveTasksToServer();
    displayAllTasks();
    checkAllSections();
}

/**
 * Generates the SVG path for the category icon.
 * @param {string} categoryText - The category text.
 * @returns {string} The SVG path.
 */
function getCategorySvgPath(categoryText) {
    return categoryToSvgMap[categoryText];
}

/**
 * Prepares subtasks for a given task ID.
 * @param {number} taskId - The ID of the task.
 * @returns {Array} The prepared subtasks.
 */
function prepareSubtasks(taskId) {
    let subtaskElements = document.getElementById('subtask-container').querySelectorAll('li');
    return Array.from(subtaskElements).map((element, subtaskIndex) => {
        let id = `subtask-${taskId}-${subtaskIndex}`;
        let title = element.textContent;
        let completed = element.dataset.completed === 'true';
        return { id, title, completed };
    });
}