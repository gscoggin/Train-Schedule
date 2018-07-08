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
var now = moment();

//get input from the form entry and write to fire base db
$("#submit-train").on("click", function(event) {
  event.preventDefault();

  trainName = $("#trainName-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTrainTime = moment($("#trainTime-input").val().trim(), "HH:mm").format("HH:mm");
  frequency = parseInt($("#frequency-input").val().trim());
  console.log(trainName, destination, firstTrainTime, frequency);
  console.log(typeof firstTrainTime, typeof frequency);

  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    nextArrival: nextArrival,
    minutesTillTrain: minutesTillTrain
  };
  // Uploads train data to the database
  database.ref("/trainData").push(newTrain);

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

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var frequency = childSnapshot.val().frequency;
  var nextArrival = childSnapshot.val().nextArrival;
  var minutesAway = childSnapshot.val().minutesTillTrain;

  console.log(trainName, destination, frequency, nextArrival, minutesAway);

  // Prettify the employee start
  var nextArrival = moment.unix(nextArrival).format("MM/DD/YY");
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 7 minutes.-->frequency
  // Assume the current time is 3:16 AM....--->currentTime
  //diffTime=currentTime-firstTrainTime-->16min
  //minutes since last train 
  // What time would the next train be...? (Use your brain first)--->train1:3:07;train2:3:14;train3:3:21 
  // It would be 3:21 -- 5 minutes away-->minutesAway=nextArrival-currentTime
  
  var firstTime = moment(firstTrainTime, "hh:mm").subtract(1, "years");
  console.log(firstTime);
  //difference between first time and current time 
  var diffTime = moment().diff(moment(firstTime), "minutes");
  //minutes since last train left diffTime%frequency
  var timeApart = diffTime % frequency;
  console.log(timeApart);

  var minutesAway = frequency - timeApart;
  console.log(minutesAway);
  var nextArrival = moment().add(minutesAway, "minutes");
  nextArrival=moment(nextArrival).format("hh:mm");

  // Add each train's data into the table
  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});
