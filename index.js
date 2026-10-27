document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#doctors-list");
  if (!list) return;

  let html = "";

  for (const d of doctors) {
    html += `
      <a class="card-link" href="doctor.html?id=${encodeURIComponent(d.id)}">
        <section class="doctors">
          <h3>${d.name}</h3>
          <p>Speciality: ${d.specialty}</p>
          <p>Experience: ${d.experience} years</p>

          <button
            type="button"
            class="primary-btn view-slots"
            data-doctor-id="${d.id}"
          >
            View Slots
          </button>
        </section>
      </a>
    `;
  }

  list.innerHTML = html;
});