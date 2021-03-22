const baseUrl = /* "http://localhost:3000/" */"https://atla-animals.herokuapp.com/";

axios.defaults.baseURL = baseUrl;

const app = new Vue({
  el: "#app",
  data: {
    daily: {
      hasVoted: false,
      selectedTier: "4"
    },
  },
  methods: {
    vote: function() { vote(app) }
  },
  mounted: function() {
    fetchDailyInfo()
    .then(function(res) { updateDaily(res, app); })
  }
});

function fetchDailyInfo() {
  return axios.get("animal/daily");
}

function updateDaily(res, app) {
  const data = res.data;

  const animalName = data.name.replace(/^\D| \D/g, function(match) {
    return match.toUpperCase();
  })
  
  const daily = {
    date: data.date,
    name: animalName,
    tier: data.tier || "No",
    hasVoted: data.hasVoted,
    imgSrc: baseUrl + "animals/" + data.name + ".png"
  }

  for(const prop in daily) {
    app.daily[prop] = daily[prop];
  }

}

function vote(app = app) {
  axios.post("animal/vote", {
    answer: parseInt(app.daily.selectedTier)
  })
  .then(function(res) { updateVote(res, app) })
  .catch(function(e) {
    console.log(e)
  })
}

function updateVote(res) {
  if(res.err) {
    return;
  }

  app.hasVoted = true;
  app.tier = res.data.newRating;
}