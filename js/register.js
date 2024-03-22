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
    wrongPasswordContainer.classList.add("login-wrong-password-container");
    wrongPassword.classList.add("login-wrong-password-text");
  } else {
    wrongPasswordContainer.classList.remove("login-wrong-password-container");
    wrongPassword.classList.remove("login-wrong-password-text");
    console.log("Email already in use!");
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

/* Shows registration message by successfully registration */
function showRegisterMsg() {
  let registerMsgContainer = document.getElementById("register-msg-container");
  let registerMsg = document.getElementById("register-msg");

  registerMsg.classList.add("login-register-msg-shown");
  registerMsgContainer.classList.add("login-register-msg-container-shown");
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
