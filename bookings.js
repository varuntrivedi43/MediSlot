document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#bookings-list");
  if (!list) return;

  const raw = localStorage.getItem("bookings");
  const bookings = raw ? JSON.parse(raw) : [];

  if (bookings.length === 0) {
    list.innerHTML = "<p class='muted'>No bookings yet.</p>";
    return;
  }

  let html = "";

  for (const b of bookings) {
    html += `
      <div class="booking-item">
        <h4>${b.doctorName} — ${b.slot}</h4>
        <p><strong>Patient:</strong> ${b.patientName}</p>
        <p><strong>Phone:</strong> ${b.phone}</p>
        <p><strong>Booked at:</strong> ${new Date(b.createdAt).toLocaleString()}</p>
      </div>
    `;
  }

  list.innerHTML = html;
});