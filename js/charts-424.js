function createCharts(year,data){

let selesaiTNT = 0;
let gagalTNT = 0;

let selesaiPurch = 0;
let prosesPurch = 0;

data.forEach(function(row){

selesaiTNT += parseInt(row["tnt_selesai_"+year] || 0);
gagalTNT += parseInt(row["tnt_gb_"+year] || 0);

selesaiPurch += parseInt(row["purch_selesai_"+year] || 0);
prosesPurch += parseInt(row["purch_proses_"+year] || 0);

});

/* SUMMARY */

let totalPaket = data.reduce((sum,row)=> sum + parseInt(row["rup_"+year] || 0),0);

let progress = 0;

if((selesaiPurch + prosesPurch) > 0){
progress = formatPercent(selesaiPurch/(selesaiPurch+prosesPurch));
}

document.querySelector("#tab"+year+" .totalPaket").innerHTML = totalPaket;
document.querySelector("#tab"+year+" .tntSelesai").innerHTML = selesaiTNT;
document.querySelector("#tab"+year+" .purchSelesai").innerHTML = selesaiPurch;
document.querySelector("#tab"+year+" .progressPurch").innerHTML = progress + "%";

/* PIE TNT */

new Chart(document.querySelector("#tab"+year+" .pieTNT"),{
type:'doughnut',
data:{
labels:['Selesai','Gagal/Batal'],
datasets:[{
data:[selesaiTNT,gagalTNT],
backgroundColor:['#0b5394','#d9534f']
}]
},
options:{
responsive:true,
cutout:'55%',
plugins:{legend:{position:'bottom'}}
}
});

/* PIE PURCH */

new Chart(document.querySelector("#tab"+year+" .piePurch"),{
type:'doughnut',
data:{
labels:['Selesai','Proses'],
datasets:[{
data:[selesaiPurch,prosesPurch],
backgroundColor:['#28a745','#f0ad4e']
}]
},
options:{
responsive:true,
cutout:'55%',
plugins:{legend:{position:'bottom'}}
}
});

}
