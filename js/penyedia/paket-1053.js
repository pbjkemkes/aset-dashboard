/* ===================================== */
/* GLOBAL */
/* ===================================== */

let chartsTop = {};
let tables = {};
let loadedTables = {};


/* ===================================== */
/* TAB SWITCH */
/* ===================================== */

function openTab(evt, tabId){

   let contents =
      document.querySelectorAll(".tab-content");

   let buttons =
      document.querySelectorAll(".tab-button");

   contents.forEach(c =>
      c.classList.remove("active"));

   buttons.forEach(b =>
      b.classList.remove("active"));

   document
      .getElementById(tabId)
      .classList.add("active");

   evt.currentTarget
      .classList.add("active");

   let year =
      tabId.replace("tab","");

   loadYear(year);

}



/* ===================================== */
/* LOAD YEAR */
/* ===================================== */

function loadYear(year){

   if (loadedTables[year]) return;

   if (year === "2026") {

      initTable(
         "2026",
         "jml_tender_2026",
         "jml_nontender_2026",
         "jml_purch_2026",
         "jml_paket_2026"
      );

   }

   if (year === "2025") {

      initTable(
         "2025",
         "jml_tender_2025",
         "jml_nontender_2025",
         "jml_purch_2025",
         "jml_paket_2025"
      );

   }

   if (year === "2024") {

      initTable(
         "2024",
         "jml_tender_2024",
         "jml_nontender_2024",
         "jml_purch_2024",
         "jml_paket_2024"
      );

   }

   loadedTables[year] = true;

}



/* ===================================== */
/* CREATE CHART */
/* ===================================== */

function createTopChart(year){

   let ctx =
      document
      .getElementById("chartTop"+year)
      .getContext("2d");

   chartsTop[year] =
      new Chart(ctx,{

         type:"bar",

         data:{
            labels:[],
            datasets:[{
               data:[],
               borderRadius:6,
               barThickness:18
            }]
         },

         options:{

            indexAxis:"y",

            layout:{
               padding:{
                  right:60
               }
            },

            scales:{
               x:{
                  grace:'10%'
               }
            },

            plugins:{
               legend:{display:false},

               datalabels:{
                  anchor:"end",
                  align:"right",
                  clip:false
               }
            }

         },

         plugins:[ChartDataLabels]

      });

}



/* ===================================== */
/* UPDATE CHART */
/* ===================================== */

function updateTopChart(year){

   let table =
      tables[year];

   let metode =
      document
      .getElementById("metode"+year)
      .value;

   let data =
      table.rows({search:'applied'})
      .data()
      .toArray();

   data.sort((a,b)=>
      (b[metode]||0) -
      (a[metode]||0)
   );

   let top10 =
      data.slice(0,10);

   chartsTop[year].data.labels =
      top10.map(d=>d.penyedia);

   chartsTop[year].data.datasets[0].data =
      top10.map(d=>d[metode]);

   chartsTop[year].update();

}



/* ===================================== */
/* INIT TABLE */
/* ===================================== */

function initTable(
   year,
   tender,
   non,
   purch,
   total
){

   let table =
      $("#"+year).DataTable({

         /* 🔥 SERVER SIDE */

         serverSide:true,
         processing:true,

         ajax:{
            url:
"https://script.google.com/macros/s/AKfycbzOB4mpsejQ-d6Tsl58_EZdiSRQaW0ZqtbHdbF8c9QqG1MsmPVQuG1xPDqHcFhdTC0BhA/exec",
            type:"GET"
         },

         pageLength:25,

         deferRender:true,

         autoWidth:false,

         columnDefs:[

           { width:"5%", targets:0 },
           { width:"55%", targets:1 },
           { width:"10%", targets:2 },
           { width:"10%", targets:3 },
           { width:"10%", targets:4 },
           { width:"10%", targets:5 },

           {
              targets:[0,2,3,4,5],
              className:"text-right"
           }

         ],

         columns:[

            {data:"id"},
            {data:"penyedia"},
            {data:tender},
            {data:non},
            {data:purch},
            {data:total}

         ]

      });

   tables[year] = table;

   createTopChart(year);


   table.on("draw",function(){

      updateTopChart(year);

   });


   document
   .getElementById("metode"+year)
   .addEventListener("change",function(){

      updateTopChart(year);

   });

}



/* ===================================== */
/* START */
/* ===================================== */

$(document).ready(function(){

   loadYear("2026");

});
