/* ===================================== */
/* TOP 10 SATKER PURCHASING             */
/* ===================================== */

let topCharts = {};


/* ===================================== */
/* GRADIENT                             */
/* ===================================== */

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}


/* ===================================== */
/* NORMALISASI PERSEN                   */
/* ===================================== */

function normalizePercent(val){

   let persen =
      parseFloat(val);

   if(isNaN(persen))
      return null;

   if(persen <= 1){

      persen =
         persen * 100;

   }

   if(persen > 100){

      persen = 100;

   }

   persen =
      Math.round(persen * 100) / 100;

   return persen;

}


/* ===================================== */
/* GENERATE CHART                       */
/* ===================================== */

function generateTopChart(year){

   if(
      typeof allData === "undefined" ||
      allData.length === 0
   ){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }


   let dataList = [];


   allData.forEach(function(row){

      let nama =
         row.satker;   /* 🔥 ini yang benar */

      let persenRaw =
         row["persenpurch_"+year];

      if(
         persenRaw === null ||
         persenRaw === "" ||
         persenRaw === undefined
      ) return;


      let persen =
         normalizePercent(
            persenRaw
         );

      if(persen === null) return;


      dataList.push({

         nama  : nama,
         nilai : persen

      });

   });


   if(dataList.length === 0)
      return;


   /* sorting */

   dataList.sort(function(a,b){

      return b.nilai - a.nilai;

   });


   let top10 =
      dataList.slice(0,10);


   let labels =
      top10.map(d => d.nama);

   let values =
      top10.map(d => d.nilai);


   let container =
      document.getElementById(
         "tab"+year
      );

   if(!container) return;


   let canvas =
      container.querySelector(
         ".topSatkerPurch"
      );

   if(!canvas) return;


   if(canvas.offsetWidth === 0){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }


   let chartKey =
      "satker" + year;


   if(topCharts[chartKey]){

      topCharts[chartKey].destroy();

   }


   let ctx =
      canvas.getContext("2d");


   let gradient =
      createGradient(ctx);


   topCharts[chartKey] =
      new Chart(ctx, {

         type : "bar",

         data : {

            labels : labels,

            datasets : [{

               data : values,

               backgroundColor : gradient,

               borderRadius : 6,

               barThickness : 18

            }]

         },


         options : {

            indexAxis : "y",

            responsive : true,


            plugins : {

               legend : {

                  display : false

               },


               datalabels : {

                  anchor : "end",

                  align : "right",

                  formatter : function(value){

                     return value
                        .toFixed(2) + "%";

                  }

               }

            },


            scales : {

               x : {

                  beginAtZero : true,

                  max : 100

               }

            }

         },


         plugins :

            typeof ChartDataLabels !== "undefined"

            ? [ChartDataLabels]

            : []

      });

}


/* ===================================== */
/* START                                */
/* ===================================== */

function startTopCharts(){

   [2026,2025,2024].forEach(function(year){

      generateTopChart(year);

   });

}


setTimeout(function(){

   startTopCharts();

},2500);
