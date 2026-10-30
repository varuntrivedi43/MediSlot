document.addEventListener("DOMContentLoaded", function () {
  const API_BASE = "http://localhost:3000";

  const params = new URLSearchParams(window.location.search);
  const doctorId = params.get("id");

  const confirmBtn = document.querySelector("#confirm-booking");
  const backLink = document.querySelector("#back-link");
  const doctorLine = document.querySelector("#doctor-name");
  const selectedSlotEl = document.querySelector("#selected-slot");
  const slotsList = document.querySelector("#slots-list");
  const form = document.querySelector(".booking-form");
  const message = document.querySelector("#booking-message");
  const clearSlotBtn = document.querySelector("#clear-slot-btn");

  let doctor = null;
  let doctorName = "Unknown Doctor";
  let selectedSlot = null;
  let bookedSlots = [];

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

  function clearMessage() {
    if (!message) return;

    message.textContent = "";
    message.classList.remove("msg-error", "msg-success");
  }

  function syncSlotToUrl(slot) {
    const urlParams = new URLSearchParams(window.location.search);

    if (slot) {
      urlParams.set("slot", slot);
    } else {
      urlParams.delete("slot");
    }

    const query = urlParams.toString();

    window.history.replaceState(
      {},
      "",
      window.location.pathname + (query ? "?" + query : "")
    );
  }

  function updateSlotButtons() {
    const buttons = document.querySelectorAll("#slots-list button");

    for (const button of buttons) {
      const buttonSlot = button.dataset.slot;

      button.classList.toggle(
        "slot-selected",
        buttonSlot === selectedSlot
      );
    }
  }

  function setSelectedSlot(slot) {
    selectedSlot = slot || null;

    if (selectedSlotEl) {
      selectedSlotEl.textContent =
        "Selected slot: " + (selectedSlot || "none");
    }

    if (confirmBtn) {
      confirmBtn.disabled = !selectedSlot;
    }

    if (clearSlotBtn) {
      clearSlotBtn.disabled = !selectedSlot;
    }

    updateSlotButtons();
  }

  function updateBackLink() {
    if (!backLink) return;

    if (doctorId) {
      backLink.href =
        "doctor.html?id=" + encodeURIComponent(doctorId);

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

  function selectSlot(slot) {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
      syncSlotToUrl(null);
    } else {
      setSelectedSlot(slot);
      syncSlotToUrl(slot);
    }

    clearMessage();
  }

  function renderSlots() {
    if (!slotsList) return;

    slotsList.innerHTML = "";

    if (
      !doctor ||
      !Array.isArray(doctor.slots) ||
      doctor.slots.length === 0
    ) {
      slotsList.innerHTML =
        "<p class='muted'>No slots available.</p>";
      return;
    }

    for (const slot of doctor.slots) {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = slot;
      button.dataset.slot = slot;
      button.classList.add("slot-btn");

      if (bookedSlots.includes(slot)) {
        button.disabled = true;
        button.classList.add("slot-booked");
      }

      button.addEventListener("click", function () {
        if (button.disabled) return;
        selectSlot(slot);
      });

      slotsList.appendChild(button);
    }

    updateSlotButtons();
  }

  function restoreSelectedSlotFromUrl() {
    const slotFromUrl = new URLSearchParams(
      window.location.search
    ).get("slot");

    const slotExists =
      doctor &&
      Array.isArray(doctor.slots) &&
      doctor.slots.includes(slotFromUrl);

    const slotIsBooked = bookedSlots.includes(slotFromUrl);

    if (slotFromUrl && slotExists && !slotIsBooked) {
      setSelectedSlot(slotFromUrl);
    } else {
      setSelectedSlot(null);
      syncSlotToUrl(null);
    }
  }

  async function loadPageData() {
    if (!doctorId) {
      showError("Doctor ID is missing.");
      renderSlots();
      return;
    }

    try {
      const doctorResponse = await fetch(
        API_BASE +
          "/api/doctors/" +
          encodeURIComponent(doctorId)
      );

      if (!doctorResponse.ok) {
        throw new Error("Doctor not found");
      }

      doctor = await doctorResponse.json();
      doctorName = doctor.name;

      localStorage.setItem("lastDoctorId", doctor.id);

      const bookingsResponse = await fetch(
        API_BASE + "/api/bookings"
      );

      if (!bookingsResponse.ok) {
        throw new Error("Could not load bookings");
      }

      const bookings = await bookingsResponse.json();

      bookedSlots = bookings
        .filter(function (booking) {
          return booking.doctorId === doctorId;
        })
        .map(function (booking) {
          return booking.slot;
        });

      setDoctorLine();
      renderSlots();
      restoreSelectedSlotFromUrl();
    } catch (error) {
      doctor = null;
      doctorName = "Unknown Doctor";

      setDoctorLine();
      renderSlots();

      showError(
        "Could not load slots. Make sure the backend is running."
      );
    }
  }

  updateBackLink();
  setDoctorLine();
  setSelectedSlot(null);

  if (clearSlotBtn) {
    clearSlotBtn.addEventListener("click", function () {
      setSelectedSlot(null);
      syncSlotToUrl(null);
      clearMessage();
    });
  }

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      clearMessage();

      if (!selectedSlot) {
        showError("Please select a slot first.");
        return;
      }

      const nameInput = document.querySelector("#fullName");
      const phoneInput = document.querySelector("#phone");

      const patientName = nameInput
        ? nameInput.value.trim()
        : "";

      const phone = phoneInput
        ? phoneInput.value.trim()
        : "";

      if (!patientName) {
        showError("Please enter your full name.");
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        showError("Phone must be exactly 10 digits.");
        return;
      }

      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Booking...";
      }

      try {
        const response = await fetch(
          API_BASE + "/api/bookings",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              doctorId: doctorId,
              slot: selectedSlot,
              patientName: patientName,
              phone: phone,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            bookedSlots.push(selectedSlot);

            setSelectedSlot(null);
            syncSlotToUrl(null);
            renderSlots();
          }

          throw new Error(
            result.error || "Could not create booking"
          );
        }

        showSuccess(
          "Booking confirmed with " +
            doctorName +
            " at " +
            result.slot +
            "."
        );

        form.reset();

        setTimeout(function () {
          window.location.href = "bookings.html";
        }, 900);
      } catch (error) {
        showError(error.message);

        if (confirmBtn) {
          confirmBtn.disabled = !selectedSlot;
        }
      } finally {
        if (confirmBtn) {
          confirmBtn.textContent = "Confirm Booking";
        }
      }
    });
  }

  loadPageData();
});