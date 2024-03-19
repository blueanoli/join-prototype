let subtaskCounter = 0;
let testContacts = ['Max Mustermann', 'Susi Sonne', 'John Doe'];
let testCategories = ['Technical Task', 'User Story'];
let selectedContacts = {};

function checkRequiredField() {
    let fields = [
        { id: 'title', errorId: 'title-error' },
        { id: 'due-date', errorId: 'due-date-error' },
        { id: 'choose-category', errorId: 'category-error', isDiv: true },
    ];

    fields.forEach(field => {
        let inputElement = document.getElementById(field.id);
        let errorMessage = document.getElementById(field.errorId);

        let isFieldEmpty;

        if (field.isDiv) {
            isFieldEmpty = !inputElement.getAttribute('data-value');
        } else {
            isFieldEmpty = inputElement.value.trim() === '';
        }

        if (isFieldEmpty) {
            inputElement.classList.add('input-error');
            errorMessage.style.display = 'block';
        } else {
            inputElement.classList.remove('input-error');
            errorMessage.style.display = 'none';
        }
    });
}

function resetFieldStyle(element) {
    element.classList.remove('input-error');

    let errorId = element.id + '-error';
    let errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function chooseUrgentPrio() {
    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");

    urgent.classList.add("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent_white.svg";

    removeMediumPrio();
    removeLowPrio();
}

function chooseMediumPrio() {
    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");

    medium.classList.add("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium_white.svg";

    removeLowPrio();
    removeUrgentPrio();
}

function chooseLowPrio() {
    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");

    low.classList.add("low-priority-active");
    lowimg.src = "assets/img/addtask_low_white.svg";

    removeMediumPrio();
    removeUrgentPrio();
}

function addTask() {
    let notification = document.getElementById('notification-container');

    checkRequiredField();

    let isErrorVisible = Array.from(document.querySelectorAll('.error-message')).some(element => element.style.display === 'block');

    if (isErrorVisible) {
        return;
    }

    notification.classList.add("animate");
    notification.innerHTML = renderNotificationHTML();

    setTimeout(() => {
        notification.classList.remove("animate");
        notification.innerHTML = '';
        clearForm();
        window.location.href = "board.html";
    }, 1000);
}

function addSubtask() {
    let subtask = document.getElementById('subtasks').value;
    let subtaskcontainer = document.getElementById('subtask-container');
    let subtaskId = 'subtask-' + subtaskCounter++;

    subtaskcontainer.innerHTML += renderSubtaskHTML(subtask, subtaskId);

    document.getElementById('subtasks').value = '';
}

function removeSubtask(subtaskId) {
    let subtaskElement = document.getElementById(subtaskId);
    if (subtaskElement) {
        subtaskElement.remove();
    }
}

function renderContacts() {
    let dropdown = document.getElementById('assigned-to');
    let itemsDiv = dropdown.querySelector('.select-items');
    
    itemsDiv.innerHTML = '';

    testContacts.forEach(contact => {
        let initials = getInitials(contact);
        let color = getColorForInitials(initials);

        let optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';

        let isChecked = selectedContacts[contact] === true;
        let checkboxImage = isChecked ? "checkboxchecked.svg" : "checkboxempty.svg";
        optionDiv.innerHTML = renderContactHTML(contact, color, initials, checkboxImage);

        optionDiv.addEventListener('click', function (event) {
            event.stopImmediatePropagation();
            let isCheckboxClicked = event.target.classList.contains('checkbox-icon');
            let checkbox = isCheckboxClicked ? event.target : this.querySelector('.checkbox-icon');

            if (!selectedContacts[contact]) {
                checkbox.src = "assets/img/checkboxchecked.svg";
                addAssignedContact(contact);
                selectedContacts[contact] = true;
            } else {
                checkbox.src = "assets/img/checkboxempty.svg";
                removeAssignedContact(contact);
                selectedContacts[contact] = false;
            }
        });

        itemsDiv.appendChild(optionDiv);
    });
}

function addAssignedContact(contact) {
    let assignedTo = document.getElementById('assign-contacts');

    if (!assignedTo.innerHTML.includes(contact)) {
        let initials = getInitials(contact); 
        let color = getColorForInitials(initials); 

        assignedTo.innerHTML += renderAssignedContactHTML(initials, color);
    }
}

function removeAssignedContact(contact) {
    let assignedTo = document.getElementById('assign-contacts');
    let contacts = assignedTo.querySelectorAll('.assigned-contact');
    let contactInitials = getInitials(contact); 

    contacts.forEach((elem) => {
        let elemInitials = elem.querySelector('.test-contact').textContent; 
        if (elemInitials === contactInitials) {
            elem.remove(); 
        }
    });

    selectedContacts[contact] = false;
    updateCheckboxForContact(contact, false);
}

function updateCheckboxForContact(contact, isChecked) {
    let dropdown = document.getElementById('assigned-to');
    let itemsDiv = dropdown.querySelector('.select-items');
    let options = itemsDiv.querySelectorAll('.option-item');

    options.forEach((option) => {
        if (option.textContent.includes(contact)) {
            let checkbox = option.querySelector('.checkbox-icon');
            checkbox.src = isChecked ? "assets/img/checkboxchecked.svg" : "assets/img/checkboxempty.svg";
        }
    });
}

function renderCategories() {
    let dropdown = document.getElementById('choose-category');
    let itemsDiv = dropdown.querySelector('.select-items');
    let selectedDiv = dropdown.querySelector('.select-selected');

    itemsDiv.innerHTML = '';

    testCategories.forEach(category => {
        let optionDiv = document.createElement(`div`);
        optionDiv.textContent = category;
        optionDiv.addEventListener('click', function (event) {
            event.stopPropagation();
        
            selectedDiv.textContent = category;
            dropdown.setAttribute('data-value', category);
            resetFieldStyle(dropdown);
            
            let errorElement = document.getElementById('category-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
   
            itemsDiv.classList.add('select-hide');
            changeDropdownImg('choose-category', 'close');
        });
        itemsDiv.appendChild(optionDiv);
    });
}

function clearForm() {
    document.getElementById('add-task').reset();
    document.getElementById("add-task-btn").disabled = true;

    removeLowPrio();
    removeMediumPrio();
    removeUrgentPrio();
    clearAssignedContacts();
    resetCategorySelection();
    clearSubtasks();
}

// HILFSFUNKTIONEN
function removeLowPrio() {
    let low = document.getElementById("priority-low");
    let lowimg = document.getElementById("img-low");
    low.classList.remove("low-priority-active");
    lowimg.src = "assets/img/addtask_low.svg";
}

function removeMediumPrio() {
    let medium = document.getElementById("priority-medium");
    let mediumimg = document.getElementById("img-medium");
    medium.classList.remove("medium-priority-active");
    mediumimg.src = "assets/img/addtask_medium.svg";
}

function removeUrgentPrio() {
    let urgent = document.getElementById("priority-urgent");
    let urgentimg = document.getElementById("img-urgent");
    urgent.classList.remove("urgent-priority-active");
    urgentimg.src = "assets/img/addtask_urgent.svg";
}

function toggleDropdown(elementId, forceClose = false) {
    let itemsDiv = document.getElementById(elementId).querySelector('.select-items');
    if (forceClose || !itemsDiv.classList.contains('select-hide')) {
        itemsDiv.classList.add('select-hide');
        changeDropdownImg(elementId, 'close');
    } else {
        itemsDiv.classList.remove('select-hide');
        changeDropdownImg(elementId, 'open');
    }
}

function changeDropdownImg(elementId, state) {
    let imgId = elementId === 'choose-category' ? "img-dropdown-cat" : "img-dropdown";
    let img = document.getElementById(imgId);
    if (img) { 
        img.src = state === 'open' ? "assets/img/addtask_dropdown_up.svg" : "assets/img/addtask_dropdown.svg";
    }
}

function clearAssignedContacts() {
    let assignedTo = document.getElementById('assign-contacts');
    assignedTo.innerHTML = '';

    Object.keys(selectedContacts).forEach(key => {
        selectedContacts[key] = false;
    });

    renderContacts();
}

function resetCategorySelection() {
    let dropdown = document.getElementById('choose-category');
    dropdown.removeAttribute('data-value'); 
    let selectedDiv = dropdown.querySelector('.select-selected');
    selectedDiv.textContent = 'Select task category'; 
    resetFieldStyle(dropdown); 
}

function clearSubtasks() {
    let subtaskContainer = document.getElementById('subtask-container');
    subtaskContainer.innerHTML = '';
    subtaskCounter = 0; 
}