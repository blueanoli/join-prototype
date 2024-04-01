let contacts = [
  {
    name: "Tatjana Wolf",
    email: "wolf@gmail.de",
    color: "",
  },
  {
    name: "Peter Lustig",
    email: "lustig@gmail.de",
    color: "",
  },
  {
    name: "Philipp Plein",
    email: "plein@gmail.de",
    color: "",
  },
  {
    name: "Dan Schneider",
    email: "schneider@gmail.de",
    color: "",
  },
  {
    name: "Xavier Klein",
    email: "klein@gmail.de",
    color: "",
  },
  {
    name: "Jens Klein",
    email: "klein@gmail.de",
    color: "",
  },
  {
    name: "Levin Klein",
    email: "klein@gmail.de",
    color: "",
  },
  {
    name: "Felix Klein",
    email: "klein@gmail.de",
    color: "",
  },
  {
    name: "Ida Mueller",
    email: "mueller@gmail.de",
    color: "",
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

/* Generates a div with a letter if it's the first letter of a contact */
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

/* Generates a object key with the generated letter and saves the contact in the appropriate object */
function showContacts() {
  let letters = Object.keys(contactsByLetter);
  let sortedLetters = letters.sort();

  let contactsDiv = document.getElementById("contacts-contact");
  contactsDiv.innerHTML = "";

  for (let i = 0; i < sortedLetters.length; i++) {
    let letter = sortedLetters[i];

    letterContainerHTML(contactsDiv, letter);
    let contacts = contactsByLetter[letter];

    for (let j = 0; j < contacts.length; j++) {
      let contact = contacts[j];
      setBackgroundColor(contact);
      contactContainerHTML(contactsDiv, contact);
    }
  }
}

/* Displays the letter div */
function letterContainerHTML(contactsDiv, letter) {
  return (contactsDiv.innerHTML += `
  <div class="contacts-letter-container">
    <span>${letter}</span>
  </div>
  <div class="contacts-letter-border"></div>`);
}

/* Saves the background color to local Storage and generates a key with 
the contact's name and a random hex-color as value*/
function setBackgroundColor(contact) {
  let user = contact["name"];
  let backgroundColor = contact["color"];

  let storedColor = localStorage.getItem(user);

  if (storedColor) {
    backgroundColor = storedColor;
  } else {
    backgroundColor = getDifferentBackgroundColor();
    localStorage.setItem(user, backgroundColor);
  }
  return backgroundColor;
}

/* Sets a random hex-color for each contact */
function getDifferentBackgroundColor() {
  let randomIndex = Math.floor(Math.random() * profileColors.length);
  let color = profileColors[randomIndex];

  return color;
}

/* Displays the individual contact */
function contactContainerHTML(contactsDiv, contact) {
  let contactsName = contact["name"];
  let contactsEmail = contact["email"];
  let contactsColor = setBackgroundColor(contact);
  let acronym = getAcronyms(contactsName);

  return (contactsDiv.innerHTML += `
  <div class="contacts-contact-data">
    <div class="contacts-acronym-container" style="background-color: ${contactsColor};">
      <span>${acronym}</span>
    </div>
    <div class="contacts-contact-details">
      <span class="contacts-contact-details-name">${contactsName}</span>
      <span class="contacts-contact-details-email">${contactsEmail}</span>
    </div>
  </div>`);
}

/* Searches for the first letters of first- and second name and returns them */
function getAcronyms(contactsName) {
  let firstLetters = contactsName.match(/\b(\w)/g);
  let acronym = firstLetters.join("").toUpperCase();

  return acronym;
}

function addSpaceToPhoneNumber() {
  let phone = document.getElementById("phone").value;
  if (
    phone.length == 3 ||
    phone.length == 8 ||
    phone.length == 11 ||
    phone.length == 15
  ) {
    document.getElementById("phone").value = phone + " ";
  }
}

function showAddContactContainer() {
  let contactsAddContainer = document.querySelector(".contacts-add-container");

  if (contactsAddContainer) {
    contactsAddContainer.classList.add("fade-in");
  }
}

function hideAddContactContainer() {
  let contactsAddContainer = document.querySelector(".contacts-add-container");

  if (contactsAddContainer) {
    contactsAddContainer.classList.remove("fade-in");
  }
}
