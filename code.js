$(document).ready(function() {
    // global variables
    var totalSeconds = 100;
    var score = 0;
    var interval;
    var timeLeft = $('#time');
    var questions = [["What is \"1\" + 1?",4,"5","2","\"11\"","\"1\""],
                    //  ["What is the increment operator?",3,"-","++","+","%"],
                    //  ["What is the decrement operator?",2,"--","-","/","^"],
                    //  ["True/False: \"===\" always produces the same results as \"==\"",3,"True","False"],
                     ["True/False: JavaScript allows you to create anonymous functions (functions without a name)",2,"True","False"]];
    var quesIndex = -1;
    var result = "";
    var resClass = ""
    var lockAns = false;
    var lockNav = false;
    var initials = "";
    // content rows
    var headingRow = $('#heading_row');
    var contentRow = $('#content_row');
    var buttonRow = $('#button_row');
    var resultRow = $('#result_row');

    function initGame () {
        var newEl = $('<h3 id="main_header" class="mx-auto">Coding Quiz Challenge</h3>');
        newEl.appendTo(headingRow);
        newEl = $('<h6 id="summary" class="mx-auto">This is a quiz that tests coding knowledge. The quiz is timed, and wrong answers deduct 5 seconds from the timer. Have fun!</h6>');
        newEl.appendTo(contentRow);
        newEl = $('<button id="begin" type="button" class="btn btn-primary mx-auto">Begin Quiz</button>');
        newEl.appendTo(buttonRow);
        // need action listener for begin button
        var begBtn = $('#begin');
        begBtn.on("click",startGame);
    }

    // View Scores
    function viewScores () {
        if (!lockNav) {
            alert("Score!");
        }
    }

    // Go to Next Question
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
            // Options action listener
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

    // show scores
    showScores() {
        alert("initials value: "+ initials + " score value: " + score);
    }

    // end game when timer reaches 0
    function gameOver() {
        lockNav = false;
        clearInterval(interval);
        clearContent();
        // alert("Game Over!!!\nScore: "+score);
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
            // show scores
            showScores();
        });
    }

    // Start Game
    initGame();

    // Score link action listener
    $('#high_link').on("click",viewScores);


});



