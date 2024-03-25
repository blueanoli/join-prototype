let users = [];

async function initRegister() {
  loadUsers();
}

/* Loads registered users from backend storage */
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function addNewUser() {
  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let passwordConfirmed = document.getElementById("password-confirmed");
  let signupButton = document.getElementById("signup-button");
  let wrongPassword = document.getElementById("password-wrong-text");
  let wrongPasswordContainer = document.getElementById(
    "password-confirmed-container"
  );

  signupButton.disabled = true;

  let isEmailRegistered = users.find((u) => u.email == email.value);
  let isPasswordIdentical = password.value == passwordConfirmed.value;

  if (!isEmailRegistered && isPasswordIdentical) {
    registerNewEmail(name, email, password, passwordConfirmed, signupButton);
  } else if (!isPasswordIdentical) {
    handlePasswordMismatch(wrongPassword, wrongPasswordContainer);
  } else {
    emailAlreadyRegisteredMsg(wrongPassword, wrongPasswordContainer);
  }
}

/* Pushes the values of the input-fields into the registration storage by successfully registration */
async function registerNewEmail(
  name,
  email,
  password,
  passwordConfirmed,
  signupButton
) {
  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
    passwordConfirmed: passwordConfirmed.value,
  });
  await setItem("users", JSON.stringify(users));
  clearInputField(name, email, password, passwordConfirmed, signupButton);
  showRegisterMsg();
  setTimeout(function () {
    window.location.href = "index.html?msg=You Singed up successfully";
  }, 1000);
}

/* Clears input-fields and disables the sign-up button */
function clearInputField(
  name,
  email,
  password,
  passwordConfirmed,
  signupButton
) {
  name.value = "";
  email.value = "";
  password.value = "";
  passwordConfirmed.value = "";
  signupButton.disabled = false;
}

/* Shows registration message by successfully registration */
function showRegisterMsg() {
  let registerMsgContainer = document.getElementById("register-msg-container");
  let registerMsg = document.getElementById("register-msg");

  registerMsg.classList.add("login-register-msg-shown");
  registerMsgContainer.classList.add("login-register-msg-container-shown");
}

/* Shows message if the passwords don't match and adds a red border around the container 
+ removes cahnges of the emailAlreadyRegisteredMsg()-function if it's triggered*/
function handlePasswordMismatch(wrongPassword, wrongPasswordContainer) {
  let emailContainer = document.getElementById("signup-email-container");
  let text = wrongPassword.querySelector("span");

  emailContainer.classList.remove("login-wrong-password-container");
  if (text === "Email already in use!") {
    text.innerHTML = "Ups! your password don't match.";
  } else {
    text.innerHTML = "Ups! your password don't match.";
  }
  wrongPasswordContainer.classList.add("login-wrong-password-container");
  wrongPassword.classList.add("login-wrong-password-text");
}

/* Shows message if the email is already registered and adds a red border around the container 
+ removes cahnges of the handlePasswordMismatch()-function if it's triggered*/
function emailAlreadyRegisteredMsg(wrongPassword, wrongPasswordContainer) {
  let emailContainer = document.getElementById("signup-email-container");
  let text = wrongPassword.querySelector("span");

  wrongPasswordContainer.classList.remove("login-wrong-password-container");
  if (text === "Ups! your password don't match.") {
    text.innerHTML = "Email already in use!";
  } else {
    text.innerHTML = "Email already in use!";
  }
  emailContainer.classList.add("login-wrong-password-container");
  wrongPassword.classList.add("login-wrong-password-text");
}

/* Changes the src of the checkbox-img and the visibility of the sign-up button 
either if it's checked or not*/
function checkedSignUpCheckbox() {
  let checkbox = document.getElementById("signup-checkbox");
  let signUpButton = document.getElementById("signup-button");

  if (checkbox.src.includes("checkboxempty.svg")) {
    checkbox.src = "assets/img/checkboxchecked.svg";
    signUpButton.classList.remove("signup-button-visibility");
  } else {
    checkbox.src = "assets/img/checkboxempty.svg";
    signUpButton.classList.add("signup-button-visibility");
  }
}
