let tables = {};
let chartsTop = {};
let loadedTables = {};

const URL_EXEC =
"https://script.google.com/macros/s/AKfycbzOB4mpsejQ-d6Tsl58_EZdiSRQaW0ZqtbHdbF8c9QqG1MsmPVQuG1xPDqHcFhdTC0BhA/exec";



/* ============================= */
/* TAB */
/* ============================= */

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



/* ============================= */
/* LOAD YEAR */
/* ============================= */

function loadYear(year){

   if (loadedTables[year]) return;

   initTable(year);

   createTopChart(year);

   loadTop10(year);

   document
     .getElementById("metode"+year)
     .addEventListener("change",function(){

        loadTop10(year);

     });

   loadedTables[year] = true;

}



/* ============================= */
/* DATATABLE */
/* ============================= */

function initTable(year){

   tables[year] =
      $("#"+year).DataTable({

         serverSide:true,
         processing:true,

         searching:false,

         ajax:{
            url:URL_EXEC,
            type:"GET"
         },

         pageLength:25,

         columns:[

            {title:"No",data:"id"},

            {title:"Nama Penyedia",data:"penyedia"},

            {
              title:"Tender",
              data:"jml_tender_"+year
            },

            {
              title:"Non Tender",
              data:"jml_nontender_"+year
            },

            {
              title:"Purchasing",
              data:"jml_purch_"+year
            },

            {
              title:"Jumlah",
              data:"jml_paket_"+year
            }

         ]

      });

}



/* ============================= */
/* CREATE CHART */
/* ============================= */

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
               borderRadius:6
            }]
         },

         options:{
            indexAxis:"y",
            responsive:true,
            plugins:{
               legend:{
                  display:false
               }
            }
         }

      });

}



/* ============================= */
/* LOAD TOP10 */
/* ============================= */

function loadTop10(year){

   let metode =
     document
       .getElementById("metode"+year)
       .value;

   $.getJSON(

      URL_EXEC+
      "?action=top10"+
      "&year="+year+
      "&metode="+metode,

      function(res){

         chartsTop[year].data.labels =
            res.map(d=>d.name);

         chartsTop[year].data.datasets[0].data =
            res.map(d=>d.value);

         chartsTop[year].update();

      }

   );

}



/* ============================= */
/* START */
/* ============================= */

$(document).ready(function(){

   loadYear("2026");

});
