let users = [
  {
    name: "test",
    email: "test@test.de",
    password: "123",
    passwordConfirmed: "123",
  },
];

function addNewUser() {
  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let passwordConfirmed = document.getElementById("passwordConfirmed");
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");

  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
    passwordConfirmed: passwordConfirmed.value,
  });
  clearInputField(name, email, password, passwordConfirmed);
  window.location.href = "index.html?msg=You have successfully signed up";

  if (msg) {
    msgBox.innerHTML = msg;
  }
}

function clearInputField(name, email, password, passwordConfirmed) {
  name.value = "";
  email.value = "";
  password.value = "";
  passwordConfirmed.value = "";
}
