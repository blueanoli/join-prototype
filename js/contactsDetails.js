/**
 * Flag to monitor if contact details are currently being shown
 */
let isContactDetailsVisible = false;

/**
 * Displays a container with details about the clicked contact
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 * @param {string} acronym - The contacts acrnoyms
 * @param {string} contactsColor - The contacts profile color
 * @param {string} contactsID - The contacts ID
 */
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

    let contactDiv = document.getElementById(contactsID);
    if (contactDiv) {
        contactDiv.classList.add("checked");
    }

    isContactDetailsVisible = true;
    adjustDisplayForScreenSize();
}

/**
 * Changes the visuality of the interacted contact in the contact-list and resets 
 * to standard for every contact
 * @param {string} contactsID - The individually ID of the contact
 */
function changeContactDetailsVisuality(contactsID) {
    let background = document.getElementById(`${contactsID}`);
    let nameColor = document.getElementById(`name-${contactsID}`);
    let allContactsDiv = document.querySelectorAll(".contacts-contact-data");
    let allContactsName = document.querySelectorAll(".contacts-contact-details-name");

    changeContactDetailsDivColor(allContactsDiv);
    changeContactDetailsNameColor(allContactsName);

    if (!background.classList.contains("clicked")) {
        nameColor.classList.add("clicked");
        background.classList.add("clicked");
    } else {
        resetContactDetailsVisuality(contactsID);
    }
}

/**
 * Resets the changes of the divs changed by changeContactDetailsVisuality()
 * @param {string} allContactsDiv - All contact-divs in the contact-list
 */
function changeContactDetailsDivColor(allContactsDiv) {
    allContactsDiv.forEach(contactDiv => {
        contactDiv.classList.remove("clicked");
    });
}

/**
 * Resets the changes of the names changed by changeContactDetailsVisuality()
 * @param {string} allContactsName - All contact-names in the contact-list
 */
function changeContactDetailsNameColor(allContactsName) {
    allContactsName.forEach(contactsName => {
        contactsName.classList.remove("clicked");
    });
}

/**
 * Resets the visual changes of the changeContactDetailsVisuality()-Function
 * @param {string} contactsID - The individually ID of the contact
 */
function resetContactDetailsVisuality(contactsID) {
    let background = document.getElementById(`${contactsID}`);
    let nameColor = document.getElementById(`name-${contactsID}`);

    nameColor.classList.remove("clicked");
    background.classList.remove("clicked");
}

/**
 * Displays the container with the contact details
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 * @param {string} acronym - The contacts acrnoyms
 * @param {string} contactsColor - The contacts profile color
 * @param {string} contactsID - The contacts ID
 * @returns - A Container with the Details of the contact
 */
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