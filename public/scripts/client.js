/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


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
  
  // Calcuate date time difference and generate correct display
  let diffMS = new Date() - created_at;
  let datetimeDisplay, datetimeUnit;
  if (diffMS/(1000 * 365 * 24 * 60 * 60) >= 1) {
    datetimeDisplay = Math.floor(diffMS/(1000 * 365 * 24 * 60 * 60));
    datetimeUnit = datetimeDisplay > 1 ? 'years' : 'year';
  } else if (diffMS/(1000 * 24 * 60 * 60) >= 1) {
    datetimeDisplay = Math.floor(diffMS/(1000 * 24 * 60 * 60));
    datetimeUnit = datetimeDisplay > 1 ? 'days' : 'day';
  } else if (diffMS/(1000 * 60 * 60) >= 1) {
    datetimeDisplay = Math.floor(diffMS/(1000 * 60 * 60));
    datetimeUnit = datetimeDisplay > 1 ? 'hours' : 'hour';
  } else if (diffMS/(1000 * 60) >= 1) {
    datetimeDisplay = Math.floor(diffMS/(1000 * 60));
    datetimeUnit = datetimeDisplay > 1 ? 'minutes' : 'minute';
  } else {
    datetimeDisplay = Math.floor(diffMS/(1000));
    datetimeUnit = datetimeDisplay > 1? 'seconds' : 'seconds';
  }

  // create $tweet element
  let example = `
  <div>
  </div>
  `;
  let $tweet = `<article class="tweet">`;
  $tweet += `<header>`;
  $tweet += `<div class="header-inner-container">`
  $tweet += `<img class="profile-pic" src=${avatars} alt="Profile Picture">`;
  $tweet += `<span>${name}</span>`;
  $tweet += `</div>`;
  $tweet += `<div class="header-inner-container">`;
  $tweet += `<span class="username">${handle}</span>`;
  $tweet += `</div>`;
  $tweet += `</header>`;
  $tweet += `<p>${escape(text)}<p>`;
  $tweet += `<hr>`;
  $tweet += `<footer>`;
  $tweet += `<div class="footer-inner-container">`;
  $tweet += `<span class="footer-date">Created ${datetimeDisplay} ${datetimeUnit} ago</span>`;
  $tweet += `</div>`;
  $tweet +=  `<div class="footer-inner-container">`;
  $tweet +=  `<i class="fas fa-flag footer-icon"></i>`;
  $tweet += `<i class="fas fa-retweet footer-icon"></i>`;
  $tweet += `<i class="fas fa-heart footer-icon"></i>`;
  $tweet += `</div>`;

  return $tweet;
};

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
