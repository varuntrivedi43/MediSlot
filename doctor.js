const params = new URLSearchParams(window.location.search);
const name = params.get("name");

const doctors = {
    "Dr. Asha Sharma": { specialty: "Cardiologist", exp: 12},
    "Dr. Rohit Verma": { specialty: "Dermatologist", exp: 8},
    "Dr. Neha Singh": { specialty: "Pediatrician", exp: 6}
};

const info = doctors[name];

const nameLine = document.querySelector("#doctor-detail-name");
const specLine = document.querySelector("#doctor-detail-specialty");
const expLine = document.querySelector("#doctor-detail-exp");

nameLine.textContent = "Name: " + (name || "Unknown");

if (info) {
    specLine.textContent = "Specialty: " + info.specialty;
    expLine.textContent = "Experience: " + info.exp + " years";
} 

else {
    specLine.textContent = "Specialty: Unknown";
    expLine.textContent = "Experience: Unknown";
}

const viewSlotsBtn = document.querySelector("#view-slots-btn");

viewSlotsBtn.addEventListener("click", function() {
    const url = "slots.html?doctor=" + encodeURIComponent(name);
    window.location.href = url;
});