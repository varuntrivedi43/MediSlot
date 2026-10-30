document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const doctorId = params.get("id");

  const nameLine = document.querySelector("#doctor-detail-name");
  const specLine = document.querySelector("#doctor-detail-specialty");
  const expLine = document.querySelector("#doctor-detail-exp");
  const viewSlotsBtn = document.querySelector("#view-slots-btn");

  function showUnknown() {
    if (nameLine) nameLine.textContent = "Name: Unknown";
    if (specLine) specLine.textContent = "Specialty: Unknown";
    if (expLine) expLine.textContent = "Experience: Unknown";
  }

  if (!doctorId) {
    showUnknown();
    return;
  }

  fetch("http://localhost:3000/api/doctors/" + encodeURIComponent(doctorId))
    .then(function (res) {
      if (!res.ok) throw new Error("Doctor not found");
      return res.json();
    })
    .then(function (doctor) {
      if (nameLine) nameLine.textContent = "Name: " + doctor.name;
      if (specLine) specLine.textContent = "Specialty: " + doctor.specialty;
      if (expLine) expLine.textContent = doctor.experience + "+ years experience";

      localStorage.setItem("lastDoctorId", doctor.id);

      if (viewSlotsBtn) {
        viewSlotsBtn.addEventListener("click", function () {
          window.location.href =
            "slots.html?id=" + encodeURIComponent(doctor.id);
        });
      }
    })
    .catch(function () {
      showUnknown();
    });
});