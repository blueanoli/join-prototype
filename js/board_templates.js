function renderTaskOverlayHTML(task, index) {
  const overlayContainer = document.getElementById('edit-task-overlay');
  const categorySvgPath = getCategorySvgPath(task.category);
  let dueDate = new Date(task.dueDate); 
  let formattedDueDate = dueDate.getDate().toString().padStart(2, '0') + '/' + 
                         (dueDate.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                         dueDate.getFullYear();
  

  const htmlContent = /*html*/`
      <div class="edit-task-container" id="edit-task-container">
        <div class="edit-task-header">
          <img src="${categorySvgPath}" alt="${task.category}">
          <img class="close-edit-task" onclick="closeTaskOverlay()" src="assets/img/cancel_dark.svg" alt="Close">
        </div>
        <div class="edit-task-title-container">
          <h1>${task.title}</h1>
        </div>
        <div class="edit-task-description-container">
          <span>${task.description}</span>
        </div>
        <div class="edit-task-due-date-container">
          <span class="task-container-mini-headlines">Due date:</span>
          <span>${formattedDueDate}</span>
        </div>
        <div class="edit-task-priority-container">
          <span class="task-container-mini-headlines">Priority:</span>
          <div class="priority-icon-container">
            <span>${task.priority.charAt(0).toUpperCase()}${task.priority.slice(1)}</span>
            <img src="assets/img/addtask_${task.priority.toLowerCase()}.svg" alt="${task.priority}">
          </div>
        </div>
        <div class="edit-task-contacts-container">
          <span class="task-container-mini-headlines">Assigned to:</span>
          <div class="test-contact-container-board">
            ${task.assignedTo.map(person => `
              <div class="contact-icon-container">
                <p class="test-contact" style="background-color: ${person.color}">${person.initials}</p>
                ${person.name}
              </div>
            `).join('')}
          </div>
        </div>
        <div class="edit-task-subtasks-container">
          <span class="task-container-mini-headlines">Subtasks:</span>
          ${task.subtasks.map((subtask, j) => `
    <div class="subtasks-check-container">
        <img onclick="changeSubtaskStatus(${index}, ${j})" class="subtask-check" id="subtask-check" src="assets/img/checkbox${subtask.completed ? 'checked' : 'empty'}.svg" alt="${subtask.completed ? 'Completed' : 'Not completed'}">
        <span>${subtask.title}</span>
    </div>
`).join('')}
        </div>
        <div class="edit-task-footer">
          <div onclick="deleteTask(${index})" class="edit-task-footer-icons">
            <img src="assets/img/delete.svg" alt="Delete">
            <span>Delete</span>
          </div>
          <span class="subtask-line"></span>
          <div onclick="openEditTask(${index})" class="edit-task-footer-icons">
            <img src="assets/img/pencil_grey.svg" alt="Edit">
            <span>Edit</span>
          </div>
        </div>
      </div>`;

  overlayContainer.innerHTML = htmlContent;
}

function renderEditTaskOverlayHTML(task, assignedContactsHtml, subtasksHtml, index) {
  return /*html*/`
  <div class="edit-task-container edit-mode-task-container">
      <div class="edit-task-header edit-mode-task-header">
          <img class="close-edit-task" onclick="closeTaskOverlay()" src="assets/img/cancel_dark.svg" alt="Close">
      </div>
      <div class="edit-task-title-container edit-mode-task-title-container">
          <span class="task-container-mini-headlines">Title:</span>
          <input type="text" value="${task.title}" class="edit-input" id="edit-title">
      </div>
      <div class="edit-task-description-container edit-mode-task-description-container">
          <span class="task-container-mini-headlines">Description:</span>
          <textarea class="edit-textarea" id="edit-description">${task.description}</textarea>
      </div>
      <div class="edit-task-due-date-container edit-mode-task-due-date-container">
          <span class="task-container-mini-headlines">Due date:</span>
          <input required onfocus="resetFieldStyle(this), this.type='date'" type="text" value="${task.dueDate}" id="due-date" class="date-input edit-mode-date-input"
                    placeholder="dd/mm/yyyy" title="Please choose a date in the future">
                <img class="date-icon edit-mode-date-icon" id="date-picker-icon" src="assets/img/addtask_date.svg" alt="">
      </div>
      <div class="edit-task-priority-container edit-mode-task-priority-container">
          <span class="task-container-mini-headlines">Priority:</span>
          <div class="priority-container edit-mode-priority-container">
              <div onclick="chooseUrgentPrio()" id="priority-urgent">Urgent <img id="img-urgent"
                      src="assets/img/addtask_urgent.svg"></div>
              <div onclick="chooseMediumPrio()" id="priority-medium">Medium <img id="img-medium"
                      src="assets/img/addtask_medium.svg"></div>
              <div onclick="chooseLowPrio()" id="priority-low">Low <img id="img-low"
                      src="assets/img/addtask_low.svg"></div>
          </div>
      </div>
      <div class="edit-task-contacts-container edit-mode-task-contacts-container">
          <span class="task-container-mini-headlines">Assigned to:</span>
          <div class="custom-select-wrapper edit-mode-wrapper" onclick="toggleDropdown('assigned-to'); renderContacts()">
          <div id="assigned-to" class="custom-select edit-mode--custom-select">
              <div class="select-selected">Select contacts to assign</div>
              <input oninput="filterContacts()" id="contact-search-input" type="text"
                  class="contact-search-input select-hide" placeholder="Type to search...">
              <img class="dropdown-arrow" id="img-dropdown" src="assets/img/addtask_dropdown.svg">
              <div class="select-items select-hide"></div>
          </div> 
      </div>
      <div id="assign-contacts">
      ${assignedContactsHtml}
      </div>
      </div>
      <div class="edit-task-subtasks-container edit-mode-task-subtasks-container">
          <span class="task-container-mini-headlines">Subtasks:</span>
      <div class="add-subtask">
          <input type="text" id="subtasks" placeholder="Add new subtask">
          <div id="icon-container">
              <img class="icon-plus edit-mode-plus-icon" src="assets/img/addtask_plus.svg" alt="">
          </div>
      </div>
      <div id="subtask-container">
          ${subtasksHtml}
      </div>
      </div>
      <div class="add-task-buttons-board">
          <button class="add-task-btn-style" onclick="saveEditedTask(${index}); return false" id="add-task-btn">Ok<img
                  src="assets/img/addtask_check_white.svg"></button>
      </div>
  </div>`;
}

function renderMiniTaskHTML(task, index) {
  let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  let totalSubtasks = task.subtasks.length;
  let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const categorySvgPath = getCategorySvgPath(task.category);
  const subtasksContainerHtml = totalSubtasks > 0 ? 
    `<div class="progress-bar-container" onmouseenter="showToastMessage(this)" onmouseleave="hideToastMessage(this)">
            <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
            <div class="toast-message">Completed: ${completedSubtasks}/${totalSubtasks}</div>
      </div>
      <span class="subtask-counter">${completedSubtasks}/${totalSubtasks} Subtasks</span>` : '';
  
  let truncatedDescription = task.description.length > 20 ? task.description.slice(0, 20) + '...' : task.description;

  return /*html*/`
      <div onclick="handleTaskClick(${index})" class="mini-task-container" draggable="true" data-task-id="${index}">
          <div class="mini-task-header">
              <img src="${categorySvgPath}" alt="${task.category}">
          </div>
          <div class="mini-task-title-container">
              <span>${task.title}</span>
          </div>
          <div class="mini-task-description-container">
              <span>${truncatedDescription}</span>
          </div>
          <div class="mini-task-subtask-container">
          ${subtasksContainerHtml}
          </div>
          <div class="mini-task-footer-container">
              <div class="mini-task-contacts-container">
                  <div class="test-contact-container-board mini-contact-icons-container">
                      ${task.assignedTo.map(person => `
                          <div class="contact-icon-container mini-contact-icons">
                              <p class="test-contact" style="background-color: ${person.color}">${person.initials}</p>
                          </div>
                      `).join('')}
                  </div>
              </div>
              <div class="mini-task-prio-container">
                  <img src="assets/img/addtask_${task.priority.toLowerCase()}.svg" alt="${task.priority}">
              </div>
          </div>
      </div>`;
}