let sections = [
    { id: 'board-todo-container', text: 'No tasks to do' },
    { id: 'board-in-progress-container', text: 'No tasks in progress' },
    { id: 'board-feedback-container', text: 'No tasks await feedback' },
    { id: 'board-done-container', text: 'No tasks done' }
];

async function renderBoard(){
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
    }
}

function openAddTask() {
    const container = document.getElementById('add-task-container-board');
    const overlay = document.getElementById('page-overlay');
    const body = document.body;

    overlay.classList.add('active');
    body.classList.add('no-scroll');
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

    container.classList.remove('active'); 
    overlay.style.display = 'none'; 
    body.style.overflow = ''; 
}