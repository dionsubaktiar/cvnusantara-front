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
  status_sj: string;
  created_at: string | null;
  updated_at: string;
}

interface EditDataProps {
  id: number;
  closeModal: () => void;
  onUpdate: () => void;
}

const EditAdmin: React.FC<EditDataProps> = ({ id, closeModal, onUpdate }) => {
  const [formData, setFormData] = useState<DataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await axios.get(
          "https://backend-cv.nusantaratranssentosa.co.id/sanctum/csrf-cookie"
        );
        const response = await axios.get<DataResponse>(
          `https://backend-cv.nusantaratranssentosa.co.id/api/data/${id}`
        );
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData!,
      status_sj: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://backend-cv.nusantaratranssentosa.co.id/api/data/${id}`,
        { status_sj: formData?.status_sj }
        // { withCredentials: true }
      );
      onUpdate();
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to update data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-left">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="text-lg font-medium text-black">
                Edit Data
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-black text-left">
                    <strong>Tanggal:</strong>
                  </label>
                  <input
                    type="date"
                    value={formData?.tanggal || ""}
                    disabled
                    className="w-full text-black border p-2 rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-black">
                    <strong>Nopol:</strong>
                  </label>
                  <input
                    type="text"
                    value={formData?.nopol || ""}
                    disabled
                    className="w-full text-black border p-2 rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-black">
                    <strong>Driver:</strong>
                  </label>
                  <input
                    type="text"
                    value={formData?.driver || ""}
                    disabled
                    className="w-full text-black border p-2 rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-black">
                    <strong>Origin:</strong>
                  </label>
                  <input
                    type="text"
                    value={formData?.origin || ""}
                    disabled
                    className="w-full text-black border p-2 rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-black">
                    <strong>Destinasi:</strong>
                  </label>
                  <input
                    type="text"
                    value={formData?.destinasi || ""}
                    disabled
                    className="w-full text-black border p-2 rounded-md"
                  />
                </div>
                {/* Dropdown Status SJ */}
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
                <div className="flex justify-end gap-2">
                  <Button type="submit" color="success">
                    Save
                  </Button>
                  <Button onClick={closeModal} color="danger">
                    Cancel
                  </Button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditAdmin;
