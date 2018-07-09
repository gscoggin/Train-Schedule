//###############################################
//Setup Firebase Realtime Database
//###############################################
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
//###############################################
//Create data connections in directories in Firebase
//###############################################
var connectionsRef = database.ref("/trainData");
//###############################################
//Set Globarl Variables for the Train Schedule
//###############################################
// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = 0;
var frequency = 0;
//###############################################
//Onclick event to collect the inputs from the train schedule form
//###############################################
//get input from the form entry and write to fire base db
$("#submit-train").on("click", function(event) {
//Prevent empty form submissions  
  event.preventDefault();
//Set global variables to inputs from the form
  trainName = $("#trainName-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTrainTime = moment($("#trainTime-input").val().trim(), "HH:mm").format("HH:mm");
  frequency = parseInt($("#frequency-input").val().trim());
  console.log(trainName, destination, firstTrainTime, frequency);
  console.log(typeof firstTrainTime, typeof frequency);
//Object variable to contain train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    // nextArrival: nextArrival,
    // minutesTillTrain: minutesTillTrain
  };
  // Uploads train data to the database
  database.ref("/trainData").push(newTrain);
  // Alert
  alert("Train successfully added");
  // Clears all of the text-boxes
  $("#trainName-input").val("");
  $("#destination-input").val("");
  $("#trainTime-input").val("");
  $("#frequency-input").val("");
});

connectionsRef.on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;

  console.log(trainName, destination, frequency, nextArrival, minutesAway);

  // First Train of the Day is 3:00 AM
  // Assume Train comes every 7 minutes.-->frequency
  // Assume the current time is 3:16 AM....--->currentTime
  //diffTime=currentTime-firstTrainTime-->16min
  //minutes since last train 
  // What time would the next train be...? (Use your brain first)--->train1:3:07;train2:3:14;train3:3:21 
  // It would be 3:21 -- 5 minutes away-->minutesAway=nextArrival-currentTime
  
  var firstTime = moment(firstTrainTime, "h:mm a").subtract(1, "years");
  console.log(firstTime);
  //difference between first time and current time 
  var diffTime = moment().diff(moment(firstTime), "minutes");
  console.log(diffTime);
  //minutes since last train left diffTime%frequency
  var timeApart = diffTime % frequency;
  console.log(timeApart);

  var minutesAway = frequency - timeApart;
  console.log(minutesAway);

  var nextArrival = moment().add(minutesAway, "minutes");
  nextArrival=moment(nextArrival).format("h:mm a");
  console.log(nextArrival);

  // Add each train's data into the table
  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});
