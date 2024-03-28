let sections = [
    { id: 'board-todo-container', text: 'No tasks To do' },
    { id: 'board-in-progress-container', text: 'No tasks in progress' },
    { id: 'board-feedback-container', text: 'No tasks await feedback' },
    { id: 'board-done-container', text: 'No tasks done' }
];

async function renderBoard() {
    await init();
    checkAllSections();
}

function checkAllSections() {
    for (let i = 0; i < sections.length; i++) {
        checkColumnEmpty(sections[i].id, sections[i].text);
    }
}

function checkColumnEmpty(sectionId, emptyText) {
    let section = document.getElementById(sectionId);

    if (!section.hasChildNodes()) {
        section.innerHTML = /*html*/`
        <div class='empty-column'>
            <span>${emptyText}</span>
        </div>`;
    }else{
        section.innerHTML = renderMiniTaskHTML(taskData, sectionId);
        renderSubtaskProgress(taskData, sectionId);
        section.style.border = 'none';
        section.style.backgroundColor = 'transparent';
        section.style.boxShadow = 'none';
    }
}

function openAddTask(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv) {
    const container = document.getElementById('add-task-container-board');
    const overlay = document.getElementById('page-overlay');
    const body = document.body;

    overlay.classList.add('active');
    body.classList.add('no-scroll');
    container.classList.remove('closing');
    container.classList.add('active');
    container.setAttribute('w3-include-html', 'assets/templates/task-form.html');

    includeHTML().then(() => {
        container.style.display = 'block';
    });

    renderAddTask(category, selectedDiv, dropdown, itemsDiv, contact, optionDiv);
}

function closeAddTask() {
    const container = document.getElementById('add-task-container-board');
    const overlay = document.getElementById('page-overlay');
    const body = document.body;

    container.classList.add('closing');
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    body.style.overflow = '';
}

function closeTaskOverlay() {
    let container = document.getElementById('edit-task-overlay');
    container.style.display = 'none';
}

function openEditTask() {
    let editOverlay = document.getElementById('edit-task-overlay');
    let assignedContactsHtml = taskData.assignedTo.map(contact => /*html*/`
    <div class="contact-icon-container">
        <p class="test-contact" style="background-color: ${contact.color}">${contact.initials}</p>
    </div>
`).join('');

    let subtasksHtml = taskData.subtasks.map(subtask => /*html*/`
        <div class="subtasks-check-container">
            <span ${subtask.completed ? 'checked' : ''}>
            <span>${subtask.title}</span>
        </div>
`).join('');
    

    let htmlContent = renderEditTaskOverlayHTML(taskData, assignedContactsHtml, subtasksHtml);
    editOverlay.innerHTML = htmlContent;
}

function renderSubtaskProgress(taskData) {
    let completedSubtasks = taskData.subtasks.filter(subtask => subtask.completed).length;
    let totalSubtasks = taskData.subtasks.length;
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    let progressHTML = /*html*/`
    <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
    </div>
    <span class="subtask-counter">${completedSubtasks}/${totalSubtasks} Subtasks</span>
`;
    let miniTaskSubtaskContainer = document.querySelector('.mini-task-subtask-container');
    if (miniTaskSubtaskContainer) {
        miniTaskSubtaskContainer.innerHTML = progressHTML;
    }
}