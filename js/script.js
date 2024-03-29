const STORAGE_TOKEN = "SUAP8YLQYG530FE8HDED8CKFONZBVXBSJ39FDPIR";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";
const colors = [
  "--user-orange",
  "--user-mid-orange",
  "--user-light-orange",
  "--user-green",
  "--user-light-green",
  "--user-purple",
  "--user-light-purple",
  "--user-red",
  "--user-light-red",
  "--user-yellow",
  "--user-light-yellow",
  "--user-pink",
  "--user-light-pink",
  "--user-blue",
  "--user-light-blue",
];

async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json()).then(res => {
      if (res.data) {
        return res.data.value;
      } throw `Could not find data with key "${key}".`;
    });
}

async function initPageFunctions() {
  updateUserIcon();
  setActive();
  checkIfIsLoggedIn();
}

async function externalInit() {
  await includeHTML();
  document.getElementById('menu-items').style.display = 'none';
  document.getElementById('user-menu-icons').style.display = 'none';
  document.getElementById('privacy-section').classList.add('external-privacy');
  document.getElementById('privacy-link').setAttribute('href', 'external_privacy.html');
  document.getElementById('legal-link').setAttribute('href', 'external_legal.html');
  initPageFunctions();
}

async function helpInit() {
  await includeHTML();
  document.getElementById('help-icon').style.display = 'none';
  initPageFunctions();
}

async function init() {
  await includeHTML();
  initPageFunctions();
}

function checkIfIsLoggedIn() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const publicPages = ['index.html', 'external_privacy.html', 'external_legal.html', 'sign_up.html', '/'];
  const currentPage = window.location.pathname.split('/').pop();

  if (!publicPages.includes(currentPage) && !isLoggedIn) {
    alert('Log in required.');
    window.location.href = 'index.html'; 
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  checkIfIsLoggedIn();
  await checkWindowSize();
  initPageFunctions();
});

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  initPageFunctions();
}

function setActive() {
  let currentPagePath = window.location.pathname;
  document
    .querySelectorAll(".menu-link, .privacy-link-container a")
    .forEach((link) => {
      let isActive =
        new URL(link.href, document.baseURI).pathname === currentPagePath;
      link.classList.toggle("active", isActive);
      let parent = link.closest(".privacy-link-container");
      if (parent) parent.classList.toggle("active", isActive);
    });
}

function openUserMenu() {
  document.getElementById("user-menu").classList.remove("d-none");
  document.body.style.overflow = "hidden";
  document.addEventListener("click", closeUserMenu, true);
}

function closeUserMenu(event) {
  const userMenu = document.getElementById("user-menu");
  if (userMenu.contains(event.target)) {
    return;
  }
  userMenu.classList.add("d-none");
  document.body.style.overflow = "";
  document.removeEventListener("click", closeUserMenu, true);
}

//ASSIGN COLOR FOR USER AND GET INITALS
function getColorForInitials(initials) {
  let sum = 0;
  for (let i = 0; i < initials.length; i++) {
    sum += initials.charCodeAt(i);
  }
  return `var(${colors[sum % colors.length]})`;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

function goBack() {
  window.history.back();
}

function showBoardFromSummary() {
  window.location.href = 'board.html';
}

function updateUserIcon() {
  let userIcon = document.querySelector('.user-icon');
  if (userIcon) {
    let username = sessionStorage.getItem('username');

    if (username && username !== 'Guest') {
      let names = username.split(' ');
      if (names.length > 1) {
        userIcon.textContent = names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
      } else {
        userIcon.textContent = names[0].charAt(0).toUpperCase();
      }
    } else {
      userIcon.textContent = 'G';
    }
  }
}

async function checkWindowSize() {
  let includeDiv = document.querySelector('[w3-include-html]');
  let cssLink = document.querySelector('link[href*="template.css"]');
  let currentTemplate = includeDiv.getAttribute('w3-include-html');

  if (window.innerWidth < 1000) {
    if (currentTemplate !== 'assets/templates/mobile-template.html') {
      includeDiv.setAttribute('w3-include-html', 'assets/templates/mobile-template.html');
      cssLink.setAttribute('href', 'css/mobile-template.css');
      await includeHTML();
    }
  } else {
    if (currentTemplate !== 'assets/templates/desktop-template.html' || !currentTemplate) {
      includeDiv.setAttribute('w3-include-html', 'assets/templates/desktop-template.html');
      cssLink.setAttribute('href', 'css/desktop-template.css');
      await includeHTML();
    }
  }
}

window.addEventListener('resize', checkWindowSize);
document.addEventListener('DOMContentLoaded', () => {
  checkWindowSize();
  initPageFunctions();
});