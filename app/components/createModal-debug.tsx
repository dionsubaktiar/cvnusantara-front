import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";

interface Data {
  tanggal: string | null;
  nopol: string;
  driver: string;
  origin: string;
  destinasi: string;
  uj: number | null;
  harga: number | null;
  status: string;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onCreate: () => void;
}

const CreateDataModalDebug: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  onCreate,
}) => {
  const [data, setData] = useState<Data>({
    tanggal: null,
    nopol: "",
    driver: "",
    origin: "",
    destinasi: "",
    uj: null,
    harga: null,
    status: "pending",
  });

  const [margin, setMargin] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setMessage("");
  }, [closeModal, onCreate]);

  // Currency formatter
  const currencyFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setData((prevData) => {
      const newValue =
        name === "uj" || name === "harga"
          ? Number(value.replace(/\D/g, ""))
          : value;

      // Update data state
      const updatedData = {
        ...prevData,
        [name]: newValue || null,
      };

      // Calculate margin dynamically
      const updatedUJ = name === "uj" ? newValue : prevData.uj;
      const updatedHarga = name === "harga" ? newValue : prevData.harga;

      setMargin(() => {
        const ujValue = Number(updatedUJ) || 0;
        const hargaValue = Number(updatedHarga) || 0;

        return ujValue && hargaValue ? hargaValue - ujValue : null;
      });

      return updatedData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.get(
        "https://backend-cv.nusantaratranssentosa.co.id/sanctum/csrf-cookie"
      );
      await axios.post(
        "https://backend-cv.nusantaratranssentosa.co.id/api/data",
        data
      );

      setMessage(`Data created successfully for: ${data.nopol}`);
      console.log(data);

      // Reset form
      setData({
        tanggal: null,
        nopol: "",
        driver: "",
        origin: "",
        destinasi: "",
        uj: null,
        harga: null,
        status: "pending",
      });
      setMargin(null);

      onCreate();
      closeModal();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors;
        if (errors && typeof errors === "object") {
          const allMessages = Object.values(errors).flat().join(", ");
          setMessage("Error creating data: " + allMessages);
        } else {
          setMessage(
            "Error creating data: " +
              (error.response?.data?.message || error.message)
          );
        }
      }
    } finally {
      setLoading(false);
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

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Tanggal */}
                  <div>
                    <label
                      htmlFor="tanggal"
                      className="block text-sm font-medium text-black"
                    >
                      Tanggal
                    </label>
                    <input
                      type="date"
                      name="tanggal"
                      value={data.tanggal || ""}
                      onChange={handleChange}
                      className="border rounded p-2 w-full text-black"
                    />
                  </div>

                  {/* Other Inputs */}
                  {[
                    {
                      name: "nopol",
                      label: "Nomor Polisi",
                      placeholder: "Nomor Polisi",
                    },
                    { name: "driver", label: "Driver", placeholder: "Driver" },
                    { name: "origin", label: "Origin", placeholder: "Origin" },
                    {
                      name: "destinasi",
                      label: "Destinasi",
                      placeholder: "Destinasi",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-black">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={data[field.name as keyof Data] as string}
                        placeholder={field.placeholder}
                        onChange={handleChange}
                        className="border rounded p-2 w-full text-black"
                      />
                    </div>
                  ))}

                  {/* Harga */}
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Harga
                    </label>
                    <input
                      type="text"
                      name="harga"
                      value={
                        data.harga !== null
                          ? currencyFormat.format(data.harga)
                          : ""
                      }
                      onChange={handleChange}
                      placeholder="Harga"
                      className="border rounded p-2 w-full text-black"
                    />
                  </div>

                  {/* UJ */}
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Uang Jalan
                    </label>
                    <input
                      type="text"
                      name="uj"
                      value={
                        data.uj !== null ? currencyFormat.format(data.uj) : ""
                      }
                      onChange={handleChange}
                      placeholder="Uang Jalan"
                      className="border rounded p-2 w-full text-black"
                    />
                  </div>

                  {/* Margin */}
                  {margin !== null && margin >= 0 && (
                    <p className="text-sm text-green-600">
                      Margin: {currencyFormat.format(margin)}
                    </p>
                  )}
                  {margin !== null && margin <= 0 && (
                    <p className="text-sm text-red-600">
                      Margin: {currencyFormat.format(margin)}
                    </p>
                  )}

                  {/* Submit */}
                  <div className="mt-4 flex justify-end gap-2">
                    <Button type="submit" color="success">
                      {loading ? "Submitting..." : "Save"}
                    </Button>
                    <Button onClick={closeModal} color="danger">
                      Cancel
                    </Button>
                  </div>
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

export default CreateDataModalDebug;
