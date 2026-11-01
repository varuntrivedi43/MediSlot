document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#bookings-list");
  const empty = document.querySelector("#bookings-empty");

  if (!list) return;

  // Render empty state illustration when no bookings exist
  function renderEmpty() {
    if (empty) {
      empty.style.display = "block";
      empty.innerHTML = `
        <img src="assets/empty.svg" alt="No bookings" />
        <h3>No bookings yet</h3>
        <p>Book an appointment to see it here.</p>
      `;
    }
    list.innerHTML = "";
  }

  function hideEmpty() {
    if (empty) empty.style.display = "none";
  }

  // Prevent XSS security issues by escaping HTML characters
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[m] || m
      );
    });
  }

  // Render outage UI when server is unreachable
  function renderServiceDown() {
    if (empty) empty.style.display = "none";
    list.innerHTML = `
      <div class="panel" style="width: 100%;">
        <h3>Service Temporarily Unavailable</h3>
        <p class="muted" style="margin-top: 8px;">
          We are unable to connect to our booking services right now. Please try again in a few moments.
        </p>
        <div style="margin-top: 16px;">
          <button type="button" class="primary-btn" id="retry-bookings">
            Retry Connection
          </button>
        </div>
      </div>
    `;

    const retryBtn = document.querySelector("#retry-bookings");
    if (retryBtn) {
      retryBtn.addEventListener("click", loadBookings);
    }
  }

  // Main function to load all bookings from backend
  async function loadBookings() {
    list.innerHTML = `<p class="muted">Loading your bookings…</p>`;

    try {
      // Use api.js helper
      const bookings = await window.apiGet("/api/bookings");

      if (!Array.isArray(bookings) || bookings.length === 0) {
        renderEmpty();
        return;
      }

      hideEmpty();

      let html = "";
      for (const b of bookings) {
        html += `
          <div class="booking-item">
            <h4>${escapeHtml(b.doctorName)} — ${escapeHtml(b.slot)}</h4>
            <p><strong>Patient:</strong> ${escapeHtml(b.patientName)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(b.phone)}</p>
            <p><strong>Booked at:</strong> ${new Date(b.createdAt).toLocaleString()}</p>

            <button type="button"
              class="danger-btn cancel-booking"
              data-booking-id="${escapeHtml(b.id)}">
              Cancel booking
            </button>
          </div>
        `;
      }

      list.innerHTML = html;

      // Attach cancel event listeners to buttons
      const cancelBtns = document.querySelectorAll(".cancel-booking");
      for (const btn of cancelBtns) {
        btn.addEventListener("click", async function () {
          const bookingId = btn.dataset.bookingId;

          btn.disabled = true;
          btn.textContent = "Cancelling...";

          try {
            const res = await fetch(
              (window.API_BASE || "http://localhost:3000") +
                "/api/bookings/" +
                encodeURIComponent(bookingId),
              { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to delete booking");

            loadBookings(); // Refresh list after deletion
          } catch (err) {
            btn.disabled = false;
            btn.textContent = "Cancel booking";
            alert("Could not cancel booking. Please try again.");
          }
        });
      }
    } catch (error) {
      renderServiceDown();
    }
  }

  loadBookings();
});