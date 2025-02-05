import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import Image from "next/image";

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
  status_sj: string;
  foto: string | null;
  created_at: string | null;
  updated_at: string;
}

interface EditDataProps {
  id: number;
  closeModal: () => void;
  onUpdate: () => void;
}

const EditDataModalDebug: React.FC<EditDataProps> = ({
  id,
  closeModal,
  onUpdate,
}) => {
  // const [formData, setFormData] = useState<DataResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
    status_sj: "",
    foto: "",
    created_at: null,
    updated_at: "",
  });

  const [margin, setMargin] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get<DataResponse>(
        `https://backend-cv.nusantaratranssentosa.co.id/api/data/${id}`
      )
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const currencyFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newValue =
        name === "uj" || name === "harga"
          ? value.replace(/\D/g, "") // Strip out non-numeric characters
          : value;

      const updatedData = {
        ...prevData,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);

    try {
      await axios.get(
        "https://backend-cv.nusantaratranssentosa.co.id/sanctum/csrf-cookie"
      );

      const formDataToSend = new FormData();
      // Loop through the form data to append each field to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, String(value));
        }
      });

      // Handle the foto field separately
      if (selectedFile) {
        // If a new file is selected, append it
        formDataToSend.append("foto", selectedFile);
      } else if (formData.foto) {
        // If no new file is selected, append the existing foto value
        formDataToSend.append("foto", formData.foto);
      }

      // Perform the API request
      await axios.post(
        `https://backend-cv.nusantaratranssentosa.co.id/api/data/${id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          params: { _method: "PUT" },
        }
      );

      onUpdate();
      closeModal();
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  const role = localStorage.getItem("role");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
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
                <Dialog.Title className="text-lg font-medium leading-6 text-black">
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
                  {role === "Super" && (
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
                  )}

                  {/* Uang Jalan */}
                  {role === "Super" && (
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
                  )}

                  {/* Status */}
                  {role === "Super" && (
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
                  )}

                  {/* Margin */}
                  {margin !== null && role === "Super" && margin >= 0 && (
                    <p className="text-sm text-green-600">
                      Margin: {currencyFormat.format(margin)}
                    </p>
                  )}
                  {margin !== null && role === "Super" && margin < 0 && (
                    <p className="text-sm text-red-600">
                      Margin: {currencyFormat.format(margin)}
                    </p>
                  )}
                  {/* Dropdown Status SJ */}
                  {role === "Admin" && (
                    <div className="space-y-1">
                      <label className="text-black">
                        <strong>Status Surat Jalan:</strong>
                      </label>
                      <select
                        name="status_sj"
                        value={formData?.status_sj || ""}
                        onChange={handleChange}
                        className="w-full text-black border p-2 rounded-md"
                      >
                        <option value="Belum selesai">Belum selesai</option>
                        <option value="Diterima">Diterima</option>
                        <option value="Terkirim">Terkirim</option>
                      </select>
                    </div>
                  )}

                  {/* Foto */}
                  {role === "Admin" && (
                    <div className="space-y-1">
                      <label>
                        <strong>Foto:</strong>
                        <input
                          type="file"
                          name="foto"
                          accept="image/png, image/jpeg, image/jpg, image/gif"
                          onChange={handleFileChange}
                          // value={formData?.foto || ""}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                      </label>
                    </div>
                  )}

                  {role === "Admin" && formData?.foto && !selectedFile && (
                    <Image
                      src={`https://backend-cv.nusantaratranssentosa.co.id/storage/${formData.foto}`}
                      alt="Uploaded Preview"
                      width={300}
                      height={200}
                      className="rounded-md object-cover"
                    />
                  )}
                  {role === "Admin" && selectedFile && (
                    <Image
                      src={URL.createObjectURL(selectedFile)}
                      alt="New Preview"
                      width={300}
                      height={200}
                      className="rounded-md object-cover"
                    />
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
