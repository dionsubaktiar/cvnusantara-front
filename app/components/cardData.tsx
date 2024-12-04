import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

interface Data {
  tanggal: string | null; // Laravel/MySQL dates as strings
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
  // Format the date
  const formattedDate = tanggal
    ? new Date(tanggal).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="p-2">
      <div className="flex items-center justify-around border-2 text-sm rounded-lg p-3">
        {/* Vehicle and Date */}
        <div className="grid grid-cols-1">
          <div>{nopol}</div>
          <div>{formattedDate}</div>
        </div>

        {/* Route Information */}
        <div className="grid grid-cols-1">
          <p>{origin}</p>
          <p>{destinasi}</p>
        </div>

        {/* Pricing and Status */}
        <div className="grid grid-cols-1">
          <div>Rp. {uj.toLocaleString("id-ID")}</div>
          <div>Rp. {harga.toLocaleString("id-ID")}</div>
          <div>
            {status === "confirmed" && <p className="text-green-400">Lunas</p>}
            {status === "pending" && <p className="text-gray-500">Pending</p>}
            {status === "canceled" && <p className="text-red-500">Cancel</p>}
            {!["confirmed", "pending", "canceled"].includes(status) && (
              <p className="text-gray-500">Unknown</p>
            )}
          </div>
        </div>

        {/* Dropdown Menu */}
        <Dropdown>
          <DropdownTrigger>
            <Button color="primary" variant="bordered">
              Manage
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onClick={() => function1("action1")}>
              {dropLabel1}
            </DropdownItem>
            <DropdownItem onClick={() => function2("action2")}>
              {dropLabel2}
            </DropdownItem>
            <DropdownItem onClick={() => function3("action3")}>
              {dropLabel3}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default CardData;
