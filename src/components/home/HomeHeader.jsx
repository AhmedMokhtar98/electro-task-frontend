import React from "react";

const HomeHeader = () => {
  return (
    <div className="flex items-center justify-between py-5">
      <div>
        <h2 className={`text-2xl font-semibold flex items-center gap-2 text-[var(--primary-color)]`} >
          Welcome Back, Mokhtar
        </h2>
        <p className={`text-xs`}>
          Here's what's happening with your store today.
        </p>
      </div>
    </div>
  );
};

export default HomeHeader;
