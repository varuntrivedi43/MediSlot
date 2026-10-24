const buttons = document.querySelectorAll(".view-slots");

for (const btn of buttons) {
    btn.addEventListener("click", function() {
        const doctorName = btn.dataset.doctor;
        const url = "slots.html?doctor=" + encodeURIComponent(doctorName);
        window.location.href = url; 
    });
}