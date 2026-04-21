 MyHealth – Patient Portal SPA

A clean, single‑page application (SPA) for managing doctor appointments.  
Live search on the "home" tab, "book appointments" with date/time, track upcoming visits, and view "history" – all with **pure JavaScript**, Tailwind CSS**, and a **fetch‑based REST API** (powered by `json-server`). No inline `onclick` – everything uses event listeners.



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
JavaScript (used external javascript)
 JSON Server (mock REST API for doctors)



 Project Structure
 myhealth-app/
index.html # Main HTML (structure & Tailwind)
script.js # All application logic (fetch, event listeners, localStorage)
db.json # Doctor data (API source, only needed if you run json-server)
README.md # This file

-
 Getting Started

1. Clone or create the project folder

Place the three files (`index.html`, `script.js`, `db.json`) in the same folder.

  JSON Server

 to used the live API (recommended for the fetch experience)

```bash
npm install -g json-server
Start the API server
From your project folder, run:

bash
json-server --watch db.json --port 3000
You will see:

text
Resources
  http://localhost:3000/doctors
4. Serve the frontend
Because the app uses fetch, you must serve index.html through a local web server – not directly via file://.

Recommended options:

VS Code Live Server – right‑click index.html → "Open with Live Server"

. Open the app
Visit the local address 
Doctors will load from the API .

   How to Use
🔍 Search & Book (Home tab)
Type a doctor’s name or specialty into the search bar.

Live results appear below.

Click Book next to a doctor – you’ll be taken to the Book tab with that doctor preselected.

 Book from the “All Specialists” tab
Go to the Book tab.

Click Book on any doctor card.

Fill in date, time, and optional reason.

Click Confirm – the appointment is saved and appears on the Home tab.

      Home Dashboard
Top card shows your next upcoming appointment.

Below, a list of all upcoming appointments.

For each appointment:

✅ Done – moves it to the History tab.

❌ Cancel – deletes it permanently.
History Tab
Shows all completed consultations with doctor name, date, specialty, and reason.

Troubleshooting
Problem	Solution
“Could not load doctors from API” alert	Either start json-server on port 3000, or the app will automatically use fallback data.
Fetch error in console	Serve index.html via a web server (Live Server, serve, etc.) – not with file://.
Book buttons don’t work	Check the browser console. The app uses addEventListener; refresh if needed.
Appointments disappear after refresh	They are stored in localStorage. Clearing browser data will remove them.
API not working but fallback works	That’s fine – the app is designed to keep working. To test the fetch, run json-server.
 License
Free to use for educational and portfolio projects.

🙌 Acknowledgements
Doctor images from Unsplash

Tailwind CSS for rapid styling

JSON Server for the mock API



