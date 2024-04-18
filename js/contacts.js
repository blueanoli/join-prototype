/**
 * Initializes the contacts by checking login status and fetching contacts.
 */
async function initContacts() {
  isNotLoggedIn();
  await fetchContacts();
}

/**
 * Redirects to the index page if the user is not logged in.
 */
function isNotLoggedIn() {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
  }
}

/**
 * Generates a div with a letter if it's the first letter of a contact
 */
function generateLetterContainer() {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let firstLetter = contact["name"].charAt(0).toUpperCase();

    checkLetterContainer(contact, firstLetter);
  }
}

/**
 * Checks if the Letter is already avaiable and adds it in the appropriate array if not
 * @param {object} contact - A contact with details about name, email, phone number and profile color
 * @param {string} firstLetter - The first letter this contact 
 */
function checkLetterContainer(contact, firstLetter) {
  if (!contactsByLetter[firstLetter]) {
    contactsByLetter[firstLetter] = [];
  }
  contactsByLetter[firstLetter].push(contact);
  showContacts();
}

/**
 * Shows the contact with the generated letter-container and saves the contact in the appropriate ordered object
 */
function showContacts() {
  let sortedLetters = getSortedLetters();
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
        setProfilColor(contact);
        contactContainerHTML(contactsDiv, contact);
      }
    }
  }
}

/**
 * Generates a object key with the generated letter and sorts it alphabetically
 * @returns - Generated alphabetically ordered letter
 */
function getSortedLetters() {
  let letters = Object.keys(contactsByLetter);
  return letters.sort();
}

/**
 * Compares names of two contacts by index-order and sorts the contact alphabetical by the second name if it's available
 * @param {string} contactName - Full Name from showContacts()
 * @returns - Sorted Contacts by second name
 */
function sortBySecondName(contactName) {
  contactName.sort((a, b) => {
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

  return contactName;
}

/**
 * Displays the letter div
 * @param {string} contactsDiv - Generated letter container by id "contacts-contact"
 * @param {string} letter - Generated letter from contacts first name
 * @returns - Generated letter container
 */
function letterContainerHTML(contactsDiv, letter) {
  return (contactsDiv.innerHTML += `
  <div class="contacts-letter-container">
    <span>${letter}</span>
  </div>
  <div class="contacts-letter-border"></div>`);
}

/**
 * Checks if the contact has already a profil-color
 * @param {object} contact - A contact with details about name, email, phone number and profile color
 * @returns - The contact color
 */
function setProfilColor(contact) {
  if (!contact.color) {
    contact.color = getDifferentProfilColor();
  }
  return contact.color;
}

/**
 * Sets a random hex-color for each contact
 * @returns - Random hex-color for contact
 */
function getDifferentProfilColor() {
  let randomIndex = Math.floor(Math.random() * profileColors.length);
  let color = profileColors[randomIndex];

  return color;
}

/**
 * Displays the individual contact
 * @param {*} contactsDiv - Generated letter container by id "contacts-contact"
 * @param {*} contact - A contact with details about name, email, phone number and profile color
 * @returns - The alphabetical-sorted contact in a letter container, also sorted by the second name 
 */
function contactContainerHTML(contactsDiv, contact) {
  let contactsName = contact["name"];
  let contactsEmail = contact["email"];
  let contactsPhone = contact["phone"];
  let contactsColor = setProfilColor(contact);
  let acronym = getAcronyms(contactsName);
  let contactsID = getContactID(contact);

  return (contactsDiv.innerHTML += `
  <div 
    id="${contactsID}"
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

/**
 * Searches for the first letters of first- and second name
 * @param {string} contactsName - The Name of the contact
 * @returns - Acrnoym (first letter of the contacts first- and second name)
 */
function getAcronyms(contactsName) {
  let words = contactsName.split(/\s+/);
  let firstLetters = words.map((word) => word.charAt(0));
  let acronym = firstLetters.join("").toUpperCase();

  return acronym;
}

/**
 * Searches for the contact with the first letter of its name and the index-number and then returns it 
 * as contactID if the contact is found
 * @param {object} contact - A contact with details about name, email, phone number and profile color
 * @returns - The contactID if the contact is found
 */
function getContactID(contact) {
  let firstLetter = contact["name"].charAt(0).toUpperCase();
  let contactIndex = contacts.findIndex(
    (c) =>
      c.name === contact.name &&
      c.email === contact.email &&
      c.phone === contact.phone
  );

  if (contactIndex !== -1) {
    return firstLetter + contactIndex;
  } else {
    return null;
  }
}

/**
 * Changes the Background for an added contact to highlight it and scrolls to the newly added 
 * contact smoothly. Also displays the new contact details 
 * @param {*} contact - A contact with details about name, email, phone number and profile color
 */
function showNewContactVisuality(contact) {
  let contactsName = contact["name"];
  let contactsEmail = contact["email"];
  let contactsPhone = contact["phone"];
  let contactsColor = setProfilColor(contact);
  let acronym = getAcronyms(contactsName);
  let contactsID = getContactID(contact);
  let contactsDiv = document.getElementById(contactsID);

  if (contactsID) {
    setTimeout(() => {
      changeContactDetailsVisuality(contactsID);
      contactsDiv.scrollIntoView({ behavior: "smooth" });
    }, 250);
    showContactDetails(
      contactsName,
      contactsEmail,
      contactsPhone,
      acronym,
      contactsColor,
      contactsID
    );
  }
}

/**
 * Prevents the form-submit if the "cancel"-button is clicked
 */
function preventFormSubmit() {
  let cancelButton = document.getElementById("contacts-add-cancel-button");

  cancelButton.addEventListener("click", function (event) {
    event.preventDefault();
  });
}

/**
 * Slides the register-msg in if the registration was successful and slides it out after a specified delay
 */
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

/**
 * Displays the contact list container again after removed
 */
function goBackToContactList() {
  const contactContainer = document.querySelector('.contacts-contact-container');
  contactContainer.style.display = 'block';

  const mainContainer = document.querySelector('.contacts-main-container');
  mainContainer.style.display = 'none';

  isContactDetailsVisible = false;
}

/**
* Shows mobile menu
*/
function showContactsMobileMenu() {
  if (window.innerWidth < 800) {
    var container = document.querySelector('.contacts-details-edit-container');
    container.style.display = (container.style.display === 'none' || container.style.display === '') ? 'flex' : 'none';
  }
  document.addEventListener('click', function (event) {
    if (window.innerWidth < 800) {
      var container = document.querySelector('.contacts-details-edit-container');
      var mobileMenuIcon = document.querySelector('.mobile-menu-icon');

      if (container && mobileMenuIcon && !container.contains(event.target) && !mobileMenuIcon.contains(event.target)) {
        container.style.display = 'none';
      }
    }
  });
}

/**
 * Function to adjust the display property
 */
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

/**
 * Event listener for window resize events
 */
window.addEventListener('resize', adjustDisplayForScreenSize);