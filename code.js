$(document).ready(function() {
    // global variables
    var totalSeconds = 100;
    var score = 0;
    var scores = [];
    var interval;
    var timeLeft = $('#time');
    // quiz questions
    var questions = [["What is \"1\" + 1 in JavaScript?",4,"5","2","\"11\"","\"1\""],
                     ["What is the increment operator?",3,"-","++","+","%"],
                     ["True/False: \"===\" always produces the same results as \"==\"",3,"True","False"],
                     ["What is the decrement operator?",2,"--","-","/","^"],
                     ["True/False: The \"==\" operator allows you assign values to variables",3,"True","False"],
                     ["What is the division operator?",4,"+","-","/","^"],
                     ["The ___ operator checks for equal value and equal type",2,"===","!=","?","="],
                     ["True/False: x -= y produces the same result as x = x - y",2,"True","False"],
                     ["_____ selects an element with an ID of main_header",2,"$('#main_header')","$('.main_header')","$('IDmain_header')","$('main_header')"],
                     ["True/False: x += y produces the same result as x = x * y",3,"True","False"],
                     ["The ___ operator is the LOGICAL AND operator",3,"===","&&","?","||"],
                     ["True/False: 1 != 1 is true",3,"True","False"],
                     ["True/False: order of operations matter in JavaScript",2,"True","False"],
                     ["The ___ operator is the LOGICAL OR operator",5,"===","&&","?","||"],
                     ["_____ creates an empty array",2,"var arrayName = [];","var arrayName = [1,2];","arrayName var [];","[arrayName]"],
                     ["True/False: the length property of an array holds the number of elements in the array",2,"True","False"],
                     ["_____ is an example of camel case",5,"main_header","mainheader","Mainheader","mainHeader"],
                     ["True/False: JavaScript allows you to create anonymous functions (functions without a name)",2,"True","False"],
                     ["What is the multiplication operator?",2,"*","-","/","^"],
                     ["True/False: The \"+\" operator allows you to concatenate (join) two strings",2,"True","False"],
                     ["What is the modulus operator?",5,"--","-","/","%"]];
    var quesIndex = -1;
    var result = "";
    var resClass = ""
    var lockAns = false;
    var lockNav = false;
    var initials = "";
    var entry = "";
    // content rows
    var headingRow = $('#heading_row');
    var contentRow = $('#content_row');
    var buttonRow = $('#button_row');
    var resultRow = $('#result_row');

    // initialize game
    function initGame () {
        var newEl = $('<h3 id="main_header" class="mx-auto">Coding Quiz Challenge</h3>');
        newEl.appendTo(headingRow);
        newEl = $('<h6 id="summary" class="mx-auto">This is a quiz that tests coding knowledge. The quiz is timed, and wrong answers deduct 5 seconds from the timer. Have fun!</h6>');
        newEl.appendTo(contentRow);
        newEl = $('<button id="begin" type="button" class="btn btn-primary mx-auto">Begin Quiz</button>');
        newEl.appendTo(buttonRow);
        // begin button action listener
        $('#begin').on("click",startGame);
    }

    // get scores
    function getScores () {
        if (JSON.parse(localStorage.getItem("scores"))) {
            scores = JSON.parse(localStorage.getItem("scores"));
        }
    }

    // set scores
    function setScores () {
        getScores();
        if (entry.length > 0) {
            scores.push(entry);
            scores = scores.sort().reverse();
            localStorage.setItem("scores",JSON.stringify(scores));
        }
    }

    // show scores
    function showScores() {
        clearContent();
        setScores();
        getScores();
        $('#nav_container').css("visibility","hidden");
        var newEl = $('<h3 id="main_header" class="mx-auto">High Scores</h3>')
        newEl.appendTo(headingRow);
        newEl = $('<ol class="mx-auto"></ol>');
        if (scores.length <= 0) {
            var newLi = $('<li><h6>No Scores Recorded</h6></li>');
            newLi.appendTo(newEl);
        } else {
            for (var i = 0; i < scores.length; i++) {
                var newLi = $('<li><h6>' + scores[i] + '</h6></li>');
                if (scores[i] === entry) {
                    newLi.addClass("recent");
                }
                newLi.appendTo(newEl);
            }
        }
        newEl.appendTo(contentRow);
        var newDiv = $('<div class="mx-auto"></div>');
        newEl = $('<button id="restart" type="button" class="btn btn-primary">Restart Game</button>')
        newEl.appendTo(newDiv);
        newEl = $('<button id="clear" type="button" class="btn btn-primary">Clear Scores</button>');
        newEl.appendTo(newDiv);
        newDiv.appendTo(buttonRow);
        // restart and clear button action listeners
        $('#restart').on("click",function(){
            location.reload();
        });
        $('#clear').on("click",function(){
            scores = [];
            entry = "";
            localStorage.setItem("scores",JSON.stringify(scores));
            showScores();
        });
    }

    // view Scores
    function viewScores () {
        if (!lockNav) {
            showScores();
        }
    }

    // go to next question
    function nextQues () {
        clearContent();
        lockAns = false;
        quesIndex++;
        if (quesIndex < questions.length) {
            var newEl = $('<h3 id="main_header" class="mx-auto">'+ questions[quesIndex][0] +'</h3>');
            newEl.appendTo(headingRow);
            newEl = $('<ul class="options mx-auto"></ul>');
            for (var i = 2; i < questions[quesIndex].length; i++) {
                var option = $('<li><button type="button" class="btn btn-primary" value="'+ i +'">'+ questions[quesIndex][i] +'</button></li>');
                option.appendTo(newEl);
            }
            newEl.appendTo(contentRow);
            // options action listener
            $('.options').on("click",function(event) {
                if (event.target.value) {
                    if (!lockAns) {
                        lockAns = true;
                        var ans = parseInt(event.target.value);
                        if (ans === questions[quesIndex][1]) {
                            result="Right!";
                            resClass = "right";
                            score++;
                        } else {
                            result="Wrong!";
                            resClass = "wrong";
                            if (totalSeconds > 5) {
                                totalSeconds -= 5;
                            } else {
                                totalSeconds = 0;
                            }
                        }
                        newEl = $('<h6 class="result mx-auto text-center '+ resClass +'">'+ result +'</h6>');
                        newEl.appendTo(resultRow);
                        // timeout to advance next question
                        var timeOut = setTimeout(function() {
                            nextQues();
                        },1250);
                    }
                }
            });
        } else {
            gameOver();
        }
    }

    // clear content
    function clearContent() {
        headingRow.empty();
        contentRow.empty();
        buttonRow.empty();
        resultRow.empty();
    }

    // start game
    function startGame() {
        // lock navigation
        lockNav = true;
        // initialize timer
        totalSeconds = 100;
        clearInterval(interval);
        // clear content
        clearContent();
        // start questions
        nextQues();
        // run timer
        interval = setInterval( function() {
            if (totalSeconds > 0) {
                totalSeconds--;
                timeLeft.text(totalSeconds);
            } else {
                // end game
                gameOver();
            }
        }, 1000);
    }

    // end game when timer reaches 0 or when there are no more questions
    function gameOver() {
        lockNav = false;
        clearInterval(interval);
        clearContent();
        var newEl = $('<h3 id="main_header" class="mx-auto">Game Over!!!</h3>');
        newEl.appendTo(headingRow);
        newEl = $('<h6 id="summary" class="mx-auto">Your final score is: ' + score + '</h6>');
        newEl.appendTo(contentRow);
        var newDiv = $('<div class="mx-auto"></div>');
        newEl = $('<input type="text" class"form-control" id="initials" placeholder="Enter Initials Here"/>')
        newEl.appendTo(newDiv);
        newEl = $('<button id="sub_init" type="button" class="btn btn-primary">Submit</button>');
        newEl.appendTo(newDiv);
        newDiv.appendTo(buttonRow);
        // submit button action listener
        $('#sub_init').on("click",function(){
            if ($('#initials').val()) {
                initials = $('#initials').val();
            } else {
                initials = "Mysterious Stranger";
            }
            entry = ("0000"+score).substr(-4,4) + " - " + initials;
            // show scores
            showScores();
        });
    }

    // start game
    initGame();

    // score link action listener
    $('#high_link').on("click",viewScores);


});



