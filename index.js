document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#doctors-list");
  if (!list) return;

  let html = "";

  function getInitials(name) {
    const parts = name.replace("Dr. ", "").trim().split(" ");
    const first = parts[0] ? parts[0][0] : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  for (const d of doctors) {
  html += `<a class="card-link" href="doctor.html?id=${encodeURIComponent(d.id)}">
      <section class="doctors">
        <div class="card-header">
          <div class="avatar">${getInitials(d.name)}</div>
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
});