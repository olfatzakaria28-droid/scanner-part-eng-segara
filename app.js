const API_URL =
"https://script.google.com/macros/s/AKfycbwAyTRvVJ6zgjWb6x_ST0Spr-RHzj74QEQMcQq_0QhNWnPunWz8dJg0eGs6hrZFi5VHKQ/exec";

let tipe = "";
let kode = "";
let userName = "";

let itemData = {};

async function api(payload){

const response = await fetch(
API_URL,
{
method:"POST",
body:JSON.stringify(payload)
}
);

return await response.json();

}

function showMenu(){

userName =
document.getElementById("userName").value;

if(!userName){

alert("Masukkan nama");

return;

}

document
.getElementById("stepUser")
.classList.add("hidden");

document
.getElementById("stepMenu")
.classList.remove("hidden");

}

async function startScan(transactionType){

tipe = transactionType;

document
.getElementById("stepMenu")
.classList.add("hidden");

document
.getElementById("stepScanner")
.classList.remove("hidden");

try{

const scanner =
new Html5Qrcode("reader");

const cameras =
await Html5Qrcode.getCameras();

if(cameras.length === 0){

alert("Kamera tidak ditemukan");

return;

}

let selectedCamera = null;

for(const cam of cameras){

const label =
cam.label.toLowerCase();

if(
label.includes("back") ||
label.includes("rear") ||
label.includes("environment")
){

selectedCamera = cam.id;

break;

}

}

if(!selectedCamera){

selectedCamera =
cameras[cameras.length - 1].id;

}

await scanner.start(

selectedCamera,

{
fps:10,
qrbox:250
},

async function(decodedText){

kode = decodedText;

await scanner.stop();

const item =
await api({

action:"getItem",

kode:kode

});

if(!item.found){

alert("Barang tidak ditemukan");

location.reload();

return;

}

itemData = item;

document
.getElementById("stepScanner")
.classList.add("hidden");

document
.getElementById("stepForm")
.classList.remove("hidden");

document
.getElementById("namaBarang")
.innerHTML =
item.nama;

document
.getElementById("kategoriBarang")
.innerHTML =
"Kategori : " +
item.kategori;

document
.getElementById("stokBarang")
.innerHTML =
"Stok Saat Ini : " +
item.stok;

}

);

}catch(err){

alert(
"Gagal membuka kamera : " +
err.message
);

console.error(err);

}

}

async function saveData(){

const qty =
document.getElementById("qty").value;

const keterangan =
document.getElementById("keterangan").value;

if(!qty){

alert("Masukkan jumlah");

return;

}

const result =
await api({

action:"save",

kode:kode,

nama:itemData.nama,

kategori:itemData.kategori,

qty:qty,

pic:userName,

tipe:tipe,

keterangan:keterangan

});

if(result.success){

alert(
"Data berhasil disimpan\n" +
"Stok sekarang : " +
result.stokBaru
);

location.reload();

}else{

alert("Gagal menyimpan");

}

}
