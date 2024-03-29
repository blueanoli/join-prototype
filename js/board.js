let sections = [
    { id: 'board-todo-container', text: 'No tasks To do' },
    { id: 'board-in-progress-container', text: 'No tasks in progress' },
    { id: 'board-feedback-container', text: 'No tasks await feedback' },
    { id: 'board-done-container', text: 'No tasks done' }
];
const TASK_STATUSES = ['todo', 'in-progress', 'feedback', 'done'];

let isOverlayOpen = false;

async function renderBoard() {
    await init();
    initializeTaskData();
    loadTasksFromLocalStorage();
    displayAllTasks();
    checkAllSections();
}

function isValidStatus(status) {
    return TASK_STATUSES.includes(status);
}

function checkAllSections() {
    for (let i = 0; i < sections.length; i++) {
        checkColumnEmpty(sections[i].id, sections[i].text);
    }
}

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

function handleTaskClick(index) {
    const task = tasksData[index];
    renderTaskOverlayHTML(task);
}

function openAddTask(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv) {
    if (isOverlayOpen) return; 

    let container = document.getElementById('add-task-container-board');
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.add('active');
    body.classList.add('no-scroll');
    container.classList.remove('closing');
    container.classList.add('active');
    container.setAttribute('w3-include-html', 'assets/templates/task-form.html');

    includeHTML().then(() => {
        activateContainer();
    });

    isOverlayOpen = true; 
    renderAddTask(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv);
}

function activateContainer() {
    let container = document.getElementById('add-task-container-board');
    container.style.display = 'block';

    let closeButton = document.getElementById('close-task-btn');
    if (closeButton) {
        closeButton.addEventListener('click', closeAddTask, { once: true });
    }
}

function closeAddTask() {
    if (!isOverlayOpen) return;

    let container = document.getElementById('add-task-container-board');
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    container.classList.add('closing');
    overlay.classList.remove('active');
    body.style.overflow = '';
    container.removeAttribute('w3-include-html');

    isOverlayOpen = false; 
}

function closeTaskOverlay() {
    let container = document.getElementById('edit-task-overlay');
    container.style.display = 'none';
}

function openEditTask() {
    let editOverlay = document.getElementById('edit-task-overlay');
    let assignedContactsHtml = '';
    let subtasksHtml = '';

    for (let i = 0; i < taskData.assignedTo.length; i++) {
        let contact = taskData.assignedTo[i];
        assignedContactsHtml += `
        <div class="contact-icon-container">
            <p class="test-contact" style="background-color: ${contact.color}">${contact.initials}</p>
        </div>`;
    }

    for (let j = 0; j < taskData.subtasks.length; j++) {
        let subtask = taskData.subtasks[j];
        subtasksHtml += `
        <div class="subtasks-check-container">
            <span ${subtask.completed ? 'checked' : ''}>
            <span>${subtask.title}</span>
        </div>`;
    }

    let htmlContent = renderEditTaskOverlayHTML(task, assignedContactsHtml, subtasksHtml);
    editOverlay.innerHTML = htmlContent;
}

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
}

// FILTER FUNCTION TASK TITLES --------------------------------------------------------------------------------------------------

function getFilteredTasks(searchText, tasksData) {
    return tasksData.filter(task => 
        task.title.split(' ').some(word => word.toLowerCase().startsWith(searchText))
    );
}

function clearColumns(sections) {
    for (let i = 0; i < sections.length; i++) {
        let column = document.getElementById(sections[i].id);
        column.classList.add('empty');
        column.innerHTML = '';
    }
}

function populateColumnsWithTasks(filteredTasks, tasksData) {
    for (let i = 0; i < filteredTasks.length; i++) {
        let task = filteredTasks[i];
        let sectionId = `board-${task.progress}-container`;
        let column = document.getElementById(sectionId);

        if (column) {
            column.classList.remove('empty');
            let taskIndex = tasksData.indexOf(task);
            let taskElement = renderMiniTaskHTML(task, taskIndex);
            column.innerHTML += taskElement;
        }
    }
}

function populateEmptyColumns(sections) {
    for (let i = 0; i < sections.length; i++) {
        let column = document.getElementById(sections[i].id);
        if (!column.innerHTML.trim()) {
            column.innerHTML = `
                <div class='empty-column dotted-container'>
                    <div class="dotted-container">
                        <span>${sections[i].text}</span>
                    </div>
                </div>`;
        }
    }
}

function filterTasks() {
    const searchText = document.getElementById('search-tasks').value.toLowerCase();
    const filteredTasks = getFilteredTasks(searchText, tasksData);

    clearColumns(sections);

    if (filteredTasks.length > 0) {
        populateColumnsWithTasks(filteredTasks, tasksData);
    }

    populateEmptyColumns(sections);
}


// TEST FUNCTION TO STORE DATA IN LOCAL STORAGE --------------------------------------------------------------------------------------------------

function initializeTaskData() {
    const storedTasks = localStorage.getItem('tasksData');
    if (!storedTasks) {
        console.log("Keine gespeicherten Tasks gefunden, initialisiere mit Beispiel-Tasks.");
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