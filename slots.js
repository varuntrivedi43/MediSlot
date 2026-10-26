document.addEventListener("DOMContentLoaded", function() {

    const confirmBtn = document.querySelector("#confirm-booking");
    confirmBtn.disabled = true;
    const params = new URLSearchParams(window.location.search);
    const doctor = params.get("doctor");

    const doctorLine = document.querySelector("#doctor-name");
    doctorLine.textContent = "Doctor: " + (doctor || "Unknown");

    const output = document.querySelector("#selected-slot");
    const buttons = document.querySelectorAll(".slots button");
    const slot = params.get("slot");
    let selectedBtn = null;

    if (slot) {
        output.textContent = "Selected slot: " + slot;
        confirmBtn.disabled = false;
    }

    if (slot) {
        for (const btn of buttons) {
            if (btn.textContent === slot) {
                btn.classList.add("slot-selected");
                selectedBtn = btn;
                break;
            }
        }
    }

    for (const btn of buttons) {
        btn.addEventListener("click", function() {
            output.textContent = "Selected slot: " + btn.textContent;
            confirmBtn.disabled = false;
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

    const form = document.querySelector(".booking-form");
    const message = document.querySelector("#booking-message");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.querySelector("#fullName").value;
        const phone = document.querySelector("#phone").value;

        message.classList.remove("msg-error", "msg-success");

        const cleanPhone = phone.trim();

        if (cleanPhone.length !== 10) {
            message.classList.add("msg-error");
            message.textContent = "Phone must be exactly 10 digits.";
            return;
        }

        message.classList.add("msg-success");
        message.textContent = "Booking request for " + name + " (" + cleanPhone + ") received."; 
    });

});