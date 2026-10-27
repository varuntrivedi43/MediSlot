const params = new URLSearchParams(window.location.search);
const doctorId = params.get("id");

const doctor = doctors.find(function (d) {
  return d.id === doctorId;
});

const nameLine = document.querySelector("#doctor-detail-name");
const specLine = document.querySelector("#doctor-detail-specialty");
const expLine = document.querySelector("#doctor-detail-exp");

if (doctor) {
  nameLine.textContent = "Name: " + doctor.name;
  specLine.textContent = "Specialty: " + doctor.specialty;
  expLine.textContent = "Experience: " + doctor.experience + " years";
} else {
  nameLine.textContent = "Name: Unknown";
  specLine.textContent = "Specialty: Unknown";
  expLine.textContent = "Experience: Unknown";
}

const viewSlotsBtn = document.querySelector("#view-slots-btn");

viewSlotsBtn.addEventListener("click", function () {
  if (!doctor) {
    return;
  }
  window.location.href = "slots.html?id=" + encodeURIComponent(doctor.id);
});