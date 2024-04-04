// TASK OVERLAY --------------------------------------------------------------------------------------------------------
function handleTaskClick(index) {
    let task = tasksData[index];
    let overlayContainer = document.getElementById('edit-task-overlay');
    
    renderTaskOverlayHTML(task, index);
    activateOverlay(overlayContainer);
    overlayContainer.style.display = 'block'; 
}

function deactivateOverlay(container) {
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.remove('active');
    body.style.overflow = 'auto';
    container.style.display = 'none'; 
}

function clearOverlayContent(container) {
    container.innerHTML = '';
}

function closeTaskOverlay() {
    isEditMode = false;
    let overlayContainer = document.getElementById('edit-task-overlay');

    deactivateOverlay(overlayContainer);
    clearOverlayContent(overlayContainer);
    displayAllTasks();
    checkAllSections();
}

function openEditTask(index) {
    isEditMode = true;
    let editOverlay = document.getElementById('edit-task-overlay');
    let assignedContactsHtml = '';
    let subtasksHtml = '';
    let task = tasksData[index];

    if (!task || !task.assignedTo) {
        return; 
    }

    assignedContactsHtml = task.assignedTo.map(contact => `
        <div class="contact-icon-container">
            <p class="test-contact" style="background-color: ${contact.color}">${contact.initials}</p>
        </div>
    `).join('');

    subtasksHtml = task.subtasks.map((subtask, subtaskIndex) => {
        let subtaskId = `subtask-${index}-${subtaskIndex}`;
        return renderEditSubtaskHTML(subtask.title, subtaskId);
    }).join('');


    let htmlContent = renderEditTaskOverlayHTML(task, assignedContactsHtml, subtasksHtml, index);
    editOverlay.innerHTML = htmlContent;

    setupSubtaskEventListeners();
    initializePrioritySelectionInEditMode(task.priority);
}


function initializePrioritySelectionInEditMode(taskPriority) {
    let allPriorityDivs = document.querySelectorAll('.edit-mode-priority-container div');

    for (let i = 0; i < allPriorityDivs.length; i++) {
        let div = allPriorityDivs[i];
        let img = div.querySelector('img'); 
        let priority = div.id.split('-')[1]; 

        div.classList.remove('urgent-priority-active', 'medium-priority-active', 'low-priority-active');
        img.src = `assets/img/addtask_${priority}.svg`; 
    }

    let selectedDiv = document.getElementById(`priority-${taskPriority.toLowerCase()}`);
    let selectedImg = selectedDiv.querySelector('img');

    selectedDiv.classList.add(`${taskPriority.toLowerCase()}-priority-active`);
    selectedImg.src = `assets/img/addtask_${taskPriority.toLowerCase()}_white.svg`;
}
// CONTACTS FOR EDIT TASK ---------------------------------------------------------------------------------------------
function renderContactsForEdit(taskIndex) {
    let itemsDiv = document.getElementById('assigned-to').querySelector('.select-items');
    let currentTask = tasksData[taskIndex]; 
    let assignedContactNames = currentTask.assignedTo.map(contact => contact.name); 

    itemsDiv.innerHTML = ''; 

    testContacts.forEach(contact => {
        let contactIsAssigned = assignedContactNames.includes(contact); 
        let optionHTML = createContactOptionForEdit(contact, contactIsAssigned);
        itemsDiv.innerHTML += optionHTML;
    });

   toggleContactSelection();
}

function createContactOptionForEdit(contact, isAssigned) {
    let initials = getInitials(contact);
    let color = getColorForInitials(initials);
    let checkboxImage = isAssigned ? "checkboxchecked_white.svg" : "checkboxempty.svg";
    let selectedClass = isAssigned ? " selected" : "";

    return /*html*/`
        <div class='option-item${selectedClass}' onclick="toggleContactSelection('${contact}')">
            <div class="test-contact-container">
                <p class="test-contact" style="background-color: ${color};">${initials}</p>
                ${contact} 
            </div>
            <img class="checkbox-icon" src="assets/img/${checkboxImage}">
        </div>
    `;
}

function toggleContactSelection(contactName) {
    let wasSelected = selectedContacts[contactName];
    selectedContacts[contactName] = !wasSelected;

    updateDropdownDisplay(contactName, selectedContacts[contactName]);
    updateAssignedContactsView();
}

function updateDropdownDisplay(contactName, isSelected) {
    const contactOptions = document.querySelectorAll('.option-item');
    contactOptions.forEach(option => {
        if (option.textContent.trim().includes(contactName)) { 
            const checkboxIcon = option.querySelector('.checkbox-icon');
            if (isSelected) {
                option.classList.add('selected');
                checkboxIcon.src = 'assets/img/checkboxchecked_white.svg'; 
            } else {
                option.classList.remove('selected');
                checkboxIcon.src = 'assets/img/checkboxempty.svg';
            }
        }
    });
}

function updateAssignedContactsView() {
    const assignedContactsContainer = document.getElementById('assign-contacts');
    assignedContactsContainer.innerHTML = ''; 

    for (const contactName in selectedContacts) {
        if (selectedContacts[contactName]) {
            let initials = getInitials(contactName);
            let color = getColorForInitials(initials);
            let newContactHtml = renderAssignedContactHTML(initials, color);
            assignedContactsContainer.innerHTML += newContactHtml;
        }
    }
}

// SAVE AND DELETE TASKS ------------------------------------------------------------------------------------------------
function saveEditedTask(index){
    let task = tasksData[index]; 
    task.title = document.getElementById('edit-title').value;
    task.description = document.getElementById('edit-description').value;
    task.dueDate = document.getElementById('due-date').value;
    task.priority = editedTaskPriority || "medium";
    task.assignedTo = transformSelectedContactsToAssignedTo(selectedContacts);
    task.subtasks = prepareSubtasks(index);

    localStorage.setItem('tasksData', JSON.stringify(tasksData));
    addBoardAnimation("Task was updated", "assets/img/addtask_check_white.svg");
    setTimeout(closeTaskOverlay, 1500);
}

function deleteTask(index) {
    tasksData.splice(index, 1);
    localStorage.setItem('tasksData', JSON.stringify(tasksData));

    addBoardAnimation("Task was deleted", "assets/img/delete_blue.svg");
    setTimeout(closeTaskOverlay, 1500);
}

function addBoardAnimation(text, imgSrc) {
    let notification = document.getElementById('notification-container-edit');

    if (notification) {
        notification.innerHTML = renderNotificationHTML(text, imgSrc);
        notification.classList.add("animate");

        setTimeout(() => {
            notification.classList.remove("animate");
            notification.innerHTML = '';
        }, 2000);
    }
}

// ADD TASK OVERLAY ----------------------------------------------------------------------------------------------------
function openAddTask(progressStatus) {
    if (shouldRedirectToMobileView()) return;

    if (isOverlayOpen) return;
    prepareBoardForNewTask();

    let container = document.getElementById('add-task-container-board');
    activateOverlay(container);
    loadTaskForm(container, progressStatus);
}

function shouldRedirectToMobileView() {
    if (window.innerWidth < 1000) {
        window.location.href = 'add_task.html';
        return true;
    }
    return false;
}

function prepareBoardForNewTask() {
    populateColumnsWithTasks(sections);
    checkAllSections();
    isOverlayOpen = true;
}

function activateOverlay(container) {
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    container.classList.remove('closing');
    container.classList.add('active');
}

function loadTaskForm(container, progressStatus) {
    container.setAttribute('w3-include-html', 'assets/templates/task-form.html');

    includeHTML().then(() => {
        activateContainer(progressStatus);
        renderAddTask();
    });
}


function activateContainer(progressStatus) {
    let container = document.getElementById('add-task-container-board');
    container.style.display = 'block';

    let closeButton = document.getElementById('close-task-btn');
    if (closeButton) {
        closeButton.addEventListener('click', closeAddTask, { once: true });
    }
    container.setAttribute('data-progress-status', progressStatus);
}

function closeAddTask() {
    if (!isOverlayOpen) return;
    populateColumnsWithTasks(sections)
    checkAllSections();

    let container = document.getElementById('add-task-container-board');
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    container.classList.add('closing');
    overlay.classList.remove('active');
    body.style.overflow = '';
    container.removeAttribute('w3-include-html');

    isOverlayOpen = false; 
}

// SUBTASK LOGIC-----------------------------------------------------------------------------------------
function addEditSubtask() {
    let subtaskInput = document.getElementById('edit-subtasks'); 
    let subtaskValue = subtaskInput.value.trim();
    let subtaskContainer = document.getElementById('subtask-container');
    if(subtaskValue) {
        let taskIndex = tasksData.length - 1; // oder der Index der Aufgabe, die Sie gerade bearbeiten
        let subtaskIndex = tasksData[taskIndex].subtasks.length;
        let subtaskId = `edit-subtask-${taskIndex}-${subtaskIndex}`;
        subtaskContainer.innerHTML += renderEditSubtaskHTML(subtaskValue, subtaskId);

        subtaskInput.value = ''; 
        document.getElementById('edit-icon-container').innerHTML = `
        <img onclick="addEditSubtask()" class="icon-plus edit-mode-plus-icon" src="assets/img/addtask_plus.svg" alt="">`;
    }
 
}

function removeEditSubtask(subtaskId) {
    let subtask = document.getElementById(subtaskId);
    subtask.remove();
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
}

function editEditSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let subtaskValue = subtaskElement.querySelector('li').textContent;
    subtaskElement.innerHTML = renderEditSubtaskInputHTML(subtaskValue, subtaskId);
}

function saveEditedEditSubtask(subtaskId) {
    let inputField = document.querySelector(`#${subtaskId} input`);
    let newValue = inputField.value.trim();
    if(newValue) {
        let subtaskElement = document.getElementById(subtaskId);
        subtaskElement.innerHTML = renderSavedEditSubtaskHTML(newValue, subtaskId);
    }
}

function clearEditSubtasks() {
    document.getElementById('subtask-container').innerHTML = '';
}

function cancelEditSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    let originalValue = subtaskElement.dataset.originalValue;
    subtaskElement.innerHTML = renderSavedEditSubtaskHTML(originalValue, subtaskId);
}

function renderEditSubtaskInputHTML(value, subtaskId) {
    return `
        <input type="text" value="${value}" onblur="saveEditedEditSubtask('${subtaskId}')">
        <span class="icon-container">
            <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
            <span>|</span>
            <img onclick="saveEditedEditSubtask('${subtaskId}')" src="assets/img/addtask_check.svg" alt="">
        </span>
    `;
}

function renderSavedEditSubtaskHTML(value, subtaskId) {
    return `
        <li>${value}</li>
        <div class="subtask-icons">
            <img onclick="editEditSubtask('${subtaskId}')" src="assets/img/pencil_grey.svg" alt="">
            <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
        </div>
    `;
}

function renderEditSubtaskHTML(subtaskTitle, subtaskId, completed) {
    return /*html*/ `
        <div id="${subtaskId}" class="subtask">
            <ul>
                <li data-completed="${completed}">${subtaskTitle}</li>
            </ul>
            <div class="subtask-icons">
                <img onclick="editEditSubtask('${subtaskId}')" src="assets/img/pencil_grey.svg" alt="Edit">
                <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="Delete">
            </div>
        </div>`;
}

// MINITASK MENU LOGIC-----------------------------------------------------------------------------------------
function openMinitaskMenu(event, index) {
    event.stopPropagation();
    let minitaskContent = document.getElementById(`mini-task-content${index}`);
    minitaskContent.style.display = 'none';
    let minitaskMenu = document.getElementById(`mini-task-menu${index}`);
    minitaskMenu.style.display = 'block';
}

function closeMinitaskMenu(event, index) {
    event.stopPropagation();
    let minitaskMenu = document.getElementById(`mini-task-menu${index}`);
    minitaskMenu.style.display = 'none';
    let minitaskContent = document.getElementById(`mini-task-content${index}`);
    minitaskContent.style.display = 'block';
}
