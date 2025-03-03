"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Data {
  id: number;
  tanggal: string;
  nopol: string;
  driver: string;
  origin: string;
  destinasi: string;
  status: string;
  status_sj: string;
}

const PrintRecapPage = () => {
  const router = useRouter();
  const [data, setData] = useState<Data[] | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("recapData");
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      router.replace("/recap");
    }
  }, [router]);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        window.print();
      }, 10000);
    }
  }, [data]);

  useEffect(() => {
    const handleAfterPrint = () => {
      localStorage.removeItem("recapData");
      router.replace("/recap");
    };
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [router]);

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col items-center">
      <h1 className="text-lg font-bold mb-4">Print Recap</h1>
      {data ? (
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border border-gray-300 p-2">Nopol</th>
              <th className="border border-gray-300 p-2">Tanggal</th>
              <th className="border border-gray-300 p-2">Driver</th>
              <th className="border border-gray-300 p-2">Origin</th>
              <th className="border border-gray-300 p-2">Destinasi</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Status SJ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="text-center text-black">
                <td className="border border-gray-300 p-2">{item.nopol}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(item.tanggal).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="border border-gray-300 p-2">{item.driver}</td>
                <td className="border border-gray-300 p-2">{item.origin}</td>
                <td className="border border-gray-300 p-2">{item.destinasi}</td>
                {item.status === "confirmed" && (
                  <td className="border border-gray-300 p-2">Lunas</td>
                )}
                {item.status === "pending" && (
                  <p className="border border-gray-300 p-2">Pending</p>
                )}
                {item.status === "canceled" && (
                  <p className="border border-gray-300 p-2">Cancel</p>
                )}
                <td className="border border-gray-300 p-2">{item.status_sj}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default PrintRecapPage;
