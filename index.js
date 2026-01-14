// movie lists by mood
const movieMoods = {
  comedy: [
    "3 Idiots",
    "Welcome",
    "PK",
    "Hera Pheri",
    "Bhool Bhulaiyaa",
    "Chupke Chupke",
    "Munna Bhai M.B.B.S.",
    "Stree"
  ],
  action: [
    "War",
    "Jawan",
    "Kalki",
    "Pathaan",
    "KGF",
    "Baahubali",
    "Vikram",
    "Mad Max: Fury Road"
  ],
  drama: [
    "Taare Zameen Par",
    "Swades",
    "Barfi",
    "Pink",
    "The Lunchbox",
    "Masaan",
    "Chhichhore",
    "Dangal"
  ],
  romantic: [
    "Jab We Met",
    "Tamasha",
    "Yeh Jawaani Hai Deewani",
    "Ae Dil Hai Mushkil",
    "Dil Chahta Hai",
    "Kal Ho Naa Ho"
  ]
};


let currentMoodMovies = [];
let movieIndex = 0;

// DOM elements
const nextBtn = document.querySelector("#next");
const prevBtn = document.querySelector("#prev");
const movieTitle = document.querySelector(".movie-title");
const poster = document.querySelector("#poster");
const movieContent = document.querySelector(".movie-content");
const movieContainer = document.querySelector("#movie-container");

const API_KEY = "1b815b23"; 

// show loading placeholder
function showLoading() {
  movieContent.innerHTML = `
    <div class="loading">
      Loading movie...
    </div>
  `;
  poster.src = "";
  movieTitle.textContent = "Fetching movie...";
}

// fetch movie data from OMDB API
async function fetchMovie(movieName) {
  showLoading();
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${movieName}`);
    const data = await response.json();

    if (data.Response === "False") {
      movieContent.innerHTML = `<p>Movie not found</p>`;
      poster.src = "";
      movieTitle.textContent = "Not Found";
      return;
    }

    // display poster with fallback
    poster.src = data.Poster !== "N/A" ? data.Poster : "default-poster.png";
    movieTitle.textContent = `${data.Title} (${data.Year})`;

    const backBtn = document.querySelector("#back-btn");

backBtn.addEventListener("click", () => {
  document.getElementById("intro-screen").style.display = "flex";
  movieContainer.style.display = "none";
  document.querySelector(".slider").style.display = "none";
  backBtn.style.display = "none";
});

backBtn.style.display = "inline-block";

    // render movie info
    const infoHTML = `
      <div class="movie-info"><strong>Director:</strong> ${data.Director}</div>
      <div class="movie-info"><strong>Actors:</strong> ${data.Actors}</div>
      <div class="movie-info"><strong>Genre:</strong> ${data.Genre}</div>
      <div class="movie-info"><strong>Runtime:</strong> ${data.Runtime}</div>
      <p>${data.Plot}</p>
      <div class="ratings">
        <span>IMDB: ${data.imdbRating}/10</span>
        ${data.Ratings[1] ? `<span>${data.Ratings[1].Source}: ${data.Ratings[1].Value}</span>` : ""}
      </div>
    `;
    movieContent.innerHTML = infoHTML;

  } catch (error) {
    movieContent.innerHTML = `<p>Error fetching movie. Try again later.</p>`;
    console.error(error);
  }
}

// show next movie
nextBtn.addEventListener("click", () => {
  movieIndex++;
  if (movieIndex >= currentMoodMovies.length) movieIndex = 0;
  fetchMovie(currentMoodMovies[movieIndex]);
});

// show previous movie
prevBtn.addEventListener("click", () => {
  movieIndex--;
  if (movieIndex < 0) movieIndex = currentMoodMovies.length - 1;
  fetchMovie(currentMoodMovies[movieIndex]);
});

// handle mood selection
document.querySelectorAll(".mood-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    currentMoodMovies = movieMoods[mood];

    // show movie container
    document.querySelector(".slider").style.display = "block";
    movieContainer.style.display = "block";

    // pick a random starting movie
    movieIndex = Math.floor(Math.random() * currentMoodMovies.length);
    fetchMovie(currentMoodMovies[movieIndex]);

    // hide mood selection
    document.getElementById("intro-screen").style.display = "none";
  });
});
