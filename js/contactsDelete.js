/**
 * Searches for the first letter of the to-deleted contact and deletes it if it's the only contact 
 * with this letter as it's first letter
 * @param {string} contactsName - The contacts full name
 * @param {string} contactsEmail - The contacts email
 * @param {string} contactsPhone - The contacts phone number
 */
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

/**
 * Displays a blank contact-details container after deleting the contact
 */
function showEmptyContactDetails() {
    let detailsContainer = document.getElementById("contacts-details");
    detailsContainer.innerHTML = "";
}

/**
 * Changes the delete icon in contacts-edit overlay within the div from the dark- to the blue version 
 * on hovering over the div
 */
function changeDeleteContactImgBlue() {
    let deleteImg = document.getElementById("contacts-details-delete-img");

    if (deleteImg.src.includes("delete_grey.svg")) {
        deleteImg.src = "assets/img/delete_blue.svg";
    }
}

/**
 * Changes the delete icon in contacts-edit overlay within the div from the blue- to the dark version 
 * on hovering out of the div
 */
function changeDeleteContactImgDark() {
    let deleteImg = document.getElementById("contacts-details-delete-img");

    if (deleteImg.src.includes("delete_blue.svg")) {
        deleteImg.src = "assets/img/delete_grey.svg";
    }
}