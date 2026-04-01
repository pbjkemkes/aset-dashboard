let topSatkerCharts = {};

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}

function generateTopChart(year){

   if(typeof $ === "undefined"){

      setTimeout(function(){
         generateTopChart(year);
      },500);

      return;
   }

   if(!$.fn.dataTable){

      setTimeout(function(){
         generateTopChart(year);
      },500);

      return;
   }

   if(!$.fn.dataTable.isDataTable("#tabel"+year)){

      setTimeout(function(){
         generateTopChart(year);
      },500);

      return;
   }

   let table =
      $("#tabel"+year).DataTable();

   let totalPages =
      table.page.info().pages;

   let originalPage =
      table.page();

   let dataSatker = [];

   /* 🔥 loop semua halaman */
   for(let p=0; p<totalPages; p++){

      table.page(p).draw('page');

      let rows =
         table.rows({
            page:'current'
         }).data();

      rows.each(function(row){

         if(!row) return;

         let namaSatker =
            row[1];

         let persenText =
            row[row.length-1];

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

   }

   /* kembalikan halaman awal */
   table.page(originalPage).draw('page');

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


/* jalankan setelah tabel siap */

$(document).on("init.dt", function(){

   setTimeout(function(){

      generateTopChart("2026");
      generateTopChart("2025");
      generateTopChart("2024");

   },1000);

});
