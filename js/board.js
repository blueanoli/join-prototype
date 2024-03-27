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

function openAddTask() {
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

    renderAddTask();
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
    const editOverlay = document.getElementById('edit-task-overlay');
    const assignedContactsHtml = taskData.assignedTo.map(contact => `
    <div class="contact-icon-container">
        <p class="test-contact" style="background-color: ${contact.color}">${contact.initials}</p>
    </div>
`).join('');

const subtasksHtml = taskData.subtasks.map(subtask => `
    <div class="subtasks-check-container">
        <span ${subtask.completed ? 'checked' : ''}>
        <span>${subtask.title}</span>
    </div>
`).join('');
    

    const htmlContent = /*html*/`
        <div class="edit-task-container">
            <div class="edit-task-header">
                <img class="close-edit-task" onclick="closeTaskOverlay()" src="assets/img/cancel_dark.svg" alt="Close">
            </div>
            <div class="edit-task-title-container">
                <span class="task-container-mini-headlines">Title:</span>
                <input type="text" value="${taskData.title}" class="edit-input" id="edit-title">
            </div>
            <div class="edit-task-description-container">
                <span class="task-container-mini-headlines">Description:</span>
                <textarea class="edit-textarea" id="edit-description">${taskData.description}</textarea>
            </div>
            <div class="edit-task-due-date-container">
                <span class="task-container-mini-headlines">Due date:</span>
                <input type="text" value="${taskData.dueDate}" class="edit-input" id="edit-due-date">
            </div>
            <div class="edit-task-priority-container">
                <span class="task-container-mini-headlines">Priority:</span>
                <div class="priority-container">
                    <div onclick="chooseUrgentPrio()" id="priority-urgent">Urgent <img id="img-urgent"
                            src="assets/img/addtask_urgent.svg"></div>
                    <div onclick="chooseMediumPrio()" id="priority-medium">Medium <img id="img-medium"
                            src="assets/img/addtask_medium.svg"></div>
                    <div onclick="chooseLowPrio()" id="priority-low">Low <img id="img-low"
                            src="assets/img/addtask_low.svg"></div>
                </div>
            </div>
            <div class="edit-task-contacts-container">
                <span class="task-container-mini-headlines">Assigned to:</span>
                <div class="custom-select-wrapper" onclick="toggleDropdown('assigned-to'); renderContacts()">
                <div id="assigned-to" class="custom-select">
                    <div class="select-selected">Select contacts to assign</div>
                    <input oninput="filterContacts()" id="contact-search-input" type="text"
                        class="contact-search-input select-hide" placeholder="Type to search...">
                    <img class="dropdown-arrow" id="img-dropdown" src="assets/img/addtask_dropdown.svg">
                    <div class="select-items select-hide"></div>
                </div>
                ${assignedContactsHtml}
            </div>
            <div id="assign-contacts"></div>
            </div>
            <div class="edit-task-subtasks-container">
                <span class="task-container-mini-headlines">Subtasks:</span>
            <div class="add-subtask">
                <input type="text" id="subtasks" placeholder="Add new subtask">
                <div id="icon-container">
                    <img class="icon-plus" src="assets/img/addtask_plus.svg" alt="">
                </div>
            </div>
            <div id="subtask-container">
                ${subtasksHtml}
            </div>
            </div>
            <div class="add-task-buttons">
                <button class="add-task-btn-style" onclick="addTask(); return false" id="add-task-btn">Ok<img
                        src="assets/img/addtask_check_white.svg"></button>
            </div>
        </div>`;

    editOverlay.innerHTML = htmlContent;
}

function renderSubtaskProgress(taskData) {
    let completedSubtasks = taskData.subtasks.filter(subtask => subtask.completed).length;
    let totalSubtasks = taskData.subtasks.length;
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    let progressHTML = `
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