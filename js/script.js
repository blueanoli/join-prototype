const STORAGE_TOKEN = "SUAP8YLQYG530FE8HDED8CKFONZBVXBSJ39FDPIR";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";
const publicPages = ['index.html', 'external_privacy.html', 'external_legal.html', 'sign_up.html'];
let contacts = [];
let contactsByLetter = [];
let profileColors = [
  "#FF5733",
  "#FFC300",
  "#C70039",
  "#900C3F",
  "#FF5733",
  "#FFC300",
  "#73C6B6",
  "#3D9970",
  "#85144b",
  "#001f3f",
  "#0074D9",
  "#7FDBFF",
  "#B10DC9",
  "#F012BE",
  "#85144b",
  "#B10DC9",
];

/**
 * Uploads contacts to the server.
 * @async
 * @function uploadContacts
 */
async function uploadContacts() {
  try {
    await setItem("contacts", JSON.stringify(contacts));
  } catch (error) {
    console.error("Failed to upload contacts:", error);
  }
}

/**
 * Fetches contacts from the server.
 * @async
 * @function fetchContacts
 */
async function fetchContacts() {
  try {
    const contactsJSON = await getItem("contacts");
    contacts = JSON.parse(contactsJSON);

    if (!window.location.pathname.endsWith('/board.html') && !window.location.pathname.endsWith('/add_task.html')) {
      generateLetterContainer();
    }

  } catch (error) {
    console.error("Failed to fetch contacts:", error);
  }
}

/**
 * Asynchronously stores data in remote storage.
 * @async
 * @function setItem
 * @param {string} key - Key under which the data is stored.
 * @param {string} value - Data to store.
 * @returns {Promise<Object>} The response from the server as JSON.
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * Retrieves data from remote storage.
 * @async
 * @function getItem
 * @param {string} key - Key under which the data is stored.
 * @returns {Promise<string>} The stored data as a string.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json()).then(res => {
      if (res.data) {
        return res.data.value;
      } throw `Could not find data with key "${key}".`;
    });
}

/**
 * Initializes user-specific functions after page load.
 * @async
 * @function initPageFunctions
 */
async function initPageFunctions() {
  updateUserIcon();
  setActive();
}

/**
 * Initializes functions specific to external pages.
 * @async
 * @function externalInit
 */
async function externalInit() {
  await includeHTML();
  disableContent();
  initPageFunctions();
}

/**
 * Modifies the UI for external or unauthenticated users.
 * @function disableContent
 */
function disableContent() {
  const actions = [
    { id: 'menu-items', action: element => element.style.display = 'none' },
    { id: 'user-menu-icons', action: element => element.style.display = 'none' },
    { id: 'privacy-section', action: element => element.classList.add('external-privacy') },
    { id: 'privacy-link', action: element => element.setAttribute('href', 'external_privacy.html') },
    { id: 'legal-link', action: element => element.setAttribute('href', 'external_legal.html') }
  ];

  actions.forEach(({ id, action }) => {
    const element = document.getElementById(id);
    if (element) {
      action(element);
    }
  });
}

/**
 * Initializes functions for help pages and hides help icons.
 * @async
 * @function helpInit
 */
async function helpInit() {
  await includeHTML();
  document.getElementById('help-icon').style.display = 'none';
  initPageFunctions();
}

/**
 * General initialization for page components.
 * @async
 * @function init
 */
async function init() {
  await includeHTML();
  initPageFunctions();
}

/**
 * Checks if the user is logged in and redirects if not.
 * @function checkIfIsLoggedIn
 */
function checkIfIsLoggedIn() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const currentPage = window.location.pathname.split('/').pop();

  if (!publicPages.includes(currentPage) && !isLoggedIn) {
    sessionStorage.setItem('loginRequired', 'true');
    window.location.href = 'index.html';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (sessionStorage.getItem('loginRequired') === 'true') {
    sessionStorage.removeItem('loginRequired');
    document.getElementById('checkLogin').classList.remove('d-none');
  }

  if (checkIfIsLoggedIn()) {
    await includeHTML();
    let isPublic = isPublicPage();
    if (isPublic) {
      disableContent();
    }
    initPageFunctions();
    await checkWindowSize();
  }
});

/**
 * Includes HTML snippets from external files.
 * @async
 * @function includeHTML
 */
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

/**
 * Marks the current navigation link as active.
 * @function setActive
 */
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

/**
 * Displays the user menu and disables scrolling.
 * @function openUserMenu
 */
function openUserMenu() {
  document.getElementById("user-menu").classList.remove("d-none");
  document.body.style.overflow = "hidden";
  document.addEventListener("click", closeUserMenu, true);
}

/**
 * Hides the user menu and re-enables page scrolling.
 * @function closeUserMenu
 * @param {Event} event - The click event outside the user menu.
 */
function closeUserMenu(event) {
  const userMenu = document.getElementById("user-menu");
  if (userMenu.contains(event.target)) {
    return;
  }
  userMenu.classList.add("d-none");
  document.body.style.overflow = "";
  document.removeEventListener("click", closeUserMenu, true);
}

/**
 * Extracts initials from a full name.
 * @function getInitials
 * @param {string} name - Full name of the user.
 * @returns {string} The initials of the user.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/**
 * Clears session storage and logs out the user.
 * @function logout
 */
function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

/**
 * Navigates to the previous page in the browser history.
 * @function goBack
 */
function goBack() {
  window.history.back();
}

function goBackToContactlist() {
  window.location.href = 'contacts.html';
}

/**
 * Redirects to the board page from the summary.
 * @function showBoardFromSummary
 */
function showBoardFromSummary() {
  window.location.href = 'board.html';
}

/**
 * Updates the display of the user icon based on the session username.
 * @function updateUserIcon
 */
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

/**
 * Determines if the current page is publicly accessible.
 * @function isPublicPage
 * @returns {boolean} True if the page is public, otherwise false.
 */
function isPublicPage() {
  let currentPage = window.location.pathname.split('/').pop();
  return publicPages.includes(currentPage);
}

/**
 * Dynamically switches between mobile and desktop templates based on screen size.
 * @async
 * @function switchTemplate
 * @param {string} currentTemplate - Currently active template.
 * @param {boolean} isPublic - Indicates if the current page is public.
 */
async function switchTemplate(currentTemplate, isPublic) {
  let includeDiv = document.querySelector('[w3-include-html]');
  let cssLink = document.querySelector('link[href*="template.css"]');

  if (window.innerWidth < 1000) {
    await switchToMobileTemplate(currentTemplate, includeDiv, cssLink, isPublic);
  } else {
    await switchToDesktopTemplate(currentTemplate, includeDiv, cssLink, isPublic);
  }
}
/* Specific functions for switching to appropriate templates based on the current environment and device type. */
async function switchToMobileTemplate(currentTemplate, includeDiv, cssLink, isPublic) {
  if (currentTemplate !== 'assets/templates/mobile-template.html') {
    includeDiv.setAttribute('w3-include-html', 'assets/templates/mobile-template.html');
    cssLink.setAttribute('href', 'css/mobile-template.css');
    await includeHTML();
    if (isPublic) {
      disableContent();
    }
  }
}

async function switchToDesktopTemplate(currentTemplate, includeDiv, cssLink, isPublic) {
  if (currentTemplate !== 'assets/templates/desktop-template.html' || !currentTemplate) {
    includeDiv.setAttribute('w3-include-html', 'assets/templates/desktop-template.html');
    cssLink.setAttribute('href', 'css/desktop-template.css');
    await includeHTML();
    if (isPublic) {
      disableContent();
    }
  }
}

/**
 * Adjusts the visibility of the desktop menu based on screen size and page type.
 * @function adjustMenuDisplay
 */
function adjustMenuDisplay() {
  let isPublic = isPublicPage();
  let desktopMenu = document.querySelector('.desktop-menu');

  if (window.innerWidth < 1000 && isPublic) {
    if (desktopMenu) {
      desktopMenu.style.display = 'none';
    }
  } else {
    if (desktopMenu) {
      desktopMenu.style.display = '';
    }
  }
}

/**
 * Checks the browser window size and switches templates as needed.
 * @async
 * @function checkWindowSize
 */
async function checkWindowSize() {
  let includeDiv = document.querySelector('[w3-include-html]');
  if (includeDiv) {
    let currentTemplate = includeDiv.getAttribute('w3-include-html');
    let isPublic = isPublicPage();
    await switchTemplate(currentTemplate, isPublic);
    adjustMenuDisplay();
  }
  setActive();
}

/**
 * Ensures the template and layout adapt to window size changes, maintaining usability and appearance.
 * @function windowResizeHandler
 */
window.addEventListener('resize', checkWindowSize);
document.addEventListener('DOMContentLoaded', () => {
  checkWindowSize();
});
