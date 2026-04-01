let topSatkerCharts = {};

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}

function generateTopChart(year){

   /* pastikan data sudah ada */
   if(typeof allData === "undefined" || allData.length === 0){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   let dataSatker = [];

   allData.forEach(function(row){

      let namaSatker =
         row.satker;

      let persen =
         row["persenpurch_"+year];

      if(
         persen === null ||
         persen === "" ||
         persen === undefined
      ) return;

      persen = parseFloat(persen);

      if(isNaN(persen)) return;

      dataSatker.push({

         nama:namaSatker,
         nilai:persen

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

   let container =
      document.getElementById("tab"+year);

   if(!container) return;

   let canvas =
      container.querySelector(".topSatkerPurch");

   if(!canvas) return;

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

         type:"bar",

         data:{

            labels:labels,

            datasets:[{

               data:values,

               backgroundColor:gradient,
               borderRadius:6,
               barThickness:18

            }]

         },

         options:{

            indexAxis:"y",

            responsive:true,

            plugins:{

               legend:{display:false},

               datalabels:{

                  anchor:"end",
                  align:"right",

                  formatter:function(v){

                     return v+"%";

                  }

               }

            },

            scales:{

               x:{
                  beginAtZero:true,
                  max:100
               }

            }

         },

         plugins:
            typeof ChartDataLabels !== "undefined"
            ? [ChartDataLabels]
            : []

      });

}


/* jalankan setelah data siap */

setTimeout(function(){

   generateTopChart(2026);
   generateTopChart(2025);
   generateTopChart(2024);

},2500);
