if (authObj) {
  window.location.href = "/dashboard";
}
$("#registerButton").on("click", function (e) {
  e.preventDefault();
  console.log($("#username").val(), $("#password").val());
  console.log({
    username: $("#username").val(),
    firstname: $("#firstname").val(),
    lastname: $("#lastname").val(),
    password: $("#password").val(),
    password2: $("#password2").val(),
    email: $("#email").val() + "@yahoo.com"
  });
  $.ajax({
      method: 'POST',
      url: "/api/users/register",
      data: {
        firstname: $("#firstname").val(),
        lastname: $("#lastname").val(),
        username: $("#username").val(),
        password: $("#password").val(),
        password2: $("#password2").val(),
        email: $("#email").val()+"@yahoo.com"
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
        $("#firstname").val('');
        $("#lastname").val('');
        $("#username").val('');
        $("#password").val('');
        $("#password2").val('');
        $("#email").val('');
      }
    })
    
})