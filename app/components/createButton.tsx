"use client";

import { useState } from "react";
import CreateDataModal from "./createModal";
import { IoAdd } from "react-icons/io5";

const CreateDataButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Open and close modal
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* Button to open modal, floated on the right side */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 px-4 py-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
      >
        <IoAdd></IoAdd>
      </button>

      {/* Modal with form */}
      <CreateDataModal isOpen={isOpen} closeModal={closeModal} />
    </div>
  );
};

export default CreateDataButton;
