/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// import * as timeago from 'timeago.js';

// Populate #tweet-container with tweet data
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
  let datetimeInfo = calculateTimeAgo(created_at);
 
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
      <p>${escape(text)}<p>
      <hr>
      <footer>
        <div class="footer-inner-container">
        <span class="footer-date">Created ${datetimeInfo[0]} ${datetimeInfo[1]} ago</span>
      </div>
      <div class="footer-inner-container">
        <i class="fas fa-flag footer-icon"></i>
        <i class="fas fa-retweet footer-icon"></i>
        <i class="fas fa-heart footer-icon"></i>
      </div>
  `;

  return $tweet;
};

// <span class="footer-date">Created ${datetimeDisplay} ${datetimeUnit} ago</span>

// Handle new tweet submission
$("form").submit(function(event){

  // form validation
  // Empty string
  if (!this.text.value) {
    console.log('empty entry');
    // alert("Empty");

    $("#error-container").addClass("error-container");
    $("#error-container").html("&#9888; Please enter some text. &#9888;");
    $("#error-container").slideDown('slow').delay(3000).slideUp('slow');
    return false;
  } 
  // string longer than 140 chars
  if (this.text.value.length > 140) {
    // alert("Limit is 140; please shorten your text.");
    $("#error-container").addClass("error-container");
    $("#error-container").html("&#9888; Too long. Plz rspct our arbitary limit of 140 chars. #kthxbye &#9888;");
    $("#error-container").slideDown('slow').delay(3000).slideUp('slow');

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
  .done(this.reset())
  done();
});

const fetchTweets = function() {
  $.ajax({
    url: "/tweets",
    method: "GET",
  }).done(res => renderTweets(res));
};

// Fetch data on load
$("document").ready(() => {
  fetchTweets();
  $("#error-container").slideUp();
});
