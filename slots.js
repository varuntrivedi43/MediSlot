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

    const form = document.querySelector(".booking-form");
    const message = document.querySelector("#booking-message");

    for (const btn of buttons) {
        btn.addEventListener("click", function() {
            output.textContent = "Selected slot: " + btn.textContent;
            confirmBtn.disabled = false;
            message.textContent = "";
            message.classList.remove("msg-error", "msg-success");
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

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        message.classList.remove("msg-error", "msg-success");

        const currentSlot = new URLSearchParams(window.location.search).get("slot");

        if (!currentSlot) {
            message.classList.add("msg-error");
            message.textContent = "Please select a slot first.";
            return;
        }

        const name = document.querySelector("#fullName").value;
        const phone = document.querySelector("#phone").value;
        const cleanPhone = phone.trim();

        if (cleanPhone.length !== 10) {
            message.classList.add("msg-error");
            message.textContent = "Phone must be exactly 10 digits.";
            return;
        }

        message.classList.add("msg-success");
        message.textContent = "Booking request for " + name + " (" + cleanPhone + ") at " + currentSlot + " received.";
        form.reset();
    });

});