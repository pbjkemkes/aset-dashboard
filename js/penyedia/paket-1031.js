/* ===================================== */
/* GLOBAL DATA */
/* ===================================== */

let chartsTop = {};
let globalData = null;
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
/* FETCH DATA SEKALI */
/* ===================================== */

function fetchData(){

   $.ajax({

      url:
"https://script.google.com/macros/s/AKfycbzIOyGINvPCWa5lp0V2bZAeWaGeOH1xl4r3wHjnZwYF4L8kuhF9rDH9E1jSSShtj8vFGg/exec",

      method:"GET",

      dataType:"json",

      success:function(res){

         console.log("DATA LOADED:", res);

         globalData = res.data;

         // load tab pertama
         loadYear("2026");

      },

      error:function(err){

         console.error("ERROR LOAD DATA:", err);

      }

   });

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
/* GET TOP 10 */
/* ===================================== */

function getTop10(table, field){

   let data = [];

   table
   .rows({search:'applied'})
   .every(function(){

      let row =
         this.data();

      data.push({

         name :
            row.penyedia,

         value :
            parseInt(row[field]) || 0

      });

   });

   data.sort((a,b)=>b.value-a.value);

   return data.slice(0,10);

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

function updateTopChart(year, table, field){

   let top10 =
      getTop10(table, field);

   chartsTop[year].data.labels =
      top10.map(d=>d.name);

   chartsTop[year].data.datasets[0].data =
      top10.map(d=>d.value);

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

         /* 🔥 pakai data lokal */
         data: globalData,

         deferRender:true,
         processing:true,
         searchDelay:500,

         autoWidth:false,
         pageLength:25,

         columnDefs: [

           { width: "5%", targets: 0 },
           { width: "55%", targets: 1 },
           { width: "10%", targets: 2 },
           { width: "10%", targets: 3 },
           { width: "10%", targets: 4 },
           { width: "10%", targets: 5 },

           {
              targets:[0,2,3,4,5],
              className:"text-right"
           }

         ],

         columns:[

            {title:"No",data:"id"},
            {title:"Nama Penyedia",data:"penyedia"},
            {title:"Tender",data:tender},
            {title:"Non Tender",data:non},
            {title:"Purchasing",data:purch},
            {title:"Jumlah",data:total}

         ]

      });

   tables[year] = table;

   createTopChart(year);


   let mapping={

      tender:tender,
      nontender:non,
      purch:purch,
      total:total

   };


   table.on("draw",function(){

      let metode=
         document
         .getElementById("metode"+year)
         .value;

      updateTopChart(
         year,
         table,
         mapping[metode]
      );

   });


   document
   .getElementById("metode"+year)
   .addEventListener("change",function(){

      updateTopChart(
         year,
         table,
         mapping[this.value]
      );

   });

}



/* ===================================== */
/* START */
/* ===================================== */

$(document).ready(function(){

   fetchData();

});
