// Initialize Firebase
var config = {
  apiKey: "AIzaSyAHiYgeA0j_0QLToH2leLg3YAHq7R8H_nE",
  authDomain: "train-schedule-929ed.firebaseapp.com",
  databaseURL: "https://train-schedule-929ed.firebaseio.com",
  projectId: "train-schedule-929ed",
  storageBucket: "train-schedule-929ed.appspot.com",
  messagingSenderId: "58323741775"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
var database = firebase.database();
// -----------------------------
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
// When the client's connection state changes...
connectedRef.on("value", function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});
// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {
  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text(snap.numChildren());
});
// ------------------------------------
// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = 0;
var frequency = 0;

var myTimer = setInterval(myTimer, 1000);

//get input from the form entry and write to fire base db
$("#submit-train").on("click", function(event) {
  event.preventDefault();

  trainName = $("#trainName-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTrainTime = moment($("#trainTime-input").val().trim(), "HH:mm").format("HH:mm");
  frequency = parseInt($("#frequency-input").val().trim());
  console.log(trainName, destination, firstTrainTime, frequency);
  console.log(typeof firstTrainTime, typeof frequency);

  
  var firstTrainConverted = moment(firstTrainTime, "hh:mm");
  console.log(firstTrainConverted);
  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log(diffTime);
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);
   var minutesTillTrain = frequency - tRemainder;
  console.log(minutesTillTrain);
  // var nextTrain = firstTrainConverted.add(diffTime + minutesTillTrain).minutes();
  var nextTrain = moment().add(minutesTillTrain, "minutes");
  var nextTrain2 = moment().add(2, "minutes")
  console.log("num1" + nextTrain);
  console.log("num2" + nextTrain2);
  nextTrain = moment(nextTrain).format("HH:mm");
  console.log("num1" + nextTrain);

  database.ref("/trainData").set({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  });



  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    nextTrain: nextTrain,
    minutesTillTrain: minutesTillTrain
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  // console.log(newTrain.name);
  // console.log(newTrain.destination);
  // console.log(newTrain.firstTrain);
  // console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");
    // console.log(firstTrain);
    // console.log("Look here");
    // // Current Time
    // var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Clears all of the text-boxes
  $("#trainName-input").val("");
  $("#destination-input").val("");
  $("#trainTime-input").val("");
  $("#frequency-input").val("");
});
