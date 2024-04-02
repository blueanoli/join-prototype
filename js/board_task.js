// TASK OVERLAY --------------------------------------------------------------------------------------------------------
function handleTaskClick(index) {
    const task = tasksData[index];
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    renderTaskOverlayHTML(task, index);
    const overlayContainer = document.getElementById('edit-task-overlay');
    overlayContainer.style.display = 'block'; 
}

function closeTaskOverlay() {
    isEditMode = false;
    let overlayContainer = document.getElementById('edit-task-overlay');
    let overlay = document.getElementById('page-overlay');
    let body = document.body;
    overlay.classList.remove('active');
    body.style.overflow = 'auto';
    overlayContainer.innerHTML = ''; 
    overlayContainer.style.display = 'none'; 

    displayAllTasks();
    checkAllSections();
}

function openEditTask(index) {
    isEditMode = true;
    let editOverlay = document.getElementById('edit-task-overlay');
    let assignedContactsHtml = '';
    let subtasksHtml = '';
    let task = tasksData[index];

    for (let i = 0; i < task.assignedTo.length; i++) {
        let contact = task.assignedTo[i];
        assignedContactsHtml += `
        <div class="contact-icon-container">
            <p class="test-contact" style="background-color: ${contact.color}">${contact.initials}</p>
        </div>`;
    }

    for (let j = 0; j < task.subtasks.length; j++) {
        let subtask = task.subtasks[j];
        subtasksHtml += `
        <div class="subtasks-check-container">
            <img onclick="changeSubtaskStatus(${index}, ${j})" class="subtask-check" src="assets/img/checkbox${subtask.completed ? 'checked' : 'empty'}.svg" alt="${subtask.completed ? 'Completed' : 'Not completed'}">
            <span>${subtask.title}</span>
        </div>`;
    }

    let htmlContent = renderEditTaskOverlayHTML(task, assignedContactsHtml, subtasksHtml, index);
    editOverlay.innerHTML = htmlContent;
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

    localStorage.setItem('tasksData', JSON.stringify(tasksData));
    closeTaskOverlay();
}

function deleteTask(index) {
    tasksData.splice(index, 1);
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
    closeTaskOverlay();
}

// ADD TASK OVERLAY ----------------------------------------------------------------------------------------------------
function openAddTask(progressStatus) {
    if (shouldRedirectToMobileView()) return;

    if (isOverlayOpen) return;
    prepareBoardForNewTask();

    let container = document.getElementById('add-task-container-board');
    activateOverlay(container, progressStatus);
}

function shouldRedirectToMobileView() {
    if (window.innerWidth < 1000) {
        window.location.href = 'add_task.html';
        return true;
    }
    return false;
}

function prepareBoardForNewTask() {
    populateEmptyColumns(sections);
    isOverlayOpen = true;
}

function activateOverlay(container, progressStatus) {
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    container.classList.remove('closing');
    container.classList.add('active');
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
    populateEmptyColumns(sections)

    let container = document.getElementById('add-task-container-board');
    let overlay = document.getElementById('page-overlay');
    let body = document.body;

    container.classList.add('closing');
    overlay.classList.remove('active');
    body.style.overflow = '';
    container.removeAttribute('w3-include-html');

    isOverlayOpen = false; 
}