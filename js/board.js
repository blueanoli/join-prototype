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
    for (let i = 0; i < tasksData.length; i++) {
        const task = tasksData[i];
        const columnId = `board-${task.progress}-container`;
        const column = document.getElementById(columnId);

        if (column) {
            const taskElement = renderMiniTaskHTML(task, i); 
            column.innerHTML += taskElement; 
        }
    }
}