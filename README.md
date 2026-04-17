
# 🩺 MyHealth – Patient Portal SPA

A clean, single‑page application for managing doctor appointments.  
**Live search** on the home tab, **book appointments** with date/time, track **upcoming visits**, and view **history** – all powered by a local REST API (`json-server`) and persistent `localStorage`.

---

## ✨ Features

- 🔍 **Live doctor search** (by name or specialty) – results update as you type.
- 📅 **Book appointments** – pick a doctor, date, time, and reason.
- 🏠 **Dashboard** – shows next appointment + list of all upcoming visits.
- ✅ **Mark as done** – moves completed appointments to the History tab.
- 🗑️ **Cancel appointments** – removes them entirely.
- 📜 **History tab** – lists all past consultations.
-  **LocalStorage persistence** – appointments survive page reloads.
- **Glass‑morphism UI** – fully styled with Tailwind CSS (no custom CSS file).
-  **REST API integration** – doctors loaded from `db.json` using `fetch`.

---

## 🛠️ Tech Stack

- HTML5 + Tailwind CSS (CDN)
- Vanilla JavaScript (ES6+, external file)
- JSON Server (fake REST API)

---

## 📁 Project Structure
