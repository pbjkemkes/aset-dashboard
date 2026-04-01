/* ===================================== */
/* TOP 10 UNIT UTAMA ES1 (FINAL FIX)    */
/* ===================================== */

let topChartsUnit = {};


/* ===================================== */
/* GRADIENT                             */
/* ===================================== */

function createGradientUnit(ctx){

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
/* GENERATE PER TAHUN                   */
/* ===================================== */

function generateTopUnitChart(year){

   if(
      typeof allData === "undefined" ||
      allData.length === 0
   ){

      setTimeout(function(){

         generateTopUnitChart(year);

      },500);

      return;

   }


   let dataList = [];


   allData.forEach(function(row){

      let nama =
         row.es1;

      let persenRaw =
         row["persenpurch_"+year];

      if(
         persenRaw === null ||
         persenRaw === "" ||
         persenRaw === undefined
      ) return;


      let persen =
         normalizePercent(persenRaw);

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
         ".topUnitPurch"
      );

   if(!canvas) return;


   /* destroy lama */

   let chartKey =
      "unit"+year;

   if(topChartsUnit[chartKey]){

      topChartsUnit[chartKey].destroy();

   }


   let ctx =
      canvas.getContext("2d");

   let gradient =
      createGradientUnit(ctx);


   topChartsUnit[chartKey] =
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
/* GENERATE DEFAULT (2026)              */
/* ===================================== */

setTimeout(function(){

   generateTopUnitChart(2026);

},3000);


/* ===================================== */
/* GENERATE SAAT TAB DIKLIK             */
/* ===================================== */

document
.querySelectorAll(".tab-button")
.forEach(btn => {

   btn.addEventListener("click", function(){

      let year =
         this.dataset.year;

      setTimeout(function(){

         generateTopUnitChart(year);

      },400);

   });

});
