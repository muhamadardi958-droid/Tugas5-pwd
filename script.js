
const produkList = [
    { id: 1, nama: "Baju Jersey", harga: 150000, stok: 10 }, 
    { id: 2, nama: "Sepatu Bola", harga: 250000, stok: 5 }, 
    { id: 3, nama: "Kaos Kaki", harga: 50000, stok: 5 } 
];

const produk4 = new Object();
produk4.id = 4;
produk4.nama = "Deker";
produk4.harga = 30000;
produk4.stok = 5;
produkList.push(produk4);

const produk5 = new Object();
produk5.id = 5;
produk5.nama = "Sarung Tangan";
produk5.harga = 120000;
produk5.stok = 0 ; 
produkList.push(produk5);

// Array keranjang belanja
let keranjang = [];

// 2. DOM SELECTION (Memenuhi minimal 1x masing-masing)
const mainTitle = document.getElementById("main-title");                
const sectionTitles = document.getElementsByClassName("produk-section"); 
const containerProduk = document.querySelector("#daftar-produk");       
const btnCheckout = document.querySelectorAll("#btn-checkout")[0];     
const listKeranjang = document.getElementById("daftar-keranjang");
const containerTotal = document.getElementById("ringkasan-total");
const btnUndo = document.getElementById("btn-undo");
const btnClear = document.getElementById("btn-clear");
const areaRingkasan = document.getElementById("area-ringkasan");


// Funsi dan dom manipulassi
function tampilkanProduk() {
    containerProduk.innerHTML = "";

    for (let i = 0; i < produkList.length; i++) {
        const item = produkList[i];

        // Buat elemen card produk
        const card = document.createElement("div");
        card.className = "card-produk";

        // Ubah style jika stok habis
        if (item.stok === 0) {
            card.style.backgroundColor = "#ffe6e6"; 
            card.style.borderColor = "#ff4d4d";     
        }

        const infoDiv = document.createElement("div");
        
        // Menggunakan createTextNode & appendChild
        const titleEl = document.createElement("h4");
        const titleText = document.createTextNode(item.nama);
        titleEl.appendChild(titleText);

        const detailEl = document.createElement("p");
        const detailText = document.createTextNode(`Harga: Rp ${item.harga.toLocaleString()} | Stok: ${item.stok}`);
        detailEl.appendChild(detailText);

        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(detailEl);

        const btnTambah = document.createElement("button");
        btnTambah.className = "btn-tambah";
        btnTambah.appendChild(document.createTextNode("Tambah ke Keranjang"));
        btnTambah.onclick = function() {
            tambahKeKeranjang(item.id);
        };

        card.appendChild(infoDiv);
        card.appendChild(btnTambah);
        containerProduk.appendChild(card);
    }
}

function tambahKeKeranjang(idProduk) {
    const produk = produkList.find(p => p.id === idProduk);

    if (produk.stok <= 0) {
        alert(`Maaf, stok produk "${produk.nama}" sudah habis!`);
        return;
    }
    // Stok berkurang
    produk.stok--;
    
    keranjang.push({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga
    });

    updateTampilan();
}

// Hapus satu item dari keranjang menggunakan removeChild()
function hapusItemKeranjang(index) {
    // 4. Pop-up Box: confirm()
    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?");
    if (konfirmasi) {
        // Kembalikan stok
        const itemDihapus = keranjang[index];
        const produkAsli = produkList.find(p => p.id === itemDihapus.id);
        if (produkAsli) {
            produkAsli.stok++;
        }
        // Hapus dari array
        keranjang.splice(index, 1);
        updateTampilan();
    }
}

// Membatalkan item terakhir dengan pop()
btnUndo.onclick = function() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }
    // Pop item terakhir
    const itemDibatalkan = keranjang.pop();
    // Kembalikan stok produk
    const produkAsli = produkList.find(p => p.id === itemDibatalkan.id);
    if (produkAsli) {
        produkAsli.stok++;
    }
    updateTampilan();
};
// Mengosongkan keranjang 
btnClear.onclick = function() {
    if (keranjang.length === 0) return;

    if (confirm("Apakah Anda yakin ingin mengosongkan seluruh keranjang?")) {
        // Kembalikan semua stok
        for (let item of keranjang) {
            const produkAsli = produkList.find(p => p.id === item.id);
            if (produkAsli) produkAsli.stok++;
        }
        keranjang = [];
        updateTampilan();
    }
};

// 5. Menghitung total harga 
function hitungTotalHarga() {
    let total = 0;
    for (let i = 0; i < keranjang.length; i++) {
        total += keranjang[i].harga;
    }
    return total;
}

// Update tampilan DOM Keranjang & Total
function updateTampilan() {
    tampilkanProduk();
    listKeranjang.innerHTML = "";

    // Tampilkan item keranjang sebagai list 
    keranjang.forEach((item, index) => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(`${item.nama} - Rp ${item.harga.toLocaleString()}`));

        const btnHapus = document.createElement("button");
        btnHapus.className = "btn-hapus";
        btnHapus.appendChild(document.createTextNode("Hapus"));
        btnHapus.onclick = function() {
            // Menggunakan removeChild saat dihapus
            listKeranjang.removeChild(li);
            
            // Kembalikan stok & hapus data dari array
            const produkAsli = produkList.find(p => p.id === item.id);
            if (produkAsli) produkAsli.stok++;
            keranjang.splice(index, 1);
            
            updateTampilan();
        };

        li.appendChild(btnHapus);
        listKeranjang.appendChild(li);
    });

    // innerHTML untuk menampilkan jumlah item dan total harga
    const totalHarga = hitungTotalHarga();
    containerTotal.innerHTML = `
        <p>Jumlah Item: <strong>${keranjang.length}</strong></p>
        <p>Total Harga: <strong>Rp ${totalHarga.toLocaleString()}</strong></p>
    `;
}

// 4. Checkout dengan prompt() & join()
btnCheckout.onclick = function() {
    if (keranjang.length === 0) {
        alert("Keranjang Anda masih kosong!");
        return;
    }
    // Pop-up prompt()
    const namaPembeli = prompt("Masukkan Nama Pembeli untuk Checkout:");
    
    if (namaPembeli) {
        // Mengumpulkan daftar nama item ke dalam array string
        const daftarItemNama = [];
        for (let key in keranjang) { // Perulangan for...in
            daftarItemNama.push(keranjang[key].nama);
        }
        // Menggabungkan item menggunakan join()
        const ringkasanItemStr = daftarItemNama.join(", ");
        const totalHarga = hitungTotalHarga();

        // Tampilkan ringkasan pesanan di halaman
        areaRingkasan.innerHTML = `
            <div class="box-ringkasan">
                <h3>Ringkasan Pesanan</h3>
                <p><strong>Nama Pembeli:</strong> ${namaPembeli}</p>
                <p><strong>Daftar Item:</strong> ${ringkasanItemStr}</p>
                <p><strong>Total Bayar:</strong> Rp ${totalHarga.toLocaleString()}</p>
            </div>
        `;

        keranjang = [];
        updateTampilan();
    }
};

tampilkanProduk();
updateTampilan();