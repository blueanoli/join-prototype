const STORAGE_TOKEN = 'SUAP8YLQYG530FE8HDED8CKFONZBVXBSJ39FDPIR';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const colors = ['--user-orange', '--user-mid-orange','--user-light-orange','--user-green',
    '--user-light-green','--user-purple','--user-light-purple','--user-red','--user-light-red',
    '--user-yellow','--user-light-yellow','--user-pink','--user-light-pink','--user-blue','--user-light-blue'];


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}

async function init() {
    await includeHTML();
    setActive();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function setActive() {
    let currentPagePath = window.location.pathname;
    document.querySelectorAll('.menu-link, .privacy-link-container a').forEach(link => {
        let isActive = new URL(link.href, document.baseURI).pathname === currentPagePath;
        link.classList.toggle("active", isActive);
        let parent = link.closest('.privacy-link-container');
        if (parent) parent.classList.toggle("active", isActive);
    });
}

function openUserMenu() {
    document.getElementById('user-menu').classList.remove('d-none');
    document.body.style.overflow = 'hidden';
    document.addEventListener('click', closeUserMenu, true);
}

function closeUserMenu(event) {
    const userMenu = document.getElementById('user-menu');
    if (userMenu.contains(event.target)) {
        return;
    }
    userMenu.classList.add('d-none');
    document.body.style.overflow = '';
    document.removeEventListener('click', closeUserMenu, true);
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
    return name.split(' ').map(part => part[0]).join('').toUpperCase(); 
}