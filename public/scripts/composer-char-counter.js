$(document).ready(function() {
  $(".new-tweet textarea").on('keyup', function() {
    
    // Traverse through the DOM to get the counter element
    let $counter = $(this).parents().children('footer').children('output');

    // Calculate input length and remaining length
    let inputLength = $(this).val().length;
    let remainingLength = 140 - inputLength;
    
    // Change color to red if input length over limit
    if (remainingLength < 0) {
      $counter.addClass("over-limit");
    } else {
      $counter.removeClass("over-limit");
    }
    
    $counter.val(remainingLength);
  })
});