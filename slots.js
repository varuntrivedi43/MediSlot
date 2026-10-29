document.addEventListener("DOMContentLoaded", function () {
  const confirmBtn = document.querySelector("#confirm-booking");
  confirmBtn.disabled = true;

  const params = new URLSearchParams(window.location.search);

  const doctorId = params.get("id");

  const doctor = doctors.find(function (d) {
    return d.id === doctorId;
  });

  const doctorName = doctor ? doctor.name : "Unknown Doctor";

  if (doctor) {
    localStorage.setItem("lastDoctorId", doctor.id);
  }

  const slotsList = document.querySelector("#slots-list");

  if (doctor && slotsList) {
    let slotsHtml = "";

    const rawBookings = localStorage.getItem("bookings");
    const allBookings = rawBookings ? JSON.parse(rawBookings) : [];

    const bookedSlots = allBookings
      .filter(function (b) {
        return b.doctorId === doctorId;
      })
      .map(function (b) {
        return b.slot;
      });

    for (const s of doctor.slots) {
      const isBooked = bookedSlots.includes(s);

      slotsHtml += `
        <button
          type="button"
          ${isBooked ? "disabled" : ""}
          class="${isBooked ? "slot-booked" : ""}"
        >${s}</button>
      `;
    }

    slotsList.innerHTML = slotsHtml;
  }

  const backLink = document.querySelector("#back-link");
  if (backLink) {
    if (doctorId) {
      backLink.href = "doctor.html?id=" + encodeURIComponent(doctorId);
      backLink.textContent = "← Back to Doctor Details";
    } else {
      backLink.href = "index.html";
      backLink.textContent = "← Back to Doctors";
    }
  }

  const doctorLine = document.querySelector("#doctor-name");
  if (doctorLine) {
    doctorLine.textContent = "Doctor: " + doctorName;
  }

  const output = document.querySelector("#selected-slot");
  const buttons = document.querySelectorAll(".slots button");
  const slot = params.get("slot");
  let selectedBtn = null;

  if (slot && output) {
    output.textContent = "Selected slot: " + slot;
    confirmBtn.disabled = false;

    for (const btn of buttons) {
      if (btn.textContent === slot) {
        btn.classList.add("slot-selected");
        selectedBtn = btn;
        break;
      }
    }
  }

  const form = document.querySelector(".booking-form");
  const message = document.querySelector("#booking-message");

  for (const btn of buttons) {
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      if (!output) return;

      output.textContent = "Selected slot: " + btn.textContent;
      confirmBtn.disabled = false;

      if (message) {
        message.textContent = "";
        message.classList.remove("msg-error", "msg-success");
      }

      const p = new URLSearchParams(window.location.search);
      p.set("slot", btn.textContent);
      window.history.replaceState({}, "", "?" + p.toString());

      if (selectedBtn) {
        selectedBtn.classList.remove("slot-selected");
      }

      btn.classList.add("slot-selected");
      selectedBtn = btn;
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (message) {
        message.classList.remove("msg-error", "msg-success");
      }

      const currentSlot = new URLSearchParams(window.location.search).get("slot");

      if (!currentSlot) {
        if (message) {
          message.classList.add("msg-error");
          message.textContent = "Please select a slot first.";
        }
        return;
      }

      const name = document.querySelector("#fullName").value;
      const phone = document.querySelector("#phone").value;
      const cleanPhone = phone.trim();

      if (cleanPhone.length !== 10) {
        if (message) {
          message.classList.add("msg-error");
          message.textContent = "Phone must be exactly 10 digits.";
        }
        return;
      }

      const raw = localStorage.getItem("bookings");
      const bookings = raw ? JSON.parse(raw) : [];

      const alreadyBooked = bookings.some(function (b) {
        return b.doctorId === doctorId && b.slot === currentSlot;
      });

      if (alreadyBooked) {
        if (message) {
          message.classList.add("msg-error");
          message.textContent = "This slot is already booked. Please choose another slot.";
        }
        return;
      }

      bookings.unshift({
        id: String(Date.now()),
        doctorId: doctorId,
        doctorName: doctorName,
        slot: currentSlot,
        patientName: name,
        phone: cleanPhone,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("bookings", JSON.stringify(bookings));

      if (message) {
        message.classList.add("msg-success");
        message.textContent =
          "Booking request for " +
          name +
          " (" +
          cleanPhone +
          ") with " +
          doctorName +
          " at " +
          currentSlot +
          " received.";
      }

      form.reset();
      setTimeout(function () {
        window.location.href = "bookings.html";
      }, 900);
    });
  }
}); 