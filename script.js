```javascript
const exploreButton = document.getElementById("explore");
const gamePlayer = document.getElementById("game-player");
const gameCards = document.querySelectorAll(".game-card");

exploreButton.addEventListener("click", () => {
    document.getElementById("games").scrollIntoView({
        behavior: "smooth"
    });
});

gameCards.forEach((card) => {
    card.addEventListener("click", () => {
        const gameUrl = card.dataset.game;
        const gameName = card.textContent.trim();

        gamePlayer.innerHTML = `
            <div class="player-header">
                <h3>${gameName}</h3>
                <a href="${gameUrl}"
                   target="_blank"
                   rel="noopener noreferrer">
                    Open Game ↗
                </a>
            </div>

            <iframe
                src="${gameUrl}"
                title="${gameName}"
                allowfullscreen
                loading="lazy">
            </iframe>
        `;

        gamePlayer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});
```
