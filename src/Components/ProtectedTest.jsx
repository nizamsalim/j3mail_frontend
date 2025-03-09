import React from "react";
import { axios } from "../Common/Constants";

function ProtectedTest() {
  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        try {
          const res = await axios.get("/protected");
          console.log({ data: res.data });
        } catch (error) {
          console.log(error);
        }
      }}
    >
      ProtectedTest
    </button>
  );
}

export default ProtectedTest;
