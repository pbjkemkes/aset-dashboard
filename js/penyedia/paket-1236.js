const wbook = SpreadsheetApp.getActive();



/* ===================================== */
/* REFRESH CACHE (QUERY → VALUE) */
/* ===================================== */

function refreshCache(){

  const ss =
    SpreadsheetApp.getActive();

  const src =
    ss.getSheetByName("penyedia");

  let dst =
    ss.getSheetByName("penyedia_cache");

  if (!dst){

    dst =
      ss.insertSheet("penyedia_cache");

  }

  const lastRow =
    src.getLastRow();

  const data =
    src
      .getRange(
        1,
        1,
        lastRow,
        51   // sampai AY
      )
      .getValues();

  dst.clearContents();

  dst
    .getRange(
      1,
      1,
      data.length,
      data[0].length
    )
    .setValues(data);

}



/* ===================================== */
/* doGet MAIN */
/* ===================================== */

function doGet(e){

  /* endpoint chart */

  if (e.parameter.action === "top10") {

    return getTop10(e);

  }

  const sheet =
    wbook.getSheetByName("penyedia_cache");

  const draw =
    Number(e.parameter.draw);

  const start =
    Number(e.parameter.start);

  const length =
    Number(e.parameter.length);

  const lastRow =
    sheet.getLastRow();

  const totalData =
    lastRow - 1;

  let data = [];

  let rangeStart =
    start + 2;

  let rangeLength =
    Math.min(
      length,
      totalData-start
    );

  if (rangeLength < 1)
    rangeLength = 1;


  /* ambil range sekaligus */

  const rows =
    sheet.getRange(
      rangeStart,
      1,
      rangeLength,
      46   // sampai AT
    ).getValues();


  for (let i=0;i<rows.length;i++){

    let r = rows[i];

    data.push({

      id: r[0],

      penyedia: r[1],

      jml_tender_2024: r[33],
      jml_nontender_2024: r[34],
      jml_purch_2024: r[35],
      jml_paket_2024: r[36],

      jml_tender_2025: r[37],
      jml_nontender_2025: r[38],
      jml_purch_2025: r[39],
      jml_paket_2025: r[40],

      jml_tender_2026: r[41],
      jml_nontender_2026: r[42],
      jml_purch_2026: r[43],
      jml_paket_2026: r[44]

    });

  }

  return ContentService
    .createTextOutput(
      JSON.stringify({

        draw: draw,
        recordsTotal: totalData,
        recordsFiltered: totalData,
        data: data

      })
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}



/* ===================================== */
/* TOP 10 CHART */
/* ===================================== */

function getTop10(e){

  const year =
    e.parameter.year;

  const sheet =
    wbook.getSheetByName("penyedia_cache");

  const lastRow =
    sheet.getLastRow();


  let colIndex;

  if (year === "2024")
    colIndex = 34; // AH

  if (year === "2025")
    colIndex = 38; // AL

  if (year === "2026")
    colIndex = 42; // AP


  const names =
    sheet.getRange(
      2,
      2,
      lastRow-1,
      1
    ).getValues();

  const values =
    sheet.getRange(
      2,
      colIndex,
      lastRow-1,
      1
    ).getValues();


  let data = [];

  for (let i=0;i<names.length;i++){

    data.push({

      name: names[i][0],
      value: Number(values[i][0]) || 0

    });

  }

  data.sort((a,b)=>b.value-a.value);

  let top10 =
    data.slice(0,10);

  return ContentService
    .createTextOutput(
      JSON.stringify(top10)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}
