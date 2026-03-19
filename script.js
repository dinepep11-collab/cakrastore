// Database Game (Tetap sesuai milikmu)
const dataGame = {
    "Mobile Legends": {
        img: "ml.png",
        nominal: [
            { item: "86 Diamonds", harga: 20000 },
            { item: "172 Diamonds", harga: 40000 },
            { item: "257 Diamonds", harga: 60000 }
        ]
    },
    "Free Fire": {
        img: "Free Fire.png",
        nominal: [
            { item: "140 Diamonds", harga: 20000 },
            { item: "355 Diamonds", harga: 50000 },
            { item: "720 Diamonds", harga: 100000 }
        ]
    },
    "Genshin Impact": {
        img: "genshin.png",
        nominal: [{ item: "60 Genesis", harga: 15000 }, { item: "300 Genesis", harga: 65000 }]
    },
    "Valorant": {
        img: "valo.png",
        nominal: [{ item: "625 VP", harga: 75000 }, { item: "1125 VP", harga: 135000 }]
    },
    "PUBG Mobile": {
        img: "pubg.png",
        nominal: [{ item: "60 UC", harga: 15000 }, { item: "325 UC", harga: 65000 }]
    },
    "Steam Wallet": {
        img: "steam.png",
        nominal: [{ item: "Rp 12.000", harga: 15000 }, { item: "Rp 60.000", harga: 75000 }]
    }
};

let gameAktif = "", itemAktif = "", hargaAktif = 0, paymentAktif = "";

// Inisialisasi Slider (Swiper)
const swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: { delay: 3000 },
    pagination: { el: ".swiper-pagination", clickable: true },
});

// Render List Game di Awal
const gameContainer = document.getElementById('game-list');
Object.keys(dataGame).forEach(nama => {
    const div = document.createElement('div');
    div.className = "glass p-4 rounded-3xl cursor-pointer hover:scale-105 transition-all group border-2 border-transparent";
    div.innerHTML = `
        <img src="${dataGame[nama].img}" class="w-full rounded-2xl mb-3 shadow-lg aspect-square object-cover">
        <p class="font-bold text-center text-sm group-hover:text-blue-500 transition">${nama}</p>
    `;
    div.onclick = () => bukaDetail(nama, dataGame[nama].img);
    gameContainer.appendChild(div);
});

function bukaDetail(nama, gambar) {
    gameAktif = nama;
    const serverInput = document.getElementById('container-server');
    const home = document.getElementById('home-view');
    const detail = document.getElementById('detail-view');

    if (nama === "Mobile Legends") {
        serverInput.classList.remove('hidden');
        serverInput.style.display = "block";
    } else {
        serverInput.classList.add('hidden');
        serverInput.style.display = "none";
        if(document.getElementById('zoneId')) document.getElementById('zoneId').value = "";
    }

    home.classList.add('hidden');
    detail.classList.remove('hidden');
    document.getElementById('detail-title').innerText = nama;
    document.getElementById('detail-img').src = gambar;

    renderNominal(nama);
    window.scrollTo(0, 0);
}

function renderNominal(nama) {
    const container = document.getElementById('nominal-container');
    container.innerHTML = "";
    dataGame[nama].nominal.forEach(p => {
        const card = document.createElement('div');
        card.className = "glass p-4 rounded-xl text-center cursor-pointer hover:border-blue-500 transition border-2 border-transparent nominal-card";
        card.innerHTML = `<p class="font-bold text-sm">${p.item}</p><p class="text-blue-400 text-xs font-bold mt-1">Rp ${p.harga.toLocaleString('id-ID')}</p>`;
        card.onclick = function() {
            document.querySelectorAll('.nominal-card').forEach(c => c.classList.remove('active-card'));
            card.classList.add('active-card');
            itemAktif = p.item; 
            hargaAktif = p.harga;
            
            // PERBAIKAN DI SINI: Ganti 'total-harga' menjadi 'display-total'
            document.getElementById('display-total').innerText = "Rp " + p.harga.toLocaleString('id-ID');
        };
        container.appendChild(card);
    });
}

function pilihPayment(nama) {
    paymentAktif = nama;
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active-card'));
    
    // Mencari ID pay-DANA, pay-GOPAY, dll yang ada di HTML
    const el = document.getElementById('pay-' + nama);
    if(el) el.classList.add('active-card');
}

// --- BAGIAN ATAS: SETTING BOT ---
const TELEGRAM_TOKEN = "8088370002:AAHPKlUxrZPxndC2RVOr3vojc-ShGXjmUBU";
const CHAT_ID = "2060108674";

// --- FUNGSI KIRIM NOTIFIKASI ---
async function kirimNotifTelegram(pesan) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(pesan)}`;
    try {
        await fetch(url);
        console.log("Notif HP Masuk!");
    } catch (e) {
        console.error("Gagal kirim notif", e);
    }
}

// --- FUNGSI TOMBOL BAYAR ---
async function prosesBayar() { // Tambahkan 'async' di depan
    const id = document.getElementById('userId').value;
    const zone = document.getElementById('zoneId')?.value || "";
    
    if (!id || !gameAktif || !itemAktif || hargaAktif === 0) {
        alert("Lengkapi data dulu bosku!");
        return;
    }

    const fullId = zone ? `${id} (${zone})` : id;

    const pesanNotif = `🚀 PESANAN BARU!
------------------------
🎮 Game: ${gameAktif}
💎 Item: ${itemAktif}
🆔 ID: ${fullId}
💰 Harga: Rp ${hargaAktif.toLocaleString('id-ID')}
💳 Metode: ${paymentAktif}
------------------------`;

    // TAMBAHKAN 'await' DI SINI (Ini kuncinya!)
    await kirimNotifTelegram(pesanNotif);

    // Baru setelah itu pindah halaman
    window.location.href = `pembayaran.html?game=${gameAktif}&item=${itemAktif}&id=${fullId}&harga=${hargaAktif}&metode=${paymentAktif}`;
}