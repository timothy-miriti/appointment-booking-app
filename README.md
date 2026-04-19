 MyHealth – Patient Portal SPA

A clean, single‑page application (SPA) for managing doctor appointments.  
Live search** on the home tab, **book appointments** with date/time, track **upcoming visits**, and view **history** – all with **pure JavaScript**, Tailwind CSS**, and a **fetch‑based REST API** (powered by `json-server`). No inline `onclick` – everything uses event listeners.



 Features

Live doctor search** – results update as you type (by name or specialty).
Book appointments** – pick a doctor, date, time, and reason.
Dashboard** – shows next appointment + list of all upcoming visits.
Mark as completed** – moves appointments to the History tab.
Cancel appointments** – removes them permanently.
History tab** – lists all past consultations.
LocalStorage persistence** – appointments survive page refresh.
Glass‑morphism UI** – fully styled with Tailwind CSS (no custom CSS file).
Fetch API** – loads doctors from a local `db.json` file (fallback to hardcoded data if API fails).
Clean JavaScript** – no inline `onclick`, all event listeners are attached dynamically.

-

Tech Stack

 HTML5 + Tailwind CSS (CDN)
JavaScript (ES6+, external file)
 JSON Server (mock REST API for doctors)



 Project Structure
