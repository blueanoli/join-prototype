/**
 * The "Add Container" slides in while the background fades darker
 */
function showAddContactContainer() {
    let contactsAddContainer = document.querySelector(".contacts-add-container");
    contactsAddContainer.innerHTML = addContactOverlayHTML();
    let contactsAdd = document.querySelector(".contacts-add");
    clearAddContainerInputfields();
    resetAddContactsChanges();

    document.body.style.overflowY = "hidden";
    contactsAddContainer.classList.add("fade-in");
    contactsAdd.classList.remove("slide-out");
}

/**
 * Displays the Add-Contact Overlay
 * @returns Add-Contact Overlay
 */
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
        <div class="contacts-add-cancel  edit-cancel-icon" onclick="hideAddContactContainer()">
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

/**
 * Displays the Form Area in the Add-Contact Overlay
 * @returns Form Area in the Add-Contact Overlay
 */
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

/**
 * Displays the Form Input Area in the Add-Contact Overlay
 * @returns Form Input Area in the Add-Contact Overlay
 */
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
          onkeypress="addSpaceToPhoneNumber(); allowOnlyDigitsPhoneNumber()"
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

/**
 * Displays the Form Area Buttons in the Add-Contact Overlay
 * @returns Form Area Buttons in the Add-Contact Overlay
 */
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

/**
 * Clears the "Add Container" input-fields and sets the phone input-field 
 * back to its primarily value
 */
function clearAddContainerInputfields() {
    let nameInput = document.getElementById("name");
    let emailInput = document.getElementById("email");
    let phoneInput = document.getElementById("phone");

    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "+49";
}

/**
 * Initializes the removing and resetting of the "Add Container"
 */
function hideAddContactContainer() {
    let contactsAddContainer = document.querySelector(".contacts-add-container");
    let contactsAdd = document.querySelector(".contacts-add");

    if (contactsAddContainer) {
        resetAddContactsChanges();
        hideAddContacContainerChanges(contactsAddContainer, contactsAdd);
    }
}

/**
 * The "Add Container" slides out after a timeout while the background fades bright again +
 * removes scroll option
 */
function hideAddContacContainerChanges(contactsAddContainer, contactsAdd) {
    document.body.style.overflowY = "visible";
    contactsAddContainer.classList.remove("fade-in");
    contactsAddContainer.classList.add("fade-out");
    setTimeout(function () {
        contactsAddContainer.classList.remove("fade-out");
    }, 750);
    contactsAdd.classList.add("slide-out");
}

/**
 * Changes the "Add Contact" cancel-icon within the button from the dark- to the blue version 
 * on hovering over the button
 */
function changeAddContactCancelBlue() {
    let cancel = document.getElementById("contacts-add-cancel-img");

    if (cancel.src.includes("cancel_dark.svg")) {
        cancel.src = "assets/img/cancel_blue.svg";
    }
}

/**
 * Changes the "Add Contact" cancel-icon within the button from the blue- to the dark version 
 * on hovering out of the button
 */
function changeAddContactCancelDark() {
    let cancel = document.getElementById("contacts-add-cancel-img");

    if (cancel.src.includes("cancel_blue.svg")) {
        cancel.src = "assets/img/cancel_dark.svg";
    }
}

/**
 * Adds automatically a space between the phone number at specified lengths 
 * when the user is typing in the phone input-field
 */
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

/**
 * Allows only digits and backspace in the phone number input-field by not 
 * inserting letters if the user is typing them 
 */
function allowOnlyDigitsPhoneNumber() {
    let phone = document.getElementById("phone");

    phone.onkeydown = function (event) {
        if (isNaN(event.key) && event.key !== 'Backspace') {
            event.preventDefault();
        }
    };
}

/**
 * Displays an example of the required format of the phone input-field
 */
function showPhoneFormat() {
    let phone = document.getElementById("input-phone-format");

    phone.classList.add("shown");
}

/**
 * Hides the example of the required format of the phone input-field
 */
function removePhoneFormat() {
    let phone = document.getElementById("input-phone-format");

    phone.classList.remove("shown");
}

/**
 * Check's if the contact values are already exisiting
 */
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

/**
 * Resets Changes of an invalid contact-add submit
 */
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

/**
 * Shows that the name is already taken
 * @param {string} newName - The Name of the wanted added contact
 */
function isExistingContactName(newName) {
    let nameContainer = document.getElementById("name-container");
    let textBox = document.getElementById("input-message");

    nameContainer.classList.add("wrong-container");
    textBox.classList.add("shown");
    textBox.innerHTML = `<b>${newName}</b> is already in the Contact-list.`;
}

/**
 * Shows that the email is already taken
 * @param {string} newEmail - The Email of the wanted added contact
 */
function isExistingContactEmail(newEmail) {
    let emailContainer = document.getElementById("email-container");
    let textBox = document.getElementById("input-message");

    emailContainer.classList.add("wrong-container");
    textBox.classList.add("shown");
    textBox.innerHTML = `The Email: <b>${newEmail}</b> is already existing.`;
}

/**
 * Shows that the phone number is already taken
 * @param {string} newPhone - The Phone number of the wanted added contact
 */
function isExistingContactPhone(newPhone) {
    let phoneContainer = document.getElementById("phone-container");
    let textBox = document.getElementById("input-message");

    phoneContainer.classList.add("wrong-container");
    textBox.classList.add("shown");
    textBox.innerHTML = `The number: <b>${newPhone}</b> is already in use.`;
}

/**
 * Adds a new contact to the list if everything is valid
 * @param {object} contact - A contact with details about name, email, phone number and profile color
 */
function addNewContact(contact) {
    contacts.push(contact);
    let firstLetter = contact["name"].charAt(0).toUpperCase();

    showContactRegisterMsg();
    checkLetterContainer(contact, firstLetter);
    hideAddContactContainer();
    showNewContactVisuality(contact);
    uploadContacts();
}