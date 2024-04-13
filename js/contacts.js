async function initContacts() {
  isNotLoggedIn();
  console.log("Initializing contacts...", contacts);
  await fetchContacts();
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

    if (contactsByLetter[letter].length > 0) {
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
  if (!contact.color) {
    contact.color = getDifferentBackgroundColor();
  }
  return contact.color;
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
  let words = contactsName.split(/\s+/);
  let firstLetters = words.map((word) => word.charAt(0));
  let acronym = firstLetters.join("").toUpperCase();

  return acronym;
}

function getContactID(letter, j) {
  return letter + j;
}

/* The "Add Container" slides in while the background fades darker */
function showAddContactContainer() {
  let contactsAddContainer = document.querySelector(".contacts-add-container");
  contactsAddContainer.innerHTML = addContactOverlayHTML();
  let contactsAdd = document.querySelector(".contacts-add");
  clearAddContainerInputfields();
  resetAddContactsChanges();

  contactsAddContainer.classList.add("fade-in");
  contactsAdd.classList.remove("slide-out");
}

/* Displays the Add-Contact Overlay */
function addContactOverlayHTML() {
  return ` 
  <div class="contacts-add">
    <img
      class="contacts-add-join-logo"
      src="assets/img/logo_white.svg"
      alt="join logo"
    />
    <div class="contacts-add-overlay">
      <h2>Add contact</h2>
      <span>Tasks are better with a team!</span>
      <span class="contacts-add-overlay-border"></span>
    </div>
    <div class="contacts-add-main-container">
      <div class="contacts-add-cancel" onclick="hideAddContactContainer()">
        <img
          id="cancel-dark"
          src="assets/img/cancel_dark.svg"
          alt="cancel icon"
        />
        <img
          id="cancel-white"
          src="assets/img/cancel_white.svg"
          alt="cancel icon"
          class="d-none"
        />
      </div>
      <form onsubmit="addContact(); return false;">
        ${getAddContactOverlayFormHTML()}
      </form>
    </div>
  </div>`;
}

/* Displays the Form Area in the Add-Contact Overlay */
function getAddContactOverlayFormHTML() {
  return `
    <div class="contacts-add-main-profil-input-container">
      <div class="contacts-add-main-profil">
        <img src="assets/img/person_white.svg" alt="person icon" />
      </div>
      <div class="contacts-add-main-input-area">
        ${getAddContactOverlayFormInputAreaHTML()}
      </div>
    </div>
    <div class="contacts-add-buttons-container">
      ${getAddContactOverlayFormButtonsHTML()}
    </div>
  `;
}

/* Displays the Form Input Area in the Add-Contact Overlay */
function getAddContactOverlayFormInputAreaHTML() {
  return `
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
        placeholder="Phone"
        onkeypress="addSpaceToPhoneNumber()"
        onfocus="showPhoneFormat()"
        onblur="removePhoneFormat()"
      />
      <div class="contacts-add-input-icons">
        <img src="assets/img/phone.svg" alt="phone icon" />
      </div>
    </div>
    <span id="input-phone-format" class="contacts-add-input-phone-format">
      Format e.g.: +49 2222 22 222 2
    </span>
    <span id="input-message" class="contacts-add-input-message"></span>
  `;
}

/* Displays the Form Area Buttons in the Add-Contact Overlay */
function getAddContactOverlayFormButtonsHTML() {
  return `
    <button
      id="contacts-add-cancel-button"
      class="contacts-add-cancel-button"
      onclick="hideAddContactContainer(); preventFormSubmit()"
      onmouseover="changeAddContactCancelBlue()"
      onmouseout="changeAddContactCancelDark()"
    >
      Cancel
      <img
        id="contacts-add-cancel-img"
        src="assets/img/cancel_dark.svg"
        alt="cancel icon"
      />
    </button>
    <button class="contacts-add-create-button">
      Create contact
      <img src="assets/img/addtask_check_white.svg" alt="check icon" />
    </button>
  `;
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
  uploadContacts();
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

  showNewContactBackground(contact);
  showContactRegisterMsg();
  checkLetterContainer(contact, firstLetter);
  hideAddContactContainer();
  uploadContacts();
}

function showNewContactBackground(contact) {
  let foundContact = contacts.find(
    (c) =>
      c.name === contact.name &&
      c.email === contact.email &&
      c.phone === contact.phone
  );

  if (foundContact) {
    console.log(foundContact);
  }
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

/* Flag to monitor if contact details are currently being shown */
let isContactDetailsVisible = false;

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

  isContactDetailsVisible = true;
  /* Adjust display property based on the current screen size */
  adjustDisplayForScreenSize();
}

function goBackToContactList() {
  const contactContainer = document.querySelector('.contacts-contact-container');
  contactContainer.style.display = 'block';

  const mainContainer = document.querySelector('.contacts-main-container');
  mainContainer.style.display = 'none';

  isContactDetailsVisible = false;  // Reset the flag
}

/* Function to adjust the display property */
function adjustDisplayForScreenSize() {
  const contactContainer = document.querySelector('.contacts-contact-container');
  const mainContainer = document.querySelector('.contacts-main-container');

  if (window.innerWidth < 800) {
    if (isContactDetailsVisible) {
      contactContainer.style.display = 'none';
      mainContainer.style.cssText = 'display: block !important';
    } else {
      contactContainer.style.display = 'block';
      mainContainer.style.cssText = '';
    }
  } else {
    contactContainer.style.display = 'block';
    mainContainer.style.display = 'block';
  }
}

/* Event listener for window resize events */
window.addEventListener('resize', adjustDisplayForScreenSize);

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
      <div
        class="contacts-details-acronym-container"
        style="background-color: ${contactsColor};"
      >
        <span class="contacts-acronym">${acronym}</span>
      </div>
      <button class="contacts-arrow-button d-none" onclick="goBackToContactlist()">
      <img class="arrow-left" src="assets/img/left_arrow.svg">
  </button>
  <div class="mobile-menu-icon" onclick="showContactsMobileMenu()">
      <span class="mobile-dot"></span>
      <span class="mobile-dot"></span>
      <span class="mobile-dot"></span>
  </div>
      <div>
        <h2 class="contacts-name">${contactsName}</h2>
        <div class="contacts-details-edit-container">
          <div
            class="contacts-details-edit-icons"
            onmouseover="changeEditContactImgBlue()"
            onmouseout="changeEditContactImgDark()"
            onclick="editContactDetailsOverlay(
            '${contactsName}', 
            '${contactsEmail}', 
            '${contactsPhone}',
            '${acronym}',
            '${contactsColor}',
            '${contactsID}'
          )"
          >
            <img
              id="contacts-details-edit-img"
              src="assets/img/pencil_grey.svg"
            />
            <span>Edit</span>
          </div>
          <div
            class="contacts-details-edit-icons"
            onmouseover="changeDeleteContactImgBlue()"
            onmouseout="changeDeleteContactImgDark()"
            onclick="deleteContact(
          '${contactsName}', 
          '${contactsEmail}', 
          '${contactsPhone}');"
          >
            <img
              id="contacts-details-delete-img"
              src="assets/img/delete_grey.svg"
            />
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

/* Shows mobile menu */
function showContactsMobileMenu() {
  if (window.innerWidth < 800) {
    var container = document.querySelector('.contacts-details-edit-container');
    container.style.display = (container.style.display === 'none' || container.style.display === '') ? 'flex' : 'none';
  }
}

document.addEventListener('click', function (event) {
  if (window.innerWidth < 800) {
    var container = document.querySelector('.contacts-details-edit-container');
    var mobileMenuIcon = document.querySelector('.mobile-menu-icon');

    if (!container.contains(event.target) && !mobileMenuIcon.contains(event.target)) {
      container.style.display = 'none';
    }
  }
});

function editContactDetailsOverlay(
  contactsName,
  contactsEmail,
  contactsPhone,
  acronym,
  contactsColor,
  contactsID
) {
  let contactsAddContainer = document.querySelector(".contacts-add-container");
  contactsAddContainer.innerHTML = editContactDetailsOverlayHTML(
    contactsName,
    contactsEmail,
    contactsPhone,
    acronym,
    contactsColor,
    contactsID
  );

  let nameInput = document.getElementById("name");
  let emailInput = document.getElementById("email");
  let phoneInput = document.getElementById("phone");

  nameInput.value = contactsName;
  emailInput.value = contactsEmail;
  phoneInput.value = contactsPhone;

  contactsAddContainer.classList.add("fade-in");
}

/* Displays the Edit-Contact Overlay */
function editContactDetailsOverlayHTML(
  contactsName,
  contactsEmail,
  contactsPhone,
  acronym,
  contactsColor,
  contactsID
) {
  return ` 
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
        ${getEditContactDetailsFormHTML(
    contactsName,
    contactsEmail,
    contactsPhone,
    acronym,
    contactsColor,
    contactsID
  )}
      </div>
    </div>
    `;
}

/* Displays the Form Area in the Edit-Contact Overlay */
function getEditContactDetailsFormHTML(
  contactsName,
  contactsEmail,
  contactsPhone,
  acronym,
  contactsColor,
  contactsID
) {
  return `
    <form
      onsubmit="checkEditedContactDetails(
        '${contactsName}', 
        '${contactsEmail}', 
        '${contactsPhone}', 
        '${acronym}', 
        '${contactsColor}', 
        '${contactsID}'); return false;"
    >
      <div class="contacts-add-main-profil-input-container">
        ${getEditContactDetailsFormAcronymHTML(acronym, contactsColor)}
        <div class="contacts-add-main-input-area">
          ${getEditContactDetailsFormInputAreaHTML()}
        </div>
      </div>
      <div class="contacts-edit-buttons-container">
        ${getEditContactDetailsFormButtonsHTML(
    contactsName,
    contactsEmail,
    contactsPhone
  )}
      </div>
    </form>
  `;
}

/* Displays the Acronyms-Area in the Edit-Contact Overlay */
function getEditContactDetailsFormAcronymHTML(acronym, contactsColor) {
  return `
    <div
      class="contacts-details-acronym-container contacts-add-main-profil"
      style="background-color: ${contactsColor};"
    >
      <span>${acronym}</span>
    </div>
  `;
}

/* Displays the Form Input Area in the Edit-Contact Overlay */
function getEditContactDetailsFormInputAreaHTML() {
  return `
    <div id="name-container" class="contacts-details-edit-input-container">
      <input
        required
        readonly
        id="name"
        class="contacts-details-edit-input"
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
        placeholder="Phone"
        onkeypress="addSpaceToPhoneNumber()"
        onfocus="showPhoneFormat()"
        onblur="removePhoneFormat()"
      />
      <div class="contacts-add-input-icons">
        <img src="assets/img/phone.svg" alt="phone icon" />
      </div>
    </div>
    <span id="input-phone-format" class="contacts-add-input-phone-format">
      Format e.g.: +49 2222 22 222 2
    </span>
    <span id="input-message" class="contacts-add-input-message"></span>
  `;
}

/* Displays the Form Area Buttons in the Edit-Contact Overlay */
function getEditContactDetailsFormButtonsHTML(
  contactsName,
  contactsEmail,
  contactsPhone
) {
  return `
    <button
      id="contacts-edit-delete-button"
      class="contacts-edit-delete-button"
      onclick="deleteContact(
           '${contactsName}', 
           '${contactsEmail}', 
           '${contactsPhone}'); 
           preventFormSubmitByEdit();
           hideAddContactContainer()"
    >
      Delete
    </button>
    <button class="contacts-add-create-button">
      Save
      <img src="assets/img/addtask_check_white.svg" alt="check icon" />
    </button>
  `;
}

/* Searches for the contact and deletes it from the contacts-array if the contact is found */
function deleteContact(contactsName, contactsEmail, contactsPhone) {
  let index = contacts.findIndex(
    (c) =>
      c.name === contactsName &&
      c.email === contactsEmail &&
      c.phone === contactsPhone
  );
  if (index !== -1) {
    contacts.splice(index, 1);

    deleteContactLetterContainer(contactsName, contactsEmail, contactsPhone);
  }
  showContacts();
  showEmptyContactDetails();
}

/* Searches for the first letter of the to-deleted contact and deletes it if it's the only contact
with this letter as it's first letter */
function deleteContactLetterContainer(
  contactsName,
  contactsEmail,
  contactsPhone
) {
  let firstLetter = contactsName.charAt(0).toUpperCase();
  let letterContacts = contactsByLetter[firstLetter];

  let contactIndex = letterContacts.findIndex(
    (c) =>
      c.name === contactsName &&
      c.email === contactsEmail &&
      c.phone === contactsPhone
  );
  if (contactIndex !== -1) {
    letterContacts.splice(contactIndex, 1);
  }
  uploadContacts();
}

/* Displays a blank contact-details container after deleting the contact */
function showEmptyContactDetails() {
  let detailsContainer = document.getElementById("contacts-details");
  detailsContainer.innerHTML = "";
}

/* Prevents the submitting of the form if the contact is edited */
function preventFormSubmitByEdit() {
  let deleteButton = document.getElementById("contacts-edit-delete-button");

  deleteButton.addEventListener("click", function (event) {
    event.preventDefault();
  });
}

/* Checks if the email or phone number is already in use at other contacts by
excluding the current contact's data */
function checkEditedContactDetails(
  contactsName,
  contactsEmail,
  contactsPhone,
  acronym,
  contactsColor,
  contactsID
) {
  let newEmail = document.getElementById("email").value;
  let newPhone = document.getElementById("phone").value;

  let index = findContactIndex(contactsName, contactsEmail, contactsPhone);
  let existingContactEmail = findExistingEmailWithoutCurrent(index, newEmail);
  let existingContactPhone = findExistingPhoneWithoutCurrent(index, newPhone);

  if (existingContactEmail) {
    resetAddContactsChanges();
    isExistingContactEmail(newEmail);
  } else if (existingContactPhone) {
    resetAddContactsChanges();
    isExistingContactPhone(newPhone);
  } else {
    editContactDetails(
      index,
      newEmail,
      newPhone,
      contactsName,
      acronym,
      contactsColor,
      contactsID
    );
  }
}

/* Searches for the contact index */
function findContactIndex(contactsName, contactsEmail, contactsPhone) {
  return contacts.findIndex(
    (c) =>
      c.name === contactsName &&
      c.email === contactsEmail &&
      c.phone === contactsPhone
  );
}

/* Searches for the exisiting emails without the email of the current to-edited contact */
function findExistingEmailWithoutCurrent(index, newEmail) {
  return contacts.find((c, i) => i !== index && c.email === newEmail);
}

/* Searches for the exisiting phone numbers without the phone number of the current to-edited contact */
function findExistingPhoneWithoutCurrent(index, newPhone) {
  return contacts.find((c, i) => i !== index && c.phone === newPhone);
}

/* Changes the edit email or phone number */
function editContactDetails(
  index,
  newEmail,
  newPhone,
  contactsName,
  acronym,
  contactsColor,
  contactsID
) {
  if (index !== -1) {
    contacts[index].email = newEmail;
    contacts[index].phone = newPhone;

    uploadContacts();
    showContacts();
    hideAddContactContainer();
    showContactDetails(
      contactsName,
      newEmail,
      newPhone,
      acronym,
      contactsColor,
      contactsID
    );
  }
}

/* Changes the edit icon in contacts-edit overlay within the div from the dark- to the blue version 
on hovering over the div */
function changeEditContactImgBlue() {
  let edit = document.getElementById("contacts-details-edit-img");

  if (edit.src.includes("pencil_grey.svg")) {
    edit.src = "assets/img/pencil_blue.svg";
  }
}

/* Changes the edit icon in contacts-edit overlay within the div from the blue- to the dark version 
on hovering out of the div */
function changeEditContactImgDark() {
  let edit = document.getElementById("contacts-details-edit-img");

  if (edit.src.includes("pencil_blue.svg")) {
    edit.src = "assets/img/pencil_grey.svg";
  }
}

/* Changes the delete icon in contacts-edit overlay within the div from the dark- to the blue version 
on hovering over the div */
function changeDeleteContactImgBlue() {
  let deleteImg = document.getElementById("contacts-details-delete-img");

  if (deleteImg.src.includes("delete_grey.svg")) {
    deleteImg.src = "assets/img/delete_blue.svg";
  }
}

/* Changes the delete icon in contacts-edit overlay within the div from the blue- to the dark version 
on hovering out of the div */
function changeDeleteContactImgDark() {
  let deleteImg = document.getElementById("contacts-details-delete-img");

  if (deleteImg.src.includes("delete_blue.svg")) {
    deleteImg.src = "assets/img/delete_grey.svg";
  }
}
