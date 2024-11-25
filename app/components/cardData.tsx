import React from "react";
import { Button } from "@nextui-org/react";

interface Data {
  tanggal: string | null; // Update type to string since Laravel/MySQL provides dates as strings
  nopol: string;
  origin: string;
  destinasi: string;
  uj: number;
  harga: number;
  status: string;
}

const CardData: React.FC<Data> = ({
  tanggal,
  nopol,
  origin,
  destinasi,
  uj,
  harga,
  status,
}) => {
  // Convert the tanggal string to a Date object and format it
  const formattedDate = tanggal
    ? new Date(tanggal).toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"; // Handle null or invalid dates

  return (
    <div>
      <div className="flex items-center justify-around border-2 text-sm rounded-lg gap-2 p-3">
        <div className="grid grid-cols-1">
          <div>{nopol}</div>
          <div>{formattedDate}</div>
        </div>
        <div>
          {origin} - {destinasi}
        </div>
        <div className="grid grid-cols-1">
          <div>Rp. {uj.toLocaleString("id-ID")}</div>
          <div>Rp. {harga.toLocaleString("id-ID")}</div>
          <div>{status}</div>
        </div>
        <Button color="primary" variant="light">
          Manage
        </Button>
      </div>
    </div>
  );
};

export default CardData;
