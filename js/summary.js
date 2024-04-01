async function renderSummary() {
    await init();
    updateSummaryData();
}

function dashboardGreeting() {
    let now = new Date();
    let hour = now.getHours();
    let greeting; 
    let userName = sessionStorage.getItem('username') || 'Guest'; 

    if (hour < 12) {
        greeting = "<span class='greetingTime'>Good morning,</span><br>";
    } else if (hour < 18) {
        greeting = "<span class='greetingTime'>Good afternoon,</span><br>";
    } else {
        greeting = "<span class='greetingTime'>Good evening,</span><br>";
    }

    document.getElementById('greeting').innerHTML = greeting + " " + "<span class='greetingUserName'>" + userName + "</span>";
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTodoBoxes();
    dashboardGreeting();
});

function initializeTodoBoxes() {
    let todoBoxes = document.querySelectorAll('.todo-box');
    todoBoxes.forEach(function(box) {
        box.addEventListener('mouseenter', enterTodoBox);
        box.addEventListener('mouseleave', leaveTodoBox);
    });
}

function enterTodoBox() {
    const img = this.querySelector('.summary-item img');
    updateImageOnEnter(img);
    updateTextColors(this, 'white');
}

function leaveTodoBox() {
    const img = this.querySelector('.summary-item img');
    resetImageOnLeave(img);
    updateTextColors(this, '');
}

function updateImageOnEnter(img) {
    if (!img) return;
    if (img.src.includes('pencil_white.svg')) {
        img.src = '/assets/img/pencil_grey.svg';
        img.style.width = '32px';
        img.style.height = '32px';
    } else if (img.src.includes('summary_done_white.svg')) {
        img.src = '/assets/img/summary_done_dark.svg';
    }
}

function resetImageOnLeave(img) {
    if (!img) return;
    if (img.src.includes('pencil_grey.svg')) {
        img.src = '/assets/img/pencil_white.svg';
        img.style.width = ''; 
        img.style.height = '';
    } else if (img.src.includes('summary_done_dark.svg')) {
        img.src = '/assets/img/summary_done_white.svg';
    }
}

function updateTextColors(element, color) {
    const texts = element.querySelectorAll('.summary-text, .number, span');
    texts.forEach(function(text) {
        text.style.color = color;
    });
}

function updateSummaryData() {
    const tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    const summaryCounts = { 'todo': 0, 'in-progress': 0, 'feedback': 0, 'done': 0, 'urgent': 0 };
  
    for (const task of tasksData) {
      if (task.progress) {
        summaryCounts[task.progress] = (summaryCounts[task.progress] || 0) + 1;
      }
      if (task.priority === 'urgent') {
        summaryCounts['urgent']++;
      }
    }
  
    const updateTextContent = (id, text) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = text;
      }
    };
  
    updateTextContent('todo-count', summaryCounts['todo']);
    updateTextContent('done-count', summaryCounts['done']);
    updateTextContent('urgent-count', summaryCounts['urgent']);
    updateTextContent('progress-count', summaryCounts['in-progress']);
    updateTextContent('feedback-count', summaryCounts['feedback']);
    updateTextContent('all-tasks-count', tasksData.length -1);

    updateNextDeadline();
  }

  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

  function updateNextDeadline() {
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [];
    tasksData = tasksData.filter(task => task.dueDate && new Date(task.dueDate) >= new Date());

    tasksData.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const nextDeadline = tasksData.length > 0 ? tasksData[0].dueDate : null;
    const deadlineElement = document.getElementById('deadline-date');
    const deadlineTextElement = document.getElementById('deadline-text');

    if (deadlineElement && deadlineTextElement) {
        if (nextDeadline) {
            deadlineElement.textContent = formatDate(new Date(nextDeadline));
        } else {
            deadlineTextElement.classList.add('d-none');
            deadlineElement.classList.add('d-none');
            document.getElementById('vertical-line').classList.add('d-none');
        }
    }
}