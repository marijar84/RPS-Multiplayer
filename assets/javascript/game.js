// Initialize Firebase
var config = {
    apiKey: "AIzaSyAyHDub-sziYY7ZsY0lxrOZ8n1FLx2KsVY",
    authDomain: "homeworkfirebase-5201c.firebaseapp.com",
    databaseURL: "https://homeworkfirebase-5201c.firebaseio.com",
    projectId: "homeworkfirebase-5201c",
    storageBucket: "",
    messagingSenderId: "101178224281"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

$(document).on("click", "#saveUser", function (event) {
    event.preventDefault();

    console.log("save user");

    var nameInput = $("#userName").val().trim();

    $("#user").text(nameInput);
    console.log(nameInput);

    dataRef.ref("user").push({
        name: nameInput,
        losses: 0,
        win: 0
    });
});

$(document).on("click", "#sendMessage", function (event) {
    event.preventDefault();

    var sendMessage = $("#textArea").val().trim();
    var user = $("#user").text();

    console.log(user);
    console.log(sendMessage);

    dataRef.ref("chat").push({
        userName: user,
        message: sendMessage
    });

    $("#textArea").val("");
});

$(document).on("click", ".image", function (event) {
    console.log(event);
    console.log(event.originalEvent.target.alt);
});


dataRef.ref("chat").on("child_added", function(childSnapshot) {
    console.log(childSnapshot);
    var option = $("<option>");

    var htmlText = "<h2>" + childSnapshot.val().userName +"  says: </h2><p>" + childSnapshot.val().message+"</p>"

    option.html(htmlText);

    $("#chats").append(option);
});

