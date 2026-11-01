// Jab poora HTML page browser me load ho jaye, tabhi JS execute hoga
document.addEventListener("DOMContentLoaded", function () {
  // Homepage par doctors render karne wala container find karte hain
  const list = document.querySelector("#doctors-list");
  
  // Agar ye element page par nahi hai (jaise kisi aur page par), to wahi se return ho jao
  if (!list) return;

  // ----------------------------------------------------
  // HELPER 1: Doctor ke naam se Initials nikalna
  // Example: "Dr. Asha Sharma" -> "AS" (avatar fallback ke liye)
  // ----------------------------------------------------
  function getInitials(name) {
    const parts = String(name).replace("Dr. ", "").trim().split(" ");
    const first = parts[0] ? parts[0][0] : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  // ----------------------------------------------------
  // HELPER 2: Profile Image fail hone par Initial dikhana
  // Agar image load hone me error aaye, to `.has-img` class remove kar do
  // ----------------------------------------------------
  function wireAvatarFallback() {
    const imgs = document.querySelectorAll(".avatar-img");
    for (const img of imgs) {
      img.addEventListener("error", function () {
        const avatar = img.closest(".avatar");
        if (avatar) avatar.classList.remove("has-img");
      });
    }
  }

  // ----------------------------------------------------
  // UI FUNCTION 1: Loading Skeleton UI
  // Real data aane tak placeholder grey cards dikhata hai
  // ----------------------------------------------------
  function renderSkeleton() {
    list.innerHTML = `
      <section class="panel">
        <p class="muted">Loading doctors…</p>
      </section>
      <div class="grid">
        ${Array.from({ length: 4 })
          .map(
            () => `
          <section class="doctors" style="opacity:.6">
            <div class="card-header">
              <div class="avatar"></div>
              <div style="flex:1">
                <div style="height:14px;background:#e9eef7;border-radius:8px;width:60%;margin-bottom:10px;"></div>
                <div style="height:12px;background:#eef2fb;border-radius:8px;width:35%;"></div>
              </div>
            </div>
            <div style="height:12px;background:#eef2fb;border-radius:8px;width:40%;margin:14px 0;"></div>
            <div style="height:38px;background:#e9eef7;border-radius:12px;width:140px;"></div>
          </section>
        `
          )
          .join("")}
      </div>
    `;
  }

  // ----------------------------------------------------
  // UI FUNCTION 2: Doctor Cards Render Karna
  // API se mile doctors ke array ko HTML cards me convert karke display karta hai
  // ----------------------------------------------------
  function renderDoctors(doctors) {
    let html = "";
    for (const d of doctors) {
      html += `
        <a class="card-link" href="doctor.html?id=${encodeURIComponent(d.id)}">
          <section class="doctors">
            <div class="card-header">
              <div class="avatar has-img">
                <img class="avatar-img" src="assets/avatar.svg" alt="Doctor avatar" />
                <span class="avatar-fallback">${getInitials(d.name)}</span>
              </div>
              <div>
                <h3>${d.name}</h3>
                <p><span class="tag">${d.specialty}</span></p>
              </div>
            </div>
            <div class="doctor-meta">
              <span class="exp-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                ${d.experience}+ Years Exp.
              </span>
            </div>
            <button type="button" class="primary-btn view-slots" data-doctor-id="${d.id}">
              View Slots
            </button>
          </section>
        </a>
      `;
    }
    list.innerHTML = html;
    
    // Cards insert karne ke baad avatar fallbacks activate karte hain
    wireAvatarFallback();
  }

  // ----------------------------------------------------
  // UI FUNCTION 3: Patient-Friendly Outage UI
  // Real-world message + Working Retry button with instant loading feedback
  // ----------------------------------------------------
  function renderServiceDown() {
    list.innerHTML = `
      <div class="panel" style="grid-column: 1 / -1; width: 100%;">
        <h3>Service Temporarily Unavailable</h3>
        <p class="muted" style="margin-top: 8px;">
          We are unable to connect to our booking services right now. Please try again in a few moments.
        </p>
        <div style="margin-top: 16px;">
          <button type="button" class="primary-btn" id="retry-doctors">
            Retry Connection
          </button>
        </div>
      </div>
    `;

    // Retry button click -> instantly shows loading skeleton & re-attempts API call
    const retryBtn = document.querySelector("#retry-doctors");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        loadDoctors(); // Re-runs the full fetch flow
      });
    }
  }

  // ----------------------------------------------------
  // MAIN FUNCTION: Data Fetching Process
  // ----------------------------------------------------
  async function loadDoctors() {
    // Step 1: Pehle loading skeleton UI dikhao
    renderSkeleton();

    try {
      // Step 2: api.js wale helper se GET /api/doctors call karo
      const doctors = await window.apiGet("/api/doctors");
      
      // Step 3: Success hone par doctors render karo
      renderDoctors(doctors);
    } catch (err) {
      // Step 4: Server down ya koi error aane par Service Down UI dikhao
      renderServiceDown();
    }
  }

  // Page load hone par main function execute karo
  loadDoctors();
});