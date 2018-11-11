if(authObj){
  window.location.href = "/dashboard";
}
$("#left").on("click", function(e){
  e.preventDefault();
  window.location.href = "/login"
});
$("#right").on("click", function (e) {
  e.preventDefault();
  window.location.href = "/register"
});