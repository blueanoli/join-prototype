let taskData = {
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation.",
    assignedTo: [
      { name: "Chris Redfield", color: "var(--user-blue)", initials: "CR" },
      { name: "Jill Valentine", color: "var(--user-red)", initials: "JV" }
    ],
    dueDate: "10/05/2023",
    priority: "Medium",
    category: "assets/img/user_story.svg",
    subtasks: [
      { title: "Implement Recipe Recommendation", completed: true },
      { title: "Start Page Layout", completed: false }
    ]
  };

function renderTaskOverlayHTML(taskData) {
    const overlayContainer = document.getElementById('edit-task-overlay');
  
    const htmlContent = /*html*/`
      <div class="edit-task-container" id="edit-task-container">
        <div class="edit-task-header">
          <img src="${taskData.category}" alt="Task Category">
          <img class="close-edit-task" onclick="closeTaskOverlay()" src="assets/img/cancel_dark.svg" alt="Close">
        </div>
        <div class="edit-task-title-container">
          <h1>${taskData.title}</h1>
        </div>
        <div class="edit-task-description-container">
          <span>${taskData.description}</span>
        </div>
        <div class="edit-task-due-date-container">
          <span class="task-container-mini-headlines">Due date:</span>
          <span>${taskData.dueDate}</span>
        </div>
        <div class="edit-task-priority-container">
          <span class="task-container-mini-headlines">Priority:</span>
          <div class="priority-icon-container">
            <span>${taskData.priority}</span>
            <img src="assets/img/addtask_${taskData.priority.toLowerCase()}.svg" alt="${taskData.priority}">
          </div>
        </div>
        <div class="edit-task-contacts-container">
          <span class="task-container-mini-headlines">Assigned to:</span>
          <div class="test-contact-container-board">
            ${taskData.assignedTo.map(person => `
              <div class="contact-icon-container">
                <p class="test-contact" style="background-color: ${person.color}">${person.initials}</p>
                ${person.name}
              </div>
            `).join('')}
          </div>
        </div>
        <div class="edit-task-subtasks-container">
          <span class="task-container-mini-headlines">Subtasks:</span>
          ${taskData.subtasks.map(subtask => `
            <div class="subtasks-check-container">
              <img src="assets/img/checkbox${subtask.completed ? 'checked' : 'empty'}.svg" alt="${subtask.completed ? 'Completed' : 'Not completed'}">
              <span>${subtask.title}</span>
            </div>
          `).join('')}
        </div>
        <div class="edit-task-footer">
          <div class="edit-task-footer-icons">
            <img src="assets/img/delete.svg" alt="Delete">
            <span>Delete</span>
          </div>
          <span class="subtask-line"></span>
          <div onclick="openEditTask()" class="edit-task-footer-icons">
            <img src="assets/img/pencil_grey.svg" alt="Edit">
            <span>Edit</span>
          </div>
        </div>
      </div>`;
  
    overlayContainer.innerHTML = htmlContent;
  }
 
function renderEditTaskOverlayHTML(taskData, assignedContactsHtml, subtasksHtml) {
  return /*html*/`
  <div class="edit-task-container edit-mode-task-container">
      <div class="edit-task-header edit-mode-task-header">
          <img class="close-edit-task" onclick="closeTaskOverlay()" src="assets/img/cancel_dark.svg" alt="Close">
      </div>
      <div class="edit-task-title-container edit-mode-task-title-container">
          <span class="task-container-mini-headlines">Title:</span>
          <input type="text" value="${taskData.title}" class="edit-input" id="edit-title">
      </div>
      <div class="edit-task-description-container edit-mode-task-description-container">
          <span class="task-container-mini-headlines">Description:</span>
          <textarea class="edit-textarea" id="edit-description">${taskData.description}</textarea>
      </div>
      <div class="edit-task-due-date-container edit-mode-task-due-date-container">
          <span class="task-container-mini-headlines">Due date:</span>
          <input type="text" value="${taskData.dueDate}" class="edit-input" id="edit-due-date">
      </div>
      <div class="edit-task-priority-container edit-mode-task-priority-container">
          <span class="task-container-mini-headlines">Priority:</span>
          <div class="priority-container edit-mode-priority-container">
              <div onclick="chooseUrgentPrio()" id="priority-urgent-board">Urgent <img id="img-urgent-board"
                      src="assets/img/addtask_urgent.svg"></div>
              <div onclick="chooseMediumPrio()" id="priority-medium-board">Medium <img id="img-medium-board"
                      src="assets/img/addtask_medium.svg"></div>
              <div onclick="chooseLowPrio()" id="priority-low-board">Low <img id="img-low-board"
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
          <button class="add-task-btn-style" onclick="addTask(); return false" id="add-task-btn">Ok<img
                  src="assets/img/addtask_check_white.svg"></button>
      </div>
  </div>`;
}

function renderMiniTaskHTML(taskData, sectionId) {
    return /*html*/`
      <div onclick="renderTaskOverlayHTML(taskData)" id="minitask-${sectionId}" class="mini-task-container">
            <div class="mini-task-header">
            <img src="${taskData.category}" alt="Task Category">
            </div>
            <div class="mini-task-title-container">
                <span>${taskData.title}</span>
            </div>
            <div class="mini-task-description-container">
                <span>${taskData.description}</span>
            </div>
            <div class="mini-task-subtask-container"></div>
            <div class="mini-task-footer-container">
                <div class="mini-task-contacts-container">
                    <div class="test-contact-container-board mini-contact-icons-container">
                        ${taskData.assignedTo.map(person => `
                        <div class="contact-icon-container mini-contact-icons">
                            <p class="test-contact" style="background-color: ${person.color}">${person.initials}</p>
                        </div>
                        `).join('')}
                    </div>
                </div>
                <div class="mini-task-prio-container">
                    <img src="assets/img/addtask_${taskData.priority.toLowerCase()}.svg" alt="${taskData.priority}">
                </div>
            </div>
        </div>`;
}