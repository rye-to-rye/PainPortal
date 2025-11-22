document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("passwordBox");
  const button = document.querySelector(".js-submit-button");

  // Inject rainbow animation styles
  const rainbowStyle = document.createElement("style");
  rainbowStyle.innerHTML = `
    @keyframes rainbowFlash {
      0% { color: red; }
      20% { color: orange; }
      40% { color: yellow; }
      60% { color: green; }
      80% { color: blue; }
      100% { color: purple; }
    }
    .rainbow {
      animation: rainbowFlash 0.6s infinite linear;
      font-weight: bold;
    }
  `;
  document.head.appendChild(rainbowStyle);

  // Display box
  const output = document.createElement("div");
  output.style.position = "absolute";
  output.style.right = "100px";
  output.style.top = "250px";
  output.style.background = "none";
  output.style.padding = "15px";
  output.style.borderRadius = "8px";
  output.style.fontSize = "22px";
  output.style.zIndex = "3000";
  output.style.width = "420px";
  output.innerHTML = "Click Submit to validate.";
  document.body.appendChild(output);

  button.addEventListener("click", () => {
    const p = passwordInput.value;

    // Requirements
    const checks = [
      { ok: p.includes("XXXII"), message: "Your password is missing the Roman numeral for 32." }, //(XXXII)
      { ok: /[😭]/.test(p), message: "Your password is missing the crying emoji." },
      { ok: p.includes("5778"), message: "Your password is missing the Sun’s surface temperature in kelvin." }, //5778
      { ok: ["PIKACHU"].some(pk => p.toUpperCase().includes(pk)), message: "Your password is missing the famous yellow Pokémon." }, //Pikachu
      { ok: ["SOMETHING"].some(w => p.toUpperCase().includes(w)), message: "Your password is missing something." } //something
    ];

    // Missing requirements
    const missing = checks.filter(c => !c.ok);

    if (missing.length === 0) {
      output.className = "rainbow";
      output.innerHTML = "Successfully logged in!";

      // ⭐ Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "agreement.html";
      }, 2000);

      return;
    }

    // Pick random missing requirement
    const randomMissing = missing[Math.floor(Math.random() * missing.length)];

    output.className = "rainbow";
    output.innerHTML = "❌ " + randomMissing.message;
  });
});
