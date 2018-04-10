
const JSONDATA = "/acme/js/acme.json";
let jsonData;
getData(JSONDATA);


function getData(data) {



  fetch(data)
    .then(response => response.json())
    .then(function (data) {
    console.log('Json object from getData function:');
    console.log(data);
    jsonData = data;
    processJSON(data);
  })
    .catch(error => console.log('There was an error: ', error))
} // end getData function




function processJSON(data) {
  // Log what is returned
  console.log(data);

  // Build an unordered list
  // Use a for loop to include the results in list items
  let list = "<ul>";
  for (let i = 0; i < data.navigation.length; i++) {
    list += "<li>" + data.navigation[i] + "</li>";
  };
  list += "</ul>";


  pageNav.innerHTML = list;
}

const NAVLIST = document.getElementById("pageNav");

NAVLIST.addEventListener("click", function(event) {
  document.getElementById("acme-title").innerHTML="Acme | Home page";
  const META = document.getElementById("acme-meta");
  META.setAttribute("content", "Acme Home page");

  const HOMEHIDE = document.getElementById("home-content");
  const CONSHOW = document.getElementById("prod-page");
  const CONIMAGE = document.getElementById("product-picture");


  let content = event.target.innerHTML;
  console.log(content);

  if (content == "Home") {
    document.getElementById("acme-title").innerHTML="Acme | Home Page";
    META.setAttribute("content", "Acme Home page");
    CONSHOW.setAttribute("class", "hide-content");
    HOMEHIDE.setAttribute("class", "show-home");
  }


  else if (content == "Anvils") {
    document.getElementById("acme-title").innerHTML="Acme | Anvils";
    META.setAttribute("content", "Acme Anvils");
    HOMEHIDE.setAttribute("class", "hide-home");
    CONSHOW.setAttribute("class", "show-content");
    console.log(jsonData);

    document.getElementById("prod-name").innerHTML = jsonData.Anvils.name;
    CONIMAGE.setAttribute("src", jsonData.Anvils.path);
    CONIMAGE.setAttribute("alt", "Acme Anvil");
    document.getElementById("prod-desc").innerHTML = jsonData.Anvils.description;
    document.getElementById("prod-manufacturer").innerHTML = "<b>Made By: </b>" + jsonData.Anvils.manufacturer;
    document.getElementById("prod-score").innerHTML = "<b>Reviews: </b>" + jsonData.Anvils.reviews + "/5 stars";
    document.getElementById("prod-price").innerHTML = "Price: $" + jsonData.Anvils.price;
  }
  else if (content == "Explosives") {
    document.getElementById("acme-title").innerHTML="Acme | Explosives";
    META.setAttribute("content", "Acme Explosives");
    HOMEHIDE.setAttribute("class", "hide-home");
    CONSHOW.setAttribute("class", "show-content");
    console.log(jsonData);

    document.getElementById("prod-name").innerHTML = jsonData.Explosives.name;
    CONIMAGE.setAttribute("src", jsonData.Explosives.path);
    CONIMAGE.setAttribute("alt", "Acme Explosives")
    document.getElementById("prod-desc").innerHTML = jsonData.Explosives.description;
    document.getElementById("prod-manufacturer").innerHTML = "<b>Made By: </b>" + jsonData.Explosives.manufacturer;
    document.getElementById("prod-score").innerHTML = "<b>Reviews: </b>" + jsonData.Explosives.reviews + "/5 stars";
    document.getElementById("prod-price").innerHTML = "Price: $" + jsonData.Explosives.price;
  }
  else if (content == "Decoys") {
    document.getElementById("acme-title").innerHTML="Acme | Decoys";
    META.setAttribute("content", "Acme Decoys");
    HOMEHIDE.setAttribute("class", "hide-home");
    CONSHOW.setAttribute("class", "show-content");
    console.log(jsonData);

    document.getElementById("prod-name").innerHTML = jsonData.Decoys.name;
    CONIMAGE.setAttribute("src", jsonData.Decoys.path);
    CONIMAGE.setAttribute("alt", "Acme Decoy")
    document.getElementById("prod-desc").innerHTML = jsonData.Decoys.description;
    document.getElementById("prod-manufacturer").innerHTML = "<b>Made By: </b>" + jsonData.Decoys.manufacturer;
    document.getElementById("prod-score").innerHTML = "<b>Reviews: </b>" + jsonData.Decoys.reviews + "/5 stars";
    document.getElementById("prod-price").innerHTML = "Price: $" + jsonData.Decoys.price;
  }
  else if (content == "Traps") {
    document.getElementById("acme-title").innerHTML="Acme | Traps";
    META.setAttribute("content", "Acme Traps");
    HOMEHIDE.setAttribute("class", "hide-home");
    CONSHOW.setAttribute("class", "show-content");
    console.log(jsonData);

    document.getElementById("prod-name").innerHTML = jsonData.Traps.name;
    CONIMAGE.setAttribute("src", jsonData.Traps.path);
    CONIMAGE.setAttribute("alt", "Acme Trap")
    document.getElementById("prod-desc").innerHTML = jsonData.Traps.description;
    document.getElementById("prod-manufacturer").innerHTML = "<b>Made By: </b>" + jsonData.Traps.manufacturer;
    document.getElementById("prod-score").innerHTML = "<b>Reviews: </b>" + jsonData.Traps.reviews + "/5 stars";
    document.getElementById("prod-price").innerHTML = "Price: $" + jsonData.Traps.price;
  }
});
