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


// YouTube search results and playback stay inside ALLIN1.
// A key is supplied by the visitor and held in sessionStorage only.
const ytForm = document.getElementById("youtube-search-form");
const ytQuery = document.getElementById("youtube-query");
const ytStatus = document.getElementById("youtube-status");
const ytResults = document.getElementById("youtube-results");
const ytKeyForm = document.getElementById("youtube-key-form");
const ytKeyInput = document.getElementById("youtube-api-key");
const ytWatch = document.getElementById("youtube-watch");
const ytPlayer = document.getElementById("youtube-player");
const ytWatchTitle = document.getElementById("youtube-watch-title");
const ytBack = document.getElementById("youtube-back");
const ytSetup = document.querySelector(".youtube-setup");
let ytApiKey = "";
try { ytApiKey = sessionStorage.getItem("allin1_youtube_api_key") || ""; } catch (_) {}

function ytSetStatus(message) {
  if (ytStatus) ytStatus.textContent = message;
}
function ytEscape(text) {
  return String(text || "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}
async function ytSearch(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return;
  if (!ytApiKey) {
    ytSetStatus("To load real YouTube results, open “Search setup” below and add a YouTube Data API key. Your search will stay on this page.");
    ytSetup?.setAttribute("open", "");
    ytKeyInput?.focus();
    return;
  }
  ytSetStatus("Searching YouTube…");
  ytResults.replaceChildren();
  ytWatch.hidden = true;
  ytPlayer.removeAttribute("src");
  try {
    const endpoint = new URL("https://www.googleapis.com/youtube/v3/search");
    endpoint.search = new URLSearchParams({
      part: "snippet",
      type: "video",
      maxResults: "12",
      safeSearch: "moderate",
      q: cleanQuery,
      key: ytApiKey
    }).toString();
    const response = await fetch(endpoint);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "YouTube search request failed.");
    const videos = (data.items || []).filter((item) => item.id?.videoId);
    if (!videos.length) {
      ytSetStatus("No videos found for that search. Try another phrase.");
      return;
    }
    ytSetStatus(videos.length + " results for “" + cleanQuery + "”. Select a video to watch it here.");
    videos.forEach((video) => {
      const id = video.id.videoId;
      const snippet = video.snippet || {};
      const title = snippet.title || "Untitled video";
      const channel = snippet.channelTitle || "YouTube creator";
      const thumbnail = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "";
      const card = document.createElement("button");
      card.type = "button";
      card.className = "youtube-result";
      card.setAttribute("aria-label", "Play " + title);
      card.innerHTML = '<div class="youtube-thumbnail"><img loading="lazy" alt="" src="' + ytEscape(thumbnail) + '"></div><div class="youtube-result-copy"><div class="youtube-result-title">' + ytEscape(title) + '</div><div class="youtube-result-channel">' + ytEscape(channel) + '</div></div>';
      card.addEventListener("click", () => {
        ytWatchTitle.textContent = title;
        ytPlayer.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1";
        ytWatch.hidden = false;
        ytWatch.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      ytResults.append(card);
    });
  } catch (error) {
    ytSetStatus("Couldn't load results: " + error.message + " Check that your API key is valid and YouTube Data API v3 is enabled.");
  }
}
ytForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  ytSearch(ytQuery.value);
});
document.querySelectorAll("[data-youtube-search]").forEach((button) => {
  button.addEventListener("click", () => {
    ytQuery.value = button.dataset.youtubeSearch || "";
    ytSearch(ytQuery.value);
  });
});
ytKeyForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = ytKeyInput.value.trim();
  if (!value) {
    ytSetStatus("Paste your API key first.");
    return;
  }
  ytApiKey = value;
  try { sessionStorage.setItem("allin1_youtube_api_key", value); } catch (_) {}
  ytKeyInput.value = "";
  ytSetStatus("API key set for this browser tab. Search for a video to load results.");
  ytSetup?.removeAttribute("open");
  if (ytQuery.value.trim()) ytSearch(ytQuery.value);
});
document.getElementById("youtube-clear-key")?.addEventListener("click", () => {
  ytApiKey = "";
  try { sessionStorage.removeItem("allin1_youtube_api_key"); } catch (_) {}
  ytKeyInput.value = "";
  ytSetStatus("API key cleared from this browser session.");
});
ytBack?.addEventListener("click", () => {
  ytPlayer.removeAttribute("src");
  ytWatch.hidden = true;
  ytResults.scrollIntoView({ behavior: "smooth", block: "start" });
});
if (ytForm) ytSetStatus(ytApiKey ? "API key found for this browser session. Search for a video." : "Search setup needed: add a YouTube Data API key below to load real results.");
