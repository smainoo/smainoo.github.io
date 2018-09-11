const btn = document.getElementById('button'); //create a variable btn
const rainbow = ['red', 'orange', 'yellow', 'blue','rebeccapurple', 'violet'];
function change (){
  document.body.style.background = rainbow[Math.floor(7*Math.random())];
}
btn.addEventListener('click', change);
