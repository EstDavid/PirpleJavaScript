const mainTitle = document.head.getElementsByTagName("TITLE");
mainTitle[0].innerText = "Star Wars API Fetch";

const titleDiv = document.createElement("div");

titleDiv.innerHTML = `
  <div>
    <h1>The Star Wars API</h1>
  </div>
`

document.body.appendChild(titleDiv);

function getPlanet() {
  console.log("clicked");
  const randomNum = Math.floor(Math.random() * 10) + 1;
  const urlAPI = `https://swapi.dev/api/planets/${randomNum}/`;
    fetch(urlAPI)
      .then(data => data.json())
      .then(parsedData => populatePlanet(parsedData))
      .catch(error => console.log(error))
}

const myDiv = document.getElementById("planet");
const myButton = document.getElementById("button");
const mySecondButton = document.getElementById("otherButton");
const highlighter = document.getElementById("highlighter");
const selector = document.getElementById("selector");

const allPlanetDivs = document.getElementsByClassName("planet");

myButton.addEventListener("click", getPlanet);
mySecondButton.addEventListener("click", getPlanets);
highlighter.addEventListener("click", showUnpopulated);
selector.addEventListener("change", highlight);

function getPlanets() {
  const urlPlanets = `https://swapi.dev/api/planets/`;
  fetch(urlPlanets)
    .then(data => data.json())
    .then(planets => processPlanets(planets.results))
}

function processPlanets(planetsArray) {
  for(const [index, prop] of planetsArray.entries()) {
    populatePlanet(prop, index);
  }
}

function populatePlanet(planetObj, index) {
  const {name, climate, terrain, population, orbital_period} = planetObj;
  let pop;
  if(population > 0 && population <= 1000000) {
    pop = "low";
  }
  else if (population > 1000000 && population <= 1000000000) {
    pop = "medium";
  }
  else if (population > 1000000000) {
    pop = "high";
  }
  else {
    pop = "unknown";
  }
  const planetDiv = `
  <div class="planet" data-planetId=${index} data-population=${pop}>
    <h1>${name}</h1>
    <p>${name} has a climate that is ${climate}. The terrain is
    ${terrain}, with a pop. of ${population === "unknown" ? population : parseInt(population).toLocaleString("es-ES")}. The 
    orbital period is ${orbital_period}
    </p>
  </div>
  `;
  myDiv.insertAdjacentHTML("afterend", planetDiv);
}

function showUnpopulated() {
  for(const prop of allPlanetDivs) {
    if(prop.dataset.population === "unknown") {
      prop.classList.toggle("highlight");
    }
  }
}

function highlight(event) {
  const {value} = event.target;
  for(const prop of allPlanetDivs) {
    prop.style.background = "white";
    if(prop.dataset.population === value) {
      prop.style.background = "teal";
    }
  }
}