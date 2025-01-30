"use client";

import axios from "axios";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await axios.get(
        "https://backend-cv.nusantaratranssentosa.co.id/sanctum/csrf-cookie"
        // {
        //   withCredentials: true,
        // }
      );
      const response = await axios.post(
        "https://backend-cv.nusantaratranssentosa.co.id/api/lockscreen"
        // { withCredentials: true }
      );

      if (response.data.success == true) {
        localStorage.clear();
      } else {
        alert("Invalid PIN. Please try again.");
      }
    } catch (error) {
      console.error("Unlock failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
