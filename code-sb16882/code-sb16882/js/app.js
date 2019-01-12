// 1. we initialize the empty user object
const userData = {
    age: '',
    randomNumber: '',
    randomNumberConfirm: '',
    testResults: {
        test1: [
            /*{
                moves,
                timeTaken
            }*/
        ],
        test2: [
            /*{
                 moves,
                 timeTaken
             }*/
        ]
    } //Stores the data in the Firebase page according to the above structure
}

function shuffle() {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function save(val) {
    // Save the age for this user
    var ageinput = document.querySelector('input[name=age]:checked').value;
    localStorage.setItem("age", ageinput);
    userData.age = val;
}

function reload() {
    //Accessing the radio buttons as an array
    const agerange = Array.from(document.getElementsByName('age'));
    const val = localStorage.getItem('age');
    userData.age = val;

    for (let i = 0; i < agerange.length; i++) {
        if (agerange[i].value == val) {
            agerange[i].checked = true; //The chosen radio button is checked = true
        }
    }
}



function transformDoc(snapshot) {
    const data = snapshot.data();

    if (data) {
        data.id = snapshot.id;
    }   //Stores data in the database according to ids

    return data;
}

function updateDoc(docRef, data) {
    db.doc(docRef).update(data);  //constantly updates data in database
}

function initApp(appInfo) {
    reload();

    appInfo.numberOfVisits++;
    updateDoc(`/appinfo/${appInfo.id}`, appInfo);

    Array.from(document.querySelectorAll('input[type="radio"]')).forEach(function (item, index) {
        item.addEventListener('click', save);
    });

    // here if the number of visit is an odd number, the user is prompted with a string to remember the random number
    if (appInfo.numberOfVisits % 2 != 0) {
        const randomNumber = shuffle().slice(0, 4).join('');
        const str = `Remember this 4 digit number ${randomNumber.bold()} as you will need it at the end of the tests`;

        userData.randomNumber = randomNumber;
        document.getElementById('saveRandomNumber').innerHTML = str;
    }
}

// this function persists the userData to local-storage then we move on
function gotoTest1() {
    // Persist the userData to local storage.
    sessionStorage.clear();

    localStorage.setItem('user_test_data', JSON.stringify(userData));
    window.location.href = 'html/application.html'
}

// we get to the database to get the appInfo so we can track number of visits
db.doc('/appinfo/memoryapp').get()
    .then((snap) => {
        const appInfo = transformDoc(snap);

        if (appInfo) {
            initApp(appInfo);
        }
    })
    .catch((err) => {
        console.log('could not connect to database');
    });
