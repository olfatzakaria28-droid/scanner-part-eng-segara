const API_URL =
"https://script.google.com/macros/s/AKfycbyeZU9NN6tKiCGeV29s9LlpyS_UAlCiDxQ5zEhq_vSvxyjP7uTYxyeEk49G7H4vl1k14A/exec";

let tipe = "";
let barcode = "";
let namaBarang = "";
let stokSaatIni = 0;

loadLowStock();

async function api(data){

const response = await fetch(
API_URL,
{
method:"POST",
body:JSON.stringify(data)
}
);

return await response.json();

}

async function loadLowStock(){

try{

const items = await api({
action:"getLowStock"
});

let html = "";

if(items.length === 0){

html =
"<div class='warning'>✅ Semua stok aman</div>";

}else{

items.forEach(item=>{

html += `

<div class="warning">
<b>${item.nama}</b><br>
Stok : ${item.stok}<br>
Minimum : ${item.minStok}
</div>
`;

});

}

document.getElementById("lowStock").innerHTML =
html;

}catch(err){

document.getElementById("lowStock").innerHTML =
"Gagal memuat data";

console.error(err);

}

}

function startMenu(){

const nama =
document.getElementById("userName").value;

if(!nama){

alert("Masukkan nama pengguna");

return;

}

document
.getElementById("dashboard")
.classList.add("hidden");

document
.getElementById("menu")
.classList.remove("hidden");

}

async function startScan(t){

tipe = t;

document
.getElementById("menu")
.classList.add("hidden");

document
.getElementById("scanner")
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

await scanner.start(
cameras[0].id,
{
fps:10,
qrbox:250
},
async function(decodedText){

barcode = decodedText;

await scanner.stop();

const item =
await api({
action:"getItem",
barcode:barcode
});

if(!item.found){

alert("Barang tidak ditemukan");

location.reload();

return;

}

namaBarang = item.nama;
stokSaatIni = item.stok;

document
.getElementById("scanner")
.classList.add("hidden");

document
.getElementById("formArea")
.classList.remove("hidden");

document
.getElementById("namaBarang")
.innerHTML = item.nama;

document
.getElementById("stokBarang")
.innerHTML =
"Stok Saat Ini : " + item.stok;

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

const ket =
document.getElementById("keterangan").value;

const pic =
document.getElementById("userName").value;

if(!qty){

alert("Masukkan qty");

return;

}

try{

await api({

action:"save",

barcode:barcode,

nama:namaBarang,

qty:qty,

pic:pic,

keterangan:ket,

tipe:tipe

});

alert(
"Data berhasil disimpan"
);

location.reload();

}catch(err){

alert(
"Gagal menyimpan data"
);

console.error(err);

}

}
