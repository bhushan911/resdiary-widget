import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-auto my-10">
      <div className=" animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <div className="my-4">
        <span className="font-semibold text-base">
          Your Booking is in process...
        </span>
      </div>
    </div>
  );
};

export default Loading;
