// Teleport the submit button randomly around the screen

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("button");

  function teleportButton() {
    const maxX = window.innerWidth - btn.offsetWidth;
    const maxY = window.innerHeight - btn.offsetHeight;

    const randX = Math.random() * maxX;
    const randY = Math.random() * maxY;

    btn.style.position = "absolute";
    btn.style.left = randX + "px";
    btn.style.top = randY + "px";
  }

  // teleport every 600ms
  setInterval(teleportButton, 5000);
});
