const baseUrl = "https://atla-animals.herokuapp.com/";

axios.defaults.baseURL = baseUrl;

const voteButton = document.querySelector(".vote-btn");
const ratingSelector = document.querySelector(".rating-selector");

const dailyTier = document.querySelector(".animal-tier");

voteButton.addEventListener("click", vote);

//Get daily animal info
fetchDailyInfo();

function fetchDailyInfo() {
  axios.get("animal/daily")
  .then(updateDaily)
  .catch(function(e) {
    console.log(e)
  })
}

function updateDaily(res) {
  console.log(res.data);
  const dailyImg = document.querySelector(".daily-container img");
  const dailyDate = document.querySelector(".daily-date");
  const dailyName = document.querySelector(".daily-animal-name span");

  const data = res.data;

  const animalName = data.name.replace(/^\D| \D/g, function(match) {
    return match.toUpperCase();
  })

  const values = [
    data.date,
    animalName,
    data.tier || "No"
  ]

  const els = [dailyDate, dailyName, dailyTier];

  dailyImg.src = baseUrl + "animals/" + data.name + ".png";

  els.forEach(function(el, i) {
    el.textContent = values[i];
  });

  if(data.hasVoted) {
    updateVoteBtn();
  }
}

function vote() {
  axios.post("animal/vote", {
    answer: parseInt(ratingSelector.value)
  })
  .then(updateVote)
  .catch(function(e) {
    console.log(e)
  })
}

function updateVote(res) {
  console.log(res.data)

  if(res.err) {
    return;
  }
  updateVoteBtn();
  dailyTier.textContent = res.data.newRating
}

function updateVoteBtn() {
  voteButton.textContent = "Voted!";
  voteButton.removeEventListener("click", vote);

  ratingSelector.style.display = "none";
}