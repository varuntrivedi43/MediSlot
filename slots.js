const output = document.querySelector("#selected-slot");
const buttons = document.querySelectorAll(".slots button");

for (const btn of buttons) {
    btn.addEventListener("click", function() {
        output.textContent = "Selected slot: " + btn.textContent;
    });
}