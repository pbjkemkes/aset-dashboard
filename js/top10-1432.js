/* ============================= */
/* TOP 10 SATKER PURCHASING     */
/* ============================= */

let topSatkerCharts = {};


/* ============================= */
/* GRADIENT WARNA BAR           */
/* ============================= */

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}


/* ============================= */
/* GENERATE TOP 10 CHART        */
/* ============================= */

function generateTopChart(year){

   /* tunggu data global siap */

   if(
      typeof allData === "undefined" ||
      allData.length === 0
   ){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }


   let dataSatker = [];


   /* ============================= */
   /* AMBIL DATA DARI allData       */
   /* ============================= */

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


      /* konversi ke persen */

      persen =
         parseFloat(persen) * 100;


      if(isNaN(persen)) return;


      /* bulatkan 2 digit */

      persen =
         Math.round(persen * 100) / 100;


      dataSatker.push({

         nama  : namaSatker,
         nilai : persen

      });

   });


   if(dataSatker.length === 0)
      return;


   /* ============================= */
   /* SORTING GLOBAL                */
   /* ============================= */

   dataSatker.sort(function(a,b){

      return b.nilai - a.nilai;

   });


   let top10 =
      dataSatker.slice(0,10);


   let labels =
      top10.map(function(d){

         return d.nama;

      });


   let values =
      top10.map(function(d){

         return d.nilai;

      });


   /* ============================= */
   /* CARI CANVAS                   */
   /* ============================= */

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


   /* tunggu canvas visible */

   if(canvas.offsetWidth === 0){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }


   /* destroy chart lama */

   if(topSatkerCharts[year]){

      topSatkerCharts[year].destroy();

   }


   let ctx =
      canvas.getContext("2d");


   let gradient =
      createGradient(ctx);


   /* ============================= */
   /* CREATE CHART                  */
   /* ============================= */

   topSatkerCharts[year] =
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

               },


               tooltip : {

                  callbacks : {

                     label : function(context){

                        return context.raw
                           .toFixed(2) + "%";

                     }

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


/* ============================= */
/* AUTO RUN SETELAH DATA LOAD   */
/* ============================= */

function startTopCharts(){

   generateTopChart(2026);

   generateTopChart(2025);

   generateTopChart(2024);

}


/* delay agar data API siap */

setTimeout(function(){

   startTopCharts();

},2500);
