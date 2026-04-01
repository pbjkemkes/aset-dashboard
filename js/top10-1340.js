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

   /* pastikan DataTable sudah jadi */
   if(!window.jQuery) return;

   if(!$.fn || !$.fn.dataTable) return;

   if(!$.fn.dataTable.isDataTable(tableId)){

      setTimeout(function(){

         generateTopSatkerChart(container);

      },500);

      return;

   }

   let table =
      $(tableId).DataTable();

   /* 🔥 ambil SEMUA DATA */
   let allData =
      table.rows({ search:'none' }).data();

   if(!allData || allData.length === 0){

      setTimeout(function(){

         generateTopSatkerChart(container);

      },500);

      return;

   }

   let dataSatker = [];

   allData.each(function(row){

      if(!row || row.length < 2) return;

      let namaSatker =
         row[1];

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

   /* urut global */
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


/* 🔥 jalankan SETELAH data masuk */

$(document).on('init.dt', function(){

   setTimeout(function(){

      document
         .querySelectorAll(".tab-content")
         .forEach(container => {

            generateTopSatkerChart(container);

         });

   },1500);

});


/* update saat search/pagination */

$(document).on('draw.dt', function(){

   document
      .querySelectorAll(".tab-content")
      .forEach(container => {

         generateTopSatkerChart(container);

      });

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

      },500);

   });

});
