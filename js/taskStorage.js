let tasksData = [
    {
        title: "Kochwelt Page & Recipe Recommender",
        description: "Build start page with recipe recommendation.",
        assignedTo: [
            { name: "Chris Redfield", color: "var(--user-blue)", initials: "CR" },
            { name: "Jill Valentine", color: "var(--user-red)", initials: "JV" }
        ],
        dueDate: "10/05/2023",
        priority: "Medium",
        category: "User Story",
        subtasks: [
            { title: "Implement Recipe Recommendation", completed: true },
            { title: "Start Page Layout", completed: false }
        ],
        progress: 'done'
    },
    {
        title: "CSS Architecture Planning",
        description: "Define CSS naming conventions and structure.",
        assignedTo: [
            { name: "Leon Kennedy", color: "var(--user-green)", initials: "LK" },
            { name: "Ada Wong", color: "var(--user-pink)", initials: "AW" }
        ],
        dueDate: "15/06/2023",
        priority: "Urgent",
        category: "Technical Task",
        subtasks: [
            { title: "Establish CSS Methodology", completed: true },
            { title: "Setup Base Styles", completed: true }
        ],
        progress: 'todo'
    },
    {
        title: "Another test task",
        description: "Design and implement everything.",
        assignedTo: [
            { name: "Albert Wesker", color: "var(--user-orange)", initials: "AW" },
            { name: "Barry Burton", color: "var(--user-light-blue)", initials: "BB" }
        ],
        dueDate: "22/05/2023",
        priority: "Low",
        category: "Technical Task",
        subtasks: [
            { title: "Do something", completed: false },
            { title: "Do even more", completed: false }
        ],
        progress: 'todo'}
  ];

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
    displayAllTasks();
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
    return Array.from(subtaskElements).map(element => ({
        title: element.textContent,
        completed: false 
    }));
}