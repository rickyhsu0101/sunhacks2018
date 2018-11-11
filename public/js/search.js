function cont(){
  $("#searchButton").on("click", function(e){
    e.preventDefault();
    let data = {};
    const subject = $("#subject").val();
    const classNumber = $("#classNumber").val();
    if(subject.length!=0){
      data.subject = subject;
    }
    if(classNumber.length!=0){
      data.number = classNumber;
    }
    console.log(data);
    $.ajax({
      method: 'POST',
      url: "/api/courses",
      data,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", jwt);
      },
      success: function(xhr){
        const courses= xhr.courses;
        const coursesHtmlArray = courses.map(function(elem){
          return `<div class="result row" data-courseId="${elem._id}">
                    <div class="col-12 col-md-10">
                      <h2 class ="titleClass">${elem.subject} ${elem.number}</2>
                    </div>
                    <div class="col-12 col-md-2 row">
                      <div class="col-6 col-md-12 stats">Teachers: ${elem.teachers.length}</div>
                      <div class="col-6 col-md-12 stats">Tutors: ${elem.tutors.length}</div>
                    </div>
                  </div>`;
        });
        $("#results").html("");
        coursesHtmlArray.forEach(element => {
          $("#results").append(element);
        });
        if(coursesHtmlArray.length===0){
          $("#results").append("<h1 id = 'sorry'>Sorry there are no matching results</h1>");
        }
      }
    })
    
  })
}

if (!authObj) {
  window.location.href = "/login";
}else{
  $.ajax({
    method: 'GET',
    url: '/api/users/current',
    success: function(response){
      cont();
    },
    error: function(xhr){
      console.log(xhr.responseText);
      localStorage.removeItem("user");
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", jwt);
    },
  })
}
$(document).on("click", ".result", function(){
  console.log("clicked");
  const idString = $(this).attr("data-courseId");
  window.location.href = "/courses/" + idString;
})