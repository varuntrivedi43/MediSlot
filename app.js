document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".view-slots");

  for (const btn of buttons) {
    btn.addEventListener("click", function (event) {
      // Stop the <a> link click
      event.preventDefault();
      event.stopPropagation();

      // Read doctor id from: data-doctor-id="d1"
      const doctorId = btn.dataset.doctorId;
      
      if (!doctorId) {
        return;
      }
        
      // Go to slots page using id
      window.location.href = "slots.html?id=" + encodeURIComponent(doctorId);
    });
  }

  const navSlots = document.querySelector("#nav-slots-link");

  if (navSlots) {
    navSlots.addEventListener("click", function (event) {
      event.preventDefault();

      const lastDoctorId = localStorage.getItem("lastDoctorId");

      if (lastDoctorId) {
        window.location.href = "slots.html?id=" + encodeURIComponent(lastDoctorId);
      } else {
        window.location.href = "index.html";
      }
    });
  }
});