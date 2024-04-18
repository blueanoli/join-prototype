/**
* Initializes the Overlay for the Contact - Editor
* @param { string } contactsName - The contacts full name
* @param { string } contactsEmail - The contacts email
* @param { string } contactsPhone - The contacts phone number
* @param { string } acronym - The contacts acrnoyms
* @param { string } contactsColor - The contacts profile color
* @param { string } contactsID - The contacts ID
*/
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

    document.body.style.overflowY = "hidden";
    contactsAddContainer.classList.add("fade-in");
}

/**
 * Displays the Overlay for the Contact-Editor
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 * @param {string} acronym - The contacts acrnoyms
 * @param {string} contactsColor - The contacts profile color
 * @param {string} contactsID - The contacts ID
 */
function editContactDetailsOverlayHTML(
    contactsName,
    contactsEmail,
    contactsPhone,
    acronym,
    contactsColor,
    contactsID
) {

    const cancelIconSrc = window.innerWidth < 800 ? "assets/img/cancel_white.svg" : "assets/img/cancel_dark.svg";
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
          <img src="${cancelIconSrc}" alt="cancel icon" />
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

/**
 * Displays the Form Area in the Edit-Contact Overlay
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 * @param {string} acronym - The contacts acrnoyms
 * @param {string} contactsColor - The contacts profile color
 * @param {string} contactsID - The contacts ID
 * @returns - The Form Area in the Edit-Contact Overlay
 */
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

/**
 * Displays the Acronyms-Area in the Edit-Contact Overlay
 * @param {string} acronym - The contacts acrnoyms
 * @param {string} contactsColor - The contacts profile color
 * @returns - The Acronyms-Area in the Edit-Contact Overlay
 */
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

/**
 * Displays the Form Input Area in the Edit-Contact Overlay
 * @returns - The Form Input Area in the Edit-Contact Overlay
 */
function getEditContactDetailsFormInputAreaHTML() {
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
 * Displays the Form Area Buttons in the Edit-Contact Overlay
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 * @returns - The Form Area Buttons in the Edit-Contact Overlay
 */
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

/**
 * Searches for the contact and deletes it from the contacts-array if the contact is found
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 */
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

/**
 * Prevents the submitting of the form if the contact is edited
 */
function preventFormSubmitByEdit() {
    let deleteButton = document.getElementById("contacts-edit-delete-button");

    deleteButton.addEventListener("click", function (event) {
        event.preventDefault();
    });
}

/**
 * Checks if the name, email or phone number is already in use at other contacts by excluding the current contacts data
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 * @param {string} acronym - The contacts acrnoyms
 * @param {string} contactsColor - The contacts profile color
 * @param {string} contactsID - The contacts ID
 */
function checkEditedContactDetails(
    contactsName,
    contactsEmail,
    contactsPhone,
    acronym,
    contactsColor,
    contactsID
) {
    let newName = document.getElementById("name").value;
    let newEmail = document.getElementById("email").value;
    let newPhone = document.getElementById("phone").value;

    let index = findContactIndex(contactsName, contactsEmail, contactsPhone);
    let existingContactName = findExistingNameWithoutCurrent(index, newName);
    let existingContactEmail = findExistingEmailWithoutCurrent(index, newEmail);
    let existingContactPhone = findExistingPhoneWithoutCurrent(index, newPhone);

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
        editContactDetails(
            index,
            newName,
            newEmail,
            newPhone,
            acronym,
            contactsColor,
            contactsID
        );
    }
}

/**
 * Searches for the contact index
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 * @returns - The contact index
 */
function findContactIndex(contactsName, contactsEmail, contactsPhone) {
    return contacts.findIndex(
        (c) =>
            c.name === contactsName &&
            c.email === contactsEmail &&
            c.phone === contactsPhone
    );
}

/**
 * Searches for the exisiting name without the name of the current to-edited contact
 * @param {number} index - The index of contact
 * @param {string} newName - The wanted name
 * @returns - If found = the contact and if not found = null
 */
function findExistingNameWithoutCurrent(index, newName) {
    return contacts.find((c, i) => i !== index && c.name === newName);
}

/**
 * Searches for the exisiting emails without the email of the current to-edited contact
 * @param {number} index - The index of contact
 * @param {string} newEmail - The wanted email
 * @returns - If found = the contact and if not found = null
 */
function findExistingEmailWithoutCurrent(index, newEmail) {
    return contacts.find((c, i) => i !== index && c.email === newEmail);
}

/**
 * Searches for the exisiting phone numbers without the phone number of the current to-edited contact
 * @param {number} index - The index of contact
 * @param {string} newEmail - The wanted phone number
 * @returns - If found = the contact and if not found = null
 */
function findExistingPhoneWithoutCurrent(index, newPhone) {
    return contacts.find((c, i) => i !== index && c.phone === newPhone);
}

/**
 * Changes the edit email or phone number
 * @param {number} index - The index of contact
 * @param {string} newName - The possibly new full name
 * @param {string} newEmail - The possibly new edited email
 * @param {string} newPhone - The possibly new edited phone number
 * @param {string} acronym - The contacts acrnoyms
 * @param {string} contactsColor - The contacts profile color
 * @param {string} contactsID - The contacts ID
 */
function editContactDetails(
    index,
    newName,
    newEmail,
    newPhone,
    acronym,
    contactsColor,
    contactsID
) {
    if (index !== -1) {
        contacts[index].name = newName;
        contacts[index].email = newEmail;
        contacts[index].phone = newPhone;

        uploadContacts();
        showContacts();
        hideAddContactContainer();
        showContactDetails(
            newName,
            newEmail,
            newPhone,
            acronym,
            contactsColor,
            contactsID
        );
    }
}

/**
 * Changes the edit icon in contacts-edit overlay within the div from the dark- to the blue version 
 * on hovering over the div
 */
function changeEditContactImgBlue() {
    let edit = document.getElementById("contacts-details-edit-img");

    if (edit.src.includes("pencil_grey.svg")) {
        edit.src = "assets/img/pencil_blue.svg";
    }
}

/**
 * Changes the edit icon in contacts-edit overlay within the div from the blue- to the dark version 
 * on hovering out of the div
 */
function changeEditContactImgDark() {
    let edit = document.getElementById("contacts-details-edit-img");

    if (edit.src.includes("pencil_blue.svg")) {
        edit.src = "assets/img/pencil_grey.svg";
    }
}