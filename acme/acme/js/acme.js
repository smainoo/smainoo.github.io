'use strict';

document.getElementById("home").addEventListener("click", dispalyData);

function displayData(){
document.getElementById("home").innerHTML

                                               });

//get data from json


function getData(){
  const URL = "/js."
  fetch("")
  .then(response => response.json())
  .then(function(navigation){
    console.log('json object from getData function:');
    console.log(navigation);
  })
  .catch(error => console.log('There was an error: ', error))
  }

//dispaly function
function dispalyData(navigation){
  const anvil = navigation.

}
