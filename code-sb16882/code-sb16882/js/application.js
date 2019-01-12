//Web application icons from https://www.w3schools.com/icons/fontawesome_icons_webapp.asp
const testName = 'test1'; // this corresponds to the test in the userdata
const userData = JSON.parse(localStorage.getItem('user_test_data'));

var icons = ["fa fa-american-sign-language-interpreting", "fa fa-bolt", "fa fa-automobile", "fa fa-bank",
  "fa fa-balance-scale", "fa fa-american-sign-language-interpreting", "fa fa-bank", "fa fa-automobile",
  "fa fa-battery-empty", "fa fa-birthday-cake", "fa fa-bell-o", "fa fa-birthday-cake",
  "fa fa-battery-empty", "fa fa-bell-o", "fa fa-bolt", "fa fa-balance-scale"];

var icons2 = ["fa fa-anchor", "fa fa-arrows-v", "fa fa-bar-chart", "fa fa-adjust",
  "fa fa-eyedropper", "fa fa-anchor", "fa fa-adjust", "fa fa-bar-chart",
  "fa fa-briefcase", "fa fa-calculator", "fa fa-cart-plus", "fa fa-calculator",
  "fa fa-briefcase", "fa fa-cart-plus", "fa fa-arrows-v", "fa fa-eyedropper"];

var icons3 = ["fa fa-code", "fa fa-code", "fa fa-database", "fa fa-database", "fa fa-fire-extinguisher",
  "fa fa-fire-extinguisher", "fa fa-fire", "fa fa-fire",
  "fa fa-heartbeat", "fa fa-heartbeat", "fa fa-download", "fa fa-download",
  "fa fa-industry", "fa fa-industry", "fa fa-line-chart", "fa fa-line-chart"];

var icons4 = ["fa fa-pie-chart", "fa fa-pie-chart", "fa fa-plane", "fa fa-plane", "fa fa-plug", "fa fa-plug"
  , "fa fa-plus", "fa fa-plus", "fa fa-print", "fa fa-print", "fa fa-recycle"
  , "fa fa-recycle", "fa fa-rocket", "fa fa-rocket", "fa fa-shopping-basket", "fa fa-shopping-basket"];


const cards = document.querySelector(".deck");

let openCards = [];   //array used to keep track of cards that were clicked on
let matchCards = [];  //array used to keep a record of matched cards

const time = document.querySelector(".timer");
let currTime, totalSecs = 0;
time.innerHTML = totalSecs + 's';

// Fisher-Yates shuffle function from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/2450976#2450976

function shuffle(array) {
  let shuffler = array.length;

  //Ensuring the shuffle only works when there are elements in the array
  while (shuffler > 0) {
    //Pick a random index to keep it truly random
    let index = Math.floor(Math.random() * shuffler);

    //Decrease shuffler variable by 1
    shuffler--;

    //Swapping the last element
    let temp = array[shuffler];
    array[shuffler] = array[index];
    array[index] = temp;
  }

  return array;
}

function initialise() {
  const howManyTimesHaveIDoneTheTest = window.sessionStorage.getItem('times') ? parseInt(window.sessionStorage.getItem('times'), 10) : 0;
  window.sessionStorage.setItem('times', howManyTimesHaveIDoneTheTest + 1);

  if (howManyTimesHaveIDoneTheTest === 4) {
    sessionStorage.clear();
    window.location.href = "../html/application2.html";
  }

  //shuffle the icons
  const shuffleIcons = shuffle(icons);

  if (howManyTimesHaveIDoneTheTest == 1) {
    const shuffleIcons = shuffle(icons2);
  }

  if (howManyTimesHaveIDoneTheTest == 2) {
    const shuffleIcons = shuffle(icons3);
  }

  if (howManyTimesHaveIDoneTheTest == 3) {
    const shuffleIcons = shuffle(icons4);
  }

  //Create the cards

  for (i = 0; i < icons.length; i++) {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = "<i class = '" + icons[i] + "'</i>";
    card.setAttribute("data-position", "" + i + "");
    cards.appendChild(card);

    if (howManyTimesHaveIDoneTheTest == 1) {
      card.innerHTML = "<i class = '" + icons2[i] + "'</i>";
      card.setAttribute("data-position", "" + i + "");
      cards.appendChild(card);
    }

    if (howManyTimesHaveIDoneTheTest == 2) {
      card.innerHTML = "<i class = '" + icons3[i] + "'</i>";
      card.setAttribute("data-position", "" + i + "");
      cards.appendChild(card);
    }

    if (howManyTimesHaveIDoneTheTest == 3) {
      card.innerHTML = "<i class = '" + icons4[i] + "'</i>";
      card.setAttribute("data-position", "" + i + "");
      cards.appendChild(card);
    }

    //Add click event to each card
    clicker(card);
  }
}

let isFirstClick = true;

function clicker(card) {

  card.addEventListener("click", function () {
    if (isFirstClick) {
      //Start timer
      startTimer();
      //Change value of isFirstClick
      isFirstClick = false;
    }

    console.log(this.getAttribute("data-position")); //The collection of the card indexes starts when the timer is activated

    const currCard = this;
    const prevCard = openCards[0];

    if (openCards.length == 1) {  //Two cards, initialising from 0

      card.classList.add("open", "show", "disable");
      openCards.push(this);

      compare(currCard, prevCard);

    } else {
      // We dont have any opened cards
      card.classList.add("open", "show", "disable");
      openCards.push(this);
    }
  });
}

function compare(currCard, prevCard) {

  console.log(currCard);

  if (currCard.innerHTML == prevCard.innerHTML) {
    currCard.classList.add("match");
    prevCard.classList.add("match");
    const position1 = currCard.getAttribute("data-position");
    const position2 = prevCard.getAttribute("data-position");
    console.log("Matched Cards: " + position1 + " & " + position2);
    matchCards.push(currCard, prevCard);

    openCards = [];  // empty the array to enable further matches

    //Check if the game is over
    isTheGameOver();

  } else {

    setTimeout(function () {
      currCard.classList.remove("open", "show", "disable");
      prevCard.classList.remove("open", "show", "disable");
    }, 300);

    openCards = []; // empties the array to continue the game
  }
  add();
}

function isTheGameOver(howManyTimesHaveIDoneTheTest) {
  if (matchCards.length == icons.length) {

    //Once all the matches have been made, stop the timer
    stopTheTimer();

    // we save this score to the user data
    userData.testResults[testName].push({
      moves: moves,
      timeTaken: totalSecs
    });
    localStorage.setItem('user_test_data', JSON.stringify(userData));

    howManyTimesHaveIDoneTheTest++;
    window.location.reload(true);
  }

}

const movesContainer = document.querySelector(".moves");
let moves = 0;
movesContainer.innerHTML = 0;

function add() {
  moves++;
  movesContainer.innerHTML = moves;
}

function startTimer() {
  currTime = setInterval(function () {
    //increment totalSecs
    totalSecs++;
    //Update HTML container with new time
    time.innerHTML = totalSecs + 's';
  }, 1000) //incrementing in seconds
}

function stopTheTimer() {
  clearInterval(currTime);
}

initialise();
