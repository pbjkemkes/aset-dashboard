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

function initTable(year){

$("#tabel"+year).DataTable({

orderCellsTop:true,
fixedHeader:true,
dom:'lBfrtip',

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
title:'Paket_Pengadaan_'+year
},

{
extend:'csvHtml5',
text:'<i class="fa fa-file-csv"></i> CSV',
title:'Paket_Pengadaan_'+year
},

{
extend:'pdfHtml5',
text:'<i class="fa fa-file-pdf"></i> PDF',
orientation:'landscape',
title:'Paket Pengadaan Tahun '+year
},

{
extend:'print',
text:'<i class="fa fa-print"></i> Print',
title:'Paket Pengadaan Tahun '+year
}

]
}],

ajax:{
url:"https://script.google.com/macros/s/AKfycbxJEv8oYlmMbPfO8-C52ZI1INwf-3UXeeq3jIfpDbgiKaLMQsdgL_UMTprhlBEacKgW/exec",

dataSrc:function(json){

let data=json.data;

updateSummary(year,data);
createCharts(year,data);

return data;

}

},

pageLength:10,

columnDefs:[
{
className:"dt-right",
targets:[2,3,4,5,6,7,8,9,10,11]
}
],

columns:[

{data:"id"},
{data:"satker"},

{data:"rup_"+year},
{data:"rup_tender_"+year},
{data:"rup_nontender_"+year},
{data:"rup_catat_"+year},
{data:"rup_purch_"+year},

{data:"tnt_selesai_"+year},
{data:"tnt_gb_"+year},

{data:"purch_selesai_"+year},
{data:"purch_proses_"+year},

{
data:"%purch_"+year,

render:function(data){

if(data===null) return "";

let num=parseFloat(formatPercent(data));
let display=formatPercent(data);

if(num>=80)
return '<span style="color:#2e7d32;font-weight:bold">'+display+'%</span>';

if(num>=50)
return '<span style="color:#f9a825;font-weight:bold">'+display+'%</span>';

return '<span style="color:#c62828;font-weight:bold">'+display+'%</span>';

}

}

]

});

}

$(document).ready(function(){

initTable(2024);
initTable(2025);
initTable(2026);

});
