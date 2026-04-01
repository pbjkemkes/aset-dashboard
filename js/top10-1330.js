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

   let tableId = "#tabel" + year;

   /* pastikan DataTable sudah ada */
   if(!$.fn.DataTable.isDataTable(tableId)) return;

   let table =
      $(tableId).DataTable();

   let allData =
      table.rows().data();

   if(!allData || allData.length === 0) return;

   let dataSatker = [];

   allData.each(function(row){

      if(!row) return;

      let namaSatker = row[1];

      /* kolom % purchasing (kolom terakhir) */
      let persen =
         row[row.length - 1];

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

   /* sorting */
   dataSatker.sort((a,b)=>b.nilai-a.nilai);

   let top10 =
      dataSatker.slice(0,10);

   let labels =
      top10.map(d=>d.nama);

   let values =
      top10.map(d=>d.nilai);

   let canvas =
      container.querySelector(
         "canvas.topSatkerPurch"
      );

   if(!canvas) return;

   if(canvas.offsetWidth === 0){

      setTimeout(function(){

         generateTopSatkerChart(container);

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


/* tunggu DataTables selesai */

$(document).ready(function(){

   setTimeout(function(){

      document
         .querySelectorAll(".tab-content")
         .forEach(container => {

            generateTopSatkerChart(container);

         });

   },3000);

});


/* update saat pindah tab */

document
.querySelectorAll(".tab-button")
.forEach(btn => {

   btn.addEventListener("click", function(){

      let year =
         this.dataset.year;

      setTimeout(function(){

         let container =
            document.getElementById(
               "tab"+year
            );

         generateTopSatkerChart(container);

      },800);

   });

});
