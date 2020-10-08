/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// import * as timeago from 'timeago.js';

// Populate #tweet-container with tweet data

// variable to show variable
let isErrorDisplaying = false; 


const renderTweets = function(tweets) {

  // Empty container first
  $("#tweet-container").empty();
  // reverse to place newest tweet on top
  tweets.reverse().forEach(tweet => {
    let tweetArticle = createTweetElement(tweet);
    $("#tweet-container").append($(tweetArticle));
   });
};

// Prevent XSS
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Create tweet article element based on tweet data fetched from server
const createTweetElement = function(tweet) {
  let { user: { name, avatars, handle }, content: { text }, created_at } = tweet;
  
  // Get the tweet post info with external function 
  // let datetimeInfo = calculateTimeAgo(created_at);
 
  // create $tweet element

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
//       <p>${text}<p>
  return $tweet;
};

// Display error message for empty or too long tweet input

const displayErrorMessage = function(type) {
  // type will be 0 (empty tweet) or 1 (tweet length > 140)
  $("#error-container").addClass("error-container");
  if (type === 0) {  
    $("#error-container").html("<strong>&#9888; Please enter some text. &#9888;</strong>");
  } else {
    $("#error-container").html("<strong>&#9888; Too long. Plz rspct our arbitary limit of 140 chars. #kthxbye &#9888;</strong>");
  }
  $("#error-container").slideDown('slow');
  isErrorDisplaying = true;
}

// Handle new tweet submission
$("form").submit(function(event){

  // Form Validation
  // Empty string
  if (!this.text.value) {
    displayErrorMessage(0);
    return false;
  } 
  // string longer than 140 chars
  if (this.text.value.length > 140) {
    displayErrorMessage(1);
    return false;
  }
  // prevent default action
  event.preventDefault(); 

  //Encode form elements for submission
  let form_data = $(this).serialize(); 
  
	$.ajax({
		url : "/tweets",
		method: "POST",
		data : form_data
  }).done(fetchTweets)
  .done(this.reset());
});

// Fetch tweet data from server
const fetchTweets = function() {
  $.ajax({
    url: "/tweets",
    method: "GET",
  }).done(res => renderTweets(res));
};

// Fetch data on load
$("document").ready(() => {
  fetchTweets();
  $("#error-container").hide();
});

// Hide message if the tweeter input is within the allowed length
$("form").on("keyup", function() {
  if (isErrorDisplaying) {
    if (this.text.value.length > 0 && this.text.value.length <= 140) {
      $("#error-container").slideUp();
      isErrorDisplaying = false;
    }
  }
});