//Weather Site Javascript Functions



// Variables for Function Use
const temp = 21;
const speed = 5;

//call the windchill function
buildWC(speed, temp);


// This function will calculate the wind chill temperature
function buildWC(speed, temp){
const feelTemp = document.getElementById('feel');

  //calculate windchill
  let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
  console.log(wc);

  //Round the answer down to integer
  wc = Math.floor(wc);

  //If windchill is greater than temp, return the temp
  wc = (wc > temp)?temp:wc;

//display the windchill
console.log(wc);

feelTemp.innerHTML = wc;
}
