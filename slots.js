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