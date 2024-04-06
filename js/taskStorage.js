let tasksData = [];

const categoryToSvgMap = {
    "Technical Task": "assets/img/technical_task.svg",
    "User Story": "assets/img/user_story.svg"
};

async function initializeTaskData() {
    const storedTasks = await getItem('tasksData');
    if (!storedTasks) {
        await saveTasksToServer(); 
    } else {
        tasksData = JSON.parse(storedTasks); 
        displayAllTasks(); 
    }
}

async function saveTasksToServer() {
    await setItem('tasksData', JSON.stringify(tasksData)); 
}

async function loadTasksFromServer() {
    const storedTasks = await getItem('tasksData');
    if (storedTasks) {
        tasksData = JSON.parse(storedTasks); 
    }

    if (typeof displayAllTasks === "function") {
        displayAllTasks(); 
    }
}

async function updateTaskProgress(taskId, newColumnId) {
    let task = tasksData[taskId];
    if (task) {
        const newProgress = newColumnId.replace('board-', '').replace('-container', '');
        task.progress = newProgress;
        await saveTasksToServer(); 
    }
}

async function updateTaskProgressMobile(event, index, newProgress) {
    event.stopPropagation();
    tasksData[index].progress = newProgress;
    await saveTasksToServer(); 
    displayAllTasks(); 
    checkAllSections(); 
}

function getCategorySvgPath(categoryText) {
    return categoryToSvgMap[categoryText];
}

function prepareSubtasks(taskIndex) {
    let subtaskElements = document.getElementById('subtask-container').querySelectorAll('li');
    return Array.from(subtaskElements).map((element, subtaskIndex) => {
        let id = `subtask-${taskIndex}-${subtaskIndex}`;
        let title = element.textContent;
        let completed = tasksData[taskIndex]?.subtasks[subtaskIndex]?.completed ?? (element.dataset.completed === 'true');
        return { id, title, completed };
    });
}
