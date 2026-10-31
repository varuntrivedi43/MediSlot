document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#doctors-list");
  if (!list) return;

  const CACHE_KEY = "doctors_cache_v1";

  function getInitials(name) {
    const parts = String(name).replace("Dr. ", "").trim().split(" ");
    const first = parts[0] ? parts[0][0] : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  function wireAvatarFallback() {
    const imgs = document.querySelectorAll(".avatar-img");
    for (const img of imgs) {
      img.addEventListener("error", function () {
        const avatar = img.closest(".avatar");
        if (avatar) avatar.classList.remove("has-img");
      });
    }
  }

  function renderSkeleton() {
    list.innerHTML = `
      <section class="panel">
        <p class="muted">Loading doctors…</p>
      </section>

      <div class="grid">
        ${Array.from({ length: 6 })
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

            <p>Experience: ${d.experience} years</p>

            <button type="button" class="primary-btn view-slots" data-doctor-id="${d.id}">
              View Slots
            </button>
          </section>
        </a>
      `;
    }

    list.innerHTML = html;
    wireAvatarFallback();
  }

  function renderServiceDown(cachedDoctors) {
    const hasCache = Array.isArray(cachedDoctors) && cachedDoctors.length > 0;

    list.innerHTML = `
      <section class="panel">
        <h3>Service temporarily unavailable</h3>
        <p class="muted">
          We can’t reach the booking server right now. Please try again.
        </p>
        <div class="row" style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <button type="button" class="primary-btn" id="retry-doctors">Retry</button>
          ${hasCache ? `<span class="muted">Showing last saved doctors list.</span>` : ``}
        </div>
      </section>
      <div id="cached-doctors"></div>
    `;

    const retryBtn = document.querySelector("#retry-doctors");
    if (retryBtn) retryBtn.addEventListener("click", loadDoctors);

    if (hasCache) {
      const cachedWrap = document.querySelector("#cached-doctors");
      if (cachedWrap) {
        // render cached list below message
        const prev = list;
        // temporarily point list to cached container for render
        const original = list.innerHTML;
        cachedWrap.innerHTML = ""; // ensure empty
        // Render into cachedWrap by direct call
        cachedWrap.insertAdjacentHTML("beforeend", `<h4 style="margin:14px 0 10px;">Last available doctors</h4><div id="cached-list"></div>`);
        const cachedList = document.querySelector("#cached-list");
        if (cachedList) {
          // swap target
          const oldList = list;
          // render into cachedList
          (function () {
            let html = "";
            for (const d of cachedDoctors) {
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
                    <p>Experience: ${d.experience} years</p>
                    <button type="button" class="primary-btn view-slots" data-doctor-id="${d.id}">
                      View Slots
                    </button>
                  </section>
                </a>
              `;
            }
            cachedList.innerHTML = html;
            wireAvatarFallback();
          })();
        }
      }
    }
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function writeCache(doctors) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(doctors));
    } catch (_) {}
  }

  async function loadDoctors() {
    renderSkeleton();

    try {
      // uses api.js helper
      const doctors = await window.apiGet("/api/doctors");
      writeCache(doctors);
      renderDoctors(doctors);
    } catch (err) {
      const cached = readCache();
      renderServiceDown(cached);
    }
  }

  loadDoctors();
});