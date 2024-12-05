import React from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

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

        {/* Dropdown Menu using Headless UI */}
        <Menu>
          <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none">
            Manage
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm text-white transition duration-100 ease-out focus:outline-none"
          >
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-700"
                onClick={() => function1("action1")}
              >
                {dropLabel1}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-700"
                onClick={() => function2("action2")}
              >
                {dropLabel2}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-700"
                onClick={() => function3("action3")}
              >
                {dropLabel3}
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default CardData;
