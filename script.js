// ALLIN1 — Website interactions

const exploreButton = document.getElementById("explore");

exploreButton.addEventListener("click", function () {
    document.getElementById("games").scrollIntoView({
        behavior: "smooth"
    });
});
