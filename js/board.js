async function renderBoard(){
    await init();
}

function openAddTask() {
    const container = document.getElementById('add-task-container-board');
    container.setAttribute('w3-include-html', 'assets/templates/task-form.html');

    includeHTML().then(() => {
        container.style.display = 'block';
    });

    renderAddTask();
}