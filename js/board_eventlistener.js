function initializeDragAndDrop() {
    document.querySelectorAll('.mini-task-container').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    document.querySelectorAll('.progress-column').forEach(column => {
        const dropZone = column.querySelector('.dotted-container-drag-drop');
        
        column.addEventListener('dragover', (event) => {
            event.preventDefault();
            // Zeige den Drop-Zone-Indikator nur an, wenn er noch nicht sichtbar ist
            if (dropZone.style.display !== 'block') {
                dropZone.style.display = 'block';
            }
        });

        column.addEventListener('dragleave', (event) => {
            // Verstecke den Drop-Zone-Indikator, wenn der Cursor die Spalte verlässt, aber nicht wenn er innerhalb der Spalte bewegt wird
            if (!column.contains(event.relatedTarget)) {
                dropZone.style.display = 'none';
            }
        });

        column.addEventListener('drop', handleDrop);
    });
}


function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
    setTimeout(() => event.target.classList.add('dragging'), 0); 
}

document.querySelectorAll('.mini-task-container').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', function(e) {
        e.target.classList.remove('dragging'); 
    });
});

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const taskIndex = event.dataTransfer.getData('text/plain');
    const taskElement = document.querySelector(`.mini-task-container[data-task-id="${taskIndex}"]`);
    
    let targetContainer;

    // Überprüfe, ob das Drop-Event direkt auf dem dotted-container-drag-drop ausgelöst wurde
    if (event.target.classList.contains('dotted-container-drag-drop')) {
        targetContainer = event.target.previousElementSibling; // Der tatsächliche Container für die Tasks
        targetContainer.appendChild(taskElement); // Füge den Task am Ende ein
    } else {
        // Finde den nächstgelegenen Eltern-Container, der eine 'dotted-container' ist
        targetContainer = event.target.closest('.dotted-container');
        targetContainer.appendChild(taskElement); // Füge den Task an der Stelle ein, an der das Event ausgelöst wurde
    }

    // Entferne den Platzhaltertext, falls vorhanden
    const placeholder = targetContainer.querySelector('.empty-column');
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    // Aktualisiere den Status des Tasks basierend auf der neuen Spalte
    updateTaskStatus(parseInt(taskIndex, 10), targetContainer.id);
    checkAllSections();
}


function handleDragEnd() {
    document.querySelectorAll('.dotted-container-drag-drop').forEach(dropZone => {
        dropZone.style.display = 'none';
    });
}

function updateTaskStatus(taskIndex, newColumnId) {
    if (taskIndex < 0 || taskIndex >= tasksData.length) {
        console.error("Task index out of bounds");
        return;
    }

    tasksData[taskIndex].progress = newColumnId.replace('board-', '').replace('-container', '');
    localStorage.setItem('tasksData', JSON.stringify(tasksData));

    displayAllTasks();
    checkAllSections();
}