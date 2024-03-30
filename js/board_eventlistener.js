function initializeDragAndDrop() {
    document.querySelectorAll('.mini-task-container').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
    });

    document.querySelectorAll('.dotted-container').forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
}

function handleDragOver(event) {
    event.preventDefault(); // Ermöglicht das Ablegen
}

function handleDrop(event) {
    event.preventDefault();
    const taskIndex = event.dataTransfer.getData('text/plain');
    const taskElement = document.querySelector(`.mini-task-container[data-task-id="${taskIndex}"]`);
    let targetContainer = event.target;

    while (!targetContainer.classList.contains('dotted-container')) {
        targetContainer = targetContainer.parentElement;
    }

    targetContainer.appendChild(taskElement);

    if (targetContainer.querySelector('.dotted-container .empty-column')) {
        targetContainer.querySelector('.dotted-container .empty-column').style.display = 'none';
    }

    updateTaskStatus(parseInt(taskIndex, 10), targetContainer.id);
    checkAllSections(); 
}



function updateTaskStatus(taskIndex, newColumnId) {
    if (taskIndex < 0 || taskIndex >= tasksData.length) {
        console.error("Task index out of bounds");
        return;
    }

    // Aktualisiere den 'progress' des spezifischen Tasks
    tasksData[taskIndex].progress = newColumnId.replace('board-', '').replace('-container', '');

    // Speichere die aktualisierten Daten im Local Storage
    localStorage.setItem('tasksData', JSON.stringify(tasksData));

    // Stelle sicher, dass die UI aktualisiert wird
    displayAllTasks();
    checkAllSections();
}