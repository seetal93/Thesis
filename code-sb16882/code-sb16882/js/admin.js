let testResults = [];

// here we get all the data, transform it, then download them
function transformDoc(snapshot) {
    const data = snapshot.data();

    if (data) {
        data.id = snapshot.id;
    }

    return data;
}
//Collects and transforms singular experiment entries
function transformCollection(snapshots) {
    const results = [];
    snapshots.forEach(snap => results.push(transformDoc(snap)));

    return results;
}
//Collecting all the data as csv
function colWithIds$(colRef) {
    return db.collection(colRef).get().then((snapshots) => {
        return transformCollection(snapshots);
    });
}

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }
    //enables the structure of the results in the csv file
    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);   //process of organising data
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}
// Converting the data from the database into csv appropriate format
function downloadCSV(args, dataArray) {
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSV({
        data: dataArray
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}
// Takes all the moves taken by the participant and divides by number of iterations
function getAverageMovesForUserTest(userData, testName) {
    let result = 0;

    if (userData.testResults[testName].length > 0) {
        userData.testResults[testName].forEach((attempt) => {
            result += parseInt(attempt.moves, 10);
        });

        return result / userData.testResults[testName].length;
    }

    return result;
}
// Takes all the times taken by a participant and divides it by the number of iterations
function getAverageTimeForUserTest(userData, testName) {
    let result = 0;

    if (userData.testResults[testName].length > 0) {
        userData.testResults[testName].forEach((attempt) => {
            result += parseInt(attempt.timeTaken, 10);
        });

        return result / userData.testResults[testName].length;
    }

    return result;
}

function downloadTestData(args) {
    const doc = document.getElementById('download');

    // here we transform the result to what we want
    const tableData = testResults.map((userData) => {
        return {
            age: userData.age,
            'Random Number': userData.randomNumber || '-',  //user provided with random number or else blank
            'Average Moves Test 1': getAverageMovesForUserTest(userData, 'test1'),
            'Average Time Test 1': getAverageTimeForUserTest(userData, 'test1'),
            'Average Moves Test 2': getAverageMovesForUserTest(userData, 'test2'),
            'Average Time Test 2': getAverageTimeForUserTest(userData, 'test2')
        };   //method of organising column names in the csv file
    });

    downloadCSV(args, tableData);
    doc.disabled = false;
    doc.innerHTML = 'Download results as CSV';
}

function initStats() {
    const doc = document.getElementById('download');
    doc.innerHTML = 'Loading please wait..'
    // here we get all the data as csv
    colWithIds$('/testresults').then((results) => {
        testResults = results;

        doc.innerHTML = 'Download results as CSV';
        document.getElementById('stats').innerHTML = `${results.length} user(s) have taken this test so far`; //shows the number of users to conduct the test
    });

}

initStats();
