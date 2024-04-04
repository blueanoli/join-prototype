let contacts = [
  {
    name: "Tatjana Wolf",
    email: "wolf@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Peter Lustig",
    email: "lustig@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Philipp Plein",
    email: "plein@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Dan Schneider",
    email: "schneider@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Xavier Klein",
    email: "klein@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Jens Klein",
    email: "klein@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Levin Klein",
    email: "klein@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Felix Klein",
    email: "klein@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Ida Mueller",
    email: "mueller@gmail.de",
    phone: "+49 1234 45 678 9",
    color: "",
  },
  {
    name: "Gerald Mueller",
    email: "mueller@gmail.de",
    phone: "+49 1234 45 678 9",
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

    checkLetterContainer(contact, firstLetter);
  }
}

/* Checks if the Letter is already avaiable and adds it in the appropriate array if not */
function checkLetterContainer(contact, firstLetter) {
  if (!contactsByLetter[firstLetter]) {
    contactsByLetter[firstLetter] = [];
  }
  contactsByLetter[firstLetter].push(contact);
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

/* The "Add Container" slides in while the background fades darker */
function showAddContactContainer() {
  let contactsAddContainer = document.querySelector(".contacts-add-container");
  let contactsAdd = document.querySelector(".contacts-add");
  clearAddContainerInputfields();
  resetAddContactsChanges();

  if (contactsAddContainer) {
    contactsAddContainer.classList.add("fade-in");
    contactsAdd.classList.remove("slide-out");
  }
}

/* Clears the "Add Container" input-fields and sets the phone input-field 
back to its primarily value */
function clearAddContainerInputfields() {
  let nameInput = document.getElementById("name");
  let emailInput = document.getElementById("email");
  let phoneInput = document.getElementById("phone");

  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "+49";
}

/* The "Add Container" slides out while the background fades bright again */
function hideAddContactContainer() {
  let contactsAddContainer = document.querySelector(".contacts-add-container");
  let contactsAdd = document.querySelector(".contacts-add");

  if (contactsAddContainer) {
    resetAddContactsChanges();
    contactsAddContainer.classList.remove("fade-in");
    contactsAddContainer.classList.add("fade-out");
    setTimeout(function () {
      contactsAddContainer.classList.remove("fade-out");
    }, 750);
    contactsAdd.classList.add("slide-out");
  }
}

/* Changes the "Add Contact" cancel-icon within the button from the dark- to the blue version 
on hovering over the button */
function changeAddContactCancelBlue() {
  let cancel = document.getElementById("contacts-add-cancel-img");

  if (cancel.src.includes("cancel_dark.svg")) {
    cancel.src = "assets/img/cancel_blue.svg";
  }
}

/* Changes the "Add Contact" cancel-icon within the button from the blue- to the dark version 
on hovering out of the button */
function changeAddContactCancelDark() {
  let cancel = document.getElementById("contacts-add-cancel-img");

  if (cancel.src.includes("cancel_blue.svg")) {
    cancel.src = "assets/img/cancel_dark.svg";
  }
}

/* Adds automatically a space between the phone number at specified lengths 
when the user is typing in the phone input-field */
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

/* Displays an example of the required format of the phone input-field */
function showPhoneFormat() {
  let phone = document.getElementById("input-phone-format");

  phone.classList.add("shown");
}

/* Hides the example of the required format of the phone input-field */
function removePhoneFormat() {
  let phone = document.getElementById("input-phone-format");

  phone.classList.remove("shown");
}

/* Check's if the contact values are already exisiting */
function addContact() {
  let newName = document.getElementById("name").value;
  let newEmail = document.getElementById("email").value;
  let newPhone = document.getElementById("phone").value;

  let contact = {
    name: newName,
    email: newEmail,
    phone: newPhone,
  };

  let existingContactName = contacts.find((c) => c.name === newName);
  let existingContactEmail = contacts.find((c) => c.email === newEmail);
  let existingContactPhone = contacts.find((c) => c.phone === newPhone);

  if (existingContactName) {
    resetAddContactsChanges();
    isExistingContactName(newName);
  } else if (existingContactEmail) {
    resetAddContactsChanges();
    isExistingContactEmail(newEmail);
  } else if (existingContactPhone) {
    resetAddContactsChanges();
    isExistingContactPhone(newPhone);
  } else {
    addNewContact(contact);
  }
}

/* Resets Changes of an invalid contact-add submit */
function resetAddContactsChanges() {
  let nameContainer = document.getElementById("name-container");
  let emailContainer = document.getElementById("email-container");
  let phoneContainer = document.getElementById("phone-container");
  let textBox = document.getElementById("input-message");

  nameContainer.classList.remove("wrong-container");
  emailContainer.classList.remove("wrong-container");
  phoneContainer.classList.remove("wrong-container");
  textBox.classList.remove("shown");
}

/* Shows that the name is already taken */
function isExistingContactName(newName) {
  let nameContainer = document.getElementById("name-container");
  let textBox = document.getElementById("input-message");

  nameContainer.classList.add("wrong-container");
  textBox.classList.add("shown");
  textBox.innerHTML = `<b>${newName}</b> is already in the Contact-list.`;
}

/* Shows that the email is already taken */
function isExistingContactEmail(newEmail) {
  let emailContainer = document.getElementById("email-container");
  let textBox = document.getElementById("input-message");

  emailContainer.classList.add("wrong-container");
  textBox.classList.add("shown");
  textBox.innerHTML = `The Email: <b>${newEmail}</b> is already existing.`;
}

/* Shows that the phone number is already taken */
function isExistingContactPhone(newPhone) {
  let phoneContainer = document.getElementById("phone-container");
  let textBox = document.getElementById("input-message");

  phoneContainer.classList.add("wrong-container");
  textBox.classList.add("shown");
  textBox.innerHTML = `The number: <b>${newPhone}</b> is already in use.`;
}

/* Adds a new contact to the list if everything is valid */
function addNewContact(contact) {
  contacts.push(contact);
  let firstLetter = contact["name"].charAt(0).toUpperCase();

  checkLetterContainer(contact, firstLetter);
  hideAddContactContainer();
}

/* Prevents the form-submit if the "cancel"-button is clicked */
function preventFormSubmit() {
  let cancelButton = document.getElementById("contacts-add-cancel-button");

  cancelButton.addEventListener("click", function (event) {
    event.preventDefault();
  });
}
