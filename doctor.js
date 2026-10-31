document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const doctorId = params.get("id");

  const nameLine = document.querySelector("#doctor-detail-name");
  const specLine = document.querySelector("#doctor-detail-specialty");
  const expLine = document.querySelector("#doctor-detail-exp");
  const viewSlotsBtn = document.querySelector("#view-slots-btn");

  function setText(name, spec, exp) {
    if (nameLine) nameLine.textContent = name;
    if (specLine) specLine.textContent = spec;
    if (expLine) expLine.textContent = exp;
  }

  function showError(message) {
    setText("Could not load doctor", message, "Please try again.");
  }

  async function loadDoctor() {
    if (!doctorId) {
      setText("Name: Unknown", "Specialty: Unknown", "Experience: Unknown");
      return;
    }

    setText("Loading...", "Please wait", "");

    try {
      const doctor = await window.apiGet("/api/doctors/" + encodeURIComponent(doctorId));

      setText(
        "Name: " + doctor.name,
        "Specialty: " + doctor.specialty,
        doctor.experience + "+ years experience"
      );

      localStorage.setItem("lastDoctorId", doctor.id);

      if (viewSlotsBtn) {
        viewSlotsBtn.onclick = function () {
          window.location.href = "slots.html?id=" + encodeURIComponent(doctor.id);
        };
      }
    } catch (err) {
      showError(err.message || "Service temporarily unavailable");
    }
  }

  loadDoctor();
});