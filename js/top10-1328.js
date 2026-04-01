let topSatkerCharts = {};

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}

function generateTopSatkerChart(container){

   let year = container.dataset.year;

   if(typeof data === "undefined") return;

   let rawData = data.data || data;

   if(!rawData || rawData.length === 0) return;

   let canvas =
      container.querySelector("canvas.topSatkerPurch");

   if(!canvas) return;

   /* kalau tab belum visible */
   if(canvas.offsetWidth === 0){

      setTimeout(function(){

         generateTopSatkerChart(container);

      },500);

      return;

   }

   let dataSatker = [];

   rawData.forEach(function(row){

      if(!row || row.length < 2) return;

      let namaSatker = row[1];

      let persen = row[row.length - 1];

      if(!persen) return;

      persen = persen
         .toString()
         .replace("%","")
         .replace(",",".")
         .trim();

      persen = parseFloat(persen);

      if(isNaN(persen)) return;

      dataSatker.push({

         nama : namaSatker,
         nilai : persen

      });

   });

   if(dataSatker.length === 0) return;

   dataSatker.sort((a,b)=>b.nilai-a.nilai);

   let top10 = dataSatker.slice(0,10);

   let labels = top10.map(d=>d.nama);
   let values = top10.map(d=>d.nilai);

   if(topSatkerCharts[year]){

      topSatkerCharts[year].destroy();

   }

   let ctx = canvas.getContext("2d");

   let gradient = createGradient(ctx);

   topSatkerCharts[year] = new Chart(ctx, {

      type: "bar",

      data: {

         labels: labels,

         datasets: [{

            data: values,

            backgroundColor: gradient,
            borderRadius: 6,
            barThickness: 18

         }]

      },

      options: {

         indexAxis: "y",

         responsive: true,

         plugins: {

            legend: { display: false },

            datalabels: {

               anchor: "end",
               align: "right",

               formatter: function(value){

                  return value + "%";

               }

            }

         },

         scales: {

            x: {

               beginAtZero: true,
               max: 100

            }

         }

      },

      plugins:
         typeof ChartDataLabels !== "undefined"
         ? [ChartDataLabels]
         : []

   });

}


/* load pertama */

$(document).ready(function(){

   setTimeout(function(){

      document.querySelectorAll(".tab-content")
         .forEach(container => {

            generateTopSatkerChart(container);

         });

   },2500);

});


/* saat pindah tab */

document.querySelectorAll(".tab-button")
   .forEach(btn => {

      btn.addEventListener("click", function(){

         let year = this.dataset.year;

         setTimeout(function(){

            let container =
               document.getElementById("tab"+year);

            generateTopSatkerChart(container);

         },500);

      });

   });
