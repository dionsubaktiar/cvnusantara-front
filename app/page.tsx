"use client";

import { useEffect, useState } from "react";
import CardData from "./components/cardData";
import CreateDataButton from "./components/createButton";
import axios from "axios";

const dataUrl = "https://cvnusantara.nusantaratranssentosa.co.id/api/data";
const sumUrl = "https://cvnusantara.nusantaratranssentosa.co.id/api/sum";

interface Sum {
  marginSum: number;
  untungrugi: string;
  countSukses: number;
  countPending: number;
  countGagal: number;
  monthYear: string;
}

interface Data {
  id: number;
  tanggal: string | null;
  nopol: string;
  origin: string;
  destinasi: string;
  uj: number;
  harga: number;
  status: string;
}

export default function Home() {
  const [datas, setDatas] = useState<Data[]>([]);
  const [sum, setSum] = useState<Sum | null>(null); // Changed to a single object
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDatas = async () => {
    try {
      // Fetch data and sum
      const [dataResponse, sumResponse] = await Promise.all([
        axios.get(dataUrl),
        axios.get(sumUrl),
      ]);

      setDatas(dataResponse.data);
      setSum(sumResponse.data); // Update as a single object
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas(); // Initial fetch
    const intervalId = setInterval(fetchDatas, 2000); // Refresh every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  if (loading)
    return (
      <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
    );

  return (
    <div className="min-h-screen flex-col items-start justify-center p-2 gap-2">
      <CreateDataButton />
      {sum && ( // Render only if sum is not null
        <div
          className="flex items-center justify-around border-2 text-sm rounded-lg"
          key={sum.untungrugi}
        >
          <div className="grid grid-cols-1">
            <div>
              {sum.untungrugi == "UNTUNG" && (
                <p className="text-green-500">Untung</p>
              )}
              {sum.untungrugi == "RUGI" && <p className="text-red-500">Rugi</p>}
            </div>
            <div>
              {sum.monthYear
                ? new Date(sum.monthYear + "-01").toLocaleString("id-ID", {
                    year: "numeric",
                    month: "long",
                  })
                : "N/A"}
            </div>
          </div>
          <div>Rp. {sum.marginSum.toLocaleString("id-ID")}</div>
          <div className="grid grid-cols-1">
            <p>Lunas : {sum.countSukses}</p>
            <p>Pending : {sum.countPending}</p>
            <p>Cancel : {sum.countGagal}</p>
          </div>
        </div>
      )}
      {datas.map((data) => (
        <CardData
          key={data.id}
          tanggal={data.tanggal}
          nopol={data.nopol}
          origin={data.origin}
          destinasi={data.destinasi}
          harga={data.harga}
          uj={data.uj}
          status={data.status}
        />
      ))}
    </div>
  );
}
