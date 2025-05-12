import React from "react";
import { LifeLine } from "react-loading-indicators";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="flex justify-center items-center">
        <LifeLine color="#312ecb" size="large" text="" textColor="" />
        <LifeLine color="#312ecb" size="large" text="" textColor="" />
      </div>

      <p className="fade-text">Limitless Care with Infinite Possibilities</p>
    </div>
  );
};

export default Loader;
