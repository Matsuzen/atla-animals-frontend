const baseUrl = /* "http://localhost:3000/" */"https://atla-animals.herokuapp.com/";

axios.defaults.baseURL = baseUrl;

const app = new Vue({
  el: "#app",
  data: {
    daily: {
      selectedTier: "4",
      hasVoted: false,
      date: "",
      name: "",
      tier: "",
      imgSrc: "",
      confirmVote: false
    },
  },
  methods: {
    vote: function() {
      if(!this.daily.confirmVote) {
        this.daily.confirmVote = true;
      } else {
        vote(app) 
      }
    }
  },
  mounted: function() {
    fetchDailyInfo()
    .then(function(res) { updateDaily(res, app); })
    .catch(function(err) { console.log(err) })
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
  console.log(res.data);
  if(res.data.err) {
    return;
  }

  app.daily.hasVoted = true;
  app.daily.tier = res.data.newRating;
}