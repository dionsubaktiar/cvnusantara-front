import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

interface Data {
  tanggal: string | null; // Update type to string since Laravel/MySQL provides dates as strings
  nopol: string;
  origin: string;
  destinasi: string;
  uj: number;
  harga: number;
  status: string;
  function1: (action: string) => void;
  function2: (action: string) => void;
  function3: (action: string) => void;
  dropLabel1: string;
  dropLabel2: string;
  dropLabel3: string;
}

const CardData: React.FC<Data> = ({
  tanggal,
  nopol,
  origin,
  destinasi,
  uj,
  harga,
  status,
  function1,
  function2,
  function3,
  dropLabel1,
  dropLabel2,
  dropLabel3,
}) => {
  // Convert the tanggal string to a Date object and format it
  const formattedDate = tanggal
    ? new Date(tanggal).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A"; // Handle null or invalid dates

  return (
    <div className="p-2">
      <div className="flex items-center justify-around border-2 text-sm rounded-lg p-3">
        <div className="grid grid-cols-1">
          <div>{nopol}</div>
          <div>{formattedDate}</div>
        </div>
        <div className="grid grid-cols-1">
          <p>{origin}</p>
          <p>{destinasi}</p>
        </div>
        <div className="grid grid-cols-1">
          <div>Rp. {uj.toLocaleString("id-ID")}</div>
          <div>Rp. {harga.toLocaleString("id-ID")}</div>
          <div>
            {status == "confirmed" && <p className="text-green-400">Lunas</p>}
            {status == "pending" && <p className="text-gray">Pending</p>}
            {status == "canceled" && <p className="text-red-500">Cancel</p>}
          </div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button color="primary" variant="bordered">
              Manage
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onClick={() => function1}>{dropLabel1}</DropdownItem>
            <DropdownItem onClick={() => function2}>{dropLabel2}</DropdownItem>
            <DropdownItem onClick={() => function3}>{dropLabel3}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default CardData;
