$(document).ready(function() {

  // Character count
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

  // Show Tweet Form on Click on show-form-button (on nav bar)
  $(".show-form-button").click(function() {
    $(".new-tweet").slideDown('fast');
    $(".new-tweet textarea").focus();
  })

  // Show go-to-form button (in bottom right of screen) based on scroll position
  $(window).scroll(function() {
    console.log()
    if($(window).scrollTop() >= 300) {
      $(".go-to-form-button").show();
      $(".show-form-container").hide();
    } else {
      $(".go-to-form-button").hide();   
      $(".show-form-container").show(); 
    }
  });

  // Scroll to top when clicked on go-to-form button (in bottom right of screen)
  $(".go-to-form-button").click(function() {
    $(".new-tweet").slideDown('fast');
    $('html, body').animate({scrollTop: $(".new-tweet").offset().top - 250}, 300);
    $(".new-tweet textarea").focus();
    $(this).hide();
    $("show-form-container").show();
  });
});