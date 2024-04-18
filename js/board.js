let sections = [
    { id: 'board-todo-container', text: 'No tasks To do' },
    { id: 'board-in-progress-container', text: 'No tasks in progress' },
    { id: 'board-feedback-container', text: 'No tasks await feedback' },
    { id: 'board-done-container', text: 'No tasks done' }
];

let isOverlayOpen = false;
let originalTask = null;

/** 
* Initializes Board
*/
async function renderBoard() {
    await init();
    await initializeTaskData();
    await fetchContacts();
    await loadTasksFromServer();
    updateTestContactsFromServer();
    checkAllSections();
    addBoardEventListeners();
    setupOverlayCloseListener();
}

/**
* Checks if given index is within bounds of specified array
*/
function isValidIndex(index, array) {
    return index >= 0 && index < array.length;
}

/**
* Toggles completion status of specific subtask
* @param {Object} subtask - subtask object
*/
function toggleSubtaskCompletion(subtask) {
    subtask.completed = !subtask.completed;
}

/**
* Updates image elements based on completion status of subtask
* @param {Object} subtask - subtask object
* @param {number} index - index of task
* @param {number} j - index of subtask
*/
function updateImageElement(index, j, subtask) {
    let imgElement = document.querySelector(`.subtasks-check-container img[onclick='changeSubtaskStatus(${index}, ${j})']`);
    if (imgElement) {
        imgElement.src = `assets/img/checkbox${subtask.completed ? 'checked' : 'empty'}.svg`;
        imgElement.alt = `${subtask.completed ? 'Completed' : 'Not completed'}`;
    }
}

/**
* Changes completion status of specified subtask
*/
async function changeSubtaskStatus(index, j) {
    let task = tasksData[index];
    let subtask = task.subtasks[j];
    if (!isValidIndex(index, tasksData)) {
        return;
    }

    if (!isValidIndex(j, task.subtasks)) {
        return;
    }

    toggleSubtaskCompletion(subtask);
    updateImageElement(index, j, subtask);

    await saveTasksToServer();
}

/**
* Shows info when mouse enters subtask container
* @param {Object} element - subtask container
*/
function showToastMessage(element) {
    let parentElement = element.closest('.mini-task-subtask-container');
    let toastMessage = parentElement.querySelector('.toast-message');
    toastMessage.style.display = 'block';
}

/**
* Hides info when mouse leaves subtask container
*/
function hideToastMessage(element) {
    let parentElement = element.closest('.mini-task-subtask-container');
    let toastMessage = parentElement.querySelector('.toast-message');
    toastMessage.style.display = 'none';
}

/**
* Iterates over each section and fills with tasks that match sections progress status
*/
function displayAllTasks() {

    for (let j = 0; j < sections.length; j++) {
        let section = sections[j];
        let column = document.getElementById(section.id);

        if (column) {
            column.innerHTML = '';

            for (let i = 0; i < tasksData.length; i++) {
                let task = tasksData[i];

                if (task.progress === section.id.replace('board-', '').replace('-container', '')) {
                    let taskElement = renderMiniTaskHTML(task, i);
                    column.innerHTML += taskElement;
                }
            }
        }
    }
    handleResize();
}

/**
* Checks all sections in array and adds placeholder message or removes placeholder and empty class
* @param {Object} section - section object
* @param {Object} column - column object
* @param {Object} placeholder - placeholder object
* @param {Object} emptyText - empty text object
*/
function checkAllSections() {
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const column = document.getElementById(section.id);
        if (column.children.length === 0 || (column.children.length === 1 && column.firstElementChild.classList.contains('empty-column'))) {
            column.innerHTML = `<div class='empty-column'><span>${section.text}</span></div>`;
            column.classList.add('empty');
        } else {
            const placeholder = column.querySelector('.empty-column');
            if (placeholder) placeholder.remove();
            column.classList.remove('empty');
        }
    }
}

/**
* Checks if specified section is empty and adds placeholder
* @param {Object} sectionId - section id
* @param {Object} emptyText - empty text
*/
function checkColumnEmpty(sectionId, emptyText) {
    let section = document.getElementById(sectionId);

    if (!section.hasChildNodes()) {
        section.classList.add('empty');
        section.innerHTML = `<div class='empty-column'><span>${emptyText}</span></div>`;
    } else {
        const emptyColumnDiv = section.querySelector('.empty-column');
        if (emptyColumnDiv) {
            emptyColumnDiv.remove();
        }
        section.classList.remove('empty');
    }
}

/**
* Filters tasksData array to return at least one word within task title and or description
* @param {Object} searchText - search text
* @param {Array} tasksData - Array that holds task objects
*/
function getFilteredTasks(searchText, tasksData) {
    return tasksData.filter(task => {
        if (typeof task.title === 'string' && typeof task.description === 'string') {
            return task.title.split(' ').some(word => word.toLowerCase().startsWith(searchText)) ||
                task.description.split(' ').some(word => word.toLowerCase().startsWith(searchText));
        }
        return false;
    });
}

/**
* Clears all columns in board
*/
function clearColumns(sections) {
    for (let i = 0; i < sections.length; i++) {
        let column = document.getElementById(sections[i].id);
        column.classList.add('empty');
        column.innerHTML = '';
    }
}

/**
* Populates columns with tasks that match search text
* @param {Object} filteredTasks - filtered tasks
*/
function populateColumnsWithTasks(filteredTasks, tasksData) {
    for (let i = 0; i < filteredTasks.length; i++) {
        let task = filteredTasks[i];
        let sectionId = `board-${task.progress}-container`;
        let column = document.getElementById(sectionId);

        if (column) {
            let taskIndex = tasksData.indexOf(task);
            let taskElement = renderMiniTaskHTML(task, taskIndex);
            column.innerHTML += taskElement;
            checkColumnEmpty(sectionId, task.progress);
        }
    }
}

/**
* Handles search input and filters tasks based on search text
*/
function filterTasks() {
    const searchText = document.getElementById('search-tasks').value.toLowerCase();
    const filteredTasks = getFilteredTasks(searchText, tasksData);
    const feedbackElement = document.getElementById('search-feedback');

    clearColumns(sections);

    if (filteredTasks.length > 0) {
        populateColumnsWithTasks(filteredTasks, tasksData);
        feedbackElement.style.display = 'none';
    } else {
        feedbackElement.style.display = 'block';
    }
    checkAllSections();
}