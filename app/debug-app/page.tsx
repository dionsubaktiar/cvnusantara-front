"use client";

import { useEffect, useState, useCallback } from "react";
// import CardData from "../components/cardData";
// import CreateDataButton from "../components/createButton";
// import ViewModal from "../components/viewModal";
import axios from "axios";
import EditModalDebug from "../components/editModal-debug";
import LockScreenDebug from "../components/lockscreen-debug";
import CardDataDebug from "../components/cardData-debug";
import ViewModalDebug from "../components/viewModal-debug";
import CreateDataDebug from "../components/createButton-debug";
import LogoutButton from "../components/logoutButton";
import AdminData from "../components/adminCard";
import EditAdmin from "../components/editAdmin";

const dataUrl = "https://backend-cv.nusantaratranssentosa.co.id/api/data";
const sumUrl = "https://backend-cv.nusantaratranssentosa.co.id/api/sum";

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
  driver: string;
  origin: string;
  destinasi: string;
  uj: number;
  harga: number;
  status: string;
  status_sj: string;
  tanggal_update_sj: string | null;
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
  const [isLocked, setIsLocked] = useState<boolean>(true);

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
        const newSumByMonth = sumResponse.data.dataByMonthYear;

        setDataByMonth(newDataByMonth);
        setSumByMonth(newSumByMonth);

        // Get the current month dynamically or fallback to the first available
        const currentMonthName = new Date().toLocaleString("en-US", {
          month: "long",
        });

        const availableMonths = Object.keys(newDataByMonth);
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
    const intervalId = setInterval(fetchDatas, 5000);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchDatas]); // Include `fetchDatas` in dependencies

  const handleTabClick = (month: string) => {
    setActiveMonth(month);
    if (sumByMonth[month]) {
      setSum(sumByMonth[month]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    if (token && role && token !== "null" && role !== "null") {
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }
  }, []);

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

  if (isLocked) {
    return <LockScreenDebug onUnlock={() => setIsLocked(false)} />;
  }

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
  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen flex flex-col items-start justify-center p-4 gap-4">
      {role === "Super" && <CreateDataDebug onCreate={fetchDatas} />}
      {sum && role === "Super" ? (
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
          <div className="flex-col">
            <div>{role}</div>
            <LogoutButton />
          </div>
        </div>
      ) : (
        <div className="flex-col justify-center p-4">
          <div className="text-center">{role}</div>
          <LogoutButton />
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

      {activeMonth && dataByMonth[activeMonth] && (
        <div className="w-full border-2 p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-xl font-bold">{activeMonth}</h2>
          <p className="text-sm">
            Total records: {dataByMonth[activeMonth].count}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {dataByMonth[activeMonth].data.map((data) =>
              role === "Super" ? (
                <CardDataDebug
                  key={data.id}
                  tanggal={data.tanggal}
                  nopol={data.nopol}
                  driver={data.driver}
                  origin={data.origin}
                  destinasi={data.destinasi}
                  harga={data.harga}
                  uj={data.uj}
                  status={data.status}
                  status_sj={data.status_sj}
                  tanggal_update_sj={data.tanggal_update_sj}
                  dropLabel1="Lunas"
                  function1={() => {
                    axios
                      .get(
                        "https://cvnusantara.nusantaratranssentosa.co.id/sanctum/csrf-cookie"
                      )
                      .then(() => {
                        return axios.put(
                          `https://cvnusantara.nusantaratranssentosa.co.id/api/setlunas/${data.id}`
                        );
                      })
                      .then(() => fetchDatas())
                      .catch((error) => console.error("Error:", error));
                  }}
                  dropLabel2="View"
                  function2={() => openViewModal(data.id)}
                  dropLabel3="Edit"
                  function3={() => openEditModal(data.id)}
                  dropLabel4="Hapus"
                  function4={() => {
                    axios
                      .get(
                        "https://cvnusantara.nusantaratranssentosa.co.id/sanctum/csrf-cookie"
                      )
                      .then(() => {
                        return axios.delete(
                          `https://cvnusantara.nusantaratranssentosa.co.id/api/data/${data.id}`
                        );
                      })
                      .then(() => fetchDatas())
                      .catch((error) => console.error("Error:", error));
                  }}
                />
              ) : (
                <AdminData
                  key={data.id}
                  tanggal={data.tanggal}
                  nopol={data.nopol}
                  driver={data.driver}
                  origin={data.origin}
                  destinasi={data.destinasi}
                  status_sj={data.status_sj}
                  tanggal_update_sj={data.tanggal_update_sj}
                  dropLabel1="View"
                  function1={() => openViewModal(data.id)}
                  dropLabel2="Edit"
                  function2={() => openEditModal(data.id)}
                ></AdminData>
              )
            )}
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedId && (
        <ViewModalDebug id={selectedId} closeModal={closeViewModal} />
      )}
      {/* Edit Modal */}
      {isEditModalOpen && selectedId && role === "Super" && (
        <EditModalDebug
          id={selectedId}
          closeModal={closeEditModal}
          onUpdate={fetchDatas}
        />
      )}

      {isEditModalOpen && selectedId && role === "Admin" && (
        <EditAdmin
          id={selectedId}
          closeModal={closeEditModal}
          onUpdate={fetchDatas}
        />
      )}
    </div>
  );
}
