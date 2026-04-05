// === 0. TEMA LIGHT/DARK MODE ===
function initTheme() {
    const savedTheme = localStorage.getItem('cakra_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeBtn();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cakra_theme', newTheme);
    updateThemeBtn();
}

function updateThemeBtn() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    
    const theme = document.documentElement.getAttribute('data-theme');
    const icon = btn.querySelector('i');
    
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun text-yellow-400';
            btn.title = 'Ubah ke Light Mode';
        } else {
            icon.className = 'fas fa-moon text-blue-500';
            btn.title = 'Ubah ke Dark Mode';
        }
    }
}

// === SISTEM POIN & SPIN ===
let userPoints = parseInt(localStorage.getItem('cakra_points')) || 0;
let spinCount = parseInt(localStorage.getItem('cakra_spins')) || 0;

// Fungsi hitung poin berdasarkan nominal
function hitungPoin(nominal) {
    if (nominal < 10000) return 5;      // < 10k = 5 poin
    if (nominal < 50000) return 15;     // 10k-50k = 15 poin
    if (nominal < 100000) return 35;    // 50k-100k = 35 poin
    if (nominal < 500000) return 75;    // 100k-500k = 75 poin
    return 150;                         // >= 500k = 150 poin
}

// Fungsi tambah poin (dipanggil saat transaksi selesai)
function tambahPoin(nominal) {
    const poinDapat = hitungPoin(nominal);
    userPoints += poinDapat;
    
    // Spin gratis setiap 100 poin
    const spinBaru = Math.floor(userPoints / 100);
    if (spinBaru > spinCount) {
        spinCount = spinBaru;
        showToast(`🎁 Dapatkan ${spinBaru - (spinCount - 1)} Spin Gratis!`);
    }
    
    localStorage.setItem('cakra_points', userPoints);
    localStorage.setItem('cakra_spins', spinCount);
    updatePointsDisplay();
}

function updatePointsDisplay() {
    document.querySelectorAll('#user-points').forEach(el => {
        el.innerText = userPoints;
    });
    document.querySelectorAll('#spin-count').forEach(el => {
        el.innerText = spinCount;
    });
}

// Reward untuk spin wheel
const spinRewards = [
    { label: 'Diskon 5%', icon: '🎟️', type: 'discount', value: 5 },
    { label: 'Diskon 10%', icon: '🎫', type: 'discount', value: 10 },
    { label: '+ 50 Poin', icon: '⭐', type: 'points', value: 50 },
    { label: '+ 100 Poin', icon: '✨', type: 'points', value: 100 },
    { label: 'Free Item', icon: '🎁', type: 'freeitem', value: 1 },
    { label: 'Diskon 15%', icon: '🔥', type: 'discount', value: 15 },
    { label: '+ 25 Poin', icon: '💫', type: 'points', value: 25 },
    { label: 'Cashback Rp 5k', icon: '💰', type: 'cashback', value: 5000 },
];

let isSpinning = false;

function spinWheel() {
    if (spinCount <= 0) {
        return showToast('Spin tidak cukup! Kumpulkan 100 poin untuk 1 spin');
    }
    if (isSpinning) return;
    
    isSpinning = true;
    spinCount--;
    localStorage.setItem('cakra_spins', spinCount);
    updatePointsDisplay();
    
    const wheel = document.getElementById('spin-wheel');
    const spinner = document.getElementById('spin-pointer');
    const resultBox = document.getElementById('spin-result');
    
    // Random rotation (minimal 5 putaran + random)
    const randomDegree = Math.random() * 360;
    const totalRotation = (5 * 360) + randomDegree;
    
    wheel.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    setTimeout(() => {
        isSpinning = false;
        const winIndex = Math.floor((randomDegree / 360) * spinRewards.length);
        const reward = spinRewards[winIndex];
        
        showSpinResult(reward);
        
        // Bonus poin
        if (reward.type === 'points') {
            userPoints += reward.value;
            localStorage.setItem('cakra_points', userPoints);
            updatePointsDisplay();
        }
    }, 4000);
}

function showSpinResult(reward) {
    const resultBox = document.getElementById('spin-result');
    resultBox.innerHTML = `
        <div class="text-center animate-bounce">
            <p class="text-4xl mb-2">${reward.icon}</p>
            <p class="text-lg font-black text-blue-400 uppercase">${reward.label}</p>
            <p class="text-xs text-gray-400 mt-2">Reward telah masuk ke akun kamu!</p>
        </div>
    `;
    resultBox.classList.remove('hidden');
    
    setTimeout(() => resultBox.classList.add('hidden'), 3000);
}

// === 1. DATABASE GAME LENGKAP ===
const dataGame = {
    "Mobile Legends": {
        populer: true,
        img: "ml.png",
        nominal: [
            { item: "Weekly Diamond Pass", harga: 28751, hargaAsli: 30499 },
            { item: "Weekly Diamond Pass X2", harga: 57264, hargaAsli: 59224 },
            { item: "3 Diamonds", harga: 1122 },
            { item: "10 Diamonds", harga: 3156 },
            { item: "19 Diamonds", harga: 5792 },
            { item: "28 Diamonds", harga: 8423 },
            { item: "44 Diamonds", harga: 12636 },
            { item: "59 Diamonds", harga: 16848 },
            { item: "85 Diamonds", harga: 24220 },
            { item: "170 Diamonds", harga: 48440 },
            { item: "240 Diamonds", harga: 68306 },
            { item: "301 Diamonds", harga: 85634 },
            { item: "345 Diamonds", harga: 96306 },
            { item: "408 Diamonds", harga: 115599 },
            { item: "512 Diamonds", harga: 145611 }
        ]
    },

   "Free Fire": {
        populer: true,
        img: "Free Fire.png",
        nominal: [
            { item: "5 Diamonds", harga: 1000 },
            { item: "12 Diamonds", harga: 2000 },
            { item: "50 Diamonds", harga: 8000 },
            { item: "70 Diamonds", harga: 10000 },
            { item: "140 Diamonds", harga: 20000 },
            { item: "355 Diamonds", harga: 50000 },
            { item: "720 Diamonds", harga: 100000 },
            { item: "1450 Diamonds", harga: 200000 }
        ]
    },

       "Roblox": {
        populer: true,
        img: "roblox.png",
        nominal: [
        ]
    },

           "Super Sus": {
        populer: false,
        img: "supersus.png",
        nominal: [
        ]
    },
    "Genshin Impact": { populer: true, img: "genshin.png", nominal: [] },
    "Valorant": { img: "valo.png", nominal: [{ item: "625 VP", harga: 75000 }] },
    "PUBG Mobile": { populer: true, img: "pubg.png", nominal: [] },
    "Steam Wallet": { img: "steam.png", nominal: [{ item: "Rp 12.000", harga: 15000 }] }
};

let gameAktif = "", itemAktif = "", hargaAktif = 0, paymentAktif = "", ratingPilihan = 5;
let db;

// === 2. INISIALISASI FIREBASE ===
function initFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyC9tW7wW5Ro4jXXR3BafxAYDdwn7_v2zgk",
      authDomain: "cakrastore-cd2fd.firebaseapp.com",
      databaseURL: "https://cakrastore-cd2fd-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "cakrastore-cd2fd",
      storageBucket: "cakrastore-cd2fd.firebasestorage.app",
      messagingSenderId: "539073626843",
      appId: "1:539073626843:web:faa8a7df550e5c8256c2fe",
    };
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
    }
}

// === 3. SISTEM TESTIMONI ===
const testiPalsu = [
    { nama: "Arif Gaming", pesan: "Gila cepet banget masuknya!", bintang: 5 },
    { nama: "Siska MLBB", pesan: "Murah banget dibanding toko sebelah.", bintang: 5 },
    { nama: "Bang Jago", pesan: "Aman terpercaya, gak usah ragu.", bintang: 4 }
];

let allTestimoni = [];
let jumlahTampil = 4;

function setStar(num) {
    ratingPilihan = num;
    const stars = document.querySelectorAll('.star-btn');
    stars.forEach((s, i) => {
        if(i < num) s.classList.add('text-yellow-400');
        else s.classList.remove('text-yellow-400');
    });
}

function simpanTesti() {
    const nama = document.getElementById('input-nama').value;
    const pesan = document.getElementById('input-pesan').value;
    if (!nama || !pesan) return alert("Isi nama & pesan dulu Bosku!");
    if (!db) return alert("Firebase belum siap!");

    // Ambil waktu sekarang agar lebih detail (Contoh: 2 Apr, 21:05)
    const sekarang = new Date();
    const opsiWaktu = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    const waktuTerkirim = sekarang.toLocaleDateString('id-ID', opsiWaktu);

    db.ref('testimoni').push({
        nama: nama, 
        pesan: pesan, 
        bintang: ratingPilihan, 
        tanggal: waktuTerkirim, // Simpan waktu otomatis
        balasan: "" // Siapkan tempat untuk balasan admin
    }).then(() => {
        alert("Testimoni terkirim!");
        document.getElementById('input-nama').value = "";
        document.getElementById('input-pesan').value = "";
    });
}

function muatTesti() {
    if(!db) { renderTestiHTML(testiPalsu); return; }
    db.ref('testimoni').on('value', (snap) => {
        const data = snap.val();
        const fbData = data ? Object.values(data).reverse() : [];
        allTestimoni = [...fbData, ...testiPalsu];
        renderTestiHTML();
    });
}

function renderTestiHTML() {
    const container = document.getElementById('testi-container');
    const loadMoreBtn = document.getElementById('load-more-testi');
    if(!container) return;
    
    const ditarik = allTestimoni.slice(0, jumlahTampil);
    container.innerHTML = ditarik.map(t => `
        <div class="glass p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group" style="border-color: var(--border-color);">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <p class="font-black text-blue-500 text-[11px] uppercase tracking-wider">${t.nama}</p>
                    <p class="text-[9px] font-bold uppercase" style="color: var(--text-secondary);">${t.tanggal || 'Baru saja'}</p>
                </div>
                <div class="text-yellow-400 text-[9px] flex gap-0.5">
                    ${Array(t.bintang || 5).fill('<i class="fas fa-star"></i>').join('')}
                </div>
            </div>
            
            <p class="text-xs italic leading-relaxed mb-4" style="color: var(--text-secondary);">"${t.pesan}"</p>
            
            ${t.balasan ? `
                <div class="bg-blue-600/10 p-3 rounded-2xl border-l-4 border-blue-600 mt-2">
                    <p class="text-[9px] font-black text-blue-500 uppercase mb-1">
                        <i class="fas fa-reply fa-rotate-180 mr-1 text-blue-400"></i> Balasan Admin:
                    </p>
                    <p class="text-[10px] text-gray-400 leading-tight">${t.balasan}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    if (jumlahTampil >= allTestimoni.length) loadMoreBtn?.classList.add('hidden');
    else loadMoreBtn?.classList.remove('hidden');
}

function lihatLainnya() { jumlahTampil += 4; renderTestiHTML(); }

// === 4. RIWAYAT TRANSAKSI (LOCAL STORAGE) ===
function simpanKeRiwayat(data) {
    let riwayat = JSON.parse(localStorage.getItem('riwayat_cakra')) || [];
    riwayat.unshift(data);
    localStorage.setItem('riwayat_cakra', JSON.stringify(riwayat.slice(0, 10)));
    tampilkanRiwayat();
}

function tampilkanRiwayat() {
    const container = document.getElementById('riwayat-list');
    const section = document.getElementById('riwayat-section');
    let riwayat = JSON.parse(localStorage.getItem('riwayat_cakra')) || [];

    if (riwayat.length > 0) {
        section.classList.remove('hidden');
        container.innerHTML = riwayat.map(r => `
            <div class="glass p-4 rounded-2xl flex justify-between items-center mb-2" style="border: 1.5px solid var(--border-color);">
                <div>
                    <p class="font-bold text-sm" style="color: var(--text-primary);">${r.game} - ${r.item}</p>
                    <p class="text-[10px]" style="color: var(--text-secondary);">${r.tanggal} | ID: ${r.id}</p>
                </div>
                <div class="text-right">
                    <p class="text-blue-500 font-bold text-xs">Rp ${r.harga.toLocaleString('id-ID')}</p>
                    <p class="text-[9px] text-green-500 uppercase font-black">${r.status}</p>
                </div>
            </div>
        `).join('');
    } else {
        section.classList.add('hidden');
    }
}

function hapusRiwayat() {
    if(confirm("Hapus semua riwayat?")) {
        localStorage.removeItem('riwayat_cakra');
        tampilkanRiwayat();
    }
}

async function cekUsername() {
    const id = document.getElementById('userId').value;
    const zone = document.getElementById('zoneId').value;
    const box = document.getElementById('box-username');
    const text = document.getElementById('hasil-username');

    if (id.length >= 8 && zone.length >= 4) {
        box.classList.remove('hidden');
        text.innerText = "Mengecek Akun...";
        box.classList.add('animate-pulse');
        try {
            const response = await fetch(`cek-id.php?user_id=${id}&zone_id=${zone}`);
            const result = await response.json();
            if (result.data && result.data.customer_name) {
                text.innerText = result.data.customer_name;
                box.classList.remove('animate-pulse');
            } else {
                text.innerText = "ID Tidak Valid";
            }
        } catch (error) { text.innerText = "Sistem Offline"; }
    } else { box.classList.add('hidden'); }
}

function bukaDetail(nama, gambar) {
    // Kunci hanya untuk ML & FF sesuai request Bosku
    if (nama !== "Mobile Legends" && nama !== "Free Fire") {
        // Jika diakses paksa lewat URL tapi bukan ML/FF, lempar ke Home
        window.location.href = "index.html"; 
        return;
    }

    gameAktif = nama;
    
    // Pastikan home-view sembunyi & detail-view muncul
    const homeView = document.getElementById('home-view');
    const detailView = document.getElementById('detail-view');
    
    if(homeView) homeView.classList.add('hidden');
    if(detailView) detailView.classList.remove('hidden');

    // Atur Server ID (FF & Genshin sembunyiin server)
    const serverBox = document.getElementById('container-server');
    if (nama === "Free Fire") {
        if(serverBox) serverBox.classList.add('hidden');
    } else {
        if(serverBox) serverBox.classList.remove('hidden');
    }

    document.getElementById('detail-title').innerText = nama;
    document.getElementById('detail-img').src = gambar;
    
    renderNominal(nama);
    window.scrollTo(0, 0);
}

function renderNominal(game) {
    const container = document.getElementById('nominal-list');
    if (!container) return;
    
    container.innerHTML = ""; // Bersihkan list

    // Ambil data dari dataGame
    const gameData = dataGame[game];
    if (!gameData || !gameData.nominal) {
        console.log("Data tidak ditemukan untuk: " + game);
        return;
    }

    const list = gameData.nominal;

    // Logika pemisahan untuk Mobile Legends
    if (game === "Mobile Legends") {
        // --- Render WDP ---
        const wdp = list.filter(v => v.item && v.item.toLowerCase().includes("weekly"));
        if (wdp.length > 0) {
            container.insertAdjacentHTML('beforeend', `<div class="col-span-full py-2 mb-2"><h3 class="text-blue-400 font-bold text-[11px] uppercase border-l-4 border-blue-600 pl-3">Weekly Diamond Pass</h3></div>`);
            wdp.forEach(v => container.appendChild(buatElementNominal(v)));
        }

        // --- Render Diamond ---
        const dm = list.filter(v => v.item && !v.item.toLowerCase().includes("weekly"));
        if (dm.length > 0) {
            container.insertAdjacentHTML('beforeend', `<div class="col-span-full py-2 mt-4 mb-2"><h3 class="text-blue-400 font-bold text-[11px] uppercase border-l-4 border-blue-600 pl-3">Diamond Biasa</h3></div>`);
            dm.forEach(v => container.appendChild(buatElementNominal(v)));
        }
    } else {
        // Game lain (seperti Free Fire) tampilkan semua
        list.forEach(v => container.appendChild(buatElementNominal(v)));
    }
}

function buatElementNominal(v) {
    const div = document.createElement('div');
    div.className = "relative glass p-4 rounded-2xl cursor-pointer border-2 border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 text-left flex flex-col justify-between min-h-[90px] overflow-hidden group";
    
    const hargaFormat = "Rp " + Number(v.harga).toLocaleString('id-ID');
    const hargaCoret = v.hargaAsli ? `<p class="text-[9px] text-gray-500 line-through decoration-red-500/50">Rp ${Number(v.hargaAsli).toLocaleString('id-ID')}</p>` : "";

    div.innerHTML = `
        <div class="absolute -right-2 -top-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <i class="fas fa-gem text-4xl text-blue-400"></i>
        </div>

        <div class="relative z-10">
            <p class="text-[12px] font-black text-white/95 mb-1 leading-tight group-hover:text-blue-400 transition-colors" style="text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${v.item}</p>
            ${hargaCoret}
        </div>
        
        <div class="relative z-10 mt-2">
            <p class="text-[14px] text-blue-400 font-extrabold tracking-wide" style="text-shadow: 0 1px 2px rgba(59, 130, 246, 0.4);">${hargaFormat}</p>
        </div>

        <div class="check-indicator absolute top-2 right-2 hidden">
            <i class="fas fa-check-circle text-blue-500 text-xs"></i>
        </div>
    `;
    
    div.onclick = () => {
        pilihNominal(v.item, v.item, v.harga, div);
        
        document.querySelectorAll('.check-indicator').forEach(el => el.classList.add('hidden'));
        div.querySelector('.check-indicator').classList.remove('hidden');
    };
    return div;
}

function pilihNominal(id, nama, harga, element) {
    itemAktif = nama;
    hargaAktif = harga;

    const displayTotal = document.getElementById('display-total');
    if (displayTotal) {
        // Efek transisi angka
        displayTotal.style.opacity = "0.5";
        setTimeout(() => {
            displayTotal.innerText = "Rp " + Number(harga).toLocaleString('id-ID');
            displayTotal.style.opacity = "1";
        }, 100);
    }

    // Reset dan aktifkan border
    document.querySelectorAll('#nominal-list > div').forEach(el => {
        el.classList.remove('border-blue-500', 'bg-blue-500/10', 'ring-2', 'ring-blue-500/20');
    });
    element.classList.add('border-blue-500', 'bg-blue-500/10', 'ring-2', 'ring-blue-500/20');
}

function pilihGame(nama) {
    if (dataGame[nama]) {
        gameAktif = nama;
        document.getElementById('nama-game-pilihan').innerText = nama;
        
        // Munculkan bagian input & nominal
        document.getElementById('input-section').classList.remove('hidden');
        document.getElementById('nominal-section').classList.remove('hidden');
        document.getElementById('payment-section').classList.remove('hidden');
        
        // Sembunyikan Zone ID kalau pilih Free Fire
        const zoneInput = document.getElementById('zoneId');
        if (nama === "Free Fire") {
            if(zoneInput) zoneInput.classList.add('hidden');
        } else {
            if(zoneInput) zoneInput.classList.remove('hidden');
        }

        document.getElementById('input-section').scrollIntoView({ behavior: 'smooth' });
        renderNominal(nama);
    } else {
        document.getElementById('modal-maintenance').classList.remove('hidden');
    }
}

function pilihPayment(nama) {
    paymentAktif = nama;
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active-card'));
    document.getElementById('pay-' + nama).classList.add('active-card');
}

function tutupModal() { document.getElementById('modal-maintenance').classList.add('hidden'); }

async function prosesBayar() {
    const id = document.getElementById('userId').value;
    const zone = document.getElementById('zoneId')?.value || "";
    const username = document.getElementById('hasil-username').innerText;

    // Cek kelengkapan data
    if (!id) return showToast("Masukkan User ID dulu, Bosku!");
    if (gameAktif !== "Free Fire" && !zone) return showToast("ID Server jangan kosong!");
    if (!itemAktif) return showToast("Pilih Diamond-nya dulu!");
    if (!paymentAktif) return showToast("Pilih metode pembayaran!");

    // Jika semua oke, lanjut ke proses transaksi
    const fullID = zone ? `${id}(${zone})` : id;
    const nomorTrx = "CKR" + Math.floor(Math.random() * 899999 + 100000);
    const tgl = new Date().toLocaleString('id-ID');

    simpanKeRiwayat({
        game: gameAktif,
        item: itemAktif,
        id: fullID,
        harga: hargaAktif,
        tanggal: tgl,
        status: "PENDING"
    });

    window.location.href = `pembayaran.html?trx=${nomorTrx}&game=${gameAktif}&item=${itemAktif}&id=${fullID}&user=${username}&harga=${hargaAktif}&metode=${paymentAktif}&tgl=${tgl}`;
}

// Fungsi bantu untuk memunculkan pesan (Toast)
function showToast(pesan) {
    // Hapus toast lama kalau ada
    const oldToast = document.querySelector('.toast-notif');
    if (oldToast) oldToast.remove();

    // Buat elemen baru
    const toast = document.createElement('div');
    toast.className = 'toast-notif';
    toast.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${pesan}`;
    document.body.appendChild(toast);

    // Jalankan animasi muncul
    setTimeout(() => toast.classList.add('toast-show'), 100);

    // Hilang otomatis setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// === INISIALISASI UTAMA ===
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updatePointsDisplay();
    initFirebase();
    tampilkanRiwayat();
    muatTesti();

    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');

    // CEK: Kalau ada parameter game (diklik dari katalog)
    if (gameParam && dataGame[gameParam]) {
        const homeView = document.getElementById('home-view');
        if(homeView) homeView.classList.add('hidden');
        bukaDetail(gameParam, dataGame[gameParam].img);
    } else {
        // Render game list di home
        renderGameCakra(); 
    }

    // INISIALISASI SWIPER
    if(document.querySelector(".mySwiper")) {
        new Swiper(".mySwiper", { 
            loop: true, 
            autoplay: { 
                delay: 3000,
                disableOnInteraction: false 
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
    }
});



    // --- FUNGSI PROFIL & GANTI FOTO ---

    // Fungsi Ganti Foto Profil (Simpan ke Local Storage agar tidak hilang saat refresh)
function gantiPFP(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const fotoData = e.target.result;
            
            // 1. Update semua foto profil di layar
            document.querySelectorAll('#user-pfp').forEach(img => {
                img.src = fotoData;
            });

            // 2. Simpan ke LocalStorage
            localStorage.setItem('cakra_pfp_data', fotoData);

            // 3. Tampilkan Custom Toast (Ganti Alert)
            const toast = document.getElementById('custom-toast');
            toast.classList.remove('hidden');
            
            // Hilangkan otomatis setelah 3 detik
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Inisialisasi Profil & Dropdown (satu kali saja)
window.addEventListener('DOMContentLoaded', () => {
    // Load saved profile picture
    const savedPFP = localStorage.getItem('cakra_pfp_data');
    if (savedPFP) {
        document.querySelectorAll('#user-pfp').forEach(img => img.src = savedPFP);
    }

    // Toggle Dropdown Menu (satu listener saja)
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.getElementById('profile-menu');

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
                profileMenu.classList.add('hidden');
            }
        });
    }

    // Jalankan render game saat startup
    if (document.getElementById('game-list')) {
        renderGameCakra();
    }
}); // Penutup DOMContentLoaded

// 1. Fungsi Utama untuk Menampilkan Game di Home
function renderGameCakra() {
    const container = document.getElementById('game-list');
    if (!container) return;
    
    container.innerHTML = ""; 
    // Pakai grid yang rapi
    container.className = "grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4";

    Object.keys(dataGame).forEach(nama => {
        const game = dataGame[nama];
        // Render semua game yang populer
        if (game.populer === true) {
            buatKartuGameCakra(container, nama, game);
        }
    });

    // Tombol LAINNYA
    const btnKatalog = document.createElement('div');
    btnKatalog.className = "game-card btn-katalog-cakra flex flex-col justify-center items-center border-dashed border-2 border-white/20 opacity-80 cursor-pointer p-4";
    btnKatalog.innerHTML = `
        <div class="flex items-center justify-center bg-blue-500/10 mb-2">
            <i class="fas fa-th-large text-2xl text-blue-500"></i>
        </div>
        <p class="text-[7px] md:text-[10px] font-bold text-center uppercase">Lainnya</p>
    `;
    btnKatalog.onclick = () => window.location.href = "semua-game.html";
    container.appendChild(btnKatalog);
}

function buatKartuGameCakra(container, nama, game) {
    const div = document.createElement('div');
    div.className = "game-card rounded-2xl p-1 group relative flex flex-col items-center justify-start cursor-pointer"; 
    
    div.innerHTML = `
        <div class="w-full aspect-square overflow-hidden mb-1" style="border-radius: 12px !important;"> 
            <img src="${game.img}" 
                 class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                 style="border-radius: 12px !important;">
        </div>
        <p class="font-bold text-[7px] md:text-[10px] text-white text-center leading-tight break-all w-full uppercase px-0.5 mt-0.5">
            ${nama}
        </p>
    `;

    div.onclick = function() {
        // CEK DI SINI: Kalau nominal kosong atau game-nya Genshin/Roblox/PUBG, munculin pesan
        if (!game.nominal || game.nominal.length === 0) {
            munculPesan(nama); 
        } else {
            window.location.href = `index.html?game=${encodeURIComponent(nama)}`;
        }
    };
    container.appendChild(div);
}

function munculPesan(namaGame) {
    const modal = document.getElementById('modal-maintenance');
    const msg = document.getElementById('modal-msg');
    if (modal && msg) {
        msg.innerText = "Maaf Bosku, layanan untuk " + namaGame + " belum tersedia. Sedang dikerjakan!";
        modal.classList.remove('hidden');
    }
}

function tutupModal() {
    const modal = document.getElementById('modal-maintenance');
    if (modal) modal.classList.add('hidden');
}