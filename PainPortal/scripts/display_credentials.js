document.addEventListener("DOMContentLoaded", () => {

  const usernameInput = document.getElementById("searchBox");
  const passwordInput = document.getElementById("passwordBox");
  const button = document.querySelector(".js-submit-button");

  button.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    console.log("Username:", username);
    console.log("Password:", password);
  });

});
