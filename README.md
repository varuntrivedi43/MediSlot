# 🩺 MediSlot

**A doctor appointment booking app where you pick a doctor, choose a free time slot, and book in a few clicks.**

I built MediSlot to practice how a real booking flow works end to end: listing doctors, showing only the slots that are still free, validating the patient's details, and letting the user manage their bookings afterwards. It is built with plain HTML, CSS and JavaScript, with no frameworks, so every piece of logic is written by hand.

---

## At a glance

| | |
| --- | --- |
| **What it does** | Browse doctors, view details, book a slot, view and cancel bookings |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6) |
| **Data storage (frontend)** | Browser `localStorage` |
| **Backend** | Node.js project in the `server/` folder |
| **Pages** | Home, Doctor details, Slots and booking, My Bookings |

---

## What you can do in the app

1. **Browse doctors.** The home page shows each doctor's name, specialty and experience. If a profile picture doesn't load, their initials are shown instead.
2. **Open a doctor's profile** to see their details.
3. **Pick a time slot.** Slots that are already booked are greyed out and can't be clicked, so double booking is not possible.
4. **Fill in the patient details.** The app checks that a slot is selected and that the phone number is exactly 10 digits before accepting the booking.
5. **See all your bookings** on a separate page, cancel any of them, or clear everything at once (it asks for confirmation first).

### Small details I paid attention to

- The selected slot is saved in the page URL (for example `slots.html?id=d1&slot=10:00 AM`), so refreshing the page doesn't lose the selection.
- The Confirm button stays disabled until a slot is chosen.
- The navbar "Slots" link remembers the last doctor you viewed and takes you straight back to them.
- When there are no bookings, the page shows a friendly empty-state message instead of a blank screen.

---

## What this project shows about my skills

- Manipulating the DOM and building UI dynamically with JavaScript
- Passing data between pages using URL query parameters
- Saving, reading, updating and deleting data with `localStorage` (a full CRUD-style flow for bookings)
- Form validation with clear success and error messages
- Preventing conflicts (the same doctor and slot can't be booked twice)
- Structuring a project into separate pages and scripts, one per responsibility

---

## Project structure

```
MediSlot/
├── assets/          Images (avatar, empty-state illustration)
├── server/          Node.js part of the project (has its own package.json)
├── index.html       Home page, list of doctors
├── index.js         Builds the doctor cards
├── doctor.html      Doctor details page
├── doctor.js        Loads the selected doctor's details
├── slots.html       Slot selection and booking form
├── slots.js         Slot logic, validation, saving the booking
├── bookings.html    My Bookings page
├── bookings.js      Shows, cancels and clears bookings
├── app.js           Shared navigation behaviour
├── data.js          Doctors list (name, specialty, experience, slots)
└── style.css        Styling for all pages
```

---

## How the booking flow works

1. `data.js` holds the doctors as a JavaScript array.
2. `index.js` reads that array and draws the doctor cards.
3. Clicking a doctor opens a page like `doctor.html?id=d1`. The page reads the `id` from the URL and finds the matching doctor.
4. On the slots page, the app reads existing bookings from `localStorage` and disables the slots that are already taken.
5. When the form is submitted and passes validation, the booking is saved and the user is taken to the My Bookings page.

Each booking is saved like this:

```js
{
  id: "1730000000000",
  doctorId: "d1",
  doctorName: "Dr. Asha Sharma",
  slot: "10:00 AM",
  patientName: "Patient name",
  phone: "9876543210",
  createdAt: "2026-10-30T10:00:00.000Z"
}
```

---

## Run it on your computer

The frontend needs no installation.

```bash
git clone https://github.com/varuntrivedi43/MediSlot.git
```

Then open the folder and double-click `index.html` to open it in your browser. That's it.

---

## Add or change a doctor

Open `data.js` and add another object to the `doctors` list:

```js
{
  id: "d4",
  name: "Dr. Example Name",
  specialty: "Dermatologist",
  experience: 10,
  slots: ["10:00 AM", "11:30 AM", "02:00 PM"]
}
```

The new doctor shows up on the home page automatically.

---

## What I plan to improve

- Connect the frontend fully with the Node.js server so bookings are stored on a server instead of only in the browser
- Add user login
- Add a way to book for a specific date, not just a time

---

## About me

I'm **Varun Trivedi**, a software developer in the making, building projects to strengthen my fundamentals.

GitHub: [@varuntrivedi43](https://github.com/varuntrivedi43)
