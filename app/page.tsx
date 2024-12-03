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

interface DataByMonth {
  [month: string]: {
    count: number;
    data: Data[];
  };
}

export default function Home() {
  const [dataByMonth, setDataByMonth] = useState<DataByMonth>({});
  const [sum, setSum] = useState<Sum | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState<string>(""); // Track the active tab (month)

  const fetchDatas = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dataResponse, sumResponse] = await Promise.all([
        axios.get(dataUrl),
        axios.get(sumUrl),
      ]);

      // Check for valid responses
      if (
        dataResponse.data?.status == "success" &&
        sumResponse.data?.status == "success"
      ) {
        setDataByMonth(dataResponse.data.dataByMonth);
        setSum(sumResponse.data);
        // Set default active month to the first available month
        const firstMonth = Object.keys(dataResponse.data.dataByMonth)[0];
        setActiveMonth(firstMonth);
        console.log("Data from server:", {
          dataResponse: dataResponse.data,
          sumResponse: sumResponse.data,
        });
      } else {
        console.log("Invalid data from server:", {
          dataResponse: dataResponse.data,
          sumResponse: sumResponse.data,
        });
        setError("Invalid data received from server.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas(); // Initial fetch
    const intervalId = setInterval(fetchDatas, 2000); // Refresh every 2 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
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

  const handleTabClick = (month: string) => {
    setActiveMonth(month);
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-center p-4 gap-4">
      <CreateDataButton />

      {/* Render Sum */}
      {sum && (
        <div
          className="flex items-center justify-around border-2 text-sm rounded-lg p-4 bg-gray-50"
          key={sum.untungrugi}
        >
          <div className="grid grid-cols-1">
            <div>
              {sum.untungrugi === "UNTUNG" && (
                <p className="text-green-500">Untung</p>
              )}
              {sum.untungrugi === "RUGI" && (
                <p className="text-red-500">Rugi</p>
              )}
            </div>
            <div>
              {/* Safely check for sum.monthYear before using it */}
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
            {sum.countSukses > 0 && <p>Lunas: {sum.countSukses}</p>}
            {sum.countPending > 0 && <p>Pending: {sum.countPending}</p>}
            {sum.countGagal > 0 && <p>Cancel: {sum.countGagal}</p>}
          </div>
        </div>
      )}

      {/* Tabs for each month */}
      <div className="w-full flex gap-2 mt-6">
        {Object.keys(dataByMonth).map((month) => (
          <button
            key={month}
            className={`px-4 py-2 text-sm rounded-lg ${
              month === activeMonth
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => handleTabClick(month)}
          >
            {new Date(month + "-01").toLocaleString("id-ID", {
              year: "numeric",
              month: "long",
            })}
          </button>
        ))}
      </div>

      {/* Render Data for Active Month */}
      {activeMonth && dataByMonth[activeMonth] && (
        <div className="w-full border-2 p-4 rounded-lg shadow-md bg-gray-100 mt-4">
          <h2 className="text-xl font-bold text-gray-700">{activeMonth}</h2>
          <p className="text-sm text-gray-500">
            Total records: {dataByMonth[activeMonth].count}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {dataByMonth[activeMonth].data.map((data) => (
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
      )}
    </div>
  );
}
