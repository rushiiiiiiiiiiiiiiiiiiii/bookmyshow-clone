import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "https://bookmyshow-backend-mzd2.onrender.com";
axios.defaults.withCredentials = true;

const SetupName = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      await axios.post(
        "/auth/set-name",
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Welcome!");
      navigate("/");
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-xl font-bold mb-3">Enter your name</h2>

        <input
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />

        <button
          className="bg-[#f84464] text-white w-full mt-3 p-2 rounded hover:bg-[#e43a57]"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SetupName;
