let topSatkerCharts = {};

function createGradient(ctx){

   let gradient =
      ctx.createLinearGradient(0,0,600,0);

   gradient.addColorStop(0,"#36A2EB");
   gradient.addColorStop(1,"#4BC0C0");

   return gradient;

}

function generateTopChart(year){

   let container =
      document.getElementById("tab"+year);

   if(!container) return;

   let canvas =
      container.querySelector(".topSatkerPurch");

   if(!canvas) return;

   let table =
      document.querySelector("#tabel"+year);

   if(!table) return;

   /* cari dropdown page length */
   let lengthSelect =
      document.querySelector(
         "#tabel"+year+"_length select"
      );

   if(!lengthSelect){

      setTimeout(function(){

         generateTopChart(year);

      },500);

      return;

   }

   /* simpan page length lama */
   let oldLength =
      lengthSelect.value;

   /* tampilkan semua row */
   lengthSelect.value = -1;

   lengthSelect.dispatchEvent(
      new Event("change")
   );

   setTimeout(function(){

      let rows =
         table.querySelectorAll(
            "tbody tr"
         );

      let dataSatker = [];

      rows.forEach(row => {

         let cols =
            row.querySelectorAll("td");

         if(cols.length < 2) return;

         let namaSatker =
            cols[1].innerText;

         let persenText =
            cols[cols.length-1]
            .innerText;

         if(!persenText) return;

         let persen =
            persenText
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

      /* kembalikan pagination */
      lengthSelect.value = oldLength;

      lengthSelect.dispatchEvent(
         new Event("change")
      );

      if(dataSatker.length === 0) return;

      dataSatker.sort(
         (a,b)=>b.nilai-a.nilai
      );

      let top10 =
         dataSatker.slice(0,10);

      let labels =
         top10.map(d=>d.nama);

      let values =
         top10.map(d=>d.nilai);

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

   },600);

}


/* jalankan */

setTimeout(function(){

   generateTopChart("2026");
   generateTopChart("2025");
   generateTopChart("2024");

},2000);
