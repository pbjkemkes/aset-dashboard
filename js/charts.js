function createCharts(data){

let selesaiTNT = 0;
let gagalTNT = 0;

let selesaiPurch = 0;
let prosesPurch = 0;

data.forEach(function(row){

selesaiTNT += parseInt(row.tnt_selesai_2024 || 0);
gagalTNT += parseInt(row.tnt_gb_2024 || 0);

selesaiPurch += parseInt(row.purch_selesai_2024 || 0);
prosesPurch += parseInt(row.purch_proses_2024 || 0);

});

/* SUMMARY */

let totalPaket = data.reduce((sum,row)=> sum + parseInt(row.rup_2024 || 0),0);

let progress = 0;

if((selesaiPurch + prosesPurch) > 0){
progress = formatPercent(selesaiPurch/(selesaiPurch+prosesPurch));
}


document.querySelector(".totalPaket").innerHTML = totalPaket;
document.querySelector(".tntSelesai").innerHTML = selesaiTNT;
document.querySelector(".purchSelesai").innerHTML = selesaiPurch;
document.querySelector(".progressPurch").innerHTML = progress + "%";


/* PIE TNT */

new Chart(document.getElementById("pieTNT"),{

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
maintainAspectRatio:false,
cutout:'55%',

plugins:{
legend:{position:'bottom'},

tooltip:{
callbacks:{
label:function(context){

let value = context.raw;
let dataArr = context.dataset.data;
let sum = dataArr.reduce((a,b)=>a+b,0);

let percentage = formatPercent(value/sum);

return percentage+"% ("+value+" paket)";

}
}
}
}
}

});


/* PIE PURCHASING */

new Chart(document.getElementById("piePurchasing"),{

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
maintainAspectRatio:false,
cutout:'55%',

plugins:{
legend:{position:'bottom'},

tooltip:{
callbacks:{
label:function(context){

let value = context.raw;
let dataArr = context.dataset.data;
let sum = dataArr.reduce((a,b)=>a+b,0);

let percentage = formatPercent(value/sum);

return percentage+"% ("+value+" paket)";

}
}
}
}
}

});

}
