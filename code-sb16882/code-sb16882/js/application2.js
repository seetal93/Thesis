const testName = 'test2'; // this corresponds to the test in the userdata
const userData = JSON.parse(localStorage.getItem('user_test_data'));

var icons = ["fa fa-bookmark", "fa fa-building", "fa fa-caret-square-o-down", "fa fa-check-circle-o", "fa fa-cloud-download",
  "fa fa-commenting", "fa fa-ellipsis-h", "fa fa-ellipsis-v", "fa fa-commenting-o", "fa fa-cloud-upload", "fa fa-circle",
  "fa fa-check-circle", "fa fa-caret-square-o-up", "fa fa-bookmark-o", "fa fa-building-o", "fa fa-circle-o"];

var icons2 = ["fa fa-paper-plane", "fa fa-paper-plane-o", "fa fa-text-height", "fa fa-text-width", "fa fa-mars-stroke-h",
  "fa fa-mars-stroke-v", "fa fa-list-ol", "fa fa-list-ul", "fa fa-hourglass-1", "fa fa-hourglass-3", "fa fa-plus-square-o",
  "fa fa-plus-square", "fa fa-bell-slash", "fa fa-bell-slash-o", "fa fa-sort-amount-asc", "fa fa-sort-amount-desc"];

var icons3 = ["fa fa-object-group", "fa fa-object-ungroup", "fa fa-question-circle", "fa fa-question-circle-o", "fa fa-battery-half",
  "fa fa-battery-quarter", "fa fa-share-square", "fa fa-share-square-o",
  "fa fa-sign-in", "fa fa-sign-out", "fa fa-align-right", "fa fa-align-left", "fa fa-sort-alpha-asc",
  "fa fa-sort-alpha-desc", "fa fa-paper-plane-o", "fa fa-paper-plane"];

var icons4 = ["fa fa-volume-off", "fa fa-volume-up", "fa fa-file-text", "fa fa-file-text-o", "fa fa-rotate-left",
  "fa fa-rotate-right", "fa fa-level-down", "fa fa-level-up", "fa fa-mail-forward", "fa fa-mail-reply",
  "fa fa-quote-left", "fa fa-quote-right", "fa fa-search-minus", "fa fa-search-plus", "fa fa-share-alt", "fa fa-share-alt-square"];
//change array icons

const cards = document.querySelector(".deck");

let openCards = [];
let matchCards = [];

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
    saveUserDataAndExit();
  }

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
    card.innerHTML = "<i class = '" + icons[i] + "'/>";
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

    console.log(this.getAttribute("data-position"));

    const currCard = this;
    const prevCard = openCards[0];

    if (openCards.length == 1) {

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

  const str1 = currCard.innerHTML;
  const str2 = prevCard.innerHTML;

  const regEx = /class="fa fa-([^-]+)(.?)+"/i;

  const match1 = str1.match(regEx);
  const match2 = str2.match(regEx);


  console.log(match1);     // Used to test whether regEx comparison works
  console.log(match2);

  if (match1 && match2 && match1[1] == match2[1]) {
    currCard.classList.add("match");
    prevCard.classList.add("match");
    const position1 = currCard.getAttribute("data-position");
    const position2 = prevCard.getAttribute("data-position");
    console.log("Matched Cards: " + position1 + " & " + position2);
    matchCards.push(currCard, prevCard);

    // empty the array to enable further matches
    openCards = [];

    // Check if the game is over
    isTheGameOver();

  } else {

    setTimeout(function () {
      currCard.classList.remove("open", "show", "disable");
      prevCard.classList.remove("open", "show", "disable");
    }, 300);

    openCards = [];
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

const time = document.querySelector(".timer");
let currTime, totalSecs = 0;

time.innerHTML = totalSecs + 's';

function startTimer() {
  currTime = setInterval(function () {
    //increment totalSecs
    totalSecs++;
    //Update HTML container with new time
    time.innerHTML = totalSecs + 's';
  }, 1000)
}

function stopTheTimer() {
  clearInterval(currTime);
}

function saveUserDataAndExit() {
  const result = prompt("If you were provided with a random number at the beggining of the test, please enter it below. Otherwise press OK:", "5555");
  userData.randomNumberConfirm = result;

  // we save the user data to the database
  db.collection('/testresults').add(userData).then(() => {
    const takeAnother = confirm("Thank you for partaking in this experiment. Do you want to take another test");

    if (takeAnother) {
      window.location.href = "../index.html";
    }
  })
  .catch(() => {
     window.location.href = "../index.html";
  });
}

initialise();
