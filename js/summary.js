/**
 * Initializes and updates summary data.
 * @async
 * @function renderSummary
 */
async function renderSummary() {
    await init();
    updateSummaryData();
}

/**
 * Displays the current daytime greeting and username or defaults to guest.
 * @function dashboardGreeting
 */
function dashboardGreeting() {
    let now = new Date();
    let hour = now.getHours();
    let greeting;
    let userName = sessionStorage.getItem('username') || 'Guest';

    if (hour < 12) {
        greeting = "<span class='greetingTime'>Good morning,</span><br>";
    } else if (hour < 18) {
        greeting = "<span class='greetingTime'>Good afternoon,</span><br>";
    } else {
        greeting = "<span class='greetingTime'>Good evening,</span><br>";
    }

    document.getElementById('greeting').innerHTML = greeting + " " + "<span class='greetingUserName'>" + userName + "</span>";
}

document.addEventListener('DOMContentLoaded', function () {
    initializeTodoBoxes();
    dashboardGreeting();
});

/**
 * Attaches mouse enter and leave event listeners to todo-box elements to trigger visual changes.
 * @function initializeTodoBoxes
 */
function initializeTodoBoxes() {
    let todoBoxes = document.querySelectorAll('.todo-box');
    todoBoxes.forEach(function (box) {
        box.addEventListener('mouseenter', enterTodoBox);
        box.addEventListener('mouseleave', leaveTodoBox);
    });
}

/**
 * Updates image and text colors when the mouse enters a todo box.
 * @function enterTodoBox
 */
function enterTodoBox() {
    const img = this.querySelector('.summary-item img');
    updateImageOnEnter(img);
    updateTextColors(this, 'white');
}

/**
 * Resets image and text colors to their original state when the mouse leaves a todo box.
 * @function leaveTodoBox
 */
function leaveTodoBox() {
    const img = this.querySelector('.summary-item img');
    resetImageOnLeave(img);
    updateTextColors(this, '');
}

/**
 * Changes the image source and styling on mouse enter.
 * @function updateImageOnEnter
 * @param {HTMLImageElement} img - The image element to be updated.
 */
function updateImageOnEnter(img) {
    if (!img) return;
    if (img.src.includes('pencil_white.svg')) {
        img.src = 'assets/img/pencil_grey.svg';
        img.style.width = '32px';
        img.style.height = '32px';
    } else if (img.src.includes('summary_done_white.svg')) {
        img.src = '/assets/img/summary_done_dark.svg';
    }
}

/**
 * Reverts the image source and styling on mouse leave, restoring the original appearance.
 * @function resetImageOnLeave
 * @param {HTMLImageElement} img - The image element to be reverted.
 */
function resetImageOnLeave(img) {
    if (!img) return;
    if (img.src.includes('pencil_grey.svg')) {
        img.src = 'assets/img/pencil_white.svg';
        img.style.width = '';
        img.style.height = '';
    } else if (img.src.includes('summary_done_dark.svg')) {
        img.src = '/assets/img/summary_done_white.svg';
    }
}

/**
 * Modifies the text color of elements within a given element.
 * @function updateTextColors
 * @param {HTMLElement} element - The container element whose text colors are to be updated.
 * @param {string} color - The color to apply to the text elements.
 */
function updateTextColors(element, color) {
    const texts = element.querySelectorAll('.summary-text, .number, span');
    texts.forEach(function (text) {
        text.style.color = color;
    });
}

/**
 * Counts tasks based on their progress and priority and updates the summary data.
 * @async
 * @function updateSummaryData
 */
async function updateSummaryData() {
    let storedTasksString = await getItem('tasksData');
    let tasksData = JSON.parse(storedTasksString || '[]');

    const summaryCounts = {
        'todo': 0,
        'in-progress': 0,
        'feedback': 0,
        'done': 0,
        'urgent': 0
    };

    tasksData.forEach(task => {
        if (task.progress) {
            summaryCounts[task.progress] = (summaryCounts[task.progress] || 0) + 1;
        }
        if (task.priority === 'urgent') {
            summaryCounts['urgent']++;
        }
    });

    const updateTextContent = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    };

    updateTextContent('todo-count', summaryCounts['todo']);
    updateTextContent('done-count', summaryCounts['done']);
    updateTextContent('urgent-count', summaryCounts['urgent']);
    updateTextContent('progress-count', summaryCounts['in-progress']);
    updateTextContent('feedback-count', summaryCounts['feedback']);
    updateTextContent('all-tasks-count', tasksData.length);

    updateNextDeadline(tasksData);
}

/**
 * Converts a date to a more readable format, standardizing date displays.
 * @function formatDate
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Displays the nearest upcoming task deadline, highlighting important dates.
 * @async
 * @function updateNextDeadline
 * @param {Array} tasksData - An array of task objects with due dates.
 */
async function updateNextDeadline(tasksData) {
    tasksData = tasksData.filter(task => task.dueDate && new Date(task.dueDate) >= new Date());

    tasksData.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const nextDeadline = tasksData.length > 0 ? tasksData[0].dueDate : null;
    const deadlineElement = document.getElementById('deadline-date');
    const deadlineTextElement = document.getElementById('deadline-text');

    if (deadlineElement && deadlineTextElement) {
        if (nextDeadline) {
            deadlineElement.textContent = formatDate(new Date(nextDeadline));
        } else {
            deadlineTextElement.classList.add('d-none');
            deadlineElement.classList.add('d-none');
            document.getElementById('vertical-line').classList.add('d-none');
        }
    }
}