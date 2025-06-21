import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToPDF = (data) => {
  const orientation = "landscape";
  const doc = new jsPDF(orientation, "mm", "a4");
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.getWidth();
  const pageHeight = pageSize.getHeight();
  const margin = 15;

  doc.setFont("helvetica", "normal");

  let totalUj = 0;
  let totalHarga = 0;
  let totalMargin = 0;

  const tableRows = data.map((item) => {
    const uj = new Number(item.uj);
    const harga = new Number(item.harga);
    const margin = harga - uj;

    totalUj += uj;
    totalHarga += harga;
    totalMargin += margin;

    return [
      `${item.nopol} - ${item.driver}`,
      new Date(item.tanggal).toLocaleDateString("id-ID"),
      `${item.origin} - ${item.destinasi}`,
      `Rp. ${uj.toLocaleString("id-ID")}`,
      `Rp. ${harga.toLocaleString("id-ID")}`,
      `Rp. ${margin.toLocaleString("id-ID")}`,
      item.status === "confirmed"
        ? "Lunas"
        : item.status === "pending"
        ? "Pending"
        : "Cancel",
    ];
  });

  tableRows.push([
    "",
    "Total",
    "",
    `Rp. ${totalUj.toLocaleString("id-ID")}`,
    `Rp. ${totalHarga.toLocaleString("id-ID")}`,
    `Rp. ${totalMargin.toLocaleString("id-ID")}`,
    "",
  ]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const filenameDate = today.toISOString().slice(0, 10);

  autoTable(doc, {
    head: [
      [
        "Nopol - Driver",
        "Tanggal",
        "Origin - Destinasi",
        "Uang Jalan",
        "Harga",
        "Margin",
        "Status",
      ],
    ],
    body: tableRows,
    startY: 25 + 5, // Sesuaikan startY untuk memberi ruang border header
    margin: { top: margin, right: margin, bottom: margin, left: margin },
    didParseCell: (dataArg) => {
      if (
        dataArg.row.index === tableRows.length - 1 &&
        dataArg.section === "body"
      ) {
        dataArg.cell.styles.fontStyle = "bold";
      }
    },
    didDrawPage: (dataArg) => {
      // --- Header Content ---
      // Judul dan tanggal cetak hanya di halaman PERTAMA
      if (dataArg.pageNumber === 1) {
        doc.setFontSize(16);
        doc.text("Laporan Rekap Pengiriman", dataArg.settings.margin.left, 10);
        doc.setFontSize(10);
        doc.text(
          `Tanggal Cetak: ${formattedDate}`,
          dataArg.settings.margin.left,
          16
        );
      }

      // --- Footer Content ---
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      // Teks "Tanggal Export" (di setiap halaman footer)
      doc.text(
        `Tanggal Export: ${formattedDate}`,
        dataArg.settings.margin.left,
        pageHeight - 10
      );
    },
    // theme: "grid",
    // styles: {
    //   fontSize: 8,
    //   cellPadding: 2,
    //   overflow: "linebreak",
    //   halign: "left",
    //   lineWidth: 0.1, // Adjust this value (e.g., 0.1, 0.2, etc.) for desired thickness
    //   lineColor: [0, 0, 0], // Ensure lines are black
    // },
    // headStyles: {
    //   // ...
    //   lineWidth: 0.2, // You can make header borders slightly thicker
    //   lineColor: [0, 0, 0],
    // },
  });

  // --- Crucial Fix: Correctly Stamp Total Page Count AFTER document is fully generated ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const pageText = `Halaman ${i} dari ${totalPages}`;
    // const textWidth =
    //   (doc.getStringUnitWidth(pageText) * doc.internal.getFontSize()) /
    //   doc.internal.scaleFactor;
    doc.text(pageText, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  doc.save(`rekap_pengiriman_${filenameDate}.pdf`);
};

export const exportToExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Rekap Pengiriman");

  worksheet.columns = [
    { header: "Nopol - Driver", key: "nopol_driver", width: 30 },
    { header: "Tanggal", key: "tanggal", width: 15 },
    { header: "Origin - Destinasi", key: "route", width: 60 },
    { header: "Uang Jalan", key: "uj", width: 15 },
    { header: "Harga", key: "harga", width: 15 },
    { header: "Margin", key: "margin", width: 15 },
    { header: "Status", key: "status", width: 15 },
  ];

  let totalUj = 0;
  let totalHarga = 0;
  let totalMargin = 0;

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  data.forEach((item) => {
    const uj = new Number(item.uj);
    const harga = new Number(item.harga);
    const margin = harga - uj;

    totalUj += uj;
    totalHarga += harga;
    totalMargin += margin;

    const row = worksheet.addRow({
      nopol_driver: `${item.nopol} - ${item.driver}`,
      tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      route: `${item.origin} - ${item.destinasi}`,
      uj: `Rp. ${uj.toLocaleString("id-ID")}`,
      harga: `Rp. ${harga.toLocaleString("id-ID")}`,
      margin: `Rp. ${margin.toLocaleString("id-ID")}`,
      status:
        item.status === "confirmed"
          ? "Lunas"
          : item.status === "pending"
          ? "Pending"
          : "Cancel",
    });

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  const totalRow = worksheet.addRow({
    nopol_driver: "Total", // Only "Total" needs to be in the first merged cell
    tanggal: "", // These cells will be merged into the first one
    route: "", // These cells will be merged into the first one
    uj: `Rp. ${totalUj.toLocaleString("id-ID")}`,
    harga: `Rp. ${totalHarga.toLocaleString("id-ID")}`,
    margin: `Rp. ${totalMargin.toLocaleString("id-ID")}`,
    status: "",
  });

  // Merge cells A to C in the total row
  const totalRowNumber = totalRow.number; // Get the actual row number of the total row
  worksheet.mergeCells(`A${totalRowNumber}:C${totalRowNumber}`);

  // Apply styles to the merged cell (which is now A in the total row)
  const mergedCell = worksheet.getCell(`A${totalRowNumber}`);
  mergedCell.font = { bold: true };
  mergedCell.alignment = { vertical: "middle", horizontal: "center" }; // Center the "Total" text
  mergedCell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // Apply styles to the rest of the cells in the total row (from column D onwards)
  // We need to iterate from the 4th column (index 3 in a 0-indexed array, or 'D' in Excel)
  for (let i = 4; i <= 7; i++) {
    // Columns D, E, F, G are 4, 5, 6, 7
    const cell = totalRow.getCell(i);
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  }

  const today = new Date();
  const filenameDate = today.toISOString().slice(0, 10);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `rekap_pengiriman_${filenameDate}.xlsx`);
};
