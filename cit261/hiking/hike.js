function displayHikeList(){
    const hikeListElement = document.getElementById('hikes');
    hikeList.forEach(hike => {
        hikeListElement.appendChild(buildHikeHtml(hike));
    });

}

function buildHikeHtml(hike = null){
    const item = document.createElement('li');
    item.innerHTML = '<h2>Some Stuff</h2>';

    console.dir(item);
    return item;
}

window.addEventListener('load', displayHikeList);