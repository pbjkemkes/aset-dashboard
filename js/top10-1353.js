let topSatkerCharts = {};

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}

function waitForTable(year){

   let table =
      document.querySelector(
         "#tabel" + year
      );

   if(!table){

      setTimeout(function(){

         waitForTable(year);

      },500);

      return;

   }

   generateTopChart(year);

}

function generateTopChart(year){

   let container =
      document.getElementById(
         "tab" + year
      );

   if(!container) return;

   let canvas =
      container.querySelector(
         ".topSatkerPurch"
      );

   if(!canvas) return;

   if(typeof $ === "undefined"){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   let tableObj =
      $("#tabel"+year).dataTable();

   if(!tableObj){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   /* 🔥 ambil semua data internal */
   let settings =
      tableObj.fnSettings();

   let allData =
      settings.aoData;

   if(!allData || allData.length === 0){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   let dataSatker = [];

   allData.forEach(row => {

      let data =
         row._aData;

      if(!data) return;

      let namaSatker =
         data[1];

      let persenText =
         data[data.length - 1];

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

   /* sorting global */
   dataSatker.sort((a,b)=>b.nilai-a.nilai);

   let top10 =
      dataSatker.slice(0,10);

   let labels =
      top10.map(d=>d.nama);

   let values =
      top10.map(d=>d.nilai);

   if(canvas.offsetWidth === 0){

      setTimeout(function(){

         generateTopChart(year);

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


/* jalankan */

setTimeout(function(){

   waitForTable("2026");
   waitForTable("2025");
   waitForTable("2024");

},2000);
