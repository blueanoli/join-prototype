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
