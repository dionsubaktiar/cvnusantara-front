import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

interface Data {
  tanggal: string | null;
  nopol: string;
  driver: string;
  origin: string;
  destinasi: string;
  status_sj: string;
  tanggal_update_sj: string | null;
  function1: (action: string) => void;
  function2: (action: string) => void;
  dropLabel1: string;
  dropLabel2: string;
}

const AdminData: React.FC<Data> = ({
  tanggal,
  nopol,
  driver,
  origin,
  destinasi,
  status_sj,
  tanggal_update_sj,
  function1,
  function2,
  dropLabel1,
  dropLabel2,
}) => {
  // Format the date
  const formattedDate = tanggal
    ? new Date(tanggal).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
  const formattedDateSJ = tanggal_update_sj
    ? new Date(tanggal_update_sj).toLocaleString("id-ID", {
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
          <div>{driver}</div>
          <div>{formattedDate}</div>
        </div>

        {/* Route Information */}
        <div className="grid grid-cols-1">
          <p>{origin}</p>
          <p>{destinasi}</p>
        </div>

        {/* Pricing and Status */}
        <div className="grid grid-cols-1">
          <div>
            {status_sj === "Belum selesai" && (
              <p className="text-red-500">Belum selesai</p>
            )}
            {status_sj === "Terkirim" && (
              <p className="text-green-400">Terkirim</p>
            )}
            {status_sj === "Diterima" && (
              <p className="text-green-400">Diterima</p>
            )}
            {status_sj === "Diterima/Terkirim" && (
              <p className="text-green-400">Selesai</p>
            )}
          </div>
          <div>{formattedDateSJ}</div>
        </div>

        {/* Dropdown Menu using NextUI */}
        <Dropdown className="dark:bg-black dark:text-white bg-white text-black">
          <DropdownTrigger>
            <Button
              variant="bordered"
              color="primary"
              className="flex items-center"
            >
              Manage
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            color="primary"
            variant="faded"
            className="dark:bg-black dark:text-white bg-white text-black" // Set background and text color
          >
            <DropdownItem
              key="action1"
              onClick={() => function1("action1")}
              className="hover:bg-blue-600 hover:text-white" // Change hover color
            >
              {dropLabel1}
            </DropdownItem>
            <DropdownItem
              key="action2"
              onClick={() => function2("action2")}
              className="hover:bg-blue-600 hover:text-white" // Change hover color
            >
              {dropLabel2}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default AdminData;
