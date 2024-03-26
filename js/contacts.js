let testContacts = [
  {
    name: "Tatjana Wolf",
    email: "wolf@gmail.de",
  },
];

function initContacts() {
  logOut();
  displayLetterContacts();
}

function logOut() {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
  }
}

function displayLetterContacts() {
  let main = document.getElementById("contacts-main");
  main.innerHTML = "";

  for (let i = 0; i < testContacts.length; i++) {
    let contactsName = testContacts[i]["name"];
    let contactsEmail = testContacts[i]["email"];
    let firstLetter = contactsName.charAt(0).toUpperCase();
    let firstLetters = contactsName.match(/\b(\w)/g);
    let acronym = firstLetters.join("").toUpperCase();

    main.innerHTML += `
    <div class="contacts-letter-container">
        <span>${firstLetter}</span>
    </div>
    <div class="contacts-letter-border"></div>
    <div class="contacts-contact-data">
      <div> ${acronym}</div>
      <div class="contacts-contact-details">
        <span>${contactsName}</span>
        <span>${contactsEmail}</span>
      </div>
    </div>
    `;
  }
}
