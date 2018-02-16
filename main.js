$(document).ready(function() {

  var worker = new Worker("worker.js");
  var generation_counter = 0;

  worker.onmessage = function(e) {
    generation_counter += 1;
    $("#display").append("<div id='string_entry'> G# " + generation_counter + ": " + e.data + "</div>");
    var realHeight = $("#display")[0].scrollHeight;
    $("#display").scrollTop(realHeight);
  };


});
