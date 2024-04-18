/**
 * Generates HTML for task overlay subtasks.
 * @param {Array} subtasks - Array of subtasks.
 * @param {number} index - Index of the main task.
 * @returns {string} HTML for subtasks.
 */
function generateOverlaySubtasksHTML(subtasks, index) {
  let subtasksHTML = '';
  if (subtasks.length > 0) {
    subtasksHTML = /*html*/`
      <div class="edit-task-subtasks-container">
        <span class="task-container-mini-headlines">Subtasks:</span>
        ${subtasks.map((subtask, j) => `
          <div class="subtasks-check-container">
              <img onclick="changeSubtaskStatus(${index}, ${j})" class="subtask-check" id="subtask-check" src="assets/img/checkbox${subtask.completed ? 'checked' : 'empty'}.svg" alt="${subtask.completed ? 'Completed' : 'Not completed'}">
              <span>${subtask.title}</span>
          </div>
        `).join('')}
      </div>`;
  }
  return subtasksHTML;
}

/**
 * Renders HTML for task overlay.
 * @param {Object} task - Task object to be rendered.
 * @param {number} index - Index of task in task list.
 */
function renderTaskOverlayHTML(task, index) {
  const overlayContainer = document.getElementById('edit-task-overlay');
  const categorySvgPath = getCategorySvgPath(task.category);
  let dueDate = new Date(task.dueDate);
  let priority = task.priority;
  let formattedDueDate = dueDate.getDate().toString().padStart(2, '0') + '/' +
    (dueDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
    dueDate.getFullYear();
  let subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  let subtasksHTML = generateOverlaySubtasksHTML(subtasks, index);

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
            <span>${priority.charAt(0).toUpperCase()}${priority.slice(1)}</span>
            <img src="assets/img/addtask_${priority.toLowerCase()}.svg" alt="${priority}">
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
        ${subtasksHTML}
        <div class="edit-task-footer">
          <div onclick="deleteTask(${index})" class="edit-task-footer-icons">
            <img src="assets/img/delete.svg" alt="Delete">
            <span>Delete</span>
          </div>
          <span class="subtask-line"></span>
          <div onclick="openEditTask(${index})" class="edit-task-footer-icons edit-icon-task">
            <img src="assets/img/pencil_grey.svg" alt="Edit">
            <span>Edit</span>
          </div>
        </div>
      </div>
      <div id="notification-wrapper-edit">
        <div id="notification-container-edit"></div>
      </div>`;

  overlayContainer.innerHTML = htmlContent;
}

/**
 * Generates HTML for task editing overlay.
 * @param {Object} task - Task details.
 * @param {string} assignedContactsHtml - HTML for assigned contacts.
 * @param {string} subtasksHtml - HTML for subtasks.
 * @param {number} index - Task index.
 * @returns {string} - Generated HTML string.
 */
function renderEditTaskOverlayHTML(task, assignedContactsHtml, subtasksHtml, index) {
  return /*html*/`
  <form>
  <div class="edit-task-container edit-mode-task-container">
  <div class="scroll-container">
      <div class="edit-task-header edit-mode-task-header">
          <img class="close-edit-task" onclick="closeTaskOverlay()" src="assets/img/cancel_dark.svg" alt="Close">
      </div>
      <div class="edit-task-title-container edit-mode-task-title-container">
          <span class="task-container-mini-headlines">Title:</span>
          <input required maxlength="30" type="text" value="${task.title}" class="edit-input" id="edit-title" placeholder="Enter a title">
      </div>
      <div class="edit-task-description-container edit-mode-task-description-container">
          <span class="task-container-mini-headlines">Description:</span>
          <textarea placeholder="Enter a description" class="edit-textarea" id="edit-description">${task.description}</textarea>
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
              <div onclick="chooseUrgentPrio()" id="priority-urgent">Urgent <img id="img-urgent" src="assets/img/addtask_urgent.svg"></div>
              <div onclick="chooseMediumPrio()" id="priority-medium">Medium <img id="img-medium" src="assets/img/addtask_medium.svg"></div>
              <div onclick="chooseLowPrio()" id="priority-low">Low <img id="img-low" src="assets/img/addtask_low.svg"></div>
          </div>
      </div>
      <div class="edit-task-contacts-container edit-mode-task-contacts-container">
          <span class="task-container-mini-headlines">Assigned to:</span>
          <div class="custom-select-wrapper edit-mode-wrapper" onclick="toggleDropdown('edit-assigned-to'); renderContacts(${index})">
          <div id="edit-assigned-to" class="custom-select edit-mode--custom-select">
              <div class="select-selected">Select contacts to assign</div>
              <input oninput="filterContacts()" id="contact-search-input" type="text"
                  class="contact-search-input select-hide" placeholder="Type to search...">
              <img class="dropdown-arrow" id="img-dropdown" src="assets/img/addtask_dropdown.svg">
              <div class="select-items select-hide edit-select"></div>
          </div> 
      </div>
      <div class="edit-mode-assign-contacts" id="edit-assign-contacts">
      ${assignedContactsHtml}
      </div>
      </div>
      <div class="edit-task-subtasks-container edit-mode-task-subtasks-container">
        <span class="task-container-mini-headlines">Subtasks:</span>
        <div class="add-subtask edit-mode-add-subtask">
          <input oninput="renderEditSubtaskIconHTML(${index})" class="edit-subtask-input" type="text" id="edit-subtasks" placeholder="Add new subtask">
            <div class="edit-add-subtask-icon-container" id="edit-icon-container">
              <img class="icon-plus edit-mode-plus-icon" src="assets/img/addtask_plus.svg" alt="">
            </div>
        </div>
      </div>
      <div class="edit-mode-subtask-container" id="subtask-container">
          ${subtasksHtml}
      </div>
      <div class="add-task-buttons-board">
          <button class="add-task-btn-style" onclick="saveEditedTask(${index}); return false" id="add-task-btn">Ok<img
                  src="assets/img/addtask_check_white.svg"></button>
      </div>
      </div>
  </div>
  </form>
  <div id="notification-wrapper-edit">
    <div id="notification-container-edit"></div>
  </div>`;
}

/**
 * Generates HTML for a mini task.
 * @param {Object} task - Task details.
 * @param {number} index - Task index.
 * @returns {string} - Generated HTML string.
 */
function renderMiniTaskHTML(task, index) {
  let subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  let completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  let totalSubtasks = task.subtasks.length;
  let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const categorySvgPath = getCategorySvgPath(task.category);
  const subtasksContainerHtml = totalSubtasks > 0 ? renderSubtasksContainerHtml(progressPercentage, completedSubtasks, totalSubtasks) : '';
  let truncatedDescription = task.description.length > 20 ? task.description.slice(0, 20) + '...' : task.description;
  let priority = task.priority;
  let contactIconsHtml = renderContactIconsHtml(task.assignedTo);
  let additionalContacts = task.assignedTo.length > 3 ? renderAdditionalContacts(task.assignedTo.length) : '';

  return renderTaskContainerHtml(index, categorySvgPath, task.title, truncatedDescription, subtasksContainerHtml, contactIconsHtml, additionalContacts, priority);
}

/**
 * Generates HTML for a subtasks container.
 * @param {number} progressPercentage - Progress percentage.
 * @param {number} completedSubtasks - Number of completed subtasks.
 * @param {number} totalSubtasks - Total number of subtasks.
 * @returns {string} - Generated HTML string.
 */
function renderSubtasksContainerHtml(progressPercentage, completedSubtasks, totalSubtasks) {
  return /*html*/`
    <div class="progress-bar-container" onmouseenter="showToastMessage(this)" onmouseleave="hideToastMessage(this)">
      <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
      <div class="toast-message">Completed: ${completedSubtasks}/${totalSubtasks}</div>
    </div>
    <span class="subtask-counter">${completedSubtasks}/${totalSubtasks} Subtasks</span>`;
}

/**
 * Generates HTML for contact icons.
 * @param {Array} assignedTo - Array of people assigned to task.
 * @returns {string} - Generated HTML string.
 */
function renderContactIconsHtml(assignedTo) {
  return assignedTo.slice(0, 3).map(person => /*html*/ `
    <div class="contact-icon-container mini-contact-icons">
      <p class="test-contact" style="background-color: ${person.color}">${person.initials}</p>
    </div>`).join('');
}

/**
 * Generates HTML for additional contacts.
 * @param {number} assignedToLength - Total number of assigned contacts.
 * @returns {string} - Generated HTML string.
 */
function renderAdditionalContacts(assignedToLength) {
  return `<div class="contact-icon-container mini-contact-icons additional-contacts" style="background-color: var(--dark-blue)">
    +${assignedToLength - 3}
  </div>`;
}

/**
 * Generates HTML for task container.
 * @param {number} index - Task index.
 * @param {string} categorySvgPath - Path to category SVG.
 * @param {string} title - Task title.
 * @param {string} truncatedDescription - Truncated task description.
 * @param {string} subtasksContainerHtml - HTML for the subtasks container.
 * @param {string} contactIconsHtml - HTML for the contact icons.
 * @param {string} additionalContacts - HTML for additional contacts.
 * @param {string} priority - Task priority.
 * @returns {string} - Generated HTML string.
 */
function renderTaskContainerHtml(index, categorySvgPath, title, truncatedDescription, subtasksContainerHtml, contactIconsHtml, additionalContacts, priority) {
  return /*html*/`
      <div id="mini-task-container${index}" onclick="handleTaskClick(${index})" class="mini-task-container" draggable="true" data-task-id="${index}">
      <div id="mini-task-content${index}"> 
      <div class="mini-task-header">
              <img src="${categorySvgPath}" alt="${title}">
              <img onclick="openMinitaskMenu(event, ${index})" id="minitask-menu" class="minitask-menu" src="assets/img/contact_options_dark.svg" alt="Close">
          </div>
          <div class="mini-task-title-container">
              <span>${title}</span>
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
                      ${contactIconsHtml}
                      ${additionalContacts}
                  </div>
              </div>
              <div class="mini-task-prio-container">
                  <img src="assets/img/addtask_${priority.toLowerCase()}.svg" alt="${priority}">
              </div>
          </div>
      </div>
      <div id="mini-task-menu${index}" style="display: none;">
                ${renderMinitaskMenuHTML(index)}
            </div>
  </div>
  `;
}

/**
 * Generates HTML for mini task menu.
 * @returns {string} - Generated HTML string.
 */
function renderMinitaskMenuHTML(index) {
  return /*html*/`
  <div class="minitask-menu-content"> 
  <div class="minitask-menu-header">
    <span>Move Task</span>
    <img onclick="closeMinitaskMenu(event, ${index})" src="assets/img/cancel_dark.svg" alt="">
  </div>
  <div class="minitask-menu-container">
    <div class="minitask-menu-item" onclick="updateTaskProgressMobile(event, ${index}, 'todo')">
      <img src="assets/img/${tasksData[index].progress === 'todo' ? 'checkboxchecked.svg' : 'checkboxempty.svg'}" alt="">
      <span>To Do</span>
    </div>
    <div class="minitask-menu-item" onclick="updateTaskProgressMobile(event, ${index}, 'in-progress')">
      <img src="assets/img/${tasksData[index].progress === 'in-progress' ? 'checkboxchecked.svg' : 'checkboxempty.svg'}" alt="">
      <span>In Progress</span>
    </div>
    <div class="minitask-menu-item" onclick="updateTaskProgressMobile(event, ${index}, 'feedback')">
      <img src="assets/img/${tasksData[index].progress === 'feedback' ? 'checkboxchecked.svg' : 'checkboxempty.svg'}" alt="">
      <span>Await Feedback</span>
    </div>
    <div class="minitask-menu-item" onclick="updateTaskProgressMobile(event, ${index}, 'done')">
      <img src="assets/img/${tasksData[index].progress === 'done' ? 'checkboxchecked.svg' : 'checkboxempty.svg'}" alt="">
      <span>Done</span>
    </div>
  </div>
  </div>
  `;
}

/**
 * Generates HTML for edit subtask icons.
 * @returns {string} - Generated HTML string.
 */
function renderEditSubtaskIconHTML(index) {
  let iconContainer = document.getElementById('edit-icon-container');
  let subtaskInput = document.getElementById('edit-subtasks');

  if (subtaskInput.value.trim() !== '') {
    iconContainer.innerHTML = /*html*/`
        <img onclick="cancelEditSubtask(${index})" class="icon-cancel edit-mode-icon-cancel" src="assets/img/cancel_dark.svg" alt="">
        <div class="subtask-line edit-mode-subtask-line"></div>
        <img onclick="addEditSubtask(${index})" class="icon-confirm edit-mode-icon-confirm" src="assets/img/addtask_check.svg" alt="">
      `;
  } else {
    iconContainer.innerHTML = `<img class="icon-plus edit-mode-plus-icon" src="assets/img/addtask_plus.svg" alt="">`;
  }
}

/**
 * Returns HTML string for editable subtask input field.
 * Input field's value is set to given value, and it has onblur event handler that calls 'saveEditedEditSubtask'.
 * HTML also includes span with two images, one for removing the subtask and one for saving the edited subtask.
 *
 * @param {string} value - Value to set on input field.
 * @param {string} subtaskId - ID of subtask.
 * @returns {string} - HTML string for editable subtask input field.
 */
function renderEditSubtaskInputHTML(value, subtaskId) {
  return /*html*/`
      <input type="text" value="${value}" onblur="saveEditedEditSubtask('${subtaskId}')">
      <span class="icon-container">
          <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
          <span>|</span>
          <img onclick="saveEditedEditSubtask('${subtaskId}')" src="assets/img/addtask_check.svg" alt="">
      </span>
  `;
}

/**
* Returns HTML string for saved subtask.
* Subtask includes list item with the given value and div with two images,
* one for editing subtask and one for removing subtask.
*
* @param {string} value - Value of subtask.
* @param {string} subtaskId - ID of subtask.
* @returns {string} - HTML string for saved subtask.
*/
function renderSavedEditSubtaskHTML(value, subtaskId) {
  return /*html*/`
      <li>${value}</li>
      <div class="subtask-icons">
          <img onclick="editEditSubtask('${subtaskId}')" src="assets/img/pencil_grey.svg" alt="">
          <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="">
      </div>
  `;
}

/**
* Returns HTML string for subtask in edit mode.
* Subtask includes list item with given title and a completed data attribute,
* and div with two images, one for editing subtask and one for removing subtask.
*
* @param {string} subtaskTitle - Title of subtask.
* @param {string} subtaskId - ID of subtask.
* @param {boolean} completed - Completion status of subtask.
* @returns {string} - HTML string for subtask in edit mode.
*/
function renderEditSubtaskHTML(subtaskTitle, subtaskId, completed) {
  return /*html*/ `
      <div id="${subtaskId}" class="subtask edit-mode-subtask">
          <ul>
              <li data-completed="${completed}">${subtaskTitle}</li>
          </ul>
          <div class="subtask-icons">
              <img onclick="editEditSubtask('${subtaskId}')" src="assets/img/pencil_grey.svg" alt="Edit">
              <img onclick="removeEditSubtask('${subtaskId}')" src="assets/img/delete.svg" alt="Delete">
          </div>
      </div>`;
}