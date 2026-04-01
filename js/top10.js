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

   if(!data.data) return;

   let rawData = data.data;

   if(rawData.length === 0) return;

   let dataSatker = [];

   rawData.forEach(function(row){

      if(!row) return;

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

   let canvas =
      container.querySelector(".topSatkerPurch");

   if(!canvas) return;

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

      plugins: [ChartDataLabels]

   });

}


/* tunggu data siap */

function waitDataReady(){

   if(
      typeof data !== "undefined"
      && data.data
      && data.data.length > 0
   ){

      document.querySelectorAll(".tab-content")
         .forEach(container => {

            generateTopSatkerChart(container);

         });

   }else{

      setTimeout(waitDataReady,500);

   }

}

waitDataReady();
