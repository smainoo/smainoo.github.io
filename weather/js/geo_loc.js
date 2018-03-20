//function to get weather information for cureent location and populate the webpage with the data
'use strict';

//call the function to get the location
getGeoLocation();



//longitude and latitude function for current location

function getGeoLocation(){
//  const STATUS = document.getElementById('status');
//  STATUS.innerHTML ='Getting Location...';
//console.log (navigator.geolocation);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const LAT = position.coords.latitude;
      const LONG = position.coords.longitude;

      // Combine the values
      const LOCALE = LAT + "," + LONG;
      console.log(`Lat and Long are: ${LOCALE}.`);

      //Call getData function, send locale
      getData(LOCALE);


    })
  } else {
    STATUS.innerHTML = "Your browser doesn't support Geolocation or it is not enabled!";
  } // end else

}

//get Data from API
//function getData(LOCALE) {
//  const WU_API_KEY = '806d4d24f6e48d29';
//  const URL = "https://api.wunderground.com/api/" + WU_API_KEY + "/conditions/q/" + LOCALE + ".json";
//  fetch(URL)
//    .then(response => response.json())
//    .then(function (data) {
//    console.log('Json object from getData function:');
//    console.log(data);
//    displayData(data);
//  })
//    .catch(error => console.log('There was an error: ', error))
//} // end getData function
