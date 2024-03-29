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
        category: "assets/img/user_story.svg",
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
        category: "assets/img/technical_task.svg",
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
        category: "assets/img/user_story.svg",
        subtasks: [
            { title: "Do something", completed: false },
            { title: "Do even more", completed: false }
        ],
        progress: 'todo'}
  ];
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
