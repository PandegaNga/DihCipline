// ==========================================
// 0. RETRO 8-BIT AUDIO SYNTHESIZER (NO EXTERNAL FILES)
// ==========================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playCheckSound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
}

function playStartSound() {
    initAudio();
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.07 + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.07);
        osc.stop(audioCtx.currentTime + i * 0.07 + 0.1);
    });
}

function playLevelUpSound() {
    initAudio();
    const melody = [523.25, 659.25, 783.99, 1046.50];
    melody.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.25);
    });
}

function playMoneySound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1600, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

function playDeleteSound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

// ==========================================
// 1. STATE & HABIT LIST (12 HABITS)
// ==========================================
const habitList = [
    { id: 'h1', title: 'Bangun Jam 05.00 ⏰' },
    { id: 'h2', title: 'Belajar / Deep Work 1 Jam 📚' },
    { id: 'h3', title: 'Minum Air 2 Liter 💧' },
    { id: 'h4', title: 'Olahraga / Workout 20m 🏃' },
    { id: 'h5', title: 'Membaca Buku 15 Menit 📖' },
    { id: 'h6', title: 'No Medsos / Game Berlebih 📵' },
    { id: 'h7', title: 'Makan Makanan Sehat / Sayur 🥗' },
    { id: 'h8', title: 'Meditasi / Jurnal Syukur 🧘' },
    { id: 'h9', title: 'Rapikan Meja & Kamar 🧹' },
    { id: 'h10', title: 'Koding / Belajar Skill Baru 💻' },
    { id: 'h11', title: 'Catat Arus Kas Harian 💵' },
    { id: 'h12', title: 'Tidur Sblm Jam 22.00 🌙' }
];

const now = new Date();
let currentMonth = now.getMonth();
let currentYear = now.getFullYear();

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

let totalDaysInMonth = getDaysInMonth(currentYear, currentMonth);
let dailyPercentages = Array(totalDaysInMonth).fill(0);
let sleepData = Array(totalDaysInMonth).fill(7);
let previousRank = '';

let transactions = [
    { id: 1, date: `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-01`, desc: 'Uang Saku Bulanan', type: 'income', amount: 300000 },
    { id: 2, date: `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-02`, desc: 'Buku & Catatan Belajar', type: 'expense', amount: 45000 }
];

let geminiKey = localStorage.getItem('dihcipline_gemini_key') || '';

// ==========================================
// 2. CHART INITIALIZATIONS
// ==========================================
const ctxProgress = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctxProgress, {
    type: 'line',
    data: {
        labels: Array.from({ length: totalDaysInMonth }, (_, i) => `Tgl ${i + 1}`),
        datasets: [{
            label: 'Konsistensi (%)',
            data: dailyPercentages,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 100, ticks: { stepSize: 25 } } }
    }
});

const ctxSleep = document.getElementById('sleepChart').getContext('2d');
const sleepChart = new Chart(ctxSleep, {
    type: 'bar',
    data: {
        labels: Array.from({ length: totalDaysInMonth }, (_, i) => `${i + 1}`),
        datasets: [{
            label: 'Jam Tidur',
            data: sleepData,
            backgroundColor: '#6366f1',
            borderRadius: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 12 } },
        plugins: { legend: { display: false } }
    }
});

const ctxMoney = document.getElementById('moneyChart').getContext('2d');
const moneyChart = new Chart(ctxMoney, {
    type: 'doughnut',
    data: {
        labels: ['Sisa Saldo', 'Pengeluaran'],
        datasets: [{
            data: [1, 0],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
    }
});

// ==========================================
// 3. MATRIX BULANAN OTOMATIS
// ==========================================
const matrixHead = document.getElementById('matrixHead');
const matrixBody = document.getElementById('matrixBody');
const matrixFoot = document.getElementById('matrixFoot');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const matrixTitle = document.getElementById('matrixTitle');

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function populateMonthYearPickers() {
    monthSelect.innerHTML = '';
    monthNames.forEach((m, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.innerText = m;
        if (idx === currentMonth) opt.selected = true;
        monthSelect.appendChild(opt);
    });

    yearSelect.innerHTML = '';
    for (let y = currentYear - 1; y <= currentYear + 2; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.innerText = y;
        if (y === currentYear) opt.selected = true;
        yearSelect.appendChild(opt);
    }
}

function buildMonthlyMatrix() {
    totalDaysInMonth = getDaysInMonth(currentYear, currentMonth);
    matrixTitle.innerText = `🗓️ Habit Matrix (${monthNames[currentMonth]} ${currentYear} - ${totalDaysInMonth} Hari)`;

    let headHtml = `<tr><th class="habit-title">Habit List (${habitList.length})</th>`;
    for (let d = 1; d <= totalDaysInMonth; d++) {
        headHtml += `<th>${d}</th>`;
    }
    headHtml += `</tr>`;
    matrixHead.innerHTML = headHtml;

    let bodyHtml = '';
    habitList.forEach((habit, hIdx) => {
        bodyHtml += `<tr><td class="habit-title">${habit.title}</td>`;
        for (let d = 0; d < totalDaysInMonth; d++) {
            bodyHtml += `<td><input type="checkbox" class="cb" data-habit="${hIdx}" data-day="${d}"></td>`;
        }
        bodyHtml += `</tr>`;
    });
    matrixBody.innerHTML = bodyHtml;

    let footHtml = `<tr><th class="habit-title">Progres</th>`;
    for (let d = 0; d < totalDaysInMonth; d++) {
        footHtml += `<td id="pct-${d}">0%</td>`;
    }
    footHtml += `</tr>`;
    matrixFoot.innerHTML = footHtml;

    dailyPercentages = Array(totalDaysInMonth).fill(0);
    progressChart.data.labels = Array.from({ length: totalDaysInMonth }, (_, i) => `Tgl ${i + 1}`);
    progressChart.data.datasets[0].data = dailyPercentages;
    progressChart.update();

    sleepData = Array(totalDaysInMonth).fill(7);
    sleepChart.data.labels = Array.from({ length: totalDaysInMonth }, (_, i) => `${i + 1}`);
    sleepChart.data.datasets[0].data = sleepData;
    sleepChart.update();

    document.querySelectorAll('.cb').forEach(cb => {
        cb.addEventListener('change', () => {
            if (cb.checked) playCheckSound();
            updateDashboard();
            saveHabits();
        });
    });

    loadHabits();
}

monthSelect.addEventListener('change', () => {
    currentMonth = parseInt(monthSelect.value, 10);
    buildMonthlyMatrix();
});

yearSelect.addEventListener('change', () => {
    currentYear = parseInt(yearSelect.value, 10);
    buildMonthlyMatrix();
});

// ==========================================
// 4. LEVELING, EXP & UPDATE
// ==========================================
const expVal = document.getElementById('expVal');
const avatarImg = document.getElementById('avatarImg');
const playerRank = document.getElementById('playerRank');
const questCheckboxes = document.querySelectorAll('.quest-cb');

function updateDashboard() {
    const totalHabitsCount = habitList.length;

    for (let day = 0; day < totalDaysInMonth; day++) {
        const checkedInDay = document.querySelectorAll(`.cb[data-day="${day}"]:checked`).length;
        const pct = Math.round((checkedInDay / totalHabitsCount) * 100);
        dailyPercentages[day] = pct;
        
        const pctEl = document.getElementById(`pct-${day}`);
        if (pctEl) pctEl.innerText = `${pct}%`;
    }
    progressChart.update();

    const habitChecked = document.querySelectorAll('.cb:checked').length;
    let totalExp = habitChecked * 2;

    questCheckboxes.forEach(q => {
        if (q.checked) totalExp += parseInt(q.getAttribute('data-exp'), 10);
    });

    expVal.innerText = totalExp;

    let currentRank = 'Novice 🌱';
    if (totalExp >= 300) {
        avatarImg.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png';
        currentRank = 'Grandmaster 👑';
        playerRank.style.color = '#7c3aed';
    } else if (totalExp >= 150) {
        avatarImg.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png';
        currentRank = 'Elite Knight ⚔️';
        playerRank.style.color = '#2563eb';
    } else if (totalExp >= 50) {
        avatarImg.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png';
        currentRank = 'Apprentice 🛡️';
        playerRank.style.color = '#059669';
    } else {
        avatarImg.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
        currentRank = 'Novice 🌱';
        playerRank.style.color = '#64748b';
    }

    playerRank.innerText = currentRank;

    if (previousRank !== '' && previousRank !== currentRank) {
        playLevelUpSound();
    }
    previousRank = currentRank;
}

// ==========================================
// 5. FINANCE SPREADSHEET
// ==========================================
const txTableBody = document.getElementById('txTableBody');
const totalIncomeTxt = document.getElementById('totalIncomeTxt');
const totalExpenseTxt = document.getElementById('totalExpenseTxt');
const netBalanceTxt = document.getElementById('netBalanceTxt');

function formatRp(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function renderSpreadsheet() {
    txTableBody.innerHTML = '';
    let inc = 0;
    let exp = 0;

    transactions.forEach(tx => {
        if (tx.type === 'income') inc += tx.amount;
        else exp += tx.amount;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.date}</td>
            <td style="text-align: left; padding-left: 8px;">${tx.desc}</td>
            <td><span class="${tx.type === 'income' ? 'tx-income' : 'tx-expense'}">${tx.type === 'income' ? '+ Masuk' : '- Keluar'}</span></td>
            <td><strong>${formatRp(tx.amount)}</strong></td>
            <td><button class="btn-del" onclick="deleteTx(${tx.id})">✕</button></td>
        `;
        txTableBody.appendChild(row);
    });

    const net = inc - exp;
    totalIncomeTxt.innerText = formatRp(inc);
    totalExpenseTxt.innerText = formatRp(exp);
    netBalanceTxt.innerText = formatRp(net);
    netBalanceTxt.style.color = net >= 0 ? '#10b981' : '#ef4444';

    moneyChart.data.datasets[0].data = [Math.max(0, net), exp];
    moneyChart.update();

    localStorage.setItem('dihcipline_txs', JSON.stringify(transactions));
}

document.getElementById('btnAddTx').addEventListener('click', () => {
    const date = document.getElementById('txDate').value || new Date().toISOString().split('T')[0];
    const desc = document.getElementById('txDesc').value.trim();
    const type = document.getElementById('txType').value;
    const amount = parseFloat(document.getElementById('txAmount').value);

    if (!desc || isNaN(amount) || amount < 0) {
        alert('Harap isi keterangan dan nominal uang dengan benar!');
        return;
    }

    playMoneySound();
    transactions.unshift({ id: Date.now(), date, desc, type, amount });
    document.getElementById('txDesc').value = '';
    document.getElementById('txAmount').value = '';
    renderSpreadsheet();
});

window.deleteTx = function(id) {
    playDeleteSound();
    transactions = transactions.filter(t => t.id !== id);
    renderSpreadsheet();
};

document.getElementById('txDate').value = new Date().toISOString().split('T')[0];

// ==========================================
// 6. SLEEP & AI LOGIC
// ==========================================
document.getElementById('btnSaveSleep').addEventListener('click', () => {
    const sleep = parseFloat(document.getElementById('sleepInput').value);
    const dayToday = Math.min(new Date().getDate() - 1, totalDaysInMonth - 1);
    if (!isNaN(sleep)) {
        playCheckSound();
        sleepData[dayToday] = sleep;
        sleepChart.update();
        localStorage.setItem(`dihcipline_sleep_${currentYear}_${currentMonth}`, JSON.stringify(sleepData));
        alert(`Data tidur tanggal ${dayToday + 1} berhasil disimpan!`);
    }
});

const aiDialogue = document.getElementById('aiDialogue');
const btnAiAdvice = document.getElementById('btnAiAdvice');
const btnToggleApiKey = document.getElementById('btnToggleApiKey');
const apiKeyContainer = document.getElementById('apiKeyContainer');
const geminiApiKeyInput = document.getElementById('geminiApiKey');
const btnSaveKey = document.getElementById('btnSaveKey');
const aiStatusBadge = document.getElementById('aiStatusBadge');

btnToggleApiKey.addEventListener('click', () => {
    apiKeyContainer.style.display = apiKeyContainer.style.display === 'none' ? 'flex' : 'none';
});

btnSaveKey.addEventListener('click', () => {
    const val = geminiApiKeyInput.value.trim();
    if (val) {
        geminiKey = val;
        localStorage.setItem('dihcipline_gemini_key', val);
        aiStatusBadge.innerText = '🟢 Gemini AI Live';
        aiStatusBadge.style.color = '#10b981';
        alert('API Key tersimpan!');
        apiKeyContainer.style.display = 'none';
    }
});

if (geminiKey) {
    geminiApiKeyInput.value = geminiKey;
    aiStatusBadge.innerText = '🟢 Gemini AI Live';
    aiStatusBadge.style.color = '#10b981';
}

function generateLocalAdvice() {
    const totalExp = parseInt(expVal.innerText, 10);
    const questsDone = document.querySelectorAll('.quest-cb:checked').length;
    let advice = [];

    if (totalExp < 50) advice.push("Awal bulan yang bagus! Selesaikan quest Beginner & Intermediate untuk akumulasi EXP.");
    else if (totalExp >= 150) advice.push("Konsistensi bulananmu luar biasa! Kamu berada di jalur Elite Rank.");

    if (questsDone === 4) advice.push("🔥 Semua Quest harian tuntas hari ini!");
    return advice.length ? advice.join(' ') : "Pertahankan ritme disiplin harianmu!";
}

btnAiAdvice.addEventListener('click', async () => {
    aiDialogue.innerText = 'Sedang menganalisis performa bulananmu... ⏳';

    if (!geminiKey) {
        setTimeout(() => { 
            playCheckSound();
            aiDialogue.innerText = `"${generateLocalAdvice()}"`; 
        }, 400);
        return;
    }

    try {
        const prompt = `Kamu adalah 'Dih-Bot', AI companion RPG untuk aplikasi 'DihCipline'.
Bulan: ${monthNames[currentMonth]} ${currentYear}. Total EXP: ${expVal.innerText}. Total Pengeluaran: ${totalExpenseTxt.innerText}. Sisa Saldo: ${netBalanceTxt.innerText}. Quest selesai: ${document.querySelectorAll('.quest-cb:checked').length}/4.
Berikan saran 2 kalimat bernada motivasi game retro.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const resData = await response.json();
        if (resData.candidates && resData.candidates[0].content.parts[0].text) {
            playCheckSound();
            aiDialogue.innerText = `"${resData.candidates[0].content.parts[0].text.trim()}"`;
        } else {
            playCheckSound();
            aiDialogue.innerText = `"${generateLocalAdvice()}"`;
        }
    } catch (e) {
        playCheckSound();
        aiDialogue.innerText = `"${generateLocalAdvice()}"`;
    }
});

// ==========================================
// 7. START NOW & PERSISTENCE
// ==========================================
const btnStartNow = document.getElementById('btnStartNow');
const welcomeScreen = document.getElementById('welcomeScreen');
const dashboardApp = document.getElementById('dashboardApp');

btnStartNow.addEventListener('click', () => {
    playStartSound();
    welcomeScreen.classList.add('hidden');
    dashboardApp.classList.remove('hidden');
    progressChart.resize();
    sleepChart.resize();
    moneyChart.resize();
});

function saveHabits() {
    const cbs = document.querySelectorAll('.cb');
    const habitStates = Array.from(cbs).map(cb => cb.checked);
    localStorage.setItem(`dihcipline_data_${currentYear}_${currentMonth}`, JSON.stringify(habitStates));

    const questStates = Array.from(questCheckboxes).map(q => q.checked);
    localStorage.setItem('dihcipline_quests', JSON.stringify(questStates));
}

function loadHabits() {
    const rawHabits = localStorage.getItem(`dihcipline_data_${currentYear}_${currentMonth}`);
    if (rawHabits) {
        const habitStates = JSON.parse(rawHabits);
        const cbs = document.querySelectorAll('.cb');
        cbs.forEach((cb, i) => { cb.checked = !!habitStates[i]; });
    }

    const rawSleep = localStorage.getItem(`dihcipline_sleep_${currentYear}_${currentMonth}`);
    if (rawSleep) {
        sleepData = JSON.parse(rawSleep);
        sleepChart.data.datasets[0].data = sleepData;
        sleepChart.update();
    }

    updateDashboard();

    // Navigasi Tab Bottom Bar
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        playCheckSound(); // Bunyikan sfx retro saat klik tab

        // Hapus status aktif lama
        navItems.forEach(i => i.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active-tab'));

        // Aktifkan tab yang dipilih
        item.classList.add('active');
        const targetTabId = item.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) targetContent.classList.add('active-tab');

        // Resize grafik agar ukurannya pas saat tab dibuka
        progressChart.resize();
        sleepChart.resize();
        moneyChart.resize();
    });
});

}

function initAll() {
    populateMonthYearPickers();
    buildMonthlyMatrix();

    const rawQuests = localStorage.getItem('dihcipline_quests');
    if (rawQuests) {
        const questStates = JSON.parse(rawQuests);
        questCheckboxes.forEach((q, i) => { q.checked = !!questStates[i]; });
    }

    const rawTxs = localStorage.getItem('dihcipline_txs');
    if (rawTxs) transactions = JSON.parse(rawTxs);

    renderSpreadsheet();

    questCheckboxes.forEach(q => q.addEventListener('change', () => {
        if (q.checked) playCheckSound();
        updateDashboard();
        saveHabits();
    }));
}

initAll();