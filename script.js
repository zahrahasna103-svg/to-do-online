
const API = "https://jsonplaceholder.typicode.com/todos";

const daftarTugas = document.getElementById("daftar-tugas");
const pesan = document.getElementById("pesan");
const form = document.getElementById("form-tugas");
const inputTugas = document.getElementById("input-tugas");
const tombolFilter = document.querySelectorAll(".filter-btn");

let dataTugas = [];
let filterAktif = "semua";

// Mengambil data dari API
async function ambilTugas() {
    pesan.textContent = "Memuat...";
    
    try {
        const response = await fetch(API + "?_limit=15");

        if (!response.ok) {
            throw new Error("Gagal mengambil data");
        }

        dataTugas = await response.json();

        tampilkanTugas();

    } catch (error) {
        pesan.textContent = "Terjadi kesalahan saat memuat tugas.";
    }
}

// Menampilkan daftar tugas
function tampilkanTugas() {
    daftarTugas.innerHTML = "";

    let hasil = dataTugas;

    if (filterAktif === "selesai") {
        hasil = dataTugas.filter(tugas => tugas.completed === true);
    } else if (filterAktif === "belum") {
        hasil = dataTugas.filter(tugas => tugas.completed === false);
    }

    pesan.textContent = hasil.length === 0
        ? "Tidak ada tugas."
        : "";

    hasil.forEach(tugas => {
        const li = document.createElement("li");

        li.className = tugas.completed
            ? "tugas selesai"
            : "tugas belum";

        const judul = document.createElement("span");
        judul.textContent = tugas.title;

        const status = document.createElement("span");
        status.className = "status";
        status.textContent = tugas.completed
            ? "✓ Selesai"
            : "○ Belum Selesai";

        li.appendChild(judul);
        li.appendChild(status);

        daftarTugas.appendChild(li);
    });
}

// Filter tugas
tombolFilter.forEach(button => {
    button.addEventListener("click", () => {

        tombolFilter.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        filterAktif = button.dataset.filter;

        tampilkanTugas();
    });
});

// Menambahkan tugas baru menggunakan POST
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const judulBaru = inputTugas.value.trim();

    if (judulBaru === "") {
        return;
    }

    pesan.textContent = "Menambahkan tugas...";

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: judulBaru,
                completed: false,
                userId: 1
            })
        });

        if (!response.ok) {
            throw new Error("Gagal menambahkan tugas");
        }

        const tugasBaru = await response.json();

        dataTugas.unshift(tugasBaru);

        inputTugas.value = "";

        filterAktif = "semua";

        tombolFilter.forEach(btn => {
            btn.classList.remove("active");
        });

        document.querySelector('[data-filter="semua"]')
            .classList.add("active");

        tampilkanTugas();

    } catch (error) {
        pesan.textContent = "Gagal menambahkan tugas!";
    }
});

// Jalankan aplikasi
ambilTugas();
