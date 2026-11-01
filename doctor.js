// Jab poora HTML page load ho jaye, tabhi JS chalega
document.addEventListener("DOMContentLoaded", function () {

  // URL se doctor ID nikalte hain (?id=d1)
  const params = new URLSearchParams(window.location.search);
  const doctorId = params.get("id");

  // Page ke elements find karte hain
  const nameLine = document.querySelector("#doctor-detail-name");
  const specLine = document.querySelector("#doctor-detail-specialty");
  const expLine = document.querySelector("#doctor-detail-exp");
  const viewSlotsBtn = document.querySelector("#view-slots-btn");
  const detailContainer = document.querySelector("#doctor-detail");

  // ----------------------------------------------------
  // HELPER: Page ke text elements set karna
  // ----------------------------------------------------
  function setText(name, spec, exp) {
    if (nameLine) nameLine.textContent = name;
    if (specLine) specLine.textContent = spec;
    if (expLine) expLine.textContent = exp;
  }

  // ----------------------------------------------------
  // UI 1: Loading State
  // Data aane tak "Loading..." dikhata hai
  // ----------------------------------------------------
  function showLoading() {
    setText("Loading…", "Please wait", "");
    if (viewSlotsBtn) viewSlotsBtn.style.display = "none";
  }

  // ----------------------------------------------------
  // UI 2: Error / Service Unavailable State
  // Backend down ya doctor not found hone par friendly message + Retry
  // ----------------------------------------------------
  function showError(message) {
    setText(message, "", "");

    // Retry button dikhata hai
    if (viewSlotsBtn) {
      viewSlotsBtn.textContent = "Retry Connection";
      viewSlotsBtn.style.display = "inline-block";
      viewSlotsBtn.onclick = function () {
        loadDoctor(); // Dubara se load karo
      };
    }
  }

  // ----------------------------------------------------
  // MAIN: Doctor Data Fetch
  // ----------------------------------------------------
  async function loadDoctor() {
    // Agar URL me ID hi nahi hai
    if (!doctorId) {
      setText("Name: Unknown", "Specialty: Unknown", "Experience: Unknown");
      return;
    }

    showLoading();

    try {
      // api.js wale helper se GET /api/doctors/:id call karo
      const doctor = await window.apiGet(
        "/api/doctors/" + encodeURIComponent(doctorId)
      );

      // Success: Doctor details dikhao
      setText(
        "Name: " + doctor.name,
        "Specialty: " + doctor.specialty,
        doctor.experience + "+ years experience"
      );

      // Navbar "Slots" smart link ke liye last visited doctor save karo
      localStorage.setItem("lastDoctorId", doctor.id);

      // View Slots button activate karo
      if (viewSlotsBtn) {
        viewSlotsBtn.textContent = "View Slots";
        viewSlotsBtn.style.display = "inline-block";
        viewSlotsBtn.onclick = function () {
          window.location.href =
            "slots.html?id=" + encodeURIComponent(doctor.id);
        };
      }
    } catch (err) {
      // Server down ya 404
      showError(
        "We are unable to connect right now. Please try again."
      );
    }
  }

  // Page load par doctor fetch karo
  loadDoctor();
});