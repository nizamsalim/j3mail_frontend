import React from "react";
import CircleLoader from "react-spinners/ClipLoader";

function Loader({ isLoading }) {
  return <CircleLoader loading={isLoading} size={19} />;
}

export default Loader;
