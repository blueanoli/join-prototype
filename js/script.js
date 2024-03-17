const STORAGE_TOKEN = 'SUAP8YLQYG530FE8HDED8CKFONZBVXBSJ39FDPIR';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


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