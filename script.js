const exploreButton = document.querySelector(".primary-button");
const gamePlayer = document.getElementById("game-player");
const gameCards = document.querySelectorAll(".game-card");

exploreButton?.addEventListener("click", () => {
  document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
});

gameCards.forEach((card) => {
  card.addEventListener("click", () => {
    const gameUrl = card.dataset.game;
    const gameName = card.dataset.name || card.textContent.trim();

    const header = document.createElement("div");
    header.className = "player-header";

    const heading = document.createElement("h3");
    heading.textContent = gameName;

    const openLink = document.createElement("a");
    openLink.href = gameUrl;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "Open Game ↗";

    header.append(heading, openLink);

    const frame = document.createElement("iframe");
    frame.src = gameUrl;
    frame.title = gameName;
    frame.allowFullscreen = true;
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";

    gamePlayer.replaceChildren(header, frame);
    gamePlayer.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


// Keyboard shortcut: Ctrl+E opens the separate ALLIN1 games page.
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "e") {
    event.preventDefault();
    window.location.href = "./games.html";
  }
});
