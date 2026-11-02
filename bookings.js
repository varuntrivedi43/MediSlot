document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#bookings-list");
  const empty = document.querySelector("#bookings-empty");

  if (!list) return;

  function renderEmpty() {
    if (empty) {
      empty.style.display = "block";
      empty.innerHTML = `
        <img src="assets/empty.svg" alt="No bookings" />
        <h3>No bookings yet</h3>
        <p>Book an appointment to see your confirmation slip here.</p>
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

  function renderServiceDown() {
    if (empty) empty.style.display = "none";
    list.innerHTML = `
      <div class="panel" style="width: 100%;">
        <h3>Service Temporarily Unavailable</h3>
        <p class="muted" style="margin-top: 8px;">
          We are unable to connect to our booking services right now. Please try again in a few moments.
        </p>
        <div style="margin-top: 16px;">
          <button type="button" class="primary-btn" id="retry-bookings" style="width: auto;">
            Retry Connection
          </button>
        </div>
      </div>
    `;

    const retryBtn = document.querySelector("#retry-bookings");
    if (retryBtn) retryBtn.addEventListener("click", loadBookings);
  }

  async function loadBookings() {
    list.innerHTML = `<p class="muted">Loading your appointment slips…</p>`;

    try {
      const bookings = await window.apiGet("/api/bookings");

      if (!Array.isArray(bookings) || bookings.length === 0) {
        renderEmpty();
        return;
      }

      hideEmpty();

      let html = "";
      for (const b of bookings) {
        // Generate a 5-digit booking reference ID from the database ID
        const refId = "MS-" + String(b.id).slice(-5).toUpperCase();

        html += `
          <div class="booking-ticket panel" style="margin-bottom: 24px; position: relative;">
            <!-- Ticket Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 16px; margin-bottom: 16px;">
              <div>
                <span class="tag" style="background: var(--success-light); color: var(--success);">✓ CONFIRMED</span>
                <span class="muted" style="font-size: 0.85rem; margin-left: 8px;">Ref: <strong>#${refId}</strong></span>
              </div>
              <span class="muted" style="font-size: 0.82rem;">Booked: ${new Date(b.createdAt).toLocaleDateString()}</span>
            </div>

            <!-- Ticket Body -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;">
              <div>
                <span class="muted" style="font-size: 0.8rem; display: block;">Doctor & Slot</span>
                <strong style="font-size: 1.1rem; color: var(--text-main);">${escapeHtml(b.doctorName)}</strong>
                <p style="color: var(--primary); font-weight: 700; margin-top: 2px;">⏰ ${escapeHtml(b.slot)}</p>
              </div>

              <div>
                <span class="muted" style="font-size: 0.8rem; display: block;">Patient Details</span>
                <strong style="font-size: 1rem; color: var(--text-main);">${escapeHtml(b.patientName)}</strong>
                <p class="muted" style="font-size: 0.88rem; margin-top: 2px;">📞 +91 ${escapeHtml(b.phone)}</p>
              </div>
            </div>

            <!-- Ticket Actions -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 16px;">
              <button type="button" class="btn-back print-ticket" onclick="window.print()" style="cursor: pointer;">
                🖨️ Print Slip
              </button>

              <button type="button" class="danger-btn cancel-booking" data-booking-id="${escapeHtml(b.id)}">
                Cancel Appointment
              </button>
            </div>
          </div>
        `;
      }

      list.innerHTML = html;

      // Cancel button event listeners
      const cancelBtns = document.querySelectorAll(".cancel-booking");
      for (const btn of cancelBtns) {
        btn.addEventListener("click", async function () {
          const bookingId = btn.dataset.bookingId;

          if (!confirm("Are you sure you want to cancel this appointment?")) return;

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

            loadBookings(); // Refresh list
          } catch (err) {
            btn.disabled = false;
            btn.textContent = "Cancel Appointment";
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