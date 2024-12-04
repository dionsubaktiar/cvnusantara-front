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
  const [sumByMonth, setSumByMonth] = useState<{ [month: string]: Sum }>({});
  const [sum, setSum] = useState<Sum | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState<string>("");

  const fetchDatas = async () => {
    try {
      const [dataResponse, sumResponse] = await Promise.all([
        axios.get(dataUrl),
        axios.get(sumUrl),
      ]);

      if (
        dataResponse.data?.status === "success" &&
        sumResponse.data?.status === "success"
      ) {
        const newDataByMonth = dataResponse.data.dataByMonth;
        const newSumByMonth = sumResponse.data.dataByMonth;

        setDataByMonth(newDataByMonth);
        setSumByMonth(newSumByMonth);

        // Set active month and sum
        const firstMonth = Object.keys(newDataByMonth)[0] || "";
        if (!activeMonth) {
          setActiveMonth(firstMonth);
          setSum(newSumByMonth[firstMonth]);
        }
      } else {
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
    const intervalId = setInterval(fetchDatas, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [activeMonth]); // Depend on `activeMonth` to avoid redundant calls

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
    if (sumByMonth[month]) {
      setSum(sumByMonth[month]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-center p-4 gap-4">
      <CreateDataButton />

      {/* Render Summary */}
      {sum && (
        <div
          className="flex items-center justify-around border-2 text-sm rounded-lg p-4 gap-2"
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
          </div>
          <div>Rp. {sum.marginSum.toLocaleString("id-ID")}</div>
          <div className="grid grid-cols-1">
            {sum.countSukses > 0 && <p>Lunas: {sum.countSukses}</p>}
            {sum.countPending > 0 && <p>Pending: {sum.countPending}</p>}
            {sum.countGagal > 0 && <p>Cancel: {sum.countGagal}</p>}
          </div>
        </div>
      )}

      {/* Month Tabs */}
      <div className="w-full flex gap-2 mt-4">
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
            {new Date(sumByMonth[month]?.monthYear + "-01").toLocaleString(
              "id-ID",
              { year: "numeric", month: "long" }
            )}
          </button>
        ))}
      </div>

      {/* Active Month Data */}
      {activeMonth && dataByMonth[activeMonth] && (
        <div className="w-full border-2 p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-xl font-bold">{activeMonth}</h2>
          <p className="text-sm">
            Total records: {dataByMonth[activeMonth].count}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
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
                dropLabel1="Lunas"
                function1={() => {
                  axios
                    .get(
                      "https://cvnusantara.nusantaratranssentosa.co.id/sanctum/csrf-cookie",
                      { withCredentials: true }
                    ) // Ensure cookies are sent and received
                    .then(() => {
                      // Once CSRF cookie is set, we can make the PUT request
                      return axios.put(
                        `https://cvnusantara.nusantaratranssentosa.co.id/api/setlunas/${data.id}`,
                        {},
                        {
                          withCredentials: true,
                          headers: {
                            // Make sure to replace <your-token> with the actual token
                            "Content-Type": "application/json",
                          },
                        }
                      );
                    })
                    .then((res) => {
                      console.log("Lunas set successfully:", res.data);
                    })
                    .catch((err) => {
                      console.error("Error setting Lunas:", err);
                    });
                }}
                dropLabel2="Edit"
                function2={() => {
                  console.log(`Edit record ${data.id}`);
                }}
                dropLabel3="Hapus"
                function3={() => {
                  axios
                    .get(
                      "https://cvnusantara.nusantaratranssentosa.co.id/sanctum/csrf-cookie",
                      { withCredentials: true }
                    ) // Ensure cookies are sent and received
                    .then(() => {
                      // Once CSRF cookie is set, we can make the PUT request
                      return axios.delete(
                        `https://cvnusantara.nusantaratranssentosa.co.id/api/data/${data.id}`,
                        {
                          withCredentials: true,
                          headers: {
                            // Make sure to replace <your-token> with the actual token
                            "Content-Type": "application/json",
                          },
                        }
                      );
                    })
                    .then((res) => {
                      console.log("Lunas set successfully:", res.data);
                    })
                    .catch((err) => {
                      console.error("Error setting Lunas:", err);
                    });
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
