// Data
let doctors = [];
let appointments = JSON.parse(localStorage.getItem('myhealth_appts')) || [];
let selectedDoctor = null;

// Toast helper
function toast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => t.classList.add('translate-y-20', 'opacity-0'), 2500);
}

// Save appointments to localStorage
function save() {
    localStorage.setItem('myhealth_appts', JSON.stringify(appointments));
}

// Fetch doctors from db.json (API)
async function fetchDoctors() {
    try {
        const res = await fetch('http://localhost:3000/doctors');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        doctors = await res.json();
        renderDoctorGrid();
        liveSearch();
        toast('Doctors loaded successfully');
    } catch (err) {
        console.error(err);
        toast('⚠️ Could not load doctors. Is json-server running on port 3000?');
        doctors = [];
        renderDoctorGrid();
        document.getElementById('liveResults').innerHTML = '<p class="text-red-500 text-center py-2">API error: unable to fetch doctors</p>';
    }
}

// Tab switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('nav-active', 'text-slate-900');
        btn.classList.add('text-slate-500');
    });
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('nav-active', 'text-slate-900');
    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'history') renderHistory();
    if (tabId === 'book') renderDoctorGrid();
}

// Render doctor grid (Book tab)
function renderDoctorGrid() {
    const grid = document.getElementById('doctorGrid');
    if (!grid) return;
    const query = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const filtered = doctors.filter(d => d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query));
    if (!filtered.length) {
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-slate-500">No doctors match</div>';
        return;
    }
    grid.innerHTML = filtered.map(doc => `
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <img src="${doc.img}" class="w-20 h-20 rounded-2xl mx-auto mb-3 object-cover">
            <h4 class="font-bold text-slate-800">${doc.name}</h4>
            <p class="text-sky-500 text-sm mb-3 font-semibold">${doc.specialty}</p>
            <button data-doctor-id="${doc.id}" class="book-btn w-full py-2 bg-slate-800 text-white rounded-xl text-sm hover:bg-slate-900 transition">Book</button>
        </div>
    `).join('');

    // Attach event listeners to all Book buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.doctorId);
            selectDoctor(id);
        });
    });
}

// Select doctor and show booking form
function selectDoctor(id) {
    selectedDoctor = doctors.find(d => d.id === id);
    if (!selectedDoctor) return;
    document.getElementById('selectedDoctorName').innerText = selectedDoctor.name;
    document.getElementById('bookingForm').classList.remove('hidden');
    document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelBooking() {
    selectedDoctor = null;
    document.getElementById('bookingForm').classList.add('hidden');
    document.getElementById('apptForm').reset();
}

// Book appointment (form submit)
function bookAppointment(e) {
    e.preventDefault();
    if (!selectedDoctor) { toast("Select a doctor first"); return; }
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;
    const reason = document.getElementById('apptReason').value;
    if (!date || !time) { toast("Fill date & time"); return; }
    appointments.push({
        id: Date.now(),
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date, time, reason: reason || "General checkup",
        status: 'upcoming'
    });
    save();
    toast(`Booked with ${selectedDoctor.name}`);
    cancelBooking();
    switchTab('dashboard');
}

// Dashboard: upcoming appointments & stats
function renderDashboard() {
    const upcoming = appointments.filter(a => a.status === 'upcoming').sort((a,b) => new Date(a.date) - new Date(b.date));
    document.getElementById('nextAppt').innerText = upcoming[0] ? `${upcoming[0].date} ${upcoming[0].time}` : "None";
    document.getElementById('completedCount').innerText = appointments.filter(a => a.status === 'completed').length;
    const container = document.getElementById('upcomingList');
    if (!upcoming.length) {
        container.innerHTML = '<p class="text-slate-400 italic text-center py-6">No upcoming appointments</p>';
        return;
    }
    container.innerHTML = upcoming.map(a => `
        <div class="flex justify-between items-center p-4 bg-white/50 rounded-2xl shadow-sm">
            <div><p class="font-bold text-slate-800">${a.doctor}</p><p class="text-sm text-slate-500">${a.date} at ${a.time}</p></div>
            <div class="flex gap-2">
                <button data-id="${a.id}" class="done-btn px-3 py-1 bg-emerald-100 text-emerald-700 rounded-xl text-xs hover:bg-emerald-200 transition">Done</button>
                <button data-id="${a.id}" class="cancel-appt-btn px-3 py-1 text-rose-500 text-xs hover:bg-rose-50 rounded-xl transition">Cancel</button>
            </div>
        </div>
    `).join('');

    // Attach event listeners for Done and Cancel buttons
    document.querySelectorAll('.done-btn').forEach(btn => {
        btn.addEventListener('click', () => completeAppt(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.cancel-appt-btn').forEach(btn => {
        btn.addEventListener('click', () => cancelAppt(parseInt(btn.dataset.id)));
    });
}

function completeAppt(id) {
    const appt = appointments.find(a => a.id === id);
    if (appt) appt.status = 'completed';
    save();
    renderDashboard();
    toast("Marked as completed");
}

function cancelAppt(id) {
    appointments = appointments.filter(a => a.id !== id);
    save();
    renderDashboard();
    toast("Appointment cancelled");
}

// History tab
function renderHistory() {
    const completed = appointments.filter(a => a.status === 'completed');
    const container = document.getElementById('historyList');
    if (!completed.length) {
        container.innerHTML = '<p class="text-slate-400 italic text-center py-6">No past visits</p>';
        return;
    }
    container.innerHTML = completed.map(a => `
        <div class="p-4 bg-white/50 rounded-2xl shadow-sm">
            <p class="font-bold text-slate-800">${a.doctor}</p>
            <p class="text-sm text-slate-500">${a.date} • ${a.specialty}</p>
            <p class="text-sm italic text-slate-600 mt-1">Reason: ${a.reason}</p>
        </div>
    `).join('');
}

// Live search on Home tab
function liveSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('liveResults');
    if (!query.trim()) { resultsDiv.innerHTML = ''; return; }
    const matches = doctors.filter(d => d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query));
    if (!matches.length) {
        resultsDiv.innerHTML = '<p class="text-slate-500 text-center py-2">No matching doctors</p>';
        return;
    }
    resultsDiv.innerHTML = matches.map(d => `
        <div class="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
            <div><span class="font-semibold text-slate-800">${d.name}</span><span class="text-xs text-sky-500 ml-2">${d.specialty}</span></div>
            <button data-doctor-id="${d.id}" class="quick-book-btn px-4 py-1 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition">Book</button>
        </div>
    `).join('');

    // Attach event listeners to quick book buttons
    document.querySelectorAll('.quick-book-btn').forEach(btn => {
        btn.addEventListener('click', () => quickBook(parseInt(btn.dataset.doctorId)));
    });
}

function quickBook(docId) {
    const doc = doctors.find(d => d.id === docId);
    if (!doc) return;
    selectedDoctor = doc;
    switchTab('book');
    setTimeout(() => {
        document.getElementById('selectedDoctorName').innerText = selectedDoctor.name;
        document.getElementById('bookingForm').classList.remove('hidden');
        document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
    }, 50);
    toast(`Selected ${doc.name}, complete the form`);
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });
    document.getElementById('gotoBookBtn')?.addEventListener('click', () => switchTab('book'));
    document.getElementById('cancelFormBtn')?.addEventListener('click', cancelBooking);
    document.getElementById('apptForm')?.addEventListener('submit', bookAppointment);
    document.getElementById('searchInput')?.addEventListener('input', liveSearch);

    await fetchDoctors();
    renderDashboard();
    renderHistory();
});