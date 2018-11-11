function cont(user){
  if(user.status!=='teacher'){
    window.location.href = "/dashboard";
  }else{
    $("#fullName").html(`${user.firstname} ${user.lastname}`);
    $("#handle").html(user.username);
    $.ajax({
      method: 'GET',
      url: "/api/courses/teacher/all",
      success: function(response){
        const courses = response.courses;
        courses.forEach(course=>{
          course.pending.forEach(tutorReq=>{
            $("#first-table").append(`
            <tr class="table-entries">                             
                <td>${tutorReq.student.firstname}</td>
                <td>${tutorReq.student.lastname}</td> 
                <td>${tutorReq.student.email}</td>
                <td>${tutorReq.student.username}</td>
                <td>${course.subject + " " + course.number}</td>
                <td>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-6" id="yes-button">
                                <div class="text-center">
                                    <button type="button" id ="accept" class="btn btn-success" data-toggle="modal" data-target="#approval-confirmation" data-course="${course._id}" data-student="${tutorReq.student._id}" style="width:80%">Yes</button>
                                </div>
                            </div>
                            <div class="col-6" id="no-button">
                                <div class="text-center">
                                    <button type="submit" id = "reject" class="btn btn-danger" data-toggle="modal" data-target="#denial-confirmation" data-course="${course._id}" data-student="${tutorReq.student._id}" style="width:80%;">No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`);
            $("#first-table-mobile").append(`
              <tr style="font-size:20px">
                  <td>${tutorReq.student.firstname}</td>
                  <td>${tutorReq.student.lastname}</td> 
                  <td style="width:40%">
                      <button type="button" id ="more"class="btn btn-primary" data-student-firstname="${tutorReq.student.firstname}" data-student-lastname="${tutorReq.student.lastname}" data-student-username ="${tutorReq.student.username}" data-course="${course._id}" data-student="${tutorReq.student._id}"data-student-email="${tutorReq.student.email}" data-student-course="${course.subject + " " + course.number}" data-toggle="modal" data-target="#unapproved-student" style="width:50%">
                          +
                      </button>
                  </td>
              </tr>`);
          });
          course.tutors.forEach(tutor=>{
            $("#second-table").append(`
              <tr class="table-entries">                             
                <td>${tutor.student.firstname}</td>
                <td>${tutor.student.lastname}</td> 
                <td>${tutor.student.email}</td>
                <td>${tutor.student.username}</td>
                <td>${course.subject + " " + course.number}</td>
                <td>
                  <div class="text-center">
                      <button type="submit" class="btn btn-danger" data-toggle="modal" data-target="#revoke-confirmation"  data-course="${course._id}" data-student="${tutor.student._id}style="width:80%">Revoke</button>
                  </div>
                </td>
              </tr>`)
            $("#second-table-mobile").append(`
              <tr style="font-size:20px">
                  <td>${tutor.student.firstname}</td>
                  <td>${tutor.student.lastname}</td>
                  <td style="width:40%">
                      <button type="button" class="btn btn-primary" data-student-firstname="${tutor.student.firstname}" data-student-lastname="${tutor.student.lastname}" data-student-username ="${tutor.student.username}" data-course="${course._id}" data-student="${tutor.student._id}"data-student-email="${tutor.student.email}" data-student-course="${course.subject + " " + course.number}" data-toggle="modal" data-target="#approved-student" style="width:50%">
                          +
                      </button>
                  </td>
              </tr>
            `)
          })
          
        })
        $(document).on("click", "#more", function(e){
          e.preventDefault();
          $("#firstname").html($(this).attr("data-student-firstname"));
          $("#lastname").html($(this).attr("data-student-lastname"))
          $("#email").html($(this).attr("data-student-email"))
          $("#username").html($(this).attr("data-student-username"))
          $("#class").html($(this).attr("data-student-course"))
        })
        $(document).on("click", "#accept", function(e){
          e.preventDefault();
          const courseId = $(this).attr("data-course");
          const studentId=$(this).attr("data-student");
          $.ajax({
            method: "PUT",
            url: `/api/courses/tutor/approve/${courseId}/${studentId}`,
            success: function(){
              window.location.reload();
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", jwt);
            },
          })
        });
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", jwt);
      },
    })
  }
}
if (!authObj) {
  window.location.href = "/";
} else {
  $.ajax({
    method: 'GET',
    url: '/api/users/current',
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