let tasksData = [];

const categoryToSvgMap = {
    "Technical Task": "assets/img/technical_task.svg",
    "User Story": "assets/img/user_story.svg"
};
// TEST FUNCTION TO STORE DATA IN LOCAL STORAGE --------------------------------------------------------------------------------------------------

function initializeTaskData() {
    const storedTasks = localStorage.getItem('tasksData');
    if (!storedTasks) {
        saveTasksToLocalStorage(); 
    }
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
}

function loadTasksFromLocalStorage() {
    let storedTasks = localStorage.getItem('tasksData');
    if (storedTasks) {
        tasksData = JSON.parse(storedTasks);
    }

    if (typeof displayAllTasks === "function") {
        displayAllTasks();
    }
}

function updateTaskProgress(taskId, newColumnId) {
    let task = tasksData[taskId];
    if (task) {
        const newProgress = newColumnId.replace('board-', '').replace('-container', '');
        task.progress = newProgress;
        saveTasksToLocalStorage();
    }
}

function getCategorySvgPath(categoryText) {
    return categoryToSvgMap[categoryText];
}

function transformSelectedContactsToAssignedTo(selectedContacts) {
    return Object.entries(selectedContacts)
        .filter(([name, isSelected]) => isSelected) 
        .map(([name]) => ({
            name, 
            color: getColorForInitials(getInitials(name)), 
            initials: getInitials(name) 
        }));
}

function prepareSubtasks() {
    let subtaskElements = document.getElementById('subtask-container').querySelectorAll('li');
    return Array.from(subtaskElements).map((element, index) => ({
        id: Date.now() + index, 
        title: element.textContent,
        completed: false
    }));
}