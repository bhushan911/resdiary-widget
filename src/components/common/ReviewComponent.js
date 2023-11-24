"use client";
import React, { useContext } from "react";
import { BookingContext } from "../../contexts/BookingContext";

function ReviewComponent() {
  const { partySize, selectedTime, selectedDate } = useContext(BookingContext);
  const date = selectedDate.toISOString().split("T")[0];

  return (
    // <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
    <div className="bg-white  rounded  px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex-1 mb-4 md:mb-0">
          <h1 className="text-xlg font-bold text-gray-900 mb-2">DRG</h1>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-semibold text-gray-700">{date}</span>
          <span className="mx-2 text-gray-700 font-bold ">|</span>
          <span className="font-semibold text-gray-700">{partySize}</span>
          <span className="mx-2 text-gray-700 font-bold">|</span>
          <span className="font-semibold text-gray-700">{selectedTime}</span>
        </div>
      </div>
    </div>
  );
}

export default ReviewComponent;
