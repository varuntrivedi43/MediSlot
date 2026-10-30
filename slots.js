document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const doctorId = params.get("id");

  const confirmBtn = document.querySelector("#confirm-booking");
  const backLink = document.querySelector("#back-link");
  const doctorLine = document.querySelector("#doctor-name");
  const output = document.querySelector("#selected-slot");
  const slotsList = document.querySelector("#slots-list");
  const form = document.querySelector(".booking-form");
  const message = document.querySelector("#booking-message");

  if (confirmBtn) confirmBtn.disabled = true;

  let doctor = null;
  let doctorName = "Unknown Doctor";
  let selectedBtn = null;

  function updateBackLink() {
    if (!backLink) return;

    if (doctorId) {
      backLink.href = "doctor.html?id=" + encodeURIComponent(doctorId);
      backLink.textContent = "← Back to Doctor Details";
    } else {
      backLink.href = "index.html";
      backLink.textContent = "← Back to Doctors";
    }
  }

  function setDoctorLine() {
    if (doctorLine) {
      doctorLine.textContent = "Doctor: " + doctorName;
    }
  }

  function getBookedSlotsForDoctor() {
    const rawBookings = localStorage.getItem("bookings");
    const allBookings = rawBookings ? JSON.parse(rawBookings) : [];

    return allBookings
      .filter(function (b) {
        return b.doctorId === doctorId;
      })
      .map(function (b) {
        return b.slot;
      });
  }

  function renderSlots() {
    if (!slotsList) return;

    if (!doctor) {
      slotsList.innerHTML = "<p class='muted'>No slots available.</p>";
      return;
    }

    const bookedSlots = getBookedSlotsForDoctor();
    let slotsHtml = "";

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

  function restoreSelectedSlotFromUrl() {
    const slot = params.get("slot");
    if (!slot || !output) return;

    output.textContent = "Selected slot: " + slot;
    if (confirmBtn) confirmBtn.disabled = false;

    const buttons = document.querySelectorAll(".slots button");
    for (const btn of buttons) {
      if (btn.textContent === slot) {
        btn.classList.add("slot-selected");
        selectedBtn = btn;
        break;
      }
    }
  }

  function setupSlotButtons() {
    const buttons = document.querySelectorAll(".slots button");

    for (const btn of buttons) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        if (!output) return;

        output.textContent = "Selected slot: " + btn.textContent;
        if (confirmBtn) confirmBtn.disabled = false;

        if (message) {
          message.textContent = "";
          message.classList.remove("msg-error", "msg-success");
        }

        const p = new URLSearchParams(window.location.search);
        p.set("slot", btn.textContent);
        window.history.replaceState({}, "", "?" + p.toString());

        if (selectedBtn) selectedBtn.classList.remove("slot-selected");

        btn.classList.add("slot-selected");
        selectedBtn = btn;
      });
    }
  }

  function showError(text) {
    if (!message) return;
    message.classList.remove("msg-success");
    message.classList.add("msg-error");
    message.textContent = text;
  }

  function showSuccess(text) {
    if (!message) return;
    message.classList.remove("msg-error");
    message.classList.add("msg-success");
    message.textContent = text;
  }

  updateBackLink();
  setDoctorLine();

  // Load doctor from API
  if (doctorId) {
    fetch("http://localhost:3000/api/doctors/" + encodeURIComponent(doctorId))
      .then(function (res) {
        if (!res.ok) throw new Error("Doctor not found");
        return res.json();
      })
      .then(function (d) {
        doctor = d;
        doctorName = doctor.name;

        localStorage.setItem("lastDoctorId", doctor.id);

        setDoctorLine();
        renderSlots();
        restoreSelectedSlotFromUrl();
        setupSlotButtons();
      })
      .catch(function () {
        doctor = null;
        doctorName = "Unknown Doctor";
        setDoctorLine();
        renderSlots();
      });
  } else {
    renderSlots();
  }

  // Form submit (booking)
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (message) message.classList.remove("msg-error", "msg-success");

      const currentSlot = new URLSearchParams(window.location.search).get("slot");
      if (!currentSlot) {
        showError("Please select a slot first.");
        return;
      }

      const name = document.querySelector("#fullName").value;
      const phone = document.querySelector("#phone").value;
      const cleanPhone = phone.trim();

      if (cleanPhone.length !== 10) {
        showError("Phone must be exactly 10 digits.");
        return;
      }

      const raw = localStorage.getItem("bookings");
      const bookings = raw ? JSON.parse(raw) : [];

      const alreadyBooked = bookings.some(function (b) {
        return b.doctorId === doctorId && b.slot === currentSlot;
      });

      if (alreadyBooked) {
        showError("This slot is already booked. Please choose another slot.");
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

      showSuccess(
        "Booking request for " +
          name +
          " (" +
          cleanPhone +
          ") with " +
          doctorName +
          " at " +
          currentSlot +
          " received."
      );

      form.reset();

      setTimeout(function () {
        window.location.href = "bookings.html";
      }, 900);
    });
  }
});