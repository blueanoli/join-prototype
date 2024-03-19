function initLogin() {
  statusVisit();
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

function checkedLoginRemeber() {
  let checkbox = document.getElementById("loginCheckbox");

  if (checkbox.src == "assets/img/checkboxempty.svg") {
    checkbox.src = "assets/img/checkboxchecked.svg";
  } else {
    checkbox.src = "assets/img/checkboxempty.svg";
  }
}
