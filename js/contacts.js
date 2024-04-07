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

/* Generates a object key with the generated letter and saves the contact in the appropriate ordered object */
function showContacts() {
  let letters = Object.keys(contactsByLetter);
  let sortedLetters = letters.sort();

  let contactsDiv = document.getElementById("contacts-contact");
  contactsDiv.innerHTML = "";

  for (let i = 0; i < sortedLetters.length; i++) {
    let letter = sortedLetters[i];

    letterContainerHTML(contactsDiv, letter);
    let contacts = contactsByLetter[letter];
    contacts = sortBySecondName(contacts);

    for (let j = 0; j < contacts.length; j++) {
      let contact = contacts[j];
      setBackgroundColor(contact);
      contactContainerHTML(contactsDiv, contact, letter, j);
    }
  }
}

/* Sorts the contact alphabetical by the second name if it's available */
function sortBySecondName(contactList) {
  contactList.sort((a, b) => {
    let lastNameA = "";
    let lastNameB = "";

    if (a.name.split(" ").length > 1) {
      lastNameA = a.name.split(" ")[1];
    }
    if (b.name.split(" ").length > 1) {
      lastNameB = b.name.split(" ")[1];
    }
    return lastNameA.localeCompare(lastNameB);
  });

  return contactList;
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
function contactContainerHTML(contactsDiv, contact, letter, j) {
  let contactsName = contact["name"];
  let contactsEmail = contact["email"];
  let contactsPhone = contact["phone"];
  let contactsColor = setBackgroundColor(contact);
  let acronym = getAcronyms(contactsName);
  let contactsID = getContactID(letter, j);

  return (contactsDiv.innerHTML += `
  <div 
    id="${contactsID}"
    tabindex="0" 
    class="contacts-contact-data contacts-contact-data-hover" 
    onclick="showContactDetails(
      '${contactsName}', 
      '${contactsEmail}',
      '${contactsPhone}', 
      '${acronym}', 
      '${contactsColor}',
      '${contactsID}')"
  >
    <div class="contacts-acronym-container" style="background-color: ${contactsColor};">
      <span>${acronym}</span>
    </div>
    <div class="contacts-contact-details">
      <span id="name-${contactsID}" class="contacts-contact-details-name">${contactsName}</span>
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

function getContactID(letter, j) {
  return letter + j;
}

/* The "Add Container" slides in while the background fades darker */
function showAddContactContainer() {
  let contactsAddContainer = document.querySelector(".contacts-add-container");
  let contactsAdd = document.querySelector(".contacts-add");
  clearAddContainerInputfields();
  resetAddContactsChanges();

  contactsAddContainer.classList.add("fade-in");
  contactsAdd.classList.remove("slide-out");
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

  showContactRegisterMsg();
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

/* Slides the register-msg in if the registration was successful and slides 
it out after a specified delay */
function showContactRegisterMsg() {
  let registerMsg = document.getElementById("contacts-register-msg");

  registerMsg.classList.add("contacts-add-register-msg-shown");
  setTimeout(function () {
    registerMsg.classList.remove("contacts-add-register-msg-hidden");
    registerMsg.classList.add("contacts-add-register-msg-reverse");
  }, 800);
  setTimeout(function () {
    registerMsg.classList.remove("contacts-add-register-msg-shown");
    registerMsg.classList.remove("contacts-add-register-msg-reverse");
    registerMsg.classList.add("contacts-add-register-msg-hidden");
  }, 1600);
}

/* Displays a container with details about the clicked contact */
function showContactDetails(
  contactsName,
  contactsEmail,
  contactsPhone,
  acronym,
  contactsColor,
  contactsID
) {
  let detailsContainer = document.getElementById("contacts-details");
  detailsContainer.innerHTML = "";

  changeContactDetailsVisuality(contactsID);
  detailsContainer.innerHTML = getContactDetailsHTML(
    contactsName,
    contactsEmail,
    contactsPhone,
    acronym,
    contactsColor,
    contactsID
  );
}

/* Changes the visuality of the interacted contact in the contact-list 
dependent on focus or blur of the div - (only possible through adding tabindex=0 to the div)*/
function changeContactDetailsVisuality(contactsID) {
  let background = document.getElementById(`${contactsID}`);
  let nameColor = document.getElementById(`name-${contactsID}`);

  if (!background.classList.contains("clicked")) {
    nameColor.classList.add("clicked");
    background.classList.add("clicked");
    background.classList.remove("contacts-contact-data-hover");

    background.addEventListener("blur", function () {
      resetContactDetailsVisuality(contactsID);
    });
  } else {
    resetContactDetailsVisuality(contactsID);
  }
}

/* Resets the visual changes of the changeContactDetailsVisuality()-Function */
function resetContactDetailsVisuality(contactsID) {
  let background = document.getElementById(`${contactsID}`);
  let nameColor = document.getElementById(`name-${contactsID}`);

  nameColor.classList.remove("clicked");
  background.classList.remove("clicked");
  background.classList.add("contacts-contact-data-hover");
}

/* Displays the container with the contact details */
function getContactDetailsHTML(
  contactsName,
  contactsEmail,
  contactsPhone,
  acronym,
  contactsColor,
  contactsID
) {
  return `
  <div class="contacts-details-header">
    <div class="contacts-details-acronym-container" style="background-color: ${contactsColor};">
      <span>${acronym}</span>
    </div>
    <div>
      <h2>${contactsName}</h2>
      <div class="contacts-details-edit-container">
        <div 
          class="contacts-details-edit-icons" 
          onclick="editContactDetails(
            '${contactsName}', 
            '${contactsEmail}', 
            '${contactsPhone}',
            '${acronym}',
            '${contactsColor}'
          )"
        >
          <img src="assets/img/pencil_grey.svg">
          <span>Edit</span>
        </div>
        <div class="contacts-details-edit-icons">
          <img src="assets/img/delete.svg">
          <span>Delete</span>
        </div>
      </div>
    </div>
  </div>
  <span class="contacts-details-contact-info">Contact Information</span>
  <div class="contacts-details-email-phone-container">
    <div class="contacts-details-email-phone">
      <h3>Email</h3>
      <span class="contacts-contact-details-email">${contactsEmail}</span>
    </div>
    <div class="contacts-details-email-phone">
      <h3>Phone</h3>
      <span>${contactsPhone}</span>
    </div>
  </div>`;
}

function editContactDetails(
  contactsName,
  contactsEmail,
  contactsPhone,
  acronym,
  contactsColor
) {
  let contactsEditContainer = document.querySelector(
    ".contacts-edit-container"
  );
  let contactsEdit = document.querySelector(".contacts-edit");

  let nameInput = document.getElementById("name");
  let emailInput = document.getElementById("email");
  let phoneInput = document.getElementById("phone");

  nameInput.value = contactsName;
  emailInput.value = contactsEmail;
  phoneInput.value = contactsPhone;

  contactsEditContainer.classList.add("fade-in");
  contactsEdit.classList.remove("slide-out");
}

function editContactDetailsHTML() {
  return `
  <div class="contacts-add-container">
    <div class="contacts-add">
      <img
        class="contacts-add-join-logo"
        src="assets/img/logo_white.svg"
        alt="join logo"
      />
      <div class="contacts-add-overlay">
        <h2>Edit contact</h2>
        <span class="contacts-add-overlay-border"></span>
      </div>
      <div class="contacts-add-main-container">
        <div class="contacts-add-cancel" onclick="hideAddContactContainer()">
          <img src="assets/img/cancel_dark.svg" alt="cancel icon" />
        </div>
        <form>
          <div class="contacts-add-main-profil-input-container">
            <div class="contacts-add-main-profil">
              <img src="assets/img/person_white.svg" alt="person icon" />
            </div>
            <div class="contacts-add-main-input-area">
              <div id="name-container" class="contacts-add-input-container">
                <input
                  required
                  id="name"
                  class="contacts-add-input"
                  type="text"
                  placeholder="Name"
                />
                <div class="contacts-add-input-icons">
                  <img src="assets/img/person.svg" alt="person icon" />
                </div>
              </div>
              <div id="email-container" class="contacts-add-input-container">
                <input
                  required
                  id="email"
                  class="contacts-add-input"
                  type="email"
                  placeholder="Email"
                />
                <div class="contacts-add-input-icons">
                  <img src="assets/img/mail.svg" alt="email icon" />
                </div>
              </div>
              <div id="phone-container" class="contacts-add-input-container">
                <input
                  required
                  id="phone"
                  class="contacts-add-input"
                  type="tel"
                  maxlength="20"
                  value="+49"
                  pattern="[1-9\s\+]{7,20}$"
                  placeholder="Phone"
                  onkeypress="addSpaceToPhoneNumber()"
                  onfocus="showPhoneFormat()"
                  onblur="removePhoneFormat()"
                />
                <div class="contacts-add-input-icons">
                  <img src="assets/img/phone.svg" alt="phone icon" />
                </div>
              </div>
              <span
                id="input-phone-format"
                class="contacts-add-input-phone-format"
              >
                Format e.g.: +49 2222 22 222 2
              </span>
              <span
                id="input-message"
                class="contacts-add-input-message"
              ></span>
            </div>
          </div>
          <div class="contacts-add-buttons-container">
            <button
              id="contacts-add-cancel-button"
              class="contacts-add-cancel-button"
              onclick="hideAddContactContainer(); preventFormSubmit()"
              onmouseover="changeAddContactCancelBlue()"
              onmouseout="changeAddContactCancelDark()"
            >
              Delete
              <img
                id="contacts-add-cancel-img"
                src="assets/img/cancel_dark.svg"
                alt="cancel icon"
              />
            </button>
            <button class="contacts-add-create-button">
              Save
              <img src="assets/img/addtask_check_white.svg" alt="check icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>;`;
}
