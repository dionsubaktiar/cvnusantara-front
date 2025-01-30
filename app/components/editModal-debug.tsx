import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";

interface DataResponse {
  id: number;
  tanggal: string | null;
  nopol: string;
  driver: string;
  origin: string;
  destinasi: string;
  uj: number | null;
  harga: number | null;
  status: string;
  created_at: string | null;
  updated_at: string;
}

interface EditDataProps {
  id: number;
  closeModal: () => void;
  onUpdate: () => void; // Callback to refresh data after update
}

const EditDataModalDebug: React.FC<EditDataProps> = ({
  id,
  closeModal,
  onUpdate,
}) => {
  const [data, setData] = useState<DataResponse | null>(null);
  const [formData, setFormData] = useState<DataResponse>({
    id: 0,
    tanggal: null,
    nopol: "",
    driver: "",
    origin: "",
    destinasi: "",
    uj: null,
    harga: null,
    status: "pending",
    created_at: null,
    updated_at: "",
  });

  const [margin, setMargin] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Currency formatter
  const currencyFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  // Fetch the data for editing
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<DataResponse>(
          `https://backend-cv.nusantaratranssentosa.co.id/api/data/${id}`
        );
        setData(response.data);
        setFormData(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newValue =
        name === "uj" || name === "harga"
          ? Number(value.replace(/\D/g, ""))
          : value;

      const updatedData = {
        ...prevData!,
        [name]: newValue || null,
      };

      // Calculate margin dynamically
      const updatedUJ = name === "uj" ? newValue : prevData?.uj;
      const updatedHarga = name === "harga" ? newValue : prevData?.harga;

      setMargin(() => {
        const ujValue = Number(updatedUJ) || 0;
        const hargaValue = Number(updatedHarga) || 0;

        return ujValue && hargaValue ? hargaValue - ujValue : null;
      });

      return updatedData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.get(
        "https://backend-cv.nusantaratranssentosa.co.id/sanctum/csrf-cookie",
        {
          withCredentials: true,
        }
      );
      await axios.put(
        `https://backend-cv.nusantaratranssentosa.co.id/api/data/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      onUpdate(); // Refresh the data after the update
      closeModal(); // Close the modal
    } catch (err) {
      console.error(err);
      setError("Failed to update data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => setError(null)}
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
                  Edit Data
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit}
                  className="mt-4 space-y-4 text-black"
                >
                  {/* Tanggal */}
                  <div className="space-y-1">
                    <label>
                      <strong>Tanggal:</strong>
                      <input
                        type="date"
                        name="tanggal"
                        value={formData?.tanggal || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </label>
                  </div>

                  {/* Nomor Polisi */}
                  <div className="space-y-1">
                    <label>
                      <strong>Nopol:</strong>
                      <input
                        type="text"
                        name="nopol"
                        value={formData?.nopol || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </label>
                  </div>

                  {/* Driver */}
                  <div className="space-y-1">
                    <label>
                      <strong>Driver:</strong>
                      <input
                        type="text"
                        name="driver"
                        value={formData?.driver || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label>
                      <strong>Origin:</strong>
                      <input
                        type="text"
                        name="origin"
                        value={formData?.origin || ""}
                        onChange={handleChange}
                        placeholder="Origin"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </label>
                  </div>

                  {/* Rute */}
                  <div className="space-y-1">
                    <label>
                      <strong>Destinasi:</strong>
                      <input
                        type="text"
                        name="destinasi"
                        value={formData?.destinasi || ""}
                        onChange={handleChange}
                        placeholder="Destinasi"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </label>
                  </div>

                  {/* Harga */}
                  <div className="space-y-1">
                    <label>
                      <strong>Harga:</strong>
                      <input
                        type="text"
                        name="harga"
                        value={
                          formData?.harga !== null
                            ? currencyFormat.format(formData.harga)
                            : ""
                        }
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </label>
                  </div>

                  {/* Uang Jalan */}
                  <div className="space-y-1">
                    <label>
                      <strong>Uang Jalan:</strong>
                      <input
                        type="text"
                        name="uj"
                        value={
                          formData?.uj !== null
                            ? currencyFormat.format(formData.uj)
                            : ""
                        }
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </label>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label>
                      <strong>Status:</strong>
                      <select
                        name="status"
                        value={formData?.status || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="confirmed">Lunas</option>
                        <option value="pending">Pending</option>
                        <option value="canceled">Cancel</option>
                      </select>
                    </label>
                  </div>

                  {/* Margin */}
                  {margin !== null && margin >= 0 && (
                    <p className="text-sm text-green-600">
                      Margin: {currencyFormat.format(margin)}
                    </p>
                  )}
                  {margin !== null && margin < 0 && (
                    <p className="text-sm text-red-600">
                      Margin: {currencyFormat.format(margin)}
                    </p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <Button type="submit" color="success">
                      Save
                    </Button>
                    <Button onClick={closeModal} color="danger">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditDataModalDebug;
