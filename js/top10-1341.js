let topSatkerCharts = {};

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}

function generateTopSatker(year){

   let datasetName = "data" + year;

   if(typeof window[datasetName] === "undefined"){

      setTimeout(function(){

         generateTopSatker(year);

      },500);

      return;

   }

   let rawData = window[datasetName];

   if(!rawData || rawData.length === 0) return;

   let dataSatker = [];

   rawData.forEach(function(row){

      if(!row || row.length < 2) return;

      let namaSatker = row[1];

      let persenText =
         row[row.length - 1];

      if(!persenText) return;

      let persen =
         persenText
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

   let top10 =
      dataSatker.slice(0,10);

   let labels =
      top10.map(d=>d.nama);

   let values =
      top10.map(d=>d.nilai);

   let container =
      document.getElementById("tab"+year);

   if(!container) return;

   let canvas =
      container.querySelector(
         "canvas.topSatkerPurch"
      );

   if(!canvas) return;

   if(canvas.offsetWidth === 0){

      setTimeout(function(){

         generateTopSatker(year);

      },500);

      return;

   }

   if(topSatkerCharts[year]){

      topSatkerCharts[year].destroy();

   }

   let ctx =
      canvas.getContext("2d");

   let gradient =
      createGradient(ctx);

   topSatkerCharts[year] =
      new Chart(ctx, {

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

               legend: {
                  display: false
               },

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


/* jalankan untuk semua tahun */

function startTopCharts(){

   generateTopSatker("2026");
   generateTopSatker("2025");
   generateTopSatker("2024");

}

setTimeout(startTopCharts,2000);
