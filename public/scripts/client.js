/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// variable to show if the error message is currently displayed 
let isErrorDisplaying = false; 


/*
  Populate #tweet-container with tweet data
*/

const renderTweets = function(tweets) {

  // Empty container first
  $("#tweet-container").empty();
  // reverse to place newest tweet on top
  tweets.reverse().forEach(tweet => {
    let tweetArticle = createTweetElement(tweet);
    $("#tweet-container").append($(tweetArticle));
   });
};

/*
  XSS Prevention
*/

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/*
  Create tweet article element based on tweet data fetched from server
*/
 
const createTweetElement = function(tweet) {

  let { user: { name, avatars, handle }, content: { text }, created_at } = tweet;
  
  let $tweet = 
  `
    <article class="tweet">
      <header>
        <div class="header-inner-container">
          <img class="profile-pic" src=${avatars} alt="Profile Picture">
          <span>${name}</span>
        </div>
          <div class="header-inner-container">
          <span class="username">${handle}</span>
        </div>
      </header>
      <p>${escape(text)}</p>
      <hr>
      <footer>
        <div class="footer-inner-container">
        <span class="footer-date">Created ${$.timeago(created_at)}</span>
      </div>
      <div class="footer-inner-container">
        <i class="fas fa-flag footer-icon"></i>
        <i class="fas fa-retweet footer-icon"></i>
        <i class="fas fa-heart footer-icon"></i>
      </div>
  `;
  return $tweet;
};

/*
  Tweet submission error handling 
*/

// Display error message for empty or too long tweet input; type will be 0 (empty tweet) or 1 (tweet length > 140)

const displayErrorMessage = function(type) {
  
  // Add class on error to avoid red border shown temporarily on load/refresh
  $("#error-container").addClass("error-container");
  if (type === 0) {  
    $("#error-container").html("<strong>&#9888;Please enter some text.</strong>");
  } else {
    $("#error-container").html("<strong>&#9888;Too long. Plz rspct our arbitary limit of 140 chars. #kthxbye</strong>");
  }
  $("#error-container").slideDown('fast');
  isErrorDisplaying = true;
}

// Hide message if the tweeter input is within the allowed length
$("form").on("keyup", function() {
  if (isErrorDisplaying) {
    if (this.text.value.length > 0 && this.text.value.length <= 140) {
      $("#error-container").slideUp('fast');
      isErrorDisplaying = false;
    }
  }
});

/*
  AJAX Tweet Submission
*/

$("form").submit(function(event){
  // Form Validation: empty string
  if (!this.text.value) {
    displayErrorMessage(0);
    return false;
  } 
  // Form Validation: string longer than 140 chars
  if (this.text.value.length > 140) {
    displayErrorMessage(1);
    return false;
  }
  // Prevent default action
  event.preventDefault(); 

  //Encode form elements for submission
  let form_data = $(this).serialize(); 
  
	$.ajax({
		url : "/tweets",
		method: "POST",
		data : form_data
  }).done(fetchTweets)
  .done(this.reset())
  ;
});

/*
  Fetch data from server
*/
const fetchTweets = function() {
  $.ajax({
    url: "/tweets",
    method: "GET",
  }).done(res => renderTweets(res));
};

/*
  Execute on load / refresh after document is ready
*/

$("document").ready(() => {
  // Fetch tweets from server
  fetchTweets();

  // Hide elements that would show on events
  $("#error-container").hide();
  $(".new-tweet").hide();
  $(".go-to-form-button").hide();
});