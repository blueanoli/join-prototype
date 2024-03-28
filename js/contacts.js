let contacts = [
  {
    name: "Tatjana Wolf",
    email: "wolf@gmail.de",
  },
  {
    name: "Peter Lustig",
    email: "lustig@gmail.de",
  },
  {
    name: "Philipp Plein",
    email: "plein@gmail.de",
  },
  {
    name: "Dan Schneider",
    email: "schneider@gmail.de",
  },
  {
    name: "Xavier Klein",
    email: "klein@gmail.de",
  },
];
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

function initContacts() {
  isNotLoggedIn();
  generateLetterContainer();
}

function isNotLoggedIn() {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
  }
}

function generateLetterContainer() {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let firstLetter = contact["name"].charAt(0).toUpperCase();

    if (!contactsByLetter[firstLetter]) {
      contactsByLetter[firstLetter] = [];
    }
    contactsByLetter[firstLetter].push(contact);
  }
  showContacts();
}

function showContacts() {
  let letters = Object.keys(contactsByLetter);

  let main = document.getElementById("contacts-main");
  main.innerHTML = "";

  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i];

    letterContainerHTML(main, letter);
    let contacts = contactsByLetter[letter];

    for (let j = 0; j < contacts.length; j++) {
      let contact = contacts[j];

      contactContainerHTML(main, contact);
    }
  }
}

function letterContainerHTML(main, letter) {
  return (main.innerHTML += `
  <div class="contacts-letter-container">
    <span>${letter}</span>
  </div>
  <div class="contacts-letter-border"></div>`);
}

function contactContainerHTML(main, contact) {
  let contactsName = contact["name"];
  let contactsEmail = contact["email"];
  let acronym = getAcronyms(contactsName);
  let backgroundColor = getDifferentBackgroundColor();

  return (main.innerHTML += `
  <div class="contacts-contact-data">
    <div class="contacts-acronym-container" style="background-color: ${backgroundColor};">
      <span>${acronym}</span>
    </div>
    <div class="contacts-contact-details">
      <span>${contactsName}</span>
      <span>${contactsEmail}</span>
    </div>
  </div>`);
}

function getAcronyms(contactsName) {
  let firstLetters = contactsName.match(/\b(\w)/g);
  let acronym = firstLetters.join("").toUpperCase();

  return acronym;
}

function getDifferentBackgroundColor() {
  let randomIndex = Math.floor(Math.random() * profileColors.length);
  let color = profileColors[randomIndex];

  return color;
}
