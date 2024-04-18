/**
 * Initializes the login process.
 */
function initLogin() {
  playLogoAnimation();
  loadUsers();
  showLoginData();
}

/**
 * Executes the animated Logo if it's the first visit in the current session
 */
function playLogoAnimation() {
  let animatedLogoContainer = document.querySelector(
    ".animated-logo-container"
  );
  let animatedLogo = document.getElementById("animated-logo");

  if (animatedLogoContainer && animatedLogo) {
    animatedLogoContainer.style.display = "block";
    animatedLogoContainer.classList.add("animate");
    animatedLogo.classList.add("animate");
  }
}

/**
 * Used to Log-in throught Guest Log-in button
 */
function guestLogin() {
  sessionStorage.setItem('isLoggedIn', 'true');
  sessionStorage.setItem('username', 'Guest');
  window.location.href = "summary.html";
}

/**
 * Searches for the login data by Log-in submit
 */
function searchUser() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let passwordContainer = document.getElementById("password-container");
  let wrongPassword = document.getElementById("password-wrong-text");

  let user = users.find(
    (u) => u.password == password.value && u.email == email.value
  );
  let correctEmail = users.find((u) => u.email == email.value);

  if (user) {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('username', user.name);
    window.location.href = "summary.html";
  } else if (correctEmail) {
    isWrongPassword(passwordContainer, wrongPassword);
  } else {
    emailNotRegistered(passwordContainer, wrongPassword);
  }
}

/**
 * Shows appropriate text and adds border-color if password is wrong + 
 * removes the changes from emailNotRegistered() 
 * @param {string} passwordContainer - The Div of the password container
 * @param {string} wrongPassword - "wrong-password"-text
 */
function isWrongPassword(passwordContainer, wrongPassword) {
  let emailContainer = document.getElementById("login-email-container");
  let isNotRegisteredText = wrongPassword.querySelector("span");

  emailContainer.classList.remove("login-wrong-password-container");

  if (isNotRegisteredText === "Not registered!") {
    isNotRegisteredText.innerHTML = "Wrong Password Ups! Try again.";
  } else {
    isNotRegisteredText.innerHTML = "Wrong Password Ups! Try again.";
  }
  passwordContainer.classList.add("login-wrong-password-container");
  wrongPassword.classList.add("login-wrong-password-text");
}

/**
 * Shows appropriate text and adds border-color if email is not registered + 
 * removes the changes from isWrongPassword()
 * @param {string} passwordContainer - The Div of the password container
 * @param {string} wrongPassword - "wrong-password"-text
 */
function emailNotRegistered(passwordContainer, wrongPassword) {
  let emailContainer = document.getElementById("login-email-container");
  let isNotRegisteredText = wrongPassword.querySelector("span");

  passwordContainer.classList.remove("login-wrong-password-container");

  if (isNotRegisteredText === "Wrong Password Ups! Try again.") {
    isNotRegisteredText.innerHTML = "Not registered!";
  } else {
    isNotRegisteredText.innerHTML = "Not registered!";
  }
  emailContainer.classList.add("login-wrong-password-container");
  wrongPassword.classList.add("login-wrong-password-text");
}

/**
 * Changes the src of the checkbox-img either if it's checked or not
 */
function checkedLoginCheckbox() {
  let checkbox = document.getElementById("login-checkbox");

  if (checkbox.src.includes("checkboxempty.svg")) {
    checkbox.src = "assets/img/checkboxchecked.svg";
    rememberLoginData();
  } else {
    checkbox.src = "assets/img/checkboxempty.svg";
    deleteLoginData();
  }
}

/**
 * Saves the Login Data in localStorage if the remember checkbox is clicked
 */
function rememberLoginData() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  localStorage.setItem("email", email.value);
  localStorage.setItem("password", password.value);
}

/**
 * Shows the saved Login Data from localStorage and displays it in the Input-field if the value is not null
 */
function showLoginData() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let emailData = localStorage.getItem("email");
  let passwordData = localStorage.getItem("password");
  changeCheckboxImg(emailData, passwordData);

  email.value = emailData;
  password.value = passwordData;
}

/**
 * Changes the Checkbox-Img to the appropriate src by checking the localStorage
 * @param {string} emailData - In local Storage stored email
 * @param {string} passwordData - In local Storage stored password
 */
function changeCheckboxImg(emailData, passwordData) {
  let checkbox = document.getElementById("login-checkbox");

  if (emailData == "" || passwordData == "") {
    checkbox.src = "assets/img/checkboxempty.svg";
  } else {
    checkbox.src = "assets/img/checkboxchecked.svg";
  }
}

/**
 * Sets the localStorage value of the appropriate key to null and displays it in the input-fields
 */
function deleteLoginData() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  localStorage.setItem("email", "");
  localStorage.setItem("password", "");

  email.value = "";
  password.value = "";
}

/**
 * Changes the src of password img on input focus
 */
function hidePasswordImg() {
  let passwordImg = document.getElementById("login-password-icon");
  passwordImg.src = "assets/img/visibility_off.svg";
}

/**
 * Toggles the visibility of the password on image-click and changes the password img
 */
function toggleVisibilityPassword() {
  let passwordImg = document.getElementById("login-password-icon");
  let password = document.getElementById("password");

  if (passwordImg.src.includes("visibility_off.svg")) {
    passwordImg.src = "assets/img/visibility.svg";
    password.type = "text";
  } else {
    passwordImg.src = "assets/img/visibility_off.svg";
    password.type = "password";
  }
}

/**
 * Sets the password img to the default img when the inputfield is empty and not focused
 */
function defaultPasswordImg() {
  let passwordImg = document.getElementById("login-password-icon");
  let passwordInput = document.getElementById("password");

  if (passwordInput.value === "") {
    passwordImg.src = "assets/img/password.svg";
  }
}

/**
 * Changes the src of password confirmed img on input focus
 */
function hidePasswordConfirmedImg() {
  let passwordImg = document.getElementById("login-password-confirmed-icon");
  passwordImg.src = "assets/img/visibility_off.svg";
}

/**
 * Toggles the visibility of the password confirmed on image-click and changes the password img
 */
function toggleVisibilityPasswordConfirmed() {
  let passwordImg = document.getElementById("login-password-confirmed-icon");
  let password = document.getElementById("password-confirmed");

  if (passwordImg.src.includes("visibility_off.svg")) {
    passwordImg.src = "assets/img/visibility.svg";
    password.type = "text";
  } else {
    passwordImg.src = "assets/img/visibility_off.svg";
    password.type = "password";
  }
}

/**
 * Sets the password confirmed img to the default img when the inputfield is empty and not focused
 */
function defaultPasswordConfirmedImg() {
  let passwordImg = document.getElementById("login-password-confirmed-icon");
  let passwordInput = document.getElementById("password-confirmed");

  if (passwordInput.value === "") {
    passwordImg.src = "assets/img/password.svg";
  }
}
