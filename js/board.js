async function renderBoard(){
    await init();
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
    const close = document.getElementById('close-task-btn');
    const body = document.body;

    container.classList.remove('active'); 
    close.classList.remove('active');
    overlay.style.display = 'none'; 
    body.style.overflow = ''; 
}