$(document).ready(function() {
    // global variables
    var totalSeconds = 100;
    var interval;
    var timeLeft = $('#time');

    clearInterval(interval);
    interval = setInterval( function() {
        if (totalSeconds > 0) {
            totalSeconds--;
            timeLeft.text(totalSeconds);
        } else {
            // end game
            return;
        }
    }, 100);
});



