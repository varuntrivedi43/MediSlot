document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#bookings-list");
  const empty = document.querySelector("#bookings-empty");
  if (!list) return;

  const raw = localStorage.getItem("bookings");
  const bookings = raw ? JSON.parse(raw) : [];

  if (bookings.length === 0) {
    if (empty) {
      empty.style.display = "block";
      empty.innerHTML = `
        <img src="assets/empty.svg" alt="No bookings" />
        <h3>No bookings yet</h3>
        <p>Book an appointment to see it here.</p>
      `;
    }
    list.innerHTML = "";
    return;
  }

  if (empty) empty.style.display = "none";

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