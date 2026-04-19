
// Data
let doctors = [];
let appointments = JSON.parse(localStorage.getItem('myhealth_appts')) || [];
let selectedDoctor = null;

// Helper
function showMessage(msg) { alert(msg); }
function save() { localStorage.setItem('myhealth_appts', JSON.stringify(appointments)); }

// Fetch doctors from API (json-server)
async function fetchDoctors() {
    try {
        const response = await fetch('http://localhost:3000/doctors');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        doctors = await response.json();
        console.log('Doctors loaded from API:', doctors);
        renderDoctorGrid();
        liveSearch();
    } catch (error) {
        console.error('Fetch error:', error);
        doctors = [
            { id: 1, name: "Dr. Mercy Nzau", specialty: "Diabetes Specialist", img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&h=200" },
            { id: 2, name: "Dr. Albert Byrone", specialty: "Haematologist", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&h=200" },
            { id: 3, name: "Dr. Maureen Ngugi", specialty: "Urologist", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&h=200" },
            { id: 4, name: "Dr. Timothy Miriti", specialty: "Neurologist", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&h=200" }
        ];
        renderDoctorGrid();
        liveSearch();
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
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('nav-active', 'text-slate-900');
    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'history') renderHistory();
    if (tabId === 'book') renderDoctorGrid();
}

// Render doctor grid (buttons use event listeners, no inline onclick)
function renderDoctorGrid() {
    const grid = document.getElementById('doctorGrid');
    const query = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filtered = doctors.filter(d => d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query));
    if (!filtered.length) {
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-slate-500">No doctors match</div>';
        return;
    }
    grid.innerHTML = filtered.map(doc => `
        <div class="glass p-5 rounded-2xl text-center">
            <img src="${doc.img}" class="w-20 h-20 rounded-2xl mx-auto mb-3 object-cover">
            <h4 class="font-bold">${doc.name}</h4>
            <p class="text-sky-500 text-sm mb-3">${doc.specialty}</p>
            <button data-id="${doc.id}" class="book-btn w-full py-2 bg-slate-900 text-white rounded-xl text-sm">Book</button>
        </div>
    `).join('');

    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.removeEventListener('click', handleBookClick);
        btn.addEventListener('click', handleBookClick);
    });
}

function handleBookClick(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    selectDoctor(id);
}

function selectDoctor(id) {
    selectedDoctor = doctors.find(d => d.id === id);
    if (!selectedDoctor) { showMessage("Doctor not found"); return; }
    document.getElementById('selectedDoctorName').innerText = selectedDoctor.name;
    document.getElementById('bookingForm').classList.remove('hidden');
    document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelBooking() {
    selectedDoctor = null;
    document.getElementById('bookingForm').classList.add('hidden');
    document.getElementById('apptForm').reset();
}

function bookAppointment(e) {
    e.preventDefault();
    if (!selectedDoctor) { showMessage("Select a doctor first"); return; }
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;
    const reason = document.getElementById('apptReason').value;
    if (!date || !time) { showMessage("Fill date & time"); return; }
    appointments.push({
        id: Date.now(),
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date, time, reason: reason || "General checkup",
        status: 'upcoming'
    });
    save();
    showMessage(`Booked with ${selectedDoctor.name}`);
    cancelBooking();
    switchTab('dashboard');
}

// Dashboard – buttons use event listeners
function renderDashboard() {
    const upcoming = appointments.filter(a => a.status === 'upcoming').sort((a,b) => new Date(a.date) - new Date(b.date));
    const container = document.getElementById('upcomingList');
    if (!upcoming.length) {
        container.innerHTML = '<p class="text-slate-400 italic text-center py-6">No upcoming appointments</p>';
        return;
    }
    container.innerHTML = upcoming.map(a => `
        <div class="flex justify-between items-center p-4 bg-white/50 rounded-2xl">
            <div><p class="font-bold">${a.doctor}</p><p class="text-sm text-slate-500">${a.date} at ${a.time}</p></div>
            <div class="flex gap-2">
                <button data-id="${a.id}" class="done-btn px-3 py-1 bg-emerald-100 text-emerald-700 rounded-xl text-xs">Done</button>
                <button data-id="${a.id}" class="cancel-appt-btn px-3 py-1 text-rose-500 text-xs">Cancel</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.done-btn').forEach(btn => {
        btn.removeEventListener('click', handleDoneClick);
        btn.addEventListener('click', handleDoneClick);
    });
    document.querySelectorAll('.cancel-appt-btn').forEach(btn => {
        btn.removeEventListener('click', handleCancelApptClick);
        btn.addEventListener('click', handleCancelApptClick);
    });
}

function handleDoneClick(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    completeAppt(id);
}
function handleCancelApptClick(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    cancelAppt(id);
}

function completeAppt(id) {
    const appt = appointments.find(a => a.id === id);
    if (appt) appt.status = 'completed';
    save();
    renderDashboard();
    showMessage("Marked as completed");
}

function cancelAppt(id) {
    appointments = appointments.filter(a => a.id !== id);
    save();
    renderDashboard();
    showMessage("Appointment cancelled");
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
        <div class="p-4 bg-white/50 rounded-2xl">
            <p class="font-bold">${a.doctor}</p>
            <p class="text-sm">${a.date} • ${a.specialty}</p>
            <p class="text-sm italic mt-1">Reason: ${a.reason}</p>
        </div>
    `).join('');
}

// Live search on home tab
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
        <div class="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
            <div><span class="font-semibold">${d.name}</span><span class="text-xs text-sky-500 ml-2">${d.specialty}</span></div>
            <button data-id="${d.id}" class="quick-book-btn px-4 py-1 bg-sky-500 text-white rounded-lg text-sm">Book</button>
        </div>
    `).join('');

    document.querySelectorAll('.quick-book-btn').forEach(btn => {
        btn.removeEventListener('click', handleQuickBook);
        btn.addEventListener('click', handleQuickBook);
    });
}

function handleQuickBook(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    quickBook(id);
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
    showMessage(`Selected ${doc.name}, complete the form`);
}

// Event listeners and init
document.addEventListener('DOMContentLoaded', async () => {
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