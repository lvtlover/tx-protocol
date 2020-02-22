// client-side js
// run by the browser each time your view template is loaded

console.log("hello world :o");

function onSubmit(){
  var emInput = document.querySelector("#inputTX");
  var value = emInput.value;
  value = value.trim();
  window.location = "tx/"+value;
}
