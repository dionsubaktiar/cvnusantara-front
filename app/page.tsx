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
  const [sum, setSums] = useState<Sum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDatas = async () => {
    try {
      axios.get(dataUrl).then((response) => {
        setDatas(response.data);
      });
      axios.get(sumUrl).then((response) => {
        setSums(response.data);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas(); // Initial fetch
    const intervalId = setInterval(fetchDatas, 2000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  if (loading)
    return (
      <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
    );

  return (
    <div className="min-h-screen flex-col items-start justify-center py-2 px-3 gap-2">
      <CreateDataButton></CreateDataButton>
      {sum.map((data) => (
        <div
          className="flex items-center justify-around border-2 text-sm rounded-lg p-3"
          key={data.untungrugi}
        >
          <div>{data.untungrugi}</div>
          <div>Rp. {data.marginSum}</div>
          <div className="grid grid-cols-1">
            <p>Lunas : {data.countSukses}</p>
            <p>Pending : {data.countPending}</p>
            <p>Cancel : {data.countGagal}</p>
          </div>
        </div>
      ))}
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
        ></CardData>
      ))}
    </div>
  );
}
