import React from "react";
import { axios } from "../Common/Constants";
import { useAuth } from "../Common/AuthContext";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <button
      onClick={async (e) => {
        console.log("flag");
        try {
          const res = await axios.get("/auth/logout");
          console.log({ data: res.data });
          logout();
          navigate("/");
        } catch (error) {
          console.log(error);
        }
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
