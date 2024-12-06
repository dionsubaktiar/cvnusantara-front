"use client";

import { useEffect, useState, useCallback } from "react";
import CardData from "./components/cardData";
import CreateDataButton from "./components/createButton";
import ViewModal from "./components/viewModal"; // Add the ViewModal import
import axios from "axios";
import EditModal from "./components/editModal";

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

  // State for managing modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchDatas = useCallback(async () => {
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

        // Get current month name in local format
        const currentMonthName = new Date().toLocaleString("id-ID", {
          month: "long",
        });

        const availableMonths = Object.keys(newDataByMonth);
        console.log(currentMonthName, availableMonths);
        // Match current month name or fallback to the first month
        const defaultMonth =
          availableMonths.find((month) => month === currentMonthName) ||
          availableMonths[0] ||
          "";

        if (!activeMonth) {
          setActiveMonth(defaultMonth);
          setSum(newSumByMonth[defaultMonth]);
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
  }, [activeMonth]);

  useEffect(() => {
    fetchDatas(); // Initial fetch
    const intervalId = setInterval(fetchDatas, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchDatas]); // Include `fetchDatas` in dependencies

  const handleTabClick = (month: string) => {
    setActiveMonth(month);
    if (sumByMonth[month]) {
      setSum(sumByMonth[month]);
    }
  };

  // Modal handlers
  const openViewModal = (id: number) => {
    setSelectedId(id);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedId(null);
  };

  const openEditModal = (id: number) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedId(null);
    setIsEditModalOpen(false);
  };

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
      <CreateDataButton onCreate={fetchDatas} />
      {/* Render Summary */}
      {sum && (
        <div
          className="flex items-center justify-evenly border-2 text-sm rounded-lg p-4 gap-2"
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
                      {
                        withCredentials: true,
                      }
                    )
                    .then(() => {
                      // Assuming `data` is defined and has an `id` property
                      return axios.put(
                        `https://cvnusantara.nusantaratranssentosa.co.id/api/setlunas/${data.id}`,
                        { withCredentials: true }
                      );
                    })
                    .then((response) => {
                      console.log("Data updated successfully:", response.data);
                      fetchDatas();
                    })
                    .catch((error) => {
                      console.error("Error occurred:", error);
                    });
                }}
                dropLabel2="View"
                function2={() => openViewModal(data.id)}
                dropLabel3="Edit"
                function3={() => {
                  openEditModal(data.id);
                }}
                dropLabel4="Hapus"
                function4={() => {
                  axios
                    .get(
                      "https://cvnusantara.nusantaratranssentosa.co.id/sanctum/csrf-cookie",
                      { withCredentials: true }
                    )
                    .then(() => {
                      axios.delete(
                        `https://cvnusantara.nusantaratranssentosa.co.id/api/data/${data.id}`,
                        { withCredentials: true }
                      );
                    })
                    .then((response) => {
                      console.log("Data deleted successfully:", response);
                      fetchDatas();
                    })
                    .catch((error) => {
                      console.error("Error occurred:", error);
                    });
                }}
              />
            ))}
          </div>
        </div>
      )}
      {/* View Modal */}
      {isViewModalOpen && selectedId && (
        <ViewModal id={selectedId} closeModal={closeViewModal} />
      )}
      {/* Edit Modal */}
      {isEditModalOpen && selectedId && (
        <EditModal
          id={selectedId}
          closeModal={closeEditModal}
          onUpdate={fetchDatas}
        />
      )}
    </div>
  );
}
