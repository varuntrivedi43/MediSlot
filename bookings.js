document.addEventListener("DOMContentLoaded", function () {
  const API_BASE = "http://localhost:3000";

  const list = document.querySelector("#bookings-list");
  const empty = document.querySelector("#bookings-empty");
  const clearBtn = document.querySelector("#clear-bookings");

  if (!list) return;

  // No backend endpoint to clear all bookings yet
  if (clearBtn) {
    clearBtn.style.display = "none";
  }

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

  function loadBookings() {
    fetch(API_BASE + "/api/bookings")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load bookings");
        return res.json();
      })
      .then(function (bookings) {
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

        const cancelBtns = document.querySelectorAll(".cancel-booking");
        for (const btn of cancelBtns) {
          btn.addEventListener("click", function () {
            const bookingId = btn.dataset.bookingId;
            btn.disabled = true;

            fetch(API_BASE + "/api/bookings/" + encodeURIComponent(bookingId), {
              method: "DELETE",
            })
              .then(function (res) {
                if (!res.ok) throw new Error("Failed to delete booking");
                return res.json();
              })
              .then(function () {
                loadBookings(); // re-render
              })
              .catch(function () {
                btn.disabled = false;
                alert("Could not cancel booking. Please try again.");
              });
          });
        }
      })
      .catch(function () {
        alert("Could not load bookings. Is the backend running on port 3000?");
      });
  }

  loadBookings();
});