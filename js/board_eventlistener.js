// DRAG AND DROP LOGIC ---------------------------------------------------------------------------------------------------------
function initializeHoverEffect() {
    document.querySelectorAll('.mini-task-container').forEach(minitask => {
        let hoverTimer;

        minitask.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => {
                minitask.style.cursor = 'grab';
            }, 500); 
        });

        minitask.addEventListener('mousedown', () => {
            minitask.style.cursor = 'grabbing';});

        minitask.addEventListener('mouseup', () => {
            minitask.style.cursor = 'grab';});

        minitask.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            minitask.style.cursor = 'pointer';
        });
    });
}

function initializeDragAndDrop() {
    document.querySelectorAll('.mini-task-container').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    document.querySelectorAll('.progress-column').forEach(column => {
        const dropZone = column.querySelector('.dotted-container-drag-drop');
        
        column.addEventListener('dragover', (event) => {
            event.preventDefault();
            if (dropZone.style.display !== 'block') {
                dropZone.style.display = 'block';
            }
        });

        column.addEventListener('dragleave', (event) => {
            if (!column.contains(event.relatedTarget)) {
                dropZone.style.display = 'none';
            }
        });

        column.addEventListener('drop', handleDrop);
    });

    initializeHoverEffect();
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
    event.target.classList.add('dragging');
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

    if (event.target.classList.contains('dotted-container-drag-drop')) {
        targetContainer = event.target.previousElementSibling; 
        targetContainer.appendChild(taskElement); 
    } else {
        targetContainer = event.target.closest('.dotted-container');
        targetContainer.appendChild(taskElement); 
    }

    const placeholder = targetContainer.querySelector('.empty-column');
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    updateTaskStatus(parseInt(taskIndex, 10), targetContainer.id);
    checkAllSections();
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
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