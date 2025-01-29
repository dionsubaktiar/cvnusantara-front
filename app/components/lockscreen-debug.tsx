import { useState } from "react";
import axios from "axios";

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreenDebug = ({ onUnlock }: LockScreenProps) => {
  const [pin, setPin] = useState<string>("");

  const handleUnlock = async () => {
    try {
      await axios.get(
        "https://backend-cv.nusantaratranssentosa.co.id/sanctum/csrf-cookie",
        {
          withCredentials: true,
        }
      );
      const response = await axios.post(
        "https://backend-cv.nusantaratranssentosa.co.id/api/pin-verify",
        { pin },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token); // Save token
        onUnlock(); // Unlock the screen
      } else {
        alert("Invalid PIN. Please try again.");
      }
    } catch (error) {
      console.error("Unlock failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className=" p-4 rounded shadow border-2">
        <h2 className="text-lg font-bold mb-4">Enter PIN to Unlock</h2>
        <input
          type="password"
          className="border p-2 mb-4 rounded w-full text-black"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleUnlock}
        >
          Unlock
        </button>
      </div>
    </div>
  );
};

export default LockScreenDebug;
