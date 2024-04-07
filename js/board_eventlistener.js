let autoScrollInterval;
// DRAG AND DROP LOGIC ---------------------------------------------------------------------------------------------------------
function initializeHoverEffect() {
    document.querySelectorAll('.mini-task-container').forEach(minitask => {
        let hoverTimer;

        if (window.innerWidth > 1240) {
            minitask.addEventListener('mouseenter', () => {
                hoverTimer = setTimeout(() => {
                    minitask.style.cursor = 'grab';
                }, 500);
            });

            minitask.addEventListener('mousedown', () => {
                minitask.style.cursor = 'grabbing';
            });

            minitask.addEventListener('mouseup', () => {
                minitask.style.cursor = 'grab';
            });

            minitask.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
                minitask.style.cursor = 'pointer';
            });
        }else{
            minitask.style.cursor = 'pointer';
        }
    });
}

function initializeDragAndDrop() {
    document.querySelectorAll('.mini-task-container').forEach(item => {
        item.addEventListener('dragstart', function (event) {
            if (window.innerWidth > 1240) {
                handleDragStart(event);
            }
        });
        item.addEventListener('dragend', function (event) {
            if (window.innerWidth > 1240) {
                handleDragEnd(event);
            }
        });
    });

    document.querySelectorAll('.progress-column').forEach(column => {
        let dropZone = column.querySelector('.dotted-container-drag-drop');

        column.addEventListener('dragover', (event) => {
            if (window.innerWidth > 1240) {
                event.preventDefault();
                if (dropZone.style.display !== 'block') {
                    dropZone.style.display = 'block';
                }
            }
        });

        column.addEventListener('dragleave', (event) => {
            if (window.innerWidth > 1240) {
                if (!column.contains(event.relatedTarget)) {
                    dropZone.style.display = 'none';
                }
            }
        });

        column.addEventListener('drop', function (event) {
            if (window.innerWidth > 1240) {
                handleDrop(event);
            }
        });
    });

    initializeHoverEffect();
}

function handleResize() {
    initializeDragAndDrop();
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
    event.target.classList.add('dragging');
    document.addEventListener('mousemove', handleMouseMove);
}

document.querySelectorAll('.mini-task-container').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', function (e) {
        e.target.classList.remove('dragging');
    });
});

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    let taskIndex = event.dataTransfer.getData('text/plain');
    let taskElement = document.querySelector(`.mini-task-container[data-task-id="${taskIndex}"]`);
    let targetContainer;

    if (event.target.classList.contains('dotted-container-drag-drop')) {
        targetContainer = event.target.previousElementSibling;
    } else {
        targetContainer = event.target.closest('.dotted-container');
    }

    if (!targetContainer) {
        return; 
    }

    if (taskElement) {
        targetContainer.appendChild(taskElement);

        let placeholder = targetContainer.querySelector('.empty-column');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        updateTaskStatus(parseInt(taskIndex, 10), targetContainer.id);
        checkAllSections();
    }
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    document.querySelectorAll('.dotted-container-drag-drop').forEach(dropZone => {
        dropZone.style.display = 'none';
    });

    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
    document.removeEventListener('mousemove', handleMouseMove);
}

async function updateTaskStatus(taskIndex, newColumnId) {
    if (taskIndex < 0 || taskIndex >= tasksData.length) {
        return;
    }

    tasksData[taskIndex].progress = newColumnId.replace('board-', '').replace('-container', '');
    saveTasksToServer();

    displayAllTasks();
    checkAllSections();
}

function handleMouseMove(event) {
    let scrollSpeed = 1;
    let scrollMargin = 200;

    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }

    if (event.clientY < scrollMargin + 500) {
        autoScrollInterval = setInterval(() => {
            window.scrollTo({ top: window.scrollY - scrollSpeed, behavior: 'smooth' });
        }, 500);
    }

    else if (window.innerHeight - event.clientY < scrollMargin + 500) {
        autoScrollInterval = setInterval(() => {
            window.scrollTo({ top: window.scrollY + scrollSpeed, behavior: 'smooth' });
        }, 500);
    }
}

function changeButtonColor() {
    let btnMobile = document.getElementById('add-task-btn-board-mobile');

    if (btnMobile) {
        btnMobile.addEventListener('mouseover', function () {
            btnMobile.src = 'assets/img/board_add_mobile_hover.svg';
        });

        btnMobile.addEventListener('mouseout', function () {
            btnMobile.src = 'assets/img/board_add_mobile.svg';
        });
    }
}

//EDIT TASK EVENTLISTENER ---------------------------------------------------------------------------------------------------------
function setupEditFormEventListeners() {
    let editForm = document.querySelector('.edit-task-container');
    if (editForm) {
        editForm.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                return false;
            }
        });
    }
}

function disableEditFormEnterKeySubmission() {
    let form = document.getElementById('edit-task-container');
    if (form) {
        form.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                return false;
            }
        });
    }
}

function addEditSubtaskEventListener() {
    let subtaskInput = document.getElementById('edit-subtasks');
    let iconContainer = document.getElementById('edit-icon-container');

    subtaskInput.addEventListener('input', function () {
        if (subtaskInput.value.trim() !== '') {
            iconContainer.innerHTML = renderEditSubtaskIconHTML();
        } else {
            iconContainer.innerHTML = `<img class="icon-plus edit-mode-plus-icon" src="assets/img/addtask_plus.svg" alt="">`;
        }
    });
}

function setupEditInputEventListener() {
    let subtaskInput = document.getElementById('edit-subtasks');
    subtaskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            let isEditing = document.querySelector('.editing');
            if (isEditing) {
                let subtaskId = isEditing.id;
                saveEditedEditSubtask(subtaskId);
            } else {
                addEditSubtask();
            }
        }
    });
}

function addBoardEventListeners() {
    document.body.addEventListener('click', function (event) {
        if (event.target.matches('.edit-icon-task')) {
            let taskId = event.target.getAttribute('data-task-id');
            openEditTask(taskId);
        }
    });
    handleResize();
    changeButtonColor();

    window.addEventListener('resize', handleResize);
}

function setupSubtaskEventListeners() {
    setupEditFormEventListeners();
    disableEditFormEnterKeySubmission();
    addEditSubtaskEventListener();
    setupEditInputEventListener();
}