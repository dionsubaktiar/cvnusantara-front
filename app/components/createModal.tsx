import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import axios from "axios";

interface Data {
  tanggal: string | null; // Store date as string in YYYY-MM-DD format
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
}

const CreateDataModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
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

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]:
        name === "uj" || name === "harga"
          ? Number(value)
          : name === "tanggal"
          ? value // Store date as string (YYYY-MM-DD)
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Prepare data with CSRF token
      await axios.get("/backend/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      // Post formatted data
      await axios.post("/backend/api/data", data, {
        withCredentials: true,
      });

      setMessage(`Data created successfully for: ${data.nopol}`);
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
                  <input
                    type="date"
                    name="tanggal"
                    placeholder="Tanggal"
                    value={data.tanggal || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />

                  {/* Nomor Polisi */}
                  <input
                    type="text"
                    name="nopol"
                    placeholder="Nomor Polisi"
                    value={data.nopol}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />

                  {/* Origin */}
                  <input
                    type="text"
                    name="origin"
                    placeholder="Origin"
                    value={data.origin}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />

                  {/* Destinasi */}
                  <input
                    type="text"
                    name="destinasi"
                    placeholder="Destinasi"
                    value={data.destinasi}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />

                  {/* Uang Jaminan */}
                  <input
                    type="number"
                    name="uj"
                    placeholder="Uang Jaminan"
                    value={data.uj}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />

                  {/* Harga */}
                  <input
                    type="number"
                    name="harga"
                    placeholder="Harga"
                    value={data.harga}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white p-2 rounded"
                  >
                    Submit
                  </button>

                  {/* Error/Success Message */}
                  {message && <p className="mt-2 text-red-500">{message}</p>}
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
