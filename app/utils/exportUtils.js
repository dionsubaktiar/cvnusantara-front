// utils/exportUtils.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToPDF = (data) => {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.text("Laporan Rekap Pengiriman", 14, 10);

  const tableRows = data.map((item) => [
    `${item.nopol} - ${item.driver}`,
    new Date(item.tanggal).toLocaleDateString("id-ID"),
    `${item.origin} - ${item.destinasi}`,
    `Rp. ${new Number(item.uj).toLocaleString("id-ID")}`,
    `Rp. ${new Number(item.harga).toLocaleString("id-ID")}`,
    `Rp. ${(item.harga - item.uj).toLocaleString("id-ID")}`,
    item.status === "confirmed"
      ? "Lunas"
      : item.status === "pending"
      ? "Pending"
      : "Cancel",
  ]);

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
    startY: 20,
  });

  doc.save("rekap_pengiriman.pdf");
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

  data.forEach((item) => {
    worksheet.addRow({
      nopol_driver: `${item.nopol} - ${item.driver}`,
      tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      route: `${item.origin} - ${item.destinasi}`,
      uj: `Rp. ${new Number(item.uj).toLocaleString("id-ID")}`,
      harga: `Rp. ${new Number(item.harga).toLocaleString("id-ID")}`,
      margin: `Rp. ${(item.harga - item.uj).toLocaleString("id-ID")}`,
      status:
        item.status === "confirmed"
          ? "Lunas"
          : item.status === "pending"
          ? "Pending"
          : "Cancel",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "rekap_pengiriman.xlsx");
};
