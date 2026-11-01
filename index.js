// Page ka HTML fully load hone ke baad hi JS execute hoga
document.addEventListener("DOMContentLoaded", function () {
  
  // DOM Elements select karte hain
  const list = document.querySelector("#doctors-list");
  if (!list) return;

  const searchInput = document.querySelector("#doctor-search");
  const filterPills = document.querySelectorAll(".filter-pill");

  // State Variables (Data manage karne ke liye)
  let allDoctors = [];             // API se mile saare doctors yahan store honge
  let currentSpecialty = "ALL";     // Active specialty filter pill (default: "ALL")
  let currentSearchQuery = "";     // User ka typing search text

  // ----------------------------------------------------
  // HELPER 1: Doctor Initials (Avatar fallback ke liye)
  // Example: "Dr. Asha Sharma" -> "AS"
  // ----------------------------------------------------
  function getInitials(name) {
    const parts = String(name).replace("Dr. ", "").trim().split(" ");
    const first = parts[0] ? parts[0][0] : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  // ----------------------------------------------------
  // HELPER 2: Image Error Fallback
  // Agar image load na ho to avatar se `.has-img` hata kar initials dikhao
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
  // UI FUNCTION 1: Loading Skeleton Placeholder
  // Data load hone tak grey placeholder panel dikhayega
  // ----------------------------------------------------
  function renderSkeleton() {
    list.innerHTML = `
      <section class="panel">
        <p class="muted">Loading available doctors…</p>
      </section>
    `;
  }

  // ----------------------------------------------------
  // FILTER LOGIC: Search Text + Specialty Pill Filter
  // User ke search typing aur selected pill ke basis par list filter karta hai
  // ----------------------------------------------------
    // ----------------------------------------------------
  // SMART & FLEXIBLE SEARCH LOGIC
  // "Dr." prefix optional, partial name, specialty & location matching
  // ----------------------------------------------------
  function getFilteredDoctors() {
    const rawQuery = currentSearchQuery.trim().toLowerCase();

    return allDoctors.filter(function (doc) {
      // 1. Category Pill Filter Check
      const matchesSpecialty =
        currentSpecialty === "ALL" ||
        (doc.specialty &&
          doc.specialty.toLowerCase() === currentSpecialty.toLowerCase());

      if (!matchesSpecialty) return false;
      if (!rawQuery) return true;

      // "Dr." prefix ko strip karke clean search text banao (e.g. "Dr Asha" -> "asha")
      const cleanQuery = rawQuery.replace(/^dr\.?\s*/i, "");

      // Doctor ka saara text ek jagah combine karo
      const fullDoctorText = [
        doc.name,
        doc.specialty,
        doc.qualification,
        doc.clinic,
        doc.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      // Query ke har word ko check karo (e.g. "Asha Sharma" -> ["asha", "sharma"])
      const searchTerms = (cleanQuery || rawQuery).split(/\s+/);

      // Agar saare typed words doctor details me kahin bhi milein to match TRUE
      return searchTerms.every(function (term) {
        return fullDoctorText.includes(term);
      });
    });
  }

  // ----------------------------------------------------
  // UI FUNCTION 2: Doctor Cards Render
  // Filtered doctors ke array ko Practo-style Rich Cards me convert karta hai
  // ----------------------------------------------------
  function renderDoctors() {
    const doctors = getFilteredDoctors();

    // Case A: Agar koi doctor match na ho (Empty Filter Result)
    if (doctors.length === 0) {
      list.innerHTML = `
        <div class="panel" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
          <h3>No doctors found</h3>
          <p class="muted">Try adjusting your search or specialty filter.</p>
        </div>
      `;
      return;
    }

    // Case B: Doctor cards ki HTML build karo
    let html = "";
    for (const d of doctors) {
      html += `
        <a class="card-link" href="doctor.html?id=${encodeURIComponent(d.id)}">
          <section class="doctors">
            <!-- Card Header: Avatar + Name + Specialty + Qualification -->
            <div class="card-header">
              <div class="avatar has-img">
                <img class="avatar-img" src="assets/avatar.svg" alt="Doctor avatar" />
                <span class="avatar-fallback">${getInitials(d.name)}</span>
              </div>
              <div>
                <h3>${d.name}</h3>
                <span class="tag">${d.specialty}</span>
                <p class="doctor-qualification">${d.qualification || "MBBS"}</p>
              </div>
            </div>

            <!-- Badges: Rating Star + Experience Years -->
            <div class="doctor-meta">
              <span class="rating-badge">★ ${d.rating || "4.8"}</span>
              <span class="exp-badge">${d.experience}+ Years Exp.</span>
            </div>

            <!-- Clinic Name & Location -->
            <p class="clinic-info">
              📍 ${d.clinic ? d.clinic + ", " : ""}${d.location || "Central Clinic"}
            </p>

            <!-- Card Footer: Fee & Action Button -->
            <div class="card-footer-row">
              <span class="fee-tag">₹${d.fee || 500} Consultation</span>
              <button type="button" class="primary-btn view-slots" style="width: auto; padding: 8px 16px;" data-doctor-id="${d.id}">
                Book Appointment
              </button>
            </div>
          </section>
        </a>
      `;
    }

    list.innerHTML = html;
    wireAvatarFallback(); // Image fallbacks attach karo
  }

  // ----------------------------------------------------
  // UI FUNCTION 3: Backend Outage / Down Handling
  // ----------------------------------------------------
  function renderServiceDown() {
    list.innerHTML = `
      <div class="panel" style="grid-column: 1 / -1; width: 100%;">
        <h3>Service Temporarily Unavailable</h3>
        <p class="muted" style="margin-top: 8px;">
          We are unable to connect to our booking services right now. Please try again in a few moments.
        </p>
        <div style="margin-top: 16px;">
          <button type="button" class="primary-btn" id="retry-doctors" style="width: auto;">
            Retry Connection
          </button>
        </div>
      </div>
    `;

    const retryBtn = document.querySelector("#retry-doctors");
    if (retryBtn) retryBtn.addEventListener("click", loadDoctors);
  }

  // ----------------------------------------------------
  // MAIN API FETCH FUNCTION
  // ----------------------------------------------------
  async function loadDoctors() {
    renderSkeleton();

    try {
      // api.js se GET /api/doctors call karo
      allDoctors = await window.apiGet("/api/doctors");
      renderDoctors();
    } catch (err) {
      renderServiceDown();
    }
  }

  // ----------------------------------------------------
  // EVENT LISTENERS: Live Search & Category Pills
  // ----------------------------------------------------

  // 1. Search Bar typing listener
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      currentSearchQuery = e.target.value;
      renderDoctors(); // Instantly re-filter and re-render
    });
  }

  // 2. Specialty Filter Pills click listener
  filterPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      // Pehle saare pills se active class hatao
      filterPills.forEach((p) => p.classList.remove("active"));
      // Clicked pill par active class lagao
      pill.classList.add("active");

      currentSpecialty = pill.dataset.specialty;
      renderDoctors(); // Re-filter list
    });
  });

  // App initialization
  loadDoctors();
});