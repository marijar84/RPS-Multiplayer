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

var imgSelected = "";
var nameImgSelected = "";
var nameInput = "";

var userId = 0;
var countUser = 0;

var player1 = false, player2 = false;
var opponentOption = "";
var opponentName = "";

var countWin = 0;
var countLoose = 0;

window.onbeforeunload = function (evt) {
    if (typeof evt == 'undefined') {
        evt = window.event;
    }
    if (evt) {
        dataRef.ref("players/" + userId).remove();

        dataRef.ref("chat").push({
            userName: "",
            message: nameInput + " has disconnected!"
        });
    }
}

$(window).on('load', function () {
    $('#divModal').modal({ backdrop: 'static', keyboard: false })
    $('#divModal').modal('show');
});

$(document).on("click", "#saveUser", function (event) {
    event.preventDefault();

    $('#divModal').modal('hide');

    nameInput = $("#userName").val().trim();

    $("#player1").text("Hi! " + nameInput);

    dataRef.ref("chat").remove();
    $("#chats").empty();


    userId = countUser;
    dataRef.ref("players/" + countUser).set({
        name: nameInput,
        option: "",
        losses: 0,
        win: 0,
        played: false
    });
});

$(document).on("click", "#sendMessage", function (event) {
    event.preventDefault();

    var sendMessage = $("#textArea").val().trim();
    var user = $("#user").text();

    dataRef.ref("chat").push({
        userName: nameInput,
        message: sendMessage
    });

    $("#textArea").val("");
});

$(document).on("click", ".image", function (event) {
    event.preventDefault();

    var imgActual = event.originalEvent.target.alt;

    if (nameImgSelected === "") {
        imgSelected = $(this);
        nameImgSelected = event.originalEvent.target.alt;

        imgSelected.addClass("selectImage");
    }
    else {
        imgSelected.removeClass("selectImage");

        imgSelected = $(this);
        nameImgSelected = event.originalEvent.target.alt;

        imgSelected.addClass("selectImage");
    }

    $("#waiting").text("Waiting to " + opponentName);

    dataRef.ref("players/" + userId).set({
        name: nameInput,
        option: imgActual,
        losses: 0,
        win: 0,
        played: true
    });
});

dataRef.ref("chat").on("child_added", function (childSnapshot) {

    var option = $("<option>");

    var htmlText = "";

    if (childSnapshot.val().message.includes("disconnected") == true) {
        htmlText = "<var>" + childSnapshot.val().message + "</var>"
    }
    else {
        htmlText = "<strong>" + childSnapshot.val().userName + "  says: </strong><p>" + childSnapshot.val().message + "</p>"
    }
    option.html(htmlText);

    $("#chats").append(option);
});


dataRef.ref("players").on("child_changed", function (childSnapshot) {
    if (childSnapshot.val().name != nameInput) {
        opponentOption = childSnapshot.val().option;

        player2 = childSnapshot.val().played;
        opponentName = childSnapshot.val().name;

        $("#winOpponent").text(childSnapshot.val().win);
        $("#looseOpponent").text(childSnapshot.val().losses);
    }
    else {
        player1 = childSnapshot.val().played;

        $("#winMyCount").text(childSnapshot.val().win);
        $("#looseMyCount").text(childSnapshot.val().losses);
    }

    if (player1 === true && player2 === true) {
        setOpponentImage(opponentOption);

        validateOption(nameImgSelected, opponentOption);
    }
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

dataRef.ref("players").on("child_added", function (childSnapshot) {
    var data = childSnapshot.val();
    opponentName = childSnapshot.val().name;
    countUser++;
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


function setOpponentImage(opponentOption) {
    $("#opponent").css("visibility", "visible");
    $("#waiting").text("");
    if (opponentOption === "Scissors") {
        $("#opponent").attr("src", "assets/images/scissor.jpg");
    }
    else if (opponentOption === "Paper") {
        $("#opponent").attr("src", "assets/images/paper.jpg");
    }
    else if (opponentOption === "Rock") {
        $("#opponent").attr("src", "assets/images/rock.png");
    }
}

function validateOption(myOption, opponentOption) {
    if (myOption === "Rock" && opponentOption === "Scissors") {
        countWin++;
        $("#titleResult").text("You win!");
    }
    else if (myOption === "Rock" && opponentOption === "Paper") {
        countLoose++;
        $("#titleResult").text("You loose!");
    }
    else if (myOption === "Scissors" && opponentOption === "Rock") {
        countLoose++;
        $("#titleResult").text("You loose!");
    }
    else if (myOption === "Scissors" && opponentOption === "Paper") {
        countWin++;
        $("#titleResult").text("You win!");
    }
    else if (myOption === "Paper" && opponentOption === "Rock") {
        countWin++;
        $("#titleResult").text("You win!");
    }
    else if (myOption === "Paper" && opponentOption === "Rock") {
        countLoose++;
        $("#titleResult").text("You loose!");
    }
    else if (myOption === opponentOption) {
        $("#titleResult").text("TIE!");
    }
    var timer = setTimeout(myTimer, 5000);
    clearTimeout();
}

function myTimer() {
    $("#titleResult").text("");
    $("#opponent").css("visibility", "hidden");
    imgSelected.removeClass("selectImage");

    dataRef.ref("players/" + userId).set({
        name: nameInput,
        option: "",
        losses: countLoose,
        win: countWin,
        played: false
    });


}