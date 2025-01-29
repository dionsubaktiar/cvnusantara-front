import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";

interface ViewData {
  id: number;
  closeModal: () => void;
}

interface DataResponse {
  id: number;
  tanggal: string | null;
  nopol: string;
  driver: string;
  origin: string;
  destinasi: string;
  uj: number;
  harga: number;
  status: string;
  created_at: string | null;
  updated_at: string;
}

const ViewModalDebug: React.FC<ViewData> = ({ id, closeModal }) => {
  const [data, setData] = useState<DataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Wrap fetchData in useCallback to memoize it
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<DataResponse>(
        `https://backend-cv.nusantaratranssentosa.co.id/api/data/${id}`
      );
      setData(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]); // Add id as a dependency

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate formatted date
  const formattedDate = data?.tanggal
    ? new Date(data.tanggal).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  // Calculate margin dynamically
  const margin = useMemo(() => {
    if (data?.harga !== undefined && data?.uj !== undefined) {
      const calculatedMargin = data.harga - data.uj;
      return Number(calculatedMargin).toLocaleString("id-ID");
    }
    return "N/A";
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4">
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-black"
                >
                  Detail Data
                </Dialog.Title>

                <div className="mt-4 space-y-4 text-black">
                  {/* Tanggal */}
                  <div className="space-y-1">
                    <p>
                      <strong>Tanggal:</strong> {formattedDate}
                    </p>
                  </div>

                  {/* Nomor Polisi */}
                  <div className="space-y-1">
                    <p>
                      <strong>Nopol:</strong> {data.nopol}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p>
                      <strong>Driver:</strong> {data.driver}
                    </p>
                  </div>
                  {/* Destinasi */}
                  <div className="space-y-1">
                    <p>
                      <strong>Rute:</strong> {data.origin} - {data.destinasi}
                    </p>
                  </div>

                  {/* Harga */}
                  <div className="space-y-1">
                    <p>
                      <strong>Harga:</strong> Rp.{" "}
                      {data.harga.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Uang Jalan */}
                  <div className="space-y-1">
                    <p>
                      <strong>Uang Jalan:</strong> Rp.{" "}
                      {data.uj.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Margin */}
                  <div className="space-y-1">
                    <p>
                      <strong>Margin:</strong> Rp. {margin}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    {data.status === "confirmed" && (
                      <p className="text-green-400">
                        <strong className="text-black">Status:</strong> Lunas
                      </p>
                    )}
                    {data.status === "pending" && (
                      <p className="text-gray-500">
                        <strong className="text-black">Status:</strong> Pending
                      </p>
                    )}
                    {data.status === "canceled" && (
                      <p className="text-red-500">
                        <strong className="text-black">Status:</strong> Cancel
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button onClick={closeModal} color="danger">
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewModalDebug;
