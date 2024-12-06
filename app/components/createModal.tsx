import React, { useState } from "react";
import axios from "axios";

interface CreateDataModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onCreate: () => void; // Function to fetch data
}

const CreateDataModal: React.FC<CreateDataModalProps> = ({
  isOpen,
  closeModal,
  onCreate,
}) => {
  const [formData, setFormData] = useState<{
    tanggal: string;
    nopol: string;
    origin: string;
    destinasi: string;
    uj: number;
    harga: number;
    status: string;
  }>({
    tanggal: "",
    nopol: "",
    origin: "",
    destinasi: "",
    uj: 0,
    harga: 0,
    status: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "uj" || name === "harga" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.get(
        "https://cvnusantara.nusantaratranssentosa.co.id/sanctum/csrf-cookie",
        { withCredentials: true }
      );
      await axios.post(
        "https://cvnusantara.nusantaratranssentosa.co.id/api/data",
        formData,
        { withCredentials: true }
      );
      onCreate(); // Call fetchDatas to refresh data
      closeModal(); // Close the modal
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        {/* Form fields for data entry */}
        <input
          type="text"
          name="tanggal"
          onChange={handleChange}
          placeholder="Tanggal"
          required
        />
        <input
          type="text"
          name="nopol"
          onChange={handleChange}
          placeholder="Nopol"
          required
        />
        <input
          type="text"
          name="origin"
          onChange={handleChange}
          placeholder="Origin"
          required
        />
        <input
          type="text"
          name="destinasi"
          onChange={handleChange}
          placeholder="Destinasi"
          required
        />
        <input
          type="number"
          name="uj"
          onChange={handleChange}
          placeholder="UJ"
          required
        />
        <input
          type="number"
          name="harga"
          onChange={handleChange}
          placeholder="Harga"
          required
        />
        <select name="status" onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Lunas">Lunas</option>
          <option value="Pending">Pending</option>
          <option value="Gagal">Gagal</option>
        </select>
        <button type="submit">Create</button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateDataModal;
