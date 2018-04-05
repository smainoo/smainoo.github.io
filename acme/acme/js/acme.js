const JSONDATA = "/acme/js/acme.json";
let jsonData;
getData(JSONDATA);

//get data from json


function getData(data){
  fetch(data)
  .then(response => response.json())
  .then(function(data){
    console.log('json object from getData function:');
    console.log(data);
    jsonData = data;
    processJSON(data);
  })
  .catch(error => console.log('There was an error: ', error))
  }
//end get data function

//process JSON function
function processJSON(data){
  //print the data returned
  console.log(data);

//for loop to list the navigation links
  let list = "<ul>";
  for (let i = 0, n = 5; i < n; i++){
    list += "<li>" + data.navarray[i] + "</li>";
  };
  list += "</li>";
  pageNav.innerHTML = list;

}

//create a variable to store page-nave list
const NAVLINKS = document.getElementById("pageNav");

//add event listener
NAVLINKS.addEventListener("click", function(event){
  document.getElementById("home").innerHTML="Acme |Homepage";

  //hide and show content upon click

  const HIDEHOME = document.getElementById("");
  const SHOWCONTENT = document.getElementById("");
  const CONTENTIMAGE = document.getElementById("");

  let content = event.target.innerHTML;
  console.log(content);

  //switch content based on links click

  if (content == ""){
    document.getElementById("home").innerHTML="Acme |Homepage";
    SHOWCONTENT.setAttribute("class", "content-hide");
    HIDEHOME.setAttribute("class", "home-show");
  }

  else if (content == "Anvils") {
    document.getElementById("acme-title").innerHTML="Acme | Anvils";
    META.setAttribute("content", "Acme Anvils");
    HOMEHIDE.setAttribute("class", "home-hide");
    CONSHOW.setAttribute("class", "content-show");
    console.log(jsonData);


}
})
