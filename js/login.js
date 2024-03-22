function initLogin() {
  statusVisit();
  loadUsers();
}

/* Used to check if it's the person first visit in the current session 
and sets its value to false, so it won't execute repeatedly */
function statusVisit() {
  let isFirstVisit = sessionStorage.getItem("isFirstVisit");
  if (isFirstVisit === null || isFirstVisit === "true") {
    playLogoAnimation();
    sessionStorage.setItem("isFirstVisit", "false");
  }
}

/* Executes the animated Logo if it's the first visit in the current session */
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

/* Used to Log-in throught Guest Log-in button*/
function guestLogin() {
  window.location.href = "summary.html";
}

/* Searches for the login data by Log-in submit */
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
    window.location.href = "summary.html";
  } else if (correctEmail) {
    passwordContainer.classList.add("login-wrong-password-container");
    wrongPassword.classList.add("login-wrong-password-text");
  } else {
    passwordContainer.classList.remove("login-wrong-password-container");
    wrongPassword.classList.remove("login-wrong-password-text");
    console.log("Not registered!");
  }
}

/* Changes the src of the checkbox-img and the visibility of the sign-up button 
either if it's checked or not*/
function checkedLoginCheckbox() {
  let checkbox = document.getElementById("login-checkbox");
  let signUpButton = document.getElementById("signup-button");

  if (checkbox.src.includes("checkboxempty.svg")) {
    checkbox.src = "assets/img/checkboxchecked.svg";
    signUpButton.classList.remove("signup-button-visibility");
  } else {
    checkbox.src = "assets/img/checkboxempty.svg";
    signUpButton.classList.add("signup-button-visibility");
  }
}

/* Changes the src of password img on input focus */
function hidePasswordImg() {
  let passwordImg = document.getElementById("login-password-icon");
  passwordImg.src = "assets/img/visibility_off.svg";
}

/* Toggles the visibility of the password on image-click and changes the password img */
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

/* Sets the password img to the default img when the inputfield is empty and not focused */
function defaultPasswordImg() {
  let passwordImg = document.getElementById("login-password-icon");
  let passwordInput = document.getElementById("password");

  if (passwordInput.value === "") {
    passwordImg.src = "assets/img/password.svg";
  }
}

/* Same Code as above but for the second password field in sign_up.html */
function hidePasswordConfirmedImg() {
  let passwordImg = document.getElementById("login-password-confirmed-icon");
  passwordImg.src = "assets/img/visibility_off.svg";
}

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

function defaultPasswordConfirmedImg() {
  let passwordImg = document.getElementById("login-password-confirmed-icon");
  let passwordInput = document.getElementById("password-confirmed");

  if (passwordInput.value === "") {
    passwordImg.src = "assets/img/password.svg";
  }
}
