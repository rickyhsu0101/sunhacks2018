function cont(user){
  $.ajax({
    method: 'GET',
    url: "/api/courses/" + $("#courseMain").attr('data-id'),
    success: function(response){
      $("#applyTutor").on("click", function (e) {
        e.preventDefault();
        const id = user._id;
        let days = [];
        for(let i = 0; i <7; i++){
          const start = parseInt($("#startTimeModal option:selected").attr("data-index"))*3600000+15*3600000;
          const end = parseInt($("#endTimeModal option:selected").attr("data-index"))*3600000+15*3600000;
          days.push({
            start,
            end
          })
        }
        $.ajax({
          method: 'POST',
          url: "/api/courses/tutor/request/" + response.course._id,
          data: {
            student: user._id,
            days
          },
          success: function (response) {
              console.log(response)
              window.location.href = "/dashboard";
            },
            error: function (xhr) {
              console.log(xhr.responseText);
              window.location.href = "/dashboard";
            },
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", jwt);
          }
        })
      });
      const course = response.course;
      const isTutor = course.tutors.find(el=>el.student._id==user._id);
      console.log(isTutor);
      if(isTutor!==undefined){
        $("#columnApply").attr("hidden", "hidden");
      }else{
        $("#columnApply").removeAttr("hidden");
      }
      $('#tutorsAvailable').on('change', function () {
        var index = $("#tutorsAvailable option:selected").attr("data-index");
        if(parseInt(index)!=-1){
          const tutor = course.tutors[parseInt(index)];
          console.log(tutor);
          $("#tutorName").html(tutor.student.firstname + " " + tutor.student.lastname);
          for(let i = 1; i <= 7; i++){
            const startTime = moment().startOf("day").add(tutor.availability.days[i - 1].start, "milliseconds").format("hh:mm a");
            const endTime = moment().startOf("day").add(tutor.availability.days[i - 1].end, "milliseconds").format("hh:mm a");
            $("#day-" + i).html(startTime + " to " + endTime);
          }
          let timesCounter = (tutor.availability.days[0].end-tutor.availability.days[0].start)/(60*60*1000);
          $("#reqTime").html(`<option data-milli = "${tutor.availability.days[0].start}">${moment().startOf("day").add(tutor.availability.days[0].start, "milliseconds").format("hh:mm a")}</option>`);
          for(let i =1; i <=timesCounter; i++){
            $("#reqTime").append(`<option data-milli = "${tutor.availability.days[0].start+i*60*60*1000}">${moment().startOf("day").add(tutor.availability.days[0].start+i*60*60*1000, "milliseconds").format("hh:mm a")}</option>`);
          }
          $("#date").attr("min", moment().add(1, "days").format("YYYY-MM-DD"));
          $("#date").attr("max", moment().add(8, "days").format("YYYY-MM-DD"));
          $("#scheduleTime").off("click").on("click", function(e){
            e.preventDefault();
            const formattedDate = moment(document.getElementById("date").value, "YYYY-MM-DD").format("MM-DD-YYYY");
            const time = parseInt($("#reqTime option:selected").attr("data-milli"));
            const duration = 3600000;
            const location = $("#reqLocation option:selected").text();
            $.ajax({
              method: 'POST',
              url: `/api/appointments/schedule/${$("#courseMain").attr("data-id")}/${tutor.student._id}`,
              data: {
                date: formattedDate,
                time,
                duration,
                location
              },
              success: function(response){
                console.log(response)
                window.location.href = "/dashboard";
              },
              error: function (xhr) {
                console.log(xhr.responseText);
                window.location.href = "/dashboard";
              },
              beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", jwt);
              }
            })
          });
          $("#displayTimes").removeAttr("hidden");
          $("#displayTimesAction").removeAttr("hidden");
        }else{
          $("#displayTimes").attr('hidden', 'hidden');
          $("#displayTimesAction").attr('hidden', 'hidden');
        }
      });
    },
    error: function(xhr){
      console.log(xhr.responseText);
      //window.location.href = "/dashboard";
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", jwt);
    }
  })
  
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
      window.location.href = "/";
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", jwt);
    },
  })
}