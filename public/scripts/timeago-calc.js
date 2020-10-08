
  // Calcuate date time difference and generate correct display
  
  const calculateTimeAgo = function(creationTime) { 
  
  let diffMS = new Date() - creationTime;
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

  return [datetimeDisplay, datetimeUnit];
};