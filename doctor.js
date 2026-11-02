// Document load event listener
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const doctorId = params.get("id");

  const detailContent = document.querySelector("#doctor-detail-content");
  if (!detailContent) return;

  // ----------------------------------------------------
  // HELPER: Avatar Initials Generator
  // ----------------------------------------------------
  function getInitials(name) {
    const parts = String(name).replace("Dr. ", "").trim().split(" ");
    const first = parts[0] ? parts[0][0] : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  // ----------------------------------------------------
  // UI 1: Skeleton Loading UI
  // ----------------------------------------------------
  function showLoading() {
    detailContent.innerHTML = `<p class="muted">Loading doctor details…</p>`;
  }

  // ----------------------------------------------------
  // UI 2: Service Outage / Error UI
  // ----------------------------------------------------
  function showError(message) {
    detailContent.innerHTML = `
      <div>
        <h3>Service Temporarily Unavailable</h3>
        <p class="muted" style="margin-top: 8px;">
          ${message || "We are unable to connect to our services right now. Please try again."}
        </p>
        <button type="button" class="primary-btn" id="retry-doctor" style="width: auto; margin-top: 16px;">
          Retry Connection
        </button>
      </div>
    `;

    const retryBtn = document.querySelector("#retry-doctor");
    if (retryBtn) {
      retryBtn.addEventListener("click", loadDoctor);
    }
  }

  // ----------------------------------------------------
  // UI 3: Render Practo-Style Doctor Profile
  // ----------------------------------------------------
  function renderDoctorProfile(doctor) {
    detailContent.innerHTML = `
      <div class="card-header" style="margin-bottom: 20px;">
        <div class="avatar has-img" style="width: 72px; height: 72px;">
          <img class="avatar-img" src="assets/avatar.svg" alt="Doctor avatar" />
          <span class="avatar-fallback" style="font-size: 1.4rem;">${getInitials(doctor.name)}</span>
        </div>
        <div>
          <h2 style="font-size: 1.5rem; margin-bottom: 4px;">${doctor.name}</h2>
          <span class="tag">${doctor.specialty}</span>
          <p class="doctor-qualification" style="font-size: 0.9rem; margin-top: 4px;">${doctor.qualification || "MBBS"}</p>
        </div>
      </div>

      <div class="doctor-meta" style="margin-bottom: 20px;">
        <span class="rating-badge" style="font-size: 0.9rem; padding: 4px 10px;">★ ${doctor.rating || "4.8"} (${doctor.reviewsCount || 100}+ reviews)</span>
        <span class="exp-badge" style="font-size: 0.9rem; padding: 4px 12px;">${doctor.experience}+ Years Experience</span>
      </div>

      <div style="border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 16px 0; margin-bottom: 24px;">
        <p class="clinic-info" style="font-size: 0.95rem; margin-bottom: 8px;">
          🏢 <strong>${doctor.clinic || "Clinic"}</strong>
        </p>
        <p class="clinic-info" style="font-size: 0.9rem; margin-bottom: 0;">
          📍 ${doctor.location || "Central Location"}
        </p>
      </div>

      <div class="card-footer-row" style="border-top: none; padding-top: 0; margin-top: 0;">
        <div>
          <span class="muted" style="font-size: 0.82rem; display: block;">Consultation Fee</span>
          <span class="fee-tag" style="font-size: 1.2rem;">₹${doctor.fee || 500}</span>
        </div>

        <button type="button" class="primary-btn" id="view-slots-btn" style="width: auto; padding: 12px 28px;">
          Select Slot & Book
        </button>
      </div>
    `;

    // Wire avatar image error fallback
    const img = detailContent.querySelector(".avatar-img");
    if (img) {
      img.addEventListener("error", function () {
        const avatar = img.closest(".avatar");
        if (avatar) avatar.classList.remove("has-img");
      });
    }

    // Save doctor ID and navigate to slots page on button click
    const viewSlotsBtn = document.querySelector("#view-slots-btn");
    if (viewSlotsBtn) {
      viewSlotsBtn.addEventListener("click", function () {
        localStorage.setItem("lastDoctorId", doctor.id);
        window.location.href = "slots.html?id=" + encodeURIComponent(doctor.id);
      });
    }
  }

  // ----------------------------------------------------
  // MAIN API FETCH
  // ----------------------------------------------------
  async function loadDoctor() {
    if (!doctorId) {
      showError("No doctor selected. Please select a doctor from the home page.");
      return;
    }

    showLoading();

    try {
      const doctor = await window.apiGet("/api/doctors/" + encodeURIComponent(doctorId));
      renderDoctorProfile(doctor);
    } catch (err) {
      showError("We are unable to connect right now. Please try again.");
    }
  }

  loadDoctor();
});