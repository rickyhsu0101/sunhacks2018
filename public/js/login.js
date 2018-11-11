if (authObj) {
  window.location.href = "/dashboard";
}
$("#loginButton").on("click", function(e){
  e.preventDefault();
  console.log($("#username").val(), $("#password").val());
  $.ajax({
    method: 'POST',
    url: "/api/users/login",
    data: {
      username: $("#username").val(),
      password: $("#password").val()
    },
    success: function (response, textStatus, jqXHR) {
      console.log(response);
      if (response.success == true) {
        localStorage.setItem("user", response.token);
      }
      window.location.href = "/dashboard";
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
      $("#username").val('');
      $("#password").val('');
    }
  })
})