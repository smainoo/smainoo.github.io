//Weather Site Javascript Functions



//// Variables for Function Use
//const temp = 21;
//const speed = 5;
//const direction = "W";
//let weatherInfo = "snow";
//let weatherClass = getCondition(weatherInfo);
//
//windDial(direction);

//call the windchill function
//buildWC(speed, temp);

//call summary image
//changeSummaryImage(weatherClass);


////Get the location from API
//const STATUS = document.getElementById('status');
//STATUS.innerHTML='Getting Location...';

// This function will calculate the wind chill temperature
function buildWC(speed, temp){
const feelTemp = document.getElementById('feelTemp');

  //calculate windchill
  let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
  console.log(wc);

  //Round the answer down to integer
  wc = Math.floor(wc);

  //If windchill is greater than temp, return the temp
  wc = (wc > temp)?temp:wc;

//display the windchill
console.log(wc);
  wc = wc; //'feels like: ' +  //+ '&deg; F';

feelTemp.innerHTML = wc;
}

// Wind DIal Function
function windDial(direction){
  //get the wind dial container
  const dial = document.getElementById("dial");
  console.log(direction);

  // Determine the dial class
  switch (direction){
    case "North":
    case "N":
      dial.setAttribute("class", "n"); //"n" is the CSS rule selector
      break;
    case "NE":
    case "NNE":
    case "ENE":
      dial.setAttribute("class", "ne");
      break;
    case "NW":
    case "NNW":
    case "WNW":
      dial.setAttribute("class", "nw");
      break;
    case "South":
    case "S":
      dial.setAttribute("class", "s");
      break;
    case "SE":
    case "SSE":
    case "ESE":
      dial.setAttribute("class", "se");
      break;
    case "SW":
    case "SSW":
    case "WSW":
      dial.setAttribute("class", "sw");
      break;
    case "East":
    case "E":
      dial.setAttribute("class", "e");
      break;
    case "West":
    case "W":
      dial.setAttribute("class", "w");
      break;
  }
}

//get condition function

function getCondition (weatherInfo){
  if (weatherInfo.includes('clouds') || weatherInfo.includes('overcast')){
    return 'cloud'
  }
  else if (weatherInfo.includes('rain') || weatherInfo.includes('rainy')){
    return 'rain'
  }
  else if (weatherInfo.includes('snow') || weatherInfo.includes('flurry')){
    return 'snow'
  }
  else if (weatherInfo.includes('fog') || weatherInfo.includes('foggy')){
    return 'fog'
  }
}


//change summary image function

function changeSummaryImage (weatherClass){
  //identify the html element for the correct css rule to change the background
  const weatherInfo = document.getElementById('weatherInfo');
  console.log(weatherClass);

  switch(weatherClass){
    case "cloud":
      weatherInfo.setAttribute('class', 'cloud');
      console.log (weatherClass);
      break;

    case "rain":
      weatherInfo.setAttribute('class', 'rain');
      console.log (weatherClass);
      break;

    case "fog":
      weatherInfo.setAttribute('class', 'fog');
      console.log (weatherClass);
      break;

    case "snow":
      weatherInfo.setAttribute('class', 'snow');
      console.log (weatherClass);
      break;

    case "clear":
      weatherInfo.setAttribute('class', 'clear');
      console.log (weatherClass);
      break;

  }


}

//get Data from API
function getData(LOCALE) {
  const WU_API_KEY = '806d4d24f6e48d29';
  const URL = "https://api.wunderground.com/api/" + WU_API_KEY + "/conditions/forecast/hourly/q/" + LOCALE + ".json";
  fetch(URL)
    .then(response => response.json())
    .then(function (data) {
    console.log('Json object from getData function:');
    console.log(data);
    displayData(data);
  })
    .catch(error => console.log('There was an error: ', error))
} // end getData function

//Dispaly data function

//hides and unhides getting location status
function displayData(data){
  const noStatus = document.getElementById("status");
  noStatus.setAttribute("id", "noStatus");

  const hide = document.getElementById("hideUnhide");
  hide.setAttribute("class", "notHide");

  const cityState=data.current_observation.display_location.full;
  console.log(cityState);
  document.getElementById("cityName").innerHTML=cityState;

  //populate location information
  const LAT=data.current_observation.display_location.latitude;
  const LONG=data.current_observation.display_location.longitude;
  document.getElementById("location").innerHTML="<b>Location: </b>" + LAT + "&deg;N, " + LONG + "&deg;W";

  const zip=data.current_observation.display_location.zip;
  console.log(zip);
  document.getElementById("zip").innerHTML="<b>Zip: </b>" + zip +" |";

  const elevation=data.current_observation.display_location.elevation;
  console.log(elevation);
  document.getElementById("elevation").innerHTML="<b>Elevation: </b>" + Math.round(elevation * 3.28) + "ft. |";

  //populate windchill information and temperature information
  const temp=data.current_observation.temp_f;
  console.log(temp);
  document.getElementById("mainTemp").innerHTML=Math.round(temp)+'&deg;F';

  const speed=data.current_observation.wind_mph;
  console.log(speed);
  document.getElementById("windSpeed").innerHTML=speed+ " mph";

  buildWC(speed, temp);
  console.log(buildWC);


  //Cannot find the correct path to dispaly low and high temperature. I made a place holder in the mean time.
  const high=data.forecast.simpleforecast.forecastday[0].high.fahrenheit;
  console.log(high);
  document.getElementById("max").innerHTML=Math.round(high)+'&deg;F';

  const low=data.forecast.simpleforecast.forecastday[0].low.fahrenheit;
  console.log(low);
  document.getElementById("min").innerHTML=Math.round(low);+'&deg;F';

  const gusts=data.current_observation.wind_gust_mph;
  console.log(gusts);
  document.getElementById("gust").innerHTML="<b>Gusts:</b>" + gusts + "mph";

  const direction=data.current_observation.wind_dir;
  console.log(direction);
  document.getElementById("windDirection").innerHTML="<b>Direction: </b>" + direction;

  windDial(direction);

//get weather conditions
  let WEATHERCOND=data.current_observation.weather;
  console.log(WEATHERCOND.toLowerCase());
  document.getElementById("condition").innerHTML=WEATHERCOND;

  let condResult= getCondition(WEATHERCOND.toLowerCase());
  console.log(condResult);
  changeSummaryImage(condResult);

  let condIcon=data.current_observation.icon_url;
  document.getElementById("conditionIcon").src=condIcon;

  let footerImage=data.current_observation.image.url;
  console.log(footerImage);
  document.getElementById("footerImage").src=footerImage;

//  //get hourly temperature from API
//  const hourly= data.current_observation.hourly_url;
//  console.log(hourly);
//  document.getElementById("hourlyTemp").innerHTML="Hourly Forecast" + hourly;

}
