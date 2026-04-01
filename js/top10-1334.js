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

   let table =
      container.querySelector("table");

   if(!table) return;

   let rows =
      table.querySelectorAll("tbody tr");

   if(rows.length === 0){

      setTimeout(function(){

         generateTopSatkerChart(container);

      },500);

      return;

   }

   let dataSatker = [];

   rows.forEach(row => {

      let cols =
         row.querySelectorAll("td");

      if(cols.length < 2) return;

      let namaSatker =
         cols[1].innerText;

      /* kolom % paling kanan */
      let persenText =
         cols[cols.length - 1]
         .innerText;

      if(!persenText) return;

      let persen =
         persenText
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


/* jalankan setelah tabel terisi */

function waitTableReady(){

   document
      .querySelectorAll(".tab-content")
      .forEach(container => {

         generateTopSatkerChart(container);

      });

   setTimeout(waitTableReady,2000);

}

waitTableReady();


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
