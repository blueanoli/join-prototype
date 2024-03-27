let taskData = {
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation.",
    assignedTo: [
      { name: "Chris Redfield", color: "var(--user-blue)", initials: "CR" },
      { name: "Jill Valentine", color: "var(--user-red)", initials: "JV" }
    ],
    dueDate: "10/05/2023",
    priority: "Medium",
    category: "User Story",
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
          <span class="category-headline">${taskData.category}</span>
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
  
  function renderMiniTaskHTML(taskData, sectionId) {
    return /*html*/`
      <div onclick="renderTaskOverlayHTML(taskData)" id="minitask-${sectionId}" class="mini-task-container">
            <div class="mini-task-header">
                <span class="category-headline mini-task-category">${taskData.category}</span>
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
