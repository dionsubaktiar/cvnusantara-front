import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import axios from "axios";

interface Data {
  tanggal: string | null; // Date in YYYY-MM-DD format
  nopol: string;
  origin: string;
  destinasi: string;
  uj: number;
  harga: number;
  status: string;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onCreate: () => void; // Function to refresh data after creation
}

const CreateDataModal: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  onCreate,
}) => {
  const [data, setData] = useState<Data>({
    tanggal: null,
    nopol: "",
    origin: "",
    destinasi: "",
    uj: 0,
    harga: 0,
    status: "pending",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "uj" || name === "harga" ? Number(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts

    try {
      // Prepare data with CSRF token
      await axios.get("/backend/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      // Post formatted data
      await axios.post("/backend/api/data", data, { withCredentials: true });

      setMessage(`Data created successfully for: ${data.nopol}`);
      onCreate(); // Call the onCreate function to refresh data
      closeModal(); // Close modal after successful submission
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        setMessage(
          "Error creating data: " +
            (error.response?.data?.message || error.message)
        );
      } else {
        setMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
                  Create Data
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit}
                  className="mt-4 space-y-4 text-black"
                >
                  {/* Tanggal */}
                  <div className="space-y-1">
                    <label htmlFor="tanggal" className="font-medium text-sm">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      id="tanggal"
                      name="tanggal"
                      value={data.tanggal || ""}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  {/* Nomor Polisi */}
                  <div className="space-y-1">
                    <label htmlFor="nopol" className="font-medium text-sm">
                      Nomor Polisi
                    </label>
                    <input
                      type="text"
                      id="nopol"
                      name="nopol"
                      placeholder="Nomor Polisi
                                            Nomor Polisi"
                      value={data.nopol}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  {/* Origin */}
                  <div className="space-y-1">
                    <label htmlFor="origin" className="font-medium text-sm">
                      Origin
                    </label>
                    <input
                      type="text"
                      id="origin"
                      name="origin"
                      placeholder="Origin"
                      value={data.origin}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  {/* Destinasi */}
                  <div className="space-y-1">
                    <label htmlFor="destinasi" className="font-medium text-sm">
                      Destinasi
                    </label>
                    <input
                      type="text"
                      id="destinasi"
                      name="destinasi"
                      placeholder="Destinasi"
                      value={data.destinasi}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  {/* UJ */}
                  <div className="space-y-1">
                    <label htmlFor="uj" className="font-medium text-sm">
                      UJ
                    </label>
                    <input
                      type="number"
                      id="uj"
                      name="uj"
                      placeholder="UJ"
                      value={data.uj}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  {/* Harga */}
                  <div className="space-y-1">
                    <label htmlFor="harga" className="font-medium text-sm">
                      Harga
                    </label>
                    <input
                      type="number"
                      id="harga"
                      name="harga"
                      placeholder="Harga"
                      value={data.harga}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label htmlFor="status" className="font-medium text-sm">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={data.status}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </div>

                  {/* Message Display */}
                  {message && <p className="text-red-500">{message}</p>}

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      className={`w-full rounded bg-blue-500 p-2 text-white ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Data"}
                    </button>
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

export default CreateDataModal;
