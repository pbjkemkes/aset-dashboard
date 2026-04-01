let topSatkerCharts = {};

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}

function generateTopChart(year){

   /* pastikan jQuery ada */
   if(typeof $ === "undefined"){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   /* pastikan DataTables sudah siap */
   if(!$.fn.dataTable){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   /* pastikan tabel sudah di-init */
   if(!$.fn.dataTable.isDataTable("#tabel"+year)){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   let table =
      $("#tabel"+year).DataTable();

   /* 🔥 ambil semua data internal */
   let allData =
      table.rows().data();

   if(!allData || allData.length === 0){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   let dataSatker = [];

   allData.each(function(row){

      if(!row) return;

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


/* jalankan setelah DataTables siap */

$(document).on("init.dt", function(){

   setTimeout(function(){

      generateTopChart("2026");
      generateTopChart("2025");
      generateTopChart("2024");

   },1000);

});
