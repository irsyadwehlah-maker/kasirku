// Inisialisasi data dari penyimpanan lokal browser
let daftarMenu = JSON.parse(localStorage.getItem('myMenu')) || [];
let keranjang = [];

// 1. FUNGSI UNTUK MENAMPILKAN MENU
function renderMenu() {
    const listMenu = document.getElementById('listMenu');
    listMenu.innerHTML = '';

    daftarMenu.forEach((item, index) => {
        const isHabis = item.status === 'Habis';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="${isHabis ? 'habis' : ''}"><strong>${item.nama}</strong></span>
            </td>
            <td>Rp ${parseInt(item.harga).toLocaleString()}</td>
            <td>
                <span class="status-label ${isHabis ? 'status-habis' : 'status-ada'}">${item.status}</span><br>
                <button class="btn-status" onclick="toggleStok(${index})">Ganti Status</button>
            </td>
            <td>
                <button class="btn-add" onclick="keKeranjang(${index})" ${isHabis ? 'disabled style="background:#ccc"' : ''}>
                    Pilih
                </button>
                <button class="btn-status" style="color:red" onclick="hapusPermanen(${index})">Hapus</button>
            </td>
        `;
        listMenu.appendChild(tr);
    });

    // Simpan permanen ke memory browser
    localStorage.setItem('myMenu', JSON.stringify(daftarMenu));
}

// 2. TAMBAH MENU BARU
function tambahMenu() {
    const nama = document.getElementById('namaMakanan').value;
    const harga = document.getElementById('hargaMakanan').value;

    if (nama && harga) {
        daftarMenu.push({
            nama: nama,
            harga: parseInt(harga),
            status: 'Tersedia'
        });
        // Reset input
        document.getElementById('namaMakanan').value = '';
        document.getElementById('hargaMakanan').value = '';
        renderMenu();
    } else {
        alert("Nama dan Harga tidak boleh kosong!");
    }
}

// 3. UBAH STATUS STOK (TERSEDIA/HABIS)
function toggleStok(index) {
    daftarMenu[index].status = daftarMenu[index].status === 'Tersedia' ? 'Habis' : 'Tersedia';
    renderMenu();
}

// 4. HAPUS MENU DARI DAFTAR
function hapusPermanen(index) {
    if(confirm("Hapus menu ini secara permanen?")) {
        daftarMenu.splice(index, 1);
        renderMenu();
    }
}

// 5. LOGIKA KERANJANG (KASIR)
function keKeranjang(index) {
    const menuPilihan = daftarMenu[index];
    const sudahAda = keranjang.find(item => item.nama === menuPilihan.nama);

    if (sudahAda) {
        sudahAda.qty += 1;
    } else {
        keranjang.push({
            nama: menuPilihan.nama,
            harga: menuPilihan.harga,
            qty: 1
        });
    }
    renderKeranjang();
}

function renderKeranjang() {
    const listKeranjang = document.getElementById('listKeranjang');
    const totalHargaEl = document.getElementById('totalHarga');
    listKeranjang.innerHTML = '';
    let total = 0;

    keranjang.forEach(item => {
        const subtotal = item.harga * item.qty;
        total += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nama}</td>
            <td>${item.qty}</td>
            <td>Rp ${subtotal.toLocaleString()}</td>
        `;
        listKeranjang.appendChild(tr);
    });

    totalHargaEl.innerText = `Rp ${total.toLocaleString()}`;
}

// 6. RESET KERANJANG (SETELAH BAYAR)
function resetKeranjang() {
    if (keranjang.length > 0) {
        keranjang = [];
        renderKeranjang();
        alert("Transaksi Selesai / Keranjang Dikosongkan");
    }
}

// Jalankan fungsi tampilkan saat pertama kali buka web
renderMenu();
