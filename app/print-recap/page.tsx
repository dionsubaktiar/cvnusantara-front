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

  const handlePrint = () => {
    sessionStorage.setItem("printing", "true"); // Set flag bahwa sedang print
    window.print();
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      sessionStorage.removeItem("printing"); // Hapus flag setelah print selesai
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (!sessionStorage.getItem("printing")) {
        localStorage.removeItem("recapData"); // Hapus data hanya jika tidak sedang mencetak
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col items-center">
      <h1 className="text-lg font-bold mb-4">Print Recap</h1>
      {data && (
        <button
          onClick={handlePrint}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Cetak
        </button>
      )}
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
                <td className="border border-gray-300 p-2">
                  {item.status === "confirmed" && "Lunas"}
                  {item.status === "pending" && "Pending"}
                  {item.status === "canceled" && "Cancel"}
                </td>
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
