// CreateDataButton.tsx
import { useState } from "react";
import CreateDataModalDebug from "./createModal-debug";

interface CreateDataButtonProps {
  onCreate: () => void; // Function to fetch data
}

const CreateDataDebug: React.FC<CreateDataButtonProps> = ({ onCreate }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Open and close modal
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* Button to open modal, floated on the right side */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all p-2 flex justify-center items-center text-md"
      >
        Buat data
      </button>

      {/* Modal with form */}
      <CreateDataModalDebug
        isOpen={isOpen}
        closeModal={closeModal}
        onCreate={onCreate}
      />
    </div>
  );
};

export default CreateDataDebug;
