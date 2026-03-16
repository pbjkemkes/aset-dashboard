var exportHeader = [
"No",
"Satuan Kerja",
"Jumlah Paket (RUP)",
"Tender (RUP)",
"Non Tender (RUP)",
"Pencatatan Non Tender (RUP)",
"Purchasing (RUP)",
"Tender/Non Tender Selesai",
"Tender/Non Tender Gagal/Batal",
"Purchasing Selesai",
"Purchasing Proses",
"% Purchasing"
];


$(document).ready(function(){

$("#tabel2024").DataTable({

orderCellsTop:true,

dom:'lBfrtip',

//initComplete:function(settings,json){
//createCharts(json.data);
//},

language:{
lengthMenu:"Tampilkan _MENU_ data per halaman",
zeroRecords:"Data tidak ditemukan",
info:"Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
infoEmpty:"Tidak ada data",
infoFiltered:"(disaring dari _MAX_ total data)",
search:"Cari:",
paginate:{
first:"Awal",
last:"Akhir",
next:"Berikutnya",
previous:"Sebelumnya"
}
},

buttons:[{
extend:'collection',
text:'<i class="fa fa-download"></i> Unduh',
className:'btn btn-primary btn-sm',

buttons:[

{
extend:'excelHtml5',
text:'<i class="fa fa-file-excel"></i> Excel',
title:'Paket_Pengadaan_2024'
},

{
extend:'csvHtml5',
text:'<i class="fa fa-file-csv"></i> CSV',
title:'Paket_Pengadaan_2024'
},

{
extend:'pdfHtml5',
text:'<i class="fa fa-file-pdf"></i> PDF',
orientation:'landscape',
title:'Paket Pengadaan Tahun 2024'
},

{
extend:'print',
text:'<i class="fa fa-print"></i> Print',
title:'Paket Pengadaan Tahun 2024'
}

]
}],

ajax:"https://script.google.com/macros/s/AKfycbxJEv8oYlmMbPfO8-C52ZI1INwf-3UXeeq3jIfpDbgiKaLMQsdgL_UMTprhlBEacKgW/exec",

dataSrc:function(json){

createCharts(json.data);
updateSummary(json.data);

return json.data;

}

},
  
pageLength:10,

columnDefs:[
{ className:"dt-right", targets:[0,2,3,4,5,6,7,8,9,10,11] }
],

columns:[
{data:"id"},
{data:"satker"},
{data:"rup_2024"},
{data:"rup_tender_2024"},
{data:"rup_nontender_2024"},
{data:"rup_catat_2024"},
{data:"rup_purch_2024"},
{data:"tnt_selesai_2024"},
{data:"tnt_gb_2024"},
{data:"purch_selesai_2024"},
{data:"purch_proses_2024"},
{
data:"%purch_2024",
render:function(data){

if(data === null) return "";

let num = parseFloat(formatPercent(data));
let display = formatPercent(data);

if(num >= 80)
return '<span style="color:#2e7d32;font-weight:bold">'+display+'%</span>';

if(num >= 50)
return '<span style="color:#f9a825;font-weight:bold">'+display+'%</span>';

return '<span style="color:#c62828;font-weight:bold">'+display+'%</span>';

}
}
]

});

});
