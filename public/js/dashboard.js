function cont(user){
  $("#fullName").html(`${user.firstname} ${user.lastname}`);
  $("#handle").html(user.username);
  $("#grade").html(user.grade + "th Grade");
  const appointments = user.appointments;
  const appointmentsHTMLwithID = appointments.map(el=>{
    return {
      html:`
          <div class = "appointmentResult row">
            <div class = "col-12 col-md-4">
              <h3 class = "resTitleText">${el.appt.course.subject} ${el.appt.course.number}</h3>
            </div>
            <div class = "col-12 col-md-8" id = "rightSide">
              <div class = "row">
                <div class = "col-6">
                  <h3 class = "resRoleText">Role: ${el.role}</h3>
                </div>
                <div class = "col-6">
                  <h3 class ="resDateText">Date: ${el.appt.date}</h3>
                </div>
              </div>
              <div class = "row">
                <div class = "col-6">
                  <h3 class ="resTimeStartText">Start Time: ${moment().startOf('day').add(el.appt.time, "milliseconds").format("hh:mm a")}</h3>
                </div>
                <div class = "col-6">
                  <h3 class ="resTimeEndText">End Time: ${moment().startOf('day').add(el.appt.time+el.appt.duration, "milliseconds").format("hh:mm a")}</h3>
                </div>
              </div>
              <div class = "row">
                <div class = "col-6">
                  <h3 class = "resDurationText">Duration: ${el.appt.duration/1000/60/60} hrs</h3>
                </div>
                <div class = "col-6">
                  <h3 class = "resLocationText">Location: ${el.appt.location}</h3>
                </div>
              </div>
            </div>
          </div>
        `,
      type: el.appt.status
    };
  });
  const courseTAHTML  = user.courses.map(el=>{
    return `<div class = "courseDiv"><h3 class = "resTitleText">${el.subject} ${el.number}</h3></div>`
  });
  appointmentsHTMLwithID.forEach(element => {
    if(element.type = "upcoming"){
      $("#upcoming").append(element.html);
    }else{
      $("#past").append(element.html);
    }
  });
  courseTAHTML.forEach(element=>{
    $("#courses").append(element);
  });
  $("#mainDash").removeAttr("hidden");
}
if (!authObj) {
  window.location.href = "/";
} else {
  $.ajax({
    method: 'GET',
    url: '/api/users/current/deep',
    success: function (response) {
      console.log(response.user);
      cont(response.user);
    },
    error: function (xhr) {
      console.log(xhr.responseText);
      localStorage.removeItem("user");
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", jwt);
    },
  })
}