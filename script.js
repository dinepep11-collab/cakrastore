// === 1. DATABASE GAME LENGKAP ===
const dataGame = {
    "Mobile Legends": {
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
    "Free Fire": { img: "Free Fire.png", nominal: [{ item: "140 Diamonds", harga: 20000 }] },
    "Genshin Impact": { img: "genshin.png", nominal: [{ item: "60 Genesis", harga: 15000 }] },
    "Valorant": { img: "valo.png", nominal: [{ item: "625 VP", harga: 75000 }] },
    "PUBG Mobile": { img: "pubg.png", nominal: [{ item: "60 UC", harga: 15000 }] },
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

    db.ref('testimoni').push({
        nama: nama, pesan: pesan, bintang: ratingPilihan, tanggal: new Date().toLocaleDateString('id-ID')
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
        <div class="glass p-6 rounded-2xl border border-white/5 shadow-xl">
            <div class="flex mb-2 text-yellow-400 text-[10px]">
                ${Array(t.bintang || 5).fill('<i class="fas fa-star"></i>').join('')}
            </div>
            <p class="text-sm italic text-gray-300">"${t.pesan}"</p>
            <p class="mt-4 font-bold text-blue-500 text-[10px] uppercase">- ${t.nama}</p>
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
            <div class="glass p-4 rounded-2xl border border-white/5 flex justify-between items-center mb-2">
                <div>
                    <p class="font-bold text-sm text-white">${r.game} - ${r.item}</p>
                    <p class="text-[10px] text-gray-400">${r.tanggal} | ID: ${r.id}</p>
                </div>
                <div class="text-right">
                    <p class="text-blue-400 font-bold text-xs">Rp ${r.harga.toLocaleString('id-ID')}</p>
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

// === 5. FUNGSI GAME & MODAL ===
function renderGame() {
    const container = document.getElementById('game-list');
    if(!container) return;
    Object.keys(dataGame).forEach(nama => {
        const div = document.createElement('div');
        div.className = "glass p-4 rounded-3xl cursor-pointer text-center hover:scale-105 transition-all";
        div.innerHTML = `<img src="${dataGame[nama].img}" class="w-full rounded-2xl mb-3 aspect-square object-cover"><p class="font-bold text-sm text-white">${nama}</p>`;
        div.onclick = () => bukaDetail(nama, dataGame[nama].img);
        container.appendChild(div);
    });
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
    if (nama !== "Mobile Legends") {
        document.getElementById('modal-maintenance').classList.remove('hidden');
        return; 
    }
    gameAktif = nama;
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('detail-view').classList.remove('hidden');
    document.getElementById('container-server').classList.remove('hidden');
    document.getElementById('detail-title').innerText = nama;
    document.getElementById('detail-img').src = gambar;
    renderNominal(nama);
    window.scrollTo(0,0);
}

function renderNominal(nama) {
    const container = document.getElementById('nominal-container');
    container.innerHTML = "";
    dataGame[nama].nominal.forEach(p => {
        const div = document.createElement('div');
        div.className = "glass p-4 rounded-xl text-center cursor-pointer hover:border-blue-500 transition border-2 border-transparent nominal-card";
        div.innerHTML = `<p class="font-bold text-sm text-white">${p.item}</p><p class="text-blue-400 text-xs font-bold">Rp ${p.harga.toLocaleString('id-ID')}</p>`;
        div.onclick = () => {
            document.querySelectorAll('.nominal-card').forEach(c => c.classList.remove('active-card'));
            div.classList.add('active-card');
            itemAktif = p.item; hargaAktif = p.harga;
            document.getElementById('display-total').innerText = "Rp " + p.harga.toLocaleString('id-ID');
        };
        container.appendChild(div);
    });
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
    if (!id || !gameAktif || !itemAktif || !paymentAktif) return alert("Lengkapi data!");
    
    const fullID = zone ? `${id}(${zone})` : id;
    
    // SIMPAN KE RIWAYAT
    simpanKeRiwayat({
        game: gameAktif,
        item: itemAktif,
        id: fullID,
        harga: hargaAktif,
        tanggal: new Date().toLocaleDateString('id-ID'),
        status: "MENUNGGU"
    });

    window.location.href = `pembayaran.html?game=${gameAktif}&item=${itemAktif}&id=${fullID}&harga=${hargaAktif}&metode=${paymentAktif}`;
}

// === START ===
document.addEventListener('DOMContentLoaded', () => {
    renderGame();
    initFirebase();
    muatTesti();
    tampilkanRiwayat(); // Tampilkan saat buka web
    if(document.querySelector(".mySwiper")) {
        new Swiper(".mySwiper", { loop: true, autoplay: { delay: 3000 } });
    }
});