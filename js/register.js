let users = [];

async function initRegister() {
  loadUsers();
}

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
  let passwordConfirmed = document.getElementById("passwordConfirmed");
  let signupButton = document.getElementById("signup-button");
  signupButton.disabled = true;

  let wrongPassword = document.getElementById("password-wrong-text");
  let wrongPasswordContainer = document.getElementById(
    "password-confirmed-container"
  );

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
  window.location.href = "index.html?msg=You have successfully signed up";
}

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

