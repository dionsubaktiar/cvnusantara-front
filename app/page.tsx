"use client";

import { useEffect, useState } from "react";
import CardData from "./components/cardData";
import CreateDataButton from "./components/createButton";
import axios from "axios";

const dataUrl = "https://cvnusantara.nusantaratranssentosa.co.id/api/data";

interface MonthlyData {
  count: number;
  data: Data[];
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
  const [dataByMonth, setDataByMonth] = useState<Record<string, MonthlyData>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(dataUrl);
      if (response.data.status === "success") {
        setDataByMonth(response.data.dataByMonth);
      } else {
        setError("Failed to fetch data. Invalid response format.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas();
    const intervalId = setInterval(fetchDatas, 2000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-start justify-center p-4 gap-4">
      <CreateDataButton />
      {Object.entries(dataByMonth).map(([month, monthlyData]) => (
        <div
          key={month}
          className="w-full border-2 p-4 rounded-lg shadow-md bg-gray-50"
        >
          <h2 className="text-xl font-bold text-gray-700">{month}</h2>
          <p className="text-sm text-gray-500">
            Total records: {monthlyData.count}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {monthlyData.data.map((data) => (
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
        </div>
      ))}
    </div>
  );
}
