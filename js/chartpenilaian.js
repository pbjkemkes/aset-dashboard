function createCharts(year,data){

let selesai = 0;
let gagal = 0;

let dinilai = 0;
let belum = 0;

data.forEach(function(row){

selesai += parseInt(row["tnt_selesai_"+year] || 0);
gagal += parseInt(row["tnt_gb_"+year] || 0);

dinilai += parseInt(row["tnt_sd_"+year] || 0);
belum += parseInt(row["tnt_bd_"+year] || 0);

});

/* SUMMARY */

let tntSelesai = data.reduce((sum,row)=> sum + parseInt(row["tnt_selesai_"+year] || 0),0);

let progress = 0;

if((dinilai + belum) > 0){
persentase = formatPercent(dinilai/(dinilai+belum));
}

document.querySelector("#tab"+year+" .tntSelesai").innerHTML = tntSelesai;
document.querySelector("#tab"+year+" .dinilai").innerHTML = dinilai;
document.querySelector("#tab"+year+" .belum").innerHTML = belum;
document.querySelector("#tab"+year+" .persentase").innerHTML = persentase + "%";

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
cutout:'50%',
plugins:{
legend:{
position:'bottom',
labels:{
boxWidth:12,
boxHeight:12
}
},
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

/* PIE PURCH */

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
cutout:'50%',
plugins:{
legend:{
position:'bottom',
labels:{
boxWidth:12,
boxHeight:12
}
},
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

function createTrendChart(data, canvas){

let years=[2024,2025,2026];
let values=[];

years.forEach(function(year){

let selesai=0;
let proses=0;

data.forEach(function(row){
selesai += parseInt(row["purch_selesai_"+year] || 0);
proses += parseInt(row["purch_proses_"+year] || 0);
});

let percent=0;

if((selesai+proses)>0){
percent=(selesai/(selesai+proses))*100;
}

values.push(percent.toFixed(2));

});

if(canvas.chart){
canvas.chart.destroy();
}

canvas.chart = new Chart(canvas,{

type:'line',

data:{
labels:["2024","2025","2026"],
datasets:[{
data:values,
borderColor:"#0b5394",
backgroundColor:"rgba(11,83,148,0.1)",
fill:true,
tension:0.3,
pointRadius:5,
pointHoverRadius:8,
hitRadius:20
}]
},

options:{
responsive:true,
plugins:{
legend:{display:false},
tooltip:{
callbacks:{
label:function(context){
return context.label + " : " + context.raw + "%";
}
}
}
},
scales:{
y:{
beginAtZero:true,
max:100,
ticks:{
callback:function(value){
return value+"%";
}
}
}
}
}

});
}
