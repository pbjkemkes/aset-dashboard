/* ===================================== */
/* TAB SWITCH                            */
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

}



/* ===================================== */
/* GRADIENT                              */
/* ===================================== */

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}



let chartsTop = {};



/* ===================================== */
/* GET TOP 10                            */
/* ===================================== */

function getTop10(table, field){

   let data = [];

   table.rows().every(function(){

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
/* CREATE CHART                          */
/* ===================================== */

function createTopChart(year){

   let ctx =
      document
      .getElementById("chartTop"+year)
      .getContext("2d");

   let gradient =
      createGradient(ctx);

   chartsTop[year] =
      new Chart(ctx,{

         type:"bar",

         data:{
            labels:[],
            datasets:[{

               data:[],
               backgroundColor:gradient,
               borderRadius:6,
               barThickness:18

            }]
         },

         options:{

            indexAxis:"y",

            plugins:{
               legend:{display:false},

               datalabels:{
                  anchor:"end",
                  align:"right"
               }
            }

         },

         plugins:[ChartDataLabels]

      });

}



/* ===================================== */
/* UPDATE CHART                          */
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
/* INIT TABLE                            */
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

         ajax:
"https://script.google.com/macros/s/AKfycbzIOyGINvPCWa5lp0V2bZAeWaGeOH1xl4r3wHjnZwYF4L8kuhF9rDH9E1jSSShtj8vFGg/exec",

         autoWidth: false,
         pageLength:25,

         columnDefs: [
           { width: "5%", targets: 0 },
           { width: "55%", targets: 1 },
           { width: "10%", targets: 2 },
           { width: "10%", targets: 3 },
           { width: "10%", targets: 4 },
           { width: "10%", targets: 5 },
         ],

         /* 🔥 LABEL INDONESIA */

         language:{
            processing:"Memproses...",
            search:"Cari:",
            lengthMenu: "Tampilkan _MENU_ data",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            infoEmpty:  "Menampilkan 0 sampai 0 dari 0 data",
            infoFiltered: "(disaring dari _MAX_ total data)",
            loadingRecords: "Memuat...",
            zeroRecords: "Tidak ditemukan data yang sesuai",
            emptyTable: "Tidak ada data tersedia",

            paginate:{
               first:"Pertama",
               previous:"Sebelumnya",
               next:"Berikutnya",
               last:"Terakhir"
            }

         },


         columns:[

            {title:"No",data:"id"},
            {title:"Nama Penyedia",data:"penyedia"},
            {title:"Tender",data:tender},
            {title:"Non Tender",data:non},
            {title:"Purchasing",data:purch},
            {title:"Jumlah",data:total}

         ]

      });


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
/* START                                 */
/* ===================================== */

$(document).ready(function(){

   initTable(
      "2026",
      "jml_tender_2026",
      "jml_nontender_2026",
      "jml_purch_2026",
      "jml_paket_2026"
   );

   initTable(
      "2025",
      "jml_tender_2025",
      "jml_nontender_2025",
      "jml_purch_2025",
      "jml_paket_2025"
   );

   initTable(
      "2024",
      "jml_tender_2024",
      "jml_nontender_2024",
      "jml_purch_2024",
      "jml_paket_2024"
   );

});
